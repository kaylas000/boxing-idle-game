import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, Min } from 'class-validator';

export class TransferTokensDto {
  @ApiProperty()
  @IsString()
  recipientAddress: string;

  @ApiProperty()
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ enum: ['BOX', 'NFT'] })
  @IsEnum(['BOX', 'NFT'])
  tokenType: 'BOX' | 'NFT';
}
