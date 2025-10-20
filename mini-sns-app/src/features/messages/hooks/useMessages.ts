import { useEffect, useState } from "react";
import { fetchMessages } from "../services/messageServices";
import { Message } from "../types";

export const useMessages = (userId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    fetchMessages(userId).then((data) => {
      setMessages(data);
      setLoading(false);
    });
  }, [userId]);

  return { messages, loading };
};
