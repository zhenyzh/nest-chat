import {Column, DataType, Model, Table, ForeignKey, BelongsTo} from 'sequelize-typescript';

import {User} from '../users/users.model';
import {Chat} from '../chats/chats.model';

@Table({tableName: 'messages'})

export class Message extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @ForeignKey(() => Chat)
  @Column
  chatId: number;

  @ForeignKey(() => User)
  @Column
  senderId: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  text: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  declare createdAt: Date;

  @BelongsTo(() => User)
  sender: User;

  @BelongsTo(() => Chat)
  chat: Chat;
}
