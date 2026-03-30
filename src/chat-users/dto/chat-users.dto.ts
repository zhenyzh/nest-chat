export class ChatUserDto {
  id: number;
  name: string;
  typedMe: boolean;
  createdAt: Date | null;
  lastMessage: string;
  isSent: boolean;
  isDelivered: boolean;
  isRead: boolean;
  countUnreadMessage: number;
}
