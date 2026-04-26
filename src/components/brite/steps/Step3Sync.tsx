import { useState } from "react";
import { WizardFormData } from "@/types/brite";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface Props {
  defaultValues: Partial<WizardFormData>;
  onNext: (data: Partial<WizardFormData>) => void;
  onBack: () => void;
}

export function Step3Sync({ defaultValues, onNext, onBack }: Props) {
  const [toleratesLatency, setToleratesLatency] = useState(
    defaultValues.toleratesLatency ?? true
  );
  const [needsRealTimeInventory, setNeedsRealTimeInventory] = useState(
    defaultValues.needsRealTimeInventory ?? false
  );
  const [needsRealTimePersonalization, setNeedsRealTimePersonalization] = useState(
    defaultValues.needsRealTimePersonalization ?? false
  );
  const [hasMissionCriticalTransactions, setHasMissionCriticalTransactions] = useState(
    defaultValues.hasMissionCriticalTransactions ?? false
  );

  const handleNext = () => {
    onNext({
      toleratesLatency,
      needsRealTimeInventory,
      needsRealTimePersonalization,
      hasMissionCriticalTransactions,
    });
  };

  const SwitchRow = ({
    label,
    description,
    checked,
    onChange,
  }: {
    label: string;
    description: string;
    checked: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label>{label}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Synchronization Demand</CardTitle>
        <CardDescription>Eixo Y — How real-time are your data requirements?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <SwitchRow
          label="Tolerates Latency"
          description="Batch/delayed processing is acceptable"
          checked={toleratesLatency}
          onChange={setToleratesLatency}
        />
        <Separator />
        <SwitchRow
          label="Real-Time Inventory"
          description="Live stock visibility required"
          checked={needsRealTimeInventory}
          onChange={setNeedsRealTimeInventory}
        />
        <Separator />
        <SwitchRow
          label="Real-Time Personalization"
          description="Dynamic content/offers based on live behavior"
          checked={needsRealTimePersonalization}
          onChange={setNeedsRealTimePersonalization}
        />
        <Separator />
        <SwitchRow
          label="Mission-Critical Transactions"
          description="Failures/delays cause significant business impact"
          checked={hasMissionCriticalTransactions}
          onChange={setHasMissionCriticalTransactions}
        />

        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} className="flex-1">
            ← Back
          </Button>
          <Button onClick={handleNext} className="flex-1">
            Next →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
