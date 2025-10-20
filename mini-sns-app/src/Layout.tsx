// src/Layout.tsx
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "./firebase";
import { Navbar } from "./components/ui";
import NotificationsIcon from "./features/notification/components/NotificationsIcon";
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

  // ✅ 다크모드 상태 복원
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // ✅ 다크모드 변경 시 <html> class 조정
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* ✅ Navbar */}
      <Navbar
        links={links}
        logo={
          <span className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
            MySNS
          </span>
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

      {/* ✅ 3단 레이아웃 */}
      <div className="flex flex-1 justify-center w-full">
        <div className="hidden lg:flex w-[18rem] px-4">
          <LeftSideBar
            user={{
              displayName: user?.displayName ?? "사용자",
              photoURL: user?.photoURL ?? "https://i.pravatar.cc/40?img=10",
            }}
            isDarkMode={isDarkMode}
            toggleDarkMode={() => setIsDarkMode((prev) => !prev)}
          />
        </div>

        <main className="flex-1 w-full max-w-2xl px-4 py-6">
          <NotificationsIcon />
          <Outlet />
        </main>

        <div className="hidden xl:flex w-[18rem] px-4">
          <RightSideBar />
        </div>
      </div>

      <footer className="py-3 text-center text-sm border-t border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} MySNS. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
