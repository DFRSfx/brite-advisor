import { BriteDiagnosis } from "@/types/brite";
import { QUADRANT_META } from "@/lib/briteClassifier";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuadrantBadge } from "../shared/QuadrantBadge";
import { BorderBeam } from "@/components/magicui/border-beam";
import { NumberTicker } from "@/components/magicui/number-ticker";

interface Props {
  diagnosis: BriteDiagnosis;
}

const QUADRANT_BEAM_COLORS: Record<string, [string, string]> = {
  Q1: ["#64748b", "#94a3b8"],
  Q2: ["#3b82f6", "#93c5fd"],
  Q3: ["#f59e0b", "#fcd34d"],
  Q4: ["#22c55e", "#86efac"],
};

export function ResultCard({ diagnosis }: Props) {
  const meta = QUADRANT_META[diagnosis.quadrant];
  const [colorFrom, colorTo] = QUADRANT_BEAM_COLORS[diagnosis.quadrant];

  return (
    <Card className="relative overflow-hidden border-2">
      <BorderBeam colorFrom={colorFrom} colorTo={colorTo} duration={4} size={80} />
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl">Your BRITE Diagnosis</CardTitle>
          <QuadrantBadge quadrant={diagnosis.quadrant} size="lg" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{meta.description}</p>
        <p className="text-sm font-medium">Recommended stack: {meta.techStack}</p>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted rounded-xl p-4 text-center">
            <p className="text-3xl font-bold tabular-nums">
              <NumberTicker
                value={diagnosis.ecosystemScore}
                startValue={0}
                decimalPlaces={1}
                className="text-3xl font-bold"
              />
            </p>
            <p className="text-xs text-muted-foreground mt-1">Ecosystem Score (X)</p>
            <div className="mt-2 h-1.5 rounded-full bg-muted-foreground/20">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${(diagnosis.ecosystemScore / 10) * 100}%`,
                  backgroundColor: meta.chartColor,
                }}
              />
            </div>
          </div>
          <div className="bg-muted rounded-xl p-4 text-center">
            <p className="text-3xl font-bold tabular-nums">
              <NumberTicker
                value={diagnosis.syncScore}
                startValue={0}
                decimalPlaces={1}
                className="text-3xl font-bold"
              />
            </p>
            <p className="text-xs text-muted-foreground mt-1">Sync Score (Y)</p>
            <div className="mt-2 h-1.5 rounded-full bg-muted-foreground/20">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${(diagnosis.syncScore / 10) * 100}%`,
                  backgroundColor: meta.chartColor,
                }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
