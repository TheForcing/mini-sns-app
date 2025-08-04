import { useState } from "react";
import { auth, storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";

const ProfileForm = () => {
  const [displayName, setDisplayName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleUpload = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);
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

      setMsg("프로필이 성공적으로 업데이트되었습니다.");
    } catch (err: any) {
      setMsg("에러: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">프로필 설정</h2>
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
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "업데이트 중..." : "업데이트"}
      </button>
      {msg && <p className="mt-2 text-sm">{msg}</p>}
    </div>
  );
};

export default ProfileForm;