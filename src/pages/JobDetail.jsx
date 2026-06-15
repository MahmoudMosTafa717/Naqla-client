import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Users,
  Globe,
  Bookmark,
  Share2,
  ArrowLeft,
  CheckCircle,
  TrendingUp,
  Target,
  Award,
  Loader2,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { AIScoreCircular } from "../components/ui/AIScoreBadge";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter, ModalClose } from "../components/ui/Modal";
import { useAuthStore } from "../store/authStore";
import { useChatStore } from "../store/chatStore";
import { getJobById, getRecommendations } from "../services/jobsApi";
import { applyToJob, quickApplyToJob, getMyApplications } from "../services/applicationAPI";
import { getSavedJobs, saveJob as saveJobApi, unsaveJob as unsaveJobApi, getCandidateProfile } from "../services/profileApi";



function formatSalary(job) {
  if (job.salaryRange) {
    const { min, max, currency = "$" } = job.salaryRange;
    const fmt = (n) => (n >= 1000 ? `${currency}${Math.round(n / 1000)}k` : `${currency}${n}`);
    if (min && max) return `${fmt(min)} – ${fmt(max)}`;
    if (min) return `${fmt(min)}+`;
  }
  return job.salary ?? null;
}

function CheckList({ items, icon: Icon, iconClass }) {
  if (!items?.length) return null;
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-[var(--color-muted-foreground)]">
          <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconClass}`} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const openChat = useChatStore((s) => s.openChat);

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [saved, setSaved] = useState(false);
  const [hasResume, setHasResume] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [standardApplying, setStandardApplying] = useState(false);
  const [showNoResumeModal, setShowNoResumeModal] = useState(false);

  const [showConfirmQuickApplyModal, setShowConfirmQuickApplyModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [jobRes, savedJobsData, profileData, appsList, recs] = await Promise.all([
          getJobById(id),
          user?.role === "candidate" ? getSavedJobs() : Promise.resolve({ savedJobs: [] }),
          user?.role === "candidate" ? getCandidateProfile() : Promise.resolve(null),
          user?.role === "candidate" ? getMyApplications().catch(() => []) : Promise.resolve([]),
          user?.role === "candidate" ? getRecommendations().catch(() => []) : Promise.resolve([])
        ]);
        const jobData = jobRes?.data ?? jobRes;

        // Extract score if this job is in the recommended list
        if (Array.isArray(recs)) {
          const recMatch = recs.find(r => (r._id || r.id) === id);
          if (recMatch && recMatch.aiScore != null) {
            jobData.aiScore = recMatch.aiScore;
          } else {
            jobData.aiScore = null;
          }
        } else {
          jobData.aiScore = null;
        }

        setJob(jobData);

        if (savedJobsData?.savedJobs) {
          const isSaved = savedJobsData.savedJobs.some(sj => (sj._id || sj.id) === id);
          setSaved(isSaved);
        }

        if (profileData?.profile?.resume?.url) {
          setHasResume(true);
        }

        // Check if this job is applied to in remote list
        const isAppliedRemote = Array.isArray(appsList) && appsList.some(app => {
          const job = app.jobId || app.job;
          const jId = typeof job === "object" ? (job?._id || job?.id) : job;
          const finalId = jId || app.id;
          return finalId && finalId.toString() === id.toString();
        });

        if (isAppliedRemote) {
          setApplied(true);
        }

      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id, user?.role]);

  async function handleToggleSave() {
    if (saved) {
      setSaved(false);
      await unsaveJobApi(job._id ?? job.id).catch(() => setSaved(true));
    } else {
      setSaved(true);
      await saveJobApi(job._id ?? job.id).catch(() => setSaved(false));
    }
  }

  function handleQuickApplyClick() {
    if (!hasResume) {
      setShowNoResumeModal(true);
      return;
    }
    setShowConfirmQuickApplyModal(true);
    setApplyError("");
  }

  async function executeQuickApply() {
    setApplying(true);
    setApplyError("");
    const jobId = job._id ?? job.id;
    try {
      await quickApplyToJob(jobId);
      setApplied(true);
      setShowConfirmQuickApplyModal(false);


    } catch (err) {
      setApplyError(err?.response?.data?.message ?? err.message ?? "Application failed. Please try again.");
    } finally {
      setApplying(false);
    }
  }

  async function handleStandardApply(e) {
    e.preventDefault();
    if (!selectedFile) return;

    setStandardApplying(true);
    setApplyError("");

    const jobId = job._id ?? job.id;
    const formData = new FormData();
    formData.append("jobId", jobId);
    formData.append("resume", selectedFile);

    try {
      await applyToJob(formData);
      setApplied(true);
      setShowApplyModal(false);


    } catch (err) {
      setApplyError(err?.response?.data?.message ?? err.message ?? "Application failed. Please try again.");
    } finally {
      setStandardApplying(false);
    }
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-brand-blue)]" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 mx-auto text-gray-300 mb-4" />
        <p className="font-semibold text-lg mb-2">Job not found</p>
        <Button variant="outline" onClick={() => navigate("/candidate/jobs")}>
          Back to jobs
        </Button>
      </div>
    );
  }

  const companyName = job.company?.name ?? job.company ?? "Unknown Company";
  const companyWebsite = job.company?.website ?? job.companyWebsite;
  const logo = job.company?.logo ?? "💼";
  const salary = formatSalary(job);
  const skills = job.skills ?? job.requiredSkills ?? [];
  const responsibilities = job.responsibilities ?? [];
  const requirements = job.requirements ?? job.requiredQualifications ?? [];
  const niceToHave = job.niceToHave ?? job.preferredQualifications ?? [];
  const benefits = job.benefits ?? [];
  const aiScore = job.aiScore ?? null;

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Back link */}
        <button
          onClick={() => navigate("/candidate/jobs")}
          className="flex items-center gap-2 text-[var(--color-brand-blue)] hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Job Search
        </button>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Left: main job content ── */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-8">
                {/* Company logo + header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--color-brand-blue)] to-[var(--color-brand-teal)] flex items-center justify-center text-3xl flex-shrink-0">
                    {logo}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-[var(--color-brand-blue)] mb-1">
                      {job.title}
                    </h1>
                    <p className="text-xl text-[var(--color-muted-foreground)] mb-4">{companyName}</p>

                    <div className="flex flex-wrap gap-3 text-sm text-[var(--color-muted-foreground)] mb-4">
                      {job.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" /> {job.location}
                        </div>
                      )}
                      {(job.employmentType ?? job.type) && (
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" /> {job.employmentType ?? job.type}
                        </div>
                      )}
                      {salary && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" /> {salary}
                        </div>
                      )}
                      {job.postedDays != null && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" /> Posted {job.postedDays}d ago
                        </div>
                      )}
                      {job.applicants != null && (
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" /> {job.applicants} applicants
                        </div>
                      )}
                    </div>

                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {skills.map((s) => (
                          <Badge key={s} variant="info">{s}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA buttons */}
                <div className="space-y-3 mb-8 pt-6 border-t border-[var(--color-border)]">
                  <div className="flex flex-col sm:flex-row gap-3">
                    {applied ? (
                      <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-green-700 font-medium">
                        <CheckCircle className="w-5 h-5" /> Application Submitted!
                      </div>
                    ) : (
                      <>
                        <Button
                          size="lg"
                          className="flex-1"
                          disabled={applying}
                          onClick={handleQuickApplyClick}
                        >
                          {applying ? (
                            <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Applying…</>
                          ) : (
                            "Quick Apply"
                          )}
                        </Button>
                        <Button
                          size="lg"
                          variant="secondary"
                          className="flex-1"
                          disabled={applying}
                          onClick={() => setShowApplyModal(true)}
                        >
                          Apply with Custom CV
                        </Button>
                      </>
                    )}
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      size="lg"
                      variant="outline"
                      className="flex-1 border-brand-teal text-brand-teal hover:bg-brand-teal/5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                      onClick={() => openChat(id, job.title, companyName)}
                    >
                      <MessageSquare className="w-5 h-5" />
                      Ask AI Advisor
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={handleToggleSave}
                      aria-label={saved ? "Unsave" : "Save"}
                      className="w-auto px-4"
                    >
                      {saved ? (
                        <Bookmark className="w-5 h-5 fill-current text-[var(--color-brand-teal)]" />
                      ) : (
                        <Bookmark className="w-5 h-5" />
                      )}
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      aria-label="Share" 
                      onClick={() => setShowShareModal(true)}
                      className="w-auto px-4"
                    >
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {applyError && (
                  <p className="mb-6 text-sm text-red-600 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {applyError}
                  </p>
                )}

                {/* Job details */}
                <div className="space-y-8">
                  {job.description && (
                    <div>
                      <h2 className="text-xl font-semibold text-[var(--color-brand-blue)] mb-3">
                        About the Role
                      </h2>
                      <p className="text-[var(--color-muted-foreground)] whitespace-pre-line leading-relaxed">
                        {job.description}
                      </p>
                    </div>
                  )}

                  {responsibilities.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold text-[var(--color-brand-blue)] mb-3">
                        Key Responsibilities
                      </h2>
                      <CheckList
                        items={responsibilities}
                        icon={CheckCircle}
                        iconClass="text-[var(--color-brand-teal)]"
                      />
                    </div>
                  )}

                  {requirements.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold text-[var(--color-brand-blue)] mb-3">
                        Requirements
                      </h2>
                      <CheckList
                        items={requirements}
                        icon={CheckCircle}
                        iconClass="text-[var(--color-brand-teal)]"
                      />
                    </div>
                  )}

                  {niceToHave.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold text-[var(--color-brand-blue)] mb-3">
                        Nice to Have
                      </h2>
                      <CheckList
                        items={niceToHave}
                        icon={Award}
                        iconClass="text-purple-500"
                      />
                    </div>
                  )}

                  {benefits.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold text-[var(--color-brand-blue)] mb-3">
                        Benefits &amp; Perks
                      </h2>
                      <CheckList
                        items={benefits}
                        icon={CheckCircle}
                        iconClass="text-green-600"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── Right sidebar ── */}
          <div className="space-y-6">

            {/* AI Match Analysis */}
            {aiScore !== null && (
              <Card>
                <CardHeader>
                  <h3 className="font-semibold text-lg">AI Match Analysis</h3>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <AIScoreCircular score={aiScore} size={140} strokeWidth={10} />
                </CardContent>
              </Card>
            )}

            {/* About the Company */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-lg">About {companyName}</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(job.company?.description ?? job.companyDescription) && (
                    <p className="text-sm text-[var(--color-muted-foreground)]">
                      {job.company?.description ?? job.companyDescription}
                    </p>
                  )}
                  <div className="space-y-2 text-sm">
                    {companyWebsite && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[var(--color-brand-teal)]" />
                        <a
                          href={companyWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--color-brand-blue)] hover:underline truncate"
                        >
                          {companyWebsite}
                        </a>
                      </div>
                    )}
                    {(job.company?.size ?? job.companySize) && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[var(--color-brand-teal)]" />
                        <span className="text-[var(--color-muted-foreground)]">
                          {job.company?.size ?? job.companySize} employees
                        </span>
                      </div>
                    )}
                    {(job.company?.industry ?? job.industry) && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-[var(--color-brand-teal)]" />
                        <span className="text-[var(--color-muted-foreground)]">
                          {job.company?.industry ?? job.industry}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ready to Apply CTA */}
            <Card className="bg-gradient-to-br from-[var(--color-brand-blue)] to-[var(--color-brand-teal)] text-white border-0">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Ready to Apply?</h3>
                <p className="text-sm text-blue-100 mb-4">
                  {aiScore !== null 
                    ? `Your profile is a ${aiScore}% match for this role. Apply now to stand out!` 
                    : `Apply now to stand out!`}
                </p>
                {applied ? (
                  <div className="flex items-center gap-2 text-green-200 font-medium">
                    <CheckCircle className="w-5 h-5" /> Application submitted!
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button
                      variant="secondary"
                      className="w-full"
                      disabled={applying}
                      onClick={handleQuickApplyClick}
                    >
                      {applying ? (
                        <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                      ) : (
                        "Quick Apply"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-blue-200 text-blue-100 hover:bg-blue-800"
                      disabled={applying}
                      onClick={() => setShowApplyModal(true)}
                    >
                      Apply with Custom CV
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Modal open={showApplyModal} onOpenChange={setShowApplyModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Apply with Custom CV</ModalTitle>
            <ModalDescription>
              Upload a specific PDF resume for this application. It will not overwrite your main profile CV.
            </ModalDescription>
          </ModalHeader>
          <div className="py-4">
            <label className="block text-sm font-medium text-[var(--color-muted-foreground)] mb-2">
              Select Resume (PDF only)
            </label>
            <input
              type="file"
              accept=".pdf"
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100 cursor-pointer"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
          </div>
          <ModalFooter>
            <ModalClose asChild>
              <Button variant="outline" disabled={standardApplying}>Cancel</Button>
            </ModalClose>
            <Button onClick={handleStandardApply} disabled={!selectedFile || standardApplying}>
              {standardApplying ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</> : "Submit Application"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Confirm Quick Apply Modal */}
      <Modal open={showConfirmQuickApplyModal} onOpenChange={setShowConfirmQuickApplyModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Confirm Quick Apply</ModalTitle>
            <ModalDescription>
              Are you sure you want to apply for <strong>{job.title}</strong> at <strong>{companyName}</strong>?
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

      {/* Share Job Modal */}
      <Modal open={showShareModal} onOpenChange={setShowShareModal}>
        <ModalContent className="sm:max-w-md">
          <ModalHeader>
            <ModalTitle>Share Job</ModalTitle>
            <ModalDescription>
              Share <strong>{job.title}</strong> at <strong>{companyName}</strong> with your network.
            </ModalDescription>
          </ModalHeader>
          <div className="grid grid-cols-3 gap-3 py-4">
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out this job: ${job.title} at ${companyName} - ${window.location.href}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors gap-2 text-center"
            >
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <svg className="w-5 h-5 text-green-600 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.394 9.806-9.799.002-2.618-1.01-5.078-2.852-6.92C16.386 2.043 13.932 1.03 11.31 1.03c-5.404 0-9.807 4.403-9.81 9.812-.001 1.564.487 3.09 1.411 4.418L1.921 21.07l4.726-1.916zm12.39-4.9c-.33-.165-1.951-.963-2.251-1.072-.3-.11-.518-.165-.736.165-.218.33-.845 1.072-1.036 1.292-.19.22-.382.247-.712.082-1.748-.87-2.887-1.414-4.041-3.398-.3-.518.3-.481.859-1.6.09-.19.045-.353-.022-.486-.067-.133-.518-1.292-.736-1.815-.213-.518-.46-.447-.63-.447-.165 0-.353-.016-.54-.016s-.492.07-.75.353c-.258.282-.984.962-.984 2.348 0 1.387 1.007 2.722 1.148 2.912.14.19 1.982 3.027 4.8 4.237.67.288 1.195.46 1.602.59.673.214 1.287.184 1.77.112.54-.08 1.65-.674 1.883-1.325.23-.65.23-1.21.162-1.325-.067-.116-.258-.19-.588-.355z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-slate-700">WhatsApp</span>
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors gap-2 text-center"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                <svg className="w-5 h-5 text-blue-700 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-slate-700">LinkedIn</span>
            </a>
            <button
              onClick={handleCopyLink}
              className="flex flex-col items-center justify-center p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors gap-2 text-center cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                {copied ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Share2 className="w-5 h-5" />}
              </div>
              <span className="text-xs font-medium text-slate-700">{copied ? "Copied!" : "Copy Link"}</span>
            </button>
          </div>
          <ModalFooter>
            <ModalClose asChild>
              <Button variant="outline" className="w-full">Close</Button>
            </ModalClose>
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
