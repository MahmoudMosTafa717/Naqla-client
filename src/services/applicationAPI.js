import apiClient from "../config/axios.js";

/**
 * Candidate Routes
 */

/**
 * Apply to a job.
 * @param {FormData|object} payload - Either a FormData object (containing 'resume' file and 'jobId' text field) or a plain object.
 */
export async function applyToJob(payload) {
  const isMultipart = payload instanceof FormData;
  const { data } = await apiClient.post("/v1/applications/apply", payload, {
    headers: isMultipart ? { "Content-Type": "multipart/form-data" } : { "Content-Type": "application/json" },
  });
  return data;
}

/**
 * Get candidate's own applications.
 */
export async function getCandidateApplications() {
  const { data } = await apiClient.get("/v1/applications/my-applications");
  return data?.data || data;
}

/**
 * Quick apply to a job.
 * @param {string|object} payload - Either the jobId string or a payload object { jobId }.
 */
export async function quickApply(payload) {
  const body = typeof payload === "string" ? { jobId: payload } : payload;
  const { data } = await apiClient.post("/v1/applications/quick-apply", body);
  return data;
}

/**
 * Shared / Detail Routes
 */

/**
 * Get details of a single application.
 * @param {string} applicationId 
 */
export async function getApplicationDetails(applicationId) {
  const { data } = await apiClient.get(`/v1/applications/${applicationId}`);
  return data;
}

/**
 * Employer / HR Routes
 */

/**
 * Update the recruitment stage of an application.
 * @param {string} applicationId 
 * @param {object} payload - { stage: { key: string }, notes: string }
 */
export async function updateApplicationStage(applicationId, payload) {
  const { data } = await apiClient.put(`/v1/applications/update-stage/${applicationId}`, payload);
  return data;
}

/**
 * Get applications by job ID with optional pagination/filtering params.
 * @param {string} jobId 
 * @param {object} params - Query params (e.g. { page, limit })
 */
export async function getApplicationsByJob(jobId, params = {}) {
  const { data } = await apiClient.get(`/v1/applications/job/${jobId}`, { params });
  return data;
}

/**
 * Get Kanban view group of applications for a job.
 * @param {string} jobId 
 */
export async function getJobKanban(jobId) {
  const { data } = await apiClient.get(`/v1/applications/job/${jobId}/kanban`);
  return data;
}

/**
 * Trigger/retry the AI screening process for an application.
 * @param {string} applicationId 
 */
export async function retryScreening(applicationId) {
  const { data } = await apiClient.post(`/v1/applications/retry-screening/${applicationId}`);
  return data;
}

/**
 * Add a note / review rating to an application.
 * @param {string} applicationId 
 * @param {object} payload - { content: string, ratingScore: number }
 */
export async function addApplicationNote(applicationId, payload) {
  const { data } = await apiClient.post(`/v1/applications/${applicationId}/notes`, payload);
  return data;
}

/**
 * Update a note / review rating on an application.
 */
export async function updateApplicationNote(applicationId, noteId, payload) {
  const { data } = await apiClient.put(`/v1/applications/${applicationId}/notes/${noteId}`, payload);
  return data;
}

/**
 * Delete a note from an application.
 */
export async function deleteApplicationNote(applicationId, noteId) {
  const { data } = await apiClient.delete(`/v1/applications/${applicationId}/notes/${noteId}`);
  return data;
}

/**
 * Backward-compatible service object grouping all functions.
 */
export const applicationService = {
  getAll: async (filters = {}) => {
    const { data } = await apiClient.get("/v1/applications", { params: filters });
    return data.data;
  },
  applyToJob,
  getCandidateApplications,
  getMyApplications: getCandidateApplications,
  getApplicationDetails,
  updateApplicationStage,
  getApplicationsByJob,
  getJobKanban,
  retryScreening,
  addApplicationNote,
  updateApplicationNote,
  deleteApplicationNote,
  quickApply,
  quickApplyToJob: quickApply,
};

export { getCandidateApplications as getMyApplications };
export { quickApply as quickApplyToJob };