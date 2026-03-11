import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from 'typeorm';
import {User} from '../users/users.entity';
import {Chat} from '../chats/chats.entity';

@Entity({name: 'chat_users'})
export class ChatUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  chatId: number;

  @Column({type: 'int', default: 0})
  unreadCount: number;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({name: 'userId'})
  user: User;

  @ManyToOne(() => Chat, chat => chat.id)
  @JoinColumn({name: 'chatId'})
  chat: Chat;
}
