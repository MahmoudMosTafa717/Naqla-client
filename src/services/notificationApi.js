import apiClient from "../config/axios.js";

// Note: The server uses /api/v1/notifications
const BASE_PATH = "/v1/notifications";

export async function getNotifications() {
  const { data } = await apiClient.get(BASE_PATH);
  return data;
}

export async function markAsRead(id) {
  const { data } = await apiClient.patch(`${BASE_PATH}/${id}/read`);
  return data;
}

export async function markAllAsRead() {
  const { data } = await apiClient.patch(`${BASE_PATH}/read-all`);
  return data;
}

export async function deleteNotification(id) {
  const { data } = await apiClient.delete(`${BASE_PATH}/${id}`);
  return data;
}
