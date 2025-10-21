import { useState, KeyboardEvent } from "react";

interface MessageInputProps {
  onSend: (content: string) => Promise<void> | void; // 메시지 전송 콜백
  disabled?: boolean; // 비활성화 여부 (예: 로딩 중일 때)
}

const MessageInput = ({ onSend, disabled = false }: MessageInputProps) => {
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || sending || disabled) return;

    try {
      setSending(true);
      await onSend(input.trim());
      setInput(""); // 전송 후 입력창 초기화
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 border-t bg-white">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="메시지를 입력하세요..."
        disabled={disabled || sending}
        className="flex-1 border rounded-2xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        onClick={handleSend}
        disabled={disabled || sending || !input.trim()}
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-2xl px-4 py-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {sending ? "..." : "보내기"}
      </button>
    </div>
  );
};

export default MessageInput;
