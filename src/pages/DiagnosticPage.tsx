import { WizardShell } from "@/components/brite/WizardShell";

export function DiagnosticPage() {
  return (
    <div className="space-y-2">
      <div className="text-center space-y-1 mb-6">
        <p className="text-muted-foreground text-sm">
          Answer 4 steps to receive your AI-powered architecture diagnosis
        </p>
      </div>
      <WizardShell />
    </div>
  );
}
