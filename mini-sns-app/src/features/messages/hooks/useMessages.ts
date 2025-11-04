// src/features/messages/hooks/useMessages.ts
import { useEffect, useState, useRef } from "react";
import {
  listenMessages,
  markMessagesRead,
  setTyping,
} from "../services/messageServices";
import { auth } from "../../../firebase";

export function useMessages(chatId?: string) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const unsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!chatId) return;
    setLoading(true);
    unsubRef.current = listenMessages(chatId, (items) => {
      setMessages(items);
      setLoading(false);
      // 자동 읽음 처리 (예: 들어온 메시지 중 내가 안 읽은 것을 mark)
      const unread = items.filter(
        (m) => !m.readBy?.includes(auth.currentUser?.uid)
      );
      if (unread.length) {
        const ids = unread.map((u) => u.id);
        markMessagesRead(chatId, ids).catch((e) =>
          console.warn("mark read failed:", e)
        );
      }
    });
    return () => {
      unsubRef.current?.();
      unsubRef.current = null;
      // typing 해제
      setTyping(null, false).catch(() => {});
    };
  }, [chatId]);

  const sendTyping = (isTyping: boolean) => {
    if (!chatId) return;
    setTyping(isTyping ? chatId : null, isTyping).catch(() => {});
  };

  return { messages, loading, sendTyping };
}
