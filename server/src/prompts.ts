import { WizardFormData } from "./types.js";

export const SYSTEM_PROMPT = `
You are an expert IT architecture consultant specializing in the BRITE Framework
(Business-Referenced Integration Technology Election).

## BRITE Framework Knowledge

Two decision axes:
- Eixo X (Ecosystem Complexity): Linear ←→ Distributed/Omnichannel
- Eixo Y (Synchronization Demand): Asynchronous/Batch ←→ Critical/Real-Time

Four quadrants:
- Q1 (Basic): Linear + Batch → CSV files, Point-to-Point integrations
- Q2 (Agility): Linear + Real-Time → REST APIs, managed iPaaS
- Q3 (Legacy): Distributed + Batch → ESB/EDI, monolithic ERP
- Q4 (State of the Art): Distributed + Real-Time → Kafka, microservices, event-driven

Maturation path: Q1 → Q2 → Q4

## Response Rules

1. Start with a 1-2 sentence direct diagnosis summary
2. Use markdown headers (##) for each section
3. Bold all key technical terms and quadrant names
4. Include a markdown table for the recommended tech stack per architecture layer
5. Explain the reasoning behind the quadrant assignment
6. Mention data stewardship as a critical success factor
7. If the company is in Q1, Q2, or Q3, include a migration roadmap section
8. Never recommend over-engineering — match architecture to actual business need
9. Write in clear, professional English
10. Be thorough but concise — no filler sentences

## Tone
Senior IT consultant: analytical, pragmatic, direct.
`;

export function buildUserPrompt(data: WizardFormData, quadrant: string): string {
  return `
## Company Profile
- Industry: ${data.industry}
- Business Model: ${data.businessModel}
- Company Size: ${data.companySize}

## Ecosystem Complexity (Eixo X)
- Number of sales/service channels: ${data.numberOfChannels}
- Number of external integrations/partners: ${data.numberOfIntegrations}
- Omnichannel presence (physical + digital): ${data.hasOmnichannelPresence ? "Yes" : "No"}
- External partner network: ${data.hasExternalPartners ? "Yes" : "No"}

## Synchronization Demand (Eixo Y)
- Can tolerate batch/delayed data processing: ${data.toleratesLatency ? "Yes" : "No"}
- Requires real-time inventory visibility: ${data.needsRealTimeInventory ? "Yes" : "No"}
- Requires real-time personalization: ${data.needsRealTimePersonalization ? "Yes" : "No"}
- Has mission-critical transactions: ${data.hasMissionCriticalTransactions ? "Yes" : "No"}

## Pre-classified Quadrant
The deterministic classifier placed this company in: **${quadrant}**

Please provide a full BRITE Framework diagnosis including:
1. Diagnosis summary
2. Why this quadrant fits
3. Recommended architecture stack (with table by layer)
4. Data stewardship requirements
5. Migration roadmap (if not already in Q4)
`;
}
