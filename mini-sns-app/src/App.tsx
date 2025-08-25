// src/App.tsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import NotificationList from "./components/NotificationList";
import FollowList from "./components/FollowList";
import SearchBar from "./components/SearchBar";
import Layout from "./Layout";
import PostPage from "./pages/PostPages";
import Feed from "./pages/Feed";
import { useEffect } from "react";
import { seedData } from "./utils/seedData";

function App() {
  const handleLogout = async () => {
    await signOut(auth);
    alert("로그아웃되었습니다.");
  };
  useEffect(() => {
    seedData();
  }, []);

  return (
    <BrowserRouter>
      <header className="p-4 border-b mb-4">
        <nav className="max-w-3xl mx-auto flex gap-4">
          <Link to="/">Home</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <button
            onClick={handleLogout}
            className="ml-auto text-sm text-red-500"
            type="button"
          >
            Logout
          </button>
        </nav>
      </header>

      <main>
        <Routes>
          {/* Layout으로 감싸는 라우트 구조 개선 */}
          <Route element={<Layout>{/* children이 들어갈 위치 */}</Layout>}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/profile/:id/followers"
              element={<FollowList type="followers" userId={""} />}
            />
            <Route path="/user/:uid" element={<UserProfile />} />
            <Route path="/notifications" element={<NotificationList />} />
            <Route path="/search" element={<SearchBar />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/post/:postId" element={<PostPage />} />
          </Route>
          {/* 레이아웃 없이 보여줄 라우트 */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
