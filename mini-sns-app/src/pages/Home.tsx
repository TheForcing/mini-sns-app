import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

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
          <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded mt-2">
            로그아웃
          </button>
        </div>
      ) : (
        <p className="mt-4 text-gray-600">로그인되어 있지 않습니다.</p>
      )}
    </div>
  );
};

export default Home;