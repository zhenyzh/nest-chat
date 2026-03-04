import {Column, DataType, Model, Table} from 'sequelize-typescript';

interface UserCreationsAttrs {
  email: string;
  password: string;
}

@Table({tableName: 'users'})
export class User extends Model<User, UserCreationsAttrs> {
  @Column({type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true})
  declare id: number;

  @Column({type: DataType.STRING, allowNull: false})
  declare name: string;

  @Column({type: DataType.STRING, unique: true, primaryKey: true, allowNull: false})
  declare email: string;

  @Column({type: DataType.STRING, allowNull: false})
  declare password: string;
}
