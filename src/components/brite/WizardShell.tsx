import { AnimatePresence, motion } from "framer-motion";
import { useBriteWizard } from "@/hooks/useBriteWizard";
import { StepIndicator } from "./shared/StepIndicator";
import { Step1Industry } from "./steps/Step1Industry";
import { Step2Complexity } from "./steps/Step2Complexity";
import { Step3Sync } from "./steps/Step3Sync";
import { Step4Review } from "./steps/Step4Review";
import { ResultCard } from "./results/ResultCard";
import { ArchMatrix } from "./results/ArchMatrix";
import { AIAnalysis } from "./results/AIAnalysis";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { getReportUrl } from "@/lib/gemini";

const STEP_LABELS = ["Profile", "Ecosystem", "Sync", "Review"];

const variants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

export function WizardShell() {
  const {
    currentStep,
    formData,
    diagnosis,
    totalSteps,
    updateFormData,
    next,
    back,
    reset,
    submitDiagnosis,
  } = useBriteWizard();

  const progress = (currentStep / totalSteps) * 100;

  const handleNext = (data: Parameters<typeof updateFormData>[0]) => {
    updateFormData(data);
    next();
  };

  if (diagnosis !== null) {
    return (
      <div className="space-y-6">
        <ResultCard diagnosis={diagnosis} />
        {!diagnosis.loading && (
          <ArchMatrix
            activeQuadrant={diagnosis.quadrant}
            ecosystemScore={diagnosis.ecosystemScore}
            syncScore={diagnosis.syncScore}
          />
        )}
        <AIAnalysis
          analysis={diagnosis.aiAnalysis}
          loading={diagnosis.loading}
          error={diagnosis.error}
        />
        {!diagnosis.loading && (
          <div className="flex gap-3">
            {diagnosis.id && (
              <a
                href={getReportUrl(diagnosis.id)}
                target="_blank"
                rel="noreferrer"
                className="flex-1"
              >
                <Button variant="outline" className="w-full">
                  ↓ Download PDF Report
                </Button>
              </a>
            )}
            <Button variant="outline" onClick={reset} className="flex-1">
              ↺ New Diagnosis
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} labels={STEP_LABELS} />
        <Progress value={progress} className="h-1.5" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          {currentStep === 1 && (
            <Step1Industry defaultValues={formData} onNext={handleNext} />
          )}
          {currentStep === 2 && (
            <Step2Complexity defaultValues={formData} onNext={handleNext} onBack={back} />
          )}
          {currentStep === 3 && (
            <Step3Sync defaultValues={formData} onNext={handleNext} onBack={back} />
          )}
          {currentStep === 4 && (
            <Step4Review
              formData={formData}
              onSubmit={submitDiagnosis}
              onBack={back}
              renderSubmit={() => (
                <ShimmerButton
                  background="rgba(22, 163, 74, 0.9)"
                  shimmerColor="#86efac"
                  borderRadius="8px"
                  className="w-full justify-center text-sm font-medium h-10"
                  type="button"
                  onClick={submitDiagnosis}
                >
                  Get AI Diagnosis →
                </ShimmerButton>
              )}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
