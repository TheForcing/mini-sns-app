import { useState, useEffect } from "react";
import { getMessages } from "../services/messageServices";
import { Message } from "../types";

export function useMessages(userId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchMessages = async () => {
      try {
        const data = await getMessages(userId);
        setMessages(data);
      } catch (err) {
        console.error("메시지 불러오기 오류:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [userId]);

  return { messages, loading };
}
