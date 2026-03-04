import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import bcrypt from 'bcryptjs';
import {UsersService} from '../users/users.service';
import {TokensService} from '../token/tokens.service';
import type {CreateUserDto} from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private tokensService: TokensService,
  ) {}

  async registration(userDto: CreateUserDto) {
    const candidate = await this.validateUser(userDto);
    if (candidate) {
      throw new HttpException('Пользователь с таким email уже существует', HttpStatus.BAD_REQUEST);
    }
    const hashPassword = bcrypt.hashSync(userDto.password, 5);
    const user = await this.userService.createUser({...userDto, password: hashPassword});
    const token = this.tokensService.generateTokens({id: user.id, email: user.email});
    await this.tokensService.saveToken(user.id, token.refreshToken);
    return {user, ...token};
  }

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    if (!user) return;

    const tokens = this.tokensService.generateTokens({id: user.id, email: user.email});
    await this.tokensService.saveToken(user.id, tokens.refreshToken);

    return {user, ...tokens};
  }

  async logout(refreshToken: string) {
    await this.tokensService.removeToken(refreshToken);
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException();

    const userData = this.tokensService.validateRefreshToken(refreshToken);
    const tokenFromDb = await this.tokensService.findToken(refreshToken);

    if (!userData || !tokenFromDb) throw new UnauthorizedException();

    const user = await this.userService.getUserById(userData.id);
    if (!user) throw new UnauthorizedException();

    const tokens = this.tokensService.generateTokens({id: user.id, email: user.email});
    await this.tokensService.saveToken(user.id, tokens.refreshToken);

    return {user, ...tokens};
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
