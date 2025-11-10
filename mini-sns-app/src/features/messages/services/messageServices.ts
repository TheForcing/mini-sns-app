// src/features/messages/services/messageService.ts
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
  setDoc,
  DocumentData,
  limit,
} from "firebase/firestore";
import { db, auth } from "../../../firebase";

/**
 * 타입
 */
export type Chat = {
  id?: string;
  participants: string[]; // uid 배열
  lastMessage?: { text: string; senderId: string; createdAt: any } | null;
  updatedAt?: any;
  createdAt?: any;
};

export type Message = {
  id?: string;
  text: string;
  senderId: string;
  createdAt?: any;
  readBy?: string[]; // uid 배열
  attachments?: any[]; // 필요시 확장
  filtered?: boolean;
};

/** -----------------------------
 *  1) 1:1 채팅방 조회 또는 생성
 *  - participants는 uid 배열(1:1이면 길이 2)
 *  - 기존 채팅이 있으면 반환, 없으면 새로 만듦
 * ----------------------------- */
export async function getOrCreateChatBetween(
  uidA: string,
  uidB: string
): Promise<Chat & { id: string }> {
  // 먼저 참가자에 uidA가 포함된 채팅들에서 uidB도 포함된 것을 찾음
  const chatsRef = collection(db, "chats");
  const q = query(
    chatsRef,
    where("participants", "array-contains", uidA),
    limit(50)
  );
  const snap = await getDocs(q);
  for (const d of snap.docs) {
    const data = d.data() as DocumentData;
    const participants: string[] = data.participants ?? [];
    if (participants.includes(uidB) && participants.length === 2) {
      return { id: d.id, ...data } as Chat & { id: string };
    }
  }

  // 찾지 못하면 새로 생성
  const created = await addDoc(chatsRef, {
    participants: [uidA, uidB],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastMessage: null,
  });
  return { id: created.id, participants: [uidA, uidB] };
}

/** -----------------------------
 *  2) 메시지 전송
 *  - messages 서브컬렉션에 문서 추가
 *  - chats/{chatId} 문서의 lastMessage, updatedAt 업데이트
 * ----------------------------- */
export async function sendMessage(
  chatId: string,
  text: string,
  attachments: any[] = []
) {
  const user = auth.currentUser;
  if (!user) throw new Error("로그인이 필요합니다.");

  const messagesCol = collection(db, "chats", chatId, "messages");
  const msgRef = await addDoc(messagesCol, {
    text,
    senderId: user.uid,
    createdAt: serverTimestamp(),
    readBy: [user.uid], // 보낸 사람은 읽음 처리
    attachments: attachments || [],
    filtered: false,
  });

  // lastMessage 업데이트
  await updateDoc(doc(db, "chats", chatId), {
    lastMessage: { text, senderId: user.uid, createdAt: serverTimestamp() },
    updatedAt: serverTimestamp(),
  });

  return msgRef.id;
}

/** -----------------------------
 *  3) 실시간 메시지 구독 (onSnapshot)
 *  - callback receives Message[]
 * ----------------------------- */
export function listenMessages(
  chatId: string,
  callback: (msgs: Message[]) => void
) {
  const q = query(
    collection(db, "chats", chatId, "messages"),
    orderBy("createdAt", "asc")
  );
  const unsub = onSnapshot(q, (snap) => {
    const items: Message[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as any),
    }));
    callback(items);
  });
  return unsub;
}

/** -----------------------------
 *  4) 채팅 목록(참여 중인 채팅) 구독
 *  - callback receives Chat[]
 * ----------------------------- */
export function listenChatList(
  uid: string,
  callback: (chats: (Chat & { id: string })[]) => void
) {
  const q = query(
    collection(db, "chats"),
    where("participants", "array-contains", uid),
    orderBy("updatedAt", "desc")
  );
  const unsub = onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as any),
    })) as (Chat & { id: string })[];
    callback(items);
  });
  return unsub;
}

/** -----------------------------
 *  5) 읽음 처리 (message doc의 readBy에 uid 추가)
 *  - messageIds 배열(일괄 처리)
 * ----------------------------- */
export async function markMessagesRead(chatId: string, messageIds: string[]) {
  const user = auth.currentUser;
  if (!user) return;
  const uid = user.uid;
  for (const mid of messageIds) {
    const mRef = doc(db, "chats", chatId, "messages", mid);
    // 읽음 추가 (중복 방지 위해 arrayUnion 사용)
    await updateDoc(mRef, { readBy: arrayUnion(uid) });
  }
}

/** -----------------------------
 *  6) typing 표시 (presence)
 *  - simple approach: presence/{uid} 문서에 typingIn 필드 설정
 * ----------------------------- */
export async function setTyping(chatId: string | null, typing = true) {
  const user = auth.currentUser;
  if (!user) return;
  const ref = doc(db, "presence", user.uid);
  if (typing && chatId) {
    await setDoc(
      ref,
      { typingIn: chatId, updatedAt: serverTimestamp() },
      { merge: true }
    );
  } else {
    await updateDoc(ref, {
      typingIn: null,
      updatedAt: serverTimestamp(),
    }).catch(async () => {
      // 문서가 없으면 set
      await setDoc(ref, { typingIn: null, updatedAt: serverTimestamp() });
    });
  }
}

/** -----------------------------
 *  7) 메시지 삭제(관리자 또는 작성자)
export async function deleteMessage(chatId: string, messageId: string) {
  await deleteDoc(doc(db, "chats", chatId, "messages", messageId));
}
}

/** -----------------------------
 *  8) helper: get participants' profiles (optional)
 * ----------------------------- */
export async function getProfilesForParticipants(uids: string[]) {
  const users: any[] = [];
  for (const uid of uids) {
    const snap = await getDoc(doc(db, "users", uid));
    if (snap.exists()) users.push({ uid, ...(snap.data() as any) });
  }
  return users;
}
