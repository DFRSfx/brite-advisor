import { useState } from "react";
import { DiagnosticPage } from "@/pages/DiagnosticPage";
import { AnalyticsPage } from "@/pages/AnalyticsPage";
import { Meteors } from "@/components/magicui/meteors";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { cn } from "@/lib/utils";

type Page = "diagnostic" | "analytics";

function App() {
  const [page, setPage] = useState<Page>("diagnostic");

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
            <button
              onClick={() => setPage("diagnostic")}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                page === "diagnostic"
                  ? "bg-white text-zinc-900"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              )}
            >
              Diagnostic
            </button>
            <button
              onClick={() => setPage("analytics")}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                page === "analytics"
                  ? "bg-white text-zinc-900"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              )}
            >
              Analytics
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {page === "diagnostic" ? <DiagnosticPage /> : <AnalyticsPage />}
      </div>
    </div>
  );
}

export default App;
