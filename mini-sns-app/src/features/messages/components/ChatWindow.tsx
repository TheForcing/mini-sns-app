// ChatWindow.tsx
import React, { useEffect, useRef, useState } from "react";
import { useChat } from "../hooks/useChat";
import { format } from "date-fns";
import { auth } from "../../../firebase";

const ChatWindow: React.FC<{
  chatId: string;
  otherName?: string;
  otherPhoto?: string;
}> = ({ chatId }) => {
  const { messages, send, markRead } = useChat(chatId);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 스크롤 맨 아래
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    // 입장 시 아직 안 읽은 메시지 읽음 처리
    markRead();
  }, [chatId]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim()) return;
    await send(text.trim());
    setText("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4 space-y-3">
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
                className={`${
                  mine
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-800"
                } rounded-lg p-3 max-w-[70%]`}
              >
                <div className="text-sm">{m.text}</div>
                <div className="text-xs text-gray-400 mt-1 text-right">
                  {time}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="p-3 border-t flex items-center gap-2"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
          placeholder="메시지 보내기..."
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-full"
        >
          전송
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
