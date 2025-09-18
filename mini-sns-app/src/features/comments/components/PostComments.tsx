import React from "react";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";
import Card from "../../../components/ui/Card";

interface Props {
  postId: string;
}

const PostComments: React.FC<Props> = ({ postId }) => {
  return (
    <Card className="p-4 mt-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">💬 댓글</h3>
      <CommentList postId={postId} />
      <CommentForm postId={postId} />
    </Card>
  );
};

export default PostComments;
