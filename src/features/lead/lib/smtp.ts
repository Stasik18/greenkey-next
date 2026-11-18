import { connect as connectNet, type Socket } from "node:net";
import {
  connect as connectTls,
  type ConnectionOptions,
  type TLSSocket,
} from "node:tls";
import type { LeadConfig } from "../model/config";
import { LEAD_VERSION } from "./sanitize";

type SmtpSocket = Socket | TLSSocket;

class SmtpSession {
  private buffer = "";
  private responseLines: string[] = [];
  private queuedResponses: string[] = [];
  private waiters: Array<{
    resolve: (response: string) => void;
    reject: (error: Error) => void;
  }> = [];
  private failure: Error | null = null;

  private readonly onData = (chunk: Buffer) => {
    this.buffer += chunk.toString("utf8");

    while (true) {
      const newlineIndex = this.buffer.indexOf("\n");
      if (newlineIndex === -1) break;

      const line = this.buffer.slice(0, newlineIndex).replace(/\r$/, "");
      this.buffer = this.buffer.slice(newlineIndex + 1);
      this.responseLines.push(line);

      if (/^\d{3} /.test(line)) {
        this.pushResponse(this.responseLines.join("\r\n"));
        this.responseLines = [];
      }
    }
  };

  private readonly onError = (error: Error) => {
    this.failure = error;
    this.waiters.splice(0).forEach((waiter) => waiter.reject(error));
  };

  private readonly onClose = () => {
    if (this.failure) return;
    this.failure = new Error("SMTP connection closed unexpectedly");
    this.waiters.splice(0).forEach((waiter) => waiter.reject(this.failure!));
  };

  constructor(private readonly socket: SmtpSocket) {
    socket.on("data", this.onData);
    socket.on("error", this.onError);
    socket.on("close", this.onClose);
  }

  private pushResponse(response: string) {
    const waiter = this.waiters.shift();
    if (waiter) waiter.resolve(response);
    else this.queuedResponses.push(response);
  }

  readResponse() {
    const queued = this.queuedResponses.shift();
    if (queued) return Promise.resolve(queued);
    if (this.failure) return Promise.reject(this.failure);

    return new Promise<string>((resolve, reject) => {
      this.waiters.push({ resolve, reject });
    });
  }

  async command(value: string) {
    this.socket.write(`${value}\r\n`);
    return this.readResponse();
  }

  write(value: string) {
    this.socket.write(value);
  }

  detach() {
    this.socket.off("data", this.onData);
    this.socket.off("error", this.onError);
    this.socket.off("close", this.onClose);
  }

  close() {
    this.detach();
    this.socket.end();
  }

  destroy() {
    this.detach();
    this.socket.destroy();
  }
}

function finalResponseCode(response: string) {
  const lines = response.split(/\r?\n/).filter(Boolean);
  return lines.at(-1)?.slice(0, 3) ?? "";
}

function expectCode(response: string, expected: string, step: string) {
  const actual = finalResponseCode(response);
  if (actual !== expected) {
    throw new Error(`SMTP ${step}: ${response.slice(0, 240).trim()}`);
  }
}

