import { usePost } from "../hooks/usePost";

interface Props {
  postId: string;
}

const PostDetail = ({ postId }: Props) => {
  const { post, loading } = usePost(postId);

  if (loading) return <p>로딩중...</p>;
  if (!post) return <p>게시글을 찾을 수 없습니다.</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-2">{post.authorName}</h2>
      <p className="text-gray-700 mb-4">{post.content}</p>
      <div className="flex justify-between text-sm text-gray-500">
        <span>{new Date(post.createdAt?.seconds * 1000).toLocaleString()}</span>
        <span>
          ❤️ {post.likes} · 💬 {post.commentsCount}
        </span>
      </div>
      {post.hashtags?.length > 0 && (
        <div className="mt-3">
          {post.hashtags.map((tag: string, idx: number) => (
            <span key={idx} className="text-blue-500 mr-2">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostDetail;
