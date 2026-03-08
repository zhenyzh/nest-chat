import { Module } from '@nestjs/common';
import { ChatUsersController } from './chat-users.controller';

@Module({
  controllers: [ChatUsersController]
})
export class ChatUsersModule {}
