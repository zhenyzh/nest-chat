import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import type {SendMessageDto} from './dto/send-message.dto';
import {Message} from './messages.entity';
import {UserDto} from '../users/dto/user.dto';
import {User} from '../users/users.entity';
import {EventEmitter2} from '@nestjs/event-emitter';
import fs from 'fs';
import path from 'path';

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
      attachments: dto.attachments ?? [],
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
      .set({isSent: true, isRead: true, isDelivered: true})
      .where('chatId = :chatId', {chatId})
      .andWhere('senderId != :userId', {userId})
      .andWhere('isRead = false')
      .execute();
  }

  async sendAudio(
    dto: {chatId: number; senderId: number; clientId?: string},
    file: Express.Multer.File,
  ) {
    const fileUrl = await this.uploadAudio(file);

    const message = this.messageRepository.create({
      chatId: Number(dto.chatId),
      senderId: Number(dto.senderId),
      clientId: dto.clientId,
      text:'',
      audio: {
        id: `${Date.now()}`,
        url: fileUrl,
        name: file.originalname,
        type: 'audio',
        size: file.size,
      },
      isSent: true,
    });

    const saved = await this.messageRepository.save(message);

    const sender = await this.userRepository.findOneBy({
      id: saved.senderId,
    });

    const fullMessage = {
      ...saved,
      sender: new UserDto(sender!),
    };

    this.eventEmitter.emit('message.send', fullMessage);

    return fullMessage;
  }

  async uploadAudio(file: Express.Multer.File) {
    const filename = `${Date.now()}-${file.originalname}`;
    const uploadDir = path.join(process.cwd(), 'uploads/audio');
    await fs.promises.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, filename);
    await fs.promises.writeFile(filePath, file.buffer);
    return `http://localhost:5000/uploads/audio/${filename}`;
  }
}
