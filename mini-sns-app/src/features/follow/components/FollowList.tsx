import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

interface FollowListProps {
  userId: string;
  type: "followers" | "following";
}

const FollowList = ({ userId, type }: FollowListProps) => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchList = async () => {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const ids = userDoc.data()[type] || [];
        const userDocs = await Promise.all(
          ids.map((id: string) => getDoc(doc(db, "users", id)))
        );
        setUsers(userDocs.map((u) => ({ id: u.id, ...u.data() })));
      }
    };
    fetchList();
  }, [userId, type]);

  return (
    <div>
      <h2 className="text-lg font-bold mb-3">
        {type === "followers" ? "팔로워" : "팔로잉"}
      </h2>
      {users.map((u) => (
        <Link
          key={u.id}
          to={`/profile/${u.id}`}
          className="block p-2 border-b hover:bg-gray-100"
        >
          <div className="flex items-center gap-2">
            <img
              src={u.photoURL || "/default-avatar.png"}
              alt=""
              className="w-8 h-8 rounded-full"
            />
            <span>{u.displayName}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default FollowList;
