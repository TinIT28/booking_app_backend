import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // loại bỏ field dư
      forbidNonWhitelisted: true, // ném lỗi nếu gửi field rác
      transform: true, // auto ép kiểu
    }),
  );

  await app.listen(5050);

  console.log('App connect susccess with port: 5050');
}
bootstrap();
