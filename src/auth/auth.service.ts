import {Injectable, UnauthorizedException, HttpException, HttpStatus} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import {UsersService} from '../users/users.service';
import {TokensService} from '../token/tokens.service';
import type {CreateUserDto} from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
  ) {}

  async registration(dto: CreateUserDto) {
    const candidate = await this.usersService.getUserByEmail(dto.email);
    if (candidate) {
      throw new HttpException(`Пользователь с таким email уже существует`, HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 5);
    const user = await this.usersService.createUser({...dto, password: hashedPassword});

    const tokens = this.tokensService.generateTokens({id: user.id, email: user.email});
    await this.tokensService.saveToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
    };
  }

  async login(dto: CreateUserDto) {
    const user = await this.usersService.getUserByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Некорректный email или пароль');

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!user && !passwordMatches) throw new UnauthorizedException('Некорректный email или пароль');

    const tokens = this.tokensService.generateTokens({id: user.id, email: user.email});
    await this.tokensService.saveToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
    };
  }

  async logout(refreshToken: string) {
    if (!refreshToken) return;
    await this.tokensService.removeToken(refreshToken);
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) throw new UnauthorizedException();

    const userData = this.tokensService.validateRefreshToken(refreshToken);
    const tokenFromDb = await this.tokensService.findToken(refreshToken);

    if (!userData || !tokenFromDb) throw new UnauthorizedException();

    const user = await this.usersService.getUserById(userData.id);
    if (!user) throw new UnauthorizedException();

    const tokens = this.tokensService.generateTokens({id: user.id, email: user.email});
    await this.tokensService.saveToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
    };
  }
}
