// src/features/messages/components/ChatWindow.tsx
import React, { useEffect, useRef, useState, FormEvent } from "react";
import useChat from "../hooks/useChat";
import { format } from "date-fns";
import { auth, db } from "../../../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";

/**
 * Props:
 *  - chatId: 기존 채팅 ID (있으면 바로 사용)
 *  - otherUid?: 1:1 채팅 상대 UID (chatId 없을 때 자동 채팅 생성에 사용)
 *  - otherName?: optional, 헤더에 표시용
 */
const ChatWindow: React.FC<{
  chatId?: string | null;
  otherUid?: string | null;
  otherName?: string;
  otherPhoto?: string;
}> = ({ chatId: initialChatId = null, otherUid, otherName }) => {
  const { chatId, setChat, messages, send, markRead, sendTyping, loading } =
    useChat(initialChatId ?? null, otherUid ?? null);

  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  // 자동 포커스
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // chatId 변경 반영
  useEffect(() => {
    if (initialChatId) setChat(initialChatId);
  }, [initialChatId, setChat]);

  // 새 메시지 수신 시 맨 아래로 스크롤
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  // 입장 시 읽음 처리
  useEffect(() => {
    if (!chatId) return;
    // markRead will handle if there are unread messages
    markRead().catch((e) => console.warn("markRead fail:", e));
  }, [chatId, markRead]);

  // typing indicator 구독: presence 컬렉션에서 typingIn == chatId 인 문서가 있으면 상대가 입력중
  useEffect(() => {
    if (!chatId) {
      setOtherTyping(false);
      return;
    }
    const q = query(
      collection(db, "presence"),
      where("typingIn", "==", chatId)
    );
    let unsub: Unsubscribe | null = null;
    unsub = onSnapshot(
      q,
      (snap) => {
        const meUid = auth.currentUser?.uid;
        // 상대가 typing중인 문서가 있고, 그 문서의 uid가 나와 다르면 상대가 입력중
        const someoneTyping = snap.docs.some((d) => d.id !== meUid);
        setOtherTyping(someoneTyping);
      },
      (err) => {
        console.warn("typing listener error", err);
        setOtherTyping(false);
      }
    );
    return () => {
      unsub && unsub();
      setOtherTyping(false);
    };
  }, [chatId]);

  // 자동 높이 조절 (textarea)
  const adjustTextareaHeight = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "0px";
    // maxHeight optional
    const newHeight = Math.min(ta.scrollHeight, 240); // 최대 높이 240px
    ta.style.height = `${newHeight}px`;
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [text]);

  // 입력 변경 -> typing 이벤트 전송 (debounce 내부 처리 담당 useChat의 sendTyping 사용)
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    sendTyping(true); // useChat 내부에 디바운스/타이머가 있음
  };

  // 전송 (Enter, 버튼)
  const handleSend = async (e?: FormEvent) => {
    e?.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    if (!chatId) {
      // chatId가 아직 준비 안되었으면 대기 (useChat에서 getOrCreate 처리)
      // 하지만 useChat은 otherUid로 채팅 생성하므로 chatId가 준비될 때까지 잠시 대기할 수 있음
      if (!initialChatId && !otherUid) {
        alert("채팅을 시작할 수 없습니다 (chatId 또는 otherUid 필요).");
        return;
      }
    }

    setSending(true);
    try {
      // send 함수가 chatId 존재 여부를 확인함
      await send(trimmed);
      setText("");
      // 전송 후 typing 해제
      sendTyping(false);
      // 자동 스크롤은 messages effect가 담당
    } catch (err: any) {
      console.error("메시지 전송 실패:", err);
      alert("메시지 전송에 실패했습니다. 다시 시도하세요.");
    } finally {
      setSending(false);
    }
  };

  // 키보드 핸들러: Enter -> 전송, Shift+Enter -> 줄바꿈
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // submit
      void handleSend();
    }
    // typing 이벤트는 onChange에서 이미 전송
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-2 border-b dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600">
            {otherName?.[0] ?? "U"}
          </div>
          <div>
            <div className="font-medium text-sm">
              {otherName ?? "대화 상대"}
            </div>
            <div className="text-xs text-gray-500">
              {otherTyping ? "입력 중..." : `${messages.length} 개의 메시지`}
            </div>
          </div>
        </div>
        <div className="text-xs text-gray-400">
          {chatId ? `채팅: ${chatId}` : "채팅 생성 중..."}
        </div>
      </div>

      {/* 메시지 리스트 */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {loading && (
          <div className="text-center text-sm text-gray-400">로딩...</div>
        )}

        {!loading && messages.length === 0 && (
          <div className="text-center text-gray-400">
            대화가 없습니다. 첫 메시지를 보내보세요.
          </div>
        )}

        {messages.map((m) => {
          const mine = m.senderId === auth.currentUser?.uid;
          const time = m.createdAt?.toDate
            ? format(m.createdAt.toDate(), "p")
            : "";
          return (
            <div
              key={m.id}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-lg p-3 max-w-[80%] break-words ${
                  mine
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                }`}
                aria-label={mine ? "내 메시지" : "상대 메시지"}
              >
                <div className="text-sm whitespace-pre-wrap">{m.text}</div>
                <div className="text-xs text-gray-300 dark:text-gray-400 mt-2 text-right">
                  {time}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={endRef} />
      </div>

      {/* 입력폼 */}
      <form onSubmit={handleSend} className="p-3 border-t dark:border-gray-700">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="메시지 보내기... (Enter: 전송, Shift+Enter: 줄바꿈)"
            aria-label="메시지 입력"
            rows={1}
            className="flex-1 resize-none px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-400 dark:bg-gray-900"
            disabled={sending}
            style={{ maxHeight: 240, overflow: "auto" }}
          />
          <button
            type="submit"
            aria-label="전송"
            className={`px-4 py-2 rounded-full text-white font-medium shadow ${
              sending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={sending || !text.trim()}
          >
            {sending ? "전송 중..." : "전송"}
          </button>
        </div>

        {/* 보조 안내 */}
        <div className="mt-2 text-xs text-gray-400">
          Shift+Enter: 줄바꿈 · Enter: 전송
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
