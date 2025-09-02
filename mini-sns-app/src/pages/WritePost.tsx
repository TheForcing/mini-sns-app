import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const WritePost = () => {
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    await addDoc(collection(db, "posts"), {
      content,
      authorId: auth.currentUser.uid,
      authorName: auth.currentUser.displayName,
      createdAt: serverTimestamp(),
      likes: 0,
      commentsCount: 0,
    });

    setContent("");
    navigate("/");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow space-y-4"
      >
        <textarea
          placeholder="무슨 일이 일어나고 있나요?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={4}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600"
        >
          게시하기
        </button>
      </form>
    </div>
  );
};

export default WritePost;
