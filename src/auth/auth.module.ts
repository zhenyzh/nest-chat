import {forwardRef, Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {UsersModule} from '../users/users.module';
import {JwtModule} from '@nestjs/jwt';
import {TokensService} from '../token/tokens.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, TokensService],
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {expiresIn: '1d'},
    }),
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
