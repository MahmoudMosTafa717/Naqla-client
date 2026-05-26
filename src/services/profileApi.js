import apiClient from "../config/axios.js";

export async function getCandidateProfile() {
  const { data } = await apiClient.get("/auth/profile");
  return data;
}

export async function updateCandidateProfile(payload) {
  const { data } = await apiClient.put("/auth/profile", payload);
  return data;
}

export async function uploadCandidateCV(file, { onUploadProgress } = {}) {
  const formData = new FormData();
  formData.append("cv", file);

  const { data } = await apiClient.post("/auth/profile/cv", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress,
    timeout: 120000,
  });
  return data;
}
