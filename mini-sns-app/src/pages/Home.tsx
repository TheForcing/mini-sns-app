import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import PostForm from "../components/PostForm";

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
    <div className="p-4">
      <h1 className="text-2xl">🔥 SNS 홈</h1>
      {userEmail ? (
        <div className="mt-4">
          <p>로그인 중: {userEmail}</p>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-3 py-1 rounded mt-2"
          >
            로그아웃
          </button>
        </div>
      ) : (
        <p className="mt-4 text-gray-600">로그인되어 있지 않습니다.</p>
      )}
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">📌 새 게시글 작성</h2>
        <PostForm />
        <hr className="my-4" />
        <PostList />
      </div>
    </div>
  );
};

export default Home;
