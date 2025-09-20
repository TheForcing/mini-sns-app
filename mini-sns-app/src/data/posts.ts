export interface Comment {
  id: number;
  postId: number;
  author: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  comments: Comment[];
}

export const dummyPosts: Post[] = [
  {
    id: 1,
    title: "첫 번째 게시글",
    content: "🔥 여기서 테스트용 게시판 UI를 확인할 수 있습니다.",
    author: "사용자A",
    createdAt: "2025-09-18 10:00",
    comments: [
      {
        id: 1,
        postId: 1,
        author: "사용자B",
        content: "오 좋은데요?",
        createdAt: "2025-09-18 10:10",
      },
      {
        id: 2,
        postId: 1,
        author: "사용자C",
        content: "테스트 댓글 달아봅니다.",
        createdAt: "2025-09-18 10:15",
      },
    ],
  },
  {
    id: 2,
    title: "두 번째 게시글",
    content: "Next.js + Firebase 조합으로 만든 SNS 클론입니다.",
    author: "사용자B",
    createdAt: "2025-09-18 11:00",
    comments: [
      {
        id: 3,
        postId: 2,
        author: "사용자A",
        content: "좋은 프로젝트네요!",
        createdAt: "2025-09-18 11:05",
      },
    ],
  },
];
