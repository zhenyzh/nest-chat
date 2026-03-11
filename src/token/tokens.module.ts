import { Global, Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Token} from './tokens.entity';
import {TokensService} from './tokens.service';
import {JwtModule} from '@nestjs/jwt';
import {TOKEN} from '../../utils/token';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Token]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {expiresIn: TOKEN.ACCESS.STRING},
    }),
  ],
  providers: [TokensService],
  exports: [TokensService, JwtModule],
})
export class TokensModule {}
