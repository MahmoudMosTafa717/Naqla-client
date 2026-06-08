import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PipelineHeader from '../features/piplines/components/PipelineHeader';
import KanbanColumn from '../features/piplines/components/KanbanColumn';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useApplicationStore } from '../store/applicationStore';
import { RejectConfirmationModal } from '../features/applications/components/kanban/RejectConfirmationModal';
import { getJobById } from '../services/jobsApi';

const mapApplicationToCandidateCard = (app) => ({
  id: app._id,
  name: app.candidateId?.fullName || app.candidateId?.name || "Unnamed Candidate",
  initials: app.candidateId?.fullName 
    ? app.candidateId.fullName.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : "AN",
  role: app.candidateId?.profile?.basicInfo?.headline || "Software Engineer",
  email: app.candidateId?.email || "",
  phone: app.candidateId?.profile?.basicInfo?.phone || "",
  appliedAt: app.createdAt,
  hiredAt: app.stage?.key === 'hired' ? app.stage.changedAt || app.updatedAt : null,
  score: app.aiScreening?.overallScore || 0,
  skills: app.aiScreening?.matchedSkills || app.candidateId?.profile?.skills || [],
  location: app.candidateId?.profile?.basicInfo?.location 
    ? `${app.candidateId.profile.basicInfo.location.city || ''}, ${app.candidateId.profile.basicInfo.location.country || ''}`.replace(/^,\s*|,\s*$/, '') 
    : "",
  experience: app.candidateId?.profile?.resume?.parsedData?.experienceYears || app.candidateId?.profile?.experience?.length || 0,
  redFlags: app.aiScreening?.redFlags?.length > 0 ? app.aiScreening.redFlags.map(r => r.message).join(', ') : null,
  isStarred: app.internalRating?.average >= 4,
});

function KanbanPipeline() {
  const { jobId } = useParams();
  const { fetchJobKanban, kanbanData, updateApplicationStage, loading } = useApplicationStore();
  const [rejectingAppId, setRejectingAppId] = useState(null);
  const [job, setJob] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  useEffect(() => {
    if (jobId) {
      fetchJobKanban(jobId);
      getJobById(jobId)
        .then((res) => {
          setJob(res.data);
        })
        .catch((err) => {
          console.error("Failed to fetch job details:", err);
        });
    }
  }, [jobId, fetchJobKanban]);

  const columns = {
    applied: (kanbanData?.applied || []).map(mapApplicationToCandidateCard),
    shortlisted: (kanbanData?.shortlisted || []).map(mapApplicationToCandidateCard),
    interview: (kanbanData?.interview || []).map(mapApplicationToCandidateCard),
    offerSent: (kanbanData?.offer || []).map(mapApplicationToCandidateCard),
    hired: (kanbanData?.hired || []).map(mapApplicationToCandidateCard),
    rejected: (kanbanData?.rejected || []).map(mapApplicationToCandidateCard),
  };

  const totalCandidates = Object.values(columns).reduce((acc, col) => acc + col.length, 0);
  const allCandidates = Object.values(columns).flat();
  const avgMatchScore = allCandidates.length > 0 
    ? Math.round(allCandidates.reduce((acc, c) => acc + (c.score || 0), 0) / allCandidates.length)
    : 0;

    // incase in al hr msh 7atet totaldays
  const hiredCandidates = columns.hired || [];
  const totalDays = hiredCandidates.reduce((sum, c) => {
    const start = new Date(c.appliedAt);
    const end = c.hiredAt ? new Date(c.hiredAt) : new Date();
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return sum + diffDays;
  }, 0);

  const avgTimeToHire = hiredCandidates.length > 0 
    ? `${Math.round(totalDays / hiredCandidates.length)}d`
    : "14d";

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const cardId = active.id;
    const targetColumnId = over.id;

    let sourceColumnId = null;
    const mappedTargetColumnId = targetColumnId === 'offerSent' ? 'offer' : targetColumnId;

    Object.keys(kanbanData || {}).forEach(colId => {
      if ((kanbanData[colId] || []).some(app => app._id === cardId)) {
        sourceColumnId = colId;
      }
    });

    if (!sourceColumnId || sourceColumnId === mappedTargetColumnId) return;

    if (targetColumnId === 'rejected') {
      setRejectingAppId(cardId);
      return;
    }

    try {
      await updateApplicationStage(cardId, {
        stage: { key: mappedTargetColumnId }
      });
    } catch (error) {
      console.error("Failed to update candidate stage:", error);
    }
  };

  const handleRejectModalClose = () => {
    setRejectingAppId(null);
    if (jobId) {
      fetchJobKanban(jobId);
    }
  };

  if (!jobId) {
    return (
      <div className="p-12 text-center text-slate-500 bg-slate-50/50 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl border border-slate-200/60 shadow-md max-w-md">
          <h2 className="text-xl font-bold text-slate-800 mb-2">No Job Selected</h2>
          <p className="text-sm text-slate-500">
            Please navigate to the job pipeline page from your dashboard to view applicants.
          </p>
        </div>
      </div>
    );
  }

  const isColumnsEmpty = Object.values(columns).every(col => col.length === 0);

  if (loading && isColumnsEmpty) {
    return (
      <div className="p-6 bg-slate-50/50 min-h-screen space-y-6">
        <div className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-100 border border-gray-200/60 rounded-2xl p-4 h-[600px] space-y-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="h-40 bg-gray-200 rounded-xl"></div>
              <div className="h-40 bg-gray-200 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50/50 min-h-screen text-gray-800 font-sans flex flex-col gap-6">
      <PipelineHeader 
        jobTitle={job?.title || "Loading Job..."} 
        totalCandidates={totalCandidates} 
        avgMatchScore={avgMatchScore} 
        avgTimeToHire={avgTimeToHire}
      />
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex gap-5 overflow-x-auto pb-6 select-none flex-1 items-start">
          <KanbanColumn id="applied" title="Applied" count={columns.applied.length} candidates={columns.applied} colorClass="border-t-blue-500" />
          <KanbanColumn id="shortlisted" title="Shortlisted" count={columns.shortlisted.length} candidates={columns.shortlisted} colorClass="border-t-teal-400" />
          <KanbanColumn id="interview" title="Interview" count={columns.interview.length} candidates={columns.interview} colorClass="border-t-purple-500" />
          <KanbanColumn id="offerSent" title="Offer Sent" count={columns.offerSent.length} candidates={columns.offerSent} colorClass="border-t-amber-500" />
          <KanbanColumn id="hired" title="Hired" count={columns.hired.length} candidates={columns.hired} colorClass="border-t-emerald-500" />
          <KanbanColumn id="rejected" title="Rejected" count={columns.rejected.length} candidates={columns.rejected} colorClass="border-t-red-500" />
        </div>
      </DndContext>

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