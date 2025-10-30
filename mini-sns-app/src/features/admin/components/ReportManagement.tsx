import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useEffect, useState } from "react";

export const ReportManagement = () => {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "reports"));
      setReports(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    load();
  }, []);

  const markResolved = async (id: string) => {
    await updateDoc(doc(db, "reports", id), { resolved: true });
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, resolved: true } : r))
    );
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">🚨 신고 관리</h2>
      {reports.map((r) => (
        <div key={r.id} className="p-2 border-b">
          <p>
            [{r.type}] 대상: {r.targetId}
          </p>
          <p>사유: {r.reason}</p>
          <button
            onClick={() => markResolved(r.id)}
            className={`px-2 py-1 rounded ${
              r.resolved ? "bg-gray-400" : "bg-blue-500"
            } text-white`}
          >
            {r.resolved ? "처리됨" : "처리"}
          </button>
        </div>
      ))}
    </div>
  );
};
