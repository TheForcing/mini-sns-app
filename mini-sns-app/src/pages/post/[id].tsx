import { useRouter } from "next/router";
import PostDetail from "../../features/post/components/PostDetail";
import CommentList from "../../features/comments/components/CommentList";
import CommentForm from "../../features/comments/components/CommentForm";

const PostPage = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id || typeof id !== "string") return <p>잘못된 접근입니다.</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <PostDetail postId={id} />
      <CommentForm postId={id} />
      <CommentList postId={id} />
    </div>
  );
};

export default PostPage;
