import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import PostCard from "../components/PostCard";

interface Post {
  id: string;
  content: string;
  authorName: string;
  createdAt: string;
  likes: number;
  commentsCount: number;
}

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          content: data.content,
          authorName: data.authorName,
          createdAt: new Date(data.createdAt).toLocaleString(),
          likes: data.likes || 0,
          commentsCount: data.commentsCount || 0,
        } as Post;
      });
      setPosts(fetchedPosts);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      {posts.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">게시글이 없습니다.</p>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            id={post.id}
            content={post.content}
            authorName={post.authorName}
            createdAt={post.createdAt}
            likes={post.likes}
            comments={post.commentsCount}
          />
        ))
      )}
    </div>
  );
};

export default Feed;
