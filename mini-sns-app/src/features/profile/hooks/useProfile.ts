import { useEffect, useState } from "react";
import { db, storage } from "../../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useAuth } from "../../auth/hooks/useAuth";

export const useProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<{
    nickname: string;
    photoURL?: string;
  } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      setLoading(true);
      const userRef = doc(db, "users", user.uid);
      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        setProfile(snapshot.data() as { nickname: string; photoURL?: string });
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const updateProfileData = async (nickname: string, file?: File) => {
    if (!user) return;

    setLoading(true);
    const userRef = doc(db, "users", user.uid);
    let photoURL = profile?.photoURL;

    if (file) {
      const fileRef = ref(storage, `profiles/${user.uid}`);
      await uploadBytes(fileRef, file);
      photoURL = await getDownloadURL(fileRef);
    }

    await updateDoc(userRef, { nickname, photoURL });
    setProfile({ nickname, photoURL });
    setLoading(false);
  };

  return { profile, loading, updateProfileData };
};
