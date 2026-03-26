import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {MessagesService} from './messages.service';
import {Message} from './messages.entity';
import {User} from '../users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, User])],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
