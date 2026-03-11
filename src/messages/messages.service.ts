import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import type {SendMessageDto} from './dto/send-message.dto';
import {Message} from './messages.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async sendMessage(dto: SendMessageDto) {
    const message = this.messageRepository.create({
      chatId: dto.chatId,
      senderId: dto.senderId,
      text: dto.text,
    });
    return await this.messageRepository.save(message);
  }

  async getMessages(chatId: number) {
    return await this.messageRepository.find({
      where: {chatId},
      order: {createdAt: 'ASC'},
    });
  }
}
