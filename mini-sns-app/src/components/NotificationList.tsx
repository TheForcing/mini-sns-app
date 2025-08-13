import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { formatRelativeTime } from "../utils/time";
import { Link } from "react-router-dom";

type Notification = {
  id: string;
  recipientId: string;
  senderId: string;
  type: string;
  postId: string;
  createdAt: any;
  read: boolean;
};

const NotificationList = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "notifications"),
      where("recipientId", "==", auth.currentUser?.uid),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setNotifications(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Notification[]
      );
    });

    return () => unsub();
  }, []);

  const markAsRead = async (id: string) => {
    await updateDoc(doc(db, "notifications", id), { read: true });
  };

  if (!notifications.length)
    return <p className="text-center mt-4">알림이 없습니다.</p>;

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-3">알림</h2>
      <ul className="space-y-2">
        {notifications.map((n) => (
          <li
            key={n.id}
            className={`p-3 rounded ${
              n.read ? "bg-gray-100" : "bg-white border"
            }`}
            onClick={() => markAsRead(n.id)}
          >
            <Link to={`/post/${n.postId}`} className="hover:underline">
              {n.type === "like" && "누군가가 내 게시글을 좋아합니다 ❤️"}
              {n.type === "comment" &&
                "누군가가 내 게시글에 댓글을 남겼습니다 💬"}
            </Link>
            <div className="text-sm text-gray-500">
              {formatRelativeTime(n.createdAt)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationList;
