import {
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  collection,
  writeBatch,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase";

export async function deletePostClientSide(postId: string) {
  const postRef = doc(db, "posts", postId);
  const postSnap = await getDoc(postRef);
  if (!postSnap.exists()) return;

  const postData: any = postSnap.data();

  // 이미지 삭제
  if (postData.imagePath) {
    await deleteObject(ref(storage, postData.imagePath)).catch(() => {});
  }

  // subcollections 삭제 (간단 예: comments, likes)
  const batch = writeBatch(db);

  const commentsSnap = await getDocs(
    collection(db, "posts", postId, "comments")
  );
  commentsSnap.forEach((d) =>
    batch.delete(doc(db, "posts", postId, "comments", d.id))
  );

  const likesSnap = await getDocs(collection(db, "posts", postId, "likes"));
  likesSnap.forEach((d) =>
    batch.delete(doc(db, "posts", postId, "likes", d.id))
  );

  batch.delete(postRef);
  await batch.commit(); // batch는 최대 500 ops 제한 주의
}
