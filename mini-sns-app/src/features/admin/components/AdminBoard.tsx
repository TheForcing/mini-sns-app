import React, { useState } from "react";
import AdminUsers from "../../admin/hooks/AdminUsers";
import AdminPosts from "../../admin/hooks/AdminPosts";
import AdminReports from "../../admin/hooks/AdminReports";

const AdminDashboard: React.FC = () => {
  const [tab, setTab] = useState<"users" | "posts" | "reports">("reports");

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <h1 className="text-xl font-bold">관리자 대시보드</h1>
        <p className="text-sm text-gray-500">
          사용자/게시글/신고 관리를 수행합니다.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-4 mb-6">
        <nav className="flex gap-3 mb-4">
          <button
            className={`px-4 py-2 rounded ${
              tab === "reports" ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
            onClick={() => setTab("reports")}
          >
            신고 목록
          </button>
          <button
            className={`px-4 py-2 rounded ${
              tab === "posts" ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
            onClick={() => setTab("posts")}
          >
            게시글 관리
          </button>
          <button
            className={`px-4 py-2 rounded ${
              tab === "users" ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
            onClick={() => setTab("users")}
          >
            유저 관리
          </button>
        </nav>

        <div>
          {tab === "reports" && <AdminReports />}
          {tab === "posts" && <AdminPosts />}
          {tab === "users" && <AdminUsers />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
