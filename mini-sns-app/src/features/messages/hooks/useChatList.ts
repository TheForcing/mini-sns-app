// src/features/messages/hooks/useChatList.ts
import { useEffect, useState } from "react";
import { listenChatList } from "../services/messageServices";
import { auth } from "../../../firebase";

export function useChatList() {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      setChats([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = listenChatList(uid, (items) => {
      setChats(items);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { chats, loading };
}
