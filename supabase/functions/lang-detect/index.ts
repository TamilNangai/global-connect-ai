// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

declare var Deno: any;

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

const SYSTEM_PROMPT = `You are UniSpeak AI, a highly accurate multilingual language detection engine and API response handler.

Your responsibilities:
1. Detect the correct language of the input text.
2. Handle invalid or missing input gracefully.
3. Handle API-related issues logically (like missing authorization, empty input, etc.).
4. Always return a valid JSON response.

----------------------------------------
LANGUAGE DETECTION RULES:

- Detect the actual language (NOT translation).
- Do NOT default to English unless 100% certain.
- Detect transliterated text:
  e.g., "vanakkam", "epdi iruka" → Tamil
- Recognize:
  - Tanglish (Tamil in English letters)
  - Hinglish, Manglish, etc.
- If multiple languages → return dominant + mark "mixed"
- If unclear → return "unknown"
- Recognize common words:
  - "amigo" → Spanish
  - "bonjour" → French
  - "namaste" → Hindi
- Use phonetic reasoning, not just dictionary matching
- Confidence must be realistic (0–100)
- NEVER guess randomly

----------------------------------------
ERROR HANDLING RULES:

If input is empty:
{
  "error": true,
  "message": "Input text is empty",
  "status": 400
}

If authorization is missing (simulated API scenario):
{
  "error": true,
  "message": "Missing authorization header",
  "status": 401
}

If input is invalid or too short:
{
  "error": false,
  "language": "unknown",
  "iso_code": "unknown",
  "confidence": 0,
  "type": "unknown",
  "note": "Input too short or unclear"
}

----------------------------------------
OUTPUT FORMAT (STRICT JSON ONLY):

For success:
{
  "error": false,
  "language": "<full language name>",
  "iso_code": "<ISO code>",
  "confidence": <0-100>,
  "type": "<pure | mixed | transliterated | unknown>",
  "note": "<short explanation>"
}

----------------------------------------
IMPORTANT:
- ALWAYS return JSON
- NO extra text
- NO explanations outside JSON`;

// Call OpenAI for advanced language detection
async function detectLanguageOpenAI(text: string) {
  const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
  if (!OPENAI_API_KEY) return null;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // fast and cheap for this task
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `INPUT:\n"${text}"` }
        ],
        temperature: 0.1,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      console.error("OpenAI API error:", await response.text());
      return null;
    }
    
    const result = await response.json();
    const parsed = JSON.parse(result.choices[0].message.content);
    
    // Map ISO code to 'language' to remain compatible with frontend 
    // and parse confidence as a float
    return {
      language: parsed.iso_code?.toLowerCase() || "en",
      confidence: parseFloat(parsed.confidence) / 100 || 0.5,
      full_language_name: parsed.language,
      type: parsed.type,
      note: parsed.note
    };
  } catch (error) {
    console.error("OpenAI detection error:", error);
    return null;
  }
}
serve(async (req: Request) => {
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

    // Try OpenAI detection first
    let result: any = await detectLanguageOpenAI(text.trim());

    // Fall back to regex if OpenAI unavailable
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
