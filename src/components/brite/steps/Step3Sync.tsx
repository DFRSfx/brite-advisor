import { useState } from "react";
import { WizardFormData } from "@/types/brite";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Clock, Package, Sparkles, Zap } from "lucide-react";

interface Props {
  defaultValues: Partial<WizardFormData>;
  onNext: (data: Partial<WizardFormData>) => void;
  onBack: () => void;
}

function ToggleCard({
  label,
  description,
  icon: Icon,
  checked,
  onChange,
  accent,
}: {
  label: string;
  description: string;
  icon: React.ElementType;
  checked: boolean;
  onChange: (v: boolean) => void;
  accent?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "w-full rounded-xl border-2 p-4 text-left flex items-center gap-4 transition-all duration-150",
        checked ? "border-primary bg-primary/5" : "border-border bg-background hover:border-primary/40"
      )}
    >
      <div className={cn("rounded-lg p-2 flex-shrink-0", checked ? "bg-primary/10" : "bg-muted")}>
        <Icon className={cn("w-4 h-4", checked ? "text-primary" : "text-muted-foreground")} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-semibold", checked ? "text-primary" : "text-foreground")}>{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <div className={cn(
        "w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors",
        checked ? "border-primary bg-primary" : "border-muted-foreground/40"
      )}>
        {checked && <div className="w-2 h-2 rounded-full bg-white" />}
      </div>
    </button>
  );
}

export function Step3Sync({ defaultValues, onNext, onBack }: Props) {
  const [toleratesLatency, setToleratesLatency] = useState(defaultValues.toleratesLatency ?? true);
  const [needsRealTimeInventory, setNeedsRealTimeInventory] = useState(defaultValues.needsRealTimeInventory ?? false);
  const [needsRealTimePersonalization, setNeedsRealTimePersonalization] = useState(defaultValues.needsRealTimePersonalization ?? false);
  const [hasMissionCriticalTransactions, setHasMissionCriticalTransactions] = useState(defaultValues.hasMissionCriticalTransactions ?? false);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card p-6 space-y-4 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold">Synchronization Demand</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Eixo Y — How real-time are your data requirements?</p>
        </div>

        <div className="space-y-3">
          <ToggleCard
            label="Tolerates Latency"
            description="Batch or delayed processing is acceptable"
            icon={Clock}
            checked={toleratesLatency}
            onChange={setToleratesLatency}
          />
          <ToggleCard
            label="Real-Time Inventory"
            description="Live stock visibility required at all times"
            icon={Package}
            checked={needsRealTimeInventory}
            onChange={setNeedsRealTimeInventory}
          />
          <ToggleCard
            label="Real-Time Personalization"
            description="Dynamic content based on live behavior"
            icon={Sparkles}
            checked={needsRealTimePersonalization}
            onChange={setNeedsRealTimePersonalization}
          />
          <ToggleCard
            label="Mission-Critical Transactions"
            description="Failures or delays cause significant business impact"
            icon={Zap}
            checked={hasMissionCriticalTransactions}
            onChange={setHasMissionCriticalTransactions}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" size="lg" onClick={onBack} className="flex-1">← Back</Button>
        <Button size="lg" onClick={() => onNext({ toleratesLatency, needsRealTimeInventory, needsRealTimePersonalization, hasMissionCriticalTransactions })} className="flex-1">
          Continue →
        </Button>
      </div>
    </div>
  );
}
