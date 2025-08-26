import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, storage } from "../../firebase";
import {
  updateProfile,
  onAuthStateChanged,
  User,
  signOut,
} from "firebase/auth";
import {
  doc,
  updateDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [nickname, setNickname] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ 로그인 유저 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setNickname(currentUser.displayName || "");
        setPreview(currentUser.photoURL || null);
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // ✅ 닉네임 중복 검사
  const checkNicknameDuplicate = async (name: string) => {
    const q = query(collection(db, "users"), where("displayName", "==", name));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  // ✅ 프로필 업데이트
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError(null);
    setLoading(true);

    try {
      // 닉네임 중복 검사
      if (nickname && nickname !== user.displayName) {
        const isDuplicate = await checkNicknameDuplicate(nickname);
        if (isDuplicate) {
          setError("이미 사용 중인 닉네임입니다.");
          setLoading(false);
          return;
        }
      }

      let photoURL = user.photoURL;

      // 프로필 이미지 업로드
      if (photoFile) {
        const storageRef = ref(storage, `profiles/${user.uid}`);
        await uploadBytes(storageRef, photoFile);
        photoURL = await getDownloadURL(storageRef);
      }

      // Firebase Auth 업데이트
      await updateProfile(user, {
        displayName: nickname || user.displayName,
        photoURL: photoURL || user.photoURL,
      });

      // Firestore 업데이트
      await updateDoc(doc(db, "users", user.uid), {
        displayName: nickname || user.displayName,
        photoURL: photoURL || user.photoURL,
      });

      alert("프로필이 업데이트되었습니다!");
      navigate("/feed");
    } catch (err: any) {
      setError("프로필 업데이트 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ 로그아웃
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">프로필 설정</h2>

        {preview && (
          <div className="flex justify-center mb-4">
            <img
              src={preview}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border"
            />
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setPhotoFile(file);
              if (file) {
                setPreview(URL.createObjectURL(file));
              }
            }}
            className="w-full"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
          >
            {loading ? "업데이트 중..." : "프로필 업데이트"}
          </button>
        </form>

        <button
          onClick={handleLogout}
          className="w-full bg-gray-500 text-white py-3 rounded-lg mt-4 hover:bg-gray-600 transition"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default Profile;
