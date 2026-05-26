import apiClient from "../config/axios.js";
import { AUTH_API_URL } from "../config/api.config.js";

/*
* Auth routes at /api/auth/*
* use AUTH_API_URL or apiClient with path /auth/... 
*/

export async function register(email, password, role = "candidate") {
  const { data } = await apiClient.post("/auth/register", {
    email,
    password,
    role,
  });
  return data;
}

export async function login(email, password) {
  const { data } = await apiClient.post("/auth/login", { email, password });
  return data;
}

export async function refreshAccessToken(refreshToken) {
  const { data } = await apiClient.post("/auth/refresh", { refreshToken });
  return data;
}

export async function getMe() {
  const { data } = await apiClient.get("/auth/me");
  return data;
}

export async function logout() {
  const { data } = await apiClient.post("/auth/logout");
  return data;
}

export async function forgotPassword(email) {
  const { data } = await apiClient.post("/auth/forgot-password", { email });
  return data;
}

export async function resetPassword(token, password) {
  const { data } = await apiClient.post("/auth/reset-password", {
    token,
    password,
  });
  return data;
}

export { AUTH_API_URL };
