import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import type {SendMessageDto} from './dto/send-message.dto';
import {Message} from './messages.entity';
import {UserDto} from '../users/dto/user.dto';
import {User} from '../users/users.entity';
import {EventEmitter2} from '@nestjs/event-emitter';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private eventEmitter: EventEmitter2,
  ) {}

  async sendMessage(dto: SendMessageDto) {
    const message = this.messageRepository.create({
      chatId: dto.chatId,
      senderId: dto.senderId,
      text: dto.text,
      clientId: dto?.clientId,
      isSent: true,
    });

    const savedMessage = await this.messageRepository.save(message);

    const sender = await this.userRepository.findOneBy({id: savedMessage.senderId});

    const fullMessage = {
      ...savedMessage,
      sender: new UserDto(sender!),
    };

    this.eventEmitter.emit('message.send', fullMessage);

    return fullMessage;
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

  async markAsDelivered(messageId: number) {
    await this.messageRepository.update({id: messageId}, {isDelivered: true});
    return await this.messageRepository.findOneBy({id: messageId});
  }

  async markAsRead(messageId: number) {
    await this.messageRepository.update({id: messageId}, {isRead: true});
    return await this.messageRepository.findOneBy({id: messageId});
  }

  async markChatAsRead(chatId: number, userId: number) {
    await this.messageRepository
      .createQueryBuilder()
      .update(Message)
      .set({isRead: true})
      .where('chatId = :chatId', {chatId})
      .andWhere('senderId != :userId', {userId})
      .andWhere('isRead = false')
      .execute();
  }
}
