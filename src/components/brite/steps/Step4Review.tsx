import React from "react";
import { WizardFormData } from "@/types/brite";
import { classifyQuadrant, calculateEcosystemScore, calculateSyncScore, QUADRANT_META } from "@/lib/briteClassifier";
import { Button } from "@/components/ui/button";
import { QuadrantBadge } from "../shared/QuadrantBadge";
import { cn } from "@/lib/utils";

interface Props {
  formData: Partial<WizardFormData>;
  onSubmit: () => void;
  onBack: () => void;
  renderSubmit?: () => React.ReactNode;
}

function ReviewRow({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center py-1.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={cn("text-sm font-medium", highlight && "text-primary")}>{value}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{title}</p>
      <div className="rounded-xl border bg-muted/30 px-4 divide-y">{children}</div>
    </div>
  );
}

export function Step4Review({ formData, onSubmit, onBack, renderSubmit }: Props) {
  const data = formData as WizardFormData;
  const quadrant = classifyQuadrant(data);
  const ecoScore = calculateEcosystemScore(data);
  const syncScore = calculateSyncScore(data);
  const meta = QUADRANT_META[quadrant];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card p-6 space-y-5 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold">Review & Submit</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Confirm your inputs before generating the AI diagnosis.</p>
        </div>

        <Section title="Company">
          <ReviewRow label="Name" value={data.companyName} />
          <ReviewRow label="Industry" value={data.industry} />
          <ReviewRow label="Business Model" value={data.businessModel} />
          <ReviewRow label="Size" value={data.companySize} />
        </Section>

        <Section title="Ecosystem (Eixo X)">
          <ReviewRow label="Channels" value={data.numberOfChannels} />
          <ReviewRow label="Integrations" value={data.numberOfIntegrations} />
          <ReviewRow label="Omnichannel" value={data.hasOmnichannelPresence ? "Yes" : "No"} />
          <ReviewRow label="External Partners" value={data.hasExternalPartners ? "Yes" : "No"} />
        </Section>

        <Section title="Synchronization (Eixo Y)">
          <ReviewRow label="Tolerates Latency" value={data.toleratesLatency ? "Yes" : "No"} />
          <ReviewRow label="Real-Time Inventory" value={data.needsRealTimeInventory ? "Yes" : "No"} />
          <ReviewRow label="Real-Time Personalization" value={data.needsRealTimePersonalization ? "Yes" : "No"} />
          <ReviewRow label="Mission-Critical" value={data.hasMissionCriticalTransactions ? "Yes" : "No"} />
        </Section>

        {/* Pre-classification preview */}
        <div
          className="rounded-xl p-4 flex items-center justify-between"
          style={{ backgroundColor: `${meta.chartColor}15`, borderLeft: `4px solid ${meta.chartColor}` }}
        >
          <div>
            <p className="text-xs text-muted-foreground mb-1">Pre-classification</p>
            <QuadrantBadge quadrant={quadrant} size="md" />
            <p className="text-xs text-muted-foreground mt-1">{meta.description}</p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-xs text-muted-foreground">Eco <span className="font-bold text-foreground">{ecoScore.toFixed(1)}</span></p>
            <p className="text-xs text-muted-foreground">Sync <span className="font-bold text-foreground">{syncScore.toFixed(1)}</span></p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" size="lg" onClick={onBack} className="flex-1">← Back</Button>
        {renderSubmit ? (
          <div className="flex-1">{renderSubmit()}</div>
        ) : (
          <Button size="lg" onClick={onSubmit} className="flex-1 bg-green-600 hover:bg-green-500">
            Get AI Diagnosis →
          </Button>
        )}
      </div>
    </div>
  );
}
