import { useEffect, useState, useCallback } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import PostCard from "../components/PostCard";
import { formatDistanceToNow } from "../utils/formatDate";

interface Post {
  id: string;
  content: string;
  authorName: string;
  createdAt: Date;
  likes: number;
  commentsCount: number;
}

const POSTS_PER_PAGE = 5;

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // 게시글 불러오기
  const fetchPosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const postsQuery = lastDoc
        ? query(
            collection(db, "posts"),
            orderBy("createdAt", "desc"),
            startAfter(lastDoc),
            limit(POSTS_PER_PAGE)
          )
        : query(
            collection(db, "posts"),
            orderBy("createdAt", "desc"),
            limit(POSTS_PER_PAGE)
          );

      const snapshot = await getDocs(postsQuery);

      if (!snapshot.empty) {
        const fetchedPosts: Post[] = snapshot.docs.map((doc) => {
          const data = doc.data() as DocumentData;
          return {
            id: doc.id,
            content: data.content || "",
            authorName: data.authorName || "익명",
            createdAt: data.createdAt?.toDate
              ? data.createdAt.toDate()
              : new Date(),
            likes: data.likes || 0,
            commentsCount: data.commentsCount || 0,
          };
        });

        setPosts((prev) => [...prev, ...fetchedPosts]);
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

        if (snapshot.docs.length < POSTS_PER_PAGE) {
          setHasMore(false); // 더 이상 불러올 글 없음
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("게시글 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  }, [lastDoc, loading, hasMore]);

  // 첫 로딩 시 실행
  useEffect(() => {
    fetchPosts();
  }, []);

  // 스크롤 이벤트 감지
  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      if (
        scrollTop + clientHeight >= scrollHeight - 50 &&
        !loading &&
        hasMore
      ) {
        fetchPosts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchPosts, loading, hasMore]);

  return (
    <div className="max-w-2xl mx-auto px-4">
      {posts.length === 0 && !loading && (
        <p className="text-gray-500 text-center mt-10">게시글이 없습니다.</p>
      )}

      {posts.map((post) => (
        <PostCard
          key={post.id}
          id={post.id}
          content={post.content}
          authorName={post.authorName}
          createdAt={formatDistanceToNow(post.createdAt)}
          likes={post.likes}
          comments={post.commentsCount}
        />
      ))}

      {loading && (
        <p className="text-center text-gray-500 mt-4">불러오는 중...</p>
      )}
      {!hasMore && (
        <p className="text-center text-gray-400 mt-4">
          모든 게시글을 불러왔습니다.
        </p>
      )}
    </div>
  );
};

export default Feed;
