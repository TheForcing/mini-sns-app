// src/features/home/pages/Home.tsx
import React from "react";
import CreatePostWithUpload from "../pages/CreatePostWithUpload";
import PostLists from "../features/post/components/PostLists";
import StoriesBar from "../features/stories/StoriesBar";
import ReactionBar from "../features/reactions/ReactionBar";

const Home: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 글쓰기 */}
      <CreatePostWithUpload />

      {/* 피드 목록 */}
      <StoriesBar />
      <ReactionBar />
      <PostLists />
    </div>
  );
};

export default Home;
