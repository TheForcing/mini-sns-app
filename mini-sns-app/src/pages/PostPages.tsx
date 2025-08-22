import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  onSnapshot,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { Button, Input, TextArea } from "../components/UI";

interface Post {
  id: string;
  content: string;
  authorName: string;
  createdAt: string;
}

interface Comment {
  id: string;
  content: string;
  authorName: string;
  createdAt: string;
}

const PostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  // 게시글 불러오기
  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      const docRef = doc(db, "posts", postId);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        setPost({ id: snapshot.id, ...snapshot.data() } as Post);
      }
    };

    fetchPost();
  }, [postId]);

  // 댓글 실시간 불러오기
  useEffect(() => {
    if (!postId) return;

    const q = query(
      collection(db, "posts", postId, "comments"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Comment[]
      );
    });

    return () => unsubscribe();
  }, [postId]);

  // 댓글 작성
  const handleAddComment = async () => {
    if (!auth.currentUser || !postId) return;
    if (!newComment.trim()) return;

    await addDoc(collection(db, "posts", postId, "comments"), {
      content: newComment,
      authorName: auth.currentUser.displayName || "익명",
      createdAt: new Date().toISOString(),
    });

    setNewComment("");
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: string) => {
    if (!auth.currentUser || !postId) return;

    const commentRef = doc(db, "posts", postId, "comments", commentId);
    await deleteDoc(commentRef);
  };

  if (!post) return <p>게시글을 불러오는 중...</p>;

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-2">{post.authorName}</h2>
        <p className="text-gray-700 mb-4">{post.content}</p>
        <span className="text-sm text-gray-400">{post.createdAt}</span>
      </div>

      {/* 댓글 목록 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">댓글</h3>
        <div className="space-y-4 mb-4">
          {comments.map((c) => (
            <div key={c.id} className="border-b pb-2">
              <p className="font-medium">{c.authorName}</p>
              <p>{c.content}</p>
              <span className="text-sm text-gray-400">{c.createdAt}</span>
              <Button onClick={() => handleDeleteComment(c.id)}>삭제</Button>
            </div>
          ))}
        </div>

        {/* 댓글 작성 */}
        <div className="flex space-x-2">
          <Input
            placeholder="댓글을 입력하세요..."
            value={newComment}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewComment(e.target.value)
            }
          />
          <Button onClick={handleAddComment}>등록</Button>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
