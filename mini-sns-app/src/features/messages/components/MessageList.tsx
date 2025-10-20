import React from "react";
import { Message } from "../types";
import MessageItem from "./MessageItem";

interface Props {
  messages: Message[];
}

const MessageList: React.FC<Props> = ({ messages }) => {
  return (
    <div className="message-list">
      {messages.map((msg) => (
        <MessageItem key={msg.id} message={msg} />
      ))}
    </div>
  );
};

export default MessageList;
