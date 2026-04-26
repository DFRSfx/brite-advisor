import React, { useState } from "react";
import { WizardFormData } from "@/types/brite";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Clock, Package, Sparkles, Zap, Check } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  defaultValues: Partial<WizardFormData>;
  onNext: (data: Partial<WizardFormData>) => void;
  onBack: () => void;
}

function MotionToggleCard({
  label,
  description,
  icon: Icon,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  icon: React.ElementType;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={() => onChange(!checked)}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.97 }}
      animate={checked ? { scale: 1.01 } : { scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "relative w-full rounded-xl border-2 p-4 text-left flex items-center gap-4 transition-colors duration-150",
        checked
          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 shadow-md"
          : "border-border bg-background hover:border-indigo-300 hover:bg-muted/50"
      )}
    >
      {checked && (
        <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
          <Check className="w-3 h-3 text-white" strokeWidth={3} />
        </span>
      )}
      <div className={cn("rounded-lg p-2 flex-shrink-0 transition-colors", checked ? "bg-indigo-100 dark:bg-indigo-900/40" : "bg-muted")}>
        <Icon className={cn("w-4 h-4 transition-colors", checked ? "text-indigo-600" : "text-muted-foreground")} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-semibold transition-colors", checked ? "text-indigo-700 dark:text-indigo-300" : "text-foreground")}>{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
    </motion.button>
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
          <MotionToggleCard
            label="Tolerates Latency"
            description="Batch or delayed processing is acceptable"
            icon={Clock}
            checked={toleratesLatency}
            onChange={setToleratesLatency}
          />
          <MotionToggleCard
            label="Real-Time Inventory"
            description="Live stock visibility required at all times"
            icon={Package}
            checked={needsRealTimeInventory}
            onChange={setNeedsRealTimeInventory}
          />
          <MotionToggleCard
            label="Real-Time Personalization"
            description="Dynamic content based on live behavior"
            icon={Sparkles}
            checked={needsRealTimePersonalization}
            onChange={setNeedsRealTimePersonalization}
          />
          <MotionToggleCard
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
        <Button
          size="lg"
          onClick={() => onNext({ toleratesLatency, needsRealTimeInventory, needsRealTimePersonalization, hasMissionCriticalTransactions })}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Continue →
        </Button>
      </div>
    </div>
  );
}
