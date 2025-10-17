// src/hooks/useNotifications.ts
import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../firebase";

export type NotificationItem = {
  id: string;
  type: string;
  actorId?: string;
  actorName?: string;
  actorPhoto?: string | null;
  postId?: string;
  text?: string;
  isRead?: boolean;
  createdAt?: any;
};

export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const q = query(
      collection(db, "notifications", userId, "items"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const items: NotificationItem[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as any),
        }));
        setNotifications(items);
        setLoading(false);
      },
      (err) => {
        console.error("notifications onSnapshot error:", err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [userId]);

  const markAsRead = async (userId: string, notifId: string) => {
    const ref = doc(db, "notifications", userId, "items", notifId);
    await updateDoc(ref, { isRead: true });
  };

  const markAllRead = async (userId: string) => {
    const q = collection(db, "notifications", userId, "items");
    const snap = await getDocs(q);
    const updates = snap.docs.map((d) => updateDoc(d.ref, { isRead: true }));
    await Promise.all(updates);
  };

  return { notifications, loading, markAsRead, markAllRead };
}
