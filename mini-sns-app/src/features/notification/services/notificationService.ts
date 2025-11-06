// src/features/notification/services/notificationService.ts
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../firebase";

export type NotificationItem = {
  id?: string;
  type: string; // 'like' | 'comment' | 'follow' | 'message' | 'admin' ...
  message: string;
  data?: Record<string, any>;
  read?: boolean;
  createdAt?: any;
};

/**
 * sendNotification
 * - toUid의 subcollection notifications/{toUid}/items 에 문서를 추가합니다.
 * - createdAt, read:false 를 자동으로 넣습니다.
 */
export async function sendNotification(
  toUid: string,
  type: string,
  message: string,
  data: Record<string, any> = {}
) {
  if (!toUid) throw new Error("toUid required");
  const colRef = collection(db, "notifications", toUid, "items");
  const payload = {
    type,
    message,
    data,
    read: false,
    createdAt: serverTimestamp(),
  };
  return await addDoc(colRef, payload);
}

/**
 * listenNotifications
 * - uid의 알림을 실시간 구독합니다.
 * - 콜백에 NotificationItem[] 을 보냅니다.
 */
export function listenNotifications(
  uid: string,
  callback: (items: NotificationItem[]) => void
) {
  if (!uid) {
    callback([]);
    return () => {};
  }
  const q = query(
    collection(db, "notifications", uid, "items"),
    orderBy("createdAt", "desc")
  );
  const unsub = onSnapshot(q, (snap) => {
    const items: NotificationItem[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as any),
    }));
    callback(items);
  });
  return unsub;
}

/**
 * markNotificationRead
 */
export async function markNotificationRead(
  uid: string,
  notificationId: string
) {
  if (!uid || !notificationId) return;
  const ref = doc(db, "notifications", uid, "items", notificationId);
  await updateDoc(ref, { read: true });
}

/**
 * markAllRead
 */
export async function markAllNotificationsRead(uid: string) {
  if (!uid) return;
  const snap = await getDocs(collection(db, "notifications", uid, "items"));
  const promises: Promise<void>[] = [];
  snap.docs.forEach((d) => {
    if (!(d.data() as any).read) {
      promises.push(
        updateDoc(doc(db, "notifications", uid, "items", d.id), { read: true })
      );
    }
  });
  await Promise.all(promises);
}

/**
 * removeNotification
 */
export async function removeNotification(uid: string, notificationId: string) {
  if (!uid || !notificationId) return;
  await deleteDoc(doc(db, "notifications", uid, "items", notificationId));
}
