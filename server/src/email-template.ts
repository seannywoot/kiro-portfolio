interface EmailTemplateProps {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  ip: string;
}

/**
 * Generates a clean, scannable, mobile-responsive HTML email for portfolio inquiries.
 */
export function renderContactEmailHtml({
  name,
  email,
  subject,
  message,
  timestamp,
  ip,
}: EmailTemplateProps): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Inquiry</title>
</head>
<body style="margin: 0; padding: 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #111827; border: 1px solid #1f2937; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 24px 28px;">
      <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em;">
        📬 New Portfolio Inquiry
      </h1>
      <p style="margin: 4px 0 0 0; font-size: 13px; color: #e0e7ff;">
        Received from your website contact form
      </p>
    </div>

    <!-- Content -->
    <div style="padding: 28px;">
      
      <!-- Meta Information Grid -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; background-color: #1f2937; border-radius: 8px; overflow: hidden;">
        <tr>
          <td style="padding: 12px 16px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; width: 80px; border-bottom: 1px solid #374151;">From</td>
          <td style="padding: 12px 16px; font-size: 14px; font-weight: 600; color: #ffffff; border-bottom: 1px solid #374151;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 12px 16px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; border-bottom: 1px solid #374151;">Email</td>
          <td style="padding: 12px 16px; font-size: 14px; color: #60a5fa; border-bottom: 1px solid #374151;">
            <a href="mailto:${email}" style="color: #60a5fa; text-decoration: none;">${email}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 16px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af; border-bottom: 1px solid #374151;">Subject</td>
          <td style="padding: 12px 16px; font-size: 14px; color: #e5e7eb; font-weight: 500; border-bottom: 1px solid #374151;">${subject}</td>
        </tr>
        <tr>
          <td style="padding: 12px 16px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af;">Time</td>
          <td style="padding: 12px 16px; font-size: 13px; color: #9ca3af;">${timestamp}</td>
        </tr>
      </table>

      <!-- Message Section -->
      <div style="margin-bottom: 24px;">
        <h3 style="margin: 0 0 10px 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #9ca3af;">
          Message
        </h3>
        <div style="background-color: #0b0f19; border: 1px solid #1f2937; border-radius: 8px; padding: 18px; font-size: 14px; line-height: 1.6; color: #f3f4f6; white-space: pre-wrap; word-break: break-word;">${message}</div>
      </div>

      <!-- Quick Reply Prompt -->
      <div style="background-color: #1e1b4b; border: 1px solid #4338ca; border-radius: 8px; padding: 14px 18px; margin-bottom: 20px;">
        <p style="margin: 0; font-size: 13px; color: #c7d2fe;">
          💡 <strong>Tip:</strong> Simply hit <strong>Reply</strong> in your email client to respond directly to <strong>${name}</strong> (${email}).
        </p>
      </div>

      <!-- Security / Audit Footer -->
      <div style="border-top: 1px solid #1f2937; padding-top: 16px; font-size: 11px; color: #6b7280; display: flex; justify-content: space-between;">
        <span>Client IP: <code>${ip}</code></span>
        <span>•</span>
        <span>Secured via Portfolio Contact API</span>
      </div>

    </div>
  </div>
</body>
</html>`;
}
