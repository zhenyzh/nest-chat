import {forwardRef, Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {UsersModule} from '../users/users.module';
import {JwtModule} from '@nestjs/jwt';
import {TokensService} from '../token/tokens.service';
import {TOKEN} from '../../utils/token';
import {TokensModule} from '../token/tokens.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    forwardRef(() => UsersModule),
    TokensModule,
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {expiresIn: TOKEN.ACCESS.STRING},
    }),
  ],
  exports: [AuthService, JwtModule, TokensModule],
})
export class AuthModule {}
