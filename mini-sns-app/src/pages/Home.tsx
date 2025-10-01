// src/features/home/pages/Home.tsx
import React from "react";
import CreatePostWithUpload from "../pages/CreatePostWithUpload";
import PostLists from "../features/post/components/PostLists";

const Home: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 글쓰기 */}
      <CreatePostWithUpload />

      {/* 피드 목록 */}
      <PostLists />
    </div>
  );
};

export default Home;
