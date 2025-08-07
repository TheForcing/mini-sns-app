import { useState } from "react";
import { auth, db, storage } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const PostForm = () => {
  const user = auth.currentUser;
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setMsg("로그인이 필요합니다.");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      let imageURL = "";

      if (file) {
        const imageRef = ref(storage, `postImages/${user.uid}_${Date.now()}`);
        await uploadBytes(imageRef, file);
        imageURL = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, "posts"), {
        content,
        createdAt: Timestamp.now(),
        imageURL,
        author: {
          uid: user.uid,
          displayName: user.displayName || "익명",
          photoURL: user.photoURL || "",
        },
      });

      setMsg("게시글이 등록되었습니다.");
      setContent("");
      setFile(null);
    } catch (err: any) {
      setMsg("에러: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 max-w-md mx-auto space-y-3 border rounded"
    >
      <textarea
        placeholder="게시글을 입력하세요..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border p-2"
        rows={4}
        required
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "업로드 중..." : "게시"}
      </button>

      {msg && <p className="text-sm text-center">{msg}</p>}
    </form>
  );
};

export default PostForm;
