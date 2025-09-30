import { useEffect, useState } from "react";
import { db, auth } from "../../../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import Button from "../../../components/ui/Button";
const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        // 로그인 안된 경우 → 로그인 페이지로
        window.location.href = "/login";
        return;
      }

      // Firestore에서 유저 role 확인
      const snap = await getDoc(doc(db, "users", user.uid));
      if (!snap.exists() || snap.data().role !== "admin") {
        alert("관리자 권한이 없습니다.");
        window.location.href = "/feed";
        return;
      }

      // ✅ 관리자일 경우만 데이터 로딩
      const userSnap = await getDocs(collection(db, "users"));
      const postSnap = await getDocs(collection(db, "posts"));
      setUsers(userSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setPosts(postSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDeletePost = async (id: string) => {
    if (!window.confirm("정말 이 게시글을 삭제하시겠습니까?")) return;
    try {
      await deleteDoc(doc(db, "posts", id));
      setPosts(posts.filter((p) => p.id !== id));
    } catch (err) {
      console.error("게시글 삭제 오류:", err);
    }
  };

  if (loading) return <p className="p-6">로딩 중...</p>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-4">관리자 대시보드</h1>

      {/* 유저 관리 */}
      <section>
        <h2 className="text-xl font-semibold mb-2">사용자 목록</h2>
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">UID</th>
              <th className="p-2 border">이메일</th>
              <th className="p-2 border">닉네임</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-2">{u.id}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.nickname}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 게시글 관리 */}
      <section>
        <h2 className="text-xl font-semibold mb-2">게시글 관리</h2>
        <div className="space-y-4">
          {posts.map((p) => (
            <div
              key={p.id}
              className="p-4 bg-white rounded shadow border flex justify-between"
            >
              <div>
                <p className="font-medium">{p.content}</p>
                {p.author && (
                  <p className="text-sm text-gray-500">작성자: {p.author}</p>
                )}
              </div>
              <Button variant="danger" onClick={() => handleDeletePost(p.id)}>
                삭제
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
