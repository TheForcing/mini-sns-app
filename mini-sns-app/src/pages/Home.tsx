import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import PostForm from "../features/post/components/PostForm";
import PostLists from "../features/post/components/PostLists";

const Home = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUserEmail(user?.email ?? null);
    });
    return () => unsub();
  }, []);

  const logout = async () => {
    await signOut(auth);
    alert("로그아웃되었습니다.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-xl space-y-8">
        <header className="bg-white rounded-lg shadow flex items-center justify-between px-6 py-4">
          <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-2">
            <span role="img" aria-label="fire">
              🔥
            </span>{" "}
            SNS 홈
          </h1>
          {userEmail ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-700 text-sm">
                로그인: <b>{userEmail}</b>
              </span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded shadow transition"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <span className="text-gray-500 text-sm">
              로그인되어 있지 않습니다.
            </span>
          )}
        </header>
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span role="img" aria-label="pin">
              📌
            </span>{" "}
            새 게시글 작성
          </h2>
          <PostForm />
        </section>
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">게시글 목록</h2>
          <PostLists />
        </section>
      </div>
    </div>
  );
};

export default Home;
