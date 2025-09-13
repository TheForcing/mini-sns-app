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

interface PostItem {
  id: string;
  content?: string;
  authorId?: string;
  authorName?: string;
  createdAt?: any;
}

const AdminPosts: React.FC = () => {
  const [posts, setPosts] = useState<PostItem[]>([]);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as PostItem)));
    });
    return () => unsub();
  }, []);

  const deletePost = async (postId: string) => {
    if (!confirm("게시글을 완전히 삭제하시겠습니까?")) return;
    try {
      await deleteDoc(doc(db, "posts", postId));
      toast.success("게시글을 삭제했습니다.");
    } catch (err) {
      console.error(err);
      toast.error("삭제 실패");
    }
  };

  const banAuthor = async (uid: string) => {
    if (!confirm("작성자를 정지 처리하시겠습니까?")) return;
    try {
      await updateDoc(doc(db, "users", uid), { banned: true });
      toast.success("작성자 정지 처리되었습니다.");
    } catch (err) {
      console.error(err);
      toast.error("처리 실패");
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold mb-2">전체 게시글 ({posts.length})</h3>
      <div className="space-y-2">
        {posts.map((p) => (
          <div
            key={p.id}
            className="p-3 border rounded flex justify-between items-start gap-4"
          >
            <div className="flex-1">
              <div className="text-sm text-gray-500">
                {p.authorName} ·{" "}
                {p.createdAt
                  ? new Date(p.createdAt.seconds * 1000).toLocaleString()
                  : ""}
              </div>
              <div className="text-gray-800 mt-2">
                {p.content?.slice(0, 200)}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => deletePost(p.id)}
                className="px-3 py-1 rounded bg-red-100 text-red-600 text-sm"
              >
                삭제
              </button>
              {p.authorId && (
                <button
                  onClick={() => banAuthor(p.authorId!)}
                  className="px-3 py-1 rounded bg-gray-100 text-sm"
                >
                  작성자 정지
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPosts;
