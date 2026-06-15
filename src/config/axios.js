import axios from "axios";
import { API_BASE_URL } from "./api.config.js";
import { useAuthStore } from "../store/authStore.js";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,

  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      const authStore = useAuthStore.getState();

      if (authStore.isAuthenticated) {
        try {
          const refreshed = await authStore.refreshToken({ silent: true });
          if (refreshed?.accessToken) {
            originalRequest.headers.Authorization = `Bearer ${refreshed.accessToken}`;
            return apiClient(originalRequest);
          } else {
            await authStore.logout();
          }
        } catch (refreshError) {
          await authStore.logout();
        }
      }
    }

    const serverMessage = error.response?.data?.message;
    if (serverMessage) {
      const customError = new Error(serverMessage);
      customError.status = error.response.status;
      customError.response = error.response;
      return Promise.reject(customError);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
