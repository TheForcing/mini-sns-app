import { useState } from "react";

interface CommentCardProps {
  id: string;
  authorName: string;
  authorPhoto: string;
  content: string;
  createdAt: string;
  likes: number;
  isAuthor?: boolean;
  onLike?: (id: string) => void;
  onReply?: (id: string, text: string) => void;
  onDelete?: (id: string) => void;
  replies?: Array<{
    id: string;
    authorName: string;
    authorPhoto: string;
    content: string;
    createdAt: string;
  }>;
}

const CommentCard = ({
  id,
  authorName,
  authorPhoto,
  content,
  createdAt,
  likes,
  isAuthor,
  onLike,
  onReply,
  onDelete,
  replies = [],
}: CommentCardProps) => {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");

  return (
    <div className="flex gap-3 bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition">
      {/* 프로필 이미지 */}
      <img
        src={authorPhoto}
        alt="profile"
        className="w-10 h-10 rounded-full object-cover border"
      />

      <div className="flex-1">
        {/* 작성자 + 시간 */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-800">{authorName}</span>
          {isAuthor && (
            <span className="bg-yellow-200 text-yellow-700 text-xs px-2 py-0.5 rounded">
              작성자
            </span>
          )}
          <span className="text-xs text-gray-400">{createdAt}</span>
        </div>

        {/* 본문 */}
        <p className="text-gray-700 mt-1">{content}</p>

        {/* 액션 버튼 */}
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
          <button
            onClick={() => onLike && onLike(id)}
            className="flex items-center gap-1 hover:text-pink-500 transition transform active:scale-110"
          >
            ❤️ <span>{likes}</span>
          </button>
          <button
            onClick={() => setReplyOpen(!replyOpen)}
            className="hover:text-blue-500 transition"
          >
            💬 답글
          </button>
          {onDelete && (
            <button
              onClick={() => onDelete(id)}
              className="hover:text-red-500 transition"
            >
              🗑 삭제
            </button>
          )}
        </div>

        {/* 답글 입력창 */}
        {replyOpen && (
          <div className="flex items-center gap-2 mt-3">
            <input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="답글 달기..."
              className="flex-1 border rounded-lg px-3 py-1 text-sm outline-none focus:ring focus:ring-blue-200"
            />
            <button
              onClick={() => {
                if (onReply && replyText.trim()) {
                  onReply(id, replyText);
                  setReplyText("");
                }
              }}
              className="text-blue-500 font-semibold hover:text-blue-600 transition"
            >
              게시
            </button>
          </div>
        )}

        {/* 대댓글 */}
        {replies.length > 0 && (
          <div className="ml-12 mt-3 border-l-2 border-gray-100 pl-4 space-y-2">
            {replies.map((reply) => (
              <div
                key={reply.id}
                className="flex gap-2 bg-gray-50 rounded-lg p-2"
              >
                <img
                  src={reply.authorPhoto}
                  alt="reply-profile"
                  className="w-6 h-6 rounded-full"
                />
                <div>
                  <span className="font-medium text-gray-700 text-sm">
                    {reply.authorName}
                  </span>
                  <span className="ml-2 text-xs text-gray-400">
                    {reply.createdAt}
                  </span>
                  <p className="text-gray-600 text-sm">{reply.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
