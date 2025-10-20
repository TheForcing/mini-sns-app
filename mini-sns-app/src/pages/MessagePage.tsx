import React from "react";
import { useAuth } from "../../src/features/auth/hooks/useAuth";
import { useMessages } from "../features/messages/hooks/useMessages";
import MessageList from "../features/messages/components/MessageList";

const MessagesPage = () => {
  const { user } = useAuth();
  const { messages, loading } = useMessages(user?.uid || "");

  if (loading) return <p>Loading messages...</p>;

  return (
    <div className="messages-page">
      <h2>받은 메시지</h2>
      <MessageList messages={messages} />
    </div>
  );
};

export default MessagesPage;
