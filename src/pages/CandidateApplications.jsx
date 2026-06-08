import { useState, useEffect } from "react";
import ApplicationsHeader from "../features/applications/components/shared/ApplicationsHeader.jsx";
import ApplicationsStats from "../features/applications/components/shared/ApplicationsStats.jsx";
import ApplicationTimelineCard from "../features/applications/components/timeline/ApplicationTimelineCard.jsx";
import ApplicationKanbanColumn from "../features/applications/components/kanban/ApplicationKanbanColumn.jsx";
import ApplicationsSkeleton from "../features/applications/components/shared/ApplicationsSkeleton.jsx";
import { useApplicationStore } from "../store/applicationStore.js";

const mapApplication = (app) => {
  const stageKey = app.stage?.key || "applied";
  
  let status = "Applied";
  let currentStageIndex = 0;
  let kanbanBucket = "inProgress";
  let alertMessage = "";

  if (stageKey === "rejected") {
    status = "Rejected";
    kanbanBucket = "rejected";
    currentStageIndex = 1;
    alertMessage = "Position filled";
  } else if (stageKey === "offer" || stageKey === "hired") {
    status = stageKey === "hired" ? "Hired" : "Offer Received";
    kanbanBucket = "offers";
    currentStageIndex = 3;
    alertMessage = stageKey === "hired" ? "Congratulations on your new role!" : "Competitive package";
  } else if (stageKey === "interview") {
    status = "Interview Scheduled";
    kanbanBucket = "inProgress";
    currentStageIndex = 2;
    alertMessage = "Check your email for details";
  } else if (stageKey === "shortlisted") {
    status = "In Review";
    kanbanBucket = "inProgress";
    currentStageIndex = 1;
  } else {
    status = "In Review";
    kanbanBucket = "inProgress";
    currentStageIndex = 0;
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const appliedDateStr = formatDate(app.createdAt);
  const changedDateStr = formatDate(app.stage?.changedAt || app.updatedAt);

  return {
    id: app._id,
    jobId: app.jobId?._id || app.jobId,
    role: app.jobId?.title || "Software Engineer",
    company: app.companyId?.name || "Company",
    location: app.jobId?.location || "Remote",
    appliedDate: appliedDateStr,
    aiScore: app.aiScreening?.overallScore || 0,
    status,
    alertMessage,
    currentStageIndex,
    stageDates: {
      applied: appliedDateStr,
      reviewed: currentStageIndex >= 1 ? changedDateStr : "",
      interview: currentStageIndex >= 2 ? changedDateStr : "",
      offer: status === "Rejected" || currentStageIndex >= 3 ? changedDateStr : "",
    },
    kanbanBucket,
  };
};

export default function CandidateApplications() {
  const [viewMode, setViewMode] = useState("timeline");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const { loading, applications, fetchCandidateApplications } = useApplicationStore();

  useEffect(() => {
    fetchCandidateApplications();
  }, [fetchCandidateApplications]);

  const mappedApplications = (applications || []).map(mapApplication);

  const filteredApplications = mappedApplications.filter((app) => {
    const matchesSearch =
      app.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company.toLowerCase().includes(searchTerm.toLowerCase());

    if (viewMode === "kanban") {
      return matchesSearch;
    }

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "inProgress" && app.kanbanBucket === "inProgress") ||
      (statusFilter === "offers" && app.kanbanBucket === "offers") ||
      (statusFilter === "rejected" && app.kanbanBucket === "rejected");

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-slate-50/50 min-h-screen text-slate-800 font-sans py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ApplicationsHeader
          viewMode={viewMode}
          setViewMode={setViewMode}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />
        <ApplicationsStats apps={mappedApplications}/>
        {loading ? (
          <ApplicationsSkeleton viewMode={viewMode} />
        ) : viewMode === 'timeline' ? (
          <div className='mt-8 space-y-4 w-full'>
            {filteredApplications.length > 0 ? (
              filteredApplications.map(app => (
                <ApplicationTimelineCard key={app.id} app={app}/>
              ))
            ) : (
              <div className="bg-white rounded-2xl border border-gray-150 p-12 text-center text-gray-500 font-medium">
                No applications found matching your criteria.
              </div>
            )}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <ApplicationKanbanColumn 
              title="In Progress" 
              apps={filteredApplications.filter(app => app.kanbanBucket === 'inProgress')} 
            />
            <ApplicationKanbanColumn 
              title="Offers" 
              apps={filteredApplications.filter(app => app.kanbanBucket === 'offers')} 
            />
            <ApplicationKanbanColumn 
              title="Rejected" 
              apps={filteredApplications.filter(app => app.kanbanBucket === 'rejected')} 
            />
          </div>
        )}
      </div>
    </div>
  );
}