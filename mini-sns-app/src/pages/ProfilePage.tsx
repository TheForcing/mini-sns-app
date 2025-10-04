import { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ProfilePage = () => {
  const user = auth.currentUser;
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const docRef = doc(db, "users", user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) setProfile(snap.data());
      else
        await setDoc(docRef, {
          name: user.displayName || "익명",
          photo: user.photoURL || "",
          cover: "",
          bio: "",
        });
    };
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);

    let photoURL = profile?.photo || "";
    let coverURL = profile?.cover || "";

    if (photoFile) {
      const photoRef = ref(storage, `users/${user.uid}/profile.jpg`);
      await uploadBytes(photoRef, photoFile);
      photoURL = await getDownloadURL(photoRef);
    }

    if (coverFile) {
      const coverRef = ref(storage, `users/${user.uid}/cover.jpg`);
      await uploadBytes(coverRef, coverFile);
      coverURL = await getDownloadURL(coverRef);
    }

    await updateDoc(userRef, {
      bio,
      photo: photoURL,
      cover: coverURL,
    });

    setEditing(false);
  };

  if (!user) return <div>로그인이 필요합니다.</div>;
  if (!profile) return <div>로딩 중...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-4 bg-white rounded-lg shadow">
      {/* 커버 */}
      <div className="relative">
        <img
          src={
            profile.cover || "https://via.placeholder.com/800x200?text=Cover"
          }
          alt="cover"
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute bottom-2 right-2">
          <label className="bg-white px-3 py-1 rounded text-sm cursor-pointer">
            커버 변경
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
            />
          </label>
        </div>
      </div>

      {/* 프로필 섹션 */}
      <div className="p-4 flex flex-col items-center">
        <div className="relative -mt-16">
          <img
            src={profile.photo || "https://i.pravatar.cc/100"}
            alt="profile"
            className="w-28 h-28 rounded-full border-4 border-white object-cover"
          />
          <label className="absolute bottom-0 right-0 bg-white px-2 py-1 rounded text-xs cursor-pointer">
            수정
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
            />
          </label>
        </div>

        <h2 className="mt-3 text-xl font-semibold">{profile.name}</h2>

        {!editing ? (
          <>
            <p className="text-gray-600 mt-1">
              {profile.bio || "자기소개가 없습니다."}
            </p>
            <button
              onClick={() => setEditing(true)}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600"
            >
              프로필 수정
            </button>
          </>
        ) : (
          <div className="mt-3 w-full max-w-md">
            <textarea
              className="w-full border rounded-lg p-2 text-sm resize-none"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="자기소개를 입력하세요..."
            />
            <div className="flex gap-2 justify-center mt-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600"
              >
                저장
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 bg-gray-200 rounded-full text-sm"
              >
                취소
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
