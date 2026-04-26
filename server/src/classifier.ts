import { WizardFormData, Quadrant } from "./types.js";

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

export function classifyQuadrant(ecosystemScore: number, syncScore: number): Quadrant {
  const isLinear = ecosystemScore <= 5;
  const isBatch = syncScore <= 5;

  if (isLinear && isBatch) return "Q1";
  if (isLinear && !isBatch) return "Q2";
  if (!isLinear && isBatch) return "Q3";
  return "Q4";
}
