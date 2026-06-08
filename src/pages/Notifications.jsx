import React, { useEffect } from "react";
import { useNotificationStore } from "../store/notificationStore";
import { Bell, Trash2, CheckCircle, Clock, Info, AlertTriangle, CheckCheck, Briefcase, Calendar, UserCheck, Settings, ClipboardList } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const NotificationsPage = () => {
  const { notifications, isLoading, fetchNotifications, markRead, markAllRead, removeNotification } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const getIcon = (type) => {
    switch (type) {
      case "application":
        return <ClipboardList className="w-5 h-5 text-indigo-500" />;
      case "job":
        return <Briefcase className="w-5 h-5 text-blue-500" />;
      case "interview":
        return <Calendar className="w-5 h-5 text-teal-500" />;
      case "system":
        return <Settings className="w-5 h-5 text-gray-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Notifications</h1>
          <p className="text-gray-500 mt-1">Manage and stay updated with your activities</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => markAllRead()}
            disabled={notifications.length === 0 || notifications.every(n => n.read)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-(--color-brand-blue) disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
          <button
            onClick={() => fetchNotifications()}
            className="px-4 py-2 bg-white border border-(--color-border) rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-xs"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {isLoading && (
          <div className="bg-white rounded-2xl border border-(--color-border) p-12 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-(--color-brand-blue)"></div>
            <p className="text-gray-500 mt-4 font-medium italic">Syncing notifications...</p>
          </div>
        )}

        {!isLoading && notifications.length === 0 && (
          <div className="bg-white rounded-2xl border border-(--color-border) p-12 text-center bg-slate-50/50 flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 ring-8 ring-slate-100">
              <Bell className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">All caught up!</h3>
            <p className="text-gray-500 mt-2 max-w-xs mx-auto">You don't have any notifications right now. Check back later!</p>
          </div>
        )}

        {!isLoading && notifications.map((notification) => (
          <div
            key={notification._id}
            className={`group relative p-5 transition-all duration-300 flex gap-4 rounded-2xl border border-(--color-border) shadow-sm bg-white ${
              !notification.read 
                ? "bg-blue-50/40 border-l-4 border-l-blue-500 pl-4" 
                : "hover:shadow-md border-l-4 border-l-transparent"
            }`}
          >
            {/* Unread Indicator Dot */}
            {!notification.read && (
              <div className="absolute left-[-2px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
            )}

            <div className={`shrink-0 mt-1 p-2 rounded-xl border border-transparent transition-all h-fit ${
              !notification.read ? "bg-white shadow-sm border-(--color-border)" : "bg-gray-100"
            }`}>
              {getIcon(notification.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="cursor-pointer" onClick={() => !notification.read && markRead(notification._id)}>
                  <h4 className={`text-base tracking-tight transition-colors ${
                    !notification.read 
                      ? "font-bold text-gray-900" 
                      : "font-semibold text-gray-600"
                  }`}>
                    {notification.title}
                  </h4>
                  <p className={`text-sm mt-1 leading-relaxed ${
                    !notification.read ? "text-gray-700 font-medium" : "text-gray-500"
                  }`}>
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </span>
                    {!notification.read && (
                      <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                        New
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                  {!notification.read && (
                    <button
                      onClick={() => markRead(notification._id)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-xl border border-transparent hover:border-blue-100 hover:shadow-sm transition-all"
                      title="Mark as read"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => removeNotification(notification._id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-xl border border-transparent hover:border-red-100 hover:shadow-sm transition-all"
                    title="Delete notification"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
