// src/features/post/components/PostCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Post } from "../types";

interface Props {
  post: Post;
}

const PostCard: React.FC<Props> = ({ post }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
      {/* 작성자 정보 */}
      <div className="flex items-center px-4 py-3">
        <img
          src={post.authorPhoto || "https://i.pravatar.cc/40"}
          alt={post.authorName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="ml-3">
          <div className="font-semibold text-gray-800">{post.authorName}</div>
          <div className="text-xs text-gray-500">
            {post.createdAt?.toDate
              ? post.createdAt.toDate().toLocaleString()
              : "방금 전"}
          </div>
        </div>
      </div>

      {/* 본문 */}
      <div className="px-4 pb-3">
        <p className="text-gray-800 text-sm whitespace-pre-line">
          {post.content}
        </p>

        {/* 첨부 이미지 */}
        {(post.attachments?.length ?? 0) > 0 && (
          <div className="mt-3">
            {post.attachments?.map((att, idx) => (
              <img
                key={idx}
                src={att.url}
                alt={att.name}
                className="rounded-md w-full max-h-[500px] object-cover"
              />
            ))}
          </div>
        )}
      </div>

      {/* 액션 버튼 */}
      <div className="border-t border-gray-100 px-4 py-2 flex justify-between text-gray-600 text-sm">
        <button className="flex-1 py-2 hover:bg-gray-100 rounded-md">
          👍 좋아요 {post.likes?.length || 0}
        </button>
        <Link
          to={`/post/${post.id}`}
          className="flex-1 py-2 text-center hover:bg-gray-100 rounded-md"
        >
          💬 댓글 {post.commentsCount || 0}
        </Link>
      </div>
    </div>
  );
};

export default PostCard;
