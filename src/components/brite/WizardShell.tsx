import { useState } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getReportUrl } from "@/lib/gemini";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const STEP_LABELS = ["Profile", "Ecosystem", "Sync", "Review"];

const variants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

export function WizardShell() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"register" | "login">("register");
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
    regenerate,
    regenCooldown,
    regenInFlight,
    regenError,
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
          <div className="flex flex-wrap gap-3">
            {diagnosis.id && (
              <a
                href={getReportUrl(diagnosis.id)}
                target="_blank"
                rel="noreferrer"
                className="flex-1 min-w-[180px]"
              >
                <Button variant="outline" className="w-full">
                  ↓ Download PDF Report
                </Button>
              </a>
            )}
            {diagnosis.id && (
              <Button
                className="flex-1 min-w-[180px]"
                onClick={() => setShowAuthModal(true)}
              >
                Save to Account
              </Button>
            )}
            <Button
              variant="secondary"
              onClick={regenerate}
              disabled={regenInFlight || regenCooldown > 0}
              className="flex-1 min-w-[180px]"
            >
              {regenInFlight
                ? "Regenerating..."
                : regenCooldown > 0
                  ? `Regenerate in ${regenCooldown}s`
                  : "↻ Regenerate AI Analysis"}
            </Button>
            <Button variant="outline" onClick={reset} className="flex-1 min-w-[180px]">
              ↺ New Diagnosis
            </Button>
          </div>
        )}
        {regenError && (
          <Alert variant="destructive">
            <AlertDescription>{regenError}</AlertDescription>
          </Alert>
        )}
        {showAuthModal && (
          <div className="fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowAuthModal(false)}
            />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="relative w-full max-w-4xl rounded-2xl border bg-card p-6 shadow-xl">
                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="space-y-1">
                  <h2 className="text-xl font-semibold">Save this report to your account</h2>
                  <p className="text-sm text-muted-foreground">
                    Create an account or sign in to keep this diagnosis in your dashboard.
                  </p>
                </div>

                <div className="mt-6 rounded-2xl border bg-card p-6 shadow-sm space-y-6">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAuthMode("register")}
                      className={cn(
                        "rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-colors",
                        authMode === "register"
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300"
                          : "border-border bg-background text-foreground hover:border-indigo-300 hover:bg-muted/50"
                      )}
                    >
                      Create account
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode("login")}
                      className={cn(
                        "rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-colors",
                        authMode === "login"
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300"
                          : "border-border bg-background text-foreground hover:border-indigo-300 hover:bg-muted/50"
                      )}
                    >
                      Sign in
                    </button>
                  </div>

                  {authMode === "register" ? (
                    <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5 group">
                          <label
                            htmlFor="register-name"
                            className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors duration-150 group-focus-within:text-indigo-500"
                          >
                            Full name
                          </label>
                          <Input id="register-name" placeholder="Jane Doe" className="h-10" />
                        </div>
                        <div className="space-y-1.5 group">
                          <label
                            htmlFor="register-company"
                            className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors duration-150 group-focus-within:text-indigo-500"
                          >
                            Company
                          </label>
                          <Input id="register-company" placeholder="Acme Corp" className="h-10" />
                        </div>
                      </div>
                      <div className="space-y-1.5 group">
                        <label
                          htmlFor="register-email"
                          className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors duration-150 group-focus-within:text-indigo-500"
                        >
                          Email
                        </label>
                        <Input id="register-email" type="email" placeholder="you@company.com" className="h-10" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5 group">
                          <label
                            htmlFor="register-password"
                            className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors duration-150 group-focus-within:text-indigo-500"
                          >
                            Password
                          </label>
                          <Input id="register-password" type="password" placeholder="••••••••" className="h-10" />
                        </div>
                        <div className="space-y-1.5 group">
                          <label
                            htmlFor="register-confirm"
                            className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors duration-150 group-focus-within:text-indigo-500"
                          >
                            Confirm password
                          </label>
                          <Input id="register-confirm" type="password" placeholder="••••••••" className="h-10" />
                        </div>
                      </div>
                      <Button type="submit" size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                        Create Account & Save Report
                      </Button>
                    </form>
                  ) : (
                    <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
                      <div className="space-y-1.5 group">
                        <label
                          htmlFor="login-email"
                          className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors duration-150 group-focus-within:text-indigo-500"
                        >
                          Email
                        </label>
                        <Input id="login-email" type="email" placeholder="you@company.com" className="h-10" />
                      </div>
                      <div className="space-y-1.5 group">
                        <label
                          htmlFor="login-password"
                          className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors duration-150 group-focus-within:text-indigo-500"
                        >
                          Password
                        </label>
                        <Input id="login-password" type="password" placeholder="••••••••" className="h-10" />
                      </div>
                      <Button type="submit" size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                        Sign In & Save Report
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </div>
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
