// src/features/profile/services/profileService.ts
import { db, storage, auth } from "../../../firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  DocumentData,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  UploadTask,
} from "firebase/storage";
import { updateProfile as updateAuthProfile } from "firebase/auth";

export type ProfileData = {
  displayName?: string;
  photoURL?: string | null;
  coverURL?: string | null;
  bio?: string;
  role?: "user" | "admin";
  banned?: boolean;
  createdAt?: any;
  updatedAt?: any;
};

/**
 * users/{uid} 문서 조회
 */
export async function getProfile(uid: string): Promise<ProfileData | null> {
  if (!uid) return null;
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as ProfileData) : null;
}

/**
 * users/{uid} 문서 생성 (초기 프로필)
 * 기존 문서가 있으면 덮어쓰지 않음 — merge 옵션이 필요하면 updateProfile 사용
 */
export async function createProfile(uid: string, data: ProfileData) {
  const ref = doc(db, "users", uid);
  const payload: ProfileData = {
    displayName: data.displayName ?? "사용자",
    photoURL: data.photoURL ?? null,
    coverURL: data.coverURL ?? null,
    bio: data.bio ?? "",
    role: data.role ?? "user",
    banned: data.banned ?? false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(ref, payload);
}

/**
 * users/{uid} 문서 업데이트 (부분 업데이트)
 */
export async function updateProfile(
  uid: string,
  updates: Partial<ProfileData>
) {
  if (!uid) throw new Error("uid is required");
  const ref = doc(db, "users", uid);
  await updateDoc(ref, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

/**
 * 프로필 사진 업로드: Firebase Storage 에 업로드 후 users/{uid}.photoURL 업데이트
 * - 파일 업로드 중 이벤트를 리턴(옵션)하려면 UploadTask를 반환하거나 콜백 추가 가능
 */
export async function uploadProfilePhoto(
  uid: string,
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  if (!uid) throw new Error("uid required");
  const safeName = `${Date.now()}_${file.name.replace(
    /[^a-zA-Z0-9._-]/g,
    "_"
  )}`;
  const path = `users/${uid}/profile/${safeName}`;
  const ref = storageRef(storage, path);

  return new Promise<string>((resolve, reject) => {
    const task: UploadTask = uploadBytesResumable(ref, file, {
      contentType: file.type,
      customMetadata: { uploadedBy: uid },
    });

    task.on(
      "state_changed",
      (snapshot) => {
        const pct = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        onProgress?.(pct);
      },
      (err) => {
        reject(err);
      },
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          // Firestore users/{uid} 업데이트
          await updateProfile(uid, { photoURL: url });
          // Firebase Auth 프로필도 업데이트 (선택사항 — auth 객체가 로그인된 유저여야 함)
          try {
            if (auth.currentUser && auth.currentUser.uid === uid) {
              await updateAuthProfile(auth.currentUser, { photoURL: url });
            }
          } catch (e) {
            // Auth 업데이트 실패해도 Firestore에는 반영되어 있으므로 로깅만 함
            console.warn("updateAuthProfile failed:", e);
          }
          resolve(url);
        } catch (e) {
          reject(e);
        }
      }
    );
  });
}

/**
 * 커버 이미지 업로드 (profile 사진과 동일 패턴)
 */
export async function uploadCoverPhoto(
  uid: string,
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  if (!uid) throw new Error("uid required");
  const safeName = `${Date.now()}_${file.name.replace(
    /[^a-zA-Z0-9._-]/g,
    "_"
  )}`;
  const path = `users/${uid}/cover/${safeName}`;
  const ref = storageRef(storage, path);

  return new Promise<string>((resolve, reject) => {
    const task: UploadTask = uploadBytesResumable(ref, file, {
      contentType: file.type,
    });

    task.on(
      "state_changed",
      (snapshot) => {
        const pct = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        onProgress?.(pct);
      },
      (err) => reject(err),
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          await updateProfile(uid, { coverURL: url });
          resolve(url);
        } catch (e) {
          reject(e);
        }
      }
    );
  });
}
