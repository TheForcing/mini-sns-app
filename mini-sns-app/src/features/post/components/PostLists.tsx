// src/features/post/components/PostList.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  onSnapshot,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "../../../firebase";
import PostCard from "./PostCard";
import { Post } from "../types";

const PAGE_SIZE = 6;

const toPost = (docSnap: QueryDocumentSnapshot<DocumentData>): Post => {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    content: data.content,
    authorId: data.authorId,
    authorName: data.authorName,
    authorPhoto: data.authorPhoto ?? null,
    createdAt: data.createdAt,
    likes: data.likes ?? [],
    commentsCount: data.commentsCount ?? 0,
    attachments: data.attachments ?? [],
  };
};

const PostLists: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // 첫 페이지 + 실시간
  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      limit(PAGE_SIZE)
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const fresh = snap.docs.map((d) => toPost(d));
        setPosts(fresh);
        setLastDoc(snap.docs[snap.docs.length - 1] ?? null);
        setHasMore(snap.docs.length === PAGE_SIZE);
        setLoading(false);
      },
      (err) => {
        console.error("post snapshot error", err);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const loadMore = async () => {
    if (!hasMore || loadingMore || !lastDoc) return;
    setLoadingMore(true);
    try {
      const q = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(PAGE_SIZE)
      );
      const snap = await getDocs(q);
      const more = snap.docs.map((d) => toPost(d));
      setPosts((prev) => [...prev, ...more]);
      setLastDoc(snap.docs[snap.docs.length - 1] ?? null);
      setHasMore(snap.docs.length === PAGE_SIZE);
    } catch (err) {
      console.error("load more posts error", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // infinite scroll
  useEffect(() => {
    if (!sentinelRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore();
        }
      },
      { root: null, rootMargin: "200px", threshold: 0.1 }
    );
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [sentinelRef.current, hasMore, loadingMore, lastDoc]);

  return (
    <div>
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white rounded-lg shadow h-40"
            />
          ))}
        </div>
      ) : (
        <>
          {posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              아직 게시물이 없습니다.
            </div>
          ) : (
            posts.map((p) => <PostCard key={p.id} post={p} />)
          )}

          <div ref={sentinelRef} className="h-6" />

          {loadingMore && (
            <div className="text-center text-sm text-gray-500 py-4">
              로딩 중...
            </div>
          )}

          {!hasMore && posts.length > 0 && (
            <div className="text-center text-sm text-gray-400 py-4">
              더 이상 게시물이 없습니다.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PostLists;
