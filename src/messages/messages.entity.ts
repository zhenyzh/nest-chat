import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import {User} from '../users/users.entity';
import {Chat} from '../chats/chats.entity';

@Entity({name: 'messages'})
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chatId: number;

  @Column()
  senderId: number;

  @Column({ nullable: true })
  clientId?: string;

  @Column({type: 'text', nullable: false})
  text: string;

  @CreateDateColumn({type: 'timestamp'})
  createdAt: Date;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({name: 'senderId'})
  sender: User;

  @ManyToOne(() => Chat, chat => chat.id)
  @JoinColumn({name: 'chatId'})
  chat: Chat;
}
