import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {MessagesService} from './messages.service';
import {Message} from './messages.entity';
import {ChatModuleGateway} from '../chat-gateway/chat.module';
import {User} from '../users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, User]), ChatModuleGateway],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
