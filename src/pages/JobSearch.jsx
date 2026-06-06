import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Filter,
  Sparkles,
  BookmarkPlus,
  Bookmark,
  Clock,
  X,
  Check,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { AIScoreBadge } from "../components/ui/AIScoreBadge";
import { getJobs } from "../services/jobsApi";
import { quickApplyToJob, getMyApplications } from "../services/applicationApi";
import { getCandidateProfile, saveJob, unsaveJob } from "../services/profileApi";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalClose,
} from "../components/ui/Modal";

// Job types and experience levels for sidebar filters
const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Remote"];
const EXP_LEVELS = ["Entry Level", "Mid Level", "Senior", "Lead"];
const SALARY_RANGES = [
  { label: "$0 – $80k", min: 0, max: 80000 },
  { label: "$80k – $120k", min: 80000, max: 120000 },
  { label: "$120k – $160k", min: 120000, max: 160000 },
  { label: "$160k+", min: 160000, max: null },
];

function formatSalary(job) {
  if (job.salaryRange) {
    const { min, max, currency = "$" } = job.salaryRange;
    const fmt = (n) => (n >= 1000 ? `${currency}${Math.round(n / 1000)}k` : `${currency}${n}`);
    if (min && max) return `${fmt(min)} – ${fmt(max)}`;
    if (min) return `${fmt(min)}+`;
  }
  return job.salary ?? null;
}

function formatCustomSalaryLabel(min, max) {
  const formatNum = (num) => `$${num}k`;
  if (min != null && max != null) {
    return `${formatNum(min)} – ${formatNum(max)}`;
  }
  if (min != null) {
    return `${formatNum(min)}+`;
  }
  if (max != null) {
    return `Up to ${formatNum(max)}`;
  }
  return "";
}

function JobSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm p-6 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 bg-gray-200 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

