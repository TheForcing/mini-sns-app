import { useEffect, useRef, useState } from "react";
import { auth, db, storage } from "../firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const ProfilePage = () => {
  const user = auth.currentUser;
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // 프로필 정보 가져오기
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const docRef = doc(db, "users", user.uid);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        setProfile(snap.data());
      } else {
        const newProfile = {
          name: user.displayName || "익명 사용자",
          photo: user.photoURL || "",
          cover: "",
          bio: "",
        };
        await setDoc(docRef, newProfile);
        setProfile(newProfile);
      }
    };
    fetchProfile();
  }, [user]);

  // 미리보기
  useEffect(() => {
    if (coverFile) {
      const url = URL.createObjectURL(coverFile);
      setCoverPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [coverFile]);

  useEffect(() => {
    if (photoFile) {
      const url = URL.createObjectURL(photoFile);
      setPhotoPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [photoFile]);

  // textarea 자동 높이 조절
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [bio]);

  // 저장
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const userRef = doc(db, "users", user.uid);
    let photoURL = profile?.photo || "";
    let coverURL = profile?.cover || "";

    try {
      // 프로필 사진 업로드
      if (photoFile) {
        if (profile?.photo) {
          try {
            const oldRef = ref(storage, profile.photo);
            await deleteObject(oldRef);
          } catch {}
        }
        const photoRef = ref(
          storage,
          `users/${user.uid}/profile_${photoFile.name}`
        );
        await uploadBytes(photoRef, photoFile);
        photoURL = await getDownloadURL(photoRef);
      }

      // 커버 사진 업로드
      if (coverFile) {
        if (profile?.cover) {
          try {
            const oldRef = ref(storage, profile.cover);
            await deleteObject(oldRef);
          } catch {}
        }
        const coverRef = ref(
          storage,
          `users/${user.uid}/cover_${coverFile.name}`
        );
        await uploadBytes(coverRef, coverFile);
        coverURL = await getDownloadURL(coverRef);
      }

      // Firestore 업데이트
      const newData = {
        bio,
        photo: photoURL,
        cover: coverURL,
      };
      await updateDoc(userRef, newData);

      // 로컬 상태 갱신
      setProfile((prev: any) => ({ ...prev, ...newData }));
      setEditing(false);
    } catch (e) {
      console.error("프로필 저장 실패:", e);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (!user)
    return <div className="text-center mt-8">로그인이 필요합니다.</div>;
  if (!profile) return <div className="text-center mt-8">로딩 중...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-6 bg-white rounded-lg shadow">
      {/* 커버 영역 */}
      <div className="relative">
        <img
          src={
            coverPreview ||
            profile.cover ||
            "https://via.placeholder.com/800x200?text=Cover"
          }
          alt="cover"
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute bottom-2 right-2">
          <label className="bg-white/90 hover:bg-white px-3 py-1 rounded-full text-sm cursor-pointer shadow">
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

      {/* 프로필 영역 */}
      <div className="p-6 flex flex-col items-center">
        <div className="relative -mt-16">
          <img
            src={
              photoPreview ||
              profile.photo ||
              "https://i.pravatar.cc/100?u=placeholder"
            }
            alt="profile"
            className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-md"
          />
          <label className="absolute bottom-0 right-0 bg-white px-2 py-1 rounded-full text-xs cursor-pointer shadow">
            수정
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
            />
          </label>
        </div>

        <h2 className="mt-4 text-xl font-semibold">{profile.name}</h2>

        {/* 편집 모드 */}
        {!editing ? (
          <>
            <p className="text-gray-600 mt-1 text-center max-w-md">
              {profile.bio || "아직 자기소개가 없습니다."}
            </p>
            <button
              onClick={() => {
                setBio(profile.bio || "");
                setEditing(true);
              }}
              className="mt-3 px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition"
            >
              프로필 수정
            </button>
          </>
        ) : (
          <div className="mt-3 w-full max-w-md">
            <textarea
              ref={textareaRef}
              className="w-full border rounded-lg p-2 text-sm resize-none focus:ring-2 focus:ring-blue-400"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="자기소개를 입력하세요..."
            />
            <div className="flex gap-2 justify-center mt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className={`px-4 py-2 text-sm rounded-full ${
                  saving
                    ? "bg-gray-300 text-gray-600"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {saving ? "저장 중..." : "저장"}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 bg-gray-200 text-sm rounded-full hover:bg-gray-300"
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
