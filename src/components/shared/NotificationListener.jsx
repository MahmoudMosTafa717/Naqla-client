import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import { useAuthStore } from "../../store/authStore";
import { useNotificationStore } from "../../store/notificationStore";
import { API_BASE_URL } from "../../config/api.config";

const SOCKET_URL = API_BASE_URL.replace("/api", "");

const NotificationListener = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { addNotification, fetchNotifications } = useNotificationStore();
  const socketRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Connect to socket
      socketRef.current = io(SOCKET_URL, {
        transports: ["websocket"],
      });

      // Join user room
      socketRef.current.emit("join", user._id);

      // Listen for notifications
      socketRef.current.on("notification", (notification) => {
        addNotification(notification);
        toast.info(notification.title || "New Notification", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });

      // Fetch initial notifications
      fetchNotifications();

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [isAuthenticated, user, addNotification, fetchNotifications]);

  return null;
};

export default NotificationListener;
