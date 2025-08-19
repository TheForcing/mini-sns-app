import {
  addDoc,
  collection,
  serverTimestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../firebase";

export async function addComment(postId: string, content: string) {
  const user = auth.currentUser;
  if (!user) throw new Error("로그인 필요");

  return addDoc(collection(db, "posts", postId, "comments"), {
    content,
    createdAt: serverTimestamp(),
    author: {
      uid: user.uid,
      displayName: user.displayName || "익명",
      photoURL: user.photoURL || "",
    },
  });
}

export async function deleteComment(postId: string, commentId: string) {
  return deleteDoc(doc(db, "posts", postId, "comments", commentId));
}
