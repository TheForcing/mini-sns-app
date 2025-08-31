import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

interface Comment {
  id: string;
  text: string;
  authorName: string;
  authorPhoto: string;
  createdAt: any;
}

interface CommentListProps {
  postId: string;
}

const CommentList = ({ postId }: CommentListProps) => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "posts", postId, "comments"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedComments = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          text: data.text,
          authorName: data.authorName,
          authorPhoto: data.authorPhoto,
          createdAt: data.createdAt?.toDate?.() || new Date(),
        } as Comment;
      });
      setComments(fetchedComments);
    });

    return () => unsubscribe();
  }, [postId]);

  return (
    <div className="mt-4 space-y-3">
      {comments.length === 0 ? (
        <p className="text-gray-500 text-sm">아직 댓글이 없습니다.</p>
      ) : (
        comments.map((c) => (
          <div key={c.id} className="flex gap-3 items-start">
            <img
              src={c.authorPhoto}
              alt="profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="bg-gray-100 px-3 py-2 rounded-lg max-w-sm">
              <p className="text-sm font-semibold">{c.authorName}</p>
              <p className="text-sm text-gray-700">{c.text}</p>
              <p className="text-xs text-gray-400 mt-1">
                {c.createdAt.toLocaleString()}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CommentList;
