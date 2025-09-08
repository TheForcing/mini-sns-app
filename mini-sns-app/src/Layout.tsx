import { ReactNode, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

interface LayoutProps {
  children: ReactNode;
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

          {/* 메뉴 (데스크탑) */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link
              to="/"
              className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
            >
              홈
            </Link>
            <Link
              to="/write"
              className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
            >
              글쓰기
            </Link>
            <Link
              to="/profile/me"
              className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
            >
              프로필
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium hover:opacity-90 transition"
            >
              로그아웃
            </button>
            {/* Middle: 검색창 */}
            <div className="hidden sm:flex flex-1 max-w-md mx-6">
              <input type="text" placeholder="검색..." className="input" />
            </div>
            <nav className="flex gap-4 items-center">
              <Link
                to="/"
                className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                피드
              </Link>

              {user ? (
                <>
                  {/* 작성 버튼 */}
                  <Link
                    to="/post/new"
                    className="btn btn-primary px-3 py-1 text-sm"
                  >
                    ➕ 작성
                  </Link>

                  {/* 알림 버튼 */}
                  <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    <span className="material-icons text-gray-600 dark:text-gray-200">
                      notifications
                    </span>
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                      3
                    </span>
                  </button>

                  {/* 프로필 */}
                  <Link
                    to="/profile"
                    className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden"
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
                    className="btn btn-secondary px-3 py-1 text-sm"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="btn btn-primary px-3 py-1 text-sm"
                  >
                    로그인
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-secondary px-3 py-1 text-sm"
                  >
                    회원가입
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* 모바일 메뉴 버튼 */}
          <div className="md:hidden">
            <button
              className="text-gray-700 hover:text-blue-600 focus:outline-none text-2xl"
              onClick={() => setMenuOpen(!menuOpen)}
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
              to="/write"
              className="text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setMenuOpen(false)}
            >
              글쓰기
            </Link>
            <Link
              to="/profile/me"
              className="text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setMenuOpen(false)}
            >
              프로필
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium hover:opacity-90 transition"
            >
              로그아웃
            </button>
          </div>
        </div>
      )}

      {/* 메인 컨텐츠 */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white shadow rounded-xl p-6">{children}</div>
      </main>
      {/* Footer */}
      <footer className="bg-gray-200 dark:bg-gray-800 py-3 mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} MySNS. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
