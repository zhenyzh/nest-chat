import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from '../users/users.model';
import { Chat } from '../chats/chats.model';

@Table({tableName: 'chat_users'})

export class ChatUser extends Model{
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
  declare id: number;

  @ForeignKey(()=>User)
  @Column({})
  userId: number;

  @ForeignKey(() => Chat)
  @Column
  chatId: number;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  unreadCount: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Chat)
  chat: Chat;

}