// src/components/ui/Navbar.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaBell, FaSun, FaMoon, FaTimes } from "react-icons/fa";

interface NavbarProps {
  links: { to: string; label: string }[];
  logo: React.ReactNode;
  user: { displayName?: string; photoURL?: string } | null;
  onLogout: () => void;
  onSearch: (q: string) => void;
  isDarkMode?: boolean;
  toggleDarkMode?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  links,
  logo,
  user,
  onLogout,
  onSearch,
  isDarkMode,
  toggleDarkMode,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = (e.currentTarget.querySelector("input") as HTMLInputElement)
      ?.value;
    if (input) onSearch(input);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center space-x-3">
              <Link
                to="/"
                className="text-blue-600 dark:text-blue-400 font-bold text-2xl"
              >
                {logo}
              </Link>
            </div>

            <div className="hidden md:flex flex-1 justify-center px-4">
              <form
                onSubmit={handleSearch}
                className="w-full max-w-md flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1"
              >
                <input
                  type="text"
                  placeholder="검색..."
                  className="flex-1 bg-transparent outline-none px-2 text-sm text-gray-700 dark:text-gray-200"
                />
                <button
                  type="submit"
                  className="text-gray-500 hover:text-blue-500"
                >
                  🔍
                </button>
              </form>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleDarkMode?.()}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {isDarkMode ? (
                  <FaSun className="text-yellow-400" />
                ) : (
                  <FaMoon className="text-gray-600 dark:text-gray-300" />
                )}
              </button>

              <Link
                to="/notifications"
                className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <FaBell className="text-gray-600 dark:text-gray-300" />
                {/* 배지: 실제 unread 수 연결 권장 */}
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </span>
              </Link>

              <div className="hidden md:flex items-center space-x-2">
                {user ? (
                  <>
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="profile"
                        className="w-8 h-8 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                        {user.displayName?.charAt(0) ?? "U"}
                      </div>
                    )}
                    <span className="text-sm text-gray-700 dark:text-gray-200">
                      {user.displayName ?? "사용자"}
                    </span>
                    <button
                      onClick={onLogout}
                      className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-sm"
                    >
                      로그아웃
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      로그인
                    </Link>
                    <Link
                      to="/register"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      회원가입
                    </Link>
                  </>
                )}
              </div>

              <button
                className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setMenuOpen(true)}
              >
                <FaBars className="text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 모바일 드로어 */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 z-50 w-64 h-full bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <div className="text-lg font-semibold">메뉴</div>
              <button
                onClick={() => setMenuOpen(false)}
                className="text-gray-600 dark:text-gray-300"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMenuOpen(false)}
                  className="block text-gray-700 dark:text-gray-200 hover:text-blue-500"
                >
                  {l.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  toggleDarkMode?.();
                  setMenuOpen(false);
                }}
                className="w-full text-left py-2 rounded-md bg-gray-100 dark:bg-gray-800"
              >
                다크모드 토글
              </button>
              {user ? (
                <button
                  onClick={() => {
                    onLogout();
                    setMenuOpen(false);
                  }}
                  className="w-full bg-red-500 text-white py-2 rounded-md"
                >
                  로그아웃
                </button>
              ) : null}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
