import {Body, Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import {ChatsService} from './chats.service';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import type {Request} from 'express';

@Controller('chats')
export class ChatsController {
  constructor(private chatsService: ChatsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('open')
  openChat(@Body() body: {userIdOther: number}, @Req() req: Request) {
    const user = (req as any).user;
    return this.chatsService.openChat(user.id, body.userIdOther);
  }
}
