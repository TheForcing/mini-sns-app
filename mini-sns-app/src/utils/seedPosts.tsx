import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

// 더미 데이터 배열
const dummyPosts = [
  {
    content: "안녕하세요! 첫 번째 테스트 글입니다 🚀",
    authorName: "홍길동",
    likes: 3,
    commentsCount: 1,
  },
  {
    content: "오늘 날씨가 너무 좋네요 ☀️",
    authorName: "이몽룡",
    likes: 5,
    commentsCount: 2,
  },
  {
    content: "React + Firebase 프로젝트 재미있어요 🔥",
    authorName: "성춘향",
    likes: 10,
    commentsCount: 5,
  },
  {
    content: "여기는 더미 데이터 테스트 중입니다 📝",
    authorName: "임꺽정",
    likes: 1,
    commentsCount: 0,
  },
  {
    content: "무한 스크롤 잘 작동하는지 확인해주세요 ⬇️",
    authorName: "테스터",
    likes: 0,
    commentsCount: 0,
  },
];

// Firestore에 더미 데이터 추가 함수
export const seedPosts = async () => {
  try {
    for (const post of dummyPosts) {
      await addDoc(collection(db, "posts"), {
        ...post,
        createdAt: serverTimestamp(), // Firestore 서버시간
      });
    }
    console.log("✅ 더미 게시물 추가 완료!");
  } catch (error) {
    console.error("❌ 더미 데이터 추가 실패:", error);
  }
};
