export class SendMessageDto {
  chatId: number;
  senderId: number; // пользователь который отправил сообщение
  text: string;
  clientId?: string;
  attachments: {
    id: string;
    url: string;
    name: string;
    type: string;
    size: number;
  }[];
}
