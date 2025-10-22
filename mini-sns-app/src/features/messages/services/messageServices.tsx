import { db } from "../../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { Message } from "../types";

export const sendMessage = async (
  senderId: string,
  receiverId: string,
  content: string
) => {
  await addDoc(collection(db, "messages"), {
    senderId,
    receiverId,
    content,
    createdAt: new Date(),
    read: false,
  });
};

export const fetchMessages = async (userId: string) => {
  const q = query(
    collection(db, "messages"),
    where("receiverId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
export async function getMessages(userId: string): Promise<Message[]> {
  if (!userId) return [];

  try {
    const messagesRef = collection(db, "messages");
    const q = query(
      messagesRef,
      where("receiverId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    const messages: Message[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Message, "id">),
    }));

    return messages;
  } catch (err) {
    console.error("메시지 불러오기 실패:", err);
    return [];
  }
}
