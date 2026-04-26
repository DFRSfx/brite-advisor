import postgres from "postgres";
import { WizardFormData, Quadrant } from "./types.js";

const sql = postgres(process.env.DATABASE_URL!, {
  ssl: { rejectUnauthorized: false },
  max: 10,
});

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
