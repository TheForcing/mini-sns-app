import { db } from "../../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

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
