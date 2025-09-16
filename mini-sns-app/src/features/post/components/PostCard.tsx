import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db, auth } from "../../../firebase";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import Avatar from "../../../components/ui/Avatar";
import IconButton from "../../../components/ui/IconButton";
import Card from "../../../components/ui/Card";

export interface Post {
  id: string;
  content?: string;
  authorId?: string;
  authorName?: string;
  authorPhoto?: string | null;
  createdAt?: any;
  likes?: string[]; // uid array
  commentsCount?: number;
}

interface Props {
  post: Post;
}

const toDate = (value: any): Date => {
  if (!value) return new Date();
  if (typeof value.toDate === "function") return value.toDate();
  if (value.seconds) return new Date(value.seconds * 1000);
  return new Date(value);
};

const PostCard: React.FC<Props> = ({ post }) => {
  const [likes, setLikes] = useState<string[]>(post.likes ?? []);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    // subscribe to realtime updates for this post (likes, commentsCount, etc.)
    const postRef = doc(db, "posts", post.id);
    const unsub = onSnapshot(postRef, (snap) => {
      const data = snap.data() as any;
      const likeList: string[] = data?.likes ?? [];
      setLikes(likeList);
      setIsLiked(
        Boolean(auth.currentUser && likeList.includes(auth.currentUser.uid))
      );
    });
    return () => unsub();
  }, [post.id]);

  const toggleLike = async () => {
    if (!auth.currentUser) {
      alert("로그인이 필요합니다.");
      return;
    }

    const postRef = doc(db, "posts", post.id);
    try {
      if (isLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove(auth.currentUser.uid),
        });
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(auth.currentUser.uid),
        });
      }
    } catch (err) {
      console.error("좋아요 오류", err);
    }
  };

  const createdAtDate = toDate(post.createdAt);

  return (
    <Card className="p-4 mb-4">
      <div className="flex gap-3">
        <div>
          <Link to={`/user/${post.authorId}`}>
            <Avatar
              src={post.authorPhoto ?? null}
              name={post.authorName ?? "익명"}
            />
          </Link>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start gap-3">
            <div>
              <Link
                to={`/user/${post.authorId}`}
                className="font-semibold text-gray-800 hover:underline"
              >
                {post.authorName ?? "익명"}
              </Link>
              <div className="text-xs text-gray-400 mt-0.5">
                {formatDistanceToNow(createdAtDate, {
                  addSuffix: true,
                  locale: ko,
                })}
              </div>
            </div>

            <div className="text-right text-xs text-gray-400">
              <Link to={`/post/${post.id}`} className="hover:underline">
                상세보기
              </Link>
            </div>
          </div>

          <p className="mt-3 text-gray-700 whitespace-pre-wrap">
            {post.content}
          </p>

          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={toggleLike}
              className="flex items-center gap-2 text-sm focus:outline-none"
              aria-label="좋아요"
            >
              {isLiked ? (
                <AiFillHeart className="text-red-500 w-5 h-5" />
              ) : (
                <AiOutlineHeart className="w-5 h-5 text-gray-600" />
              )}
              <span className="text-gray-600">{likes.length}</span>
            </button>

            <Link
              to={`/post/${post.id}`}
              className="text-sm text-gray-600 hover:underline"
            >
              💬 {post.commentsCount ?? 0}
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PostCard;
