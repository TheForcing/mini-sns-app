// src/features/messages/components/MessageItem.tsx
import React from "react";
import { Message } from "../types";
import { format } from "date-fns";

const MessageItem: React.FC<{ message: Message }> = ({ message }) => {
  const time = message.createdAt?.toDate
    ? format(message.createdAt.toDate(), "p")
    : "";
  return (
    <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition">
      <img
        src={message.senderPhoto || "https://i.pravatar.cc/40"}
        alt="sender"
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <p className="font-medium text-gray-800 dark:text-gray-100">
            {message.senderName || message.senderId}
          </p>
          <div className="text-xs text-gray-500 dark:text-gray-400">{time}</div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
          {message.text}
        </p>
      </div>
    </div>
  );
};
export default MessageItem;
