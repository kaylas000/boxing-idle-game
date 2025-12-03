import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ClaimRewardsDto {
  @ApiProperty({ enum: ['daily', 'win', 'level_up'] })
  @IsString()
  rewardType: string;
}
