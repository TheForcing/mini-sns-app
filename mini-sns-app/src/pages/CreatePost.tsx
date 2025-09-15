import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import Avatar from "../components/ui/Avatar";
import Textarea from "../components/ui/Textarea";
import Button from "../components/ui/Button";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    await addDoc(collection(db, "posts"), {
      content: content.trim(),
      authorId: auth.currentUser.uid,
      authorName: auth.currentUser.displayName || "익명",
      authorPhoto: auth.currentUser.photoURL || null,
      createdAt: serverTimestamp(),
      likes: [],
      commentsCount: 0,
    });
    setContent("");
    navigate("/feed");
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-start gap-3">
            <Avatar
              src={auth.currentUser?.photoURL ?? null}
              name={auth.currentUser?.displayName ?? "?"}
            />
            <Textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="무슨 생각을 하고 있나요?"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={!content.trim()}>
              게시하기
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
