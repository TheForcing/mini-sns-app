import { ReactNode, useState } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";

/**
 * Layout props
 * - children: Outlet 대신 직접 children 쓸 때 사용
 * - centerVertically: true(기본) => main 컨텐츠를 화면 중앙(수평+수직)으로 정렬
 *                      false => main을 상단 정렬 (Feed 처럼 스크롤 많은 페이지에 적합)
 */
interface LayoutProps {
  children?: ReactNode;
  centerVertically?: boolean;
}

const Layout = ({ children, centerVertically = true }: LayoutProps) => {
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header / Navbar */}
      <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* logo */}
          <Link
            to="/"
            className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text"
          >
            MySNS
          </Link>

          {/* desktop menu */}
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

            {/* 검색창: 넉넉한 여백 확보 */}
            <div className="flex-1 max-w-sm mx-4">
              <input
                type="text"
                placeholder="검색..."
                className="w-full border rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* 오른쪽 액션들 */}
            {user ? (
              <>
                <Link
                  to="/create"
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                >
                  ➕ 작성
                </Link>

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

          {/* mobile menu button */}
          <div className="md:hidden">
            <button
              className="text-gray-700 hover:text-blue-600 focus:outline-none text-2xl"
              onClick={() => setMenuOpen((v) => !v)}
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
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

      {/* Main: 중앙 정렬 또는 상단 정렬 선택 가능 */}
      <main
        className={
          "flex-1 flex justify-center items-start px-4 py-6 " +
          (centerVertically
            ? "items-center justify-center"
            : "items-start justify-center")
        }
      >
        <div className="w-full max-w-3xl mx-auto">
          <div className="bg-white shadow rounded-xl p-6 w-full">
            {/* children 이 전달되면 children 사용, 아니면 Outlet (라우팅 사용 시) */}
            {children ?? <Outlet />}
          </div>
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
