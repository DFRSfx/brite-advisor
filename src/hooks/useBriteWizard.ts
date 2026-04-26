import { useState } from "react";
import { WizardFormData, BriteDiagnosis } from "@/types/brite";
import { fetchBriteDiagnosis, regenerateDiagnosis } from "@/lib/gemini";

const TOTAL_STEPS = 4;

const DEFAULT_FORM: Partial<WizardFormData> = {
  companyName: "",
  numberOfChannels: 1,
  numberOfIntegrations: 0,
  hasOmnichannelPresence: false,
  hasExternalPartners: false,
  toleratesLatency: true,
  needsRealTimeInventory: false,
  needsRealTimePersonalization: false,
  hasMissionCriticalTransactions: false,
};

export function useBriteWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<WizardFormData>>(DEFAULT_FORM);
  const [diagnosis, setDiagnosis] = useState<BriteDiagnosis | null>(null);
  const [regenCooldown, setRegenCooldown] = useState(0);
  const [regenInFlight, setRegenInFlight] = useState(false);
  const [regenError, setRegenError] = useState<string | null>(null);

  const updateFormData = (data: Partial<WizardFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const next = () => setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const back = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const reset = () => {
    setCurrentStep(1);
    setDiagnosis(null);
    setFormData(DEFAULT_FORM);
    setRegenCooldown(0);
    setRegenInFlight(false);
    setRegenError(null);
  };

  const submitDiagnosis = async () => {
    const data = formData as WizardFormData;

    setDiagnosis({ id: null, quadrant: "Q1", ecosystemScore: 0, syncScore: 0, aiAnalysis: "", loading: true, error: null });

    try {
      const result = await fetchBriteDiagnosis(data);
      setDiagnosis({ ...result, loading: false, error: null });
    } catch {
      setDiagnosis((prev) =>
        prev ? { ...prev, loading: false, error: "Failed to fetch AI diagnosis." } : null
      );
    }
  };

  const startCooldown = (seconds: number) => {
    setRegenCooldown(seconds);
    const timer = setInterval(() => {
      setRegenCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const regenerate = async () => {
    if (!diagnosis?.id || regenInFlight || regenCooldown > 0) return;
    setRegenError(null);
    setRegenInFlight(true);
    startCooldown(15);
    try {
      const result = await regenerateDiagnosis(diagnosis.id);
      setDiagnosis({ ...result, loading: false, error: null });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to regenerate AI diagnosis.";
      setRegenError(msg);
    } finally {
      setRegenInFlight(false);
    }
  };

  return {
    currentStep,
    formData,
    diagnosis,
    totalSteps: TOTAL_STEPS,
    updateFormData,
    next,
    back,
    reset,
    submitDiagnosis,
    regenerate,
    regenCooldown,
    regenInFlight,
    regenError,
  };
}
