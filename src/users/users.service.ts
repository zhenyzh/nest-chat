import {EventEmitter2} from '@nestjs/event-emitter';
import fs from 'fs';
import path from 'path';
import * as process from 'node:process';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {ILike, Not, Repository} from 'typeorm';
import {User} from './users.entity';
import type {CreateUserDto} from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private eventEmitter: EventEmitter2,
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = this.usersRepository.create(dto);
    return await this.usersRepository.save(user);
  }

  async getAllUsers(excludeUserId: number, search?: string) {
    return await this.usersRepository.find({
      select: ['id', 'name', 'email', 'avatarUrl'],
      where: {
        id: Not(excludeUserId),
        ...(search && {
          name: ILike(`%${search}%`),
        }),
      },
    });
  }

  async getUserByEmail(email: string) {
    return await this.usersRepository.findOne({where: {email}});
  }

  async getUserById(id: number) {
    return await this.usersRepository.findOne({
      where: {id},
      select: ['id', 'name', 'email', 'avatarUrl'],
    });
  }

  async handleUpload(userId: number, file: Express.Multer.File) {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, {recursive: true});

    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadsDir, fileName);

    fs.writeFileSync(filePath, file.buffer);

    const avatarUrl = `uploads/${fileName}`;
    await this.usersRepository.update(userId, {avatarUrl});

    this.eventEmitter.emit('users.avatar_updated', {userId, avatarUrl});

    return {avatarUrl};
  }
}
