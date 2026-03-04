import {Column, DataType, Model, Table, ForeignKey} from 'sequelize-typescript';
import {User} from '../users/users.model';

interface TokenCreationsAttrs {
  userId: number;
  refreshToken: string;
}

@Table({tableName: 'tokens'})
export class Token extends Model<Token, TokenCreationsAttrs> {
  @Column({type: DataType.INTEGER, primaryKey: true, autoIncrement: true})
  declare id: number;

  @ForeignKey(() => User)
  @Column({type: DataType.INTEGER, unique: true})
  declare userId: number;

  @Column({type: DataType.STRING, allowNull: false})
  declare refreshToken: string;
}
