import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import { useState, useEffect } from "react";

export const NoticeManagement = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notices, setNotices] = useState<any[]>([]);

  const postNotice = async () => {
    if (!title.trim() || !content.trim()) return;
    await addDoc(collection(db, "notices"), {
      title,
      content,
      createdAt: new Date(),
    });
    setTitle("");
    setContent("");
    loadNotices();
  };

  const loadNotices = async () => {
    const snap = await getDocs(collection(db, "notices"));
    setNotices(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    loadNotices();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">📢 공지사항 관리</h2>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목"
        className="border p-1 w-full mb-2"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="내용"
        className="border p-1 w-full mb-2"
      />
      <button
        onClick={postNotice}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        등록
      </button>

      <div className="mt-4">
        {notices.map((n) => (
          <div key={n.id} className="border-b py-2">
            <h3 className="font-bold">{n.title}</h3>
            <p>{n.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
