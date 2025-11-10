// src/features/messages/hooks/useChat.ts
import { useEffect, useRef, useState, useCallback } from "react";
import { auth } from "../../../firebase";
import {
  listenMessages,
  sendMessage,
  markMessagesRead,
  setTyping,
  getOrCreateChatBetween,
} from "../services/messageServices";

export type MessageItem = {
  id?: string;
  text: string;
  senderId: string;
  createdAt?: any;
  readBy?: string[];
  attachments?: any[];
  filtered?: boolean;
};

export function useChat(
  initialChatId?: string | null,
  otherUid?: string | null
) {
  const [chatId, setChatId] = useState<string | null>(initialChatId ?? null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const unsubRef = useRef<(() => void) | null>(null);
  const typingTimerRef = useRef<number | null>(null);

  // 채팅 id가 없고 otherUid가 주어지면(1:1) 채팅 생성/조회
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!chatId && otherUid) {
        try {
          const me = auth.currentUser;
          if (!me) return;
          const chat = await getOrCreateChatBetween(me.uid, otherUid);
          if (!mounted) return;
          setChatId(chat.id);
        } catch (e) {
          console.error("getOrCreateChatBetween failed", e);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [chatId, otherUid]);

  // 구독 관리
  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    // subscribe to messages
    unsubRef.current = listenMessages(chatId, (msgs) => {
      setMessages(msgs);
      setLoading(false);

      // 자동 읽음 처리: 들어온 메시지 중 내가 읽지 않은 것들 마크
      try {
        const me = auth.currentUser;
        if (me) {
          const unreadIds = msgs
            .filter((m) => !m.readBy || !m.readBy.includes(me.uid))
            .map((m) => m.id)
            .filter(Boolean) as string[];

          if (unreadIds.length > 0) {
            markMessagesRead(chatId, unreadIds).catch((err) =>
              console.warn("markMessagesRead failed:", err)
            );
          }
        }
      } catch (err) {
        console.warn("auto mark read failed", err);
      }
    });

    return () => {
      // unsubscribe
      unsubRef.current?.();
      unsubRef.current = null;
      // typing 해제
      setTyping(null, false).catch(() => {});
    };
  }, [chatId]);

  // send: 메시지 전송 (text + optional attachments)
  const send = useCallback(
    async (text: string, attachments: any[] = []) => {
      if (!chatId) throw new Error("chatId is required to send message");
      if (!text && (!attachments || attachments.length === 0)) return;
      try {
        await sendMessage(chatId, text, attachments);
      } catch (err) {
        console.error("sendMessage failed", err);
        throw err;
      }
    },
    [chatId]
  );

  // markRead: 현재 보인 메시지들 모두 읽음 처리 (UI에서 수동 호출 가능)
  const markRead = useCallback(async () => {
    if (!chatId) return;
    try {
      const me = auth.currentUser;
      if (!me) return;
      const unreadIds = messages
        .filter((m) => !m.readBy || !m.readBy.includes(me.uid))
        .map((m) => m.id)
        .filter(Boolean) as string[];
      if (unreadIds.length > 0) {
        await markMessagesRead(chatId, unreadIds);
      }
    } catch (err) {
      console.warn("markRead failed", err);
    }
  }, [chatId, messages]);

  // sendTyping: typing 상태 전송 (간단한 디바운스 포함)
  const sendTyping = useCallback(
    (isTyping: boolean) => {
      if (!chatId) return;
      // setTyping expects chatId or null
      setTyping(isTyping ? chatId : null, isTyping).catch((e) =>
        console.warn("setTyping failed", e)
      );

      // 자동으로 typing=false 전송 (예: 2.5s after last keystroke)
      if (typingTimerRef.current) {
        window.clearTimeout(typingTimerRef.current);
        typingTimerRef.current = null;
      }
      if (isTyping) {
        typingTimerRef.current = window.setTimeout(() => {
          setTyping(null, false).catch(() => {});
          typingTimerRef.current = null;
        }, 2500);
      }
    },
    [chatId]
  );

  // 채팅 id를 외부에서 바꿀 수 있게 함
  const setChat = useCallback((id: string | null) => setChatId(id), []);

  return {
    chatId,
    setChat,
    messages,
    loading,
    send,
    markRead,
    sendTyping,
  };
}

export default useChat;
