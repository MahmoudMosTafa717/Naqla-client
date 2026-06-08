import React from "react";
import { useAuthStore } from "../store/authStore";
import { useEmployerStore } from "../store/employerStore";
import { Card, CardHeader, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Skeleton } from "../components/ui/Skeleton";
import {
  User,
  Building,
  Mail,
  Calendar,
  Globe,
  MapPin,
  Shield,
  Briefcase,
  Users,
  Building2,
  FileCheck,
} from "lucide-react";

export default function EmployerProfile() {
  const { user, isLoading: authLoading } = useAuthStore();
  const { activeCompany, isLoading: companyLoading } = useEmployerStore();

  const isLoading = authLoading || companyLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 md:p-8 max-w-7xl mx-auto space-y-6" style={{ background: "linear-gradient(139deg, #eff6ff 0%, #fff 50%, #f0fdf4 100%)" }}>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-80 space-y-6">
            <Card className="p-6 text-center">
              <Skeleton className="w-24 h-24 rounded-full mx-auto" />
              <Skeleton className="h-6 w-32 mx-auto mt-4" />
              <Skeleton className="h-4 w-48 mx-auto mt-2" />
            </Card>
          </div>
          <div className="flex-1 space-y-6">
            <Card className="p-6">
              <Skeleton className="h-8 w-48 mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const initials = user?.fullName
    ? user.fullName
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const companyInitials = activeCompany?.name
    ? activeCompany.name
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "CO";

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const activeMembership = user?.memberships?.find(
    (m) => m.company === activeCompany?._id || m.company?._id === activeCompany?._id
  );
  const userRole = activeMembership?.role || user?.role || "Employer";

  return (
    <div
      className="min-h-screen pb-12"
      style={{
        background:
          "linear-gradient(139deg, #eff6ff 0%, #fff 50%, #f0fdf4 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Employer Profile</h1>
          <p className="text-slate-500 mt-1 text-sm">
            View your personal recruiter profile and linked company details.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
          {/* Left Column - Recruiter Card */}
          <div className="space-y-6">
            {/* User Info Card */}
            <Card className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
              <div className="flex flex-col items-center gap-4">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-md relative border border-slate-100"
                  style={{
                    background: "linear-gradient(135deg, #1e3a8a, #14b8a6)",
                  }}
                >
                  <span>{initials}</span>
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900 text-lg">
                    {user?.fullName || "—"}
                  </h2>
                  <p className="text-slate-400 text-sm capitalize mt-0.5">
                    {userRole === "owner" ? "Company Owner" : "HR Recruiter"}
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-6 space-y-3.5 text-left text-sm text-slate-600">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-teal-500 shrink-0" />
                  <span className="truncate">{user?.email || "—"}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-teal-500 shrink-0" />
                  <span>Joined {joinedDate}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-teal-500 shrink-0" />
                  <div className="flex items-center gap-1.5">
                    <span>Status:</span>
                    <Badge
                      variant={
                        user?.status === "active"
                          ? "success"
                          : user?.status === "pending_approval"
                          ? "warning"
                          : "default"
                      }
                      className="capitalize"
                    >
                      {user?.status || "Active"}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Stats Card */}
            {activeCompany && (
              <Card className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="font-semibold text-slate-800 text-sm mb-4">
                  Workspace Context
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 text-lg font-bold border border-slate-200 overflow-hidden shrink-0">
                    {activeCompany.logo ? (
                      <img
                        src={activeCompany.logo}
                        alt={activeCompany.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{companyInitials}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 text-sm truncate">
                      {activeCompany.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate capitalize">
                      {activeCompany.industry}
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Account Details Card */}
            <Card className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="font-semibold text-slate-800 text-lg mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-teal-500" /> Recruiter Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Full Name
                  </p>
                  <p className="text-sm font-medium text-slate-700 mt-1">
                    {user?.fullName || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Email Address
                  </p>
                  <p className="text-sm font-medium text-slate-700 mt-1">
                    {user?.email || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Recruitment Role
                  </p>
                  <p className="text-sm font-medium text-slate-700 mt-1 capitalize">
                    {userRole === "owner" ? "Company Owner / Administrator" : "HR Recruiter"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Account Status
                  </p>
                  <p className="text-sm font-medium text-slate-700 mt-1 capitalize">
                    {user?.isActive ? "Active Recruiter" : "Suspended"}
                  </p>
                </div>
              </div>
            </Card>

            {/* Company Profile Details */}
            {activeCompany ? (
              <Card className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="font-semibold text-slate-800 text-lg mb-4 flex items-center gap-2">
                  <Building className="w-5 h-5 text-teal-500" /> Company Profile
                </h2>

                <div className="space-y-6">
                  {/* About the Company */}
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      About the Company
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {activeCompany.description || "No company description provided."}
                    </p>
                  </div>

                  {/* Core Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-slate-100 pt-6">
                    <div className="flex items-start gap-3">
                      <Briefcase className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase">
                          Industry
                        </p>
                        <p className="text-sm font-semibold text-slate-700 mt-0.5">
                          {activeCompany.industry || "—"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase">
                          Company Size
                        </p>
                        <p className="text-sm font-semibold text-slate-700 mt-0.5">
                          {activeCompany.size || "—"} Employees
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase">
                          Location
                        </p>
                        <p className="text-sm font-semibold text-slate-700 mt-0.5">
                          {activeCompany.location || "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Links & Verification status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 pt-6">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-slate-400 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase">
                          Website
                        </p>
                        {activeCompany.website ? (
                          <a
                            href={activeCompany.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline font-medium mt-0.5 block"
                          >
                            {activeCompany.website.replace(/^https?:\/\//, "")}
                          </a>
                        ) : (
                          <p className="text-sm text-slate-500 mt-0.5">—</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FileCheck className="w-5 h-5 text-slate-400 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase">
                          Verification Status
                        </p>
                        <div className="mt-1">
                          <Badge
                            variant={
                              activeCompany.status === "active"
                                ? "success"
                                : activeCompany.status === "pending"
                                ? "warning"
                                : "default"
                            }
                            className="capitalize"
                          >
                            {activeCompany.status || "Pending Verification"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-8 text-center text-slate-400 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4">
                <Building2 className="w-12 h-12 text-slate-300" />
                <div>
                  <h3 className="font-semibold text-slate-700">
                    No Company Attached
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    You are not associated with any company profile yet.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
