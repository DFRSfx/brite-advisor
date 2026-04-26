import React from "react";
import { WizardFormData } from "@/types/brite";
import { classifyQuadrant, calculateEcosystemScore, calculateSyncScore, QUADRANT_META } from "@/lib/briteClassifier";
import { Button } from "@/components/ui/button";
import { QuadrantBadge } from "../shared/QuadrantBadge";
import { cn } from "@/lib/utils";
import { Building2, Network, RefreshCw, Sparkles } from "lucide-react";

interface Props {
  formData: Partial<WizardFormData>;
  onSubmit: () => void;
  onBack: () => void;
  renderSubmit?: () => React.ReactNode;
}

function ReviewRow({ label, value, pill }: { label: string; value: string | number; pill?: boolean }) {
  const isYes = value === "Yes";
  const isNo = value === "No";
  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      {pill && (isYes || isNo) ? (
        <span className={cn(
          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold",
          isYes
            ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
            : "bg-muted text-muted-foreground"
        )}>
          {value}
        </span>
      ) : (
        <span className="text-sm font-semibold text-foreground">{value}</span>
      )}
    </div>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 mb-2">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      </div>
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
          <h2 className="text-lg font-semibold">Review &amp; Submit</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Confirm your inputs before generating the AI diagnosis.</p>
        </div>

        <Section title="Company" icon={Building2}>
          <ReviewRow label="Name" value={data.companyName} />
          <ReviewRow label="Industry" value={data.industry} />
          <ReviewRow label="Business Model" value={data.businessModel} />
          <ReviewRow label="Size" value={data.companySize} />
        </Section>

        <Section title="Ecosystem — Eixo X" icon={Network}>
          <ReviewRow label="Channels" value={data.numberOfChannels} />
          <ReviewRow label="Integrations" value={data.numberOfIntegrations} />
          <ReviewRow label="Omnichannel" value={data.hasOmnichannelPresence ? "Yes" : "No"} pill />
          <ReviewRow label="External Partners" value={data.hasExternalPartners ? "Yes" : "No"} pill />
        </Section>

        <Section title="Synchronization — Eixo Y" icon={RefreshCw}>
          <ReviewRow label="Tolerates Latency" value={data.toleratesLatency ? "Yes" : "No"} pill />
          <ReviewRow label="Real-Time Inventory" value={data.needsRealTimeInventory ? "Yes" : "No"} pill />
          <ReviewRow label="Real-Time Personalization" value={data.needsRealTimePersonalization ? "Yes" : "No"} pill />
          <ReviewRow label="Mission-Critical" value={data.hasMissionCriticalTransactions ? "Yes" : "No"} pill />
        </Section>

        {/* Pre-classification preview */}
        <div className="rounded-xl border-2 border-indigo-200 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-950/30 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">Pre-classification</p>
              </div>
              <QuadrantBadge quadrant={quadrant} size="md" />
              <p className="text-xs text-muted-foreground max-w-[220px]">{meta.description}</p>
            </div>
            <div className="text-right space-y-2 flex-shrink-0">
              <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Ecosystem</p>
                <p className="text-xl font-bold text-indigo-600 tabular-nums">{ecoScore.toFixed(1)}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Sync</p>
                <p className="text-xl font-bold text-indigo-600 tabular-nums">{syncScore.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" size="lg" onClick={onBack} className="flex-1">← Back</Button>
        {renderSubmit ? (
          <div className="flex-1">{renderSubmit()}</div>
        ) : (
          <Button size="lg" onClick={onSubmit} className="flex-1 bg-green-600 hover:bg-green-500 text-white">
            Get AI Diagnosis →
          </Button>
        )}
      </div>
    </div>
  );
}
