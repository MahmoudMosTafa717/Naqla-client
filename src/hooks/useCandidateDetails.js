import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApplicationStore } from '../store/applicationStore';
import { useAuthStore } from '../store/authStore';
import {
  getCandidateRecommendation,
  getCompanyRecommendation,
} from '../services/interviewRecommendationApi';
import { mapApplicationToCandidateDetails } from '../utils/candidateMappers';

export function useCandidateDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentApplication, fetchApplicationDetails, loading } = useApplicationStore();
  const user = useAuthStore((s) => s.user);
  const isHR = user?.role === "employer";

  const [recommendation, setRecommendation] = useState(null);
  const [loadingRecommendation, setLoadingRecommendation] = useState(false);
  const [error, setError] = useState(null);

  // Fetch application details on mount / ID changes
  const loadApplication = useCallback(async (active = true) => {
    if (!id) return;
    setError(null);
    try {
      await fetchApplicationDetails(id);
    } catch (err) {
      console.error("Failed to fetch application details:", err);
      if (active) setError(err.message || "Failed to load candidate application details.");
    }
  }, [id, fetchApplicationDetails]);

  useEffect(() => {
    let active = true;
    loadApplication(active);
    return () => {
      active = false;
    };
  }, [loadApplication]);

  // Fetch AI coach recommendations when application/user role is determined
  useEffect(() => {
    let active = true;
    if (id && user) {
      const loadRecommendation = async () => {
        setLoadingRecommendation(true);
        try {
          const apiCall = isHR ? getCompanyRecommendation : getCandidateRecommendation;
          const { data } = await apiCall(id);
          if (active && data && data.recommendations) {
            setRecommendation(data.recommendations);
          }
        } catch (err) {
          console.log("No recommendation found or not ready yet.");
        } finally {
          if (active) setLoadingRecommendation(false);
        }
      };
      loadRecommendation();
    }

    return () => {
      active = false;
    };
  }, [id, isHR, user]);

  // Memoize the candidate data mapping
  const candidate = useMemo(() => {
    return mapApplicationToCandidateDetails(currentApplication);
  }, [currentApplication]);

  // Memoize the latest interview data extraction
  const latestInterview = useMemo(() => {
    return currentApplication?.interviewIds?.length > 0
      ? currentApplication.interviewIds[currentApplication.interviewIds.length - 1]
      : null;
  }, [currentApplication]);

  const handleRetry = useCallback(() => {
    loadApplication(true);
  }, [loadApplication]);

  return {
    id,
    navigate,
    currentApplication,
    loading,
    isHR,
    recommendation,
    loadingRecommendation,
    candidate,
    latestInterview,
    error,
    handleRetry,
  };
}
