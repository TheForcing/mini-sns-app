// useAuth.ts (간단 훅)
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const snap = await getDoc(doc(db, "users", u.uid));
        setProfile(snap.exists() ? snap.data() : null);
        if (snap.exists() && (snap.data() as any).banned) {
          // 즉시 로그아웃 처리(또는 별도 UI)
          await auth.signOut();
          alert("차단된 계정입니다.");
        }
      } else {
        setProfile(null);
      }
    });
    return () => unsub();
  }, []);
  return { user, profile };
}
