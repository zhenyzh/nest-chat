import {Controller, Post, Body, Res, Req, Get} from '@nestjs/common';
import type {Response, Request} from 'express';
import {AuthService} from './auth.service';
import type {CreateUserDto} from '../users/dto/create-user.dto';
import {TOKEN} from '../../utils/token';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  async registration(@Body() dto: CreateUserDto, @Res({passthrough: true}) res: Response) {
    const {refreshToken} = await this.authService.registration(dto);
    this.setRefreshTokenCookie(res, refreshToken);

    return {message: 'Успешная регистрация'};
  }

  @Post('login')
  async login(@Body() dto: CreateUserDto, @Res({passthrough: true}) res: Response) {
    const {accessToken, refreshToken} = await this.authService.login(dto);
    this.setRefreshTokenCookie(res, refreshToken);

    return {accessToken};
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({passthrough: true}) res: Response) {
    const refreshToken = req.cookies?.['refreshToken'];
    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }
    this.clearRefreshTokenCookie(res);

    return {message: 'Выход выполнен успешно'};
  }

  @Get('refresh')
  async refresh(@Req() req: Request, @Res({passthrough: true}) res: Response) {
    const cookieRefreshToken = req.cookies?.['refreshToken'];
    const {accessToken, refreshToken} = await this.authService.refresh(cookieRefreshToken);
    this.setRefreshTokenCookie(res, refreshToken);

    return {accessToken};
  }

  private setRefreshTokenCookie(res: Response, token: string) {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      maxAge: TOKEN.REFRESH.MILLISECONDS,
    });
  }

  private clearRefreshTokenCookie(res: Response) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
    });
  }
}
