import axios from "axios";
import { WizardFormData, BriteDiagnosis, AnalyticsData } from "@/types/brite";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

export async function fetchBriteDiagnosis(
  data: WizardFormData
): Promise<Omit<BriteDiagnosis, "loading" | "error">> {
  const { companyName, ...formData } = data;
  const response = await axios.post<Omit<BriteDiagnosis, "loading" | "error">>(
    `${API_BASE}/api/diagnose`,
    { companyName, formData }
  );
  return response.data;
}

export async function fetchAnalytics(): Promise<AnalyticsData> {
  const response = await axios.get<AnalyticsData>(`${API_BASE}/api/analytics`);
  return response.data;
}

export function getReportUrl(id: string): string {
  return `${API_BASE}/api/report/${id}`;
}
