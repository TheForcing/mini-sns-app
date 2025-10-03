import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateComment from "../../comments/components/CreateComment";

const PostCard = ({ post }: { post: any }) => {
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);

  const handleCardClick = () => {
    navigate(`/post/${post.id}`);
  };

  const toggleComments = (e: React.MouseEvent) => {
    e.stopPropagation(); // ✅ 카드 클릭 이벤트 막기
    setShowComments((prev) => !prev);
  };

  return (
    <div
      className="bg-white rounded-xl shadow p-4 mb-4 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* 게시글 본문 */}
      <p className="text-gray-800 mb-3">{post.content}</p>

      {/* 액션 버튼 */}
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <button
          onClick={toggleComments}
          className="hover:text-blue-500 transition"
        >
          💬 댓글 {post.commentsCount || 0}
        </button>
        <button className="hover:text-red-500 transition">❤️ 좋아요</button>
      </div>

      {/* 댓글 입력창 (토글) */}
      {showComments && (
        <div className="mt-3">
          <CreateComment postId={post.id} />
        </div>
      )}
    </div>
  );
};

export default PostCard;
