import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import type {SendMessageDto} from './dto/send-message.dto';
import  {MessagesService} from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Post()
  sendMessage(@Body() dto: SendMessageDto) {
    return this.messagesService.sendMessage(dto);
  }

  @Get(':chatId')
  getMessages(@Param('chatId') chatId: number) {
    return this.messagesService.getMessages(chatId);
  }
}
