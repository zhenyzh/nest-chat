import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ChatUser} from './chat-users.entity';
import {ChatUsersService} from './chat-users.service';
import {ChatUsersController} from './chat-users.controller';
import {Message} from '../messages/messages.entity';
import {User} from '../users/users.entity';
import { UsersService } from '../users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChatUser, Message, User])],
  controllers: [ChatUsersController],
  providers: [ChatUsersService, UsersService],
})
export class ChatUsersModule {}
