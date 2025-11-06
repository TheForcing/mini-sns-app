// src/features/notification/hooks/useNotifications.ts
import { useEffect, useState } from "react";
import {
  listenNotifications,
  NotificationItem,
  markNotificationRead,
} from "../services/notificationService";
import { auth } from "../../../firebase";

export function useNotifications() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const uid = auth.currentUser?.uid ?? null;

  useEffect(() => {
    if (!uid) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = listenNotifications(uid, (it) => {
      setItems(it);
      setLoading(false);
    });
    return () => unsub();
  }, [uid]);

  const markRead = async (id: string) => {
    if (!uid) return;
    await markNotificationRead(uid, id);
  };

  return { items, loading, markRead };
}
