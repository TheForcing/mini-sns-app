// src/features/post/pages/PostDetail.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase";
import CreateComment from "../../features/comments/components/CreateComment";

const PostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);

  // ✅ 게시글 가져오기
  useEffect(() => {
    if (!postId) return;
    const fetchPost = async () => {
      const snap = await getDoc(doc(db, "posts", postId));
      if (snap.exists()) {
        setPost({ id: snap.id, ...snap.data() });
      }
    };
    fetchPost();
  }, [postId]);

  // ✅ 댓글 실시간 구독
  useEffect(() => {
    if (!postId) return;
    const q = query(
      collection(db, "posts", postId, "comments"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setComments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [postId]);

  if (!post) return <p>게시글을 찾을 수 없습니다.</p>;

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      {/* 게시글 */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold">{post.authorName}</h2>
        <p className="mt-2 text-gray-800">{post.content}</p>
      </div>

      {/* 댓글 영역 */}
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="font-semibold mb-4">댓글 ({comments.length})</h3>

        <ul className="space-y-3 mb-4">
          {comments.map((c) => (
            <li key={c.id} className="flex items-start gap-2">
              <img
                src={c.authorPhoto}
                alt={c.authorName}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="text-sm font-medium">{c.authorName}</p>
                <p className="text-gray-700">{c.text}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* ✅ 댓글 작성 폼 */}
        {postId && <CreateComment postId={postId} />}
      </div>
    </div>
  );
};

export default PostDetail;
