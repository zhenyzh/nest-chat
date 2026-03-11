import {Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {MessagesService} from './messages.service';
import {Message} from './messages.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
