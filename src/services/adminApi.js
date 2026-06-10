import apiClient from "../config/axios.js";

export async function getAdminStats() {
  const { data } = await apiClient.get("/admin/stats");
  return data;
}

export async function getAllUsers(params = {}) {
  const { data } = await apiClient.get("/admin/users", { params });
  return data;
}

export async function banUser(userId, reason) {
  const { data } = await apiClient.patch(`/admin/users/${userId}/ban`, {
    reason,
  });
  return data;
}

export async function unbanUser(userId) {
  const { data } = await apiClient.patch(`/admin/users/${userId}/unban`);
  return data;
}

export async function getPendingCompanies() {
  const { data } = await apiClient.get("/admin/companies/pending");
  return data;
}

export async function approveCompany(companyId) {
  const { data } = await apiClient.patch(
    `/admin/companies/${companyId}/approve`,
  );
  return data;
}

export async function rejectCompany(companyId, reason) {
  const { data } = await apiClient.patch(
    `/admin/companies/${companyId}/reject`,
    { reason },
  );
  return data;
}

export async function adminDeleteJob(jobId) {
  const { data } = await apiClient.delete(`/admin/jobs/${jobId}`);
  return data;
}
