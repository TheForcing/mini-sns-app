import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";

export const usePost = (postId: string) => {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      const docRef = doc(db, "posts", postId);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        setPost({ id: snapshot.id, ...snapshot.data() });
      }
      setLoading(false);
    };

    fetchPost();
  }, [postId]);

  return { post, loading };
};
