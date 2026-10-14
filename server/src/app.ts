import { Hono, type Env } from "hono";
import { cors } from "hono/cors";
import { bodyLimit } from "hono/body-limit";
import { zValidator } from "@hono/zod-validator";
import { Resend } from "resend";
import { contactFormSchema } from "shared";
import { createRateLimitMiddleware, getClientIp } from "./rate-limiter";
import { renderContactEmailHtml } from "./email-template";
import fs from "node:fs";
import path from "node:path";

// Guarantee .env is loaded even when running from server/ subdirectory
function loadEnvFallback() {
  if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "your_resend_api_key_here") {
    return;
  }
  const possiblePaths = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), "../.env"),
    path.resolve(__dirname, "../../.env"),
  ];
  for (const envPath of possiblePaths) {
    try {
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, "utf-8");
        for (const line of content.split(/\r?\n/)) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("#")) continue;
          const eqIdx = trimmed.indexOf("=");
          if (eqIdx !== -1) {
            const key = trimmed.slice(0, eqIdx).trim();
            const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
            process.env[key] = val;
          }
        }
        if (process.env.RESEND_API_KEY) {
          console.log(`[Contact API] 📄 Loaded environment from ${envPath}`);
          break;
        }
      }
    } catch {}
  }
}
loadEnvFallback();

export const app = new Hono<Env>().basePath("/api");

// 1. Body Size Limit: 16kb maximum payload to prevent DoS attacks
app.use(
  "*",
  bodyLimit({
    maxSize: 16 * 1024,
    onError: (c) => {
      return c.json(
        {
          success: false,
          code: "PAYLOAD_TOO_LARGE",
          message:
            "Your message is a bit too long to send at once. Please shorten it or reach out to me directly by email.",
          showDirectEmailFallback: true,
        },
        413
      );
    },
  })
);

// 2. CORS & Origin Guard
const allowedOrigins = (
  process.env.ALLOWED_ORIGIN ||
  "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  "*",
  cors({
    origin: (origin) => {
      if (!origin) return "*";
      if (
        allowedOrigins.includes(origin) ||
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:") ||
        origin.endsWith(".vercel.app")
      ) {
        return origin;
      }
      return allowedOrigins[0] || "*";
    },
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "Idempotency-Key"],
  })
);

/**
 * Computes a deterministic SHA-256 hash using the Web Crypto API
 * based on email, subject, and a 5-minute time bucket to prevent duplicate sends.
 */
