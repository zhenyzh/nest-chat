import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {EventEmitterModule} from '@nestjs/event-emitter';
import {UsersModule} from './users/users.module';
import {ConfigModule} from '@nestjs/config';
import {User} from './users/users.entity';
import {AuthModule} from './auth/auth.module';
import {Token} from './token/tokens.entity';
import {ChatsModule} from './chats/chats.module';
import {ChatUsersService} from './chat-users/chat-users.service';
import {ChatUsersModule} from './chat-users/chat-users.module';
import {MessagesController} from './messages/messages.controller';
import {MessagesModule} from './messages/messages.module';
import {Chat} from './chats/chats.entity';
import {ChatUser} from './chat-users/chat-users.entity';
import {Message} from './messages/messages.entity';
import {TokensModule} from './token/tokens.module';
import {ChatModuleGateway} from './chat-gateway/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({envFilePath: `.${process.env.NODE_ENV}.env`}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [User, Token, Chat, ChatUser, Message],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    ChatsModule,
    ChatUsersModule,
    MessagesModule,
    TokensModule,
    ChatModuleGateway,
    EventEmitterModule.forRoot(),
  ],
  providers: [ChatUsersService],
  controllers: [MessagesController],
})
export class AppModule {}
