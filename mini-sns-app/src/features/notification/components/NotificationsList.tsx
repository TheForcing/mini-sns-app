// src/features/notification/components/NotificationsList.tsx
import React from "react";
import { useNotifications } from "../hooks/useNotifications";
import {
  markAllNotificationsRead,
  removeNotification,
} from "../services/notificationService";
import { auth } from "../../../firebase";
import { format } from "date-fns";

const NotificationsList: React.FC = () => {
  const { items, loading, markRead } = useNotifications();
  const uid = auth.currentUser?.uid;

  if (loading) return <div className="p-4">알림 로딩중...</div>;
  if (!uid) return <div className="p-4">로그인이 필요합니다.</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">알림</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => markAllNotificationsRead(uid)}
            className="text-sm px-3 py-1 bg-gray-100 rounded"
          >
            모두 읽음
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-gray-500">새로운 알림이 없습니다.</div>
      ) : (
        <ul className="space-y-2">
          {items.map((it) => (
            <li
              key={it.id}
              className={`p-3 rounded border ${
                it.read ? "bg-gray-50" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-gray-800">{it.message}</div>
                  {it.data && (
                    <div className="text-xs text-gray-400 mt-1">
                      {/* 예: postId, fromUid 등을 필요에 따라 링크 처리 */}
                      {Object.entries(it.data).map(([k, v]) => (
                        <span key={k} className="mr-2">
                          {k}: {String(v)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <div className="text-xs text-gray-400">
                    {it.createdAt?.toDate
                      ? format(it.createdAt.toDate(), "yyyy-MM-dd HH:mm")
                      : ""}
                  </div>
                  <div className="flex gap-2">
                    {!it.read && (
                      <button
                        onClick={() => it.id && markRead(it.id)}
                        className="text-xs text-blue-600"
                      >
                        읽음
                      </button>
                    )}
                    <button
                      onClick={() => it.id && removeNotification(uid, it.id)}
                      className="text-xs text-red-500"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsList;
