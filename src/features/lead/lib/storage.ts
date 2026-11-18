import { randomBytes, createHash } from "node:crypto";
import {
  mkdir,
  open,
  readFile,
  rename,
  rm,
  stat,
  appendFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, isAbsolute, join, resolve, sep } from "node:path";

const LOCK_TIMEOUT_MS = 5_000;
const LOCK_STALE_MS = 2 * 60 * 1_000;
const LOCK_RETRY_MS = 40;
const PENDING_TTL_SECONDS = 120;

export type RateLimit = readonly [limit: number, windowSeconds: number];
export type FingerprintClaim = "claimed" | "pending" | "sent";

interface FingerprintEntry {
  state: "pending" | "sent";
  at: number;
}

const sleep = (milliseconds: number) =>
  new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));

export async function getStorageDirectory(configuredPath: string | null) {
  const fallback = join(tmpdir(), "green-key-leads");
  const candidate =
    configuredPath && isAbsolute(configuredPath)
      ? resolve(/* turbopackIgnore: true */ configuredPath)
      : fallback;
  const publicDirectory = resolve(process.cwd(), "public");

  const isInsidePublic =
    candidate === publicDirectory ||
    candidate.startsWith(`${publicDirectory}${sep}`);
  const safeCandidate = isInsidePublic ? fallback : candidate;

  try {
    await mkdir(safeCandidate, { recursive: true, mode: 0o700 });
    return safeCandidate;
  } catch {
    await mkdir(fallback, { recursive: true, mode: 0o700 });
    return fallback;
  }
}

async function withFileLock<T>(filePath: string, operation: () => Promise<T>) {
  const lockPath = `${filePath}.lock`;
  const startedAt = Date.now();
  let locked = false;

  while (!locked) {
    try {
      await mkdir(lockPath, { mode: 0o700 });
      locked = true;
    } catch (error) {
      if (!isNodeError(error, "EEXIST")) throw error;

      try {
        const lockInfo = await stat(lockPath);
        if (Date.now() - lockInfo.mtimeMs > LOCK_STALE_MS) {
          await rm(lockPath, { recursive: true, force: true });
          continue;
        }
      } catch (statError) {
        if (isNodeError(statError, "ENOENT")) continue;
      }

      if (Date.now() - startedAt >= LOCK_TIMEOUT_MS) {
        throw new Error("Storage lock timeout");
      }

      await sleep(LOCK_RETRY_MS);
    }
  }

  try {
    return await operation();
  } finally {
    await rm(lockPath, { recursive: true, force: true }).catch(() => {});
  }
}

function isNodeError(
  error: unknown,
  code: string,
): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error && error.code === code;
}

async function readJson<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const content = await readFile(filePath, "utf8");
    return JSON.parse(content) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonAtomically(filePath: string, value: unknown) {
  await mkdir(dirname(filePath), { recursive: true, mode: 0o700 });
  const temporaryPath = `${filePath}.${process.pid}.${randomBytes(4).toString("hex")}.tmp`;
  const handle = await open(temporaryPath, "wx", 0o600);

  try {
    await handle.writeFile(JSON.stringify(value), "utf8");
    await handle.sync();
  } finally {
    await handle.close();
  }

  await rename(temporaryPath, filePath);
}

export async function checkRateLimit(
  directory: string,
  key: string,
  limits: readonly RateLimit[],
  now: number,
) {
  const filePath = join(
    directory,
    `rate_${createHash("sha256").update(key).digest("hex")}.json`,
  );

  try {
    return await withFileLock(filePath, async () => {
      const stored = await readJson<unknown>(filePath, []);
      const maxWindow = Math.max(...limits.map(([, window]) => window));
      const hits = Array.isArray(stored)
        ? stored.filter(
            (timestamp): timestamp is number =>
              Number.isInteger(timestamp) && timestamp > now - maxWindow,
          )
        : [];

      let retryAfter = 0;

      for (const [limit, window] of limits) {
        const inWindow = hits.filter((timestamp) => timestamp > now - window);
        if (inWindow.length >= limit) {
          retryAfter = Math.max(
            retryAfter,
            Math.min(...inWindow) + window - now,
          );
        }
      }

      if (retryAfter > 0) {
        return { allowed: false, retryAfter };
      }

      hits.push(now);
      await writeJsonAtomically(filePath, hits);

      return { allowed: true, retryAfter: 0 };
    });
  } catch {
    // If storage is unavailable, do not silently discard a real lead.
    return { allowed: true, retryAfter: 0 };
  }
}

function parseFingerprintEntry(value: unknown): FingerprintEntry | null {
  if (Number.isInteger(value)) {
    return { state: "sent", at: value as number };
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "state" in value &&
    "at" in value &&
    (value.state === "pending" || value.state === "sent") &&
    Number.isInteger(value.at)
  ) {
    return { state: value.state, at: value.at as number };
  }

  return null;
}

export async function claimFingerprint(
  directory: string,
  fingerprint: string,
  windowSeconds: number,
  now: number,
): Promise<FingerprintClaim> {
  const filePath = join(directory, "seen.json");

  try {
    return await withFileLock(filePath, async () => {
      const stored = await readJson<Record<string, unknown>>(filePath, {});
      const seen: Record<string, FingerprintEntry> = {};

      Object.entries(stored).forEach(([key, value]) => {
        const entry = parseFingerprintEntry(value);
        if (!entry) return;

        const ttl =
          entry.state === "pending"
            ? Math.min(windowSeconds, PENDING_TTL_SECONDS)
            : windowSeconds;

        if (entry.at > now - ttl) seen[key] = entry;
      });

      const existing = seen[fingerprint];
      if (existing) {
        return existing.state;
      }

      seen[fingerprint] = { state: "pending", at: now };
      await writeJsonAtomically(filePath, seen);
      return "claimed";
    });
  } catch {
    // The fingerprint is an anti-duplicate guard, not a reason to lose a lead.
    return "claimed";
  }
}

export async function markFingerprintSent(
  directory: string,
  fingerprint: string,
  now: number,
) {
  await updateFingerprint(directory, fingerprint, { state: "sent", at: now });
}

export async function releaseFingerprint(
  directory: string,
  fingerprint: string,
) {
  await updateFingerprint(directory, fingerprint, null);
}

async function updateFingerprint(
  directory: string,
  fingerprint: string,
  value: FingerprintEntry | null,
) {
  const filePath = join(directory, "seen.json");

  try {
    await withFileLock(filePath, async () => {
      const stored = await readJson<Record<string, unknown>>(filePath, {});
      if (value) stored[fingerprint] = value;
      else delete stored[fingerprint];
      await writeJsonAtomically(filePath, stored);
    });
  } catch {
    // Sending result is authoritative; logging/locking must not rewrite it.
  }
}

export async function writeLeadLog(
  directory: string,
  row: Record<string, unknown>,
) {
  try {
    await appendFile(join(directory, "lead.log"), `${JSON.stringify(row)}\n`, {
      encoding: "utf8",
      mode: 0o600,
    });
  } catch {
    // The log is diagnostic only and never blocks a lead.
  }
}
