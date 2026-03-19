import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import type {SendMessageDto} from './dto/send-message.dto';
import {Message} from './messages.entity';
import {UserDto} from '../users/dto/user.dto';
import {ChatGateway} from '../chat-gateway/chat.gateway';
import {User} from '../users/users.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private chatGateway: ChatGateway,
  ) {}

  async sendMessage(dto: SendMessageDto) {
    const message = this.messageRepository.create({
      chatId: dto.chatId,
      senderId: dto.senderId,
      text: dto.text,
      clientId: dto?.clientId
    });

    const savedMessage = await this.messageRepository.save(message);

    const sender = await this.userRepository.findOneBy({id: savedMessage.senderId});

    const fullMessage = {
      ...savedMessage,
      sender: new UserDto(sender!),
    };
    console.log({fullMessage});
    this.chatGateway.sendMessageToChat(fullMessage);

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
}
