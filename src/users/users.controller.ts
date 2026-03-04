import {Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
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
  geAllUsers() {
    return this.usersService.getAllUsers();
  }
}
