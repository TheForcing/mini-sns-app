// src/features/profile/ProfileHeader.tsx
import React from "react";

interface Props {
  name: string;
  bio?: string;
  coverUrl?: string;
  photoUrl?: string;
}

const ProfileHeader = ({
  name,
  bio,
  coverUrl = "https://picsum.photos/800/200",
  photoUrl = "https://i.pravatar.cc/100",
}: Props) => {
  return (
    <div className="bg-white shadow rounded-lg mb-4">
      <div className="relative">
        <img
          src={coverUrl}
          alt="cover"
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute -bottom-12 left-6">
          <img
            src={photoUrl}
            alt={name}
            className="w-24 h-24 rounded-full border-4 border-white object-cover"
          />
        </div>
      </div>
      <div className="pt-16 px-6 pb-6">
        <h1 className="text-xl font-bold">{name}</h1>
        {bio && <p className="text-gray-600 mt-1">{bio}</p>}
        <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
          프로필 편집
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;
