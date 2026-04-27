import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
  Symbols,
} from "recharts";
import type { ScatterShapeProps } from "recharts";
import { Quadrant } from "@/types/brite";
import { QUADRANT_META } from "@/lib/briteClassifier";

interface Props {
  activeQuadrant: Quadrant;
  ecosystemScore: number;
  syncScore: number;
}

const QUADRANT_CENTERS = [
  { quadrant: "Q1" as Quadrant, x: 2.5, y: 2.5 },
  { quadrant: "Q2" as Quadrant, x: 2.5, y: 7.5 },
  { quadrant: "Q3" as Quadrant, x: 7.5, y: 2.5 },
  { quadrant: "Q4" as Quadrant, x: 7.5, y: 7.5 },
];

interface TooltipProps {
  active?: boolean;
  payload?: { payload: { quadrant?: Quadrant; x: number; y: number; isActive?: boolean } }[];
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const meta = QUADRANT_META[d.quadrant!];
  return (
    <div className="bg-white border border-border rounded-xl px-3 py-2.5 text-sm shadow-lg">
      <p className="font-bold text-foreground">{d.quadrant} — {meta.label}</p>
      {d.isActive && (
        <p className="text-muted-foreground text-xs mt-0.5">
          Ecosystem: {d.x.toFixed(1)} · Sync: {d.y.toFixed(1)}
        </p>
      )}
    </div>
  );
};

type ActiveStarProps = ScatterShapeProps & {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
};

const ActiveStar = ({ cx, cy, fill, stroke, strokeWidth }: ActiveStarProps) => {
  if (cx == null || cy == null) return null;
  return (
    <Symbols
      cx={cx}
      cy={cy}
      type="star"
      size={28}
      sizeType="diameter"
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
};

export function ArchMatrix({ activeQuadrant, ecosystemScore, syncScore }: Props) {
  const centerData = QUADRANT_CENTERS.map((q) => ({ ...q, isActive: false }));
  const activePoint = [{ x: ecosystemScore, y: syncScore, quadrant: activeQuadrant, isActive: true }];

  return (
    <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
      <div className="px-6 pt-5 pb-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-0.5">Architecture Position</p>
        <p className="text-lg font-bold text-foreground">BRITE Matrix</p>
      </div>

      <div className="px-6 pb-2">
        <div className="flex justify-between text-xs text-muted-foreground px-8">
          <span className="text-indigo-500 font-medium">← Linear (Eixo X)</span>
          <span className="text-indigo-500 font-medium">Distributed →</span>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              type="number"
              dataKey="x"
              domain={[0, 10]}
              ticks={[0, 2.5, 5, 7.5, 10]}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              label={{ value: "Ecosystem Complexity", position: "insideBottom", offset: -10, fontSize: 10, fill: "#94a3b8" }}
            />
            <YAxis
              type="number"
              dataKey="y"
              domain={[0, 10]}
              ticks={[0, 2.5, 5, 7.5, 10]}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              label={{ value: "Sync Demand", angle: -90, position: "insideLeft", offset: 10, fontSize: 10, fill: "#94a3b8" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x={5} stroke="#c7d2fe" strokeDasharray="6 3" strokeWidth={1.5} />
            <ReferenceLine y={5} stroke="#c7d2fe" strokeDasharray="6 3" strokeWidth={1.5} />
            <Scatter data={centerData} opacity={0.3}>
              {centerData.map((entry) => (
                <Cell key={entry.quadrant} fill={QUADRANT_META[entry.quadrant].chartColor} />
              ))}
            </Scatter>
            <Scatter data={activePoint} shape={ActiveStar}>
              {activePoint.map((entry) => (
                <Cell key="active" fill={QUADRANT_META[entry.quadrant].chartColor} stroke="#fff" strokeWidth={2} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 px-6 pb-5">
        {(["Q1", "Q2", "Q3", "Q4"] as Quadrant[]).map((q) => {
          const isActive = q === activeQuadrant;
          const meta = QUADRANT_META[q];
          return (
            <div
              key={q}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs transition-colors ${
                isActive
                  ? "font-semibold text-foreground border-2"
                  : "text-muted-foreground border border-border/50 bg-muted/30"
              }`}
              style={isActive ? { borderColor: meta.chartColor, backgroundColor: `${meta.chartColor}12` } : {}}
            >
              <span
                className={`inline-block flex-shrink-0 rounded-full ${isActive ? "w-3 h-3" : "w-2.5 h-2.5"}`}
                style={{ backgroundColor: meta.chartColor }}
              />
              <span>{q} — {meta.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
