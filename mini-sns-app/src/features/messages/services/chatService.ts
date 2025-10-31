// chatService.ts
import { db, auth } from "../../../firebase";
import {
  collection,
  addDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
  setDoc,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";

/** 채팅방을 찾거나 새로 만들기(1:1) */
export async function getOrCreateChatBetween(uidA: string, uidB: string) {
  const chatsRef = collection(db, "chats");
  // 단순한 방법: participants 배열으로 존재여부 확인
  const q = query(chatsRef, where("participants", "array-contains", uidA));
  const snap = await getDocs(q);
  for (const d of snap.docs) {
    const data = d.data() as any;
    if (Array.isArray(data.participants) && data.participants.includes(uidB)) {
      return { id: d.id, ...data };
    }
  }
  // 없으면 생성
  const ref = await addDoc(chatsRef, {
    participants: [uidA, uidB],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastMessage: null,
  });
  return { id: ref.id };
}

/** 메시지 전송 */
export async function sendMessage(chatId: string, text: string) {
  const user = auth.currentUser;
  if (!user) throw new Error("로그인 필요");
  const msgRef = await addDoc(collection(db, "chats", chatId, "messages"), {
    text,
    senderId: user.uid,
    createdAt: serverTimestamp(),
    readBy: [user.uid], // 보낸 사람은 읽음으로 처리
  });
  // 업데이트 lastMessage & updatedAt
  await updateDoc(doc(db, "chats", chatId), {
    lastMessage: { text, senderId: user.uid, createdAt: serverTimestamp() },
    updatedAt: serverTimestamp(),
  });
  return msgRef.id;
}

/** 메시지 리스너(실시간) */
export function subscribeMessages(
  chatId: string,
  handleUpdate: (docs: any[]) => void
) {
  const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    handleUpdate(items);
  });
}

/** 채팅 목록(참여중인 채팅) 실시간 */
export function subscribeChatList(
  uid: string,
  handleUpdate: (chats: any[]) => void
) {
  const q = query(
    collection(db, "chats"),
    where("participants", "array-contains", uid),
    orderBy("updatedAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    handleUpdate(items);
  });
}

/** 읽음 처리: 현재 유저 id를 readBy에 추가 */
export async function markMessagesRead(chatId: string, messageIds: string[]) {
  const user = auth.currentUser;
  if (!user) return;
  for (const mid of messageIds) {
    const mRef = doc(db, "chats", chatId, "messages", mid);
    await updateDoc(mRef, { readBy: arrayUnion(user.uid) });
  }
}
