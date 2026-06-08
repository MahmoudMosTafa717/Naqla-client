import { create } from "zustand";
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from "../services/notificationApi";

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getNotifications();
      if (data.success) {
        // Backend sends entity in 'data' field via sendResponse util
        const notifications = data.data || [];
        set({
          notifications: notifications,
          unreadCount: notifications.filter((n) => !n.read).length,
        });
      }
    } catch (err) {
      set({ error: err.message || "Failed to fetch notifications." });
    } finally {
      set({ isLoading: false });
    }
  },

  addNotification: (notification) => {
    set((state) => {
      // Check if notification already exists to avoid duplicates
      if (state.notifications.some(n => n._id === notification._id)) return state;
      
      const newNotifications = [notification, ...state.notifications];
      return {
        notifications: newNotifications,
        unreadCount: newNotifications.filter((n) => !n.read).length,
      };
    });
  },

  markRead: async (id) => {
    try {
      const data = await markAsRead(id);
      if (data.success) {
        set((state) => {
          const updatedNotifications = state.notifications.map((n) =>
            n._id === id ? { ...n, read: true } : n
          );
          return {
            notifications: updatedNotifications,
            unreadCount: updatedNotifications.filter((n) => !n.read).length,
          };
        });
      }
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  },

  markAllRead: async () => {
    try {
      const data = await markAllAsRead();
      if (data.success) {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        }));
      }
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  },

  removeNotification: async (id) => {
    try {
      const data = await deleteNotification(id);
      if (data.success) {
        set((state) => {
          const filteredNotifications = state.notifications.filter((n) => n._id !== id);
          return {
            notifications: filteredNotifications,
            unreadCount: filteredNotifications.filter((n) => !n.read).length,
          };
        });
      }
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  },

  clearNotifications: () => {
    set({ notifications: [], unreadCount: 0 });
  },
}));
