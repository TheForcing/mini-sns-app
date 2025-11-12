import React, { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";

/**
 * 사용법:
 * <Route path="/profile" element={<ProtectedRoute><ProfilePage/></ProtectedRoute>} />
 */
const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-6 text-center">로딩 중...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
