import { BriteDiagnosis } from "@/types/brite";
import { QUADRANT_META } from "@/lib/briteClassifier";
import { QuadrantBadge } from "../shared/QuadrantBadge";
import { BorderBeam } from "@/components/magicui/border-beam";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { BarChart2, Zap } from "lucide-react";

interface Props {
  diagnosis: BriteDiagnosis;
}

const QUADRANT_BEAM_COLORS: Record<string, [string, string]> = {
  Q1: ["#64748b", "#94a3b8"],
  Q2: ["#3b82f6", "#93c5fd"],
  Q3: ["#f59e0b", "#fcd34d"],
  Q4: ["#22c55e", "#86efac"],
};

const QUADRANT_ACCENT: Record<string, string> = {
  Q1: "from-slate-500/10 to-slate-500/5",
  Q2: "from-blue-500/10 to-blue-500/5",
  Q3: "from-amber-500/10 to-amber-500/5",
  Q4: "from-green-500/10 to-green-500/5",
};

export function ResultCard({ diagnosis }: Props) {
  const meta = QUADRANT_META[diagnosis.quadrant];
  const [colorFrom, colorTo] = QUADRANT_BEAM_COLORS[diagnosis.quadrant];
  const accent = QUADRANT_ACCENT[diagnosis.quadrant];

  const techTags = meta.techStack.split(", ");

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 bg-card shadow-sm">
      <BorderBeam colorFrom={colorFrom} colorTo={colorTo} duration={4} size={100} />

      {/* Gradient accent header */}
      <div className={`bg-gradient-to-br ${accent} px-6 pt-6 pb-4 border-b border-border/50`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Your BRITE Diagnosis</p>
            <p className="text-xl font-bold text-foreground">{meta.description}</p>
          </div>
          <QuadrantBadge quadrant={diagnosis.quadrant} size="lg" />
        </div>

        {/* Tech stack tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {techTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-background/80 border border-border text-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Score tiles */}
      <div className="grid grid-cols-2 divide-x divide-border">
        <div className="px-6 py-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: `${meta.chartColor}20` }}>
              <BarChart2 className="w-3.5 h-3.5" style={{ color: meta.chartColor }} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ecosystem (X)</p>
          </div>
          <p className="text-4xl font-bold tabular-nums" style={{ color: meta.chartColor }}>
            <NumberTicker value={diagnosis.ecosystemScore} startValue={0} decimalPlaces={1} className="text-4xl font-bold" />
          </p>
          <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${(diagnosis.ecosystemScore / 10) * 100}%`, backgroundColor: meta.chartColor }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">out of 10</p>
        </div>

        <div className="px-6 py-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: `${meta.chartColor}20` }}>
              <Zap className="w-3.5 h-3.5" style={{ color: meta.chartColor }} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sync (Y)</p>
          </div>
          <p className="text-4xl font-bold tabular-nums" style={{ color: meta.chartColor }}>
            <NumberTicker value={diagnosis.syncScore} startValue={0} decimalPlaces={1} className="text-4xl font-bold" />
          </p>
          <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${(diagnosis.syncScore / 10) * 100}%`, backgroundColor: meta.chartColor }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">out of 10</p>
        </div>
      </div>
    </div>
  );
}
