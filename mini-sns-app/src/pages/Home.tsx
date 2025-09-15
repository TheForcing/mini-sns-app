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
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
      <div className="w-full max-w-3xl space-y-10">
        {/* 상단 헤더 */}
        <header className="bg-white rounded-2xl shadow-md p-6 flex justify-between items-center border border-gray-100">
          <h1 className="text-2xl md:text-3xl font-extrabold text-blue-600 flex items-center gap-2">
            <span role="img" aria-label="fire">
              🔥
            </span>
            MySNS 홈
          </h1>
          {userEmail ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-700 text-sm md:text-base font-medium truncate max-w-[150px]">
                {userEmail}
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm md:text-base rounded-lg bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow hover:scale-105 transform transition"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <span className="text-gray-500 text-sm">로그인 필요</span>
          )}
        </header>

        {/* 글쓰기 섹션 */}
        <section className="bg-white rounded-2xl shadow-md p-6 space-y-5 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
            ✍️ 글 작성하기
          </h2>
          <CreatePost />
        </section>

        {/* 게시글 목록 */}
        <section className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-700 mb-5 flex items-center gap-2">
            📝 최신 게시글
          </h2>
          <PostLists />
        </section>
      </div>
    </div>
  );
};

export default Home;
