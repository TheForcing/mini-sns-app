// src/features/notification/components/NotificationList.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../hooks/useNotifications";
import { auth } from "../../../firebase";

const NotificationList: React.FC = () => {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const { notifications, loading, markAsRead } = useNotifications(user?.uid);

  if (!user) return <div>로그인이 필요합니다.</div>;
  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-3">알림</h2>
      {notifications.length === 0 ? (
        <div className="text-gray-500">알림이 없습니다.</div>
      ) : (
        <ul className="space-y-2">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`p-3 rounded-md ${
                n.isRead ? "bg-gray-50" : "bg-blue-50"
              }`}
            >
              <button
                onClick={async () => {
                  if (!n.isRead) await markAsRead(user.uid, n.id);
                  // 타입에 따라 이동
                  if (n.postId) navigate(`/post/${n.postId}`);
                }}
                className="w-full text-left"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={n.actorPhoto || "https://i.pravatar.cc/40"}
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="text-sm font-medium">
                      {n.actorName || "누군가"}{" "}
                      {n.type === "like"
                        ? "이 좋아요를 눌렀습니다"
                        : n.type === "comment"
                        ? "이 댓글을 남겼습니다"
                        : n.text}
                    </div>
                    <div className="text-xs text-gray-500">
                      {n.createdAt?.toDate
                        ? n.createdAt.toDate().toLocaleString()
                        : ""}
                    </div>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationList;
