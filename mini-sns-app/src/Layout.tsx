import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            MySNS
          </Link>
          <nav className="space-x-6">
            <Link to="/" className="hover:text-blue-600">
              홈
            </Link>
            <Link to="/profile" className="hover:text-blue-600">
              프로필
            </Link>
            <Link to="/search" className="hover:text-blue-600">
              검색
            </Link>
            <Link to="/admin" className="hover:text-blue-600">
              관리자
            </Link>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-8 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 py-4 mt-8">
        <div className="max-w-5xl mx-auto px-6 text-center text-gray-500">
          © {new Date().getFullYear()} MySNS. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
