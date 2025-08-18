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
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { formatRelativeTime } from "../utils/time";

interface CommentType {
  id: string;
  content: string;
  author: {
    uid: string;
    displayName: string;
    photoURL: string;
  };
  createdAt: any;
  replies?: ReplyType[];
}
interface ReplyType {
  id: string;
  content: string;
  author: {
    uid: string;
    displayName: string;
    photoURL: string;
  };
  createdAt: any;
}

const Comments = ({
  postId,
  currentUserId,
  postAuthorUid,
}: {
  postId: string;
  currentUserId: string;
  postAuthorUid: string;
}) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [text, setText] = useState("");
  const user = auth.currentUser;

  useEffect(() => {
    // 댓글 실시간 구독
    const q = query(
      collection(db, "posts", postId, "comments"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, async (snapshot) => {
      const commentList: CommentType[] = [];
      for (const docSnap of snapshot.docs) {
        const comment = { id: docSnap.id, ...docSnap.data() } as CommentType;

        // 답글 가져오기
        const repliesCol = collection(
          db,
          "posts",
          postId,
          "comments",
          docSnap.id,
          "replies"
        );
        const repliesSnap = await getDocs(repliesCol);
        comment.replies = repliesSnap.docs.map((r) => ({
          id: r.id,
          ...r.data(),
        })) as ReplyType[];

        commentList.push(comment);
      }
      setComments(commentList);
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
    // 댓글 작성자 또는 게시물 작성자만 삭제 허용
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
            <CommentItem
              postId={postId}
              comment={c}
              currentUserId={currentUserId}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

const CommentItem = ({
  postId,
  comment,
  currentUserId,
}: {
  postId: string;
  comment: CommentType;
  currentUserId: string;
}) => {
  const [replyText, setReplyText] = useState("");
  const [showReply, setShowReply] = useState(false);
  const user = auth.currentUser;

  const handleAddReply = async () => {
    if (!user) return alert("로그인 필요");
    if (!replyText.trim()) return;
    await addDoc(
      collection(db, "posts", postId, "comments", comment.id, "replies"),
      {
        content: replyText.trim(),
        createdAt: serverTimestamp(),
        author: {
          uid: user.uid,
          displayName: user.displayName || "익명",
          photoURL: user.photoURL || "",
        },
      }
    );
    setReplyText("");
    setShowReply(false);
  };

  return (
    <div className="mt-2 ml-4">
      <button
        onClick={() => setShowReply(!showReply)}
        className="text-blue-500 text-sm mt-1"
      >
        답글 달기
      </button>
      {showReply && (
        <div className="flex gap-2 mt-2">
          <input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="답글 입력"
            className="border p-1 flex-1"
          />
          <button
            onClick={handleAddReply}
            className="bg-green-500 text-white px-2 rounded"
          >
            등록
          </button>
        </div>
      )}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-6 mt-2 space-y-1">
          {comment.replies.map((r) => (
            <div key={r.id} className="text-sm">
              ↳ {r.content}{" "}
              <span className="text-gray-500">
                ({r.author?.displayName || r.author?.uid})
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;
