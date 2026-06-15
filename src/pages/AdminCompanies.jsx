import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  CheckCircle,
  XCircle,
  ExternalLink,
  Clock,
} from "lucide-react";
import {
  getPendingCompanies,
  approveCompany,
  rejectCompany,
} from "../services/adminApi";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Skeleton } from "../components/ui/Skeleton";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from "../components/ui/Modal";


function CompanyCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-9 w-28 rounded-lg" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminCompanies() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["pendingCompanies"],
    queryFn: getPendingCompanies,
  });

  const companies = data?.data ?? [];

  const approveMutation = useMutation({
    mutationFn: (companyId) => approveCompany(companyId),
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingCompanies"]);
      queryClient.invalidateQueries(["adminStats"]);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ companyId, reason }) => rejectCompany(companyId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingCompanies"]);
      queryClient.invalidateQueries(["adminStats"]);
      setRejectModal(null);
      setRejectReason("");
    },
  });

  const handleReject = () => {
    rejectMutation.mutate({
      companyId: rejectModal.companyId,
      reason: rejectReason,
    });
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 bg-bg-page min-h-screen">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border pb-6 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-[30pt] font-extrabold tracking-tight text-secondary-main font-sans leading-none">
              Company Moderation
            </h1>
            {!isLoading && companies.length > 0 && (
              <Badge variant="warning">{companies.length} pending</Badge>
            )}
          </div>
          <p className="text-[10.5pt] text-secondary-muted mt-2 font-sans">
            Review company licenses and approve or reject registrations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate("/admin/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Empty state */}
      {!isLoading && companies.length === 0 && (
        <div className="text-center py-20 space-y-3 bg-white border border-border rounded-2xl shadow-micro max-w-xl mx-auto">
          <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto text-success">
            <CheckCircle className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-semibold text-secondary-main font-sans">
            All caught up!
          </h2>
          <p className="text-secondary-muted text-sm font-sans">
            No companies are pending review right now.
          </p>
        </div>
      )}

      {/* Companies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
            <CompanyCardSkeleton key={i} />
          ))
          : companies.map((company) => {
            const licenseUrl =
              company.licenses && company.licenses.secure_url;
            const logoUrl = company.logo && company.logo.secure_url;

            return (
              <Card key={company._id}>
                <CardContent className="p-6 space-y-4">
                  {/* Company header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt={company.name}
                          className="w-12 h-12 rounded-lg object-cover border border-border"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-secondary-muted/10 flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-secondary-muted" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-secondary-main font-sans">
                          {company.name}
                        </h3>
                        <p className="text-sm text-secondary-muted font-sans">
                          {company.industry ?? "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full whitespace-nowrap font-sans">
                      <Clock className="w-3.5 h-3.5" />
                      Pending
                    </div>
                  </div>

                  {/* Company details */}
                  <div className="space-y-1.5 text-sm text-secondary-muted font-sans">
                    {company.owner && (
                      <p>
                        <span className="font-medium text-secondary-main">
                          Owner:
                        </span>{" "}
                        {company.owner.fullName} — {company.owner.email}
                      </p>
                    )}
                    {company.size && (
                      <p>
                        <span className="font-medium text-secondary-main">
                          Size:
                        </span>{" "}
                        {company.size}
                      </p>
                    )}
                    {company.location && (
                      <p>
                        <span className="font-medium text-secondary-main">
                          Location:
                        </span>{" "}
                        {company.location}
                      </p>
                    )}
                    <p>
                      <span className="font-medium text-secondary-main">
                        Submitted:
                      </span>{" "}
                      {new Date(company.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* License */}
                  {licenseUrl ? (
                    <a
                      href={licenseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-brand-blue hover:underline font-medium font-sans"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View License Document
                    </a>
                  ) : (
                    <p className="text-sm text-destructive font-medium font-sans">
                      ⚠ No license uploaded yet
                    </p>
                  )}

                  {/* Rejection reason if previously rejected */}
                  {company.rejectionReason && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2 text-sm text-destructive font-sans">
                      <span className="font-medium">Previous rejection:</span>{" "}
                      {company.rejectionReason}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-1">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => approveMutation.mutate(company._id)}
                      disabled={approveMutation.isPending || !licenseUrl}
                    >
                      <CheckCircle className="w-4 h-4" />
                      {approveMutation.isPending ? "Approving..." : "Approve"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        setRejectModal({
                          companyId: company._id,
                          companyName: company.name,
                        })
                      }
                      disabled={rejectMutation.isPending}
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>

      {/* Reject Modal */}
      <Modal open={!!rejectModal} onOpenChange={(open) => { if (!open) { setRejectModal(null); setRejectReason(""); } }}>
        <ModalContent className="max-w-md">
          <ModalHeader>
            <ModalTitle className="text-secondary-main font-sans">Reject Company</ModalTitle>
            <ModalDescription className="text-secondary-muted font-sans">
              You are rejecting{" "}
              <span className="font-semibold text-secondary-main">
                {rejectModal?.companyName}
              </span>
              . The owner will be able to re-upload their license and resubmit.
            </ModalDescription>
          </ModalHeader>
          <div className="py-2">
            <Input
              label="Reason (optional)"
              placeholder="e.g. License document is not clear"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
          <ModalFooter className="pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setRejectModal(null);
                setRejectReason("");
              }}
              disabled={rejectMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={rejectMutation.isPending}
            >
              {rejectMutation.isPending ? "Rejecting..." : "Reject Company"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
