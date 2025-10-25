// src/features/messages/services/messageService.ts
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../../firebase";
import { Message } from "../types";

export async function getMessages(userId: string): Promise<Message[]> {
  if (!userId) return [];
  try {
    const col = collection(db, "messages");
    const q = query(
      col,
      where("receiverId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as any),
    })) as Message[];
  } catch (err) {
    console.error("getMessages error:", err);
    return [];
  }
}
