# Security and code-quality audit

Date: 2026-11-19

## Applied hardening

- Lead submission is processed only by `POST /api/send-lead`.
- `GET` returns `405`; `OPTIONS` is side-effect-free and returns `204`.
- The lead endpoint requires `application/json`, enforces a streaming request-body limit,
  checks the request origin against an allowlist, validates consent on the server,
  sanitizes fields, rate-limits, de-duplicates, and keeps logs outside `public/`.
- The endpoint remains disabled by default. No SMTP credentials or real secrets are
  committed; `.env.example` contains placeholders only.
- SMTP envelope addresses are validated before use in protocol commands. The EHLO
  identifier is fixed rather than built from environment-controlled host strings.
- Added CSP, HSTS, frame/content-type/referrer and permissions-policy headers.
- JSON-LD values are escaped for an inline script context.
- Protected lead payload fields cannot be overwritten by optional form metadata.
- Links opening a new tab explicitly use `noopener noreferrer`.

## Dependency security review

- Installed Next.js: `16.4.6`.
- The official Next.js October security release lists `16.4.1` as the fixed 16.4 line
  for the upstream critical issues; the November release lists `16.4.5` as the fixed
  16.4 line. This project is on `16.4.6`.
- The React RSC advisories list `19.3.0` as affected for the standalone
  `react-server-dom-*` packages and `19.3.1` as patched. This project does not install
  those packages directly; Next.js ships its own bundled RSC runtime and the installed
  Next.js framework version is beyond the vendor's fixed release.
- `npm audit` could not reach `registry.npmjs.org` in this environment (DNS/network
  unavailable). Therefore a live audit of every transitive package could not be
  completed here. Re-run `npm audit` after installing on a machine with registry access.

## Remaining deployment controls

- Keep `GREENKEY_LEAD_ENABLED=false` until SMTP and production storage are configured
  and tested.
- Set `GREENKEY_TRUST_PROXY=true` only when the production reverse proxy overwrites
  and normalizes client IP headers. Do not trust client-supplied forwarding headers.
- Serve the production site over HTTPS.
- Store SMTP credentials only in the deployment secret manager/environment, never in
  source control or `public/`.
- The current file-based rate-limit/deduplication storage is suitable for a single
  persistent Node process. For horizontally scaled/serverless deployment, move this
  state to shared durable storage (for example Redis or a database).

## Code quality and verification

- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed on Next.js 16.4.6 with Turbopack in a clean isolated copy.
- Production smoke tests: `/`, `/calculator`, `/gallery`, `/privacy` returned HTTP 200;
  `GET /api/send-lead` returned 405; `OPTIONS /api/send-lead` returned 204;
  `POST /api/send-lead` returned 503 `disabled` as intentionally configured.
- Security headers were present in the production smoke-test responses.

## Final review update - 2026-11-19

- Production `next build --webpack`: passed after the final UI, modal and SEO changes.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- Production smoke tests: `/`, `/calculator`, `/gallery`, `/privacy`,
  `/robots.txt` and `/sitemap.xml` returned HTTP 200.
- API smoke tests: `GET /api/send-lead` returned 405, `OPTIONS` returned 204,
  and `POST` returned 503 `disabled` as expected.
- Security response headers were present on the production responses.
- The development CSP now adds `unsafe-eval` only in development, for Next.js
  development diagnostics. The production CSP does not include `unsafe-eval`.
- Home lead modals now render through a body portal. This keeps the modal outside
  the inert background subtree, so focus management does not accidentally disable
  the modal along with the page behind it.
- New-tab links were checked and use `rel="noopener noreferrer"`.
- The only `dangerouslySetInnerHTML` uses are JSON-LD blocks whose serialized values
  escape `<` before insertion.
- No `.env` secret file is present in the project; only `.env.example` is included.

### Remaining verification limit

`npm audit` was attempted, but the environment could not resolve
`registry.npmjs.org` (`EAI_AGAIN`). A complete live audit of transitive npm
dependencies therefore remains unverified. Run `npm audit` on a machine with
registry access before production deployment.
