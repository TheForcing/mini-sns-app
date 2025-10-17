// src/features/notification/components/NotificationsIcon.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useNotifications } from "../hooks/useNotifications";
import { auth } from "../../../firebase";
import { FaBell } from "react-icons/fa";

const NotificationsIcon: React.FC = () => {
  const user = auth.currentUser;
  const { notifications } = useNotifications(user?.uid);

  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <Link to="/notifications" className="relative p-2">
      <FaBell />
      {unread > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {unread}
        </span>
      )}
    </Link>
  );
};

export default NotificationsIcon;
