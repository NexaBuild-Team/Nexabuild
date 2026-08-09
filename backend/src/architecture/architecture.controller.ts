import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ArchitectureService, CreateHouseDesignDto } from './architecture.service';

@Controller('architecture')
export class ArchitectureController {
  constructor(private readonly architectureService: ArchitectureService) {}

  // ── GET /architecture/dashboard ──────────────────────────────────────────
  @Get('dashboard')
  getDashboardData() {
    return this.architectureService.getDashboardData();
  }

  // ── POST /architecture/projects ──────────────────────────────────────────
  @Post('projects')
  createProject(@Body() dto: CreateHouseDesignDto) {
    return this.architectureService.createProject(dto);
  }

  // ── PATCH /architecture/projects/:id/status ──────────────────────────────
  @Patch('projects/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string
  ) {
    return this.architectureService.updateStatus(id, status);
  }

  // ── DELETE /architecture/projects/:id ─────────────────────────────────────
  @Delete('projects/:id')
  deleteProject(@Param('id') id: string) {
    return this.architectureService.deleteProject(id);
  }

  // ── GET /architecture ──────────────────────────────────────────────────────
  @Get()
  findAllCompanies() {
    return this.architectureService.findAllCompanies();
  }

  // ── GET /architecture/designs ─────────────────────────────────────────────
  @Get('designs')
  findAllDesigns(
    @Query('style')     style?: string,
    @Query('bedrooms')  bedroomsStr?: string,
    @Query('bathrooms') bathroomsStr?: string,
    @Query('minPrice')  minPriceStr?: string,
    @Query('maxPrice')  maxPriceStr?: string,
  ) {
    const bedrooms  = bedroomsStr  ? parseInt(bedroomsStr,  10) : undefined;
    const bathrooms = bathroomsStr ? parseInt(bathroomsStr, 10) : undefined;
    const minPrice  = minPriceStr  ? BigInt(minPriceStr)        : undefined;
    const maxPrice  = maxPriceStr  ? BigInt(maxPriceStr)        : undefined;

    return this.architectureService.findAllDesigns({
      style:     style || undefined,
      bedrooms:  bedrooms  && bedrooms  > 0 ? bedrooms  : undefined,
      bathrooms: bathrooms && bathrooms > 0 ? bathrooms : undefined,
      minPrice:  minPrice  && minPrice  > 0n ? minPrice  : undefined,
      maxPrice:  maxPrice  && maxPrice  > 0n ? maxPrice  : undefined,
    });
  }

  // ── GET /architecture/designs/:id ─────────────────────────────────────────
  @Get('designs/:id')
  findDesignById(@Param('id') id: string) {
    return this.architectureService.findDesignById(id);
  }

  // ── GET /architecture/:id ─────────────────────────────────────────────────
  @Get(':id')
  findOneCompany(@Param('id') id: string) {
    return this.architectureService.findOneCompany(id);
  }
}
