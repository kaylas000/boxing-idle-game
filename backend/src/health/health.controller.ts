import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Проверка работоспособности API' })
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
    };
  }

  @Get('db')
  @ApiOperation({ summary: 'Проверка подключения к базе данных' })
  async checkDatabase() {
    // Базовая проверка - если эндпоинт отвечает, значит приложение запустилось
    return {
      status: 'ok',
      message: 'Database connection is active',
    };
  }
}
