import { ReactNode, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
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
    </div>
  );
};

export default Layout;
