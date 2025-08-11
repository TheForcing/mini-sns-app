import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import { doc, getDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { toggleLike } from "../utils/like";
import Comments from "./Comments";
import { Link } from "react-router-dom";
import { formatRelativeTime } from "../utils/time";

type Post = {
  id: string;
  content: string;
  imageURL?: string;
  imagePath?: string;
  createdAt: any;
  author: { uid: string; displayName: string; photoURL?: string };
  likesCount?: number;
};

const PostItem = ({ post }: { post: Post }) => {
  const user = auth.currentUser;
  const [likesCount, setLikesCount] = useState<number>(post.likesCount || 0);
  const [liked, setLiked] = useState<boolean>(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    // 실시간 likesCount 업데이트 (옵션)
    const unsub = onSnapshot(doc(db, "posts", post.id), (snap) => {
      const data = snap.data() as any;
      setLikesCount(data?.likesCount ?? 0);
    });
    return () => unsub();
  }, [post.id]);

  useEffect(() => {
    // 현재 사용자가 해당 포스트에 좋아요를 눌렀는지 조회 (초기)
    if (!user) return setLiked(false);
    const likeRef = doc(db, "posts", post.id, "likes", user.uid);
    getDoc(likeRef).then((snap) => setLiked(snap.exists()));
  }, [post.id, user?.uid]);

  const handleToggleLike = async () => {
    if (!user) return alert("로그인 필요");
    try {
      const res = await toggleLike(post.id, user.uid);
      setLiked(res.liked);
      // likesCount는 트랜잭션에서 업데이트되므로 onSnapshot이 반영해 줄 것
    } catch (err: any) {
      console.error(err);
      alert("좋아요 처리 중 오류가 발생했습니다.");
    }
  };

  const handleDeletePost = async () => {
    if (!user) return;
    if (user.uid !== post.author.uid) return alert("삭제 권한이 없습니다.");

    const ok = confirm("게시물을 삭제하시겠습니까?");
    if (!ok) return;

    try {
      // 포스트 문서 삭제
      await deleteDoc(doc(db, "posts", post.id));

      // (선택) 스토리지에 저장된 이미지도 삭제하려면 imagePath가 필요
      if (post.imagePath) {
        const imgRef = ref(storage, post.imagePath);
        await deleteObject(imgRef).catch(() => {
          /* 이미지가 없거나 권한 문제 무시 */
        });
      }
    } catch (err: any) {
      console.error(err);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="border rounded p-4 shadow-sm">
      <div className="flex items-center space-x-2 mb-2">
        <img
          src={post.author.photoURL || "/default-avatar.png"}
          alt="avatar"
          className="w-8 h-8 rounded-full"
        />
        <Link
          to={`/user/${post.author.uid}`}
          className="font-semibold hover:underline"
        >
          {post.author.displayName}
        </Link>
        <span className="text-sm text-gray-500 ml-auto">
          {formatRelativeTime(post.createdAt)}
        </span>
      </div>

      <p className="whitespace-pre-wrap">{post.content}</p>
      {post.imageURL && (
        <img
          src={post.imageURL}
          alt="post"
          className="mt-2 max-h-64 object-cover rounded"
        />
      )}

      <div className="flex items-center gap-3 mt-3">
        <button onClick={handleToggleLike} className="flex items-center gap-2">
          <span>{liked ? "💙" : "🤍"}</span>
          <span>{likesCount}</span>
        </button>

        <button
          onClick={() => setShowComments((v) => !v)}
          className="text-sm text-gray-600"
        >
          댓글
        </button>

        {user?.uid === post.author.uid && (
          <button
            onClick={handleDeletePost}
            className="ml-auto text-sm text-red-500"
          >
            게시물 삭제
          </button>
        )}
      </div>

      {showComments && (
        <Comments postId={post.id} postAuthorUid={post.author.uid} />
      )}
    </div>
  );
};

export default PostItem;
