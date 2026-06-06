import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { AIScoreBadge, AIScoreCircular } from "../components/ui/AIScoreBadge";
import { useAuthStore } from "../store/authStore";
import { getRecommendations } from "../services/jobsApi";
import { getMyApplications } from "../services/applicationApi";
import { getDashboardStats } from "../services/profileApi";
import { getCandidateProfile } from "../services/profileApi";

// Maps a backend application status to a Badge variant
function statusVariant(status) {
  const map = {
    "Interview Scheduled": "info",
    "In Review": "warning",
    Reviewing: "warning",
    Applied: "default",
    Rejected: "error",
    "Offer Received": "success",
  };
  return map[status] ?? "default";
}

// Formats a salary range object into a readable string
function formatSalary(range) {
  if (!range) return null;
  const { min, max, currency = "$" } = range;
  const fmt = (n) =>
    n >= 1000 ? `${currency}${Math.round(n / 1000)}k` : `${currency}${n}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `${fmt(min)}+`;
  return null;
}

export default function CandidateDashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [stats, setStats] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [profileChecks, setProfileChecks] = useState({
    resume: false,
    skills: false,
    experience: false,
    education: false,
    contactInfo: false,
    bio: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [statsData, recData, appsData, profileData] = await Promise.allSettled([
          getDashboardStats(),
          getRecommendations(),
          getMyApplications(),
          getCandidateProfile(),
        ]);

        if (statsData.status === "fulfilled") setStats(statsData.value);
        if (recData.status === "fulfilled") {
          const rawRecs = recData.value?.data ?? recData.value;
          setRecommendations(rawRecs?.slice?.(0, 3) ?? []);
        }
        if (appsData.status === "fulfilled") setApplications(appsData.value?.slice?.(0, 3) ?? []);
        if (profileData.status === "fulfilled") {
          const p = profileData.value?.profile;
          if (p) {
            setProfileCompletion(p.profileCompletion ?? 0);
            setProfileChecks({
              resume: Boolean(p.resume?.url || p.resume?.fileName),
              skills: (p.skills?.length ?? 0) > 0,
              experience: (p.experience?.length ?? 0) > 0,
              education: (p.education?.length ?? 0) > 0,
              contactInfo: Boolean(p.basicInfo?.phone && p.basicInfo?.headline),
              bio: Boolean(p.basicInfo?.bio),
            });
          }
        }
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const displayName = user?.fullName?.split(" ")?.[0] ?? user?.email?.split("@")?.[0] ?? "there";

  const insightCards = stats
    ? [
        { label: "Profile Views", ...stats.profileViews },
        { label: "Applications", ...stats.applications },
        { label: "Avg Match Score", ...stats.avgMatchScore },
      ]
    : [];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-brand-blue)] mb-2">
            Welcome back, {displayName}!
          </h1>
          <p className="text-[var(--color-muted-foreground)]">
            Here's your personalised dashboard with AI-powered insights
          </p>
        </div>

        {/* Stat Cards */}
        {insightCards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {insightCards.map((insight) => (
              <Card key={insight.label}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[var(--color-muted-foreground)] mb-1">
                        {insight.label}
                      </p>
                      <p className="text-3xl font-bold text-[var(--color-foreground)]">
                        {insight.value}
                      </p>
                      <p
                        className={`text-sm mt-1 ${
                          insight.trend === "up" ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {insight.change} this week
                      </p>
                    </div>
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        insight.trend === "up" ? "bg-green-50" : "bg-red-50"
                      }`}
                    >
                      <TrendingUp
                        className={`w-6 h-6 ${
                          insight.trend === "up" ? "text-green-600" : "text-red-500"
                        }`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left – Recommendations + Application Activity */}
          <div className="lg:col-span-2 space-y-6">

            {/* AI Recommended Jobs */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-[var(--color-brand-teal)]" />
                  <h2 className="text-2xl font-bold text-[var(--color-brand-blue)]">
                    AI Recommended Jobs
                  </h2>
                </div>
                <Button variant="ghost" onClick={() => navigate("/candidate/jobs")}>
                  View All <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {recommendations.length === 0 && (
                  <Card>
                    <CardContent className="p-6 text-center text-[var(--color-muted-foreground)]">
                      No recommendations yet. Complete your profile to get matched.
                    </CardContent>
                  </Card>
                )}
                {recommendations.map((job) => {
                  const salary = formatSalary(job.salaryRange);
                  const logo = job.company?.logo ?? "💼";
                  const companyName = job.company?.name ?? job.company ?? "Unknown";
                  return (
                    <Card
                      key={job._id ?? job.id}
                      hover
                      onClick={() => navigate(`/candidate/jobs/${job._id ?? job.id}`)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-brand-blue)] to-[var(--color-brand-teal)] flex items-center justify-center text-2xl flex-shrink-0">
                            {logo}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div>
                                <h3 className="font-semibold text-lg text-[var(--color-foreground)] mb-1">
                                  {job.title}
                                </h3>
                                <p className="text-[var(--color-muted-foreground)]">{companyName}</p>
                              </div>
                              {job.aiScore != null && (
                                <AIScoreBadge score={job.aiScore} showIcon />
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-muted-foreground)] mb-3">
                              {job.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {job.location}
                                </div>
                              )}
                              {(job.employmentType ?? job.type) && (
                                <div className="flex items-center gap-1">
                                  <Briefcase className="w-4 h-4" />
                                  {job.employmentType ?? job.type}
                                </div>
                              )}
                              {job.postedDays != null && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {job.postedDays}d ago
                                </div>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              {salary && (
                                <span className="font-semibold text-[var(--color-brand-blue)]">
                                  {salary}
                                </span>
                              )}
                              <Button size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/candidate/jobs/${job._id ?? job.id}`); }}>
                                View Job
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Application Activity */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-lg">Your Application Activity</h3>
              </CardHeader>
              <CardContent>
                {applications.length === 0 ? (
                  <p className="text-sm text-center text-[var(--color-muted-foreground)] py-4">
                    No applications yet.{" "}
                    <button
                      className="text-[var(--color-brand-blue)] underline"
                      onClick={() => navigate("/candidate/jobs")}
                    >
                      Browse jobs to get started.
                    </button>
                  </p>
                ) : (
                  <div className="space-y-3">
                    {applications.map((app) => (
                      <div
                        key={app._id ?? app.id}
                        className="flex items-center justify-between p-4 bg-[var(--color-muted)] rounded-lg hover:bg-[var(--color-border)] transition-colors cursor-pointer"
                        onClick={() => navigate("/candidate/applications")}
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-[var(--color-foreground)] truncate">
                            {app.role ?? app.jobTitle ?? "Role"}
                          </h4>
                          <p className="text-sm text-[var(--color-muted-foreground)] truncate">
                            {app.company ?? app.companyName ?? ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 ml-4">
                          <Badge variant={statusVariant(app.status)}>{app.status}</Badge>
                          {app.appliedDate && (
                            <span className="text-sm text-[var(--color-muted-foreground)] whitespace-nowrap">
                              {new Date(app.appliedDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">

            {/* Profile Strength */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-lg">Profile Strength</h3>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <AIScoreCircular score={profileCompletion} size={140} strokeWidth={10} />
                <div className="mt-6 w-full space-y-3">
                  <div className="flex items-center gap-2.5 text-sm">
                    {profileChecks.resume ? (
                      <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-orange-500 shrink-0" />
                    )}
                    <span className={profileChecks.resume ? "text-slate-700 font-medium" : "text-slate-400"}>
                      {profileChecks.resume ? "Resume uploaded" : "Upload your resume"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    {profileChecks.skills ? (
                      <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-orange-500 shrink-0" />
                    )}
                    <span className={profileChecks.skills ? "text-slate-700 font-medium" : "text-slate-400"}>
                      {profileChecks.skills ? "Skills added" : "Add your skills"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    {profileChecks.experience ? (
                      <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-orange-500 shrink-0" />
                    )}
                    <span className={profileChecks.experience ? "text-slate-700 font-medium" : "text-slate-400"}>
                      {profileChecks.experience ? "Work experience added" : "Add work experience"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    {profileChecks.education ? (
                      <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-orange-500 shrink-0" />
                    )}
                    <span className={profileChecks.education ? "text-slate-700 font-medium" : "text-slate-400"}>
                      {profileChecks.education ? "Education listed" : "Add education"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    {profileChecks.contactInfo ? (
                      <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-orange-500 shrink-0" />
                    )}
                    <span className={profileChecks.contactInfo ? "text-slate-700 font-medium" : "text-slate-400"}>
                      {profileChecks.contactInfo ? "Headline & Phone complete" : "Add headline & phone"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    {profileChecks.bio ? (
                      <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-orange-500 shrink-0" />
                    )}
                    <span className={profileChecks.bio ? "text-slate-700 font-medium" : "text-slate-400"}>
                      {profileChecks.bio ? "Personal bio written" : "Write a personal bio"}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-5 hover:bg-slate-50"
                  onClick={() => navigate("/candidate/profile")}
                >
                  Complete Profile
                </Button>
              </CardContent>
            </Card>

            {/* AI Career Insights promo */}
            <Card className="bg-gradient-to-br from-[var(--color-brand-blue)] to-[var(--color-brand-teal)] text-white border-0">
              <CardContent className="p-6">
                <Sparkles className="w-8 h-8 mb-3" />
                <h3 className="font-semibold text-lg mb-2">AI Career Insights</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Get personalised career recommendations based on market trends and your profile.
                </p>
                <Button variant="secondary" className="w-full">
                  View Insights
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-lg">Quick Actions</h3>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => navigate("/candidate/jobs")}
                >
                  <Briefcase className="w-4 h-4" /> Browse Jobs
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => navigate("/candidate/profile")}
                >
                  <TrendingUp className="w-4 h-4" /> Update Profile
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => navigate("/candidate/applications")}
                >
                  <CheckCircle className="w-4 h-4" /> View Applications
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
