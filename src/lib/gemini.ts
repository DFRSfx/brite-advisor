import axios from "axios";
import { WizardFormData, BriteDiagnosis, AnalyticsData } from "@/types/brite";

const DEFAULT_API_BASE =
  typeof window !== "undefined"
    ? (import.meta.env.DEV ? "http://localhost:3001" : window.location.origin)
    : "http://localhost:3001";
const API_BASE = import.meta.env.VITE_API_URL ?? DEFAULT_API_BASE;

export async function fetchBriteDiagnosis(
  data: WizardFormData
): Promise<Omit<BriteDiagnosis, "loading" | "error">> {
  const { companyName, ...formData } = data;
  try {
    const response = await axios.post<Omit<BriteDiagnosis, "loading" | "error">>(
      `${API_BASE}/api/diagnose`,
      { companyName, formData }
    );
    return response.data;
  } catch (err: any) {
    const msg = err?.response?.data?.error;
    throw new Error(msg ?? "Failed to fetch AI diagnosis.");
  }
}

export async function regenerateDiagnosis(
  id: string
): Promise<Omit<BriteDiagnosis, "loading" | "error">> {
  try {
    const response = await axios.post<Omit<BriteDiagnosis, "loading" | "error">>(
      `${API_BASE}/api/diagnose/${id}/regenerate`
    );
    return response.data;
  } catch (err: any) {
    const msg = err?.response?.data?.error;
    throw new Error(msg ?? "Failed to regenerate AI diagnosis.");
  }
}

export async function fetchAnalytics(): Promise<AnalyticsData> {
  const response = await axios.get<AnalyticsData>(`${API_BASE}/api/analytics`);
  return response.data;
}

export async function saveAssessmentToAccount(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/assessments/${id}/save`, {
    method: "POST",
    credentials: "include",
  });
  let data: { error?: string } | null = null;
  try {
    data = (await res.json()) as { error?: string };
  } catch {
    data = null;
  }
  if (!res.ok) {
    throw new Error(data?.error ?? "Failed to save assessment.");
  }
}

export function getReportUrl(id: string): string {
  return `${API_BASE}/api/report/${id}`;
}
