import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export const addReply = async (
  postId: string,
  commentId: string,
  authorId: string,
  content: string
) => {
  await addDoc(
    collection(db, "posts", postId, "comments", commentId, "replies"),
    {
      content,
      authorId,
      createdAt: serverTimestamp(),
    }
  );
};
