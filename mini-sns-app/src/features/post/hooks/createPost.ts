import { useState } from "react";
import { db } from "../../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../auth/hooks/useAuth";

export const CreatePost = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const createPost = async (content: string, hashtags: string[] = []) => {
    if (!user) throw new Error("로그인이 필요합니다.");

    setLoading(true);

    try {
      await addDoc(collection(db, "posts"), {
        content,
        hashtags,
        authorId: user.uid,
        authorName: user.displayName || "익명",
        createdAt: serverTimestamp(),
        likes: 0,
        commentsCount: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  return { createPost, loading };
};
