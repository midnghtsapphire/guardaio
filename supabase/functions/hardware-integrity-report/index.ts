import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface COVERTResult {
  testId: string;
  testName: string;
  status: "passed" | "failed" | "anomaly";
  rareEventsTriggered: number;
  expectedEvents: number;
  deviation: number;
  trojanProbability: number;
  details: string;
}

interface SideChannelAnalysis {
  powerProfile: {
    baseline: number;
    current: number;
    deviation: number;
    isAnomalous: boolean;
  };
  timingProfile: {
    baselineLatency: number;
    currentLatency: number;
    jitter: number;
    isAnomalous: boolean;
  };
  thermalProfile: {
    baseline: number;
    current: number;
    rateOfChange: number;
    isAnomalous: boolean;
  };
  overallRisk: "low" | "medium" | "high" | "critical";
}

interface HardwareIntegrityReport {
  deviceId: string;
  timestamp: string;
  overallScore: number;
  covertTestResults: COVERTResult[];
  sideChannelAnalysis: SideChannelAnalysis;
  traceabilityChain: {
    chainLength: number;
    isComplete: boolean;
    brokenLinks: number;
    verifiedRecords: number;
    suspiciousRecords: string[];
    originVerified: boolean;
  };
  rootOfTrustStatus: {
    tpmPresent: boolean;
    tpmVersion: string;
    attestationValid: boolean;
    secureBootEnabled: boolean;
    firmwareIntegrity: boolean;
  };
  recommendations: string[];
  submittedBy?: string;
  organizationId?: string;
}

interface SubmissionRequest {
  report: HardwareIntegrityReport;
  notifyEmail?: string;
  organizationId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (req.method === "GET") {
      // List recent reports (with optional filters)
      const url = new URL(req.url);
      const deviceId = url.searchParams.get("deviceId");
      const organizationId = url.searchParams.get("organizationId");
      const limit = parseInt(url.searchParams.get("limit") || "50");

      let query = supabase
        .from("hardware_integrity_reports")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (deviceId) {
        query = query.eq("device_id", deviceId);
      }
      if (organizationId) {
        query = query.eq("organization_id", organizationId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, reports: data, count: data?.length || 0 }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (req.method === "POST") {
      const body: SubmissionRequest = await req.json();
      const { report, notifyEmail, organizationId } = body;

      // Validate required fields
      if (!report || !report.deviceId || report.overallScore === undefined) {
        return new Response(
          JSON.stringify({ error: "Missing required fields: deviceId, overallScore" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Determine threat level
      const threatLevel = report.overallScore < 50 ? "critical" 
        : report.overallScore < 70 ? "high"
        : report.overallScore < 85 ? "medium" : "low";

      // Check for critical issues
      const hasCriticalCovert = report.covertTestResults?.some(r => r.status === "failed") || false;
      const hasAnomalySideChannel = report.sideChannelAnalysis?.overallRisk === "critical" || false;
      const hasTPMFailure = report.rootOfTrustStatus?.attestationValid === false;
      
      const isCritical = threatLevel === "critical" || hasCriticalCovert || hasAnomalySideChannel || hasTPMFailure;

      // Store the report - gracefully handle if table doesn't exist
      let insertedReport: { id: string } | null = null;
      try {
        const { data, error: insertError } = await supabase
          .from("hardware_integrity_reports")
          .insert({
            device_id: report.deviceId,
            organization_id: organizationId || null,
            overall_score: report.overallScore,
            threat_level: threatLevel,
            covert_results: report.covertTestResults,
            side_channel_analysis: report.sideChannelAnalysis,
            traceability_chain: report.traceabilityChain,
            root_of_trust: report.rootOfTrustStatus,
            recommendations: report.recommendations,
            is_critical: isCritical,
            raw_report: report,
          })
          .select()
          .single();

        if (insertError) {
          console.error("Insert error:", insertError);
          // Continue without storage if table doesn't exist
        } else {
          insertedReport = data;
        }
      } catch (dbError) {
        console.log("Database not available, proceeding without storage");
      }

      // Send email alert if critical and email provided
      let emailSent = false;
      if (isCritical && notifyEmail) {
        try {
          const resendApiKey = Deno.env.get("RESEND_API_KEY");
          if (resendApiKey) {
            const emailResponse = await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${resendApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                from: "DeepGuard Security <alerts@lovable.dev>",
                to: [notifyEmail],
                subject: `🚨 CRITICAL: Hardware Security Alert - Device ${report.deviceId}`,
                html: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: #dc2626; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
                      <h1 style="margin: 0;">⚠️ Critical Hardware Security Alert</h1>
                    </div>
                    <div style="background: #1a1a1a; color: #e5e5e5; padding: 20px;">
                      <p><strong>Device ID:</strong> ${report.deviceId}</p>
                      <p><strong>Security Score:</strong> <span style="color: #ef4444; font-size: 24px; font-weight: bold;">${report.overallScore}/100</span></p>
                      <p><strong>Threat Level:</strong> <span style="color: #ef4444; text-transform: uppercase;">${threatLevel}</span></p>
                      <p><strong>Timestamp:</strong> ${report.timestamp}</p>
                      
                      <h3 style="color: #f97316; margin-top: 20px;">Critical Findings:</h3>
                      <ul style="color: #fca5a5;">
                        ${hasCriticalCovert ? '<li>COVERT Test Failures - Potential Hardware Trojan Detected</li>' : ''}
                        ${hasAnomalySideChannel ? '<li>Critical Side-Channel Anomalies Detected</li>' : ''}
                        ${hasTPMFailure ? '<li>TPM Attestation Failed - Boot Chain Compromised</li>' : ''}
                      </ul>
                      
                      <h3 style="color: #f97316; margin-top: 20px;">Recommendations:</h3>
                      <ul>
                        ${report.recommendations.map(r => `<li>${r}</li>`).join('')}
                      </ul>
                      
                      <div style="margin-top: 30px; padding: 15px; background: #2a2a2a; border-radius: 8px;">
                        <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                          This is an automated security alert from DeepGuard Hardware Security Module.
                          Immediate action is required.
                        </p>
                      </div>
                    </div>
                  </div>
                `,
              }),
            });
            
            emailSent = emailResponse.ok;
            console.log("Email alert sent:", emailSent);
          }
        } catch (emailError) {
          console.error("Email sending failed:", emailError);
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          reportId: insertedReport?.id || `temp-${Date.now()}`,
          deviceId: report.deviceId,
          threatLevel,
          isCritical,
          emailAlertSent: emailSent,
          message: isCritical 
            ? "CRITICAL: Immediate security review required"
            : "Report submitted successfully",
        }),
        { status: 201, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: unknown) {
    console.error("Error in hardware-integrity-report:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
