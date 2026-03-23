import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import type {SendMessageDto} from '../messages/dto/send-message.dto';

@WebSocketGateway({
  cors: {origin: '*'},
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join_chat')
  handleJoin(@MessageBody() chatId: number, @ConnectedSocket() client: Socket) {
    client.join(`chat_${chatId}`);
    client.emit('join_chat_success', chatId);
  }

  @SubscribeMessage('leave_chat')
  handleLeave(@MessageBody() chatId: number, @ConnectedSocket() client: Socket) {
    client.leave(`chat_${chatId}`);
    client.emit('leave_chat_success', chatId);
  }

  sendMessageToChat(message: SendMessageDto) {
    this.server.to(`chat_${message.chatId}`).emit('chat_message_new', message);
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: {chatId: number; userId: number},
    @ConnectedSocket() client: Socket,
  ) {
    client.to(`chat_${data.chatId}`).emit('user_typing', {userId: data.userId});
  }

  @SubscribeMessage('stop_typing')
  handleStopTyping(
    @MessageBody() data: {chatId: number; userId: number},
    @ConnectedSocket() client: Socket,
  ) {
    client.to(`chat_${data.chatId}`).emit('user_stop_typing', {
      userId: data.userId,
    });
  }
}
