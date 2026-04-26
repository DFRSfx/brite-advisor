import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { WizardFormData } from "@/types/brite";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Users, Building2, Rocket, Store, Handshake, Check } from "lucide-react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";

const LabeledInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input"> & { id: string; label: string; error?: string }>(
  ({ id, label, placeholder, error, ...props }, ref) => (
    <div className="space-y-1.5 group">
      <label
        htmlFor={id}
        className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors duration-150 group-focus-within:text-indigo-500"
      >
        {label}
      </label>
      <Input id={id} ref={ref} placeholder={placeholder} className="h-10" {...props} />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
);

const schema = z.object({
  companyName: z.string().min(2, "Enter company name"),
  industry: z.string().min(2, "Enter your industry"),
  businessModel: z.enum(["B2C", "B2B", "Hybrid"]),
  companySize: z.enum(["Startup", "SME", "Enterprise"]),
});

type FormValues = Pick<WizardFormData, "companyName" | "industry" | "businessModel" | "companySize">;

interface Props {
  defaultValues: Partial<WizardFormData>;
  onNext: (data: Partial<WizardFormData>) => void;
}

const BIZ_MODEL_OPTIONS = [
  { value: "B2C", label: "B2C", desc: "Direct to consumers", icon: Store },
  { value: "B2B", label: "B2B", desc: "Business clients", icon: Handshake },
  { value: "Hybrid", label: "Hybrid", desc: "Both markets", icon: Users },
] as const;

const SIZE_OPTIONS = [
  { value: "Startup", label: "Startup", desc: "< 50 people", icon: Rocket },
  { value: "SME", label: "SME", desc: "50–500 people", icon: Users },
  { value: "Enterprise", label: "Enterprise", desc: "500+ people", icon: Building2 },
] as const;

export function Step1Industry({ defaultValues, onNext }: Props) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: defaultValues.companyName ?? "",
      industry: defaultValues.industry ?? "",
      businessModel: defaultValues.businessModel ?? "B2B",
      companySize: defaultValues.companySize ?? "SME",
    },
  });

  const businessModel = watch("businessModel");
  const companySize = watch("companySize");

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="rounded-2xl border bg-card p-6 space-y-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold">Company Profile</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Tell us about your business context.</p>
        </div>

        {/* Text inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <LabeledInput
            id="companyName"
            label="Company Name"
            placeholder="Acme Corp"
            error={errors.companyName?.message}
            {...register("companyName")}
          />
          <LabeledInput
            id="industry"
            label="Industry"
            placeholder="Retail, Healthcare…"
            error={errors.industry?.message}
            {...register("industry")}
          />
        </div>

        {/* Business model tiles */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Business Model</Label>
          <div className="grid grid-cols-3 gap-2">
            {BIZ_MODEL_OPTIONS.map(({ value, label, desc, icon: Icon }) => {
              const selected = businessModel === value;
              return (
                <motion.button
                  key={value}
                  type="button"
                  onClick={() => setValue("businessModel", value)}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  animate={selected ? { scale: 1.02 } : { scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={cn(
                    "relative rounded-xl border-2 p-3 text-left cursor-pointer",
                    selected
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 shadow-md"
                      : "border-border bg-background hover:border-indigo-300 hover:bg-muted/50"
                  )}
                >
                  {selected && (
                    <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                    </span>
                  )}
                  <Icon className={cn("w-4 h-4 mb-1.5 transition-colors", selected ? "text-indigo-600" : "text-muted-foreground")} />
                  <p className={cn("text-sm font-semibold transition-colors", selected ? "text-indigo-700 dark:text-indigo-300" : "text-foreground")}>{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Company size tiles */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Company Size</Label>
          <div className="grid grid-cols-3 gap-2">
            {SIZE_OPTIONS.map(({ value, label, desc, icon: Icon }) => {
              const selected = companySize === value;
              return (
                <motion.button
                  key={value}
                  type="button"
                  onClick={() => setValue("companySize", value)}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  animate={selected ? { scale: 1.02 } : { scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={cn(
                    "relative rounded-xl border-2 p-3 text-left cursor-pointer",
                    selected
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 shadow-md"
                      : "border-border bg-background hover:border-indigo-300 hover:bg-muted/50"
                  )}
                >
                  {selected && (
                    <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                    </span>
                  )}
                  <Icon className={cn("w-4 h-4 mb-1.5 transition-colors", selected ? "text-indigo-600" : "text-muted-foreground")} />
                  <p className={cn("text-sm font-semibold transition-colors", selected ? "text-indigo-700 dark:text-indigo-300" : "text-foreground")}>{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full">
        Continue →
      </Button>
    </form>
  );
}
