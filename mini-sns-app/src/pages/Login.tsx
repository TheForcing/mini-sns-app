// src/pages/login.tsx
import Login from "../features/auth/components/Login";
import { useAuth } from "../features/auth/hooks/useAuth";
// For Next.js 13+ app directory, use the following:
import { useRouter } from "next/navigation";

// If you are using the pages directory and want to fix the type error, install types:
import { useEffect } from "react";

const LoginPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/"); // 로그인 성공 시 메인으로 이동
    }
  }, [user, loading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">로그인</h1>
        <Login />
        <p className="text-center text-sm text-gray-500 mt-4">
          아직 계정이 없으신가요?{" "}
          <span
            onClick={() => router.push("/register")}
            className="text-blue-500 cursor-pointer"
          >
            회원가입
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
