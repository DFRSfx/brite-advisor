import { useEffect, useState } from "react";
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
import { getReportUrl, saveAssessmentToAccount } from "@/lib/gemini";
import { AuthModal } from "./AuthModal";
import { getSession, AuthUser } from "@/lib/auth";

const STEP_LABELS = ["Profile", "Ecosystem", "Sync", "Review"];

const variants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

export function WizardShell() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"register" | "login">("register");
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [saveInFlight, setSaveInFlight] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedToAccount, setSavedToAccount] = useState(false);
  const [pendingSave, setPendingSave] = useState(false);
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

  useEffect(() => {
    getSession().then(setCurrentUser);
  }, []);

  useEffect(() => {
    setSavedToAccount(false);
    setSaveError(null);
    setPendingSave(false);
  }, [diagnosis?.id]);

  const handleSaveToAccount = async (user?: AuthUser | null) => {
    if (!diagnosis?.id || saveInFlight || savedToAccount) return;
    const activeUser = user ?? currentUser;
    if (!activeUser) {
      setPendingSave(true);
      setAuthMode("login");
      setShowAuthModal(true);
      return;
    }

    setSaveError(null);
    setSaveInFlight(true);
    try {
      await saveAssessmentToAccount(diagnosis.id);
      setSavedToAccount(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save assessment.";
      setSaveError(msg);
    } finally {
      setSaveInFlight(false);
    }
  };

  if (diagnosis !== null) {
    const showActions = !diagnosis.loading;
    const resultContent = (
      <>
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
      </>
    );

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {showActions ? (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-6">{resultContent}</div>

            <div className="lg:sticky lg:top-24 h-fit">
              <div className="flex flex-col gap-4 border border-dashed rounded-xl p-4 bg-muted/20">
                {/* Primary Actions Group */}
                <div className="flex flex-col gap-3">
                  {diagnosis.id && (
                    <Button
                      className="w-full transition-all hover:-translate-y-0.5 hover:shadow-md"
                      onClick={() => handleSaveToAccount()}
                      disabled={saveInFlight || savedToAccount}
                    >
                      {savedToAccount ? "Saved to Account" : saveInFlight ? "Saving..." : "Save to Account"}
                    </Button>
                  )}
                  {diagnosis.id && (
                    <a
                      href={getReportUrl(diagnosis.id)}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full block"
                    >
                      <Button
                        variant="outline"
                        className="w-full bg-blue-50/50 hover:bg-blue-100 border-blue-200 text-blue-700 transition-all hover:-translate-y-0.5 hover:shadow-md"
                      >
                        ↓ Download PDF Report
                      </Button>
                    </a>
                  )}
                </div>

                {/* Utility Actions Group */}
                <div className="flex flex-col gap-3">
                  <Button
                    variant="secondary"
                    onClick={regenerate}
                    disabled={regenInFlight || regenCooldown > 0}
                    className="w-full transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    {regenInFlight
                      ? "Regenerating..."
                      : regenCooldown > 0
                        ? `Regenerate in ${regenCooldown}s`
                        : "↻ Regenerate Analysis"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={reset}
                    className="w-full text-muted-foreground hover:text-foreground transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    ↺ New Diagnosis
                  </Button>
                </div>

                {(regenError || saveError) && (
                  <Alert variant="destructive">
                    <AlertDescription>{saveError ?? regenError}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {resultContent}
          </div>
        )}

        <AuthModal
          open={showAuthModal}
          mode={authMode}
          onModeChange={setAuthMode}
          onClose={() => setShowAuthModal(false)}
          onSuccess={async (user) => {
            setCurrentUser(user);
            setShowAuthModal(false);
            if (pendingSave && diagnosis?.id) {
              setPendingSave(false);
              await handleSaveToAccount(user);
            }
          }}
          title="Save this report to your account"
          description="Create an account or sign in to keep this diagnosis in your dashboard."
          registerCta="Create Account & Save Report"
          loginCta="Sign In & Save Report"
        />
      </div>
    );
  }

  // Active Wizard State
  return (
    <div className="space-y-8 max-w-3xl mx-auto mt-4">
      
      {/* Moved the header here so it disappears when the result shows */}
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-semibold tracking-tight">Architecture Diagnostic</h2>
        <p className="text-muted-foreground text-sm">
          Answer 4 steps to receive your AI-powered architecture diagnosis.
        </p>
      </div>

      <div className="space-y-4">
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} labels={STEP_LABELS} />
        <Progress value={progress} className="h-2 rounded-full" />
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
                    className="w-full justify-center text-sm font-medium h-11"
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
