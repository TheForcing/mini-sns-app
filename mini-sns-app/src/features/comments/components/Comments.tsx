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
import { auth, db } from "../../../firebase";
import { formatRelativeTime } from "../../../utils/time";

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

interface CommentsProps {
  postId: string;
  currentUserId: string;
  postAuthorUid: string;
}

const Comments: React.FC<CommentsProps> = ({
  postId,
  currentUserId,
  postAuthorUid,
}) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [text, setText] = useState("");
  const user = auth.currentUser;

  useEffect(() => {
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
    if (user.uid !== commentAuthorUid && user.uid !== postAuthorUid) {
      return alert("삭제 권한이 없습니다.");
    }
    const ok = window.confirm("댓글을 삭제하시겠습니까?");
    if (!ok) return;
    await deleteDoc(doc(db, "posts", postId, "comments", commentId));
  };

  return (
    <div className="mt-6 bg-white rounded-lg shadow p-5">
      <form onSubmit={handleAdd} className="flex gap-2 items-center">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
          placeholder="댓글을 입력하세요"
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          type="submit"
        >
          전송
        </button>
      </form>
      <ul className="mt-5 space-y-4">
        {comments.map((c) => (
          <li
            key={c.id}
            className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:shadow transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {c.author.photoURL ? (
                  <img
                    src={c.author.photoURL}
                    alt="profile"
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold">
                    {c.author.displayName?.[0] || "?"}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-gray-800">
                    {c.author.displayName}
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatRelativeTime(c.createdAt)}
                  </div>
                </div>
              </div>
              {(user?.uid === c.author.uid || user?.uid === postAuthorUid) && (
                <button
                  onClick={() => handleDelete(c.id, c.author.uid)}
                  className="text-xs text-red-500 hover:underline"
                >
                  삭제
                </button>
              )}
            </div>
            <p className="mt-3 mb-1 whitespace-pre-wrap text-gray-700">
              {c.content}
            </p>
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

interface CommentItemProps {
  postId: string;
  comment: CommentType;
  currentUserId: string;
}

const CommentItem: React.FC<CommentItemProps> = ({
  postId,
  comment,
  currentUserId,
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
    <div className="mt-2 ml-8">
      <button
        onClick={() => setShowReply(!showReply)}
        className="text-blue-500 text-xs hover:underline"
      >
        답글 달기
      </button>
      {showReply && (
        <div className="flex gap-2 mt-2">
          <input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="답글 입력"
            className="border border-gray-300 p-1 flex-1 rounded focus:outline-none focus:ring-2 focus:ring-green-200 transition"
          />
          <button
            onClick={handleAddReply}
            className="bg-green-500 hover:bg-green-600 text-white px-2 rounded transition"
          >
            등록
          </button>
        </div>
      )}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-4 mt-2 space-y-1">
          {comment.replies.map((r) => (
            <div key={r.id} className="flex items-center gap-2 text-sm">
              {r.author.photoURL ? (
                <img
                  src={r.author.photoURL}
                  alt="reply-profile"
                  className="w-6 h-6 rounded-full object-cover border"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold">
                  {r.author.displayName?.[0] || "?"}
                </div>
              )}
              <span className="font-medium text-gray-700">
                {r.author.displayName}
              </span>
              <span className="text-gray-500">{r.content}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments;
