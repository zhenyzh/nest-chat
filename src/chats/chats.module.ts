import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { Chat } from './chats.entity';
import { ChatUser } from '../chat-users/chat-users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, ChatUser])],
  controllers: [ChatsController],
  providers: [ChatsService],
})
export class ChatsModule {}
