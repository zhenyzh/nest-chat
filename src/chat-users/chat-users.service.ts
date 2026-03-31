import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Not, Repository} from 'typeorm';
import {ChatUser} from './chat-users.entity';
import {Message} from '../messages/messages.entity';
import type {ChatUserDto} from './dto/chat-users.dto';
import {UsersService} from '../users/users.service';
import { Chat } from '../chats/chats.entity';

@Injectable()
export class ChatUsersService {
  constructor(
    @InjectRepository(ChatUser)
    private chatUserRepository: Repository<ChatUser>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private userService: UsersService,
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
  ) {}

  async getUsersWithChats(userId: number) {
    const allUsers = await this.userService.getAllUsers(userId);

    const result: ChatUserDto[] = [];

    for (const otherUser of allUsers) {
      const chatUser = await this.chatUserRepository
        .createQueryBuilder('cu1')
        .leftJoinAndSelect('cu1.chat', 'chat')
        .leftJoin('chat.chatUsers', 'cu2')
        .where('cu1.userId = :userId', {userId})
        .andWhere('cu2.userId = :otherUserId', {otherUserId: otherUser.id})
        .getOne();

      let lastMessageText = '';
      let typedI: boolean = false;
      let createdAt: Date | null = null;
      let isSent = false;
      let isDelivered = false;
      let isRead = false;
      let countUnreadMessage = 0;

      if (chatUser?.chat) {
        const chat = chatUser.chat;

        const lastMessage = await this.messageRepository.findOne({
          where: {chatId: chat.id},
          order: {createdAt: 'DESC'},
        });

        if (lastMessage) {
          typedI = lastMessage.senderId === userId;
          createdAt = lastMessage.createdAt;
          lastMessageText = lastMessage.text;

          if (typedI) {
            isSent = lastMessage.isSent;
            isDelivered = lastMessage.isDelivered;
            isRead = lastMessage.isRead;
          } else {
            isSent = false;
            isDelivered = false;
            isRead = false;
          }
        }

        countUnreadMessage = await this.messageRepository.count({
          where: {
            chatId: chat.id,
            senderId: Not(userId),
            isRead: false,
          },
        });

        if (lastMessage) {
          isRead = lastMessage.isRead;
        }
      }

      result.push({
        id: otherUser.id,
        name: otherUser.name,
        typedI,
        lastMessage: lastMessageText,
        createdAt,
        isSent,
        isDelivered,
        isRead,
        countUnreadMessage,
      });
    }

    return result;
  }

  async getChatUsers(chatId: number) {
    const chat = await this.chatRepository.findOne({
      where: {id: chatId},
      relations: ['chatUsers', 'chatUsers.user'],
    });
    return chat?.chatUsers.map(cu => cu.user) || [];
  }
}
