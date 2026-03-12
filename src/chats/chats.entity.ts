import {Entity, PrimaryGeneratedColumn, CreateDateColumn, OneToMany} from 'typeorm';
import {Message} from '../messages/messages.entity';
import { ChatUser } from '../chat-users/chat-users.entity';

@Entity({name: 'chats'})
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({type: 'timestamp'})
  createdAt: Date;

  @OneToMany(() => ChatUser, chatUser => chatUser.chat)
  chatUsers: ChatUser[];

  @OneToMany(() => Message, message => message.chat)
  messages: Message[];
}
