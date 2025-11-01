// src/features/notification/services/notificationService.ts
import { db } from "../../../firebase";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

export async function sendNotification(
  toUid: string,
  type: string,
  message: string
) {
  await addDoc(collection(db, "notifications"), {
    toUid,
    type,
    message,
    createdAt: serverTimestamp(),
    read: false,
  });
}

export function listenNotifications(
  uid: string,
  callback: (notis: any[]) => void
) {
  const q = query(
    collection(db, "notifications"),
    where("toUid", "==", uid),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) =>
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
}
