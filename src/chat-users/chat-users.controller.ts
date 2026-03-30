import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import {ChatUsersService} from './chat-users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('chat-users')
export class ChatUsersController {
  constructor(private chatUsersService: ChatUsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getUsersWithChats(@Req() req) {
    return this.chatUsersService.getUsersWithChats(req.user.id);
  }
}
