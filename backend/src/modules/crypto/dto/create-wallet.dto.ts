import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateWalletDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  privateKey?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  mnemonic?: string;
}
