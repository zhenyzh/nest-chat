import {Body, Controller, Get, Post} from '@nestjs/common';
import {type CreateUserDto} from './create-user.dto';
import {UsersService} from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  createUser(@Body() userDto: CreateUserDto) {
    return this.usersService.createUser(userDto);
  }

  @Get()
  geAllUsers() {
    return this.usersService.getAllUsers();
  }
}
