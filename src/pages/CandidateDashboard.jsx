import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, TrendingUp, CheckCircle, Sparkles, ArrowRight, Eye, FileText } from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useAuthStore } from "../store/authStore";
import { getRecommendations } from "../services/jobsApi";
import { getMyApplications } from "../services/applicationAPI";
import { getDashboardStats, getCandidateProfile } from "../services/profileApi";

import RecommendedJobCard from "../components/candidate-dashboard/RecommendedJobCard";
import RecommendedJobsSkeleton from "../components/candidate-dashboard/RecommendedJobsSkeleton";
import ProfileStrengthCard from "../components/candidate-dashboard/ProfileStrengthCard";
import ApplicationActivityCard from "../components/candidate-dashboard/ApplicationActivityCard";

const ILLUSTRATIONS = [
  "/illustrations/Developer activity-rafiki.svg",
  "/illustrations/Business deal-rafiki.svg",
  "/illustrations/Business deal-pana.svg",
  "/illustrations/Business deal-bro.svg"
];

const getDailyIllustration = () => {
  const date = new Date();
  const daysSinceEpoch = Math.floor((date.getTime() - date.getTimezoneOffset() * 60000) / 86400000);
  return ILLUSTRATIONS[daysSinceEpoch % ILLUSTRATIONS.length];
};

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

  // Recommendations have their own loading state — page renders without waiting for them
  const [loadingRecs, setLoadingRecs] = useState(true);
  // Other data (stats, apps, profile) load in parallel
  const [loadingMeta, setLoadingMeta] = useState(true);

  useEffect(() => {
    // Fetch recommendations separately so they can show a skeleton independently
    getRecommendations()
      .then((data) => {
        const raw = data?.data ?? data;
        setRecommendations(raw?.slice?.(0, 3) ?? []);
      })
      .catch(() => setRecommendations([]))
      .finally(() => setLoadingRecs(false));

    // Fetch the rest in parallel
    Promise.allSettled([getDashboardStats(), getMyApplications(), getCandidateProfile()]).then(
      ([statsData, appsData, profileData]) => {
        if (statsData.status === "fulfilled") setStats(statsData.value);
        if (appsData.status === "fulfilled")
          setApplications(appsData.value?.slice?.(0, 3) ?? []);
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
        setLoadingMeta(false);
      },
    );
  }, []);

  const displayName =
    user?.fullName?.split(" ")?.[0] ?? user?.email?.split("@")?.[0] ?? "there";

  const dailyIllustration = getDailyIllustration();

  const insightCards = stats
    ? [
      { label: "Profile Views", ...stats.profileViews },
      { label: "Applications", ...stats.applications },
      { label: "Avg Match Score", ...stats.avgMatchScore },
    ]
    : [];

  return (
    <div className="min-h-screen bg-slate-50 animate-fade-in pb-12">
      {/* Premium Light Gradient Header */}
      <div className="bg-slate-50 bg-gradient-to-br from-slate-50 via-blue-50/50 to-blue-100/30 pt-[calc(4rem+7rem)] pb-32 relative overflow-hidden border-b border-slate-200 -mt-28">
        <div className="absolute top-0 left-0 w-full h-full opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" /> AI-Powered Hub
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Welcome back, {displayName}.
            </h1>
            <p className="text-slate-600 text-lg sm:text-xl font-medium leading-relaxed">
              Here's what is happening with your applications, profile views, and personalized career matches today.
            </p>
          </div>

          <div className="hidden md:block flex-shrink-0 animate-fade-in group">
            <img
              src={dailyIllustration}
              alt="Dashboard Motivation"
              className="w-80 h-80 lg:w-[450px] lg:h-[450px] object-contain drop-shadow-[0_20px_40px_rgba(37,99,235,0.15)] transition-transform duration-700 ease-out group-hover:scale-105 group-hover:-translate-y-2"
              style={{
                WebkitMaskImage: "radial-gradient(circle, black 60%, transparent 100%)",
                maskImage: "radial-gradient(circle, black 60%, transparent 100%)"
              }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-16 relative z-20 space-y-8">

        {/* Stat Cards — show once meta is loaded */}
        {!loadingMeta && insightCards.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {insightCards.map((insight, idx) => (
              <Card key={insight.label} className="animate-slide-up bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-white/50 transition-all hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] cursor-pointer" style={{ animationDelay: `${idx * 150}ms` }}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold tracking-wider uppercase text-slate-400 mb-2">
                        {insight.label}
                      </p>
                      <p className="text-4xl font-black text-slate-900 mb-1 tracking-tight">
                        {insight.value}
                      </p>
                      {(insight.label === "Profile Views" || insight.label === "Applications") && (
                        <p className="text-sm font-semibold text-slate-500 mt-2 flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${insight.trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {insight.change}
                          </span>
                          <span>this week</span>
                        </p>
                      )}
                    </div>
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${insight.trend === "up" ? "bg-gradient-to-br from-blue-50 to-blue-100" : "bg-gradient-to-br from-slate-50 to-slate-100"
                        }`}
                    >
                      {insight.label === "Profile Views" ? (
                        <Eye className={`w-7 h-7 ${insight.trend === "up" ? "text-blue-700" : "text-slate-500"}`} />
                      ) : insight.label === "Applications" ? (
                        <FileText className={`w-7 h-7 ${insight.trend === "up" ? "text-blue-700" : "text-slate-500"}`} />
                      ) : (
                        <TrendingUp className={`w-7 h-7 ${insight.trend === "up" ? "text-blue-700" : "text-slate-500"}`} />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Main grid */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left — Recommendations + Application Activity */}
          <div className="lg:col-span-2 space-y-6">

            {/* AI Recommended Jobs — skeleton while loading */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-[#2563EB]" />
                  <h2 className="text-2xl font-bold text-slate-900">
                    AI Recommended Jobs
                  </h2>
                </div>
                <Button variant="ghost" onClick={() => navigate("/candidate/jobs")}>
                  View All <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

              {loadingRecs ? (
                <RecommendedJobsSkeleton count={3} />
              ) : recommendations.length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center text-[var(--color-muted-foreground)]">
                    No recommendations yet.
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {recommendations.map((job) => (
                    <RecommendedJobCard key={job._id ?? job.id} job={job} />
                  ))}
                </div>
              )}
            </div>

            {/* Application Activity */}
            <ApplicationActivityCard applications={applications} />
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">

            {/* Profile Strength */}
            <ProfileStrengthCard
              profileCompletion={profileCompletion}
              profileChecks={profileChecks}
            />

            {/* AI Career Insights promo */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 shadow-sm animate-slide-up" style={{ animationDelay: '200ms' }}>
              <CardContent className="p-6">
                <Sparkles className="w-8 h-8 mb-3 text-[#2563EB]" />
                <h3 className="font-bold text-lg mb-2 text-[#1e3a8a]">AI Career Insights</h3>
                <p className="text-[#1e3a8a]/70 text-sm mb-4 font-medium">
                  Get personalised career recommendations based on market trends and your profile.
                </p>
                <Button variant="outline" className="w-full bg-white text-[#2563EB] border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-colors">
                  View Insights
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-sm border-slate-200 animate-slide-up" style={{ animationDelay: '300ms' }}>
              <CardContent className="p-6 space-y-2">
                <h3 className="font-bold text-slate-900 text-lg mb-3">Quick Actions</h3>
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
