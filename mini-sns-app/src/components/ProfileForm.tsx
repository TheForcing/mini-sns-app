// src/components/ProfileForm.tsx
import { useEffect, useState } from "react";
import { auth, storage, db } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const ProfileForm = () => {
  const [displayName, setDisplayName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const u = auth.currentUser;
    if (u) {
      setDisplayName(u.displayName ?? "");
    }
  }, []);

  const handleUpdateProfile = async () => {
    const user = auth.currentUser;
    if (!user) {
      setMsg("로그인이 필요합니다.");
      return;
    }
    if (!displayName) {
      setMsg("닉네임을 입력하세요.");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      let photoURL = "";

      if (file) {
        const storageRef = ref(storage, `profileImages/${user.uid}`);
        await uploadBytes(storageRef, file);
        photoURL = await getDownloadURL(storageRef);
      }

      await updateProfile(user, {
        displayName,
        photoURL: photoURL || undefined,
      });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName,
        photoURL: photoURL || user.photoURL || "",
      });

      setMsg("프로필이 성공적으로 업데이트되었습니다!");
    } catch (error: any) {
      setMsg("에러: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">프로필 설정</h2>

      {auth.currentUser?.photoURL && (
        <img
          src={auth.currentUser.photoURL}
          alt="profile"
          className="w-24 h-24 rounded-full mb-2"
        />
      )}

      <input
        type="text"
        placeholder="닉네임"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        className="border p-2 w-full mb-2"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-2"
      />

      <button
        onClick={handleUpdateProfile}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "업데이트 중..." : "프로필 저장"}
      </button>

      {msg && <p className="mt-2 text-sm">{msg}</p>}
    </div>
  );
};

export default ProfileForm;
