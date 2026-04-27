import { Routes, Route, Link, useLocation } from "react-router-dom";
import { DiagnosticPage } from "@/pages/DiagnosticPage";
import { AnalyticsPage } from "@/pages/AnalyticsPage";
import { TermsPage } from "@/pages/TermsPage";
import { PrivacyPage } from "@/pages/PrivacyPage";
import { Meteors } from "@/components/magicui/meteors";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { cn } from "@/lib/utils";

function MainLayout() {
  const location = useLocation();
  const page = location.pathname === "/analytics" ? "analytics" : "diagnostic";

  return (
    <div className="min-h-screen bg-background">
      {/* Hero header */}
      <div className="relative overflow-hidden bg-zinc-950 text-white">
        <Meteors number={20} />
        <div className="relative z-10 max-w-2xl mx-auto px-4 pt-12 pb-10 text-center">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 mb-5">
            <AnimatedShinyText
              className="text-xs font-medium text-white/70"
              shimmerWidth={80}
            >
              BRITE Framework Diagnostic Tool
            </AnimatedShinyText>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
            <span className="bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
              BRITE Advisor
            </span>
          </h1>

          <p className="text-white/50 text-sm max-w-sm mx-auto leading-relaxed">
            Business-Referenced Integration Technology Election —
            AI-powered architecture diagnosis in 4 steps
          </p>

          <div className="flex justify-center gap-2 mt-6">
            <Link
              to="/"
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                page === "diagnostic"
                  ? "bg-white text-zinc-900"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              )}
            >
              Diagnostic
            </Link>
            <Link
              to="/analytics"
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                page === "analytics"
                  ? "bg-white text-zinc-900"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              )}
            >
              Analytics
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<DiagnosticPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </div>
    </div>
  );
}

function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border px-4 py-3 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-1 py-1.5"
        >
          <span className="transition-transform duration-200 group-hover:-translate-x-0.5">&#8592;</span>
          <span className="relative">
            Back to BRITE Advisor
            <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
          </span>
        </Link>
      </div>
      {children}
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/terms" element={<LegalLayout><TermsPage /></LegalLayout>} />
      <Route path="/privacy" element={<LegalLayout><PrivacyPage /></LegalLayout>} />
      <Route path="/*" element={<MainLayout />} />
    </Routes>
  );
}

export default App;
