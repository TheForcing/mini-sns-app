// src/features/auth/services/authService.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import { auth } from "../../../firebase";
import { UserProfile } from "../types";

// 회원가입
export const registerUser = async (
  email: string,
  password: string,
  displayName?: string
): Promise<UserProfile> => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);

  if (displayName) {
    await updateProfile(user, { displayName });
  }

  return {
    uid: user.uid,
    email: user.email!,
    displayName: user.displayName ?? "",
    photoURL: user.photoURL ?? "",
  };
};

// 로그인
export const loginUser = async (
  email: string,
  password: string
): Promise<UserProfile> => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return {
    uid: user.uid,
    email: user.email!,
    displayName: user.displayName ?? "",
    photoURL: user.photoURL ?? "",
  };
};

// 로그아웃
export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};
