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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/brite/AuthModal";
import { getSession, logout, AuthUser } from "@/lib/auth";

export function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"register" | "login">("register");
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    fetchAnalytics()
      .then(setData)
      .catch(() => setError("Failed to load analytics."))
      .finally(() => setLoading(false));
    getSession().then(setCurrentUser);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto max-w-6xl p-6 space-y-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto max-w-6xl p-6">
        <Alert variant="destructive">
          <AlertDescription>{error ?? "No data"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const quadrantCounts = data.quadrantCounts ?? { Q1: 0, Q2: 0, Q3: 0, Q4: 0 };
  const allAssessments = data.allAssessments ?? [];
  const total = Object.values(quadrantCounts).reduce((a, b) => a + b, 0);

  const barData = (["Q1", "Q2", "Q3", "Q4"] as Quadrant[]).map((q) => ({
    quadrant: `${q} ${QUADRANT_META[q].label}`,
    count: quadrantCounts[q],
    fill: QUADRANT_META[q].chartColor,
  }));

  return (
    <div className="container mx-auto max-w-6xl p-4 md:p-8 space-y-8 font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col gap-2 border-b pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Track ecosystem synchronization and structural agility across your assessments.
        </p>
      </div>

      {/* Account / Session Card */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-6">
          {currentUser ? (
            <div className="flex items-center justify-between w-full">
              <div>
                <p className="text-base font-semibold text-foreground">Signed in as {currentUser.name}</p>
                <p className="text-sm text-muted-foreground">{currentUser.email}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await logout();
                  setCurrentUser(null);
                }}
              >
                Sign out
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4">
              <div className="max-w-xl">
                <p className="text-base font-semibold text-foreground">Save your analytics</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Create an account to keep your dashboard history, access it from any device, and share insights with your team.
                </p>
              </div>
              <div className="flex shrink-0 gap-3">
                <Button
                  variant="outline"
                  onClick={() => { setAuthMode("login"); setShowAuthModal(true); }}
                >
                  Sign in
                </Button>
                <Button
                  onClick={() => { setAuthMode("register"); setShowAuthModal(true); }}
                >
                  Create account
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(["Q1", "Q2", "Q3", "Q4"] as Quadrant[]).map((q) => {
          const pct = total > 0 ? ((quadrantCounts[q] / total) * 100).toFixed(0) : "0";
          return (
            <Card key={q} className="shadow-sm">
              <CardContent className="flex flex-col items-center justify-center pt-6 pb-6 text-center">
                <span className="text-4xl font-bold tracking-tighter mb-2">{quadrantCounts[q]}</span>
                <span 
                  className="text-sm font-semibold uppercase tracking-wider" 
                  style={{ color: QUADRANT_META[q].chartColor }}
                >
                  {q} — {QUADRANT_META[q].label}
                </span>
                <span className="text-xs text-muted-foreground mt-1">{pct}% of total</span>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {total === 0 ? (
        /* Empty State */
        <Card className="border-dashed bg-muted/10">
          <CardContent className="flex flex-col items-center justify-center h-64 text-center">
            <h3 className="text-lg font-semibold text-foreground">No assessments recorded yet</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm">
              Your charts and scatter plots will appear here once you complete your first ecosystem assessment.
            </p>
          </CardContent>
        </Card>
      ) : (
        /* Charts Grid */
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Bar Chart */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Quadrant Distribution</CardTitle>
              <CardDescription>Total count of assessments per quadrant.</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={barData} margin={{ top: 10, right: 10, bottom: 20, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis
                    dataKey="quadrant"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#64748b' }} 
                    axisLine={false} 
                    tickLine={false} 
                    allowDecimals={false} 
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={60}>
                    {barData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Scatter Plot */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Score Map</CardTitle>
              <CardDescription>Ecosystem vs. Sync scores across all data.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-xs font-medium text-muted-foreground mb-2 px-8">
                <span>← Linear (Eco)</span>
                <span>Distributed →</span>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    type="number"
                    dataKey="ecosystem_score"
                    domain={[0, 10]}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="number"
                    dataKey="sync_score"
                    domain={[0, 10]}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload as AnalyticsData["allAssessments"][0];
                      return (
                        <div className="bg-background border border-border rounded-lg px-3 py-2 text-sm shadow-md">
                          <p className="font-bold text-foreground">{d.company_name}</p>
                          <p className="text-muted-foreground mt-1">
                            {d.quadrant}
                          </p>
                          <div className="flex gap-3 mt-1 text-xs">
                            <span>Eco: <span className="font-medium text-foreground">{d.ecosystem_score.toFixed(1)}</span></span>
                            <span>Sync: <span className="font-medium text-foreground">{d.sync_score.toFixed(1)}</span></span>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <ReferenceLine x={5} stroke="#94a3b8" strokeDasharray="4 4" />
                  <ReferenceLine y={5} stroke="#94a3b8" strokeDasharray="4 4" />
                  <Scatter data={allAssessments}>
                    {allAssessments.map((entry, idx) => (
                      <Cell
                        key={`scatter-${idx}`}
                        fill={QUADRANT_META[entry.quadrant].chartColor}
                        opacity={0.7}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Assessments Table */}
      {allAssessments.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recent Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 font-medium rounded-tl-md">Company</th>
                    <th className="px-4 py-3 font-medium">Quadrant</th>
                    <th className="px-4 py-3 font-medium">Eco Score</th>
                    <th className="px-4 py-3 font-medium">Sync Score</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium text-right rounded-tr-md">Report</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {allAssessments.slice(0, 20).map((a) => (
                    <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{a.company_name}</td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-white"
                          style={{ backgroundColor: QUADRANT_META[a.quadrant].chartColor }}
                        >
                          {a.quadrant}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{a.ecosystem_score.toFixed(1)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{a.sync_score.toFixed(1)}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(a.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <a href={getReportUrl(a.id)} target="_blank" rel="noreferrer">
                          <Button variant="outline" size="sm" className="h-8 text-xs">
                            View PDF
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

      <AuthModal
        open={showAuthModal}
        mode={authMode}
        onModeChange={setAuthMode}
        onClose={() => setShowAuthModal(false)}
        onSuccess={(user) => { setCurrentUser(user); setShowAuthModal(false); }}
      />
    </div>
  );
}