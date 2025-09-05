import { useEffect, useState } from "react";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { FaHeart, FaRegHeart } from "react-icons/fa";

interface LikeButtonProps {
  postId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ postId }) => {
  const user = auth.currentUser;
  const [likes, setLikes] = useState<string[]>([]);
  const [isLiked, setIsLiked] = useState(false);

  // Firestore 실시간 구독
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "posts", postId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const likeList = data.likes || [];
        setLikes(likeList);
        setIsLiked(user ? likeList.includes(user.uid) : false);
      }
    });
    return () => unsub();
  }, [postId, user]);

  const toggleLike = async () => {
    if (!user) return alert("로그인이 필요합니다.");
    const postRef = doc(db, "posts", postId);

    if (isLiked) {
      await updateDoc(postRef, {
        likes: arrayRemove(user.uid),
      });
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(user.uid),
      });
    }
  };

  return (
    <button
      onClick={toggleLike}
      className="flex items-center gap-1 focus:outline-none group"
    >
      {isLiked ? (
        <FaHeart className="w-6 h-6 text-red-500 transition-transform duration-200 group-hover:scale-110" />
      ) : (
        <FaRegHeart className="w-6 h-6 text-gray-500 transition-colors duration-200 group-hover:text-red-500 group-hover:scale-110" />
      )}
      <span className="text-sm text-gray-600 group-hover:text-red-500 transition-colors">
        {likes.length}
      </span>
    </button>
  );
};

export default LikeButton;
