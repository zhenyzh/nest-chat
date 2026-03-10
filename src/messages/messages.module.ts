import {Module} from '@nestjs/common';
import {MessagesService} from './messages.service';
import {SequelizeModule} from '@nestjs/sequelize';
import {Message} from './messages.model';

@Module({
  imports: [SequelizeModule.forFeature([Message])],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
