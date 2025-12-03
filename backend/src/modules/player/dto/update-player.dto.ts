import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdatePlayerDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  username?: string;
}
