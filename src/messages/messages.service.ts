import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/sequelize';
import type {SendMessageDto} from './dto/send-message.dto';
import {Message} from './messages.model';

@Injectable()
export class MessagesService {
  constructor(@InjectModel(Message) private messageRepository: typeof Message) {}

  async sendMessage(dto: SendMessageDto) {
    return await this.messageRepository.create({
      chatId: dto.chatId,
      senderId: dto.senderId,
      text: dto.text,
    });
  }

  async getMessages(chatId: number) {
    return await this.messageRepository.findAll({
      where: {chatId},
      order: [['createdAt', 'ASC']],
    });
  }
}
