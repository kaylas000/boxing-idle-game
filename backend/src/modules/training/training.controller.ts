import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TrainingService } from './training.service';
import { Player } from '../player/entities/player.entity';
import { StartTrainingDto } from './dto/start-training.dto';

@ApiTags('training')
@Controller('training')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @Get('available')
  @ApiOperation({ summary: 'Получить доступные тренировки' })
  async getAvailableTrainings() {
    return this.trainingService.getAvailableTrainings();
  }

  @Post('start')
  @ApiOperation({ summary: 'Начать тренировку' })
  async startTraining(
    @CurrentUser() player: Player,
    @Body() startTrainingDto: StartTrainingDto,
  ) {
    return this.trainingService.startTraining(player.id, startTrainingDto.trainingId);
  }
}
