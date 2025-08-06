import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../firebase";

export const checkNicknameExists = async (
  nickname: string
): Promise<boolean> => {
  const q = query(
    collection(db, "users"),
    where("displayName", "==", nickname)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};
