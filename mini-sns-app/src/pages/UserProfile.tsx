import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import ProfileHeader from "../features/profile/components/ProfileHeader";

const Profile = () => {
  const { uid } = useParams();
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!uid) return;
      const ref = doc(db, "users", uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setUser(snap.data());
      }
    };
    fetchUser();
  }, [uid]);

  if (!user)
    return (
      <p className="text-center text-gray-500 mt-10">
        사용자 정보를 불러오는 중...
      </p>
    );

  return (
    <div className="centered-content max-w-2xl mx-auto px-4 py-6">
      <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
        <ProfileHeader />
        <img
          src={user.photoURL || "/default-avatar.png"}
          alt="프로필"
          className="w-20 h-20 rounded-full object-cover border"
        />
        <div>
          <h2 className="text-xl font-bold">{user.displayName}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
