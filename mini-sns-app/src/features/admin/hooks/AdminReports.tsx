import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface ReportItem {
  id: string;
  type: string;
  targetPath: string;
  reporterId?: string;
  reason?: string;
  status?: string;
  createdAt?: any;
}

const AdminReports: React.FC = () => {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setReports(
        snap.docs.map((d) => ({ id: d.id, ...d.data() } as ReportItem))
      );
    });
    return () => unsub();
  }, []);

  const resolveReport = async (id: string) => {
    try {
      await updateDoc(doc(db, "reports", id), { status: "resolved" });
      toast.success("신고 처리(해결) 표시됨");
    } catch (err) {
      console.error(err);
      toast.error("처리 실패");
    }
  };

  const removeReport = async (id: string) => {
    if (!confirm("신고를 삭제하시겠습니까?")) return;
    try {
      await deleteDoc(doc(db, "reports", id));
      toast.success("신고를 삭제했습니다.");
    } catch (err) {
      console.error(err);
      toast.error("삭제 실패");
    }
  };

  const goToTarget = (path: string) => {
    // path 예시: "posts/{postId}" 혹은 "users/{uid}" 혹은 "posts/{postId}/comments/{commentId}"
    // 라우팅 규칙에 맞게 변환
    if (path.startsWith("posts/")) {
      const parts = path.split("/");
      const postId = parts[1];
      navigate(`/post/${postId}`);
    } else if (path.startsWith("users/")) {
      const uid = path.split("/")[1];
      navigate(`/user/${uid}`);
    } else {
      // fallback
      alert("대상으로 이동할 수 없습니다.");
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold mb-2">신고 목록 ({reports.length})</h3>
      <div className="space-y-2">
        {reports.map((r) => (
          <div
            key={r.id}
            className="p-3 border rounded flex justify-between items-start gap-4"
          >
            <div className="flex-1">
              <div className="text-sm text-gray-500">
                {r.type} · {r.status}
              </div>
              <div className="text-gray-800 mt-1">{r.reason}</div>
              <div className="text-xs text-gray-400 mt-2">
                {r.createdAt
                  ? new Date(r.createdAt.seconds * 1000).toLocaleString()
                  : ""}
              </div>
              <div className="mt-2">
                <button
                  onClick={() => goToTarget(r.targetPath)}
                  className="text-sm text-blue-600 hover:underline mr-3"
                >
                  대상으로 이동
                </button>
                <button
                  onClick={() => resolveReport(r.id)}
                  className="text-sm text-green-600 mr-3"
                >
                  처리(해결)
                </button>
                <button
                  onClick={() => removeReport(r.id)}
                  className="text-sm text-red-600"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReports;
