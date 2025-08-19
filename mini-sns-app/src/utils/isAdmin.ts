import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export const isAdmin = async (userId: string): Promise<boolean> => {
  const ref = doc(db, "users", userId);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    return snap.data().role === "admin";
  }
  return false;
};
