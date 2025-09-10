import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot as onSnapshotCol,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { User } from "firebase/auth";
import { formatDistanceToNow } from "../utils/formatDate";

interface Post {
  id: string;
  content: string;
  createdAt: any;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  likes: string[];
}

interface Comment {
  id: string;
  text: string;
  createdAt: any;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
}

const PostPage = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState<User | null>(auth.currentUser);

  // ✅ 게시글 불러오기
  useEffect(() => {
    if (!postId) return;
    const unsub = onSnapshot(doc(db, "posts", postId), (docSnap) => {
      if (docSnap.exists()) {
        setPost({ id: docSnap.id, ...docSnap.data() } as Post);
      }
    });
    return () => unsub();
  }, [postId]);

  // ✅ 댓글 불러오기
  useEffect(() => {
    if (!postId) return;
    const q = query(
      collection(db, "posts", postId, "comments"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshotCol(q, (snapshot) => {
      setComments(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Comment))
      );
    });
    return () => unsub();
  }, [postId]);

  // ✅ 좋아요 토글
  const toggleLike = async () => {
    if (!user || !post) return;
    const postRef = doc(db, "posts", post.id);

    if (post.likes.includes(user.uid)) {
      await updateDoc(postRef, { likes: arrayRemove(user.uid) });
    } else {
      await updateDoc(postRef, { likes: arrayUnion(user.uid) });
    }
  };

  // ✅ 댓글 작성
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim() || !postId) return;

    await addDoc(collection(db, "posts", postId, "comments"), {
      text: newComment,
      createdAt: serverTimestamp(),
      authorId: user.uid,
      authorName: user.displayName || "익명",
      authorPhoto: user.photoURL || "",
    });

    setNewComment("");
  };

  // ✅ 게시글 삭제
  const handleDeletePost = async () => {
    if (!user || !post) return;
    if (user.uid !== post.authorId) {
      alert("삭제 권한이 없습니다.");
      return;
    }
    await deleteDoc(doc(db, "posts", post.id));
    alert("게시글이 삭제되었습니다.");
    navigate("/feed");
  };

  // ✅ 댓글 삭제
  const handleDeleteComment = async (commentId: string, authorId: string) => {
    if (!user || !postId) return;
    if (user.uid !== authorId && user.uid !== post?.authorId) {
      alert("삭제 권한이 없습니다.");
      return;
    }
    await deleteDoc(doc(db, "posts", postId, "comments", commentId));
  };

  if (!post)
    return <p className="text-center mt-10">게시글을 불러오는 중...</p>;

  return (
    <div className="centered-content max-w-2xl mx-auto p-6 bg-white shadow rounded-lg mt-6">
      {/* 작성자 영역 */}
      <div className="flex items-center mb-4">
        <img
          src={post.authorPhoto || "/default.png"}
          alt="author"
          className="w-10 h-10 rounded-full mr-3 cursor-pointer"
          onClick={() => navigate(`/profile/${post.authorId}`)}
        />
        <div>
          <p
            className="font-bold cursor-pointer"
            onClick={() => navigate(`/profile/${post.authorId}`)}
          >
            {post.authorName}
          </p>
          <p className="text-sm text-gray-500">
            {post.createdAt?.toDate
              ? formatDistanceToNow(post.createdAt.toDate())
              : "방금 전"}
          </p>
        </div>
      </div>

      {/* 게시글 본문 */}
      <p className="text-gray-800 mb-4">{post.content}</p>

      {/* 좋아요 / 삭제 */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={toggleLike}
          className={`px-3 py-1 rounded-lg ${
            user && post.likes.includes(user.uid)
              ? "bg-red-500 text-white"
              : "bg-gray-200"
          }`}
        >
          ❤️ {post.likes.length}
        </button>

        {user?.uid === post.authorId && (
          <button
            onClick={handleDeletePost}
            className="px-3 py-1 bg-red-500 text-white rounded-lg"
          >
            게시글 삭제
          </button>
        )}
      </div>

      {/* 댓글 목록 */}
      <div>
        <h3 className="font-bold mb-3">댓글</h3>
        {comments.map((c) => (
          <div key={c.id} className="flex items-start mb-3">
            <img
              src={c.authorPhoto || "/default.png"}
              alt="author"
              className="w-8 h-8 rounded-full mr-2"
            />
            <div className="bg-gray-100 p-2 rounded-lg flex-1">
              <div className="flex justify-between items-center">
                <p className="font-bold text-sm">{c.authorName}</p>
                {user &&
                  (user.uid === c.authorId || user.uid === post.authorId) && (
                    <button
                      onClick={() => handleDeleteComment(c.id, c.authorId)}
                      className="text-red-500 text-xs"
                    >
                      삭제
                    </button>
                  )}
              </div>
              <p className="text-sm">{c.text}</p>
              <p className="text-xs text-gray-500">
                {c.createdAt?.toDate
                  ? formatDistanceToNow(c.createdAt.toDate())
                  : "방금 전"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 댓글 작성 */}
      {user && (
        <form onSubmit={handleAddComment} className="mt-4 flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요..."
            className="flex-1 border p-2 rounded-lg"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            등록
          </button>
        </form>
      )}
    </div>
  );
};

export default PostPage;
