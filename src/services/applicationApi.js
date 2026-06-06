import apiClient from "../config/axios.js";
import { mockApplications } from "../mocks/applications.mock.js";

/**
 * Application service layer.
 * Utilizes the backend API `/v1/applications/apply` to submit applications.
 * Uses mock data for listing candidate applications since a GET endpoint is not yet implemented.
 */

export async function applyToJob(payload) {
  // Payload is FormData, so we need to override the default application/json header
  const { data } = await apiClient.post("/v1/applications/apply", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

export async function quickApplyToJob(jobId) {
  const { data } = await apiClient.post("/v1/applications/quick-apply", { jobId });
  return data;
}

const mapStageToStatus = (stageKey) => {
  const map = {
    applied: "Applied",
    shortlisted: "In Review",
    interview: "Interview Scheduled",
    offer: "Offer Received",
    hired: "Offer Received",
    rejected: "Rejected"
  };
  return map[stageKey] || "Applied";
};

export async function getMyApplications() {
  const { data } = await apiClient.get("/v1/applications/my-applications");
  if (data && data.success && data.data) {
    // Map the incoming raw Mongoose documents to the format the frontend UI expects
    return data.data.map(app => {
      const status = mapStageToStatus(app.stage?.key);
      return {
        id: app._id,
        _id: app._id,
        jobId: app.jobId?._id || app.jobId,
        role: app.jobId?.title || "Unknown Role",
        company: app.companyId?.name || "Unknown Company",
        location: app.jobId?.location || "",
        appliedDate: app.createdAt,
        status,
        aiScore: app.aiScreening?.overallScore ?? null,
        logo: app.companyId?.logo || "💼",
      };
    });
  }
  return [];
}
