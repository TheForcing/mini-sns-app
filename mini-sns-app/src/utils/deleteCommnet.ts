import { db } from "../firebase";
import { doc, deleteDoc } from "firebase/firestore";

export const deleteComment = async (
  postId: string,
  commentId: string,
  isAdmin: boolean
) => {
  if (!isAdmin) throw new Error("권한 없음");
  await deleteDoc(doc(db, "posts", postId, "comments", commentId));
};
