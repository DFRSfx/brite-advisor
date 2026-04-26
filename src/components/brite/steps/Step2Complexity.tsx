import React from "react";
import { useState } from "react";
import { WizardFormData } from "@/types/brite";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Globe, Network, Check, Minus, Plus } from "lucide-react";
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

function StepperField({
  label,
  description,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  description: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="rounded-xl bg-muted/40 border border-border/60 p-4 flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-xs text-muted-foreground/70 mt-0.5">{description}</p>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-8 h-8 rounded-full border-2 border-border flex items-center justify-center text-muted-foreground hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <motion.span
          key={value}
          initial={{ scale: 1.3, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          className="w-10 text-center text-lg font-bold text-indigo-600 tabular-nums"
        >
          {value}
        </motion.span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-8 h-8 rounded-full border-2 border-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 hover:bg-indigo-100 hover:border-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export function Step2Complexity({ defaultValues, onNext, onBack }: Props) {
  const [numberOfChannels, setNumberOfChannels] = useState(defaultValues.numberOfChannels ?? 1);
  const [numberOfIntegrations, setNumberOfIntegrations] = useState(defaultValues.numberOfIntegrations ?? 0);
  const [hasOmnichannelPresence, setHasOmnichannelPresence] = useState(defaultValues.hasOmnichannelPresence ?? false);
  const [hasExternalPartners, setHasExternalPartners] = useState(defaultValues.hasExternalPartners ?? false);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card p-6 space-y-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold">Ecosystem Complexity</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Eixo X — How distributed is your digital ecosystem?</p>
        </div>

        <div className="space-y-3">
          <StepperField
            label="Sales / Service Channels"
            description="How many distinct channels do you sell or serve through?"
            value={numberOfChannels}
            min={1}
            max={10}
            onChange={setNumberOfChannels}
          />
          <StepperField
            label="External Integrations / Partners"
            description="APIs, marketplaces, or systems you connect to externally"
            value={numberOfIntegrations}
            min={0}
            max={20}
            onChange={setNumberOfIntegrations}
          />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Presence &amp; Partners</p>
          <div className="space-y-3">
            <MotionToggleCard
              label="Omnichannel Presence"
              description="Physical + digital simultaneously"
              icon={Globe}
              checked={hasOmnichannelPresence}
              onChange={setHasOmnichannelPresence}
            />
            <MotionToggleCard
              label="External Partner Network"
              description="Suppliers, marketplaces, 3PLs"
              icon={Network}
              checked={hasExternalPartners}
              onChange={setHasExternalPartners}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" size="lg" onClick={onBack} className="flex-1">← Back</Button>
        <Button size="lg" onClick={() => onNext({ numberOfChannels, numberOfIntegrations, hasOmnichannelPresence, hasExternalPartners })} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white">Continue →</Button>
      </div>
    </div>
  );
}
