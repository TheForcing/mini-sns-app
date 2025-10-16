// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/profile/[id]";
import UserProfile from "./pages/ProfilePage";
import NotificationPage from "./features/notification/compoenents/NotificationsPage";
import FollowList from "./features/follow/components/FollowList";
import SearchBar from "./components/ui/SearchBar";
import Layout from "./Layout";
import PostPage from "./pages/PostPages";
import Feed from "./pages/Feed";
import CreatePost from "./pages/CreatePostWithUpload"; // ✅ 글쓰기 페이지
import { useEffect } from "react";
import { seedData } from "./utils/seedData";
import { Toaster } from "react-hot-toast";
import AdminDashBoard from "../src/features/admin/components/AdminDashBoard";

function App() {
  useEffect(() => {
    seedData(); // 더미 데이터 삽입
  }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-center" />

      <Routes>
        {/* Layout 안에서 공통 UI 적용 */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/create" element={<CreatePost />} />{" "}
          {/* ✅ 글쓰기 라우트 */}
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/profile/:id/followers"
            element={<FollowList type="followers" userId="" />}
          />
          <Route path="/user/:uid" element={<UserProfile />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/search" element={<SearchBar />} />
          <Route path="/post/:postId" element={<PostPage />} />
        </Route>

        {/* Layout 없이 보여줄 페이지 */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashBoard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
