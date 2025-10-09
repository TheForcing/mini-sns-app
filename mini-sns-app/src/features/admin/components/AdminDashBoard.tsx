// src/features/admin/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { ref as storageRef, deleteObject } from "firebase/storage";
import { db, storage, auth } from "../../../firebase";
import { useNavigate } from "react-router-dom";

/**
 * AdminDashboard
 * - Users 탭: role 변경(admin 부여/해제), banned 토글
 * - Posts 탭: 게시물 삭제 (스토리지 attachments 삭제 포함)
 * - Reports 탭: 신고 목록(예시) 확인/처리
 *
 * 주의: 실제 사용자 계정(Auth) 삭제는 클라이언트에서 불가(관리자 SDK 필요). 대신 users/{uid}.banned 플래그를 사용합니다.
 */

type UserItem = {
  id: string;
  email?: string;
  displayName?: string;
  role?: string;
  banned?: boolean;
};

type PostItem = {
  id: string;
  content?: string;
  authorId?: string;
  authorName?: string;
  attachments?: { url: string; path?: string; name?: string }[];
  createdAt?: any;
};

type ReportItem = {
  id: string;
  type?: string; // post/comment/user
  targetId?: string;
  reason?: string;
  reporter?: string;
  resolved?: boolean;
  createdAt?: any;
};

