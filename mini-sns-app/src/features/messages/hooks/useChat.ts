// useChat.ts
import { useEffect, useState, useRef } from "react";
import {
  subscribeMessages,
  sendMessage,
  markMessagesRead,
  getOrCreateChatBetween,
} from "../services/chatService";
import { auth } from "../../../firebase";

export function useChat(chatId?: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const unsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!chatId) return;
    unsubRef.current = subscribeMessages(chatId, (items) => {
      setMessages(items);
    });
    return () => {
      unsubRef.current?.();
      unsubRef.current = null;
    };
  }, [chatId]);

  const send = async (text: string) => {
    if (!chatId) throw new Error("chatId 필요");
    return sendMessage(chatId, text);
  };

  const markRead = async () => {
    const unread = messages.filter(
      (m) => !m.readBy?.includes(auth.currentUser?.uid)
    );
    if (!unread.length) return;
    await markMessagesRead(
      chatId!,
      unread.map((m) => m.id)
    );
  };

  return { messages, send, markRead };
}

/** helper: 1:1 채팅방 얻기 */
export async function openOrCreateDM(otherUid: string) {
  const me = auth.currentUser;
  if (!me) throw new Error("로그인 필요");
  return getOrCreateChatBetween(me.uid, otherUid);
}
