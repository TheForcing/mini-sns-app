import React, { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";
import Avatar from "../../../components/ui/Avatar";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface Comment {
  id: string;
  content: string;
  author: { uid: string; displayName?: string; photoURL?: string | null };
  createdAt?: any;
}

interface Props {
  postId: string;
}

const toDate = (value: any): Date => {
  if (!value) return new Date();
  if (typeof value.toDate === "function") return value.toDate();
  if (value.seconds) return new Date(value.seconds * 1000);
  return new Date(value);
};

const CommentList: React.FC<Props> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "posts", postId, "comments"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list: Comment[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }));
        setComments(list);
        setLoading(false);
      },
      (err) => {
        console.error("comments snapshot error", err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [postId]);

  if (loading)
    return <div className="text-sm text-gray-500">댓글 불러오는 중...</div>;

  if (comments.length === 0) {
    return (
      <div className="text-sm text-gray-400">
        아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((c) => (
        <div
          key={c.id}
          className="flex items-start gap-3 bg-gray-50 rounded-lg p-3"
        >
          <Avatar
            src={c.author.photoURL ?? null}
            name={c.author.displayName}
            size="sm"
          />
          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <div className="font-medium text-sm text-gray-800">
                {c.author.displayName ?? "익명"}
              </div>
              <div className="text-xs text-gray-400">
                {c.createdAt
                  ? formatDistanceToNow(toDate(c.createdAt), {
                      addSuffix: true,
                      locale: ko,
                    })
                  : "방금 전"}
              </div>
            </div>
            <p className="text-sm text-gray-700 mt-1">{c.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
