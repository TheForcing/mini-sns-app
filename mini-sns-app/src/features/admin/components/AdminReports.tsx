import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";

interface Report {
  id: string;
  reporterId: string;
  targetType: string;
  targetId: string;
  reason: string;
  status: string;
  postId?: string;
}

const AdminReports = ({ isAdmin }: { isAdmin: boolean }) => {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    if (!isAdmin) return;
    const unsub = onSnapshot(collection(db, "reports"), (snap) => {
      setReports(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Report[]);
    });
    return () => unsub();
  }, [isAdmin]);

  const handleResolve = async (reportId: string) => {
    await updateDoc(doc(db, "reports", reportId), { status: "resolved" });
  };

  if (!isAdmin) return <p>권한 없음</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">신고 관리</h2>
      {reports.map((r) => (
        <div key={r.id} className="border p-2 mb-2">
          <p>
            📌 신고 대상: {r.targetType} ({r.targetId})
          </p>
          <p>신고 사유: {r.reason}</p>
          <p>상태: {r.status}</p>
          <button
            onClick={() => handleResolve(r.id)}
            className="bg-green-500 text-white px-3 py-1 rounded mt-2"
          >
            처리 완료
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminReports;
