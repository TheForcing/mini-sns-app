import { useState } from "react";
import { db, auth } from "../../../firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";

interface CreateCommentProps {
  postId: string; // 댓글이 달릴 게시글 ID
}

const CreateComment = ({ postId }: CreateCommentProps) => {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleComment = async () => {
    if (!comment.trim()) return alert("댓글을 입력해주세요!");
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      // 댓글 추가
      await addDoc(collection(db, "posts", postId, "comments"), {
        text: comment,
        authorId: user.uid,
        authorName: user.displayName || "익명",
        authorPhoto: user.photoURL || "https://i.pravatar.cc/40",
        createdAt: serverTimestamp(),
      });

      // 게시글의 댓글 수 증가
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, { commentsCount: increment(1) });

      setComment("");
    } catch (err) {
      console.error("댓글 작성 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-3">
      <img
        src={auth.currentUser?.photoURL || "https://i.pravatar.cc/40"}
        alt="profile"
        className="w-9 h-9 rounded-full object-cover"
      />
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="댓글을 입력하세요..."
        className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
      />
      <button
        onClick={handleComment}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "작성 중..." : "작성"}
      </button>
    </div>
  );
};

export default CreateComment;
