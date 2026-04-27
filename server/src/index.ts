import "dotenv/config";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import rateLimit from "express-rate-limit";
import axios from "axios";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { calculateEcosystemScore, calculateSyncScore, classifyQuadrant } from "./classifier.js";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompts.js";
import {
  saveAssessment,
  getAssessmentById,
  getAnalytics,
  updateAssessmentAnalysis,
  createUser,
  getUserByEmail,
  attachAssessmentToUser,
} from "./db.js";
import { streamAssessmentPdf } from "./pdf.js";
import type { Quadrant, WizardFormData } from "./types.js";

const app = express();
const PORT = process.env.PORT ?? 3001;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? "http://localhost:5173";
const JWT_SECRET = process.env.JWT_SECRET ?? "change-me-in-production";

if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set");
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.warn("JWT_SECRET not set — using insecure default. Set it in .env for production.")
}

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ALLOWED_ORIGIN, methods: ["GET", "POST"], credentials: true }));

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

async function fetchAiAnalysis(formData: WizardFormData, quadrant: Quadrant): Promise<string> {
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  const geminiRes = await withRetry(() =>
    axios.post(geminiUrl, {
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: "user", parts: [{ text: buildUserPrompt(formData, quadrant) }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 1500 },
    })
  );
  const aiText = geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!aiText) {
    throw new Error("Empty AI response.");
  }
  return aiText;
}

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20,
  message: { error: "Too many auth attempts. Try again later." },
});

const registerSchema = z.object({
  name: z.string().min(1).max(120),
  company: z.string().max(120).optional(),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const IS_PROD = process.env.NODE_ENV === "production";
const COOKIE_NAME = "brite_auth";
const COOKIE_OPTS = {
  httpOnly: true,
  secure: IS_PROD,
  sameSite: (IS_PROD ? "strict" : "lax") as "strict" | "lax",
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
  path: "/",
};

function getAuthUserId(req: express.Request): string | null {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return null;
  try {
    return (jwt.verify(token, JWT_SECRET) as { sub: string }).sub;
  } catch {
    return null;
  }
}

function signToken(userId: string) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "30d" });
}

function userPayload(user: { id: string; name: string; company: string | null; email: string }) {
  return { id: user.id, name: user.name, company: user.company, email: user.email };
}

app.post("/api/auth/register", authLimiter, async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }

  const { name, company, email, password } = parsed.data;

  const existing = await getUserByEmail(email);
  if (existing) {
    res.status(409).json({ error: "Email already in use." });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await createUser({ name, company, email, passwordHash });

  res.cookie(COOKIE_NAME, signToken(user.id), COOKIE_OPTS);
  res.status(201).json({ user: userPayload(user) });
});

app.post("/api/auth/login", authLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const { email, password } = parsed.data;
  const user = await getUserByEmail(email);

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    res.status(401).json({ error: "Invalid email or password." });
    return;
  }

  res.cookie(COOKIE_NAME, signToken(user.id), COOKIE_OPTS);
  res.json({ user: userPayload(user) });
});

app.get("/api/auth/me", async (req, res) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) { res.status(401).json({ error: "Not authenticated." }); return; }

  let payload: { sub: string };
  try {
    payload = jwt.verify(token, JWT_SECRET) as { sub: string };
  } catch {
    res.clearCookie(COOKIE_NAME, { path: "/" });
    res.status(401).json({ error: "Session expired." });
    return;
  }

  const { getUserById } = await import("./db.js");
  const user = await getUserById(payload.sub);
  if (!user) { res.status(401).json({ error: "User not found." }); return; }

  res.json({ user: userPayload(user) });
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME, { path: "/" });
  res.json({ ok: true });
});

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
    aiAnalysis = await fetchAiAnalysis(formData, quadrant);
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

// Regenerate AI analysis for an existing assessment
app.post("/api/diagnose/:id/regenerate", diagnoseLimiter, async (req, res) => {
  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const assessment = await getAssessmentById(id);
  if (!assessment) {
    res.status(404).json({ error: "Assessment not found" });
    return;
  }

  let aiAnalysis = "";
  try {
    aiAnalysis = await fetchAiAnalysis(assessment.form_data, assessment.quadrant);
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
    const updated = await updateAssessmentAnalysis(id, aiAnalysis);
    res.json({
      id: updated.id,
      quadrant: updated.quadrant,
      ecosystemScore: updated.ecosystem_score,
      syncScore: updated.sync_score,
      aiAnalysis: updated.ai_analysis,
    });
  } catch (err) {
    console.error("DB update error:", err);
    res.json({
      id: assessment.id,
      quadrant: assessment.quadrant,
      ecosystemScore: assessment.ecosystem_score,
      syncScore: assessment.sync_score,
      aiAnalysis,
    });
  }
});

// Save an existing assessment to the authenticated account
app.post("/api/assessments/:id/save", async (req, res) => {
  const userId = getAuthUserId(req);
  if (!userId) {
    res.status(401).json({ error: "Not authenticated." });
    return;
  }

  const rawId = req.params.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const updated = await attachAssessmentToUser(id, userId);
  if (!updated) {
    res.status(404).json({ error: "Assessment not found." });
    return;
  }

  res.json({ ok: true });
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

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(moduleDir, "..", "..");
const distCandidates = [
  path.resolve(projectRoot, "dist"),
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
