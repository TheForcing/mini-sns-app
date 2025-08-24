import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ 로그인 상태 감지 → 이미 로그인된 경우 feed로 이동
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/feed");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // ✅ 이메일 회원가입
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || !confirmPassword) {
      setError("모든 필드를 입력해주세요.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("올바른 이메일 형식을 입력해주세요.");
      return;
    }
    if (password.length < 6) {
      setError("비밀번호는 최소 6자리 이상이어야 합니다.");
      return;
    }
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Firebase Auth 프로필 업데이트 (닉네임 기본값: 이메일 앞부분)
      const defaultDisplayName = email.split("@")[0];
      await updateProfile(user, {
        displayName: defaultDisplayName,
      });

      // Firestore에 유저 정보 저장
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: defaultDisplayName,
        photoURL: null,
        createdAt: new Date(),
      });

      navigate("/feed");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 구글 회원가입
  const handleGoogleRegister = async () => {
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Firestore에 유저 정보 저장 (없으면 새로 생성)
      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "사용자",
          photoURL: user.photoURL || null,
          createdAt: new Date(),
        },
        { merge: true }
      );

      navigate("/feed");
    } catch (err: any) {
      setError("구글 회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">회원가입</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="비밀번호 (6자리 이상)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
          >
            {loading ? "회원가입 중..." : "회원가입"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-500 mb-2">또는</p>
          <button
            onClick={handleGoogleRegister}
            className="w-full border py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            구글 계정으로 가입
          </button>
        </div>

        <p className="text-center text-gray-500 mt-6">
          이미 계정이 있으신가요?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            로그인
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
