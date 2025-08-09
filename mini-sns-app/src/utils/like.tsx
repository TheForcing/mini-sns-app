import { doc, runTransaction, increment } from "firebase/firestore";
import { db } from "../firebase";

export const toggleLike = async (postId: string, uid: string) => {
  const postRef = doc(db, "posts", postId);
  const likeRef = doc(db, "posts", postId, "likes", uid);

  return runTransaction(db, async (t) => {
    const likeSnap = await t.get(likeRef);
    if (likeSnap.exists()) {
      // 이미 좋아요 -> 삭제
      t.delete(likeRef);
      t.update(postRef, { likesCount: increment(-1) });
      return { liked: false };
    } else {
      // 좋아요 추가
      t.set(likeRef, { createdAt: new Date() });
      t.update(postRef, { likesCount: increment(1) });
      return { liked: true };
    }
  });
};
