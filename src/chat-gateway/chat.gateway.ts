import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import {OnEvent} from '@nestjs/event-emitter';
import {Server, Socket} from 'socket.io';
import type {SendMessageDto} from '../messages/dto/send-message.dto';
import {MessagesService} from '../messages/messages.service';
import {ChatUsersService} from '../chat-users/chat-users.service';

@WebSocketGateway({
  cors: {origin: '*'},
  pingInterval: 5000,
  pingTimeout: 5000,
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private messagesService: MessagesService,
    private chatUsersService: ChatUsersService,
  ) {}

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

    client.broadcast.emit('user_online', userId);
  }

  @SubscribeMessage('get_online_users')
  handleGetOnline(@ConnectedSocket() client: Socket) {
    client.emit('online_users', Array.from(this.onlineUsers.keys()));
  }

  // ---------------join_chat----------------------------//

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

  async notifyUserWithChats(userId: number) {
    const usersWithChats = await this.chatUsersService.getUsersWithChats(userId);

    const sockets = this.onlineUsers.get(userId) || [];
    sockets.forEach(socketId => {
      this.server.to(socketId).emit('chat_users_update', usersWithChats);
    });
  }

  // ---------------event emitter----------------------------//
  @OnEvent('message.send')
  async handleMessageCreated(message: SendMessageDto) {
    this.server.to(`chat_${message.chatId}`).emit('chat_message_new', message);

    const chatUsers = await this.chatUsersService.getChatUsers(message.chatId);

    for (const user of chatUsers) {
      await this.chatUsersService.ensureChatUserExists(message.chatId, user.id);
      await this.notifyUserWithChats(user.id); // обновляем последнее сообщение для себя
    }
  }

  @OnEvent('users.avatar_updated')
  handleAvatarUpdated(data: {userId: number; avatarUrl: string}) {
    this.server.emit('user_avatar_updated', data);
  }

  @SubscribeMessage('message_delivered')
  async handleDelivered(
    @MessageBody() data: {messageId: number; chatId: number},
    @ConnectedSocket() client: Socket,
  ) {
    this.messagesService.markAsDelivered(data.messageId);
    this.server.to(`chat_${data.chatId}`).emit('message_delivered', data.messageId);

    // уведомляем участников чата об обновлении
    const chatUsers = await this.chatUsersService.getChatUsers(data.chatId);
    for (const user of chatUsers) {
      await this.notifyUserWithChats(user.id);
    }
  }

  @SubscribeMessage('message_read')
  async handleRead(
    @MessageBody() data: {messageId: number; chatId: number},
    @ConnectedSocket() client: Socket,
  ) {
    this.messagesService.markAsRead(data.messageId);
    this.server.to(`chat_${data.chatId}`).emit('message_read', data.messageId);

    const chatUsers = await this.chatUsersService.getChatUsers(data.chatId);
    for (const user of chatUsers) {
      await this.notifyUserWithChats(user.id);
    }
  }

  // ---------------typing----------------------------//

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
