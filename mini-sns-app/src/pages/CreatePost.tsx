import { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      await addDoc(collection(db, "posts"), {
        content,
        authorId: auth.currentUser.uid,
        authorName: auth.currentUser.displayName || "익명",
        authorPhoto: auth.currentUser.photoURL || null,
        createdAt: serverTimestamp(),
        likes: 0,
        commentsCount: 0,
      });
      setContent("");
      navigate("/feed"); // 작성 후 피드로 이동
    } catch (err) {
      console.error(err);
      alert("게시글 작성 중 오류가 발생했습니다.");
    }
  };

  return (
    <section className="w-full max-w-2xl mx-auto">
      <div className="bg-white shadow rounded-xl p-5">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          ✍️ 새 글 작성
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-start gap-3">
            {/* 프로필 아바타 */}
            {auth.currentUser?.photoURL ? (
              <img
                src={auth.currentUser.photoURL}
                alt="프로필"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-white">
                {auth.currentUser?.displayName?.[0] || "?"}
              </div>
            )}

            {/* 글쓰기 입력창 */}
            <textarea
              className="flex-1 resize-none border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              rows={4}
              placeholder="무슨 생각을 하고 있나요?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* 게시 버튼 */}
          <button
            type="submit"
            disabled={!content.trim()}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow hover:opacity-90 transition disabled:opacity-50"
          >
            게시하기
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreatePost;
