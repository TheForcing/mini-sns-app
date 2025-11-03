// src/features/post/services/postService.ts
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  limit,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage, auth } from "../../../firebase";

/** 타입들 */
export type Attachment = {
  url: string;
  path: string;
  name: string;
  contentType?: string | null;
};

export type Post = {
  id?: string;
  content: string;
  authorId: string;
  authorName?: string;
  authorPhoto?: string | null;
  createdAt?: any;
  likes?: string[]; // uid 배열
  commentsCount?: number;
  attachments?: Attachment[];
  hidden?: boolean;
};

/** 업로드 헬퍼: 파일을 storage에 업로드하고 Attachment 반환 */
export async function uploadAttachment(
  uid: string,
  file: File,
  onProgress?: (pct: number) => void
): Promise<Attachment> {
  const safeName = `${Date.now()}_${file.name.replace(
    /[^a-zA-Z0-9._-]/g,
    "_"
  )}`;
  const path = `posts/${uid}/${safeName}`;
  const ref = storageRef(storage, path);

  return new Promise<Attachment>((resolve, reject) => {
    const task = uploadBytesResumable(ref, file, { contentType: file.type });
    task.on(
      "state_changed",
      (snap) => {
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        onProgress?.(pct);
      },
      (err) => reject(err),
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve({
            url,
            path,
            name: file.name,
            contentType: file.type || null,
          });
        } catch (e) {
          reject(e);
        }
      }
    );
  });
}

/** 게시물 생성 (attachments: 이미 업로드된 Attachment 배열 또는 빈 배열) */
export async function createPost(
  post: Omit<Post, "createdAt" | "id" | "likes" | "commentsCount">,
  attachments: Attachment[] = []
) {
  const payload: Post = {
    content: post.content,
    authorId: post.authorId,
    authorName: post.authorName ?? null,
    authorPhoto: post.authorPhoto ?? null,
    createdAt: serverTimestamp(),
    likes: [],
    commentsCount: 0,
    attachments,
    hidden: false,
  };
  const ref = await addDoc(collection(db, "posts"), payload);
  return ref.id;
}

/** 특정 게시물 조회 */
export async function getPostById(postId: string): Promise<Post | null> {
  const snap = await getDoc(doc(db, "posts", postId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Post) };
}

/** 게시물 삭제 (간단): 문서 삭제 + 첨부파일 삭제(옵션) */
export async function deletePost(postId: string) {
  const p = await getPostById(postId);
  if (!p) return;
  // 첨부파일이 있으면 storage에서 삭제 시도
  if (p.attachments && p.attachments.length > 0) {
    for (const a of p.attachments) {
      try {
        const r = storageRef(storage, a.path);
        await deleteObject(r);
      } catch (e) {
        console.warn("첨부파일 삭제 실패:", a.path, e);
      }
    }
  }
  await deleteDoc(doc(db, "posts", postId));
}

/** 좋아요 토글 (uid가 이미 있으면 제거, 없으면 추가) */
export async function toggleLike(postId: string, uid: string) {
  const postRef = doc(db, "posts", postId);
  const snap = await getDoc(postRef);
  if (!snap.exists()) return;
  const data = snap.data() as DocumentData;
  const likes: string[] = data.likes ?? [];
  if (likes.includes(uid)) {
    // 제거
    await updateDoc(postRef, { likes: arrayRemove(uid) });
  } else {
    // 추가
    await updateDoc(postRef, { likes: arrayUnion(uid) });
  }
}

/** 댓글 수 원자적 증가/감소 */
export async function incrementCommentsCount(
  postId: string,
  delta: number = 1
) {
  await updateDoc(doc(db, "posts", postId), {
    commentsCount: increment(delta),
  });
}

/** 실시간 피드 구독 (최신순) — 간단 onSnapshot */
export function subscribePosts(callback: (posts: Post[]) => void) {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Post) }));
    callback(items);
  });
}

/** 페이징(무한스크롤)용 초기 로드와 더보기 함수 예시 */
export const PAGE_SIZE = 6;

export async function fetchInitialPosts(): Promise<{
  posts: Post[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
}> {
  const q = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc"),
    limit(PAGE_SIZE)
  );
  const snap = await getDocs(q);
  const posts = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Post) }));
  const last = snap.docs[snap.docs.length - 1] ?? null;
  return { posts, lastDoc: last };
}

export async function fetchMorePosts(
  lastDoc: QueryDocumentSnapshot<DocumentData> | null
): Promise<{
  posts: Post[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
}> {
  if (!lastDoc) return { posts: [], lastDoc: null };
  const q = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc"),
    startAfter(lastDoc),
    limit(PAGE_SIZE)
  );
  const snap = await getDocs(q);
  const posts = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Post) }));
  const last = snap.docs[snap.docs.length - 1] ?? null;
  return { posts, lastDoc: last };
}
