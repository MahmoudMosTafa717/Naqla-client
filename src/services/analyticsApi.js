import apiClient from "../config/axios.js";

export async function getHiringFunnel(companyId) {
  const params = companyId ? { companyId } : {};
  const { data } = await apiClient.get("/analytics/funnel", { params });
  return data;
}

export async function getApplicationsOverTime(companyId, days = 30) {
  const params = { days, ...(companyId ? { companyId } : {}) };
  const { data } = await apiClient.get("/analytics/applications-over-time", {
    params,
  });
  return data;
}

export async function getAIScoreDistribution(companyId) {
  const params = companyId ? { companyId } : {};
  const { data } = await apiClient.get("/analytics/ai-scores", { params });
  return data;
}

export async function getTopJobs(companyId, limit = 5) {
  const params = { limit, ...(companyId ? { companyId } : {}) };
  const { data } = await apiClient.get("/analytics/top-jobs", { params });
  return data;
}

export async function getUserGrowth(days = 30) {
  const { data } = await apiClient.get("/analytics/user-growth", {
    params: { days },
  });
  return data;
}
