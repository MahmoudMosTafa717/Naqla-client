import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Briefcase,
  Building2,
  ClipboardList,
  UserX,
  Clock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { getAdminStats } from "../services/adminApi";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Skeleton } from "../components/ui/Skeleton";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["adminStats"],
    queryFn: getAdminStats,
    refetchInterval: 60000,
  });

  const stats = data?.data;

  if (error) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4 mt-16 bg-white border border-border rounded-2xl shadow-micro">
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto text-destructive">
          <UserX className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-secondary-main font-sans">
          Failed to load stats
        </h2>
        <p className="text-secondary-muted text-[10.5pt] font-sans">{error.message}</p>
        <div className="pt-2">
          <Button variant="primary" size="sm" onClick={() => window.location.reload()}>
            Retry Loading
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 bg-bg-page min-h-screen">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border pb-6 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-9 w-48 rounded" />
            <Skeleton className="h-4 w-80 rounded" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-9 w-32 rounded-[24px]" />
            <Skeleton className="h-9 w-32 rounded-[24px]" />
          </div>
        </div>

        {/* 3-Column Highlights Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="w-12 h-12 rounded-xl" />
                </div>
                <div className="pt-4 border-t border-border flex gap-2">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 2-Column Operations Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-60" />
                  </div>
                  <Skeleton className="w-5 h-5 rounded-full" />
                </div>
                <Skeleton className="h-20 w-full rounded-xl" />
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-36" />
                  <Skeleton className="h-4 w-52" />
                </div>
                <Skeleton className="h-16 w-full rounded-xl" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 bg-bg-page min-h-screen">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border pb-6 gap-4">
        <div>
          <h1 className="text-3xl md:text-[30pt] font-extrabold tracking-tight text-secondary-main font-sans leading-none">
            Admin Dashboard
          </h1>
          <p className="text-[10.5pt] text-secondary-muted mt-2 font-sans">
            Platform overview — live stats across all users, jobs and companies.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate("/admin/analytics")}>
            View Analytics
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate("/admin/users")}>
            Manage Users
          </Button>
        </div>
      </div>

      {/* Core Highlights - 3-Column Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Users Directory */}
        <Card hover onClick={() => navigate("/admin/users")}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10.5pt] font-medium text-secondary-muted mb-1 font-sans">
                  Total Users
                </p>
                <p className="text-3xl font-bold text-secondary-main font-sans">
                  {stats?.users?.total ?? "—"}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary-main/10 text-primary-main shrink-0">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border flex gap-2 flex-wrap">
              <Badge
                variant="info"
                className="cursor-pointer hover:bg-blue-100 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/admin/users?role=candidate");
                }}
              >
                {stats?.users?.candidates ?? 0} Candidates
              </Badge>
              <Badge
                variant="purple"
                className="cursor-pointer hover:bg-purple-100 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/admin/users?role=employer");
                }}
              >
                {stats?.users?.employers ?? 0} Employers
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Job Board */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10.5pt] font-medium text-secondary-muted mb-1 font-sans">
                  Total Jobs
                </p>
                <p className="text-3xl font-bold text-secondary-main font-sans">
                  {stats?.jobs?.total ?? "—"}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-brand-blue-light/10 text-brand-blue-light shrink-0">
                <Briefcase className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border flex gap-2 flex-wrap">
              <Badge variant="success">
                {stats?.jobs?.open ?? 0} Open & Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Platform Engagement */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10.5pt] font-medium text-secondary-muted mb-1 font-sans">
                  Total Applications
                </p>
                <p className="text-3xl font-bold text-secondary-main font-sans">
                  {stats?.applications?.total ?? "—"}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-warning/10 text-warning shrink-0">
                <ClipboardList className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border flex gap-2 flex-wrap">
              <span className="text-xs text-secondary-muted font-medium flex items-center gap-1 font-sans">
                <TrendingUp className="w-3.5 h-3.5 text-success" />
                Live candidate submissions
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operations & Safety - Asymmetrical 2-Column Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Verification & Companies queue (2/3 width) */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <h2 className="text-xl font-bold text-secondary-main font-sans">Company Verification</h2>
                <p className="text-sm text-secondary-muted mt-1 font-sans">Review and approve employer registrations</p>
              </div>
              <Clock className="w-5 h-5 text-warning" />
            </CardHeader>
            <CardContent>
              {stats?.companies?.pending > 0 ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-orange-50/50 border border-orange-100 rounded-xl gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center text-warning shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-secondary-main font-sans">{stats.companies.pending} Pending Review</p>
                      <p className="text-sm text-secondary-muted font-sans">New employers are waiting for access approval.</p>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate("/admin/companies")}
                    className="w-full sm:w-auto shrink-0"
                  >
                    Start Reviewing
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 bg-slate-50/50 border border-slate-100 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto text-success mb-3">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <p className="font-semibold text-secondary-main font-sans">All Companies Verified</p>
                  <p className="text-sm text-secondary-muted mt-1 font-sans">There are no pending registrations to review.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Safety & Moderation (1/3 width) */}
        <div>
          <Card className="h-full">
            <CardHeader className="pb-4">
              <h2 className="text-xl font-bold text-secondary-main font-sans">Safety & Moderation</h2>
              <p className="text-sm text-secondary-muted mt-1 font-sans">Monitor platform compliance</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-50/30 border border-red-100/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive shrink-0">
                    <UserX className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-secondary-main font-sans">{stats?.users?.banned ?? 0} Banned Users</p>
                    <p className="text-xs text-secondary-muted font-sans">System access restricted</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-[24px]"
                  onClick={() => navigate("/admin/users?isBanned=true")}
                >
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Links / Shortcuts - 3-Column Matrix */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-secondary-main tracking-tight font-sans">Quick Operations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card hover onClick={() => navigate("/admin/users")}>
            <CardContent className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-main/10 flex items-center justify-center text-primary-main shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-secondary-main font-sans">User Directory</p>
                  <p className="text-xs text-secondary-muted mt-0.5 font-sans">
                    Ban, unban, or inspect user accounts
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-secondary-muted" />
            </CardContent>
          </Card>

          <Card hover onClick={() => navigate("/admin/companies")}>
            <CardContent className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center text-warning shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-secondary-main font-sans">Company Profiles</p>
                  <p className="text-xs text-secondary-muted mt-0.5 font-sans">
                    View active and pending employer records
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-secondary-muted" />
            </CardContent>
          </Card>

          <Card hover onClick={() => navigate("/admin/analytics")}>
            <CardContent className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-secondary-main font-sans">Analytics Hub</p>
                  <p className="text-xs text-secondary-muted mt-0.5 font-sans">
                    View key system metrics and trends
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-secondary-muted" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

