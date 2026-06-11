import { useState } from "react";
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

const BRAND_BLUE = "#1E3A8A";
const BRAND_TEAL = "#14B8A6";
const COLORS = ["#1E3A8A", "#14B8A6", "#8b5cf6", "#f59e0b", "#10b981"];

const DAY_OPTIONS = [7, 14, 30, 90];

function ChartSkeleton({ height = 420 }) {
  return <Skeleton className="w-full rounded-xl" style={{ height }} />;
}

function SectionHeader({ title, description }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-bold text-slate-800">{title}</h2>
      {description && (
        <p className="text-sm text-slate-500 mt-0.5">{description}</p>
      )}
    </div>
  );
}

export default function AnalyticsDashboard() {
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
    <div className="px-2 py-6 md:py-8 max-w-full mx-auto space-y-10">
      {/* Header */}
      <div className="border-b border-slate-100 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Analytics Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Platform hiring trends and AI performance metrics.
          </p>
        </div>
        <div className="flex gap-2">
          {DAY_OPTIONS.map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                days === d
                  ? "bg-(--color-brand-blue) text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-(--color-brand-blue)"
              }`}
            >
              {d}d
            </button>
          ))}
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
              <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
                No application data for this period.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={420}>
                <LineChart data={overTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                    tickFormatter={(v) => v.slice(5)}
                  />
                  <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
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
                <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
                  No funnel data available.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={380}>
                  <BarChart data={funnel} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 12, fill: "#94a3b8" }}
                    />
                    <YAxis
                      dataKey="stage"
                      type="category"
                      tick={{ fontSize: 12, fill: "#94a3b8" }}
                      width={80}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
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
                <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
                  No AI score data available.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={380}>
                  <BarChart data={aiScores}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="range"
                      tick={{ fontSize: 12, fill: "#94a3b8" }}
                    />
                    <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e2e8f0",
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
              <div className="h-40 flex items-center justify-center text-slate-400 text-sm">
                No job data available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={380}>
                <BarChart data={topJobs}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="jobTitle"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
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
              <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
                No user growth data for this period.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={420}>
                <LineChart data={userGrowthByDate}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                    tickFormatter={(v) => v.slice(5)}
                  />
                  <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
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
