import {Body, Controller, Post} from '@nestjs/common';
import {ChatsService} from './chats.service';

@Controller('chats')
export class ChatsController {
  constructor(private chatsService: ChatsService) {}

  @Post('open')
  openChat(@Body() body: {userIdMe: number; userIdOther: number}) {
    return this.chatsService.openChat(body.userIdMe, body.userIdOther);
  }
}
