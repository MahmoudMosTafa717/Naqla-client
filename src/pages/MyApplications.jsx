import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  MapPin,
  Clock,
  Filter,
  Calendar,
  MessageSquare,
  FileText,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { AIScoreBadge } from "../components/ui/AIScoreBadge";
import { getMyApplications } from "../services/applicationApi";

// helpers  

function statusVariant(status) {
  const map = {
    "Interview Scheduled": "info",
    "In Review": "warning",
    Reviewing: "warning",
    Applied: "default",
    Rejected: "error",
    "Offer Received": "success",
  };
  return map[status] ?? "default";
}

function isInProgress(status) {
  return ["Applied", "In Review", "Reviewing", "Interview Scheduled"].includes(status);
}

// Derive a simplified timeline from the application object
function buildTimeline(app) {
  if (app.timeline?.length) return app.timeline;

  const stages = [
    { stage: "Applied", completed: true, date: app.appliedDate },
    {
      stage: "Reviewed",
      completed: ["In Review", "Reviewing", "Interview Scheduled", "Offer Received", "Rejected"].includes(app.status),
      date: null,
    },
    {
      stage: "Interview",
      completed: ["Interview Scheduled", "Offer Received"].includes(app.status),
      date: app.interviewDate ?? null,
    },
    {
      stage: "Offer",
      completed: app.status === "Offer Received",
      date: null,
    },
  ];

  return app.status === "Rejected"
    ? [
      ...stages.slice(0, 2),
      { stage: "Rejected", completed: true, date: null },
    ]
    : stages;
}

// ── sub-components ────────────────────────────────────────────────────────────

