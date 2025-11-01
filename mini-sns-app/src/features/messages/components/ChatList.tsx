// ChatList.tsx
import React, { useEffect, useState } from "react";
import { subscribeChatList } from "../services/chatService";
import { auth } from "../../../firebase";
import { Link } from "react-router-dom";

const ChatList: React.FC = () => {
  const [chats, setChats] = useState<any[]>([]);
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) return;
    const unsub = subscribeChatList(uid, (items) => setChats(items));
    return () => unsub();
  }, [uid]);

  return (
    <div className="space-y-2">
      {chats.map((c) => (
        <Link
          key={c.id}
          to={`/messages/${c.id}`}
          className="block p-3 bg-white dark:bg-gray-800 rounded-md hover:shadow"
        >
          <div className="flex justify-between">
            <div>
              <div className="font-medium">
                {/* 표시명은 participants로 조회해서 보여줄 것 */}대화
              </div>
              <div className="text-sm text-gray-500 truncate">
                {c.lastMessage?.text}
              </div>
            </div>
            <div className="text-xs text-gray-400">{/* 시간 포맷 */}</div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ChatList;
