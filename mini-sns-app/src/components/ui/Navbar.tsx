import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaBell, FaSun, FaMoon } from "react-icons/fa";

interface NavbarProps {
  links: { to: string; label: string }[];
  logo: React.ReactNode;
  user: { displayName?: string; photoURL?: string } | null;
  onLogout: () => void;
  onSearch: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  links,
  logo,
  user,
  onLogout,
  onSearch,
}) => {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.querySelector("input") as HTMLInputElement;
    if (input?.value) onSearch(input.value);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* 🔵 Left: Logo */}
          <div className="flex items-center space-x-3">
            <Link
              to="/"
              className="text-blue-600 dark:text-blue-400 font-bold text-2xl hover:opacity-90"
            >
              {logo}
            </Link>
          </div>

          {/* 🟢 Center: Search (Desktop Only) */}
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

          {/* 🔴 Right: User & Icons */}
          <div className="flex items-center gap-3">
            {/* 다크모드 토글 */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {darkMode ? (
                <FaSun className="text-yellow-400" />
              ) : (
                <FaMoon className="text-gray-600 dark:text-gray-300" />
              )}
            </button>

            {/* 알림 */}
            <Link
              to="/notifications"
              className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <FaBell className="text-gray-600 dark:text-gray-300" />
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </Link>

            {/* 사용자 */}
            {user ? (
              <div className="hidden md:flex items-center space-x-2">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="프로필"
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                    {user.displayName?.charAt(0) ?? "U"}
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user.displayName ?? "사용자"}
                </span>
                <button
                  onClick={onLogout}
                  className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full text-sm transition"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
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
              </div>
            )}

            {/* 햄버거 메뉴 (모바일 전용) */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <FaBars className="text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>

      {/* 📱 모바일 메뉴 */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-3 space-y-3">
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1"
          >
            <input
              type="text"
              placeholder="검색..."
              className="flex-1 bg-transparent outline-none px-2 text-sm text-gray-700 dark:text-gray-200"
            />
            <button type="submit" className="text-gray-500 hover:text-blue-500">
              🔍
            </button>
          </form>

          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="block text-gray-700 dark:text-gray-200 hover:text-blue-500"
            >
              {l.label}
            </Link>
          ))}

          {user ? (
            <button
              onClick={onLogout}
              className="w-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 rounded-full text-sm"
            >
              로그아웃
            </button>
          ) : (
            <div className="flex flex-col space-y-2">
              <Link
                to="/login"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                로그인
              </Link>
              <Link
                to="/register"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                회원가입
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
