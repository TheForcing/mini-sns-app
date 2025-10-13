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

  const [isDarkMode, setIsDarkMode] = useState(false);

  function toggleDarkMode(): void {
    setIsDarkMode((prev) => !prev);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
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
      <NotificationsIcon />
      <LeftSideBar
        user={{
          displayName: "사용자",
          photoURL: "https://i.pravatar.cc/40?img=10",
        }}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />
      <main className="flex-1 flex justify-center px-4 py-6">
        <div className="w-full max-w-3xl">
          <Outlet />
        </div>
      </main>
      <RightSideBar />
      <footer className="bg-gray-200 py-3 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} MySNS. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
