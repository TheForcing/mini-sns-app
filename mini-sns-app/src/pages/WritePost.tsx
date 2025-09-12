import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const WritePost = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || !content.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "posts"), {
        content: content.trim(),
        authorId: auth.currentUser.uid,
        authorName: auth.currentUser.displayName || "익명",
        createdAt: serverTimestamp(),
        likes: 0,
        commentsCount: 0,
      });

      setContent("");
      navigate("/");
    } catch (error) {
      console.error("게시글 작성 오류:", error);
      alert("게시글 작성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      handleSubmit(e as any);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        <textarea
          placeholder="무슨 일이 일어나고 있나요?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={4}
          required
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!content.trim() || loading}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition ${
              content.trim() && !loading
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading ? "작성 중..." : "게시하기"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WritePost;
