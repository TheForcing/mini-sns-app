import { Link, useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";

const NavBar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(auth.currentUser);

  // ✅ 로그인 상태 감지
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // ✅ 로그아웃
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("로그아웃 되었습니다.");
      navigate("/login");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃에 실패했습니다.");
    }
  };

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-gray-800 text-white">
      <Link to="/feed" className="font-bold text-lg">
        MySNS
      </Link>
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <Link to="/profile" className="hover:underline">
              프로필
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              로그인
            </Link>
            <br />
            <Link to="/register" className="hover:underline">
              회원가입
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
