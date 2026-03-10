import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/sequelize';
import {Chat} from './chats.model';
import {ChatUser} from '../chat-users/chat-users.model';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat) private chat: typeof Chat,
    @InjectModel(ChatUser) private chatUser: typeof ChatUser,
  ) {}

  async openChat(userId1: number, userId2: number) {
    const existingChat = await this.chat.findOne({
      include: [
        {
          model: ChatUser,
          where: {userId: userId1},
          attributes: [],
        },
        {
          model: ChatUser,
          where: {userId: userId2},
          attributes: [],
        },
      ],
    });

    if (existingChat) {
      return {chatId: existingChat.id};
    }

    const newChat = await this.chat.create();

    await this.chatUser.bulkCreate([
      {chatId: newChat.id, userId: userId1},
      {chatId: newChat.id, userId: userId2},
    ]);

    return {chatId: newChat.id};
  }
}
