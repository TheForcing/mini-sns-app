import React from "react";
import { Link } from "react-router-dom";
import { FaUserPlus, FaBell, FaCommentDots } from "react-icons/fa";

const RightSideBar: React.FC = () => {
  const friendSuggestions = [
    { id: 1, name: "홍길동", photo: "https://i.pravatar.cc/40?img=1" },
    { id: 2, name: "김영희", photo: "https://i.pravatar.cc/40?img=2" },
    { id: 3, name: "박철수", photo: "https://i.pravatar.cc/40?img=3" },
  ];

  const notifications = [
    { id: 1, text: "민지가 회원님의 게시글에 댓글을 남겼습니다." },
    { id: 2, text: "철수가 새로운 사진을 업로드했습니다." },
    { id: 3, text: "회원님의 친구 요청이 수락되었습니다." },
  ];

  return (
    <aside className="hidden lg:block w-72 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 p-4 sticky top-14 h-[calc(100vh-56px)] overflow-y-auto">
      {/* 친구 제안 */}
      <section>
        <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">
          친구 제안
        </h2>
        <div className="space-y-3">
          {friendSuggestions.map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-2 hover:shadow transition"
            >
              <div className="flex items-center gap-2">
                <img
                  src={f.photo}
                  alt={f.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {f.name}
                </span>
              </div>
              <button className="text-blue-500 text-xs font-semibold hover:underline flex items-center gap-1">
                <FaUserPlus />
                추가
              </button>
            </div>
          ))}
        </div>
      </section>

      <hr className="my-5 border-gray-200 dark:border-gray-800" />

      {/* 알림 미리보기 */}
      <section>
        <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">
          최근 알림
        </h2>
        <ul className="space-y-2">
          {notifications.map((n) => (
            <li
              key={n.id}
              className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg cursor-pointer transition"
            >
              <FaBell className="text-blue-500 mt-0.5" />
              <span>{n.text}</span>
            </li>
          ))}
        </ul>
        <Link
          to="/notifications"
          className="block text-blue-500 text-sm mt-3 hover:underline"
        >
          모든 알림 보기
        </Link>
      </section>

      <hr className="my-5 border-gray-200 dark:border-gray-800" />

      {/* 메신저 단축 */}
      <section>
        <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">
          메신저
        </h2>
        <div className="flex flex-col gap-2">
          {friendSuggestions.map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-2 hover:shadow transition"
            >
              <div className="flex items-center gap-2">
                <img
                  src={f.photo}
                  alt={f.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm text-gray-700 dark:text-gray-200">
                  {f.name}
                </span>
              </div>
              <FaCommentDots className="text-gray-400 hover:text-blue-500 cursor-pointer" />
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
};

export default RightSideBar;
