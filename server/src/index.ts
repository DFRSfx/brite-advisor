import "dotenv/config";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import cors from "cors";
import rateLimit from "express-rate-limit";
import axios from "axios";
import { z } from "zod";
import { calculateEcosystemScore, calculateSyncScore, classifyQuadrant } from "./classifier.js";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompts.js";
import { saveAssessment, getAssessmentById, getAnalytics } from "./db.js";
import { streamAssessmentPdf } from "./pdf.js";

const app = express();
const PORT = process.env.PORT ?? 3001;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? "http://localhost:5173";

if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set");
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

app.use(express.json());
app.use(cors({ origin: ALLOWED_ORIGIN, methods: ["GET", "POST"] }));

const diagnoseLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: "Too many requests, please try again later." },
});

const diagnosisSchema = z.object({
  companyName: z.string().min(2).max(120),
  formData: z.object({
    industry: z.string().min(2).max(100),
    businessModel: z.enum(["B2C", "B2B", "Hybrid"]),
    companySize: z.enum(["Startup", "SME", "Enterprise"]),
    numberOfChannels: z.number().int().min(1).max(20),
    numberOfIntegrations: z.number().int().min(0).max(50),
    hasOmnichannelPresence: z.boolean(),
    hasExternalPartners: z.boolean(),
    toleratesLatency: z.boolean(),
    needsRealTimeInventory: z.boolean(),
    needsRealTimePersonalization: z.boolean(),
    hasMissionCriticalTransactions: z.boolean(),
  }),
});

// Retry with exponential backoff — handles 429 / transient 5xx
// 429 = rate limit (per-minute window) → honour Retry-After or use long base delay
// 5xx = transient server error → short backoff
async function withRetry<T>(fn: () => Promise<T>, maxAttempts = 3): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err: any) {
      const status = err?.response?.status;
      const retryable = status === 429 || (status >= 500 && status < 600);
      attempt++;
      if (!retryable || attempt >= maxAttempts) throw err;

      let delay: number;
      if (status === 429) {
        // Honour Retry-After header if present, else 15s base with backoff
        const retryAfter = err?.response?.headers?.["retry-after"];
        delay = retryAfter
          ? parseInt(retryAfter, 10) * 1000
          : 15_000 * attempt + Math.random() * 2000;
      } else {
        delay = 1_000 * 2 ** (attempt - 1) + Math.random() * 300;
      }

      console.warn(`Gemini ${status} — retry ${attempt}/${maxAttempts - 1} in ${Math.round(delay / 1000)}s`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Run diagnosis + save to DB
app.post("/api/diagnose", diagnoseLimiter, async (req, res) => {
  const parsed = diagnosisSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }

  const { companyName, formData } = parsed.data;
  const ecosystemScore = calculateEcosystemScore(formData);
  const syncScore = calculateSyncScore(formData);
  const quadrant = classifyQuadrant(ecosystemScore, syncScore);

  let aiAnalysis = "";
  try {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    const geminiRes = await withRetry(() =>
      axios.post(geminiUrl, {
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: buildUserPrompt(formData, quadrant) }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 1500 },
      })
    );
    aiAnalysis = geminiRes.data.candidates[0].content.parts[0].text;
  } catch (err: any) {
    console.error("Gemini API error:", err);
    const status = err?.response?.status;
    if (status === 429) {
      res.status(429).json({ error: "Gemini rate limit reached. Wait a moment and try again." });
    } else {
      res.status(502).json({ error: "Failed to fetch AI diagnosis." });
    }
    return;
  }

  try {
    const assessment = await saveAssessment({
      companyName,
      formData,
      quadrant,
      ecosystemScore,
      syncScore,
      aiAnalysis,
    });

    res.json({
      id: assessment.id,
      quadrant,
      ecosystemScore,
      syncScore,
      aiAnalysis,
    });
  } catch (err) {
    console.error("DB save error:", err);
    // Return result even if DB fails — don't block the user
    res.json({ id: null, quadrant, ecosystemScore, syncScore, aiAnalysis });
  }
});

// PDF report
app.get("/api/report/:id", async (req, res) => {
  const { id } = req.params;
  const assessment = await getAssessmentById(id);
  if (!assessment) {
    res.status(404).json({ error: "Assessment not found" });
    return;
  }
  streamAssessmentPdf(assessment, res);
});

// Analytics
app.get("/api/analytics", async (_req, res) => {
  try {
    const data = await getAnalytics();
    res.json(data);
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ error: "Failed to load analytics." });
  }
});

const distCandidates = [
  path.resolve(process.cwd(), "dist"),
  path.resolve(process.cwd(), "..", "dist"),
];
const clientDist = distCandidates.find((candidate) =>
  fs.existsSync(path.join(candidate, "index.html"))
);

if (clientDist) {
  app.use(express.static(clientDist));

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(clientDist, "index.html"));
  });
} else {
  console.warn(
    "Frontend build not found. Expected index.html in:",
    distCandidates.join(", ")
  );
}

app.listen(PORT, () => {
  console.log(`BRITE server running on port ${PORT}`);
});
