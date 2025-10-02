// src/features/notifications/NotificationsPage.tsx
import React from "react";

const NotificationsPage = () => {
  const mock = [
    "홍길동님이 당신의 게시물에 댓글을 남겼습니다.",
    "김영희님이 사진을 좋아합니다.",
    "박철수님이 당신을 팔로우하기 시작했습니다.",
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-bold mb-3">알림</h2>
      <ul className="space-y-3">
        {mock.map((n, idx) => (
          <li key={idx} className="text-sm text-gray-700 border-b pb-2">
            {n}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsPage;
