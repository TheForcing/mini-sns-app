// src/features/stories/StoriesBar.tsx
import React from "react";

const mockStories = [
  { id: 1, name: "홍길동", photo: "https://i.pravatar.cc/80?u=1" },
  { id: 2, name: "김영희", photo: "https://i.pravatar.cc/80?u=2" },
  { id: 3, name: "박철수", photo: "https://i.pravatar.cc/80?u=3" },
];

const StoriesBar = () => {
  return (
    <div className="flex gap-3 p-3 bg-white rounded-xl shadow mb-4 overflow-x-auto">
      {mockStories.map((story) => (
        <div
          key={story.id}
          className="flex flex-col items-center cursor-pointer"
        >
          <div className="w-16 h-16 rounded-full border-2 border-blue-500 overflow-hidden">
            <img
              src={story.photo}
              alt={story.name}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xs mt-1">{story.name}</span>
        </div>
      ))}
    </div>
  );
};

export default StoriesBar;
