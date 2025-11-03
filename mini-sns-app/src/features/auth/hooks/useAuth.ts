import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";

interface Profile {
  displayName?: string;
  photoURL?: string;
  bio?: string;
  banned?: boolean;
  role?: "user" | "admin";
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const ref = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data() as Profile;
          if (data.banned) {
            alert("🚫 차단된 계정입니다. 로그아웃됩니다.");
            await signOut(auth);
            setUser(null);
            setProfile(null);
          } else {
            setProfile(data);
          }
        } else {
          // Firestore에 프로필 문서가 없으면 새로 생성 필요
          setProfile({
            displayName: firebaseUser.displayName ?? "사용자",
            photoURL: firebaseUser.photoURL ?? "",
            role: "user",
          });
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, profile, loading };
}
