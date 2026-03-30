import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Not, Repository} from 'typeorm';
import {ChatUser} from './chat-users.entity';
import {Message} from '../messages/messages.entity';
import type {ChatUserDto} from './dto/chat-users.dto';
import {UsersService} from '../users/users.service';

@Injectable()
export class ChatUsersService {
  constructor(
    @InjectRepository(ChatUser)
    private chatUserRepository: Repository<ChatUser>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private userService: UsersService,
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
      let createdAt: Date | null = null;
      let isSent = false;
      let isDelivered = false;
      let isRead = true;
      let countUnreadMessage = 0;

      if (chatUser?.chat) {
        const chat = chatUser.chat;

        const lastMessage = await this.messageRepository.findOne({
          where: {chatId: chat.id},
          order: {createdAt: 'DESC'},
        });

        if (lastMessage) {
          createdAt = lastMessage.createdAt;
          lastMessageText = lastMessage.text;
          isSent = lastMessage.isSent;
          isDelivered = lastMessage.isDelivered;
        }

        countUnreadMessage = await this.messageRepository.count({
          where: {
            chatId: chat.id,
            senderId: Not(userId),
            isRead: false,
          },
        });

        isRead = countUnreadMessage === 0;
      }

      result.push({
        id: otherUser.id,
        name: otherUser.name,
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
}
