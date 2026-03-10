import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Chat } from './chats.model';
import { ChatUser } from '../chat-users/chat-users.model';

@Module({
  imports: [SequelizeModule.forFeature([Chat, ChatUser])],
  controllers: [ChatsController],
  providers: [ChatsService],
})
export class ChatsModule {}
