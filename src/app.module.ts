import {Module} from '@nestjs/common';
import {UsersModule} from './users/users.module';
import {ConfigModule} from '@nestjs/config';
import {SequelizeModule} from '@nestjs/sequelize';
import {User} from './users/users.model';
import {AuthModule} from './auth/auth.module';
import {TokensService} from './token/tokens.service';
import {Token} from './token/tokens.model';
import { ChatsModule } from './chats/chats.module';
import { ChatUsersService } from './chat-users/chat-users.service';
import { ChatUsersModule } from './chat-users/chat-users.module';
import { MessagesController } from './messages/messages.controller';
import { MessagesModule } from './messages/messages.module';
import { Chat } from './chats/chats.model';
import { ChatUser } from './chat-users/chat-users.model';
import { Message } from './messages/messages.model';

@Module({
  imports: [
    ConfigModule.forRoot({envFilePath: `.${process.env.NODE_ENV}.env`}),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Token, Chat, ChatUser, Message ],
      autoLoadModels: true,
    }),
    UsersModule,
    AuthModule,
    ChatsModule,
    ChatUsersModule,
    MessagesModule,
  ],
  providers: [TokensService, ChatUsersService],
  controllers: [MessagesController],
})
export class AppModule {}
