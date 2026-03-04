import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {Token} from './tokens.model';
import {TOKEN} from '../../utils/token';

@Injectable()
export class TokensService {
  constructor(private readonly jwtService: JwtService) {}

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
    const token = await Token.findOne({where: {userId}});
    if (token) {
      token.refreshToken = refreshToken;
      return token.save();
    }
    return Token.create({userId, refreshToken});
  }

  async removeToken(refreshToken: string) {
    return Token.destroy({where: {refreshToken}});
  }

  async findToken(refreshToken: string) {
    return Token.findOne({where: {refreshToken}});
  }

  validateRefreshToken(token: string) {
    try {
      return this.jwtService.verify(token, {secret: process.env.JWT_REFRESH_SECRET});
    } catch {
      return null;
    }
  }
}
