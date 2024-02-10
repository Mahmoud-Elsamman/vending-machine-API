import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
require('dotenv').config();

import {
  HttpExceptionFilter,
  ValidationErrorFilter,
} from './filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new ValidationErrorFilter());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.SERVER_PORT, () => {
    console.log('app is listing on port : ', process.env.SERVER_PORT);
  });
}
bootstrap();
