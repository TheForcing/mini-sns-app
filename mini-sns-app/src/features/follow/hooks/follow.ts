import { db } from "../firebase";
import { arrayUnion, arrayRemove, doc, updateDoc } from "firebase/firestore";
import { sendNotification } from "./notification";

export const followUser = async (
  currentUserId: string,
  targetUserId: string
) => {
  try {
    // 내 following에 추가
    await updateDoc(doc(db, "users", currentUserId), {
      following: arrayUnion(targetUserId),
    });
    // 상대방 followers에 추가
    await updateDoc(doc(db, "users", targetUserId), {
      followers: arrayUnion(currentUserId),
    });
    await followUser(currentUserId, targetUserId);
    await sendNotification({
      recipientId: targetUserId,
      senderId: currentUserId,
      type: "follow",
      postId: "",
    });
  } catch (error) {
    console.error("팔로우 실패:", error);
  }
};

export const unfollowUser = async (
  currentUserId: string,
  targetUserId: string
) => {
  try {
    // 내 following에서 제거
    await updateDoc(doc(db, "users", currentUserId), {
      following: arrayRemove(targetUserId),
    });
    // 상대방 followers에서 제거
    await updateDoc(doc(db, "users", targetUserId), {
      followers: arrayRemove(currentUserId),
    });
  } catch (error) {
    console.error("언팔로우 실패:", error);
  }
};
