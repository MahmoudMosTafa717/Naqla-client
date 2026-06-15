import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  getHiringFunnel,
  getApplicationsOverTime,
  getAIScoreDistribution,
  getTopJobs,
  getUserGrowth,
} from "../services/analyticsApi";
import { Card, CardContent } from "../components/ui/Card";
import { Skeleton } from "../components/ui/Skeleton";
import { Button } from "../components/ui/Button";

const BRAND_BLUE = "var(--color-primary-main)";
const BRAND_TEAL = "var(--color-brand-teal)";
const COLORS = [
  "var(--color-chart-2)",
  "var(--color-chart-1)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

const DAY_OPTIONS = [7, 14, 30, 90];

function ChartSkeleton({ height = 420 }) {
  return <Skeleton className="w-full rounded-xl" style={{ height }} />;
}

function SectionHeader({ title, description }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-bold text-secondary-main font-sans tracking-tight">{title}</h2>
      {description && (
        <p className="text-sm text-secondary-muted font-sans mt-0.5">{description}</p>
      )}
    </div>
  );
}

export default function AnalyticsDashboard() {
  const navigate = useNavigate();
  const [days, setDays] = useState(30);

  const { data: funnelData, isLoading: funnelLoading } = useQuery({
    queryKey: ["hiringFunnel"],
    queryFn: () => getHiringFunnel(),
  });

  const { data: overTimeData, isLoading: overTimeLoading } = useQuery({
    queryKey: ["applicationsOverTime", days],
    queryFn: () => getApplicationsOverTime(null, days),
  });

  const { data: aiScoreData, isLoading: aiScoreLoading } = useQuery({
    queryKey: ["aiScoreDistribution"],
    queryFn: () => getAIScoreDistribution(),
  });

  const { data: topJobsData, isLoading: topJobsLoading } = useQuery({
    queryKey: ["topJobs"],
    queryFn: () => getTopJobs(null, 5),
  });

  const { data: userGrowthData, isLoading: userGrowthLoading } = useQuery({
    queryKey: ["userGrowth", days],
    queryFn: () => getUserGrowth(days),
  });

  const funnel = funnelData?.data ?? [];
  const overTime = overTimeData?.data ?? [];
  const aiScores = aiScoreData?.data ?? [];
  const topJobs = topJobsData?.data ?? [];
  const userGrowth = userGrowthData?.data ?? [];

  const userGrowthByDate = userGrowth.reduce((acc, item) => {
    const existing = acc.find((d) => d.date === item.date);
    if (existing) {
      existing[item.role] = item.count;
    } else {
      acc.push({ date: item.date, [item.role]: item.count });
    }
    return acc;
  }, []);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-10 bg-bg-page min-h-screen">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border pb-6 gap-4">
        <div>
          <h1 className="text-3xl md:text-[30pt] font-extrabold tracking-tight text-secondary-main font-sans leading-none">
            Analytics Dashboard
          </h1>
          <p className="text-[10.5pt] text-secondary-muted mt-2 font-sans">
            Platform hiring trends and AI performance metrics.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1.5 bg-white border border-border p-1 rounded-xl shadow-micro">
            {DAY_OPTIONS.map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all duration-200 cursor-pointer ${days === d
                    ? "bg-primary-main text-white shadow-sm"
                    : "text-secondary-muted hover:text-secondary-main hover:bg-slate-50"
                  }`}
              >
                {d}d
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate("/admin/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* ROW 1 — Applications Over Time */}
      <section>
        <SectionHeader
          title="Applications Over Time"
          description={`Daily application volume for the last ${days} days`}
        />
        <Card>
          <CardContent className="p-4">
            {overTimeLoading ? (
              <ChartSkeleton height={420} />
            ) : overTime.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-secondary-muted text-sm font-sans">
                No application data for this period.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={420}>
                <LineChart data={overTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: "var(--color-secondary-muted)" }}
                    tickFormatter={(v) => v.slice(5)}
                  />
                  <YAxis tick={{ fontSize: 12, fill: "var(--color-secondary-muted)" }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid var(--color-border)",
                      fontSize: "13px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke={BRAND_TEAL}
                    strokeWidth={2.5}
                    dot={false}
                    name="Applications"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </section>

      {/* ROW 2 — Hiring Funnel + AI Score Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hiring Funnel */}
        <section>
          <SectionHeader
            title="Hiring Funnel"
            description="Applications by pipeline stage"
          />
          <Card>
            <CardContent className="p-4">
              {funnelLoading ? (
                <ChartSkeleton height={380} />
              ) : funnel.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-secondary-muted text-sm font-sans">
                  No funnel data available.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={380}>
                  <BarChart data={funnel} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 12, fill: "var(--color-secondary-muted)" }}
                    />
                    <YAxis
                      dataKey="stage"
                      type="category"
                      tick={{ fontSize: 12, fill: "var(--color-secondary-muted)" }}
                      width={80}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid var(--color-border)",
                        fontSize: "13px",
                      }}
                    />
                    <Bar
                      dataKey="count"
                      name="Applications"
                      radius={[0, 4, 4, 0]}
                    >
                      {funnel.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </section>

        {/* AI Score Distribution */}
        <section>
          <SectionHeader
            title="AI Score Distribution"
            description="How candidates score across ranges"
          />
          <Card>
            <CardContent className="p-4">
              {aiScoreLoading ? (
                <ChartSkeleton height={380} />
              ) : aiScores.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-secondary-muted text-sm font-sans">
                  No AI score data available.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={380}>
                  <BarChart data={aiScores}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis
                      dataKey="range"
                      tick={{ fontSize: 12, fill: "var(--color-secondary-muted)" }}
                    />
                    <YAxis tick={{ fontSize: 12, fill: "var(--color-secondary-muted)" }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid var(--color-border)",
                        fontSize: "13px",
                      }}
                    />
                    <Bar
                      dataKey="count"
                      name="Candidates"
                      radius={[4, 4, 0, 0]}
                    >
                      {aiScores.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </section>
      </div>

      {/* ROW 3 — Top Jobs */}
      <section>
        <SectionHeader
          title="Top Performing Jobs"
          description="Jobs with the most applications"
        />
        <Card>
          <CardContent className="p-4">
            {topJobsLoading ? (
              <ChartSkeleton height={380} />
            ) : topJobs.length === 0 ? (
              <div className="h-40 flex items-center justify-center text-secondary-muted text-sm font-sans">
                No job data available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={380}>
                <BarChart data={topJobs}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis
                    dataKey="jobTitle"
                    tick={{ fontSize: 11, fill: "var(--color-secondary-muted)" }}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis tick={{ fontSize: 12, fill: "var(--color-secondary-muted)" }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid var(--color-border)",
                      fontSize: "13px",
                    }}
                  />
                  <Bar
                    dataKey="applicationCount"
                    name="Applications"
                    fill={BRAND_BLUE}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </section>

      {/* ROW 4 — User Growth */}
      <section>
        <SectionHeader
          title="User Growth"
          description={`New registrations by role over the last ${days} days`}
        />
        <Card>
          <CardContent className="p-4">
            {userGrowthLoading ? (
              <ChartSkeleton height={420} />
            ) : userGrowthByDate.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-secondary-muted text-sm font-sans">
                No user growth data for this period.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={420}>
                <LineChart data={userGrowthByDate}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: "var(--color-secondary-muted)" }}
                    tickFormatter={(v) => v.slice(5)}
                  />
                  <YAxis tick={{ fontSize: 12, fill: "var(--color-secondary-muted)" }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid var(--color-border)",
                      fontSize: "13px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="candidate"
                    stroke={BRAND_TEAL}
                    strokeWidth={2.5}
                    dot={false}
                    name="Candidates"
                  />
                  <Line
                    type="monotone"
                    dataKey="employer"
                    stroke={BRAND_BLUE}
                    strokeWidth={2.5}
                    dot={false}
                    name="Employers"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
