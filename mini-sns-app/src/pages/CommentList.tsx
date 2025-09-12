import { useComments } from "../features/comments/hooks/useComments";
import { formatRelative } from "date-fns";
import { ko } from "date-fns/locale";
import CommentForm from "../features/comments/components/CommentForm";

interface Props {
  postId: string;
}

const CommentList = ({ postId }: Props) => {
  const { comments, loading } = useComments(postId);

  if (loading) {
    return <p className="text-gray-500 text-sm">💬 댓글 불러오는 중...</p>;
  }

  return (
    <div className="mt-4 space-y-4">
      {comments.length === 0 ? (
        <p className="text-gray-400 text-sm">
          아직 댓글이 없습니다. 첫 댓글을 남겨보세요!
        </p>
      ) : (
        comments.map((c) => (
          <div
            key={c.id}
            className="flex items-start gap-3 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition"
          >
            {/* 아바타 */}
            {c.authorPhoto ? (
              <img
                src={c.authorPhoto}
                alt="profile"
                className="w-8 h-8 rounded-full object-cover border"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold text-white">
                {c.authorName?.[0] || "?"}
              </div>
            )}

            {/* 내용 */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700">
                  {c.authorName}
                </span>
                <span className="text-xs text-gray-400">
                  {c.createdAt
                    ? formatRelative(c.createdAt.toDate(), new Date(), {
                        locale: ko,
                      })
                    : "방금 전"}
                </span>
              </div>
              <p className="text-gray-700 text-sm mt-1">{c.content}</p>
            </div>
            <CommentForm postId={postId} />
          </div>
        ))
      )}
    </div>
  );
};

export default CommentList;
