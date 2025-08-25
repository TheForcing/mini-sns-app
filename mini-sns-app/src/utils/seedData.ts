import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";

// ---------------------
// 더미 유저 데이터
// ---------------------
const dummyUsers = [
  {
    id: "user1",
    displayName: "홍길동",
    photoURL: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "user2",
    displayName: "이몽룡",
    photoURL: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: "user3",
    displayName: "성춘향",
    photoURL: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: "user4",
    displayName: "임꺽정",
    photoURL: "https://i.pravatar.cc/150?img=4",
  },
];

// ---------------------
// 더미 게시글 데이터
// ---------------------
const dummyPosts = [
  {
    content: "안녕하세요! 테스트 게시물 1 🚀",
    authorId: "user1",
    likes: 3,
  },
  {
    content: "오늘 날씨 너무 좋네요 ☀️",
    authorId: "user2",
    likes: 5,
  },
  {
    content: "React + Firebase 재미있습니다 🔥",
    authorId: "user3",
    likes: 10,
  },
];

// ---------------------
// 더미 댓글 데이터
// ---------------------
const dummyComments = [
  {
    content: "좋은 글이네요 👍",
    authorId: "user2",
  },
  {
    content: "저도 동의합니다 🙌",
    authorId: "user3",
  },
  {
    content: "테스트 댓글입니다 📝",
    authorId: "user4",
  },
];

// ---------------------
// 실행 함수
// ---------------------
export const seedData = async () => {
  try {
    // 1. 유저 데이터 삽입
    for (const user of dummyUsers) {
      await setDoc(doc(db, "users", user.id), {
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
      });
    }
    console.log("✅ 유저 더미 추가 완료!");

    // 2. 게시글 데이터 삽입
    for (const post of dummyPosts) {
      const postRef = await addDoc(collection(db, "posts"), {
        content: post.content,
        authorId: post.authorId,
        likes: post.likes,
        commentsCount: dummyComments.length, // 단순히 더미 댓글 개수 넣음
        createdAt: serverTimestamp(),
      });

      // 3. 댓글 삽입 (각 게시물에 동일한 더미 댓글)
      for (const comment of dummyComments) {
        await addDoc(collection(postRef, "comments"), {
          content: comment.content,
          authorId: comment.authorId,
          createdAt: serverTimestamp(),
        });
      }
    }

    console.log("✅ 게시글 + 댓글 더미 추가 완료!");
  } catch (error) {
    console.error("❌ 더미 데이터 삽입 실패:", error);
  }
};
