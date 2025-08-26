import { Link } from "react-router-dom";

interface PostCardProps {
  id: string;
  content: string;
  authorName: string;
  createdAt: string;
  likes: number;
  comments: number;
}

const PostCard = ({
  id,
  content,
  authorName,
  createdAt,
  likes,
  comments,
}: PostCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-2">
        <Link
          to={`/profile/${authorName}`}
          className="font-semibold text-blue-600"
        >
          {authorName}
        </Link>
        <span className="text-sm text-gray-400">{createdAt}</span>
      </div>
      <p className="text-gray-800 mb-3">{content}</p>
      <div className="flex space-x-4 text-sm text-gray-500">
        <span>👍 {likes}</span>
        <span>💬 {comments}</span>
      </div>
    </div>
  );
};

export default PostCard;
