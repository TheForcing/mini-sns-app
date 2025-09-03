import { useState } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import CommentList from "../../comments/components/CommentList";

interface PostProps {
  id: string;
  authorName: string;
  authorPhoto: string;
  createdAt: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
}

const PostCard: React.FC<PostProps> = ({
  id,
  authorName,
  authorPhoto,
  createdAt,
  content,
  image,
  likes,
  comments,
  isLiked = false,
}) => {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    console.log("좋아요 토글:", id);
  };

  return (
    <div className="bg-white rounded-lg shadow mb-6 border">
      {/* 헤더 */}
      <div className="flex items-center gap-3 px-4 py-3">
        <img
          src={authorPhoto}
          alt={authorName}
          className="w-10 h-10 rounded-full object-cover border"
        />
        <div>
          <div className="font-semibold text-gray-800">{authorName}</div>
          <div className="text-xs text-gray-500">{createdAt}</div>
        </div>
      </div>

      {/* 본문 */}
      <div className="px-4 pb-3">
        <p className="text-gray-800 whitespace-pre-line mb-3">{content}</p>
        {image && (
          <img
            src={image}
            alt="post"
            className="w-full max-h-[400px] object-cover rounded-lg border"
          />
        )}
      </div>

      {/* 액션 버튼 */}
      <div className="flex items-center justify-between px-4 py-2 border-t">
        <button
          onClick={handleLike}
          className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition"
        >
          <Heart
            className={`w-5 h-5 ${liked ? "fill-red-500 text-red-500" : ""}`}
          />
          <span className="text-sm">{likeCount}</span>
        </button>
        <button className="flex items-center gap-1 text-gray-600 hover:text-blue-500 transition">
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm">{comments}</span>
        </button>
        <button className="flex items-center gap-1 text-gray-600 hover:text-green-500 transition">
          <Share2 className="w-5 h-5" />
          <span className="text-sm">공유</span>
        </button>
      </div>

      {/* 댓글 리스트 */}
      <div className="px-4 py-3 border-t">
        <CommentList />
      </div>
    </div>
  );
};

export default PostCard;
