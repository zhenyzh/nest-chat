import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import type {SendMessageDto} from './dto/send-message.dto';
import {Message} from './messages.entity';
import {UserDto} from '../users/dto/user.dto';

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
    const messages = await this.messageRepository.find({
      where: {chatId},
      relations: ['sender'],
      order: {createdAt: 'ASC'},
    });

    return messages.map(m => ({
      ...m,
      sender: new UserDto(m.sender),
    }));
  }
}
