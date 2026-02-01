import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PatternAlert {
  patternSignature: string;
  anomalyType: string;
  rarityScore: number;
  fileName: string;
  isSuspicious: boolean;
  detectionContext: string;
  patternData: Record<string, unknown>;
  userEmail?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { 
      patternSignature, 
      anomalyType, 
      rarityScore, 
      fileName,
      isSuspicious,
      detectionContext,
      patternData,
      userEmail 
    }: PatternAlert = await req.json();

    console.log(`[RARE PATTERN ALERT] Score: ${rarityScore}, Type: ${anomalyType}`);

    // Check if this is a "never seen before" pattern (rarity > 95%)
    const isNeverSeenBefore = rarityScore >= 95;
    
    // Check if pattern exists in database
    const { data: existing } = await supabase
      .from('metadata_anomalies')
      .select('id, occurrence_count')
      .eq('pattern_signature', patternSignature)
      .single();

    const isFirstOccurrence = !existing;

    // Build alert notification
    let alertLevel: 'info' | 'warning' | 'critical' = 'info';
    let alertMessage = '';

    if (isNeverSeenBefore && isFirstOccurrence) {
      alertLevel = 'critical';
      alertMessage = `🚨 NEVER SEEN BEFORE PATTERN DETECTED!\n\nType: ${anomalyType}\nRarity: ${rarityScore}%\nFile: ${fileName}\nContext: ${detectionContext}`;
    } else if (isSuspicious && rarityScore > 80) {
      alertLevel = 'warning';
      alertMessage = `⚠️ Rare suspicious pattern detected\n\nType: ${anomalyType}\nRarity: ${rarityScore}%\nFile: ${fileName}`;
    } else if (rarityScore > 90) {
      alertLevel = 'info';
      alertMessage = `📊 Unusual pattern logged\n\nType: ${anomalyType}\nRarity: ${rarityScore}%`;
    }

    // If user provided email and pattern is significant, send notification
    if (userEmail && (alertLevel === 'critical' || alertLevel === 'warning')) {
      // Try to send email via Resend if API key is configured
      const resendApiKey = Deno.env.get('RESEND_API_KEY');
      
      if (resendApiKey) {
        try {
          const emailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'DeepGuard Alerts <alerts@deepguard.app>',
              to: [userEmail],
              subject: alertLevel === 'critical' 
                ? '🚨 Critical: Never-Seen-Before Pattern Detected' 
                : '⚠️ Warning: Rare Suspicious Pattern Detected',
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                  <div style="background: ${alertLevel === 'critical' ? '#dc2626' : '#f59e0b'}; color: white; padding: 20px; text-align: center;">
                    <h1 style="margin: 0;">DeepGuard Pattern Alert</h1>
                  </div>
                  
                  <div style="padding: 20px; background: #f8fafc;">
                    <h2 style="color: ${alertLevel === 'critical' ? '#dc2626' : '#f59e0b'};">
                      ${alertLevel === 'critical' ? '🚨 Never-Seen-Before Pattern' : '⚠️ Rare Suspicious Pattern'}
                    </h2>
                    
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Pattern Type:</td>
                        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${anomalyType}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Rarity Score:</td>
                        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${rarityScore}%</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">File Name:</td>
                        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${fileName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">Detection Context:</td>
                        <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${detectionContext}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px; font-weight: bold;">Suspicious:</td>
                        <td style="padding: 8px;">${isSuspicious ? 'Yes ⚠️' : 'No ✓'}</td>
                      </tr>
                    </table>
                    
                    <div style="margin-top: 20px; padding: 15px; background: #fef3c7; border-radius: 8px;">
                      <p style="margin: 0; font-size: 14px;">
                        <strong>What does this mean?</strong><br>
                        ${isNeverSeenBefore 
                          ? 'This pattern has never been seen in our database before. It could indicate a new AI generation tool, novel manipulation technique, or emerging threat.'
                          : 'This pattern is rare and flagged as suspicious. Review the analysis for potential manipulation indicators.'}
                      </p>
                    </div>
                    
                    <div style="margin-top: 20px; text-align: center;">
                      <a href="https://deepguard.app/history" style="display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                        View Analysis History
                      </a>
                    </div>
                  </div>
                  
                  <div style="padding: 15px; background: #1e293b; color: #94a3b8; font-size: 12px; text-align: center;">
                    <p style="margin: 0;">DeepGuard AI - Protecting Truth in the Age of AI</p>
                    <p style="margin: 5px 0 0;">This is an automated alert. Do not reply to this email.</p>
                  </div>
                </div>
              `,
            }),
          });

          if (emailResponse.ok) {
            console.log(`[EMAIL SENT] Alert sent to ${userEmail}`);
          } else {
            console.error('[EMAIL FAILED]', await emailResponse.text());
          }
        } catch (emailError) {
          console.error('[EMAIL ERROR]', emailError);
        }
      }
    }

    // Log to database for admin review
    if (isNeverSeenBefore || (isSuspicious && rarityScore > 80)) {
      // Update or insert the pattern
      if (existing) {
        await supabase
          .from('metadata_anomalies')
          .update({
            occurrence_count: existing.occurrence_count + 1,
            last_seen: new Date().toISOString(),
          })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('metadata_anomalies')
          .insert({
            pattern_signature: patternSignature,
            anomaly_type: anomalyType,
            pattern_data: patternData,
            rarity_score: rarityScore,
            is_suspicious: isSuspicious,
            detection_context: detectionContext,
            example_file_names: [fileName],
            occurrence_count: 1,
          });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        alertLevel,
        alertMessage,
        isNeverSeenBefore,
        isFirstOccurrence,
        emailSent: !!userEmail && (alertLevel === 'critical' || alertLevel === 'warning'),
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[RARE PATTERN ALERT ERROR]', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
