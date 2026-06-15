import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
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
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../components/ui/Table";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from "../components/ui/Modal";

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
  const navigate = useNavigate();
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
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 bg-bg-page min-h-screen">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border pb-6 gap-4">
        <div>
          <h1 className="text-3xl md:text-[30pt] font-extrabold tracking-tight text-secondary-main font-sans leading-none">
            Users Management
          </h1>
          <p className="text-[10.5pt] text-secondary-muted mt-2 font-sans">
            View, search, and moderate all platform users.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate("/admin/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between w-full">
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
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 capitalize cursor-pointer font-sans ${role === r && !isBanned
                ? "bg-primary-main text-white shadow-sm"
                : "bg-white border border-border text-secondary-muted hover:border-primary-main hover:text-primary-main"
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
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer font-sans ${isBanned
              ? "bg-destructive text-white shadow-sm"
              : "bg-white border border-border text-secondary-muted hover:border-destructive hover:text-destructive"
              }`}
          >
            Banned
          </button>
        </div>
      </div>

      {/* Table */}
      <Card className="w-full overflow-hidden">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[18%] font-sans text-secondary-muted">Name</TableHead>
              <TableHead className="w-[25%] font-sans text-secondary-muted">Email</TableHead>
              <TableHead className="w-[12%] font-sans text-secondary-muted">Role</TableHead>
              <TableHead className="w-[15%] font-sans text-secondary-muted">Status</TableHead>
              <TableHead className="w-[15%] font-sans text-secondary-muted">Joined</TableHead>
              <TableHead className="w-[15%] font-sans text-secondary-muted">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-secondary-muted py-10 font-sans">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium text-secondary-main font-sans truncate">
                    {user.fullName || "—"}
                  </TableCell>
                  <TableCell className="text-secondary-muted font-sans truncate">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleVariant(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(user)}>
                      {getStatusLabel(user)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-secondary-muted text-sm font-sans">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {user.role !== "admin" &&
                      (user.isBanned ? (
                        <button
                          onClick={() =>
                            setBanModal({ userId: user._id, action: "unban" })
                          }
                          className="inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer font-sans transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4" /> Unban
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            setBanModal({ userId: user._id, action: "ban" })
                          }
                          className="inline-flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-semibold cursor-pointer font-sans transition-colors"
                        >
                          <ShieldOff className="w-4 h-4" /> Ban
                        </button>
                      ))}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-secondary-muted font-sans">
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
      <Modal open={!!banModal} onOpenChange={(open) => { if (!open) { setBanModal(null); setBanReason(""); } }}>
        <ModalContent className="max-w-md">
          <ModalHeader>
            <ModalTitle className="text-secondary-main font-sans">
              {banModal?.action === "ban" ? "Ban User" : "Unban User"}
            </ModalTitle>
            <ModalDescription className="text-secondary-muted font-sans">
              {banModal?.action === "ban"
                ? "This user will be suspended and blocked from accessing the platform."
                : "This user's access will be restored and they can sign in normally."}
            </ModalDescription>
          </ModalHeader>
          {banModal?.action === "ban" && (
            <div className="py-2">
              <Input
                label="Reason (optional)"
                placeholder="e.g. Violation of terms"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
              />
            </div>
          )}
          <ModalFooter className="pt-2">
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
              variant={banModal?.action === "ban" ? "destructive" : "primary"}
              onClick={handleAction}
              disabled={isPending}
            >
              {isPending
                ? "Processing..."
                : banModal?.action === "ban"
                  ? "Ban User"
                  : "Unban User"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
