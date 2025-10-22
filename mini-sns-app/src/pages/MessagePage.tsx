import React, { useState, useMemo } from "react";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useMessages } from "../features/messages/hooks/useMessages";
import MessageList from "../features/messages/components/MessageList";
import Input from "../components/ui/Input";
import { FaInbox, FaSearch } from "react-icons/fa";

const MessagesPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { messages, loading: msgLoading } = useMessages(user?.uid || "");
  const [search, setSearch] = useState("");

  // 🔍 검색 필터링
  const filteredMessages = useMemo(() => {
    if (!search.trim()) return messages;
    return messages.filter((msg) =>
      msg.text.toLowerCase().includes(search.toLowerCase())
    );
  }, [messages, search]);

  if (authLoading || msgLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 dark:text-gray-300">
        <div className="animate-pulse">메시지를 불러오는 중...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600 dark:text-gray-300">
          로그인 후 메시지를 확인할 수 있습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* 🔹 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <FaInbox className="text-blue-500" /> 받은 메시지
        </h2>
      </div>

      {/* 🔍 검색 바 */}
      <div className="relative mb-6">
        <FaSearch className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="메시지 검색..."
          className="pl-10 w-full"
        />
      </div>

      {/* 📜 메시지 리스트 */}
      {filteredMessages.length > 0 ? (
        <MessageList messages={filteredMessages} />
      ) : (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          메시지가 없습니다 💬
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
