import { z } from "zod";

/**
 * Escapes HTML characters to prevent HTML injection into the email template.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Contact form input validation and sanitization schema.
 * Formatted with polite, human-readable visitor error messages.
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name (at least 2 characters)")
    .max(60, "Name is a bit too long (maximum 60 characters)")
    .transform(escapeHtml),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address so I can get back to you")
    .max(100, "Email address is a bit too long (maximum 100 characters)"),
  subject: z
    .string()
    .trim()
    .min(5, "Please enter a subject (at least 5 characters)")
    .max(120, "Subject is a bit too long (maximum 120 characters)")
    .transform(escapeHtml),
  message: z
    .string()
    .trim()
    .min(10, "Please share a bit more detail (at least 10 characters)")
    .max(2000, "Message is too long (maximum 2000 characters)")
    .transform(escapeHtml),
  // Honeypot field: bots fill this; human visitors never see it
  _gotcha: z.string().optional(),
});

export type ContactInput = z.input<typeof contactFormSchema>;
export type ContactPayload = z.output<typeof contactFormSchema>;

export type ContactErrorCode =
  | "VALIDATION_ERROR"
  | "RATE_LIMITED"
  | "PAYLOAD_TOO_LARGE"
  | "SERVICE_UNAVAILABLE";

/**
 * Audience-Separated API Contract:
 * Only polite, visitor-appropriate responses are ever sent to the client.
 */
export type ContactResponse =
  | {
      success: true;
      message: string;
      data?: {
        id?: string;
      };
    }
  | {
      success: false;
      code: ContactErrorCode;
      message: string;
      fieldErrors?: Record<string, string[]>;
      showDirectEmailFallback?: boolean;
    };
