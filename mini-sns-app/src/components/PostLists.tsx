import React, { useEffect, useRef, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import PostItem from "./PostItem";

const PAGE_SIZE = 5;

const PostList = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [lastDoc, setLastDoc] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // 초기 로드 (페이지 1)
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

  // 새 게시글 (최신 1개) 실시간 체크해서 prepend
  useEffect(() => {
    const qLatest = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"),
      limit(1)
    );
    const unsub = onSnapshot(qLatest, (snap) => {
      if (snap.empty) return;
      const top = { id: snap.docs[0].id, ...(snap.docs[0].data() as any) };
      if (!posts.length || top.id !== posts[0]?.id) {
        // 새로운 포스트가 있으면 prepend (중복 제거)
        setPosts((prev) => {
          if (prev.some((p) => p.id === top.id)) return prev;
          return [top, ...prev];
        });
      }
    });
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts.length]); // posts.length 의존성만 두어 새 게시물 prepend 체크

  // 로드 더하기 (older posts)
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

  // IntersectionObserver를 이용한 자동 로드
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
  }, [lastDoc, hasMore]); // lastDoc/hasMore가 바뀔 때 재설정

  if (!posts.length && !loading)
    return <p className="text-center mt-4">게시글이 없습니다.</p>;

  return (
    <div className="space-y-4">
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
