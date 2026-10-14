### Role & Objective
Act as a Senior Full-Stack TypeScript Engineer. I need to architect and implement a production-grade, end-to-end type-safe contact form for my portfolio.

**My Tech Stack:**
- **Stack:** BHVR (Bun, Hono, Vite, React) + TypeScript
- **Hosting:** Vercel (Vite static build + Hono mounted as a Vercel Serverless Function via `hono/vercel`)
- **Email Provider:** Resend SDK (`resend`)
- **Validation:** Zod + `@hono/zod-validator`

Do not provide a basic tutorial setup. Build a resilient, production-ready backend architecture that protects my free-tier quotas, enforces strict middleware security, and leverages Hono RPC (`hc`) for end-to-end type safety between my React frontend and Hono backend.

### Platform Limits & Architectural Constraints to Account For
1. **Runtime Compatibility (Bun Local -> Vercel Production):** Even though I use Bun locally, Vercel executes serverless functions on Node.js/Edge runtimes. Do NOT use `Bun.serve()` or Bun-specific runtime APIs (`Bun.env`) in the Hono entry point. Use standard Web APIs, `process.env` (or Hono's `env(c)` helper), and export the handler using `handle(app)` from `hono/vercel`.
2. **Resend Free-Tier Protection (100 emails/day, 2 req/sec):** A single bot wave can exhaust my daily email quota in under a minute. The Hono middleware chain must filter out spam, oversized payloads, and unauthorized origins *before* invoking the Resend SDK.
3. **DMARC/SPF Deliverability:** Send `from` my verified domain address (e.g., `Portfolio <contact@yourdomain.com>` via env vars) and map the visitor's submitted email address to the `replyTo` field.
4. **End-to-End Type Safety (Hono RPC):** Chain the Hono route definitions and export `export type AppType = typeof routes` so my Vite + React frontend can consume the endpoint via `hc<AppType>()` with full TypeScript inference.

### Core Architectural Focus Areas

1. **Shared Zod Schema (`shared/schemas/contact.ts`):**
   - Fields: `name` (2–60 chars, trimmed), `email` (valid email, max 100 chars), `subject` (5–120 chars, trimmed), `message` (10–2000 chars, trimmed), and `_gotcha` (optional string, max 0 chars expected—used as a honeypot).
   - Sanitize/escape HTML tags in strings to prevent HTML injection in my inbox.

2. **Hono Middleware Defense Layer:**
   - **Body Size Limit:** Use `bodyLimit` from `hono/body-limit` to cap incoming requests at `16kb` (preventing payload DoS).
   - **CORS & Origin Guard:** Use `cors` from `hono/cors` locked to my production domain (`ALLOWED_ORIGIN` env var) and localhost during development.
   - **Honeypot Silent Trap:** If `_gotcha` is non-empty, short-circuit and return a fake `200 OK` `{ success: true, message: "Message sent!" }` without calling Resend so bots assume their spam worked.
   - **Modular Rate Limiter:** Create a lightweight Hono middleware that extracts the client IP from Vercel's `x-forwarded-for` header and enforces a rate limit (e.g., max 3 submissions per IP per 15 minutes), structured cleanly so I can swap in `@upstash/ratelimit` if needed.

3. **Resend Dispatch & Idempotency:**
   - Use the `resend` SDK inside the `/api/contact` POST route.
   - Generate a deterministic `Idempotency-Key` (e.g., hashing the sender's email + subject + current 5-minute time window using Web Crypto `crypto.subtle`) so accidental double-clicks or network retries never burn two Resend credits.
   - Format a clean, scannable HTML email body containing the sender's Name, Email, Subject, Message (with preserved line breaks), Timestamp, and Sender IP.

4. **Zero-Leakage Error Handling:**
   - Standardize JSON responses: `{ success: boolean, message: string, errors?: Record<string, string[]> }`.
   - Custom hook in `zValidator` to return clean `422 Unprocessable Entity` field errors on validation failure.
   - Catch Resend SDK errors server-side, log them for Vercel Runtime Logs, and return a masked `500` or `429` error to the client.

### Deliverables Requested
1. **Project Structure & `vercel.json`:** Show how the Hono serverless entrypoint (`api/[[...route]].ts`) coexists with the Vite React build on Vercel.
2. **Shared Zod Schema:** The exact validation and sanitization schema.
3. **Hono Backend (`api/[[...route]].ts`):** Complete middleware chain, route chaining for RPC, honeypot check, idempotency hash, and Resend dispatch.
4. **React Frontend Integration:** A custom hook or component using `hono/client` (`hc<AppType>`) demonstrating type-safe submission, loading states, and error handling.