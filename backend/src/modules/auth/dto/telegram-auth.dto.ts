import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class TelegramAuthDto {
  @ApiProperty({ description: 'Telegram user ID' })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'Имя пользователя' })
  @IsString()
  first_name: string;

  @ApiProperty({ description: 'Фамилия пользователя', required: false })
  @IsString()
  @IsOptional()
  last_name?: string;

  @ApiProperty({ description: 'Username в Telegram', required: false })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ description: 'URL фото профиля', required: false })
  @IsString()
  @IsOptional()
  photo_url?: string;

  @ApiProperty({ description: 'Время авторизации' })
  @IsNumber()
  auth_date: number;

  @ApiProperty({ description: 'Хэш для проверки' })
  @IsString()
  hash: string;
}
