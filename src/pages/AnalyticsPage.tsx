import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ReferenceLine,
  Cell,
} from "recharts";
import { fetchAnalytics, getReportUrl } from "@/lib/gemini";
import { AnalyticsData, Quadrant } from "@/types/brite";
import { QUADRANT_META } from "@/lib/briteClassifier";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics()
      .then(setData)
      .catch(() => setError("Failed to load analytics."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error ?? "No data"}</AlertDescription>
      </Alert>
    );
  }

  const barData = (["Q1", "Q2", "Q3", "Q4"] as Quadrant[]).map((q) => ({
    quadrant: `${q} ${QUADRANT_META[q].label}`,
    count: data.quadrantCounts[q],
    fill: QUADRANT_META[q].chartColor,
  }));

  const total = Object.values(data.quadrantCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          {total} assessment{total !== 1 ? "s" : ""} recorded
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(["Q1", "Q2", "Q3", "Q4"] as Quadrant[]).map((q) => {
          const pct = total > 0 ? ((data.quadrantCounts[q] / total) * 100).toFixed(0) : "0";
          return (
            <Card key={q}>
              <CardContent className="pt-4 pb-3 text-center">
                <p className="text-2xl font-bold">{data.quadrantCounts[q]}</p>
                <p className="text-xs font-semibold" style={{ color: QUADRANT_META[q].chartColor }}>
                  {q} — {QUADRANT_META[q].label}
                </p>
                <p className="text-xs text-muted-foreground">{pct}% of total</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bar chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Quadrant Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} margin={{ top: 5, right: 10, bottom: 40, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="quadrant"
                tick={{ fontSize: 10 }}
                angle={-15}
                textAnchor="end"
                interval={0}
              />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {barData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Scatter plot */}
      {data.allAssessments.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">All Assessments — Score Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-xs text-muted-foreground mb-1 px-8">
              <span>← Linear (Eixo X)</span>
              <span>Distributed →</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  type="number"
                  dataKey="ecosystem_score"
                  domain={[0, 10]}
                  tick={{ fontSize: 11 }}
                  label={{ value: "Ecosystem Score", position: "insideBottom", offset: -10, fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="sync_score"
                  domain={[0, 10]}
                  tick={{ fontSize: 11 }}
                  label={{ value: "Sync Score", angle: -90, position: "insideLeft", offset: 10, fontSize: 11 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0].payload as AnalyticsData["allAssessments"][0];
                    return (
                      <div className="bg-white border border-border rounded-lg px-3 py-2 text-sm shadow-lg">
                        <p className="font-bold">{d.company_name}</p>
                        <p className="text-muted-foreground">
                          {d.quadrant} · Eco: {d.ecosystem_score.toFixed(1)} · Sync: {d.sync_score.toFixed(1)}
                        </p>
                      </div>
                    );
                  }}
                />
                <ReferenceLine x={5} stroke="#94a3b8" strokeDasharray="6 3" />
                <ReferenceLine y={5} stroke="#94a3b8" strokeDasharray="6 3" />
                <Scatter data={data.allAssessments}>
                  {data.allAssessments.map((entry, idx) => (
                    <Cell
                      key={idx}
                      fill={QUADRANT_META[entry.quadrant].chartColor}
                      opacity={0.8}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Recent assessments table */}
      {data.allAssessments.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recent Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                    <tr className="border-b text-muted-foreground text-left">
                      <th className="pb-2 font-medium">Company</th>
                      <th className="pb-2 font-medium">Quadrant</th>
                      <th className="pb-2 font-medium">Eco</th>
                      <th className="pb-2 font-medium">Sync</th>
                      <th className="pb-2 font-medium">Date</th>
                      <th className="pb-2 font-medium">Report</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.allAssessments.slice(0, 20).map((a) => (
                    <tr key={a.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-2 font-medium">{a.company_name}</td>
                      <td className="py-2">
                        <span
                          className="inline-block px-2 py-0.5 rounded text-white text-xs font-semibold"
                          style={{ backgroundColor: QUADRANT_META[a.quadrant].chartColor }}
                        >
                          {a.quadrant}
                        </span>
                      </td>
                      <td className="py-2 text-muted-foreground">{a.ecosystem_score.toFixed(1)}</td>
                      <td className="py-2 text-muted-foreground">{a.sync_score.toFixed(1)}</td>
                        <td className="py-2 text-muted-foreground">
                          {new Date(a.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-2">
                          <a href={getReportUrl(a.id)} target="_blank" rel="noreferrer">
                            <Button variant="outline" size="sm">
                              PDF
                            </Button>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
