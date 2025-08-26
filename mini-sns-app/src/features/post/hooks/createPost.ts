import { db } from "../../../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { extractHashtags } from "../../../utils/parseHashtags";

export const createPost = async (authorId: string, content: string) => {
  try {
    const hashtags = extractHashtags(content);

    await addDoc(collection(db, "posts"), {
      authorId,
      content,
      hashtags,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("게시글 작성 실패:", error);
  }
};
