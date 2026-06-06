import { useCallback, useEffect, useRef, useState } from "react";
import {
  getCandidateProfile,
  updateCandidateProfile,
  uploadCandidateCV,
} from "../../../services/profileApi.js";

export function useProfile({ pollParse = false, onProfileLoaded } = {}) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const pollRef = useRef(null);

  const loadProfile = useCallback(async () => {
    setError("");
    try {
      const data = await getCandidateProfile();
      if (!data?.success) {
        throw new Error(data?.message || "Failed to load profile.");
      }
      setProfile(data.profile);
      onProfileLoaded?.(data.profile);
      return data.profile;
    } catch (err) {
      setError(err.message || "Failed to load profile.");
      return null;
    } finally {
      setLoading(false);
    }
  }, [onProfileLoaded]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!cancelled) await loadProfile();
    })();
    return () => {
      cancelled = true;
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [loadProfile]);

  useEffect(() => {
    if (!pollParse || !profile) return undefined;

    const status = profile?.resume?.parseStatus;
    if (!status || status === "done" || status === "failed" || status === "none") {
      return undefined;
    }

    pollRef.current = setInterval(async () => {
      const next = await loadProfile();
      const nextStatus = next?.resume?.parseStatus;
      if (
        nextStatus === "done" ||
        nextStatus === "failed" ||
        nextStatus === "none"
      ) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    }, 3000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [pollParse, profile?.resume?.parseStatus, loadProfile]);

  const saveProfile = async (payload) => {
    setSaving(true);
    setError("");
    try {
      const data = await updateCandidateProfile(payload);
      if (!data?.success) {
        throw new Error(data?.message || "Failed to save profile.");
      }
      setProfile(data.profile);
      return data.profile;
    } catch (err) {
      setError(err.message || "Failed to save profile.");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const uploadCV = async (file, options) => {
    setSaving(true);
    setError("");
    try {
      const data = await uploadCandidateCV(file, options);
      if (!data?.success) {
        throw new Error(data?.message || "Failed to upload resume.");
      }
      setProfile(data.profile);
      return data.profile;
    } catch (err) {
      setError(err.message || "Failed to upload resume.");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return {
    profile,
    setProfile,
    loading,
    error,
    saving,
    setError,
    loadProfile,
    saveProfile,
    uploadCV,
  };
}
