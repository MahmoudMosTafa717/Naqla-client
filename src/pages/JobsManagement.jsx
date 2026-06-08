import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useJobsStore } from "../store/jobsStore";
import { useEmployerStore } from "../store/employerStore";
import { useAuthStore } from "../store/authStore";
import { getJobsByCompany, updateJob, deleteJob } from "../services/jobsApi";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Input } from "../components/ui/Input";
import { Card, CardContent } from "../components/ui/Card";
import { Skeleton } from "../components/ui/Skeleton";
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
  Search,
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  MapPin,
} from "lucide-react";

export default function JobsManagement() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { activeCompanyId, memberships } = useEmployerStore();
  const { user } = useAuthStore();
  const { filters, setFilter, resetFilters } = useJobsStore();
  const [searchTerm, setSearchTerm] = useState(filters.search);

  // States for delete job confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [jobTitleToDelete, setJobTitleToDelete] = useState("");

  // Sync route param with activeCompanyId if direct link was visited
  useEffect(() => {
    if (!companyId && activeCompanyId) {
      navigate(`/employer/company/${activeCompanyId}/jobs`, { replace: true });
    }
  }, [companyId, activeCompanyId, navigate]);

  // Debounced search logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilter("search", searchTerm);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm, setFilter]);

  // Fetch jobs using React Query
  const {
    data: jobsData,
    isLoading,
    isPlaceholderData,
    error,
  } = useQuery({
    queryKey: ["companyJobs", companyId, filters],
    queryFn: () => getJobsByCompany(companyId, filters),
    enabled: Boolean(companyId),
    placeholderData: (prev) => prev,
  });

  // Check user permissions
  const activeMembership = memberships.find((m) => m.company?._id === companyId);
  const canModify = activeMembership?.role === "owner" || activeMembership?.role === "hr";

  // Toggle status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: ({ jobId, status }) => updateJob(jobId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(["companyJobs", companyId]);
      toast.success("Job status updated successfully.");
    },
    onError: (err) => {
      const errorMsg = err.response?.data?.message || err.message || "Failed to update job status.";
      toast.error(errorMsg);
    },
  });

  // Delete job mutation
  const deleteJobMutation = useMutation({
    mutationFn: (jobId) => deleteJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries(["companyJobs", companyId]);
      toast.success("Job posting deleted successfully.");
    },
    onError: (err) => {
      const errorMsg = err.response?.data?.message || err.message || "Failed to delete job.";
      toast.error(errorMsg);
    },
  });

  const handleToggleStatus = (jobId, currentStatus) => {
    const status = currentStatus === "open" ? "closed" : "open";
    toggleStatusMutation.mutate({ jobId, status });
  };

  const handleDeleteJob = (jobId, title) => {
    setJobToDelete(jobId);
    setJobTitleToDelete(title);
    setIsDeleteModalOpen(true);
  };


  const handlePageChange = (newPage) => {
    setFilter("page", newPage);
  };

  const jobs = jobsData?.data?.data || [];
  const pagination = jobsData?.data?.pagination || {
    page: 1,
    totalPages: 1,
    total: 0,
    hasNextPage: false,
    hasPrevPage: false,
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Job Postings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your company's active recruitment postings.
          </p>
        </div>
        <Button onClick={() => navigate("/jobs/create")} className="shrink-0">
          <Plus className="w-4 h-4" /> Post a Job
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border border-slate-100 shadow-sm rounded-xl">
        <CardContent className="p-5 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Input
                placeholder="Search jobs by title, description or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-4 h-4 text-slate-400" />}
                className="w-full"
              />
            </div>
            
            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={filters.status}
                onChange={(e) => setFilter("status", e.target.value)}
                className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="">All Statuses</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="pending">Pending</option>
              </select>

              <select
                value={filters.jobType}
                onChange={(e) => setFilter("jobType", e.target.value)}
                className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="">All Types</option>
                <option value="remote">Remote</option>
                <option value="onsite">Onsite</option>
                <option value="hybrid">Hybrid</option>
              </select>

              <select
                value={filters.employmentType}
                onChange={(e) => setFilter("employmentType", e.target.value)}
                className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="">All Employments</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="freelance">Freelance</option>
              </select>

              {(filters.status || filters.jobType || filters.employmentType || filters.search) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    resetFilters();
                  }}
                  className="px-3 py-2 flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jobs Listing Table */}
      <Card className="border border-slate-100 shadow-sm rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 font-medium">
            Error loading jobs: {error.message}
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-16 text-center text-slate-400 space-y-4">
            <Briefcase className="w-12 h-12 mx-auto text-slate-300" />
            <div>
              <p className="font-semibold text-slate-700">No Jobs Found</p>
              <p className="text-sm text-slate-400 mt-1">
                Try modifying your search query or filters.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold text-slate-400 uppercase">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Details</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <Link
                          to={`/employer/company/${companyId}/jobs`}
                          className="font-bold text-slate-800 hover:text-[var(--color-brand-blue)] text-base"
                        >
                          {job.title}
                        </Link>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {job.skills?.slice(0, 3).map((skill, index) => (
                            <span key={index} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                      <p className="capitalize font-medium">{job.jobType} / {job.employmentType}</p>
                      <p className="text-xs text-slate-400 capitalize mt-0.5">{job.experienceLevel} level</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{job.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={job.status === "open" ? "success" : job.status === "closed" ? "default" : "warning"}>
                        {job.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {canModify && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleStatus(job._id, job.status)}
                            className="p-2 text-slate-400 hover:text-[var(--color-brand-teal)] hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                            title={job.status === "open" ? "Close Job Posting" : "Open Job Posting"}
                            disabled={toggleStatusMutation.isPending}
                          >
                            {job.status === "open" ? (
                              <ToggleRight className="w-5 h-5 text-(--color-brand-teal)" />
                            ) : (
                              <ToggleLeft className="w-5 h-5 text-slate-400" />
                            )}
                          </button>

                          <Link
                            to={`/jobs/${job._id}/edit`}
                            className="p-2 text-slate-400 hover:text-[var(--color-brand-blue)] hover:bg-blue-50 rounded-lg transition-colors inline-block"
                            title="Edit Job"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>

                          {(activeMembership?.role === "owner" || 
                            job.postedBy === user?._id || 
                            job.postedBy?._id === user?._id || 
                            job.postedBy === user?.id || 
                            job.postedBy?._id === user?.id) && (
                            <button
                              onClick={() => handleDeleteJob(job._id, job.title)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Job"
                              disabled={deleteJobMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination bar */}
        {!isLoading && jobs.length > 0 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-sm text-slate-500 font-medium">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} jobs)
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="px-3"
                disabled={!pagination.hasPrevPage || isPlaceholderData}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="px-3"
                disabled={!pagination.hasNextPage || isPlaceholderData}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <Modal open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle className="text-slate-900 font-bold">Delete Job Posting</ModalTitle>
              <ModalDescription className="text-slate-500 mt-2">
                Are you sure you want to delete <span className="font-semibold text-slate-800">"{jobTitleToDelete}"</span>?
                <br /><br />
                This action cannot be undone.
              </ModalDescription>
            </ModalHeader>
            <ModalFooter className="mt-6 flex flex-row justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setJobToDelete(null);
                  setJobTitleToDelete("");
                }}
                disabled={deleteJobMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (jobToDelete) {
                    deleteJobMutation.mutate(jobToDelete, {
                      onSuccess: () => {
                        setIsDeleteModalOpen(false);
                        setJobToDelete(null);
                        setJobTitleToDelete("");
                      }
                    });
                  }
                }}
                disabled={deleteJobMutation.isPending}
              >
                {deleteJobMutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
}
