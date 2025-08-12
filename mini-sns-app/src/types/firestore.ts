// src/types/firestore.ts
import { Timestamp } from "firebase/firestore";

export type UserDoc = {
  uid: string;
  displayName: string;
  photoURL?: string;
  email?: string;
};

export type PostDoc = {
  content: string;
  createdAt: Timestamp;
  imageURL?: string;
  imagePath?: string;
  author: UserDoc;
  likesCount: number;
};

export type CommentDoc = {
  content: string;
  createdAt: Timestamp;
  author: UserDoc;
};
