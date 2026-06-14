import { useState, useEffect, useMemo, useCallback } from 'react';
import { useApplicationStore } from '../store/applicationStore';
import { mapApplicationToDashboard } from '../utils/candidateMappers';

export function useCandidateApplications() {
  const [viewMode, setViewMode] = useState("timeline");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const { 
    loading, 
    error, 
    applications, 
    fetchCandidateApplications, 
    clearError 
  } = useApplicationStore();

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        await fetchCandidateApplications();
      } catch (err) {
        console.error(err);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [fetchCandidateApplications]);

  const mappedApplications = useMemo(() => {
    return (applications || []).map(mapApplicationToDashboard).filter(Boolean);
  }, [applications]);

  const filteredApplications = useMemo(() => {
    return mappedApplications.filter((app) => {
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
  }, [mappedApplications, searchTerm, statusFilter, viewMode]);

  const kanbanBuckets = useMemo(() => {
    return {
      inProgress: filteredApplications.filter(app => app.kanbanBucket === 'inProgress'),
      offers: filteredApplications.filter(app => app.kanbanBucket === 'offers'),
      rejected: filteredApplications.filter(app => app.kanbanBucket === 'rejected'),
    };
  }, [filteredApplications]);

  const handleRetry = useCallback(() => {
    clearError();
    fetchCandidateApplications();
  }, [clearError, fetchCandidateApplications]);

  return {
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
  };
}
