import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Fallback regex patterns for language detection (when FastText service unavailable)
const languagePatterns: [RegExp, string][] = [
  [/[\u0B80-\u0BFF]/, "ta"],                                         // Tamil
  [/[\u0900-\u097F]/, "hi"],                                         // Hindi/Devanagari
  [/[\u0600-\u06FF]/, "ar"],                                         // Arabic
  [/[\u4e00-\u9fff]/, "zh"],                                         // Chinese
  [/[\u3040-\u309f\u30a0-\u30ff]/, "ja"],                           // Japanese
  [/[\uac00-\ud7af]/, "ko"],                                         // Korean
  [/\b(el|la|los|las|es|está|como|qué|por|para|muy|más)\b/i, "es"], // Spanish
  [/\b(le|la|les|est|sont|avec|pour|dans|une|comment)\b/i, "fr"],   // French
  [/\b(der|die|das|ist|und|ein|eine|nicht|ich|wie)\b/i, "de"],      // German
  [/\b(il|lo|la|è|sono|che|per|con|una|come)\b/i, "it"],            // Italian
  [/\b(o|a|os|as|é|está|com|para|uma|como)\b/i, "pt"],             // Portuguese
];

// Fallback: regex-based language detection
function detectLanguageRegex(text: string): { language: string; confidence: number } {
  const lower = text.toLowerCase();
  
  for (const [pattern, lang] of languagePatterns) {
    if (pattern.test(text)) {
      // Confidence based on number of matches
      const matches = (text.match(pattern) || []).length;
      const confidence = Math.min(0.95, 0.7 + matches * 0.05);
      return { language: lang, confidence };
    }
  }
  
  return { language: "en", confidence: 0.5 };
}

// Call external FastText service (Node.js or Python backend)
async function detectLanguageFastText(text: string): Promise<{ language: string; confidence: number } | null> {
  const fastTextServiceUrl = Deno.env.get("FASTTEXT_SERVICE_URL");
  if (!fastTextServiceUrl) return null;

  try {
    const response = await fetch(fastTextServiceUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) return null;
    
    const result = await response.json();
    return result; // Expected: { language: "es", confidence: 0.98 }
  } catch (error) {
    console.error("FastText service error:", error);
    return null;
  }
}
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Supabase gateway already validates the JWT — no custom auth check needed here

  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Text is required and must be non-empty" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Try FastText service first
    let result = await detectLanguageFastText(text.trim());

    // Fall back to regex if FastText unavailable
    if (!result) {
      result = detectLanguageRegex(text);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("lang-detect error:", error);
    return new Response(
      JSON.stringify({ error: "Language detection failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
