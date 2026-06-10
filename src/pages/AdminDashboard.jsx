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
import { Card, CardContent } from "../components/ui/Card";
import { Skeleton } from "../components/ui/Skeleton";
import { Badge } from "../components/ui/Badge";

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  badge,
  badgeVariant,
  onClick,
}) {
  return (
    <Card
      hover={!!onClick}
      onClick={onClick}
      className={onClick ? "cursor-pointer" : ""}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
            <p className="text-3xl font-bold text-slate-900">{value ?? "—"}</p>
            {badge != null && (
              <div className="mt-2">
                <Badge variant={badgeVariant || "warning"}>{badge}</Badge>
              </div>
            )}
          </div>
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="w-12 h-12 rounded-xl" />
        </div>
      </CardContent>
    </Card>
  );
}

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
      <div className="p-8 max-w-xl mx-auto text-center space-y-4 mt-10">
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto">
          <UserX className="w-7 h-7 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">
          Failed to load stats
        </h2>
        <p className="text-slate-500 text-sm">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Platform overview — live stats across all users, jobs and companies.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title="Total Users"
              value={stats?.users?.total}
              icon={Users}
              color="bg-[var(--color-brand-blue)]"
              onClick={() => navigate("/admin/users")}
            />
            <StatCard
              title="Candidates"
              value={stats?.users?.candidates}
              icon={Users}
              color="bg-teal-500"
              onClick={() => navigate("/admin/users?role=candidate")}
            />
            <StatCard
              title="Employers"
              value={stats?.users?.employers}
              icon={Building2}
              color="bg-violet-500"
              onClick={() => navigate("/admin/users?role=employer")}
            />
            <StatCard
              title="Banned Users"
              value={stats?.users?.banned}
              icon={UserX}
              color="bg-red-500"
              onClick={() => navigate("/admin/users?isBanned=true")}
            />
            <StatCard
              title="Total Jobs"
              value={stats?.jobs?.total}
              icon={Briefcase}
              color="bg-blue-500"
            />
            <StatCard
              title="Open Jobs"
              value={stats?.jobs?.open}
              icon={TrendingUp}
              color="bg-emerald-500"
            />
            <StatCard
              title="Total Applications"
              value={stats?.applications?.total}
              icon={ClipboardList}
              color="bg-amber-500"
            />
            <StatCard
              title="Pending Companies"
              value={stats?.companies?.pending}
              icon={Clock}
              color="bg-orange-500"
              badge={
                stats?.companies?.pending > 0
                  ? `${stats.companies.pending} awaiting review`
                  : null
              }
              badgeVariant="warning"
              onClick={() => navigate("/admin/companies")}
            />
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          hover
          onClick={() => navigate("/admin/users")}
          className="cursor-pointer"
        >
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-800">Manage Users</p>
              <p className="text-sm text-slate-500 mt-0.5">
                View, ban or unban platform users
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400" />
          </CardContent>
        </Card>

        <Card
          hover
          onClick={() => navigate("/admin/companies")}
          className="cursor-pointer"
        >
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-800">Review Companies</p>
              <p className="text-sm text-slate-500 mt-0.5">
                Approve or reject pending companies
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400" />
          </CardContent>
        </Card>

        <Card
          hover
          onClick={() => navigate("/admin/analytics")}
          className="cursor-pointer"
        >
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-800">View Analytics</p>
              <p className="text-sm text-slate-500 mt-0.5">
                Hiring funnel and platform trends
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
