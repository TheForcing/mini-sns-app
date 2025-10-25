// src/features/messages/types.ts
export interface Message {
  id: string;
  senderId: string;
  senderName?: string;
  senderPhoto?: string;
  receiverId: string;
  text: string;
  createdAt: any; // Firestore Timestamp
  read?: boolean;
}
