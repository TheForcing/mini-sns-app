import React, { useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  doc,
  increment,
} from "firebase/firestore";
import { db, auth } from "../../../firebase";
import { Textarea } from "../../../components/ui";

interface Props {
  postId: string;
}

const CommentForm: React.FC<Props> = ({ postId }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!postId) {
      console.error("CommentForm: postId is missing");
      alert("게시물 정보가 없습니다.");
      return;
    }
    const user = auth.currentUser;
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
    const trimmed = content.trim();
    if (!trimmed) return;

    setLoading(true);
    try {
      const author = {
        uid: user.uid,
        displayName: user.displayName ?? "익명",
        photoURL: user.photoURL ?? null,
      };

      // 댓글 문서에 author 객체와 함께 authorId/authorName도 같이 저장 (규칙 호환성 확보)
      const payload = {
        content: trimmed,
        author,
        authorId: user.uid,
        authorName: author.displayName,
        createdAt: serverTimestamp(),
      };

      const commentRef = await addDoc(
        collection(db, "posts", postId, "comments"),
        payload
      );
      console.log("댓글 추가 성공, id:", commentRef.id);

      // 댓글 수 안전하게 증가 (비동기이므로 실패해도 댓글은 남음)
      try {
        await updateDoc(doc(db, "posts", postId), {
          commentsCount: increment(1),
        });
      } catch (incErr) {
        console.warn("commentsCount 증가 실패:", incErr);
      }

      setContent("");
    } catch (err: any) {
      console.error("댓글 등록 실패:", err);
      // 권한 오류일 경우 명확히 알림
      if (err?.code === "permission-denied") {
        alert("권한이 없습니다. Firestore 보안 규칙을 확인하세요.");
      } else {
        alert("댓글 등록 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (content.trim()) handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <Textarea
        placeholder="댓글을 입력하세요..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={2}
        className="text-sm"
      />
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          disabled={!content.trim() || loading}
          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
            content.trim() && !loading
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          {loading ? "등록 중..." : "등록"}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
