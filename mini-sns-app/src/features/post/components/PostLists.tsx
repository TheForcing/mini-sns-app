// src/components/PostList.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../../firebase";
import PostItem from "./PostItem";

const PAGE_SIZE = 5;

const PostList = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [lastDoc, setLastDoc] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      const q = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        limit(PAGE_SIZE)
      );
      const snap = await getDocs(q);
      const docs = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
      setPosts(docs);
      setLastDoc(snap.docs[snap.docs.length - 1] ?? null);
      setHasMore(snap.docs.length === PAGE_SIZE);
      setLoading(false);
    };
    loadInitial();
  }, []);

  useEffect(() => {
    const qLatest = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      limit(1)
    );
    const unsub = onSnapshot(qLatest, (snap) => {
      if (snap.empty) return;
      const top = { id: snap.docs[0].id, ...(snap.docs[0].data() as any) };
      setPosts((prev) => {
        if (prev.some((p) => p.id === top.id)) return prev;
        return [top, ...prev];
      });
    });
    return () => unsub();
  }, []);

  const loadMore = async () => {
    if (!hasMore || !lastDoc) return;
    setLoading(true);
    const q = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      startAfter(lastDoc),
      limit(PAGE_SIZE)
    );
    const snap = await getDocs(q);
    const docs = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    setPosts((prev) => [
      ...prev,
      ...docs.filter((d) => !prev.some((p) => p.id === d.id)),
    ]);
    setLastDoc(snap.docs[snap.docs.length - 1] ?? null);
    setHasMore(snap.docs.length === PAGE_SIZE);
    setLoading(false);
  };

  useEffect(() => {
    if (!loadMoreRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            loadMore();
          }
        });
      },
      { rootMargin: "200px" }
    );
    obs.observe(loadMoreRef.current);
    return () => obs.disconnect();
  }, [lastDoc, hasMore]);

  if (!posts.length && !loading)
    return <p className="text-center mt-4">게시글이 없습니다.</p>;

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {posts.map((p) => (
        <PostItem key={p.id} post={p} />
      ))}
      <div ref={loadMoreRef} className="h-8 flex items-center justify-center">
        {loading ? (
          <span>로딩...</span>
        ) : hasMore ? (
          <span>스크롤로 더 로드</span>
        ) : (
          <span>더 이상 게시글이 없습니다.</span>
        )}
      </div>
    </div>
  );
};

export default PostList;
