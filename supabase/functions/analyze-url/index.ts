import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, analysisType } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlKey) {
      console.error('FIRECRAWL_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'Firecrawl connector not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format URL
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    console.log('Scraping URL:', formattedUrl, 'Analysis type:', analysisType);

    // Use Firecrawl to get screenshot and metadata
    const firecrawlResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: formattedUrl,
        formats: ['screenshot', 'markdown'],
        onlyMainContent: false,
        waitFor: 3000, // Wait for video players to load
      }),
    });

    const firecrawlData = await firecrawlResponse.json();

    if (!firecrawlResponse.ok) {
      console.error('Firecrawl error:', firecrawlData);
      return new Response(
        JSON.stringify({ error: firecrawlData.error || 'Failed to fetch URL content' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const screenshot = firecrawlData.data?.screenshot;
    const metadata = firecrawlData.data?.metadata || {};
    const markdown = firecrawlData.data?.markdown || '';

    if (!screenshot) {
      return new Response(
        JSON.stringify({ error: 'Could not capture screenshot from URL' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Screenshot captured, analyzing with AI...');

    // Detect platform
    const platformPatterns = {
      youtube: /youtube\.com|youtu\.be/i,
      facebook: /facebook\.com|fb\.com|fb\.watch/i,
      instagram: /instagram\.com/i,
      tiktok: /tiktok\.com/i,
      twitter: /twitter\.com|x\.com/i,
    };

    let platform = 'unknown';
    for (const [name, pattern] of Object.entries(platformPatterns)) {
      if (pattern.test(formattedUrl)) {
        platform = name;
        break;
      }
    }

    // Build analysis prompt
    const systemPrompt = `You are an expert AI media forensics analyst specializing in detecting deepfakes, AI-generated content, and manipulated media. You're analyzing a screenshot from a ${platform} post/video.

Your task is to analyze this content for signs of AI manipulation or deepfake technology. Consider:

1. VISUAL ARTIFACTS: Look for unnatural smoothing, warping around faces, inconsistent lighting, blurred edges around people, mismatched shadows, or unnatural eye movements/blinking patterns in video thumbnails.

2. CONTEXT CLUES: Analyze the metadata, title, description for suspicious patterns (e.g., sensational claims, unusual account behavior).

3. PLATFORM SIGNALS: Consider engagement patterns, account verification status, post timing.

4. CONTENT ANALYSIS: Look for signs of synthetic generation - perfect skin, asymmetrical features, background inconsistencies, unusual proportions.

${analysisType === 'deep' ? `
DEEP ANALYSIS MODE: Perform thorough multi-factor analysis including:
- Detailed facial feature consistency check
- Background element analysis
- Text/caption authenticity assessment
- Source credibility evaluation
- Cross-reference typical manipulation patterns
` : `
QUICK SCAN MODE: Focus on the most obvious indicators of manipulation.
`}

Respond with a JSON object (no markdown formatting):
{
  "status": "safe" | "warning" | "danger",
  "confidence": <number 0-100>,
  "findings": [<array of specific observations>],
  "platform": "${platform}",
  "contentType": "video" | "image" | "post" | "unknown",
  "riskFactors": [<specific manipulation indicators found>],
  "recommendation": "<brief action recommendation>"
}

Status meanings:
- "safe": No significant signs of manipulation detected
- "warning": Some suspicious elements that warrant caution  
- "danger": Strong indicators of AI manipulation or deepfake content`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this screenshot from: ${formattedUrl}\n\nPage title: ${metadata.title || 'Unknown'}\nDescription: ${metadata.description || 'None'}\n\nPage content preview:\n${markdown.slice(0, 1000)}`,
              },
              {
                type: 'image_url',
                image_url: {
                  url: screenshot,
                },
              },
            ],
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI usage limit reached. Please try again later.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'AI analysis failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(
        JSON.stringify({ error: 'No analysis result from AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse JSON from response
    let result;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      result = {
        status: 'warning',
        confidence: 50,
        findings: ['Analysis completed but results may be incomplete'],
        platform,
        contentType: 'unknown',
        riskFactors: [],
        recommendation: 'Manual review recommended',
      };
    }

    // Ensure required fields
    result.status = ['safe', 'warning', 'danger'].includes(result.status) ? result.status : 'warning';
    result.confidence = Math.min(100, Math.max(0, Number(result.confidence) || 50));
    result.findings = Array.isArray(result.findings) ? result.findings : [];
    result.platform = result.platform || platform;
    result.sourceUrl = formattedUrl;
    result.analysisType = analysisType;
    result.screenshot = screenshot;

    console.log('Analysis complete:', result.status, result.confidence);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-url function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
