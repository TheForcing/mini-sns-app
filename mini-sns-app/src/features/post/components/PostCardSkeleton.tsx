import React from "react";

const PostCardSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        <div className="ml-3 flex-1">
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
          <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded w-16 mt-1"></div>
        </div>
      </div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
    </div>
  );
};

export default PostCardSkeleton;
