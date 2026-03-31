import {Module} from '@nestjs/common';
import {ChatGateway} from './chat.gateway';
import {MessagesModule} from '../messages/messages.module';
import {ChatUsersModule} from '../chat-users/chat-users.module';

@Module({
  imports: [MessagesModule, ChatUsersModule],
  providers: [ChatGateway],
  exports: [ChatGateway],
})
export class ChatModuleGateway {}
