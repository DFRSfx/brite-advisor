export interface WizardFormData {
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

export type Quadrant = "Q1" | "Q2" | "Q3" | "Q4";
