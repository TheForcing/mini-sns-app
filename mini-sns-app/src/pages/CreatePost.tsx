// src/pages/CreatePost.tsx
import { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      await addDoc(collection(db, "posts"), {
        content,
        authorId: auth.currentUser.uid,
        authorName: auth.currentUser.displayName || "익명",
        createdAt: serverTimestamp(),
        likes: 0,
        commentsCount: 0,
      });
      setContent("");
      navigate("/feed"); // 작성 후 피드로 이동
    } catch (err) {
      console.error(err);
      alert("게시글 작성 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow rounded p-4">
      <h2 className="text-lg font-bold mb-4">새 글 작성</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full border rounded p-2"
          rows={5}
          placeholder="무슨 생각을 하고 있나요?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          게시하기
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
