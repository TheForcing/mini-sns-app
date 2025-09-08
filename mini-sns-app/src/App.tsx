// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/profile/[id]";
import UserProfile from "./pages/UserProfile";
import NotificationList from "./features/notification/compoenents/NotificationList";
import FollowList from "./features/follow/components/FollowList";
import SearchBar from "./components/SearchBar";
import Layout from "./Layout";
import PostPage from "./pages/PostPages";
import Feed from "./pages/Feed";
import { useEffect } from "react";
import { seedData } from "./utils/seedData";
import { Toaster } from "react-hot-toast";

function App() {
  useEffect(() => {
    seedData(); // 더미 데이터 삽입
  }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-center" />

      <Routes>
        {/* Layout 적용되는 페이지들 */}
        <Route element={<Layout children={undefined} />}>
          <Route path="/" element={<Home />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/profile/:id/followers"
            element={<FollowList type="followers" userId="" />}
          />
          <Route path="/user/:uid" element={<UserProfile />} />
          <Route path="/notifications" element={<NotificationList />} />
          <Route path="/search" element={<SearchBar />} />
          <Route path="/post/:postId" element={<PostPage />} />
        </Route>

        {/* Layout 없이 보여줄 페이지들 */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
