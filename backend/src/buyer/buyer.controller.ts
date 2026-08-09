import { Controller, Get, Post, Param, UseGuards, Req } from '@nestjs/common';
import { BuyerService } from './buyer.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('buyer')
export class BuyerController {
  constructor(private readonly buyerService: BuyerService) {}

  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  getDashboard(@Req() req: any) {
    return this.buyerService.getDashboardData(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('saved-properties')
  getSavedProperties(@Req() req: any) {
    return this.buyerService.getSavedProperties(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('saved-properties/:propertyId')
  toggleSaveProperty(@Req() req: any, @Param('propertyId') propertyId: string) {
    return this.buyerService.toggleSaveProperty(req.user.id, propertyId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('saved-lands')
  getSavedLands(@Req() req: any) {
    return this.buyerService.getSavedLands(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('saved-lands/:landId')
  toggleSaveLand(@Req() req: any, @Param('landId') landId: string) {
    return this.buyerService.toggleSaveLand(req.user.id, landId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('recently-viewed')
  getRecentlyViewed(@Req() req: any) {
    return this.buyerService.getRecentlyViewed(req.user.id);
  }
}
