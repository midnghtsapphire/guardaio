import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ThreatAlertRequest {
  email: string;
  deviceId: string;
  threatLevel: "low" | "medium" | "high" | "critical";
  score: number;
  findings: {
    covertFailures: number;
    sideChannelRisk: string;
    tpmValid: boolean;
    ermDetected: boolean;
  };
  recommendations: string[];
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 503, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const body: ThreatAlertRequest = await req.json();
    const { email, deviceId, threatLevel, score, findings, recommendations } = body;

    if (!email || !deviceId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: email, deviceId" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const threatColors: Record<string, string> = {
      critical: "#dc2626",
      high: "#f97316",
      medium: "#eab308",
      low: "#22c55e",
    };

    const threatIcons: Record<string, string> = {
      critical: "🚨",
      high: "⚠️",
      medium: "⚡",
      low: "✅",
    };

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "DeepGuard Security <alerts@lovable.dev>",
        to: [email],
        subject: `${threatIcons[threatLevel]} Hardware Security Alert: ${threatLevel.toUpperCase()} - Device ${deviceId}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <!-- Header -->
              <div style="background: ${threatColors[threatLevel]}; color: white; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
                <h1 style="margin: 0; font-size: 24px;">${threatIcons[threatLevel]} Hardware Security Alert</h1>
                <p style="margin: 8px 0 0 0; opacity: 0.9;">Threat Level: ${threatLevel.toUpperCase()}</p>
              </div>
              
              <!-- Main Content -->
              <div style="background: #1a1a1a; padding: 24px; color: #e5e5e5;">
                <!-- Score Card -->
                <div style="background: #262626; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 20px;">
                  <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 14px;">Security Score</p>
                  <p style="margin: 0; font-size: 48px; font-weight: bold; color: ${threatColors[threatLevel]};">${score}<span style="font-size: 24px; color: #6b7280;">/100</span></p>
                </div>
                
                <!-- Device Info -->
                <div style="background: #262626; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                  <p style="margin: 0; color: #9ca3af; font-size: 12px;">Device ID</p>
                  <p style="margin: 4px 0 0 0; font-family: monospace; font-size: 16px; color: #60a5fa;">${deviceId}</p>
                </div>
                
                <!-- Findings -->
                <h3 style="color: #f97316; margin: 24px 0 12px 0; font-size: 16px;">Security Findings</h3>
                <div style="background: #262626; border-radius: 8px; padding: 16px;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; color: #9ca3af; font-size: 14px;">COVERT Test Failures</td>
                      <td style="padding: 8px 0; text-align: right; color: ${findings.covertFailures > 0 ? '#ef4444' : '#22c55e'}; font-weight: bold;">${findings.covertFailures}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #9ca3af; font-size: 14px; border-top: 1px solid #3f3f46;">Side-Channel Risk</td>
                      <td style="padding: 8px 0; text-align: right; color: ${findings.sideChannelRisk === 'critical' ? '#ef4444' : findings.sideChannelRisk === 'high' ? '#f97316' : '#22c55e'}; font-weight: bold; border-top: 1px solid #3f3f46; text-transform: uppercase;">${findings.sideChannelRisk}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #9ca3af; font-size: 14px; border-top: 1px solid #3f3f46;">TPM Attestation</td>
                      <td style="padding: 8px 0; text-align: right; color: ${findings.tpmValid ? '#22c55e' : '#ef4444'}; font-weight: bold; border-top: 1px solid #3f3f46;">${findings.tpmValid ? '✓ Valid' : '✗ Failed'}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #9ca3af; font-size: 14px; border-top: 1px solid #3f3f46;">ERM Trigger</td>
                      <td style="padding: 8px 0; text-align: right; color: ${findings.ermDetected ? '#ef4444' : '#22c55e'}; font-weight: bold; border-top: 1px solid #3f3f46;">${findings.ermDetected ? '⚠ Detected' : 'None'}</td>
                    </tr>
                  </table>
                </div>
                
                <!-- Recommendations -->
                <h3 style="color: #f97316; margin: 24px 0 12px 0; font-size: 16px;">Recommended Actions</h3>
                <div style="background: #262626; border-radius: 8px; padding: 16px;">
                  <ul style="margin: 0; padding: 0 0 0 20px; color: #e5e5e5;">
                    ${recommendations.map(r => `<li style="margin-bottom: 8px; line-height: 1.5;">${r}</li>`).join('')}
                  </ul>
                </div>
                
                <!-- CTA -->
                <div style="text-align: center; margin-top: 24px;">
                  <a href="https://deepguard.lovable.app/admin" style="display: inline-block; background: ${threatColors[threatLevel]}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">View Full Report</a>
                </div>
              </div>
              
              <!-- Footer -->
              <div style="background: #262626; padding: 16px; border-radius: 0 0 12px 12px; text-align: center;">
                <p style="margin: 0; color: #6b7280; font-size: 12px;">
                  DeepGuard Hardware Security Module • Automated Alert<br>
                  <a href="https://deepguard.lovable.app" style="color: #60a5fa;">deepguard.lovable.app</a>
                </p>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    const emailResult = await emailResponse.json();
    
    if (!emailResponse.ok) {
      console.error("Resend error:", emailResult);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: emailResult }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: emailResult.id,
        message: `Alert sent to ${email}` 
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: unknown) {
    console.error("Error in hardware-threat-alert:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