const AdminDashboard: React.FC = () => {
  const [tab, setTab] = useState<"users" | "posts" | "reports" | "stats">(
    "users"
  );
  const [users, setUsers] = useState<UserItem[]>([]);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 초기 로드: 데이터 fetch
  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchUsers(), fetchPosts(), fetchReports()]);
    } catch (err) {
      console.error("admin load error", err);
    } finally {
      setLoading(false);
    }
  };

  // === Users ===
  const fetchUsers = async () => {
    const snap = await getDocs(collection(db, "users"));
    setUsers(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
  };

  const toggleAdmin = async (uid: string, makeAdmin: boolean) => {
    if (
      !confirm(
        `${
          makeAdmin ? "관리자 권한을 부여" : "관리자 권한을 회수"
        } 하시겠습니까?`
      )
    )
      return;
    try {
      await updateDoc(doc(db, "users", uid), {
        role: makeAdmin ? "admin" : "user",
        updatedAt: serverTimestamp(),
      });
      await fetchUsers();
      alert("권한 변경 완료");
    } catch (err) {
      console.error("toggle admin error", err);
      alert("권한 변경 실패");
    }
  };

  const toggleBanned = async (uid: string, banned: boolean) => {
    if (!confirm(`${banned ? "차단" : "차단 해제"} 하시겠습니까?`)) return;
    try {
      await updateDoc(doc(db, "users", uid), {
        banned,
        updatedAt: serverTimestamp(),
      });
      await fetchUsers();
      alert("변경 완료");
    } catch (err) {
      console.error("toggle banned error", err);
      alert("변경 실패");
    }
  };

  // === Posts ===
  const fetchPosts = async () => {
    const snap = await getDocs(
      query(collection(db, "posts"), orderBy("createdAt", "desc"))
    );
    setPosts(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
  };

  const deletePost = async (postId: string) => {
    if (!confirm("정말 이 게시글을 삭제하시겠습니까? (되돌릴 수 없습니다)"))
      return;
    try {
      // 1) attachments가 있으면 스토리지에서 삭제
      const pSnap = await getDoc(doc(db, "posts", postId));
      if (pSnap.exists()) {
        const data = pSnap.data() as any;
        const attachments = data.attachments as { path?: string }[] | undefined;
        if (attachments?.length) {
          for (const att of attachments) {
            if (att?.path) {
              try {
                await deleteObject(storageRef(storage, att.path));
              } catch (e) {
                console.warn("storage delete fail for", att.path, e);
              }
            }
          }
        }
      }

      // 2) 게시물 문서 삭제
      await deleteDoc(doc(db, "posts", postId));
      await fetchPosts();
      alert("게시글 삭제 완료");
    } catch (err) {
      console.error("delete post error", err);
      alert("게시글 삭제 실패");
    }
  };

  // === Reports ===
  // 프로젝트에 reports 컬렉션이 없는 경우 빈배열 처리
  const fetchReports = async () => {
    try {
      const snap = await getDocs(
        query(collection(db, "reports"), orderBy("createdAt", "desc"))
      );
      setReports(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    } catch (err) {
      // reports 컬렉션이 없을 수 있음. 그냥 빈값 유지
      console.warn("no reports collection or fetch error", err);
      setReports([]);
    }
  };

  const resolveReport = async (reportId: string) => {
    if (!confirm("이 신고를 처리(해결) 처리하시겠습니까?")) return;
    try {
      await updateDoc(doc(db, "reports", reportId), {
        resolved: true,
        resolvedBy: auth.currentUser?.uid || "admin",
        resolvedAt: serverTimestamp(),
      });
      await fetchReports();
      alert("신고 처리 완료");
    } catch (err) {
      console.error("resolve report error", err);
      alert("신고 처리 실패");
    }
  };

  // === UI rendering ===
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">관리자 대시보드</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setTab("users")}
            className={`px-3 py-1 rounded ${
              tab === "users" ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setTab("posts")}
            className={`px-3 py-1 rounded ${
              tab === "posts" ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setTab("reports")}
            className={`px-3 py-1 rounded ${
              tab === "reports" ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            Reports
          </button>
          <button
            onClick={() => setTab("stats")}
            className={`px-3 py-1 rounded ${
              tab === "stats" ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            Stats
          </button>
        </div>
      </div>

      {loading ? <div>로딩중...</div> : null}

      {tab === "users" && (
        <section className="space-y-3">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">사용자 목록 ({users.length})</h2>
            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="text-left text-xs text-gray-500">
                  <tr>
                    <th className="py-2">UID</th>
                    <th className="py-2">이메일</th>
                    <th className="py-2">닉네임</th>
                    <th className="py-2">역할</th>
                    <th className="py-2">차단</th>
                    <th className="py-2">액션</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-t">
                      <td className="py-2 text-xs">{u.id}</td>
                      <td className="py-2">{u.email || "-"}</td>
                      <td className="py-2">{u.displayName || "-"}</td>
                      <td className="py-2">{u.role || "user"}</td>
                      <td className="py-2">{u.banned ? "차단" : "정상"}</td>
                      <td className="py-2 space-x-2">
                        <button
                          onClick={() =>
                            toggleAdmin(u.id, (u.role || "user") !== "admin")
                          }
                          className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                        >
                          {u.role === "admin" ? "회수" : "관리자부여"}
                        </button>
                        <button
                          onClick={() => toggleBanned(u.id, !u.banned)}
                          className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                        >
                          {u.banned ? "차단해제" : "차단"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {tab === "posts" && (
        <section className="space-y-3">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">게시글 목록 ({posts.length})</h2>
            <div className="space-y-3">
              {posts.map((p) => (
                <div
                  key={p.id}
                  className="border rounded p-3 flex justify-between items-start"
                >
                  <div className="max-w-xl">
                    <div className="text-sm text-gray-700 mb-1">
                      {p.authorName} •{" "}
                      {p.createdAt?.toDate
                        ? new Date(p.createdAt.toDate()).toLocaleString()
                        : ""}
                    </div>
                    <div className="text-gray-800">
                      {p.content?.slice(0, 400)}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => navigate(`/post/${p.id}`)}
                      className="px-3 py-1 text-sm bg-gray-100 rounded"
                    >
                      보기
                    </button>
                    <button
                      onClick={() => deletePost(p.id)}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {tab === "reports" && (
        <section className="space-y-3">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">신고 목록 ({reports.length})</h2>
            {reports.length === 0 ? (
              <div className="text-gray-500">신고가 없습니다.</div>
            ) : (
              <div className="space-y-2">
                {reports.map((r) => (
                  <div
                    key={r.id}
                    className="border rounded p-3 flex justify-between"
                  >
                    <div>
                      <div className="text-sm text-gray-700">
                        {r.type} • {r.targetId}
                      </div>
                      <div className="text-gray-800">{r.reason}</div>
                      <div className="text-xs text-gray-400">
                        신고자: {r.reporter}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {!r.resolved ? (
                        <button
                          onClick={() => resolveReport(r.id)}
                          className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                        >
                          처리완료
                        </button>
                      ) : (
                        <div className="text-xs text-gray-500">처리됨</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {tab === "stats" && (
        <section>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">기본 통계</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border rounded">
                <div className="text-xs text-gray-500">총 유저</div>
                <div className="text-xl font-bold">{users.length}</div>
              </div>
              <div className="p-3 border rounded">
                <div className="text-xs text-gray-500">총 게시글</div>
                <div className="text-xl font-bold">{posts.length}</div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminDashboard;
