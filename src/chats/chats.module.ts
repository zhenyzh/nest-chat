import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { Chat } from './chats.entity';
import { ChatUser } from '../chat-users/chat-users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, ChatUser])],
  controllers: [ChatsController],
  providers: [ChatsService],
})
export class ChatsModule {}
