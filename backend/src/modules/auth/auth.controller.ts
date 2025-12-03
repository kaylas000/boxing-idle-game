import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { TelegramAuthDto } from './dto/telegram-auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('telegram')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Авторизация через Telegram' })
  @ApiResponse({ status: 200, description: 'Успешная авторизация' })
  @ApiResponse({ status: 401, description: 'Неверные данные' })
  async telegramAuth(@Body() telegramAuthDto: TelegramAuthDto) {
    return this.authService.telegramAuth(telegramAuthDto);
  }

  @Post('guest')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Создать гостевой аккаунт' })
  @ApiResponse({ status: 201, description: 'Гостевой аккаунт создан' })
  async guestAuth() {
    return this.authService.createGuestAccount();
  }
}
