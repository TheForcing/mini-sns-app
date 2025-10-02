// src/features/notifications/NotificationsIcon.tsx
import { useState } from "react";
import { Link } from "react-router-dom";

const mockNotifications = [
  { id: 1, text: "홍길동님이 당신의 글에 좋아요를 눌렀습니다." },
  { id: 2, text: "김영희님이 댓글을 남겼습니다." },
];

const NotificationsIcon = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 hover:bg-gray-100 rounded-full"
      >
        🔔
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {mockNotifications.length}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg p-3">
          <h3 className="font-semibold mb-2">알림</h3>
          <ul className="space-y-2">
            {mockNotifications.map((n) => (
              <li key={n.id} className="text-sm text-gray-700">
                {n.text}
              </li>
            ))}
          </ul>
          <Link
            to="/notifications"
            className="block text-blue-600 text-sm mt-2 hover:underline"
          >
            모든 알림 보기
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationsIcon;
