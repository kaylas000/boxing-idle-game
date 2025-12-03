import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // API prefix
  const apiPrefix = configService.get('API_PREFIX') || 'api/v1';
  app.setGlobalPrefix(apiPrefix);

  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Boxing Champion API')
    .setDescription('API для игры Boxing Champion - Idle Manager')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Авторизация и аутентификация')
    .addTag('player', 'Управление игроком')
    .addTag('training', 'Тренировки')
    .addTag('fight', 'Бои')
    .addTag('cards', 'Коллекция карт')
    .addTag('shop', 'Магазин')
    .addTag('leaderboard', 'Таблица лидеров')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get('PORT') || 3000;
  await app.listen(port);

  console.log(`🥊 Boxing Game Backend запущен на http://localhost:${port}`);
  console.log(`📚 API документация: http://localhost:${port}/api/docs`);
}

bootstrap();
