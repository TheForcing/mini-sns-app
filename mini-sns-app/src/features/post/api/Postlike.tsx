import { doc, runTransaction, increment } from "firebase/firestore";
import { db } from "../../../firebase";

export async function toggleLike(postId: string, uid: string) {
  const postRef = doc(db, "posts", postId);
  const likeRef = doc(db, "posts", postId, "likes", uid);

  return runTransaction(db, async (t) => {
    const likeSnap = await t.get(likeRef);
    if (likeSnap.exists()) {
      t.delete(likeRef);
      t.update(postRef, { likesCount: increment(-1) });
      return { liked: false };
    } else {
      t.set(likeRef, { createdAt: new Date() });
      t.update(postRef, { likesCount: increment(1) });
      return { liked: true };
    }
  });
}
