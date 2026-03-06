import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import cookieParser from 'cookie-parser';

async function start() {
  const PORT = process.env.PORT ?? 5000;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(cookieParser());

  app.enableCors({
    origin: String(process.env.CLIENT_URL),
    credentials: true,
  });

  await app.listen(PORT, () => console.log(`Server start on port = ${PORT} `));
}

start();
