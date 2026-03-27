/**
 * FastText Language Detection Service Setup
 * 
 * This service wrapper uses Facebook's FastText model (lid.176.ftz) for accurate language detection.
 * It can run as a standalone Node.js service and be called from Supabase Edge Functions.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new Node.js service (e.g., using Express or Fastify)
 * 2. Install: npm install fasttext.js express
 * 3. Download model: wget https://dl.fbaipublicfiles.com/fasttext/supervised-models/lid.176.ftz
 * 4. Run the service and set FASTTEXT_SERVICE_URL in Supabase secrets
 * 
 * EXAMPLE SERVICE CODE:
 */

/*
// fasttext-service.js
import express from "express";
import FastText from "fasttext.js";

const app = express();
app.use(express.json());

const ft = new FastText({ loadModel: "./lid.176.ftz" });

app.post("/detect", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text required" });

  try {
    const predictions = await ft.predict(text, 1); // Top 1 prediction
    if (!predictions || predictions.length === 0) {
      return res.json({ language: "en", confidence: 0.5 });
    }

    const [pred] = predictions;
    const language = pred.label.replace("__label__", "");
    const confidence = pred.value;

    // Map FastText labels to standard BCP-47 codes (optional)
    const langMap: Record<string, string> = {
      "en": "en", "es": "es", "fr": "fr", "de": "de", "it": "it", "pt": "pt",
      "ar": "ar", "hi": "hi", "zh": "zh", "ja": "ja", "ko": "ko", "ru": "ru",
      // ... add more as needed
    };

    res.json({
      language: langMap[language] || language,
      confidence,
      raw_label: pred.label,
    });
  } catch (error) {
    console.error("FastText error:", error);
    res.status(500).json({ error: "Detection failed" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`FastText service running on port ${PORT}`));
*/

/**
 * INTEGRATION STEPS:
 * 
 * 1. Deploy FastText service:
 *    - Option A: Self-hosted Node.js server (AWS EC2, DigitalOcean, Render)
 *    - Option B: Serverless (AWS Lambda with FastText layer, Google Cloud Functions)
 *    - Option C: Docker container (Docker Hub, ECR)
 * 
 * 2. Update Supabase secrets:
 *    - Set: FASTTEXT_SERVICE_URL = https://your-fasttext-service.com/detect
 *    - Use: supabase secrets set FASTTEXT_SERVICE_URL=https://...
 * 
 * 3. Frontend calls edge function (automatic after code deployment):
 *    - /functions/v1/lang-detect?text=...
 *    - Returns: { language: "es", confidence: 0.98 }
 * 
 * 4. Fallback:
 *    - If FastText service unavailable, edge function uses regex patterns
 *    - Still accurate for most common languages
 * 
 * BENEFITS OF FASTTEXT:
 * - 176 language support (vs 11 in regex)
 * - 90%+ accuracy
 * - <10ms detection time
 * - Can distinguish similar languages (e.g., Spanish vs Portuguese)
 * - Handles mixed-language text better
 * 
 * COST CONSIDERATIONS:
 * - FastText model: ~6.9 MB (one-time download)
 * - Memory: ~50MB per instance
 * - CPU: Minimal per request
 * - Best for: Moderate-to-high volume (100+ calls/day)
 */