import { db } from "../../../firebase";
import { doc, deleteDoc } from "firebase/firestore";

export const deletePost = async (postId: string, isAdmin: boolean) => {
  if (!isAdmin) throw new Error("권한 없음");
  await deleteDoc(doc(db, "posts", postId));
};
