import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  ShieldOff,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getAllUsers, banUser, unbanUser } from "../services/adminApi";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Skeleton } from "../components/ui/Skeleton";

const ROLE_OPTIONS = ["all", "candidate", "employer", "admin"];

function getRoleVariant(role) {
  if (role === "admin") return "purple";
  if (role === "employer") return "info";
  return "default";
}

function getStatusVariant(user) {
  if (user.isBanned) return "error";
  if (user.status === "active") return "success";
  if (user.status === "pending_approval") return "warning";
  return "default";
}

function getStatusLabel(user) {
  if (user.isBanned) return "Banned";
  return user.status?.replace("_", " ") ?? "—";
}

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [page, setPage] = useState(1);
  const [banModal, setBanModal] = useState(null);
  const [banReason, setBanReason] = useState("");
  const [isBanned, setIsBanned] = useState(false);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const roleParam = searchParams.get("role");
    const isBannedParam = searchParams.get("isBanned");
    if (roleParam && ROLE_OPTIONS.includes(roleParam)) {
      setRole(roleParam);
    }
    if (isBannedParam === "true") {
      setIsBanned(true);
    }
  }, [searchParams]);

  const { data, isLoading } = useQuery({
    queryKey: ["adminUsers", { search, role, page, isBanned }],
    queryFn: () =>
      getAllUsers({
        search: search || undefined,
        role: role === "all" ? undefined : role,
        isBanned: isBanned ? "true" : undefined,
        page,
        limit: 10,
      }),
    keepPreviousData: true,
  });

  const users = data?.data?.users ?? [];
  const pagination = data?.data?.pagination ?? {};

  const banMutation = useMutation({
    mutationFn: ({ userId, reason }) => banUser(userId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(["adminUsers"]);
      queryClient.invalidateQueries(["adminStats"]);
      setBanModal(null);
      setBanReason("");
    },
  });

  const unbanMutation = useMutation({
    mutationFn: ({ userId }) => unbanUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(["adminUsers"]);
      queryClient.invalidateQueries(["adminStats"]);
      setBanModal(null);
    },
  });

  const handleAction = () => {
    if (banModal.action === "ban") {
      banMutation.mutate({ userId: banModal.userId, reason: banReason });
    } else {
      unbanMutation.mutate({ userId: banModal.userId });
    }
  };

  const isPending = banMutation.isPending || unbanMutation.isPending;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Users Management
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          View, search, and moderate all platform users.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <div className="w-72 shrink-0">
          <Input
            placeholder="Search by name or email..."
            icon={<Search className="w-4 h-4" />}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {ROLE_OPTIONS.map((r) => (
            <button
              key={r}
              onClick={() => {
                setRole(r);
                setPage(1);
                setIsBanned(false);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                role === r && !isBanned
                  ? "bg-(--color-brand-blue) text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-(--color-brand-blue)"
              }`}
            >
              {r}
            </button>
          ))}
          <button
            onClick={() => {
              setIsBanned(true);
              setRole("all");
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isBanned
                ? "bg-red-500 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:border-red-400"
            }`}
          >
            Banned
          </button>
        </div>
      </div>

      {/* Table */}
      <Card className="w-full overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm table-fixed">
            <colgroup>
              <col style={{ width: "18%" }} />
              <col style={{ width: "25%" }} />
              <col style={{ width: "12%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
            </colgroup>
            <thead>
              <tr className="border-b">
                <th className="h-10 px-4 text-left align-middle font-medium text-gray-500">
                  Name
                </th>
                <th className="h-10 px-4 text-left align-middle font-medium text-gray-500">
                  Email
                </th>
                <th className="h-10 px-4 text-left align-middle font-medium text-gray-500">
                  Role
                </th>
                <th className="h-10 px-4 text-left align-middle font-medium text-gray-500">
                  Status
                </th>
                <th className="h-10 px-4 text-left align-middle font-medium text-gray-500">
                  Joined
                </th>
                <th className="h-10 px-4 text-left align-middle font-medium text-gray-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="p-4">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-slate-400 py-10">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 font-medium text-slate-800 truncate">
                      {user.fullName || "—"}
                    </td>
                    <td className="p-4 text-slate-500 truncate">
                      {user.email}
                    </td>
                    <td className="p-4">
                      <Badge variant={getRoleVariant(user.role)}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={getStatusVariant(user)}>
                        {getStatusLabel(user)}
                      </Badge>
                    </td>
                    <td className="p-4 text-slate-500 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      {user.role !== "admin" &&
                        (user.isBanned ? (
                          <button
                            onClick={() =>
                              setBanModal({ userId: user._id, action: "unban" })
                            }
                            className="flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                          >
                            <ShieldCheck className="w-4 h-4" /> Unban
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              setBanModal({ userId: user._id, action: "ban" })
                            }
                            className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium"
                          >
                            <ShieldOff className="w-4 h-4" /> Ban
                          </button>
                        ))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Page {pagination.page} of {pagination.totalPages} —{" "}
            {pagination.total} users
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page === pagination.totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Ban/Unban Modal */}
      {banModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-800">
              {banModal.action === "ban" ? "Ban User" : "Unban User"}
            </h2>
            <p className="text-sm text-slate-500">
              {banModal.action === "ban"
                ? "This user will be suspended and blocked from the platform."
                : "This user will be restored to active status."}
            </p>
            {banModal.action === "ban" && (
              <Input
                label="Reason (optional)"
                placeholder="e.g. Violation of terms"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
              />
            )}
            <div className="flex gap-3 justify-end pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setBanModal(null);
                  setBanReason("");
                }}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                variant={banModal.action === "ban" ? "destructive" : "primary"}
                onClick={handleAction}
                disabled={isPending}
              >
                {isPending
                  ? "Processing..."
                  : banModal.action === "ban"
                    ? "Ban User"
                    : "Unban User"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
