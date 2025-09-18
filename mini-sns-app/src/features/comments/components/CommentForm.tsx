import React, { useState } from "react";
import { addDoc, collection, serverTimestamp, updateDoc, doc, increment } from "firebase/firestore";
import { db, auth } from "../../../firebase";
import Button from "../../../components/ui/Button";
import Textarea from "../../../components/ui/Textarea";

interface Props {
  postId: string;
}

const CommentForm: React.FC<Props> = ({ postId }) => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!content.trim()) return;
    if (!auth.currentUser) {
      alert("로그인이 필요합니다.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "posts", postId, "comments"), {
        content: content.trim(),
        author: {
          uid: auth.currentUser.uid,
          displayName: auth.currentUser.displayName || "익명",
          photoURL: auth.currentUser.photoURL || null,
        },
        createdAt: serverTimestamp(),
      });

      // increment commentsCount on the post document
      try {
        await updateDoc(doc(db, "posts", postId), { commentsCount: increment(1) });
      } catch (err) {
        console.warn("댓글 수 증가 중 오류:", err);
      }

      setContent("");
    } catch (err) {
      console.error("댓글 등록 오류:", err);
      alert("댓글 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <Textarea
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 입력하세요. (Enter: 전송, Shift+Enter: 줄바꿈)"
        className="mb-3"
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={!content.trim() || loading}>
          {loading ? "등록 중..." : "등록"}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
