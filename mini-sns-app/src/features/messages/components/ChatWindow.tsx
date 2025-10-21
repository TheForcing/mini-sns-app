import { useMessages } from "../hooks/useMessages";
import { useState } from "react";
import { sendMessage } from "../services/messageServices";

interface ChatWindowProps {
  userId: string; // 현재 로그인된 사용자 ID
  targetId: string; // 대화 상대 ID
}

const ChatWindow = ({ userId, targetId }: ChatWindowProps) => {
  const { messages, loading } = useMessages(targetId);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(userId, targetId, input);
    setInput("");
  };

  if (loading) return <div>Loading messages...</div>;

  return (
    <div className="chat-window">
      {/* 헤더 */}
      <div className="chat-header">
        <h3>{targetId}님과의 대화</h3>
      </div>

      {/* 메시지 목록 */}
      <div className="message-list">
        {(() => {
          interface Message {
            id: string;
            senderId: string;
            content: string;
            createdAt: string | number | Date;
          }

          return messages.map((msg: Message) => (
            <div
              key={msg.id}
              className={`message ${
                msg.senderId === userId ? "sent" : "received"
              }`}
            >
              <span>{msg.content}</span>
              <small>{new Date(msg.createdAt).toLocaleTimeString()}</small>
            </div>
          ));
        })()}
      </div>

      {/* 입력창 */}
      <div className="message-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
        />
        <button onClick={handleSend}>보내기</button>
      </div>
    </div>
  );
};

export default ChatWindow;
