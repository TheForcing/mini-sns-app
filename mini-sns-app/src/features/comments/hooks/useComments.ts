import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../../auth/hooks/useAuth";

export const useComments = (postId: string) => {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const q = query(
      collection(db, "posts", postId, "comments"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(fetched);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [postId]);

  const addComment = async (content: string) => {
    if (!user) throw new Error("로그인이 필요합니다.");
    await addDoc(collection(db, "posts", postId, "comments"), {
      content,
      authorId: user.uid,
      authorName: user.displayName || "익명",
      createdAt: serverTimestamp(),
    });
  };

  return { comments, loading, addComment };
};
