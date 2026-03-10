import {Body, Controller, Post} from '@nestjs/common';
import {ChatsService} from './chats.service';

@Controller('chats')
export class ChatsController {
  constructor(private chatsService: ChatsService) {}

  @Post('open')
  openChat(@Body() body: {userId1: number; userId2: number}) {
    return this.chatsService.openChat(body.userId1, body.userId2);
  }
}
