import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { QuestsService } from './quests.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('quests')
@Controller('quests')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class QuestsController {
  constructor(private readonly questsService: QuestsService) {}

  @Get('daily')
  @ApiOperation({ summary: 'Получить ежедневные квесты' })
  @ApiResponse({ status: 200, description: 'Список активных квестов' })
  async getDailyQuests(@Request() req) {
    let quests = await this.questsService.getActiveQuests(req.user.id);
    
    // Если нет активных - сгенерировать
    if (quests.length === 0) {
      quests = await this.questsService.generateDailyQuests(req.user.id);
    }
    
    return quests;
  }

  @Post('generate')
  @ApiOperation({ summary: 'Генерировать новые квесты (если старые истекли)' })
  @ApiResponse({ status: 201, description: 'Новые квесты сгенерированы' })
  async generateQuests(@Request() req) {
    const quests = await this.questsService.generateDailyQuests(req.user.id);
    return {
      message: 'Ежедневные квесты обновлены!',
      quests,
    };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Статистика выполненных квестов' })
  @ApiResponse({ status: 200, description: 'Статистика квестов' })
  async getStats(@Request() req) {
    return this.questsService.getQuestStats(req.user.id);
  }
}
