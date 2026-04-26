import { WizardFormData, Quadrant } from "@/types/brite";

export function calculateEcosystemScore(data: WizardFormData): number {
  let score = 0;
  score += Math.min(data.numberOfChannels * 1.5, 4);
  score += Math.min(data.numberOfIntegrations * 0.8, 3);
  if (data.hasOmnichannelPresence) score += 2;
  if (data.hasExternalPartners) score += 1;
  return Math.min(score, 10);
}

export function calculateSyncScore(data: WizardFormData): number {
  let score = 0;
  if (!data.toleratesLatency) score += 3;
  if (data.needsRealTimeInventory) score += 3;
  if (data.needsRealTimePersonalization) score += 2;
  if (data.hasMissionCriticalTransactions) score += 2;
  return Math.min(score, 10);
}

export function classifyQuadrant(data: WizardFormData): Quadrant {
  const eco = calculateEcosystemScore(data);
  const sync = calculateSyncScore(data);
  const isLinear = eco <= 5;
  const isBatch = sync <= 5;

  if (isLinear && isBatch) return "Q1";
  if (isLinear && !isBatch) return "Q2";
  if (!isLinear && isBatch) return "Q3";
  return "Q4";
}

export const QUADRANT_META = {
  Q1: {
    label: "Basic",
    color: "bg-slate-500",
    textColor: "text-slate-700",
    borderColor: "border-slate-500",
    chartColor: "#64748b",
    description: "Linear ecosystem, batch sync",
    techStack: "CSV files, Point-to-Point integrations",
  },
  Q2: {
    label: "Agility",
    color: "bg-blue-500",
    textColor: "text-blue-700",
    borderColor: "border-blue-500",
    chartColor: "#3b82f6",
    description: "Linear ecosystem, real-time sync",
    techStack: "REST APIs, managed iPaaS",
  },
  Q3: {
    label: "Legacy",
    color: "bg-amber-500",
    textColor: "text-amber-700",
    borderColor: "border-amber-500",
    chartColor: "#f59e0b",
    description: "Distributed ecosystem, batch sync",
    techStack: "ESB/EDI, monolithic ERP",
  },
  Q4: {
    label: "State of the Art",
    color: "bg-green-500",
    textColor: "text-green-700",
    borderColor: "border-green-500",
    chartColor: "#22c55e",
    description: "Distributed ecosystem, real-time sync",
    techStack: "Kafka, microservices, event-driven",
  },
} as const;
