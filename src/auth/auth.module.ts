import {forwardRef, Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {UsersModule} from '../users/users.module';
import {TokensModule} from '../token/tokens.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    forwardRef(() => UsersModule),
    TokensModule,
  ],
  exports: [AuthService, TokensModule],
})
export class AuthModule {}
