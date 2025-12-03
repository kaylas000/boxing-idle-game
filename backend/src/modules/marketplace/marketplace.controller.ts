import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { MarketplaceService } from './marketplace.service';
import { Player } from '../player/entities/player.entity';
import { CreateListingDto } from './dto/create-listing.dto';
import { BuyNftDto } from './dto/buy-nft.dto';

@ApiTags('marketplace')
@Controller('marketplace')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get('listings')
  @ApiOperation({ summary: 'Получить все листинги NFT' })
  async getListings(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('sort') sort: string = 'recent',
  ) {
    return this.marketplaceService.getListings(page, limit, sort);
  }

  @Get('listings/my')
  @ApiOperation({ summary: 'Мои листинги' })
  async getMyListings(@CurrentUser() player: Player) {
    return this.marketplaceService.getMyListings(player.id);
  }

  @Post('list')
  @ApiOperation({ summary: 'Выставить NFT на продажу' })
  async listNft(
    @CurrentUser() player: Player,
    @Body() listingDto: CreateListingDto,
  ) {
    return this.marketplaceService.createListing(player.id, listingDto);
  }

  @Post('buy/:listingId')
  @ApiOperation({ summary: 'Купить NFT с маркетплейса' })
  async buyNft(
    @CurrentUser() player: Player,
    @Param('listingId') listingId: string,
    @Body() buyDto: BuyNftDto,
  ) {
    return this.marketplaceService.buyNft(player.id, listingId);
  }

  @Delete('listing/:listingId')
  @ApiOperation({ summary: 'Убрать листинг' })
  async cancelListing(
    @CurrentUser() player: Player,
    @Param('listingId') listingId: string,
  ) {
    return this.marketplaceService.cancelListing(player.id, listingId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Статистика маркетплейса' })
  async getMarketStats() {
    return this.marketplaceService.getMarketStats();
  }

  @Get('sales/history')
  @ApiOperation({ summary: 'История продаж' })
  async getSalesHistory(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.marketplaceService.getSalesHistory(page, limit);
  }
}
