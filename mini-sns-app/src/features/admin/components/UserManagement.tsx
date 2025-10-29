import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useEffect, useState } from "react";

export const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      const snap = await getDocs(collection(db, "users"));
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    loadUsers();
  }, []);

  const toggleBan = async (uid: string, banned: boolean) => {
    await updateDoc(doc(db, "users", uid), { banned: !banned });
    setUsers((prev) =>
      prev.map((u) => (u.id === uid ? { ...u, banned: !banned } : u))
    );
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">👥 사용자 관리</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="p-2">이름</th>
            <th className="p-2">이메일</th>
            <th className="p-2">상태</th>
            <th className="p-2">조치</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b">
              <td className="p-2">{u.displayName}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.banned ? "차단됨" : "정상"}</td>
              <td className="p-2">
                <button
                  onClick={() => toggleBan(u.id, u.banned)}
                  className={`px-2 py-1 rounded ${
                    u.banned ? "bg-green-500" : "bg-red-500"
                  } text-white`}
                >
                  {u.banned ? "해제" : "차단"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
