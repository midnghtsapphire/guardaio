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
    const { imageBase64, imageUrl, searchQuery } = await req.json();

    if (!imageBase64 && !imageUrl && !searchQuery) {
      return new Response(
        JSON.stringify({ error: 'Image or search query required' }),
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

    console.log('Starting reverse image search...');

    // Step 1: Generate search terms from the image using AI
    let searchTerms = searchQuery;
    
    if (!searchTerms && (imageBase64 || imageUrl)) {
      console.log('Generating search terms from image...');
      
      const imageContent = imageBase64 
        ? { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
        : { type: 'image_url', image_url: { url: imageUrl } };

      const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${lovableApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            {
              role: 'system',
              content: `You are an image analysis expert. Your task is to analyze an image and generate effective search terms that could be used to find this image or similar images online.

Consider:
- Notable people (if recognizable, provide their names)
- Distinctive visual elements or objects
- Text visible in the image
- Locations or landmarks
- Events, news, or context clues
- Unique clothing, logos, or branding
- Any watermarks or source identifiers

Respond with a JSON object (no markdown):
{
  "searchTerms": "<most effective search query to find this image, max 10 words>",
  "description": "<brief description of image content>",
  "recognizedPeople": [<names of recognized public figures if any>],
  "possibleSources": [<likely original sources like news sites, social platforms>],
  "distinctiveElements": [<unique visual elements that could identify this image>]
}`
            },
            {
              role: 'user',
              content: [
                { type: 'text', text: 'Analyze this image and generate search terms to find it online:' },
                imageContent,
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
          JSON.stringify({ error: 'Failed to analyze image' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const aiData = await aiResponse.json();
      const content = aiData.choices?.[0]?.message?.content;

      if (content) {
        try {
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            searchTerms = parsed.searchTerms;
            
            // Attach AI analysis to result
            var imageAnalysis = parsed;
          }
        } catch (parseError) {
          console.error('Failed to parse AI response:', parseError);
          searchTerms = 'image search';
        }
      }
    }

    console.log('Search terms:', searchTerms);

    // Step 2: Search the web for similar content
    const searchResponse = await fetch('https://api.firecrawl.dev/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firecrawlKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: searchTerms,
        limit: 10,
        scrapeOptions: {
          formats: ['markdown'],
        },
      }),
    });

    const searchData = await searchResponse.json();

    if (!searchResponse.ok) {
      console.error('Firecrawl search error:', searchData);
      return new Response(
        JSON.stringify({ error: searchData.error || 'Search failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Found', searchData.data?.length || 0, 'search results');

    // Step 3: Analyze results for matches
    const results = searchData.data || [];
    
    const matches = results.map((result: any) => ({
      url: result.url,
      title: result.title || 'Untitled',
      description: result.description || result.markdown?.slice(0, 200) || '',
      source: new URL(result.url).hostname,
    }));

    // Step 4: Generate reverse search links for manual verification
    const manualSearchLinks = [];
    
    if (imageUrl) {
      manualSearchLinks.push({
        name: 'Google Images',
        url: `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(imageUrl)}`,
        icon: 'google',
      });
      manualSearchLinks.push({
        name: 'TinEye',
        url: `https://tineye.com/search?url=${encodeURIComponent(imageUrl)}`,
        icon: 'tineye',
      });
      manualSearchLinks.push({
        name: 'Yandex Images',
        url: `https://yandex.com/images/search?rpt=imageview&url=${encodeURIComponent(imageUrl)}`,
        icon: 'yandex',
      });
    }

    // Always add text-based search links
    manualSearchLinks.push({
      name: 'Google Search',
      url: `https://www.google.com/search?q=${encodeURIComponent(searchTerms)}&tbm=isch`,
      icon: 'google',
    });

    const response = {
      success: true,
      searchTerms,
      imageAnalysis: imageAnalysis || null,
      matches,
      matchCount: matches.length,
      manualSearchLinks,
      summary: matches.length > 0 
        ? `Found ${matches.length} potential sources where this image or similar content appears online.`
        : 'No exact matches found. The image may be original or not widely shared online.',
    };

    console.log('Reverse image search complete');

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in reverse-image-search function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
