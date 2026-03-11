import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Token} from './tokens.entity';
import {TOKEN} from '../../utils/token';

@Injectable()
export class TokensService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
  ) {}

  generateTokens(payload: {id: number; email: string}) {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: TOKEN.ACCESS.STRING,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: TOKEN.REFRESH.STRING,
    });

    return {accessToken, refreshToken};
  }

  async saveToken(userId: number, refreshToken: string) {
    const token = await this.tokenRepository.findOne({where: {userId}});
    if (token) {
      token.refreshToken = refreshToken;
      return this.tokenRepository.save(token);
    }
    const newToken = this.tokenRepository.create({userId, refreshToken});
    return this.tokenRepository.save(newToken);
  }

  async removeToken(refreshToken: string) {
    return this.tokenRepository.delete({refreshToken});
  }

  async findToken(refreshToken: string) {
    return this.tokenRepository.findOne({where: {refreshToken}});
  }

  validateRefreshToken(token: string) {
    try {
      return this.jwtService.verify(token, {secret: process.env.JWT_REFRESH_SECRET});
    } catch {
      return null;
    }
  }
}
