import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import PostLists from "../features/post/components/PostLists";
import CreatePost from "../features/post/components/CreatePost";

const Home = () => {
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
    <div className="space-y-8">
      {/* 상단 헤더 */}
      <header className="bg-white rounded-xl shadow p-6 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-600 flex items-center gap-2">
          <span role="img" aria-label="fire">
            🔥
          </span>
          MySNS 홈
        </h1>
        {userEmail ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm">
              <b>{userEmail}</b>
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium shadow hover:opacity-90 transition"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <span className="text-gray-500 text-sm">로그인 필요</span>
        )}
      </header>

      {/* 글쓰기 */}
      <section className="bg-white rounded-xl shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">✍️ 글 작성하기</h2>
        <CreatePost />
      </section>

      {/* 게시글 목록 */}
      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          📝 최신 게시글
        </h2>
        <PostLists />
      </section>
    </div>
  );
};

export default Home;
