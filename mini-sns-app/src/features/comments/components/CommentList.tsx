import CommentCard from "../components/CommnetCard";

const CommentList = () => {
  const comments = [
    {
      id: "c1",
      authorName: "홍길동",
      authorPhoto: "https://i.pravatar.cc/40?img=1",
      content: "첫 댓글입니다! 🎉",
      createdAt: "2분 전",
      likes: 3,
      isAuthor: true,
      replies: [
        {
          id: "r1",
          authorName: "김철수",
          authorPhoto: "https://i.pravatar.cc/40?img=2",
          content: "축하합니다 👏",
          createdAt: "1분 전",
        },
      ],
    },
    {
      id: "c2",
      authorName: "이영희",
      authorPhoto: "https://i.pravatar.cc/40?img=3",
      content: "좋은 글 잘 보고 갑니다 👍",
      createdAt: "5분 전",
      likes: 1,
      replies: [],
    },
  ];

  // 좋아요 처리
  const handleLike = (id: string) => {
    console.log("좋아요 클릭:", id);
    // Firestore likes 업데이트 로직 추가 가능
  };

  // 답글 처리
  const handleReply = (id: string, text: string) => {
    console.log("답글 작성:", id, text);
    // Firestore replies 컬렉션에 추가하는 로직 작성 가능
  };

  // 삭제 처리
  const handleDelete = (id: string) => {
    console.log("댓글 삭제:", id);
    // Firestore에서 문서 삭제 로직 추가 가능
  };

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentCard
          key={comment.id}
          {...comment}
          onLike={handleLike}
          onReply={handleReply}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default CommentList;
