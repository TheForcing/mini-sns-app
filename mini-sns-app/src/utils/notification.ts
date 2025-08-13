import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

type NotificationType = "like" | "comment";

export const sendNotification = async ({
  recipientId,
  senderId,
  type,
  postId,
}: {
  recipientId: string;
  senderId: string;
  type: NotificationType;
  postId: string;
}) => {
  if (recipientId === senderId) return; // 자기 자신에게는 알림 안보냄

  try {
    await addDoc(collection(db, "notifications"), {
      recipientId,
      senderId,
      type,
      postId,
      createdAt: serverTimestamp(),
      read: false,
    });
  } catch (error) {
    console.error("알림 전송 실패:", error);
  }
};
