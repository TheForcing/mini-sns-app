import { doc, getDoc, updateDoc, setDoc, increment } from "firebase/firestore";
import { db } from "../firebase";

export async function toggleLike(
  postId: string,
  userId: string
): Promise<{ liked: boolean }> {
  const likeRef = doc(db, "posts", postId, "likes", userId);
  const postRef = doc(db, "posts", postId);
  const snap = await getDoc(likeRef);

  if (snap.exists()) {
    // Unlike
    await updateDoc(postRef, { likesCount: increment(-1) });
    await setDoc(likeRef, {}, { merge: false });
    await updateDoc(likeRef, { deleted: true });
    return { liked: false };
  } else {
    // Like
    await setDoc(likeRef, { createdAt: Date.now() });
    await updateDoc(postRef, { likesCount: increment(1) });
    return { liked: true };
  }
}
