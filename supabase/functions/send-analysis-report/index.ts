import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_URL = "https://api.resend.com/emails";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface AnalysisReport {
  recipientEmail: string;
  recipientName?: string;
  senderName?: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  status: "safe" | "warning" | "danger";
  confidence: number;
  findings: string[];
  sensitivity: number;
  shareUrl?: string;
}

const getStatusLabel = (status: string): string => {
  switch (status) {
    case "safe": return "Authentic";
    case "warning": return "Suspicious";
    case "danger": return "Likely Fake";
    default: return "Unknown";
  }
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case "safe": return "#22c55e";
    case "warning": return "#f59e0b";
    case "danger": return "#ef4444";
    default: return "#6b7280";
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const report: AnalysisReport = await req.json();

    // Validate required fields
    if (!report.recipientEmail || !report.fileName || !report.status) {
      throw new Error("Missing required fields: recipientEmail, fileName, or status");
    }

    const statusLabel = getStatusLabel(report.status);
    const statusColor = getStatusColor(report.status);
    const senderName = report.senderName || "DeepFake Detector";

    const findingsHtml = report.findings
      .map(finding => `<li style="margin-bottom: 8px; color: #374151;">${finding}</li>`)
      .join("");

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">
        🔍 DeepFake Analysis Report
      </h1>
      <p style="color: #94a3b8; margin: 8px 0 0 0; font-size: 14px;">
        Shared by ${senderName}
      </p>
    </div>

    <!-- Status Badge -->
    <div style="padding: 24px; text-align: center; background-color: ${statusColor}15; border-bottom: 1px solid ${statusColor}30;">
      <div style="display: inline-block; padding: 12px 24px; background-color: ${statusColor}; border-radius: 8px;">
        <span style="color: #ffffff; font-size: 20px; font-weight: 700;">${statusLabel}</span>
      </div>
      <p style="margin: 12px 0 0 0; color: #6b7280; font-size: 14px;">
        Confidence Score: <strong style="color: ${statusColor}; font-size: 18px;">${report.confidence}%</strong>
      </p>
    </div>

    <!-- File Info -->
    <div style="padding: 24px; border-bottom: 1px solid #e5e7eb;">
      <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 16px; font-weight: 600;">
        📁 File Information
      </h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">File Name</td>
          <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 500; text-align: right;">${report.fileName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">File Type</td>
          <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 500; text-align: right;">${report.fileType}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">File Size</td>
          <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 500; text-align: right;">${formatFileSize(report.fileSize)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Detection Sensitivity</td>
          <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 500; text-align: right;">${report.sensitivity}%</td>
        </tr>
      </table>
    </div>

    <!-- Findings -->
    <div style="padding: 24px;">
      <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 16px; font-weight: 600;">
        🔎 Analysis Findings
      </h2>
      <ul style="margin: 0; padding: 0 0 0 20px; list-style-type: disc;">
        ${findingsHtml}
      </ul>
    </div>

    ${report.shareUrl ? `
    <!-- View Full Report Button -->
    <div style="padding: 0 24px 24px 24px; text-align: center;">
      <a href="${report.shareUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
        View Full Report
      </a>
    </div>
    ` : ""}

    <!-- Footer -->
    <div style="padding: 24px; background-color: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0; color: #9ca3af; font-size: 12px;">
        This report was generated by DeepFake Detector using advanced AI analysis.
      </p>
      <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 12px;">
        Report generated on ${new Date().toLocaleDateString("en-US", { 
          year: "numeric", 
          month: "long", 
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        })}
      </p>
    </div>
  </div>
</body>
</html>
    `;

    const emailPayload = {
      from: "DeepFake Detector <onboarding@resend.dev>",
      to: [report.recipientEmail],
      subject: `DeepFake Analysis Report: ${report.fileName} - ${statusLabel}`,
      html: emailHtml,
    };

    const emailResponse = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    const emailData = await emailResponse.json();

    if (!emailResponse.ok) {
      throw new Error(`Resend API error: ${JSON.stringify(emailData)}`);
    }

    console.log("Analysis report email sent successfully:", emailData);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: unknown) {
    console.error("Error in send-analysis-report function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
