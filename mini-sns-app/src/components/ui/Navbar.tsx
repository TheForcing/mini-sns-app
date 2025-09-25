import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";

const NavBar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(auth.currentUser);

  // ✅ 로그인 상태 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
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
    <header className="w-full bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* 로고 */}
        <Link to="/feed" className="text-2xl font-extrabold text-fb-500">
          MySNS
        </Link>

        {/* 중앙 검색창 */}
        <div className="flex-1 max-w-md mx-6">
          <input
            type="text"
            placeholder="검색"
            className="w-full border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fb-200"
          />
        </div>

        {/* 우측 사용자 메뉴 */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 hover:bg-gray-100 px-3 py-1.5 rounded-md transition"
              >
                <img
                  src={user.photoURL ?? "/default-avatar.png"}
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="hidden md:inline text-sm font-medium text-gray-700">
                  {user.displayName ?? "사용자"}
                </span>
              </Link>
              <button onClick={handleLogout} className="btn-secondary text-sm">
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-primary text-sm">
                로그인
              </Link>
              <Link to="/register" className="btn-secondary text-sm">
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
