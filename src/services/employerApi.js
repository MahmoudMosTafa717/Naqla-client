import apiClient from "../config/axios.js";

export async function onboardOwnerCompany(payload) {
  const { data } = await apiClient.post("/auth/employer/onboard-company", payload);
  return data;
}
