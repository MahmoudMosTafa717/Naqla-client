import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEmployerStore } from "../store/employerStore";
import { getCompanyDashboard, inviteHR, removeHR } from "../services/employerApi";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Skeleton } from "../components/ui/Skeleton";
import { AIScoreBadge } from "../components/ui/AIScoreBadge";
import { toast } from "react-toastify";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from "../components/ui/Modal";
import {
  Briefcase,
  FileText,
  TrendingUp,
  Brain,
  Plus,
  Mail,
  UserX,
  Building,
  ChevronRight,
  Loader2,
  CheckCircle,
  PlusCircle,
  Settings,
  FolderOpen,
  ArrowUpRight,
} from "lucide-react";

// ── SUB-COMPONENTS FOR CLEANER WORKSPACE ──

function StatCard({ title, value, subtext, icon: Icon, colorClass, bgClass }) {
  return (
    <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 border border-slate-100 rounded-xl overflow-hidden">
      <CardContent className="flex items-center gap-4 py-6">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bgClass} ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{value}</h3>
          <p className="text-xs text-slate-500 mt-1">{subtext}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActionsCard({ onPostJob, onManageJobs, onViewProfile }) {
  return (
    <Card className="border border-slate-100 shadow-sm rounded-xl overflow-hidden">
      <CardHeader className="pb-3">
        <h2 className="text-base font-bold text-slate-800">Quick Actions</h2>
        <p className="text-xs text-slate-400">Common administrative tasks</p>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-2.5">
        <Button
          onClick={onPostJob}
          variant="primary"
          className="w-full justify-start text-sm py-2 px-3 shadow-xs hover:shadow-sm"
        >
          <PlusCircle className="w-4 h-4 mr-1.5" /> Post a New Job
        </Button>
        <Button
          onClick={onManageJobs}
          variant="outline"
          className="w-full justify-start text-sm py-2 px-3 hover:bg-slate-50"
        >
          <Briefcase className="w-4 h-4 mr-1.5" /> Manage Job Postings
        </Button>
        <Button
          onClick={onViewProfile}
          variant="ghost"
          className="w-full justify-start text-sm py-2 px-3 border border-slate-100 hover:bg-slate-50 text-slate-700 hover:text-slate-900"
        >
          <Settings className="w-4 h-4 mr-1.5 text-slate-400" /> View Company Profile
        </Button>
      </CardContent>
    </Card>
  );
}

function RecentJobsCard({ recentJobs, companyId }) {
  return (
    <Card className="border border-slate-100 shadow-sm rounded-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800">Recent Jobs</h2>
          <p className="text-xs text-slate-400">View and track latest postings</p>
        </div>
        <Link
          to={`/employer/company/${companyId}/jobs`}
          className="text-xs font-semibold text-[var(--color-brand-blue)] hover:underline flex items-center gap-0.5"
        >
          View all <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {recentJobs?.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No jobs posted yet. Create your first job posting!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold text-slate-400 uppercase">
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentJobs?.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-700">
                      <Link
                        to={`/employer/company/${companyId}/jobs`}
                        className="hover:text-[var(--color-brand-blue)] flex items-center gap-1 group"
                      >
                        {job.title}
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </td>
                    <td className="px-6 py-4 capitalize text-slate-500 whitespace-nowrap">
                      {job.jobType} / {job.employmentType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={job.status === "open" ? "success" : "default"}>
                        {job.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RecentApplicationsCard({ recentApplications }) {
  return (
    <Card className="border border-slate-100 shadow-sm rounded-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800">Recent Applications</h2>
          <p className="text-xs text-slate-400">Latest candidate matches</p>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {recentApplications?.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No applications received yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold text-slate-400 uppercase">
                  <th className="px-6 py-3">Candidate</th>
                  <th className="px-6 py-3">Job Role</th>
                  <th className="px-6 py-3">Stage</th>
                  <th className="px-6 py-3">AI Score</th>
                  <th className="px-6 py-3">Applied</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentApplications?.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-700 leading-tight">
                        {app.candidateId?.fullName}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{app.candidateId?.email}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium whitespace-nowrap">
                      {app.jobId?.title || "Deleted Job"}
                    </td>
                    <td className="px-6 py-4 capitalize whitespace-nowrap">
                      <Badge
                        variant={
                          app.stage?.key === "hired"
                            ? "success"
                            : app.stage?.key === "rejected"
                            ? "error"
                            : "warning"
                        }
                      >
                        {app.stage?.key}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {app.aiScreening?.status === "completed" ? (
                        <AIScoreBadge score={app.aiScreening?.overallScore} size="sm" />
                      ) : (
                        <span className="text-xs text-slate-400 font-medium capitalize">
                          {app.aiScreening?.status || "queued"}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TeamMembersCard({ team, isOwner, onInviteOpen, onRemoveHR, pendingRemove }) {
  return (
    <Card className="border border-slate-100 shadow-sm rounded-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <h2 className="text-base font-bold text-slate-800">Team Members</h2>
          <p className="text-xs text-slate-400">Recruiter permissions</p>
        </div>
        {isOwner && (
          <Button size="sm" onClick={onInviteOpen} className="px-3 py-1.5 text-xs">
            <Plus className="w-3.5 h-3.5 mr-0.5" /> Invite HR
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {team?.map((member) => (
          <div
            key={member._id}
            className="flex items-center justify-between p-3 rounded-lg border border-slate-50 bg-slate-50/30 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-9 h-9 rounded-full text-white flex items-center justify-center font-bold text-sm shrink-0"
                style={{
                  background: "linear-gradient(135deg, #1e3a8a, #14b8a6)",
                }}
              >
                {member.user?.fullName?.[0] || "U"}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-800 text-sm truncate leading-tight">
                  {member.user?.fullName}
                </p>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {member.user?.email}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Badge size="sm" variant={member.role === "owner" ? "purple" : "default"}>
                    {member.role}
                  </Badge>
                </div>
              </div>
            </div>
            {isOwner && member.role === "hr" && (
              <button
                onClick={() => onRemoveHR(member.user?._id, member.user?.fullName)}
                disabled={pendingRemove}
                className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 cursor-pointer disabled:opacity-50"
                title="Remove HR"
              >
                <UserX className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// ── MAIN EMPLOYER DASHBOARD PAGE ──

export default function EmployerDashboard() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    memberships,
    activeCompanyId,
    setActiveCompanyId,
    isLoading: storeLoading,
  } = useEmployerStore();

  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState("");

  // Remove HR modal confirmation state
  const [isRemoveHrOpen, setIsRemoveHrOpen] = useState(false);
  const [hrToRemoveId, setHrToRemoveId] = useState(null);
  const [hrToRemoveName, setHrToRemoveName] = useState("");

  // Sync route param with Zustand active company state
  useEffect(() => {
    if (companyId && companyId !== activeCompanyId) {
      setActiveCompanyId(companyId);
    }
  }, [companyId, activeCompanyId, setActiveCompanyId]);

  // Handle redirects if visiting general /employer/dashboard
  useEffect(() => {
    if (!companyId && !storeLoading) {
      if (activeCompanyId) {
        navigate(`/employer/company/${activeCompanyId}`, { replace: true });
      } else if (memberships.length > 0) {
        const firstId = memberships[0].company?._id;
        setActiveCompanyId(firstId);
        navigate(`/employer/company/${firstId}`, { replace: true });
      }
    }
  }, [companyId, memberships, activeCompanyId, storeLoading, navigate, setActiveCompanyId]);

  // Fetch company scoped dashboard metrics
  const {
    data: dashboardData,
    isLoading: isDashLoading,
    error: dashError,
  } = useQuery({
    queryKey: ["companyDashboard", companyId],
    queryFn: () => getCompanyDashboard(companyId),
    enabled: Boolean(companyId),
  });

  // Determine user's company-scoped role
  const activeMembership = memberships.find((m) => m.company?._id === companyId);
  const isOwner = activeMembership?.role === "owner";

  // Invite HR mutation
  const inviteHRMutation = useMutation({
    mutationFn: (email) => inviteHR(companyId, email),
    onSuccess: (data) => {
      setInviteSuccess(data.message || "Invitation sent successfully!");
      setInviteEmail("");
      setInviteError("");
      queryClient.invalidateQueries(["companyDashboard", companyId]);
      toast.success("HR Recruiter invited successfully.");
      setTimeout(() => {
        setIsInviteOpen(false);
        setInviteSuccess("");
      }, 2000);
    },
    onError: (err) => {
      const errorMsg = err.message || "Failed to invite HR.";
      setInviteError(errorMsg);
      toast.error(errorMsg);
    },
  });

  // Remove HR mutation
  const removeHRMutation = useMutation({
    mutationFn: (hrUserId) => removeHR(companyId, hrUserId),
    onSuccess: () => {
      queryClient.invalidateQueries(["companyDashboard", companyId]);
      toast.success("HR Recruiter removed successfully.");
    },
    onError: (err) => {
      const errorMsg = err.message || "Failed to remove HR member.";
      toast.error(errorMsg);
    },
  });

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    inviteHRMutation.mutate(inviteEmail.trim());
  };

  const handleRemoveHRTrigger = (hrUserId, hrName) => {
    setHrToRemoveId(hrUserId);
    setHrToRemoveName(hrName);
    setIsRemoveHrOpen(true);
  };

  const handleConfirmRemoveHR = () => {
    if (hrToRemoveId) {
      removeHRMutation.mutate(hrToRemoveId, {
        onSuccess: () => {
          setIsRemoveHrOpen(false);
          setHrToRemoveId(null);
          setHrToRemoveName("");
        },
      });
    }
  };

  if (storeLoading || (!companyId && memberships.length > 0)) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (memberships.length === 0) {
    return (
      <div className="p-12 max-w-xl mx-auto text-center space-y-6 bg-white rounded-2xl border border-slate-100 shadow-md mt-10">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <Building className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">No Company Workspace Found</h2>
          <p className="text-slate-500 text-sm mt-2">
            You are not part of any company yet. Onboard your company to start posting jobs.
          </p>
        </div>
        <Button onClick={() => navigate("/employer/company-onboarding")} className="mx-auto">
          <Plus className="w-4 h-4 mr-1" /> Onboard Company
        </Button>
      </div>
    );
  }

  if (isDashLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-96 lg:col-span-2 rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  if (dashError) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <h2 className="text-xl font-bold text-red-600">Error Loading Dashboard</h2>
        <p className="text-slate-600">{dashError.message || "Failed to load dashboard data."}</p>
        <Button onClick={() => queryClient.invalidateQueries(["companyDashboard", companyId])}>
          Retry
        </Button>
      </div>
    );
  }

  const { stats, recentJobs, recentApplications, team, company } = dashboardData?.data || {};

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              {company?.name} Workspace
            </h1>
            <Badge variant="purple" className="capitalize">
              {activeMembership?.role}
            </Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1.5">{company?.description}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="outline" onClick={() => navigate(`/employer/company/${companyId}/jobs`)}>
            Manage Jobs
          </Button>
          <Button onClick={() => navigate("/jobs/create")}>
            <Plus className="w-4 h-4" /> Post a Job
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Jobs"
          value={`${stats?.activeJobs || 0} Active`}
          subtext={`${stats?.totalJobs || 0} total jobs posted`}
          icon={Briefcase}
          colorClass="text-[var(--color-brand-blue)]"
          bgClass="bg-blue-50/80"
        />
        <StatCard
          title="Applications"
          value={stats?.totalApplications || 0}
          subtext="Candidates applied"
          icon={FileText}
          colorClass="text-[var(--color-brand-teal)]"
          bgClass="bg-teal-50/80"
        />
        <StatCard
          title="Pipeline Status"
          value={`${stats?.hiredCount || 0} hired`}
          subtext={`${stats?.interviewingCount || 0} in interviews`}
          icon={TrendingUp}
          colorClass="text-purple-600"
          bgClass="bg-purple-50/80"
        />
        <StatCard
          title="Avg. AI Match Score"
          value={stats?.averageAiScore ? `${stats.averageAiScore}%` : "N/A"}
          subtext="AI screening completed"
          icon={Brain}
          colorClass="text-green-600"
          bgClass="bg-green-50/80"
        />
      </div>

      {/* Main Dashboard Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Columns - Recent Activities */}
        <div className="lg:col-span-2 space-y-8">
          <RecentJobsCard recentJobs={recentJobs} companyId={companyId} />
          <RecentApplicationsCard recentApplications={recentApplications} />
        </div>

        {/* Right Sidebar - Actions & Members */}
        <div className="space-y-8">
          <QuickActionsCard
            onPostJob={() => navigate("/jobs/create")}
            onManageJobs={() => navigate(`/employer/company/${companyId}/jobs`)}
            onViewProfile={() => navigate("/employer/profile")}
          />
          <TeamMembersCard
            team={team}
            isOwner={isOwner}
            onInviteOpen={() => setIsInviteOpen(true)}
            onRemoveHR={handleRemoveHRTrigger}
            pendingRemove={removeHRMutation.isPending}
          />
        </div>
      </div>

      {/* Invite HR Modal */}
      {isInviteOpen && (
        <Modal open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Invite HR Recruiter</ModalTitle>
              <ModalDescription>
                Invite a recruiter to join {company?.name}. Existing users will be added directly. New users will receive an email invitation to register.
              </ModalDescription>
            </ModalHeader>
            <form onSubmit={handleInviteSubmit} className="space-y-4 py-2">
              <Input
                label="Email Address"
                placeholder="recruiter@company.com"
                type="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                icon={<Mail className="w-4 h-4 text-slate-400" />}
                error={inviteError}
                disabled={inviteHRMutation.isPending}
              />
              {inviteSuccess && (
                <div className="flex gap-2 p-3 bg-green-50 text-green-700 text-sm rounded-lg" role="alert">
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <span>{inviteSuccess}</span>
                </div>
              )}
              <ModalFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsInviteOpen(false)}
                  disabled={inviteHRMutation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={inviteHRMutation.isPending}>
                  {inviteHRMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-1" />
                      Sending...
                    </>
                  ) : (
                    "Send Invitation"
                  )}
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      )}

      {/* Remove HR Confirmation Modal */}
      {isRemoveHrOpen && (
        <Modal open={isRemoveHrOpen} onOpenChange={setIsRemoveHrOpen}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle className="text-slate-900 font-bold">Remove HR Recruiter</ModalTitle>
              <ModalDescription className="text-slate-500 mt-2">
                Are you sure you want to remove <span className="font-semibold text-slate-800">{hrToRemoveName}</span> from the company?
                <br /><br />
                This user will lose all recruiter dashboard privileges for {company?.name}.
              </ModalDescription>
            </ModalHeader>
            <ModalFooter className="mt-6 flex flex-row justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsRemoveHrOpen(false);
                  setHrToRemoveId(null);
                  setHrToRemoveName("");
                }}
                disabled={removeHRMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmRemoveHR}
                disabled={removeHRMutation.isPending}
              >
                {removeHRMutation.isPending ? "Removing..." : "Remove"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
