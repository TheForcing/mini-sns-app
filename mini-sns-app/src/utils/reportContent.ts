import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export const reportContent = async (
  reporterId: string,
  targetType: "post" | "comment",
  targetId: string,
  reason: string,
  postId?: string
) => {
  await addDoc(collection(db, "reports"), {
    reporterId,
    targetType,
    targetId,
    reason,
    postId: postId || null,
    status: "pending",
    createdAt: serverTimestamp(),
  });
};
