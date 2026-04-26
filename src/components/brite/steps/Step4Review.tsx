import { WizardFormData } from "@/types/brite";
import {
  classifyQuadrant,
  calculateEcosystemScore,
  calculateSyncScore,
  QUADRANT_META,
} from "@/lib/briteClassifier";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { QuadrantBadge } from "../shared/QuadrantBadge";

interface Props {
  formData: Partial<WizardFormData>;
  onSubmit: () => void;
  onBack: () => void;
  renderSubmit?: () => React.ReactNode;
}

import React from "react";

export function Step4Review({ formData, onSubmit, onBack, renderSubmit }: Props) {
  const data = formData as WizardFormData;
  const quadrant = classifyQuadrant(data);
  const ecoScore = calculateEcosystemScore(data);
  const syncScore = calculateSyncScore(data);
  const meta = QUADRANT_META[quadrant];

  const Row = ({ label, value }: { label: string; value: string | number }) => (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review & Submit</CardTitle>
        <CardDescription>Confirm your inputs and get your AI diagnosis.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
            Company
          </p>
          <Row label="Industry" value={data.industry} />
          <Row label="Business Model" value={data.businessModel} />
          <Row label="Company Size" value={data.companySize} />
        </div>

        <Separator />

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
            Ecosystem (Eixo X)
          </p>
          <Row label="Channels" value={data.numberOfChannels} />
          <Row label="Integrations" value={data.numberOfIntegrations} />
          <Row label="Omnichannel" value={data.hasOmnichannelPresence ? "Yes" : "No"} />
          <Row label="External Partners" value={data.hasExternalPartners ? "Yes" : "No"} />
        </div>

        <Separator />

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase text-muted-foreground tracking-wide">
            Synchronization (Eixo Y)
          </p>
          <Row label="Tolerates Latency" value={data.toleratesLatency ? "Yes" : "No"} />
          <Row label="Real-Time Inventory" value={data.needsRealTimeInventory ? "Yes" : "No"} />
          <Row
            label="Real-Time Personalization"
            value={data.needsRealTimePersonalization ? "Yes" : "No"}
          />
          <Row
            label="Mission-Critical"
            value={data.hasMissionCriticalTransactions ? "Yes" : "No"}
          />
        </div>

        <Separator />

        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <p className="text-sm font-semibold">Pre-classification Result</p>
          <div className="flex items-center gap-3">
            <QuadrantBadge quadrant={quadrant} size="lg" />
          </div>
          <p className="text-sm text-muted-foreground">{meta.description}</p>
          <div className="flex gap-4 text-sm">
            <span>
              Ecosystem score: <strong>{ecoScore.toFixed(1)}/10</strong>
            </span>
            <span>
              Sync score: <strong>{syncScore.toFixed(1)}/10</strong>
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} className="flex-1">
            ← Back
          </Button>
          {renderSubmit ? (
            <div className="flex-1">{renderSubmit()}</div>
          ) : (
            <Button onClick={onSubmit} className="flex-1 bg-green-600 hover:bg-green-700">
              Get AI Diagnosis →
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
