import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Bookmark,
  Clock,
  ArrowLeft,
  Loader2,
  Check,
} from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { AIScoreBadge } from "../components/ui/AIScoreBadge";
import { getSavedJobs, unsaveJob } from "../services/profileApi";
import { getMyApplications } from "../services/applicationAPI";

function formatSalary(job) {
  if (job.salaryRange) {
    const { min, max, currency = "$" } = job.salaryRange;
    const fmt = (n) => (n >= 1000 ? `${currency}${Math.round(n / 1000)}k` : `${currency}${n}`);
    if (min && max) return `${fmt(min)} – ${fmt(max)}`;
    if (min) return `${fmt(min)}+`;
  }
  return job.salary ?? null;
}

function JobSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm p-6 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 bg-gray-200 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

export default function SavedJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const [savedData, appsList] = await Promise.all([
        getSavedJobs().catch(() => ({ savedJobs: [] })),
        getMyApplications().catch(() => [])
      ]);
      setJobs(savedData?.savedJobs || []);

      const storedSet = new Set();
      if (Array.isArray(appsList)) {
        appsList.forEach((app) => {
          const jId = app.jobId || app.job?._id || app.job?.id || app.id;
          if (jId) storedSet.add(jId);
        });
      }
      setAppliedJobIds(storedSet);
    } catch (error) {
      console.error("Failed to load saved jobs:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  async function handleUnsave(jobId) {
    try {
      await unsaveJob(jobId);
      // Remove from list
      setJobs((prev) => prev.filter((job) => (job._id || job.id) !== jobId));
    } catch (error) {
      console.error("Failed to unsave job:", error);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold text-[var(--color-brand-blue)]">
            Saved Jobs
          </h1>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[var(--color-muted-foreground)]">
              <span className="font-semibold text-[var(--color-foreground)]">{jobs.length}</span>{" "}
              {jobs.length === 1 ? "job" : "jobs"} saved
            </p>
          </div>

          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <JobSkeleton key={i} />)
          ) : jobs.length === 0 ? (
            <Card>
              <CardContent className="p-10 text-center">
                <Bookmark className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="font-semibold text-lg mb-1">No saved jobs</p>
                <p className="text-sm text-[var(--color-muted-foreground)] mb-4">
                  Jobs you save will appear here.
                </p>
                <Button variant="outline" onClick={() => navigate("/candidate/jobs")}>
                  Explore Jobs
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
                            onClick={() => handleUnsave(id)}
                            aria-label="Unsave job"
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                          >
                            <Bookmark className="w-5 h-5 text-[var(--color-brand-teal)] fill-current" />
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
                          <div className="flex gap-2">
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
                                onClick={() => navigate(`/candidate/jobs/${id}`)}
                              >
                                Apply Now
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
  );
}
