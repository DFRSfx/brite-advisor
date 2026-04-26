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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  if (d.isActive) {
    return (
      <div className="bg-white border border-border rounded-lg px-3 py-2 text-sm shadow-lg">
        <p className="font-bold">{d.quadrant} — {QUADRANT_META[d.quadrant!].label}</p>
        <p className="text-muted-foreground">Ecosystem: {d.x.toFixed(1)} · Sync: {d.y.toFixed(1)}</p>
      </div>
    );
  }
  return (
    <div className="bg-white border border-border rounded-lg px-3 py-2 text-sm shadow-lg">
      <p className="font-semibold">{d.quadrant} — {QUADRANT_META[d.quadrant!].label}</p>
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
      size={22}
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
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">BRITE Matrix</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-xs text-muted-foreground mb-1 px-8">
          <span>← Linear (Eixo X)</span>
          <span>Distributed →</span>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              type="number"
              dataKey="x"
              domain={[0, 10]}
              ticks={[0, 2.5, 5, 7.5, 10]}
              tick={{ fontSize: 11 }}
              label={{ value: "Ecosystem Complexity", position: "insideBottom", offset: -10, fontSize: 11 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              domain={[0, 10]}
              ticks={[0, 2.5, 5, 7.5, 10]}
              tick={{ fontSize: 11 }}
              label={{ value: "Sync Demand", angle: -90, position: "insideLeft", offset: 10, fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />
            {/* Dividing lines */}
            <ReferenceLine x={5} stroke="#94a3b8" strokeDasharray="6 3" />
            <ReferenceLine y={5} stroke="#94a3b8" strokeDasharray="6 3" />
            {/* Quadrant label dots */}
            <Scatter data={centerData} opacity={0.25}>
              {centerData.map((entry) => (
                <Cell
                  key={entry.quadrant}
                  fill={QUADRANT_META[entry.quadrant].chartColor}
                />
              ))}
            </Scatter>
            {/* Active company point */}
            <Scatter data={activePoint} shape={ActiveStar}>
              {activePoint.map((entry) => (
                <Cell
                  key="active"
                  fill={QUADRANT_META[entry.quadrant].chartColor}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>

        {/* Quadrant legend */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          {(["Q1", "Q2", "Q3", "Q4"] as Quadrant[]).map((q) => (
            <div
              key={q}
              className={`flex items-center gap-2 rounded-md px-2 py-1 text-xs ${
                q === activeQuadrant ? "bg-muted font-semibold" : "text-muted-foreground"
              }`}
            >
              <span
                className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: QUADRANT_META[q].chartColor }}
              />
              <span>
                {q} — {QUADRANT_META[q].label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
