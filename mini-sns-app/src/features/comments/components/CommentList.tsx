import { useComments } from "../hooks/useComments";

interface Props {
  postId: string;
}

const CommentList = ({ postId }: Props) => {
  const { comments, loading } = useComments(postId);

  if (loading) return <p>댓글 불러오는 중...</p>;

  return (
    <div className="mt-4 space-y-3">
      {comments.length === 0 ? (
        <p className="text-gray-500">댓글이 없습니다.</p>
      ) : (
        comments.map((c) => (
          <div key={c.id} className="border-b pb-2">
            <p className="text-sm font-semibold">{c.authorName}</p>
            <p>{c.content}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default CommentList;
