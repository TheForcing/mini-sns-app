import React from "react";
import MessageItem from "./MessageItem";

const MessageList = ({ messages }: { messages: any[] }) => {
  return (
    <div className="space-y-3">
      {messages.map((msg) => (
        <MessageItem key={msg.id} message={msg} />
      ))}
    </div>
  );
};

export default MessageList;
