// src/api/posts.ts
import {
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  doc,
  getDoc,
  onSnapshot,
  writeBatch,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { auth, db, storage } from "../../../firebase";
import type { QueryDocumentSnapshot } from "firebase/firestore";

export async function addPost(content: string, file?: File) {
  const user = auth.currentUser;
  if (!user) throw new Error("로그인이 필요합니다.");

  let imageURL = "";
  let imagePath = "";

  if (file) {
    imagePath = `postImages/${user.uid}_${Date.now()}`;
    const imageRef = ref(storage, imagePath);
    await uploadBytes(imageRef, file);
    imageURL = await getDownloadURL(imageRef);
  }

  const docRef = await addDoc(collection(db, "posts"), {
    content,
    createdAt: serverTimestamp(),
    imageURL,
    imagePath,
    author: {
      uid: user.uid,
      displayName: user.displayName || "익명",
      photoURL: user.photoURL || "",
    },
    likesCount: 0,
  });

  return docRef.id;
}

export async function getPostsPage(
  pageSize: number,
  startAfterDoc?: QueryDocumentSnapshot | null
) {
  const q = startAfterDoc
    ? query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        startAfter(startAfterDoc),
        limit(pageSize)
      )
    : query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        limit(pageSize)
      );

  const snap = await getDocs(q);
  return {
    posts: snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })),
    lastDoc: snap.docs[snap.docs.length - 1] ?? null,
  };
}

export function subscribeLatestPost(onNew: (post: any) => void) {
  const q = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc"),
    limit(1)
  );
  const unsub =
    db &&
    (onSnapshot as any)(q, (snap: any) => {
      // onSnapshot를 동적으로 사용
      if (!snap.empty)
        onNew({ id: snap.docs[0].id, ...(snap.docs[0].data() as any) });
    });
  return unsub;
}

export async function deletePostClientSide(postId: string) {
  const postRef = doc(db, "posts", postId);
  const postSnap = await getDoc(postRef);
  if (!postSnap.exists()) return;
  const postData: any = postSnap.data();

  if (postData.imagePath) {
    await deleteObject(ref(storage, postData.imagePath)).catch(() => {});
  }

  // 서브컬렉션 삭제 (comments, likes) - 간단 배치 방식
  // 권장: Cloud Function으로 처리
  const comments = await getDocs(collection(db, "posts", postId, "comments"));
  const likes = await getDocs(collection(db, "posts", postId, "likes"));
  const batch = writeBatch(db);
  comments.forEach((d) => batch.delete(d.ref));
  likes.forEach((d) => batch.delete(d.ref));
  batch.delete(postRef);
  await batch.commit();
}
