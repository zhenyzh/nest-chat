export class SendMessageDto {
  chatId: number;
  senderId: number; // пользователь который отправил сообщение
  text: string;
}
