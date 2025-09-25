import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "./firebase";
import { Navbar } from "./components/ui"; // index export

const Layout: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // ✅ 로그인 상태 감지
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  // ✅ 로그아웃
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("logout error", err);
    }
  };

  // ✅ 네비게이션 링크
  const links = [
    { to: "/", label: "홈" },
    { to: "/feed", label: "피드" },
    { to: "/create", label: "글쓰기" },
    { to: "/notifications", label: "알림" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* 🔵 상단 네비게이션 */}
      <Navbar
        links={links}
        logo={
          <span className="text-2xl font-extrabold text-blue-600 hover:text-blue-700 transition">
            MySNS
          </span>
        }
        user={
          user
            ? {
                displayName: user.displayName ?? "사용자",
                photoURL: user.photoURL ?? undefined,
              }
            : null
        }
        onLogout={handleLogout}
        onSearch={(q) => {
          if (q && q.trim()) {
            navigate(`/search?q=${encodeURIComponent(q.trim())}`);
          }
        }}
      />

      {/* 🟢 중앙 정렬 메인 컨텐츠 */}
      <main className="flex-1 flex justify-center px-4 py-6">
        <div className="w-full max-w-2xl space-y-6">
          <Outlet />
        </div>
      </main>

      {/* ⚪️ 푸터 */}
      <footer className="bg-white border-t border-gray-200 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} MySNS — All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
