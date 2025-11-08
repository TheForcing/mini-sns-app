// src/features/admin/services/adminService.ts
import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../firebase";

/** 유저 차단 / 해제 */
export async function setUserBanned(uid: string, banned: boolean) {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, { banned });
}

/** 모든 유저 목록 (간단) */
export async function fetchAllUsers() {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/** 특정 유저 조회 */
export async function getUser(uid: string) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/** 게시글 숨김(또는 복원) - hidden 필드 사용 */
export async function setPostHidden(postId: string, hidden: boolean) {
  const ref = doc(db, "posts", postId);
  await updateDoc(ref, { hidden });
}

/** 게시글 삭제 */
export async function deletePostByAdmin(postId: string) {
  await deleteDoc(doc(db, "posts", postId));
}

/** 신고(Report) 관련: 불러오기 및 처리(참조 구조는 reports/{reportId}) */
export async function fetchReports() {
  const snap = await getDocs(
    query(collection(db, "reports"), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/** 신고를 '처리' 상태로 표시(예: resolved=true, handledBy, handledAt) */
export async function resolveReport(
  reportId: string,
  handledByUid: string,
  action?: string
) {
  const ref = doc(db, "reports", reportId);
  await updateDoc(ref, {
    resolved: true,
    handledBy: handledByUid,
    handledAt: serverTimestamp(),
    action: action ?? null,
  });
}

/** 공지사항 CRUD (notices 컬렉션) */
export async function createNotice(title: string, content: string) {
  const ref = collection(db, "notices");
  const docRef = await addDoc(ref, {
    title,
    content,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function fetchNotices() {
  const snap = await getDocs(
    query(collection(db, "notices"), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function deleteNotice(noticeId: string) {
  await deleteDoc(doc(db, "notices", noticeId));
}
