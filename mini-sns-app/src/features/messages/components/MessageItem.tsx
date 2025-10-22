import React from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

const MessageItem = ({ message }: { message: any }) => {
  const { senderName, senderPhoto, text, createdAt } = message;
  const time = createdAt
    ? format(new Date(createdAt.seconds * 1000), "p", { locale: ko })
    : "";

  return (
    <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition">
      <img
        src={senderPhoto || "https://i.pravatar.cc/40"}
        alt="프로필"
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-1">
        <p className="font-medium text-gray-800 dark:text-gray-100">
          {senderName || "알 수 없음"}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
          {text}
        </p>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">{time}</div>
    </div>
  );
};

export default MessageItem;
