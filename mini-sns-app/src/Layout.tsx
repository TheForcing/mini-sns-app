// src/Layout.tsx
import { ReactNode, useState } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";

interface LayoutProps {
  children?: ReactNode; // Outlet fallback 지원
}

const Layout = ({ children }: LayoutProps) => {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 상단 네비게이션 */}
      <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* 로고 */}
          <Link
            to="/"
            className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text"
          >
            MySNS
          </Link>

          {/* 데스크탑 메뉴 */}
          <div className="hidden md:flex items-center gap-10">
            <Link
              to="/"
              className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
            >
              홈
            </Link>
            <Link
              to="/feed"
              className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
            >
              피드
            </Link>
            <Link
              to="/create"
              className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
            >
              글쓰기
            </Link>
            <Link
              to="/profile"
              className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
            >
              프로필
            </Link>

            {/* 검색창 */}
            <div className="flex-1 max-w-sm mx-2">
              <input
                type="text"
                placeholder="검색..."
                className="w-full border rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {user ? (
              <>
                {/* 작성 버튼 */}
                <Link
                  to="/create"
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                >
                  ➕ 작성
                </Link>
                {/* 알림 */}
                <Link
                  to="/notifications"
                  className="relative p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <span className="material-icons text-gray-600">
                    notifications
                  </span>
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                    3
                  </span>
                </Link>
                {/* 프로필 아바타 */}
                <Link
                  to="/profile"
                  className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 font-bold text-sm">
                      {user.displayName?.[0] || "?"}
                    </span>
                  )}
                </Link>
                {/* 로그아웃 */}
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-medium hover:opacity-90 transition"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                >
                  로그인
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 rounded-lg bg-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-300 transition"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <div className="md:hidden">
            <button
              className="text-gray-700 hover:text-blue-600 focus:outline-none text-2xl"
              onClick={() => setMenuOpen((v) => !v)}
            >
              ☰
            </button>
          </div>
        </div>
      </nav>

      {/* 모바일 드로어 메뉴 */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-200">
          <div className="flex flex-col space-y-4 px-6 py-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setMenuOpen(false)}
            >
              홈
            </Link>
            <Link
              to="/feed"
              className="text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setMenuOpen(false)}
            >
              피드
            </Link>
            <Link
              to="/create"
              className="text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setMenuOpen(false)}
            >
              글쓰기
            </Link>
            <Link
              to="/profile"
              className="text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setMenuOpen(false)}
            >
              프로필
            </Link>
            <Link
              to="/notifications"
              className="text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setMenuOpen(false)}
            >
              알림
            </Link>
            <Link
              to="/search"
              className="text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setMenuOpen(false)}
            >
              검색
            </Link>

            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium hover:opacity-90 transition"
              >
                로그아웃
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  로그인
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* 메인 컨텐츠: children 있으면 children, 없으면 Outlet */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white shadow rounded-xl p-6">
          {children ?? <Outlet />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-200 py-3 mt-8 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} MySNS. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
