// src/features/post/components/types.ts
export interface Post {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string | null;
  createdAt?: any;
  likes: string[];
  commentsCount: number;
  attachments?: { url: string; name: string; path: string }[];
}
