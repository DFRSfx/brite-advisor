import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  return (
    <div className="flex items-center w-full py-2">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isCompleted = step < currentStep;
        const isCurrent = step === currentStep;

        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200",
                  isCompleted && "bg-primary text-primary-foreground shadow-md",
                  isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/25 scale-110 shadow-lg",
                  !isCompleted && !isCurrent && "bg-muted text-muted-foreground border-2 border-border"
                )}
              >
                {isCompleted ? <Check className="w-5 h-5" strokeWidth={2.5} /> : step}
              </div>
              <span
                className={cn(
                  "text-xs font-semibold hidden sm:block whitespace-nowrap",
                  isCurrent ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {labels[i]}
              </span>
            </div>
            {step < totalSteps && (
              <div className={cn("flex-1 h-0.5 mx-3 rounded-full transition-colors duration-300", step < currentStep ? "bg-primary" : "bg-border")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
