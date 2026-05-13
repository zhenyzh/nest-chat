import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import type {SendMessageDto} from './dto/send-message.dto';
import {MessagesService} from './messages.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Post('/send-message')
  sendMessage(@Body() dto: SendMessageDto) {
    return this.messagesService.sendMessage(dto);
  }

  @Post('/send-audio')
  @UseInterceptors(FileInterceptor('file'))
  sendAudio(
    @Body() dto: { chatId: number; senderId: number; clientId?: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.messagesService.sendAudio(dto, file);
  }

  @Get(':chatId')
  getMessages(@Param('chatId') chatId: number) {
    return this.messagesService.getMessages(chatId);
  }
}
