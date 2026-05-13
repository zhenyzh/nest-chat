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

  @Column({nullable: true})
  clientId?: string;

  @Column({type: 'text', nullable: false})
  text: string;

  @Column('simple-json', { nullable: true, default: [] })
  attachments: any[];

  @Column('simple-json', { nullable: true })
  audio?: {
    id: string;
    url: string;
    name: string;
    size: number;
    type: 'audio';
  };

  @Column({default: false})
  isSent: boolean;

  @Column({default: false})
  isDelivered: boolean;

  @Column({default: false})
  isRead: boolean;

  @CreateDateColumn({type: 'timestamp'})
  createdAt: Date;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({name: 'senderId'})
  sender: User;

  @ManyToOne(() => Chat, chat => chat.id)
  @JoinColumn({name: 'chatId'})
  chat: Chat;
}
