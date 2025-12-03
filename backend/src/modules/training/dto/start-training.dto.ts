import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class StartTrainingDto {
  @ApiProperty({ description: 'ID тренировки' })
  @IsString()
  trainingId: string;
}
