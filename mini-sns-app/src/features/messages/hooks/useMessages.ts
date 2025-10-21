// messageServices.ts
import { Message } from "../types";

export const useMessages = async (userId: string): Promise<Message[]> => {
  const res = await fetch(`/api/messages/${userId}`);
  const data = await res.json();

  // 서버 응답 구조 확인 후 변환
  const messages: Message[] = data.map((item: any) => ({
    id: item.id,
    senderId: item.senderId,
    receiverId: item.receiverId,
    content: item.content,
    createdAt: new Date(item.createdAt),
    read: !!item.read,
  }));

  return messages;
};