function encodeHeader(value: string) {
  return `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;
}

function waitForSocket(
  socket: Socket,
  eventName: "connect" | "secureConnect",
  timeoutMs: number,
) {
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup();
      socket.destroy();
      reject(new Error("SMTP connection timeout"));
    }, timeoutMs);

    const onReady = () => {
      cleanup();
      resolve();
    };
    const onError = (error: Error) => {
      cleanup();
      reject(error);
    };
    const cleanup = () => {
      clearTimeout(timer);
      socket.off(eventName, onReady);
      socket.off("error", onError);
    };

    socket.once(eventName, onReady);
    socket.once("error", onError);
  });
}

async function connectSecureSession(config: LeadConfig) {
  const { host, port, secure, timeoutMs } = config.smtp;

  if (secure === "ssl") {
    const options: ConnectionOptions = {
      host,
      port,
      servername: host,
      rejectUnauthorized: true,
      minVersion: "TLSv1.2",
    };
    const socket = connectTls(options);
    socket.setTimeout(timeoutMs, () =>
      socket.destroy(new Error("SMTP timeout")),
    );
    await waitForSocket(socket, "secureConnect", timeoutMs);
    return new SmtpSession(socket);
  }

  const socket = connectNet({ host, port });
  socket.setTimeout(timeoutMs, () => socket.destroy(new Error("SMTP timeout")));
  await waitForSocket(socket, "connect", timeoutMs);

  let session = new SmtpSession(socket);
  const greeting = await session.readResponse();
  expectCode(greeting, "220", "greeting");

  const hello = await session.command(`EHLO greenkey.local`);
  expectCode(hello, "250", "EHLO");

  const startTls = await session.command("STARTTLS");
  expectCode(startTls, "220", "STARTTLS");
  session.detach();

  const tlsSocket = connectTls({
    socket,
    servername: host,
    rejectUnauthorized: true,
    minVersion: "TLSv1.2",
  });
  tlsSocket.setTimeout(timeoutMs, () =>
    tlsSocket.destroy(new Error("SMTP timeout")),
  );
  await waitForSocket(tlsSocket, "secureConnect", timeoutMs);
  session = new SmtpSession(tlsSocket);

  return session;
}

function dotStuff(value: string) {
  return value
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => (line.startsWith(".") ? `.${line}` : line))
    .join("\r\n");
}

export async function sendLeadEmail(
  config: LeadConfig,
  subject: string,
  body: string,
): Promise<{ ok: boolean; detail: string }> {
  const { host, username, password, secure } = config.smtp;

  if (!host || !username || !password) {
    return {
      ok: false,
      detail: "SMTP host/user/password are not configured",
    };
  }

  const isSafeEmail = (value: string) =>
    /^[^\\s<>@\\r\\n]+@[^\\s<>@\\r\\n]+\\.[^\\s<>@\\r\\n]+$/.test(value);

  if (!isSafeEmail(config.recipient) || !isSafeEmail(config.sender)) {
    return { ok: false, detail: "Invalid recipient or sender address" };
  }

  let session: SmtpSession | null = null;

  try {
    session = await connectSecureSession(config);

    // SSL sessions start with the greeting; STARTTLS sessions already consumed it.
    if (secure === "ssl") {
      const greeting = await session.readResponse();
      expectCode(greeting, "220", "greeting");
    }

    const hello = await session.command(`EHLO greenkey.local`);
    expectCode(hello, "250", "EHLO");

    const auth = await session.command("AUTH LOGIN");
    expectCode(auth, "334", "AUTH LOGIN");

    const usernameResponse = await session.command(
      Buffer.from(username, "utf8").toString("base64"),
    );
    expectCode(usernameResponse, "334", "username");

    const passwordResponse = await session.command(
      Buffer.from(password, "utf8").toString("base64"),
    );
    expectCode(passwordResponse, "235", "password");

    const senderResponse = await session.command(
      `MAIL FROM:<${config.sender}>`,
    );
    expectCode(senderResponse, "250", "MAIL FROM");

    const recipientResponse = await session.command(
      `RCPT TO:<${config.recipient}>`,
    );
    expectCode(recipientResponse, "250", "RCPT TO");

    const dataResponse = await session.command("DATA");
    expectCode(dataResponse, "354", "DATA");

    const headers = [
      `To: ${config.recipient}`,
      `From: ${encodeHeader(config.senderName)} <${config.sender}>`,
      `Reply-To: ${encodeHeader(config.senderName)} <${config.sender}>`,
      `Subject: ${encodeHeader(subject)}`,
      `Date: ${new Date().toUTCString()}`,
      "MIME-Version: 1.0",
      "Content-Type: text/plain; charset=UTF-8",
      "Content-Transfer-Encoding: 8bit",
      `X-Mailer: green-key-lead/${LEAD_VERSION}`,
      "Auto-Submitted: auto-generated",
    ];
    const message = `${headers.join("\r\n")}\r\n\r\n${dotStuff(body)}\r\n.\r\n`;

    session.write(message);
    const sentResponse = await session.readResponse();
    expectCode(sentResponse, "250", "message accepted");

    await session.command("QUIT").catch(() => "");
    session.close();

    return { ok: true, detail: `Accepted by SMTP server ${host}` };
  } catch (error) {
    session?.destroy();
    return {
      ok: false,
      detail: error instanceof Error ? error.message : "Unknown SMTP error",
    };
  }
}
