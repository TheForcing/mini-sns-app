import PostForm from "../features/post/components/PostForm";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const CreatePostPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login"); // 로그인 안 하면 접근 불가
    }
  }, [user, loading, router]);

  if (loading) return <p>로딩중...</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h1 className="text-xl font-bold text-center mb-4">게시글 작성</h1>
        <PostForm />
      </div>
    </div>
  );
};

export default CreatePostPage;
