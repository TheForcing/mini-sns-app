// src/pages/MessagesPage.tsx
import React, { useState, useMemo } from "react";
import { useAuth } from "../features/auth/hooks/useAuth";
import { useMessages } from "../features/messages/hooks/useMessages";
import MessageList from "../features/messages/components/MessageList";
import { FaInbox, FaSearch } from "react-icons/fa";
import Input from "../components/ui/Input";

const MessagesPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { messages, loading: msgLoading } = useMessages(user?.uid);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return messages;
    return messages.filter(
      (m) =>
        (m.text || "").toLowerCase().includes(search.toLowerCase()) ||
        (m.senderName || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [messages, search]);

  if (authLoading || msgLoading)
    return <div className="p-6 text-center">불러오는 중...</div>;
  if (!user)
    return (
      <div className="p-6 text-center">
        로그인 후 메시지를 확인할 수 있습니다.
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          <FaInbox className="inline mr-2 text-blue-500" /> 받은 메시지
        </h2>
      </div>

      <div className="relative mb-6">
        <FaSearch className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="메시지/보낸 사람 검색..."
          className="pl-10 w-full"
        />
      </div>

      {filtered.length > 0 ? (
        <MessageList messages={filtered} />
      ) : (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          메시지가 없습니다.
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
