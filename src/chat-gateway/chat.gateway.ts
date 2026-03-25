import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import type {SendMessageDto} from '../messages/dto/send-message.dto';

@WebSocketGateway({
  cors: {origin: '*'},
  pingInterval: 5000,
  pingTimeout: 5000,
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private onlineUsers = new Map<number, string[]>();
  private socketToUser = new Map<string, number>();

  handleConnection(client: Socket) {
    console.log('Connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    const userId = this.socketToUser.get(client.id);
    if (!userId) return;

    const sockets = this.onlineUsers.get(userId) || [];

    const updatedSockets = sockets.filter(s => s !== client.id);

    if (updatedSockets.length === 0) {
      // пользователь offline
      this.onlineUsers.delete(userId);
      this.server.emit('user_offline', userId);
    } else {
      this.onlineUsers.set(userId, updatedSockets);
    }

    this.socketToUser.delete(client.id);

    console.log('Disconnected:', client.id);
  }

  @SubscribeMessage('user_online_connect')
  handleUserOnline(@MessageBody() userId: number, @ConnectedSocket() client: Socket) {
    const sockets = this.onlineUsers.get(userId) || [];

    sockets.push(client.id);

    this.onlineUsers.set(userId, sockets);
    this.socketToUser.set(client.id, userId);

    this.server.emit('user_online', userId);
  }

  @SubscribeMessage('get_online_users')
  handleGetOnline(@ConnectedSocket() client: Socket) {
    client.emit('online_users', Array.from(this.onlineUsers.keys()));
  }

  // ********************************************************************************** //

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
