import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {User} from './users.entity';
import type {CreateUserDto} from './dto/create-user.dto';

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

  async getAllUsers() {
    return await this.usersRepository.find({select: ['id', 'name', 'email']});
  }

  async getUserByEmail(email: string) {
    return await this.usersRepository.findOne({where: {email}, select: ['id', 'name', 'email']});
  }

  async getUserById(id: number) {
    return await this.usersRepository.findOne({where: {id}, select: ['id', 'name', 'email']});
  }
}