export default function JobSearch() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedSalary, setSelectedSalary] = useState(null);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(true);

  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [hasResume, setHasResume] = useState(false);
  const [confirmJob, setConfirmJob] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [showNoResumeModal, setShowNoResumeModal] = useState(false);

  // Load candidate profile and applied applications
  useEffect(() => {
    async function loadUserData() {
      try {
        const [profileRes, appsList] = await Promise.all([
          getCandidateProfile().catch(() => null),
          getMyApplications().catch(() => [])
        ]);

        if (profileRes?.profile?.resume?.url) {
          setHasResume(true);
        }

        const storedSet = new Set();
        // Add IDs from active applications fetched from backend
        if (Array.isArray(appsList)) {
          appsList.forEach((app) => {
            const jId = app.jobId || app.job?._id || app.job?.id || app.id;
            if (jId) storedSet.add(jId);
          });
        }
        setAppliedJobIds(storedSet);
      } catch (err) {
        console.error("Failed to load user profile or applications:", err);
      }
    }
    loadUserData();
  }, []);

  // Debounce search input
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(searchQuery), 400);
    return () => clearTimeout(id);
  }, [searchQuery]);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    const params = {};
    if (debouncedQuery) params.search = debouncedQuery;
    if (selectedTypes.length) params.jobType = selectedTypes.join(",");
    if (selectedLevels.length) params.level = selectedLevels.join(",");
    if (selectedSalary) {
      if (selectedSalary.min != null) params.salaryMin = selectedSalary.min * 1000;
      if (selectedSalary.max != null) params.salaryMax = selectedSalary.max * 1000;
    }

    try {
      const result = await getJobs(params);
      const list = result?.data?.data ?? result?.data ?? result ?? [];
      setJobs(list);
      setTotal(result?.data?.pagination?.total ?? result?.pagination?.total ?? list.length);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery, selectedTypes, selectedLevels, selectedSalary]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  function toggleType(type) {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }

  function toggleLevel(level) {
    setSelectedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  }

  function toggleSave(jobId) {
    setSavedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) {
        next.delete(jobId);
        unsaveJob(jobId).catch(console.error);
      } else {
        next.add(jobId);
        saveJob(jobId).catch(console.error);
      }
      return next;
    });
  }

  function clearFilters() {
    setSelectedTypes([]);
    setSelectedLevels([]);
    setSelectedSalary(null);
    setSearchQuery("");
    setDebouncedQuery("");
  }

  function handleQuickApplyClick(job) {
    if (!hasResume) {
      setShowNoResumeModal(true);
      return;
    }
    setConfirmJob(job);
    setApplyError("");
  }

  async function executeQuickApply() {
    if (!confirmJob) return;
    setApplying(true);
    setApplyError("");
    const jobId = confirmJob._id ?? confirmJob.id;
    try {
      await quickApplyToJob(jobId);

      setAppliedJobIds((prev) => {
        const next = new Set(prev);
        next.add(jobId);
        return next;
      });

      setConfirmJob(null);
    } catch (err) {
      setApplyError(err?.response?.data?.message ?? err.message ?? "Failed to apply. Please try again.");
    } finally {
      setApplying(false);
    }
  }

  const activeFilterCount =
    selectedTypes.length + selectedLevels.length + (selectedSalary ? 1 : 0);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-brand-blue)] mb-6">
            Find Your Dream Job
          </h1>

          {/* Search bar */}
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search jobs, companies, or skills…"
                icon={<Search className="w-5 h-5" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="relative"
              onClick={() => setFiltersOpen((o) => !o)}
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-[var(--color-brand-teal)] text-white text-xs rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>
            {activeFilterCount > 0 && (
              <Button variant="ghost" onClick={clearFilters}>
                <X className="w-4 h-4" /> Clear
              </Button>
            )}
          </div>

          {/* Active filter pills */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedTypes.map((t) => (
                <Badge key={t} variant="info" className="cursor-pointer" onClick={() => toggleType(t)}>
                  {t} <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
              {selectedLevels.map((l) => (
                <Badge key={l} variant="purple" className="cursor-pointer" onClick={() => toggleLevel(l)}>
                  {l} <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
              {selectedSalary && (
                <Badge variant="success" className="cursor-pointer" onClick={() => setSelectedSalary(null)}>
                  {selectedSalary.label} <X className="w-3 h-3 ml-1" />
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-4 gap-8">

          {/* Sidebar Filters */}
          <aside className={`lg:col-span-1 space-y-4 ${filtersOpen ? "block" : "hidden"}`}>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Filters
                </h3>

                <div className="space-y-5">
                  {/* Job Type */}
                  <div>
                    <p className="block text-sm font-medium mb-2">Job Type</p>
                    <div className="space-y-2">
                      {JOB_TYPES.map((type) => (
                        <label key={type} className="flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedTypes.includes(type)}
                            onChange={() => toggleType(type)}
                            className="rounded border-[var(--color-border)] accent-[var(--color-brand-teal)]"
                          />
                          <span>{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Experience Level */}
                  <div className="border-t border-[var(--color-border)] pt-4">
                    <p className="block text-sm font-medium mb-2">Experience Level</p>
                    <div className="space-y-2">
                      {EXP_LEVELS.map((level) => (
                        <label key={level} className="flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedLevels.includes(level)}
                            onChange={() => toggleLevel(level)}
                            className="rounded border-[var(--color-border)] accent-[var(--color-brand-teal)]"
                          />
                          <span>{level}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Salary Range */}
                  <div className="border-t border-[var(--color-border)] pt-4">
                    <p className="block text-sm font-medium mb-2 font-semibold text-[var(--color-foreground)]">Salary Range (k$)</p>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-[var(--color-muted-foreground)] block mb-1">Min Salary (k$)</label>
                        <Input
                          type="number"
                          min={0}
                          placeholder="50"
                          value={selectedSalary?.min ?? ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val !== "" && Number(val) < 0) return;
                            const minVal = val ? Number(val) : null;
                            const maxVal = selectedSalary?.max ?? null;
                            if (minVal === null && maxVal === null) {
                              setSelectedSalary(null);
                            } else {
                              setSelectedSalary({
                                min: minVal,
                                max: maxVal,
                                label: formatCustomSalaryLabel(minVal, maxVal)
                              });
                            }
                          }}
                          className="h-9"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-[var(--color-muted-foreground)] block mb-1">Max Salary (k$)</label>
                        <Input
                          type="number"
                          min={0}
                          placeholder="120"
                          value={selectedSalary?.max ?? ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val !== "" && Number(val) < 0) return;
                            const minVal = selectedSalary?.min ?? null;
                            const maxVal = val ? Number(val) : null;
                            if (minVal === null && maxVal === null) {
                              setSelectedSalary(null);
                            } else {
                              setSelectedSalary({
                                min: minVal,
                                max: maxVal,
                                label: formatCustomSalaryLabel(minVal, maxVal)
                              });
                            }
                          }}
                          className="h-9"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <Button variant="outline" className="w-full mt-5" onClick={clearFilters}>
                    Clear all filters
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* AI Job Alerts promo */}
            <Card className="bg-gradient-to-br from-[var(--color-brand-blue)] to-[var(--color-brand-teal)] text-white border-0">
              <CardContent className="p-6">
                <Sparkles className="w-8 h-8 mb-3" />
                <h3 className="font-semibold mb-2">AI Job Alerts</h3>
                <p className="text-sm text-blue-100 mb-4">
                  Get notified when jobs matching your profile are posted
                </p>
                <Button variant="secondary" className="w-full">
                  Enable Alerts
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Job List */}
          <div className={`${filtersOpen ? "lg:col-span-3" : "lg:col-span-4"} space-y-4`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[var(--color-muted-foreground)]">
                <span className="font-semibold text-[var(--color-foreground)]">{total}</span>{" "}
                {total === 1 ? "job" : "jobs"} found
              </p>
              <div className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)]">
                <Sparkles className="w-4 h-4 text-[var(--color-brand-teal)]" />
                Sorted by relevance
              </div>
            </div>

            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <JobSkeleton key={i} />)
            ) : jobs.length === 0 ? (
              <Card>
                <CardContent className="p-10 text-center">
                  <Search className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="font-semibold text-lg mb-1">No jobs found</p>
                  <p className="text-sm text-[var(--color-muted-foreground)] mb-4">
                    Try adjusting your filters or search terms.
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              jobs.map((job) => {
                const id = job._id ?? job.id;
                const companyName = job.company?.name ?? job.company ?? "Unknown Company";
                const logo = job.company?.logo ?? "💼";
                const salary = formatSalary(job);
                const skills = job.skills ?? job.requiredSkills ?? [];
                const isSaved = savedJobs.has(id);

                return (
                  <Card key={id} hover>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--color-brand-blue)] to-[var(--color-brand-teal)] flex items-center justify-center text-2xl flex-shrink-0">
                          {logo}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-1">
                                <h3
                                  className="font-semibold text-lg text-[var(--color-foreground)] hover:text-[var(--color-brand-blue)] cursor-pointer"
                                  onClick={() => navigate(`/candidate/jobs/${id}`)}
                                >
                                  {job.title}
                                </h3>
                                {job.aiScore != null && <AIScoreBadge score={job.aiScore} />}
                              </div>
                              <p className="text-[var(--color-muted-foreground)] font-medium mb-1">
                                {companyName}
                              </p>
                              {job.description && (
                                <p className="text-sm text-[var(--color-muted-foreground)] line-clamp-2">
                                  {job.description}
                                </p>
                              )}
                            </div>

                            <button
                              onClick={() => toggleSave(id)}
                              aria-label={isSaved ? "Unsave job" : "Save job"}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                            >
                              {isSaved ? (
                                <Bookmark className="w-5 h-5 text-[var(--color-brand-teal)] fill-current" />
                              ) : (
                                <BookmarkPlus className="w-5 h-5 text-[var(--color-muted-foreground)]" />
                              )}
                            </button>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-muted-foreground)] mb-3">
                            {job.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" /> {job.location}
                              </div>
                            )}
                            {(job.employmentType ?? job.type) && (
                              <div className="flex items-center gap-1">
                                <Briefcase className="w-4 h-4" />
                                {job.employmentType ?? job.type}
                              </div>
                            )}
                            {salary && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" /> {salary}
                              </div>
                            )}
                            {job.postedDays != null && (
                              <span>
                                <Clock className="w-3.5 h-3.5 inline mr-1" />
                                {job.postedDays}d ago
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex flex-wrap gap-2">
                              {skills.slice(0, 4).map((skill) => (
                                <Badge key={skill} variant="info" size="sm">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-2 items-center">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => navigate(`/candidate/jobs/${id}`)}
                              >
                                View Details
                              </Button>
                              {appliedJobIds.has(id) ? (
                                <Badge className="h-9 px-4 flex items-center justify-center font-medium gap-1 text-sm bg-green-50 border border-green-200 text-green-700 rounded-lg">
                                  <Check className="w-4 h-4 text-green-600" /> Applied
                                </Badge>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => handleQuickApplyClick(job)}
                                >
                                  Quick Apply
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>

      <Modal open={!!confirmJob} onOpenChange={(open) => !open && setConfirmJob(null)}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Confirm Quick Apply</ModalTitle>
            <ModalDescription>
              Are you sure you want to apply for <strong>{confirmJob?.title}</strong> at <strong>{confirmJob?.company?.name || confirmJob?.company}</strong>?
            </ModalDescription>
          </ModalHeader>
          <div className="py-2 text-sm text-[var(--color-muted-foreground)]">
            This will automatically submit the resume currently stored in your profile.
          </div>
          {applyError && (
            <p className="text-sm text-red-600 font-medium">
              {applyError}
            </p>
          )}
          <ModalFooter>
            <ModalClose asChild>
              <Button variant="outline" disabled={applying}>Cancel</Button>
            </ModalClose>
            <Button onClick={executeQuickApply} disabled={applying}>
              {applying ? "Applying..." : "Confirm & Apply"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* No Resume Modal */}
      <Modal open={showNoResumeModal} onOpenChange={setShowNoResumeModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" /> Resume Required
            </ModalTitle>
            <ModalDescription>
              You need to upload a resume to your profile before you can use the Quick Apply feature.
            </ModalDescription>
          </ModalHeader>
          <div className="py-2 text-sm text-[var(--color-muted-foreground)]">
            Quick Apply uses your saved profile resume to instantly apply to jobs with a single click. Please head over to your profile to upload your latest resume.
          </div>
          <ModalFooter>
            <ModalClose asChild>
              <Button variant="outline">Cancel</Button>
            </ModalClose>
            <Button onClick={() => navigate("/candidate/profile")}>
              Go to Profile
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </div>
  );
}
