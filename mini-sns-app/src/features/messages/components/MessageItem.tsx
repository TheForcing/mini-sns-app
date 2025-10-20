import React from "react";
import { Message } from "../types";

const MessageItem: React.FC<{ message: Message }> = ({ message }) => {
  return (
    <div className={`message-item ${message.read ? "read" : "unread"}`}>
      <div className="message-content">{message.content}</div>
      <div className="message-date">
        {new Date(message.createdAt).toLocaleString()}
      </div>
    </div>
  );
};

export default MessageItem;
