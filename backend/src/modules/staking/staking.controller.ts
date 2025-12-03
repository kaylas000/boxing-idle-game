import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { StakingService } from './staking.service';
import { Player } from '../player/entities/player.entity';
import { StakeDto } from './dto/stake.dto';
import { UnstakeDto } from './dto/unstake.dto';

@ApiTags('staking')
@Controller('staking')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StakingController {
  constructor(private readonly stakingService: StakingService) {}

  @Get('info')
  @ApiOperation({ summary: 'Информация о стейкинге' })
  async getStakingInfo(@CurrentUser() player: Player) {
    return this.stakingService.getStakingInfo(player.id);
  }

  @Post('stake')
  @ApiOperation({ summary: 'Застейкать токены' })
  async stake(
    @CurrentUser() player: Player,
    @Body() stakeDto: StakeDto,
  ) {
    return this.stakingService.stake(player.id, stakeDto.amount, stakeDto.duration);
  }

  @Post('unstake')
  @ApiOperation({ summary: 'Вывести застейканные токены' })
  async unstake(
    @CurrentUser() player: Player,
    @Body() unstakeDto: UnstakeDto,
  ) {
    return this.stakingService.unstake(player.id, unstakeDto.stakeId);
  }

  @Post('claim-rewards')
  @ApiOperation({ summary: 'Получить награды со стейкинга' })
  async claimRewards(@CurrentUser() player: Player) {
    return this.stakingService.claimStakingRewards(player.id);
  }

  @Get('pools')
  @ApiOperation({ summary: 'Пулы стейкинга' })
  async getStakingPools() {
    return this.stakingService.getStakingPools();
  }

  @Get('apy')
  @ApiOperation({ summary: 'Текущий APY' })
  async getAPY() {
    return this.stakingService.calculateAPY();
  }
}
