import { useState } from "react";
import { useComments } from "../hooks/useComments";

interface Props {
  postId: string;
}

const CommentForm = ({ postId }: Props) => {
  const { addComment } = useComments(postId);
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    await addComment(content);
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2 mt-4">
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 입력하세요..."
        className="flex-1 border rounded-md px-3 py-2"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 rounded-md">
        등록
      </button>
    </form>
  );
};

export default CommentForm;
