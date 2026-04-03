import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import cookieParser from 'cookie-parser';
import {join} from 'path';
import type {NestExpressApplication} from '@nestjs/platform-express';
import * as process from 'node:process';

async function start() {
  const PORT = process.env.PORT ?? 5000;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');
  app.use(cookieParser());

  app.enableCors({
    origin: String(process.env.CLIENT_URL),
    credentials: true,
  });

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(PORT, () => console.log(`Server start on port = ${PORT} `));
}

start();
