import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useState, useEffect } from "react";

export const PostManagement = () => {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "posts"));
      setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    load();
  }, []);

  const toggleHide = async (id: string, hidden: boolean) => {
    await updateDoc(doc(db, "posts", id), { hidden: !hidden });
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, hidden: !hidden } : p))
    );
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">📝 게시글 관리</h2>
      {posts.map((p) => (
        <div key={p.id} className="p-2 border-b">
          <p>{p.content}</p>
          <button
            onClick={() => toggleHide(p.id, p.hidden)}
            className={`px-2 py-1 rounded ${
              p.hidden ? "bg-green-500" : "bg-gray-700"
            } text-white`}
          >
            {p.hidden ? "표시" : "숨기기"}
          </button>
        </div>
      ))}
    </div>
  );
};
