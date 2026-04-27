import postgres from "postgres";
import { WizardFormData, Quadrant } from "./types.js";

export interface User {
  id: string;
  name: string;
  company: string | null;
  email: string;
  password_hash: string;
  created_at: string;
}

const sql = postgres(process.env.DATABASE_URL!, {
  ssl: { rejectUnauthorized: false },
  max: 10,
});

// Ensure users table exists
await sql`
  CREATE EXTENSION IF NOT EXISTS "pgcrypto"
`;
await sql`
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    company TEXT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )
`;
await sql`
  CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    company_name TEXT NOT NULL,
    industry TEXT NOT NULL,
    business_model TEXT NOT NULL,
    company_size TEXT NOT NULL,
    quadrant TEXT NOT NULL,
    ecosystem_score DOUBLE PRECISION NOT NULL,
    sync_score DOUBLE PRECISION NOT NULL,
    form_data JSONB NOT NULL,
    ai_analysis TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )
`;
await sql`
  ALTER TABLE assessments
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL
`;
await sql`
  ALTER TABLE assessments
  ALTER COLUMN ecosystem_score TYPE DOUBLE PRECISION USING ecosystem_score::double precision,
  ALTER COLUMN sync_score TYPE DOUBLE PRECISION USING sync_score::double precision
`;

export async function createUser(params: {
  name: string;
  company?: string;
  email: string;
  passwordHash: string;
}): Promise<User> {
  const [row] = await sql<User[]>`
    INSERT INTO users (name, company, email, password_hash)
    VALUES (${params.name}, ${params.company ?? null}, ${params.email}, ${params.passwordHash})
    RETURNING *
  `;
  return row;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const rows = await sql<User[]>`
    SELECT * FROM users WHERE email = ${email} LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function getUserById(id: string): Promise<User | null> {
  const rows = await sql<User[]>`
    SELECT * FROM users WHERE id = ${id} LIMIT 1
  `;
  return rows[0] ?? null;
}

export interface Assessment {
  id: string;
  company_name: string;
  industry: string;
  business_model: string;
  company_size: string;
  quadrant: Quadrant;
  ecosystem_score: number;
  sync_score: number;
  form_data: WizardFormData;
  ai_analysis: string;
  created_at: string;
}

export async function saveAssessment(params: {
  companyName: string;
  formData: WizardFormData;
  quadrant: Quadrant;
  ecosystemScore: number;
  syncScore: number;
  aiAnalysis: string;
}): Promise<Assessment> {
  const [row] = await sql<Assessment[]>`
    INSERT INTO assessments (
      company_name, industry, business_model, company_size,
      quadrant, ecosystem_score, sync_score, form_data, ai_analysis
    ) VALUES (
      ${params.companyName},
      ${params.formData.industry},
      ${params.formData.businessModel},
      ${params.formData.companySize},
      ${params.quadrant},
      ${params.ecosystemScore},
      ${params.syncScore},
      ${JSON.stringify(params.formData)},
      ${params.aiAnalysis}
    )
    RETURNING *
  `;
  return row;
}

export async function getAssessmentById(id: string): Promise<Assessment | null> {
  const rows = await sql<Assessment[]>`
    SELECT * FROM assessments WHERE id = ${id} LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function updateAssessmentAnalysis(id: string, aiAnalysis: string): Promise<Assessment> {
  const [row] = await sql<Assessment[]>`
    UPDATE assessments
    SET ai_analysis = ${aiAnalysis}
    WHERE id = ${id}
    RETURNING *
  `;
  return row;
}

export async function attachAssessmentToUser(id: string, userId: string): Promise<Assessment | null> {
  const [row] = await sql<Assessment[]>`
    UPDATE assessments
    SET user_id = ${userId}
    WHERE id = ${id}
    RETURNING *
  `;
  return row ?? null;
}

export async function getAnalytics(): Promise<{
  quadrantCounts: Record<Quadrant, number>;
  allAssessments: Pick<
    Assessment,
    "id" | "company_name" | "quadrant" | "ecosystem_score" | "sync_score" | "created_at"
  >[];
}> {
  const rows = await sql<
    Pick<Assessment, "id" | "company_name" | "quadrant" | "ecosystem_score" | "sync_score" | "created_at">[]
  >`
    SELECT id, company_name, quadrant, ecosystem_score, sync_score, created_at
    FROM assessments
    ORDER BY created_at DESC
  `;

  const counts: Record<Quadrant, number> = { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };
  for (const row of rows) {
    counts[row.quadrant]++;
  }

  return { quadrantCounts: counts, allAssessments: rows };
}
