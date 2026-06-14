import PipelineHeader from '../features/piplines/components/PipelineHeader';
import KanbanBoard from '../features/piplines/components/KanbanBoard';
import { RejectConfirmationModal } from '../features/applications/components/kanban/RejectConfirmationModal';
import { useKanbanData } from '../hooks/useKanbanData';

function KanbanPipeline() {
  const {
    jobId,
    job,
    loading,
    sortBy,
    setSortBy,
    columns,
    totalCandidates,
    avgMatchScore,
    avgTimeToHire,
    sensors,
    handleExport,
    handleDragEnd,
    rejectingAppId,
    handleRejectModalClose,
    isColumnsEmpty,
    error,
    handleRetry,
  } = useKanbanData();

  if (!jobId) {
    return (
      <div className="p-12 text-center text-(--color-secondary-muted) bg-(--color-bg-page) min-h-screen flex items-center justify-center font-sans">
        <div className="bg-white p-8 rounded-2xl border border-(--color-border) shadow-micro max-w-md">
          <h2 className="text-xl font-extrabold text-(--color-secondary-main) mb-2 tracking-tight">No Job Selected</h2>
          <p className="text-sm text-(--color-secondary-muted) leading-relaxed">
            Please navigate to the job pipeline page from your dashboard to view applicants.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 text-center text-(--color-secondary-muted) bg-(--color-bg-page) min-h-screen flex items-center justify-center font-sans">
        <div className="bg-white p-8 rounded-2xl border border-red-200 shadow-micro max-w-md">
          <h2 className="text-xl font-extrabold text-red-600 mb-2 tracking-tight">Error Loading Pipeline</h2>
          <p className="text-sm text-(--color-secondary-muted) leading-relaxed mb-6">
            {error}
          </p>
          <button
            onClick={() => handleRetry(true)}
            className="w-full bg-[var(--color-primary-main)] text-white font-bold rounded-[24px] py-2.5 text-sm hover:opacity-90 transition-opacity cursor-pointer shadow-md"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (loading && isColumnsEmpty) {
    return (
      <div className="p-6 bg-(--color-bg-page) min-h-screen space-y-6 font-sans">
        <div className="h-24 bg-white border border-(--color-border) rounded-2xl p-5 shadow-micro animate-pulse flex items-center justify-between">
          <div className="h-8 bg-slate-100 rounded-lg w-1/3"></div>
          <div className="h-8 bg-slate-100 rounded-[24px] w-1/5"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white border border-(--color-border) rounded-2xl p-4 h-[600px] space-y-4 animate-pulse shadow-micro">
              <div className="h-8 bg-slate-100 rounded-lg w-1/2 mb-6"></div>
              <div className="h-40 bg-slate-50/50 border border-(--color-border) rounded-xl"></div>
              <div className="h-40 bg-slate-50/50 border border-(--color-border) rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-(--color-bg-page) min-h-screen text-(--color-secondary-main) font-sans flex flex-col gap-6 select-none">
      <PipelineHeader 
        jobTitle={job?.title || "Loading Job..."} 
        totalCandidates={totalCandidates} 
        avgMatchScore={avgMatchScore} 
        avgTimeToHire={avgTimeToHire}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onExport={handleExport}
      />
      
      <KanbanBoard 
        sensors={sensors}
        handleDragEnd={handleDragEnd}
        columns={columns}
      />

      {rejectingAppId && (
        <RejectConfirmationModal
          applicationId={rejectingAppId}
          onClose={handleRejectModalClose}
        />
      )}
    </div>
  );
}

export default KanbanPipeline;