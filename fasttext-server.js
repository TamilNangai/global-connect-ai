
import express from "express";
import cors from "cors";
import FastText from "fasttext.js";

const app = express();
app.use(cors());
app.use(express.json());

const model = new FastText({
  loadModel: new URL("./lid.176.ftz", import.meta.url).pathname,
 // download model here
});

await model.load();

app.post("/detect", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text required" });
  }

  try {
    const result = model.predict(text, 1);
    const lang = result[0].label.replace("__label__", "");
    const confidence = result[0].value;

    res.json({ language: lang, confidence });
  } catch (err) {
    res.status(500).json({ error: "Detection failed" });
  }
});

app.listen(3000, () => {
  console.log("FastText server running on http://localhost:3000");
});
