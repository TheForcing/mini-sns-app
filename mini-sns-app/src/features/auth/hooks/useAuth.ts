// src/features/auth/hooks/useAuth.ts
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";

type UserProfile = {
  username?: string;
  email?: string;
  photoURL?: string;
  banned?: boolean;
  [key: string]: any;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setLoading(true);
      setUser(u);
      try {
        if (u) {
          const snap = await getDoc(doc(db, "users", u.uid));
          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            if (data.banned) {
              await auth.signOut();
              setProfile(null);
              setError("차단된 계정입니다.");
            } else {
              setProfile(data);
              setError(null);
            }
          } else {
            setProfile(null);
            setError(null);
          }
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error("useAuth error:", err);
        setError("사용자 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  return { user, profile, loading, error };
}
