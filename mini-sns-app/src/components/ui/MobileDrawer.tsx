import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTimes,
  FaHome,
  FaUser,
  FaEnvelope,
  FaBell,
  FaCog,
  FaMoon,
  FaSun,
} from "react-icons/fa";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  user?: { displayName?: string; photoURL?: string } | null;
  onLogout: () => void;
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  toggleDarkMode,
  user,
  onLogout,
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
    <>
      {/* 반투명 배경 */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
        ></div>
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            메뉴
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        {/* 사용자 정보 */}
        <div className="p-4 flex items-center gap-3 border-b border-gray-200 dark:border-gray-700">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="프로필"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300">
              {user?.displayName?.charAt(0) ?? "U"}
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-100">
              {user?.displayName ?? "사용자"}
            </p>
            <Link
              to="/profile/edit"
              onClick={onClose}
              className="text-xs text-blue-500 hover:underline"
            >
              프로필 편집
            </Link>
          </div>
        </div>

        {/* 메뉴 */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={onClose}
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

        <hr className="my-3 border-gray-200 dark:border-gray-800" />

        {/* 다크모드 + 로그아웃 */}
        <div className="px-3">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <span>다크 모드</span>
            {isDarkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}
          </button>

          {user && (
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="mt-2 w-full text-left px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40 transition"
            >
              로그아웃
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileDrawer;
