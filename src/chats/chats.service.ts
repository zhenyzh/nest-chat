import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Chat} from './chats.entity';
import {ChatUser} from '../chat-users/chat-users.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(ChatUser)
    private chatUserRepository: Repository<ChatUser>,
  ) {}

  async openChat(userId1: number, userId2: number) {
    const existingChat = await this.getChatUser(userId1, userId2);

    if (existingChat) {
      return {chatId: existingChat.id};
    }

    const newChat = this.chatRepository.create();
    await this.chatRepository.save(newChat);

    await this.chatUserRepository.save([
      {chatId: newChat.id, userId: userId1},
      {chatId: newChat.id, userId: userId2},
    ]);

    return {chatId: newChat.id};
  }

  async getChat(userId1: number, userId2: number) {
    const existingChat = await this.getChatUser(userId1, userId2);

    if (!existingChat) {
      return null;
    }

    return {chatId: existingChat.id};
  }

  async getChatUser(userId1: number, userId2: number) {
    return await this.chatRepository
      .createQueryBuilder('chat')
      .innerJoin('chat.chatUsers', 'cu1', 'cu1.userId = :userId1', {userId1})
      .innerJoin('chat.chatUsers', 'cu2', 'cu2.userId = :userId2', {userId2})
      .getOne();
  }
}
