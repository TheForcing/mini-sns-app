import { useEffect, useState } from "react";
import { db, auth } from "../../../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export const NotificationsList = () => {
  const [notis, setNotis] = useState<any[]>([]);
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) return;
    const load = async () => {
      const snap = await getDocs(collection(db, "notifications", uid, "items"));
      setNotis(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    load();
  }, [uid]);

  const markAsRead = async (id: string) => {
    if (!uid) return;
    await updateDoc(doc(db, "notifications", uid, "items", id), { read: true });
    setNotis((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div>
      {notis.map((n) => (
        <div key={n.id} className={`p-2 ${n.read ? "opacity-50" : ""}`}>
          <p>{n.message}</p>
          {!n.read && <button onClick={() => markAsRead(n.id)}>읽음</button>}
        </div>
      ))}
    </div>
  );
};
