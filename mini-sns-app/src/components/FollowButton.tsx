import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { followUser, unfollowUser } from "../utils/follow";

interface FollowButtonProps {
  targetUserId: string;
}

const FollowButton = ({ targetUserId }: FollowButtonProps) => {
  const currentUserId = auth.currentUser?.uid;
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!currentUserId) return;
    const fetchFollowStatus = async () => {
      const userDoc = await getDoc(doc(db, "users", currentUserId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setIsFollowing(data.following?.includes(targetUserId));
      }
    };
    fetchFollowStatus();
  }, [currentUserId, targetUserId]);

  const handleFollow = async () => {
    if (!currentUserId) return;
    if (isFollowing) {
      await unfollowUser(currentUserId, targetUserId);
      setIsFollowing(false);
    } else {
      await followUser(currentUserId, targetUserId);
      setIsFollowing(true);
    }
  };

  if (currentUserId === targetUserId) return null; // 자기 자신은 팔로우 불가

  return (
    <button
      onClick={handleFollow}
      className={`px-4 py-2 rounded ${
        isFollowing ? "bg-gray-300" : "bg-blue-500 text-white"
      }`}
    >
      {isFollowing ? "언팔로우" : "팔로우"}
    </button>
  );
};

export default FollowButton;
