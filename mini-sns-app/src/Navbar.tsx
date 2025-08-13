// Navbar.tsx
import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(
      collection(db, "notifications"),
      where("recipientId", "==", auth.currentUser.uid),
      where("read", "==", false)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      setUnreadCount(snapshot.size);
    });
    return () => unsub();
  }, []);

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <Link to="/">홈</Link>
      <Link to="/notifications">
        알림{" "}
        {unreadCount > 0 && (
          <span className="ml-1 bg-red-500 px-2 rounded-full">
            {unreadCount}
          </span>
        )}
      </Link>
    </nav>
  );
};

export default Navbar;
