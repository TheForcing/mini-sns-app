import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import Feed from "./pages/Feed";
import PostPages from "./pages/PostPages";
import ProfilePage from "./pages/ProfilePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MessagePage from "./pages/MessagePage";
import NotificationsList from "./features/notification/components/NotificationsList";
import AdminDashboard from "./features/admin/components/AdminDashBoard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./features/admin/components/AdminRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout 안에 렌더되는 공통 페이지들 */}
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/post/:postId" element={<PostPages />} />
          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <MessagePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Route>

        {/* Layout 없이 노출되는 페이지들 */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 그 외 리다이렉트 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
