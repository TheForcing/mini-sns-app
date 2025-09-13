import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
  orderBy,
  query,
} from "firebase/firestore";
import toast from "react-hot-toast";

interface UserItem {
  uid: string;
  displayName?: string;
  email?: string;
  isAdmin?: boolean;
  banned?: boolean;
  createdAt?: any;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>([]);

  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setUsers(snap.docs.map((d) => ({ uid: d.id, ...d.data() } as UserItem)));
    });
    return () => unsub();
  }, []);

  const toggleAdmin = async (uid: string, current: boolean) => {
    try {
      await updateDoc(doc(db, "users", uid), { isAdmin: !current });
      toast.success(`관리자 권한을 ${!current ? "부여" : "해제"}했습니다.`);
    } catch (err) {
      console.error(err);
      toast.error("권한 변경 실패");
    }
  };

  const toggleBan = async (uid: string, current: boolean) => {
    try {
      await updateDoc(doc(db, "users", uid), { banned: !current });
      toast.success(`${!current ? "정지" : "정지 해제"} 처리했습니다.`);
    } catch (err) {
      console.error(err);
      toast.error("처리 실패");
    }
  };

  const removeUserDoc = async (uid: string) => {
    if (
      !confirm(
        "해당 사용자의 Firestore 프로필을 삭제하시겠습니까? (Auth 삭제는 서버에서만 가능합니다)"
      )
    )
      return;
    try {
      await deleteDoc(doc(db, "users", uid));
      toast.success("사용자 문서를 삭제했습니다.");
    } catch (err) {
      console.error(err);
      toast.error("삭제 실패");
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold mb-2">전체 사용자 ({users.length})</h3>
      <div className="space-y-2">
        {users.map((u) => (
          <div
            key={u.uid}
            className="flex items-center justify-between gap-4 p-3 border rounded hover:shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold">
                {u.displayName?.[0] || u.email?.[0] || "?"}
              </div>
              <div>
                <div className="font-medium">{u.displayName || "익명"}</div>
                <div className="text-xs text-gray-500">{u.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleAdmin(u.uid, !!u.isAdmin)}
                className={`px-3 py-1 rounded text-sm ${
                  u.isAdmin ? "bg-yellow-300" : "bg-gray-100"
                }`}
              >
                {u.isAdmin ? "관리자 해제" : "관리자 지정"}
              </button>
              <button
                onClick={() => toggleBan(u.uid, !!u.banned)}
                className={`px-3 py-1 rounded text-sm ${
                  u.banned ? "bg-green-200" : "bg-gray-100"
                }`}
              >
                {u.banned ? "정지 해제" : "정지"}
              </button>
              <button
                onClick={() => removeUserDoc(u.uid)}
                className="px-3 py-1 rounded text-sm bg-red-100 text-red-600"
              >
                문서 삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;
