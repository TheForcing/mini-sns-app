// src/features/messages/components/MessageList.tsx
import React from "react";
import MessageItem from "./MessageItem";
import { Message } from "../types";

const MessageList: React.FC<{ messages: Message[] }> = ({ messages }) => {
  return (
    <div className="space-y-3">
      {messages.map((m) => (
        <MessageItem key={m.id} message={m} />
      ))}
    </div>
  );
};
export default MessageList;
