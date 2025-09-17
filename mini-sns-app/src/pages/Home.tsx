import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import PostLists from "../features/post/components/PostLists";
import CreatePost from "../features/post/components/CreatePost";
import Card from "../components/ui/Card";

const Home: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUserEmail(user?.email ?? null);
    });
    return () => unsub();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      alert("로그아웃되었습니다.");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
      <div className="w-full max-w-3xl space-y-8">
        <Card className="p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-blue-600 flex items-center gap-2">
              <span>🔥</span> MySNS 홈
            </h1>
            <p className="text-sm text-gray-500 mt-1">최신 게시물을 확인해보세요.</p>
          </div>

          <div className="flex items-center gap-4">
            {userEmail ? (
              <>
                <div className="text-sm text-gray-700 truncate max-w-[180px]">{userEmail}</div>
                <button onClick={logout} className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white">
                  로그아웃
                </button>
              </>
            ) : (
              <div className="text-sm text-gray-500">로그인이 필요합니다.</div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">✍️ 글 작성하기</h2>
          <CreatePost />
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">📝 최신 게시글</h2>
          <PostLists />
        </Card>
      </div>
    </div>
  );
};

export default Home;
