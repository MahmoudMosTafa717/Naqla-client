import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useApplicationStore } from '../store/applicationStore';
import { getJobById } from '../services/jobsApi';
import { usePipelineExport } from './usePipelineExport';
import { toast } from 'react-toastify';
import { 
  mapApplicationToCandidateCard, 
  calculateAverageMatchScore, 
  calculateAverageTimeToHire 
} from '../utils/candidateMappers';

const SENSOR_ACTIVATION_CONSTRAINT = { distance: 8 };

export function useKanbanData() {
  const { jobId } = useParams();
  const { fetchJobKanban, kanbanData, updateApplicationStage, loading } = useApplicationStore();
  
  const [rejectingAppId, setRejectingAppId] = useState(null);
  const [job, setJob] = useState(null);
  const [sortBy, setSortBy] = useState('score');
  const [error, setError] = useState(null);

  // Memoized sensor configuration to prevent re-creation on every render
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: SENSOR_ACTIVATION_CONSTRAINT,
  });
  const sensors = useSensors(pointerSensor);

  // Fetch job details and Kanban board
  const loadData = useCallback(async (active = true) => {
    if (!jobId) return;
    setError(null);
    try {
      await Promise.all([
        fetchJobKanban(jobId),
        getJobById(jobId).then((res) => {
          if (active) setJob(res.data);
        })
      ]);
    } catch (err) {
      console.error("Failed to load pipeline data:", err);
      if (active) {
        setError(err.message || "Failed to load candidate pipeline. Please try again.");
      }
    }
  }, [jobId, fetchJobKanban]);

  useEffect(() => {
    let active = true;
    loadData(active);
    return () => {
      active = false;
    };
  }, [loadData]);

  // Memoize column generation and sorting logic
  const columns = useMemo(() => {
    const sortCandidates = (list) => {
      const mapped = list.map(mapApplicationToCandidateCard).filter(Boolean);
      if (sortBy === 'score') {
        return mapped.sort((a, b) => (b.score || 0) - (a.score || 0));
      }
      if (sortBy === 'date') {
        return mapped.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
      }
      return mapped;
    };

    return {
      applied: sortCandidates(kanbanData?.applied || []),
      shortlisted: sortCandidates(kanbanData?.shortlisted || []),
      interview: sortCandidates(kanbanData?.interview || []),
      offerSent: sortCandidates(kanbanData?.offer || []),
      hired: sortCandidates(kanbanData?.hired || []),
      rejected: sortCandidates(kanbanData?.rejected || []),
    };
  }, [kanbanData, sortBy]);

  // Memoize analytics calculations to prevent run-path overhead
  const { totalCandidates, avgMatchScore, avgTimeToHire } = useMemo(() => {
    const total = Object.values(columns).reduce((acc, col) => acc + col.length, 0);
    const all = Object.values(columns).flat();
    const score = calculateAverageMatchScore(all);
    const time = calculateAverageTimeToHire(columns.hired || []);

    return {
      totalCandidates: total,
      avgMatchScore: score,
      avgTimeToHire: time,
    };
  }, [columns]);

  const handleExport = usePipelineExport(job?.title, columns);

  // Memoized drag and drop handler
  const handleDragEnd = useCallback(async (event) => {
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
      toast.success("Candidate status updated successfully.");
    } catch (error) {
      console.error("Failed to update candidate stage:", error);
      toast.error("Failed to update candidate status. Rolling back stage...");
      // Re-fetch to sync store state with server database in case of failure
      if (jobId) {
        fetchJobKanban(jobId);
      }
    }
  }, [kanbanData, updateApplicationStage, jobId, fetchJobKanban]);

  // Memoized close and refresh handler
  const handleRejectModalClose = useCallback(() => {
    setRejectingAppId(null);
    if (jobId) {
      fetchJobKanban(jobId);
    }
  }, [jobId, fetchJobKanban]);

  const isColumnsEmpty = useMemo(() => {
    return Object.values(columns).every(col => col.length === 0);
  }, [columns]);

  return {
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
    handleRetry: loadData,
  };
}
