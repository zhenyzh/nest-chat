import {Body, Controller, Get, Param, Post, Req, UseGuards} from '@nestjs/common';
import {ChatsService} from './chats.service';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';
import type {Request} from 'express';

@Controller('chats')
export class ChatsController {
  constructor(private chatsService: ChatsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('open')
  openChat(@Body() body: {recipientId: number}, @Req() req: Request) {
    const user = (req as any).user;
    return this.chatsService.openChat(user.id, body.recipientId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('current/:recipientId')
  getChat(@Param('recipientId') recipientId: number, @Req() req: Request) {
    const user = (req as any).user;
    return this.chatsService.getChat(user.id, recipientId);
  }
}
