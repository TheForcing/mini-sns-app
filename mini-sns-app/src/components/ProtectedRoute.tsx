// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface Props {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: Props) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-4">로딩 중...</div>;
  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
