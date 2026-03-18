import {Body, Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import {type Request} from 'express';
import {type CreateUserDto} from './dto/create-user.dto';
import {UsersService} from './users.service';
import {JwtAuthGuard} from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  createUser(@Body() userDto: CreateUserDto) {
    return this.usersService.createUser(userDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  geAllUsers(@Req() req: Request) {
    const user = (req as any).user;
    return this.usersService.getAllUsers(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req: Request) {
    const user = (req as any).user;
    return this.usersService.getUserById(user.id);
  }
}
