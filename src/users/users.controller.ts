import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {type Request} from 'express';
import {FileInterceptor} from '@nestjs/platform-express';
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

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    console.log('FILE:', file)
    const userId = (req as any).user.id;
    return this.usersService.handleUpload(userId, file);
  }
}
