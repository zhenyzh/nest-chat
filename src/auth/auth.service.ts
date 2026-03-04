import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import bcrypt from 'node_modules/bcryptjs';

import type {CreateUserDto} from '../users/create-user.dto';
import {UsersService} from '../users/users.service';
import type {User} from '../users/users.model';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    if (!user) return;
    return this.generateToken(user);
  }

  async registration(userDto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(userDto.email);
    if (candidate) {
      throw new HttpException('Пользователь с таким email уже существует', HttpStatus.BAD_REQUEST);
    }
    const hashPassword = bcrypt.hashSync(userDto.password, 5);
    const user = await this.userService.createUser({...userDto, password: hashPassword});
    return this.generateToken(user);
  }

  private generateToken(user: User) {
    const payload = {id: user.id, email: user.email};
    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);
    if (!user) return;
    const passwordEqual = bcrypt.compareSync(userDto.password, user.password);
    if (user && passwordEqual) {
      return user;
    }
    throw new UnauthorizedException({message: 'Некорректный email или пароль'});
  }
}
