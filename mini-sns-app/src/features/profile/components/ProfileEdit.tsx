import { useState } from "react";
import { auth, db, storage } from "../../../firebase";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const ProfileEdit = () => {
  const user = auth.currentUser;
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(user?.photoURL || "");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!user) return;
    let photoURL = user.photoURL;

    if (photo) {
      const fileRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(fileRef, photo);
      photoURL = await getDownloadURL(fileRef);
    }

    await updateProfile(user, { photoURL });
    await updateDoc(doc(db, "users", user.uid), { photoURL });
    alert("프로필이 저장되었습니다!");
  };

  return (
    <div>
      <img src={preview} alt="preview" className="w-24 h-24 rounded-full" />
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleSave}>저장</button>
    </div>
  );
};
