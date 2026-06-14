import React from "react";
import ApplicationsHeader from "../features/applications/components/shared/ApplicationsHeader.jsx";
import ApplicationsStats from "../features/applications/components/shared/ApplicationsStats.jsx";
import ApplicationTimelineCard from "../features/applications/components/timeline/ApplicationTimelineCard.jsx";
import ApplicationKanbanBoard from "../features/applications/components/kanban/ApplicationKanbanBoard.jsx";
import ApplicationsSkeleton from "../features/applications/components/shared/ApplicationsSkeleton.jsx";
import { AlertCircle } from "lucide-react";
import { useCandidateApplications } from "../hooks/useCandidateApplications.js";

export default function CandidateApplications() {
  const {
    viewMode,
    setViewMode,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    showFilters,
    setShowFilters,
    loading,
    error,
    mappedApplications,
    filteredApplications,
    kanbanBuckets,
    handleRetry,
  } = useCandidateApplications();

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-(--color-secondary-main) font-sans py-8">
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
        
        {error ? (
          <div className="mt-8 bg-red-50/40 border border-red-200/50 rounded-2xl p-8 text-center max-w-xl mx-auto shadow-micro animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="w-12 h-12 rounded-full bg-red-100/60 text-red-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-red-800 mb-1">Failed to Load Applications</h3>
            <p className="text-sm text-red-650/80 mb-6 font-medium">{error}</p>
            <button
              onClick={handleRetry}
              className="bg-[#EF4444] hover:bg-red-600 text-white font-bold text-sm px-6 py-2.5 rounded-[24px] transition-all shadow-2xs hover:shadow-sm cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        ) : loading ? (
          <ApplicationsSkeleton viewMode={viewMode} />
        ) : viewMode === 'timeline' ? (
          <div className="mt-8 space-y-4 w-full">
            {filteredApplications.length > 0 ? (
              filteredApplications.map(app => (
                <ApplicationTimelineCard key={app.id} app={app}/>
              ))
            ) : (
              <div className="bg-white rounded-2xl border border-(--color-border) p-12 text-center text-(--color-secondary-muted) font-semibold shadow-micro">
                No applications found matching your criteria.
              </div>
            )}
          </div>
        ) : (
          <ApplicationKanbanBoard kanbanBuckets={kanbanBuckets} />
        )}
      </div>
    </div>
  );
}