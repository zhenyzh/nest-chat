import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Not, Repository} from 'typeorm';
import {User} from './users.entity';
import type {CreateUserDto} from './dto/create-user.dto';
import fs from 'fs';
import path from 'path';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = this.usersRepository.create(dto);
    return await this.usersRepository.save(user);
  }

  async getAllUsers(excludeUserId: number) {
    return await this.usersRepository.find({
      select: ['id', 'name', 'email', 'avatarUrl'],
      where: {
        id: Not(excludeUserId),
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
    const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, {recursive: true});

    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadsDir, fileName);

    fs.writeFileSync(filePath, file.buffer);

    const avatarUrl = `uploads/${fileName}`;
    await this.usersRepository.update(userId, {avatarUrl});

    return {avatarUrl};
  }
}
