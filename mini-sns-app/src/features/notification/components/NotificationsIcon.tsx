// src/features/notification/components/NotificationsIcon.tsx
import React from "react";
import { useNotifications } from "../hooks/useNotifications";
import { Link } from "react-router-dom";

const NotificationsIcon: React.FC<{ className?: string }> = ({ className }) => {
  const { items, loading } = useNotifications();
  const unread = items.filter((i) => !i.read).length;

  return (
    <Link to="/notifications" className={`relative ${className ?? ""}`}>
      <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
        🔔
      </button>
      {!loading && unread > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {unread > 99 ? "99+" : unread}
        </span>
      )}
    </Link>
  );
};

export default NotificationsIcon;
