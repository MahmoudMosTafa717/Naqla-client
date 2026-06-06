import apiClient from "../config/axios.js";

export async function getCandidateProfile() {
  const { data } = await apiClient.get("/profiles/me");
  return data;
}

export async function updateCandidateProfile(payload) {
  const { data } = await apiClient.put("/profiles/me", payload);
  return data;
}

export async function uploadCandidateCV(file, { onUploadProgress } = {}) {
  const formData = new FormData();
  formData.append("cv", file);

  const { data } = await apiClient.post("/profiles/cv", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress,
    timeout: 120000,
  });
  return data;
}

export async function uploadCandidateAvatar(file) {
  const formData = new FormData();
  formData.append("avatar", file);
  const { data } = await apiClient.post("/profiles/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 120000,
  });
  return data;
}

export async function getDashboardStats() {
  const { data } = await apiClient.get("/profiles/stats");
  if (data && data.success) return data.data;
  return null;
}

export async function saveJob(jobId) {
  const { data } = await apiClient.post(`/profiles/saved-jobs/${jobId}`);
  return data;
}

export async function unsaveJob(jobId) {
  const { data } = await apiClient.delete(`/profiles/saved-jobs/${jobId}`);
  return data;
}

export async function getSavedJobs() {
  const { data } = await apiClient.get("/profiles/saved-jobs");
  return data;
}
