import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";

interface UserProfile {
  username?: string;
  email?: string;
  photoURL?: string;
  banned?: boolean;
  [key: string]: any;
}

interface UseAuthReturn {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

/**
 * Firebase Auth + Firestore 기반 사용자 인증 훅
 * 로그인 상태 및 사용자 프로필 정보를 동기화합니다.
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Auth 상태 변화 감지
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      setUser(firebaseUser);
      try {
        if (firebaseUser) {
          const userRef = doc(db, "users", firebaseUser.uid);
          const snapshot = await getDoc(userRef);

          if (snapshot.exists()) {
            const data = snapshot.data() as UserProfile;

            // 차단 계정 처리
            if (data.banned) {
              await auth.signOut();
              setProfile(null);
              setError("차단된 계정입니다.");
              alert("차단된 계정입니다.");
            } else {
              setProfile(data);
              setError(null);
            }
          } else {
            setProfile(null);
            setError("프로필 정보를 찾을 수 없습니다.");
          }
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error("🔥 useAuth 오류:", err);
        setError("사용자 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    });

    // 언마운트 시 리스너 해제
    return () => unsubscribe();
  }, []);

  return { user, profile, loading, error };
}
