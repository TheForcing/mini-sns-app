// src/Layout.tsx
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "./firebase";
import { Navbar } from "./components/ui";
import NotificationsIcon from "./features/notification/compoenents/NotificationsIcon";
import RightSideBar from "./components/ui/RightSideBar";
import LeftSideBar from "./components/ui/LeftSideBar";

const Layout: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("logout error", err);
    }
  };

  const links = [
    { to: "/", label: "홈" },
    { to: "/feed", label: "피드" },
    { to: "/create", label: "글쓰기" },
    { to: "/notifications", label: "알림" },
  ];

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* ✅ 상단 네비게이션 */}
      <Navbar
        links={links}
        logo={
          <span className="text-2xl font-extrabold text-blue-600">MySNS</span>
        }
        user={
          user
            ? {
                displayName: user.displayName ?? undefined,
                photoURL: user.photoURL ?? undefined,
              }
            : null
        }
        onLogout={handleLogout}
        onSearch={(q) => {
          if (q?.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
        }}
      />

      {/* ✅ 본문 영역 (3열 구조) */}
      <div className="flex flex-1 justify-center w-full">
        {/* 🔹 왼쪽 사이드바 */}
        <div className="hidden lg:flex w-[18rem] px-4">
          <LeftSideBar
            user={{
              displayName: user?.displayName ?? "사용자",
              photoURL: user?.photoURL ?? "https://i.pravatar.cc/40?img=10",
            }}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
          />
        </div>

        {/* 🔸 메인 컨텐츠 */}
        <main className="flex-1 w-full max-w-2xl px-4 py-6">
          <NotificationsIcon />
          <Outlet />
        </main>

        {/* 🔹 오른쪽 사이드바 */}
        <div className="hidden xl:flex w-[18rem] px-4">
          <RightSideBar />
        </div>
      </div>

      {/* ✅ 하단 푸터 */}
      <footer
        className={`py-3 text-center text-sm border-t ${
          isDarkMode
            ? "border-gray-700 text-gray-400"
            : "border-gray-200 text-gray-600"
        }`}
      >
        © {new Date().getFullYear()} MySNS. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
