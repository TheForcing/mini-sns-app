// src/components/PostForm.tsx
import { useState } from "react";
import { addPost } from "../../../api/posts";

const PostForm = () => {
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      await addPost(content, file || undefined);
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
      className="p-4 mb-4 border rounded max-w-2xl mx-auto"
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
        className="mt-2"
      />

      <button
        type="submit"
        disabled={loading}
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "업로드 중..." : "게시"}
      </button>

      {msg && <p className="text-sm mt-2">{msg}</p>}
    </form>
  );
};

export default PostForm;