async function computeIdempotencyKey(
  email: string,
  subject: string
): Promise<string> {
  const fiveMinuteBucket = Math.floor(Date.now() / (5 * 60 * 1000));
  const raw = `${email.toLowerCase()}:${subject}:${fiveMinuteBucket}`;
  const encoded = new TextEncoder().encode(raw);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// 3. Rate limiter applied to contact endpoint
app.use("/contact", createRateLimitMiddleware());

// 4. Chained routes for full Hono RPC type inference
export const routes = app
  .get("/health", (c) => {
    return c.json({
      success: true,
      message: "Contact API is operational",
      timestamp: new Date().toISOString(),
    });
  })
  .post(
    "/contact",
    zValidator("json", contactFormSchema, (result, c) => {
      if (!result.success) {
        const fieldErrors: Record<string, string[]> = {};
        for (const issue of result.error.issues) {
          const key = issue.path.join(".") || "form";
          if (!fieldErrors[key]) fieldErrors[key] = [];
          fieldErrors[key].push(issue.message);
        }

        return c.json(
          {
            success: false,
            code: "VALIDATION_ERROR",
            message: "Please double-check the highlighted fields above and try again.",
            fieldErrors,
          },
          422
        );
      }
    }),
    async (c) => {
      const payload = c.req.valid("json");
      const clientIp = getClientIp(c);

      // HONEYPOT SILENT TRAP:
      // If _gotcha was filled, silently pretend success to discard bot spam
      if (payload._gotcha && payload._gotcha.trim().length > 0) {
        console.warn(`[Telemetry: Bot Filtered] Honeypot triggered from IP ${clientIp}`);
        return c.json(
          {
            success: true,
            message: "Thank you! Your message has been sent.",
          },
          200
        );
      }

      const rawApiKey = (process.env.RESEND_API_KEY || "").trim().replace(/^["']|["']$/g, "");
      if (!rawApiKey || rawApiKey === "your_resend_api_key_here") {
        console.error("[Telemetry: Contact Failure]", {
          timestamp: new Date().toISOString(),
          errorCode: "MISSING_CONFIG",
          diagnosticMessage: "Missing or placeholder RESEND_API_KEY in environment",
          clientIp,
        });
        return c.json(
          {
            success: false,
            code: "SERVICE_UNAVAILABLE",
            message:
              "I'm having trouble receiving messages through the form right now. Please feel free to email me directly!",
            showDirectEmailFallback: true,
          },
          503
        );
      }

      const resend = new Resend(rawApiKey);
      const toEmail = (
        process.env.CONTACT_RECIPIENT_EMAIL || "seannpatrick25@gmail.com"
      )
        .trim()
        .replace(/^["']|["']$/g, "");
      const fromEmail = (
        process.env.CONTACT_FROM_EMAIL ||
        "Portfolio Contact <onboarding@resend.dev>"
      )
        .trim()
        .replace(/^["']|["']$/g, "");

      console.log(
        `[Contact API] 📥 Incoming message from "${payload.name}" <${payload.email}> | Subject: "${payload.subject}"`
      );

      try {
        // Deterministic idempotency key to prevent double charging on retry
        const idempotencyKey = await computeIdempotencyKey(
          payload.email,
          payload.subject
        );

        const htmlContent = renderContactEmailHtml({
          name: payload.name,
          email: payload.email,
          subject: payload.subject,
          message: payload.message,
          timestamp: new Date().toLocaleString("en-US", {
            timeZone: "Asia/Manila",
            dateStyle: "medium",
            timeStyle: "short",
          }),
          ip: clientIp,
        });

        const { data, error } = await resend.emails.send(
          {
            from: fromEmail,
            to: [toEmail],
            replyTo: payload.email,
            subject: `[Portfolio] ${payload.subject} - from ${payload.name}`,
            html: htmlContent,
            text: `New Portfolio Message\n\nFrom: ${payload.name} (${payload.email})\nSubject: ${payload.subject}\n\n${payload.message}\n\nClient IP: ${clientIp}`,
          },
          {
            headers: {
              "Idempotency-Key": idempotencyKey,
            },
          }
        );

        if (error) {
          console.error("[Telemetry: Contact Failure]", {
            timestamp: new Date().toISOString(),
            errorCode: "RESEND_API_ERROR",
            diagnosticMessage: error.message,
            resendName: error.name,
            clientIp,
          });

          return c.json(
            {
              success: false,
              code: "SERVICE_UNAVAILABLE",
              message:
                "I'm having trouble receiving messages through the form right now. Please feel free to email me directly!",
              showDirectEmailFallback: true,
            },
            503
          );
        }

        console.log(
          `[Contact API] ✅ Email sent successfully! Resend ID: ${data?.id}`
        );

        return c.json(
          {
            success: true,
            message: "Thank you! Your message has been sent successfully. I'll get back to you soon.",
            data: {
              id: data?.id,
            },
          },
          200
        );
      } catch (err: any) {
        console.error("[Telemetry: Contact Failure]", {
          timestamp: new Date().toISOString(),
          errorCode: "INTERNAL_EXCEPTION",
          diagnosticMessage: err?.message || String(err),
          clientIp,
        });

        return c.json(
          {
            success: false,
            code: "SERVICE_UNAVAILABLE",
            message:
              "Something went wrong while sending your message. Please feel free to email me directly!",
            showDirectEmailFallback: true,
          },
          500
        );
      }
    }
  );

export type AppType = typeof routes;