function StatCard({ label, value, colorClass }) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm text-[var(--color-muted-foreground)] mb-1">{label}</p>
        <p className={`text-3xl font-bold ${colorClass ?? "text-[var(--color-foreground)]"}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

function TimelineTrack({ timeline }) {
  return (
    <div className="flex items-center gap-1">
      {timeline.map((step, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${step.completed
                ? "bg-[var(--color-brand-teal)] text-white"
                : "bg-gray-200 text-gray-400"
                }`}
            >
              {step.completed ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-current" />
              )}
            </div>
            <p className={`text-xs mt-1 whitespace-nowrap ${step.completed ? "text-[var(--color-foreground)] font-medium" : "text-[var(--color-muted-foreground)]"}`}>
              {step.stage}
            </p>
            {step.date && (
              <p className="text-xs text-[var(--color-muted-foreground)]">
                {new Date(step.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </p>
            )}
          </div>
          {i < timeline.length - 1 && (
            <div
              className={`h-0.5 w-6 sm:w-12 mb-5 ${step.completed ? "bg-[var(--color-brand-teal)]" : "bg-gray-200"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function ApplicationCard({ app, navigate }) {
  const timeline = buildTimeline(app);
  const logo = app.logo ?? app.company?.logo ?? "🏢";
  const companyName = app.company ?? app.companyName ?? app.company?.name ?? "Company";
  const role = app.role ?? app.jobTitle ?? "Role";
  const location = app.location ?? app.company?.location ?? "";

  return (
    <Card hover>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Logo */}
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--color-brand-blue)] to-[var(--color-brand-teal)] flex items-center justify-center text-2xl flex-shrink-0">
            {logo}
          </div>

          <div className="flex-1 min-w-0">
            {/* Header row */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <h3 className="font-semibold text-lg text-[var(--color-foreground)]">{role}</h3>
                  {app.aiScore != null && <AIScoreBadge score={app.aiScore} size="sm" />}
                </div>
                <p className="text-[var(--color-muted-foreground)] font-medium mb-1">{companyName}</p>
                <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-muted-foreground)]">
                  {location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {location}
                    </div>
                  )}
                  {app.appliedDate && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Applied {new Date(app.appliedDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
              <Badge variant={statusVariant(app.status)}>{app.status}</Badge>
            </div>

            {/* Contextual alert banners */}
            {app.status === "Interview Scheduled" && app.interviewDate && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[var(--color-brand-blue)] flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-[var(--color-brand-blue)]">Interview scheduled</p>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    {new Date(app.interviewDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            )}

            {app.status === "Rejected" && app.rejectionReason && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-700">Application not successful</p>
                  <p className="text-sm text-red-600">{app.rejectionReason}</p>
                </div>
              </div>
            )}

            {app.status === "Offer Received" && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-700">Offer received!</p>
                  {app.offerDetails && (
                    <p className="text-sm text-green-600">{app.offerDetails}</p>
                  )}
                </div>
              </div>
            )}

            {/* Timeline stepper */}
            <div className="mb-4 overflow-x-auto">
              <TimelineTrack timeline={timeline} />
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate(`/candidate/jobs/${app.jobId ?? app._id ?? app.id}`)}
              >
                View Job
              </Button>
              {app.status === "Interview Scheduled" && (
                <Button size="sm">
                  <Calendar className="w-3.5 h-3.5" /> Interview Details
                </Button>
              )}
              {app.status === "Offer Received" && (
                <Button size="sm">
                  <FileText className="w-3.5 h-3.5" /> View Offer
                </Button>
              )}
              <Button size="sm" variant="ghost">
                <MessageSquare className="w-3.5 h-3.5" /> Message
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Kanban column ─────────────────────────────────────────────────────────────

function KanbanColumn({ title, apps, navigate }) {
  return (
    <div className="bg-white rounded-xl border border-[var(--color-border)]">
      <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
        <h3 className="font-semibold text-[var(--color-foreground)]">{title}</h3>
        <span className="px-2 py-1 bg-gray-100 rounded-full text-sm font-medium">
          {apps.length}
        </span>
      </div>
      <div className="p-4 space-y-3 min-h-[200px]">
        {apps.map((app) => {
          const logo = app.logo ?? "🏢";
          const role = app.role ?? app.jobTitle ?? "Role";
          const companyName = app.company ?? app.companyName ?? "";
          return (
            <Card key={app._id ?? app.id} hover>
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-brand-blue)] to-[var(--color-brand-teal)] flex items-center justify-center text-xl flex-shrink-0">
                    {logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-[var(--color-foreground)] truncate">{role}</h4>
                    <p className="text-xs text-[var(--color-muted-foreground)] truncate">{companyName}</p>
                  </div>
                </div>
                {app.aiScore != null && <AIScoreBadge score={app.aiScore} size="sm" />}
                <div className="mt-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs"
                    onClick={() => navigate(`/candidate/jobs/${app.jobId ?? app._id ?? app.id}`)}
                  >
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {apps.length === 0 && (
          <p className="text-sm text-center text-[var(--color-muted-foreground)] py-6">
            Nothing here yet
          </p>
        )}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function MyApplications() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("timeline");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getMyApplications();
        setApplications(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const inProgress = applications.filter((a) => isInProgress(a.status));
  const offers = applications.filter((a) => a.status === "Offer Received");
  const rejected = applications.filter((a) => a.status === "Rejected");

  const responseRate = applications.length
    ? Math.round(
      (applications.filter((a) => a.status !== "Applied").length / applications.length) * 100
    )
    : 0;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-brand-teal)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Page header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-brand-blue)] mb-2">
              My Applications
            </h1>
            <p className="text-[var(--color-muted-foreground)]">
              Track the status of all your job applications
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* View mode toggle */}
            <div className="flex bg-[var(--color-muted)] rounded-lg p-1">
              {["timeline", "kanban"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${viewMode === mode ? "bg-white shadow-sm" : "hover:bg-white/50"
                    }`}
                >
                  {mode === "timeline" ? "Timeline View" : "Kanban View"}
                </button>
              ))}
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4" /> Filter
            </Button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <StatCard label="Total Applications" value={applications.length} />
          <StatCard label="In Progress" value={inProgress.length} colorClass="text-[var(--color-brand-teal)]" />
          <StatCard label="Offers" value={offers.length} colorClass="text-green-600" />
          <StatCard label="Response Rate" value={`${responseRate}%`} colorClass="text-[var(--color-brand-blue)]" />
        </div>

        {/* Empty state */}
        {applications.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Building2 className="w-14 h-14 mx-auto text-gray-300 mb-4" />
              <p className="font-semibold text-lg mb-2">No applications yet</p>
              <p className="text-sm text-[var(--color-muted-foreground)] mb-6">
                Start applying to jobs to track your progress here.
              </p>
              <Button onClick={() => navigate("/candidate/jobs")}>Browse Jobs</Button>
            </CardContent>
          </Card>
        )}

        {/* Timeline view */}
        {viewMode === "timeline" && applications.length > 0 && (
          <div className="space-y-4">
            {applications.map((app) => (
              <ApplicationCard key={app._id ?? app.id} app={app} navigate={navigate} />
            ))}
          </div>
        )}

        {/* Kanban view */}
        {viewMode === "kanban" && applications.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6">
            <KanbanColumn title="In Progress" apps={inProgress} navigate={navigate} />
            <KanbanColumn title="Offers" apps={offers} navigate={navigate} />
            <KanbanColumn title="Rejected" apps={rejected} navigate={navigate} />
          </div>
        )}
      </div>
    </div>
  );
}
