// src/pages/register.tsx
import Register from "../features/auth/components/Register";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const RegisterPage = () => {
  const { user, loading } = useAuth();
  const router = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      router("/"); // 회원가입 성공 시 메인으로 이동
    }
  }, [user, loading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">회원가입</h1>
        <Register />
        <p className="text-center text-sm text-gray-500 mt-4">
          이미 계정이 있으신가요?{" "}
          <span
            onClick={() => router("/login")}
            className="text-blue-500 cursor-pointer"
          >
            로그인
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
