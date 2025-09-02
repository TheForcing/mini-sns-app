import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../src/firebase";
import { signOut } from "firebase/auth";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 상단 네비게이션 */}
      <nav className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* 로고 */}
          <Link to="/" className="text-xl font-bold text-blue-500">
            MySNS
          </Link>

          {/* 메뉴 */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-500 font-medium"
            >
              홈
            </Link>
            <Link
              to="/write"
              className="text-gray-700 hover:text-blue-500 font-medium"
            >
              글쓰기
            </Link>
            <Link
              to="/profile/me"
              className="text-gray-700 hover:text-blue-500 font-medium"
            >
              프로필
            </Link>
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-red-500 font-medium"
            >
              로그아웃
            </button>
          </div>

          {/* 모바일 메뉴 버튼 */}
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-blue-500 focus:outline-none">
              ☰
            </button>
          </div>
        </div>
      </nav>

      {/* 메인 컨텐츠 */}
      <main className="max-w-3xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
};

export default Layout;
