import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from 'typeorm';
import {User} from '../users/users.entity';

@Entity({name: 'tokens'})
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'int', unique: true})
  userId: number;

  @OneToOne(() => User)
  @JoinColumn({name: 'userId'})
  user: User;

  @Column({type: 'varchar', nullable: false})
  refreshToken: string;
}
