export type Quadrant = "Q1" | "Q2" | "Q3" | "Q4";

export interface WizardFormData {
  companyName: string;
  industry: string;
  businessModel: "B2C" | "B2B" | "Hybrid";
  companySize: "Startup" | "SME" | "Enterprise";
  numberOfChannels: number;
  numberOfIntegrations: number;
  hasOmnichannelPresence: boolean;
  hasExternalPartners: boolean;
  toleratesLatency: boolean;
  needsRealTimeInventory: boolean;
  needsRealTimePersonalization: boolean;
  hasMissionCriticalTransactions: boolean;
}

export interface BriteDiagnosis {
  id: string | null;
  quadrant: Quadrant;
  ecosystemScore: number;
  syncScore: number;
  aiAnalysis: string;
  loading: boolean;
  error: string | null;
}

export interface AnalyticsData {
  quadrantCounts: Record<Quadrant, number>;
  allAssessments: {
    id: string;
    company_name: string;
    quadrant: Quadrant;
    ecosystem_score: number;
    sync_score: number;
    created_at: string;
  }[];
}
