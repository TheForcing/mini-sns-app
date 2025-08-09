import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { formatRelativeTime } from "../utils/time";

type CommentType = {
  id: string;
  content: string;
  createdAt: any;
  author: { uid: string; displayName: string; photoURL?: string };
};

const Comments = ({
  postId,
  postAuthorUid,
}: {
  postId: string;
  postAuthorUid: string;
}) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [text, setText] = useState("");
  const user = auth.currentUser;

  useEffect(() => {
    const q = query(
      collection(db, "posts", postId, "comments"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      })) as CommentType[];
      setComments(data);
    });
    return () => unsub();
  }, [postId]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("로그인 필요");
    if (!text.trim()) return;

    await addDoc(collection(db, "posts", postId, "comments"), {
      content: text.trim(),
      createdAt: serverTimestamp(),
      author: {
        uid: user.uid,
        displayName: user.displayName || "익명",
        photoURL: user.photoURL || "",
      },
    });

    setText("");
  };

  const handleDelete = async (commentId: string, commentAuthorUid: string) => {
    if (!user) return;
    // UI-level 권한 체크: 댓글 작성자 또는 게시물 작성자만 삭제 허용
    if (user.uid !== commentAuthorUid && user.uid !== postAuthorUid) {
      return alert("삭제 권한이 없습니다.");
    }
    const ok = confirm("댓글을 삭제하시겠습니까?");
    if (!ok) return;
    await deleteDoc(doc(db, "posts", postId, "comments", commentId));
  };

  return (
    <div className="mt-3">
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="댓글을 입력하세요"
        />
        <button className="bg-blue-600 text-white px-3 py-1 rounded">
          전송
        </button>
      </form>

      <ul className="mt-3 space-y-2">
        {comments.map((c) => (
          <li key={c.id} className="border p-2 rounded">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{c.author.displayName}</div>
                <div className="text-sm text-gray-500">
                  {formatRelativeTime(c.createdAt)}
                </div>
              </div>
              {(user?.uid === c.author.uid || user?.uid === postAuthorUid) && (
                <button
                  onClick={() => handleDelete(c.id, c.author.uid)}
                  className="text-sm text-red-500"
                >
                  삭제
                </button>
              )}
            </div>
            <p className="mt-2 whitespace-pre-wrap">{c.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Comments;
