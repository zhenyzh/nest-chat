import {Column, DataType, Model, Table, HasMany} from 'sequelize-typescript';
import {Message} from '../messages/messages.model';
import {ChatUser} from '../chat-users/chat-users.model';

@Table({tableName: 'chats'})
export class Chat extends Model {
  @Column({type: DataType.INTEGER, autoIncrement: true, primaryKey: true})
  declare id: number;

  @Column({type: DataType.DATE, defaultValue: DataType.NOW})
  declare createdAt: string;

  @HasMany(() => ChatUser)
  users: ChatUser[];

  @HasMany(() => Message)
  messages: Message[];
}
