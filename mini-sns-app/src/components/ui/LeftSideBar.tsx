import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaEnvelope,
  FaBell,
  FaCog,
  FaMoon,
  FaSun,
} from "react-icons/fa";

interface LeftSidebarProps {
  user?: { displayName?: string; photoURL?: string } | null;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const LeftSideBar: React.FC<LeftSidebarProps> = ({
  user,
  isDarkMode,
  toggleDarkMode,
}) => {
  const location = useLocation();

  const menuItems = [
    { to: "/", icon: <FaHome />, label: "홈" },
    { to: "/profile", icon: <FaUser />, label: "내 프로필" },
    { to: "/messages", icon: <FaEnvelope />, label: "메시지" },
    { to: "/notifications", icon: <FaBell />, label: "알림" },
    { to: "/settings", icon: <FaCog />, label: "설정" },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 sticky top-14 h-[calc(100vh-56px)] overflow-y-auto">
      {/* 🔵 사용자 정보 */}
      <div className="flex items-center gap-3 mb-6">
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt="프로필"
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 dark:bg-gray-700 dark:text-gray-300">
            {user?.displayName?.charAt(0) ?? "U"}
          </div>
        )}
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {user?.displayName ?? "사용자"}
          </h3>
          <Link
            to="/profile/edit"
            className="text-xs text-blue-500 hover:underline"
          >
            프로필 편집
          </Link>
        </div>
      </div>

      {/* 🧭 메뉴 */}
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition ${
              location.pathname === item.to
                ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      <hr className="my-5 border-gray-200 dark:border-gray-800" />

      {/* 🌙 다크모드 토글 */}
      <button
        onClick={toggleDarkMode}
        className="flex items-center justify-between px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        <span>다크 모드</span>
        {isDarkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}
      </button>
    </aside>
  );
};

export default LeftSideBar;
