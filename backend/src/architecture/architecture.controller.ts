import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ArchitectureService } from './architecture.service';

// ─────────────────────────────────────────────────────────────────────────────
// ArchitectureController
//
// Route prefix: /architecture
//
// Endpoint → Frontend page mapping:
//   GET  /architecture              → ArchitecturePage  (company listing grid)
//   GET  /architecture/designs      → DesignsPage       (house design card grid)
//   GET  /architecture/designs/:id  → DesignDetailPage  (single design detail)
//   GET  /architecture/:id          → Firm profile (DesignsPage hero)
//
// IMPORTANT: /designs and /designs/:id are declared BEFORE /:id so NestJS
// does not accidentally match the literal string "designs" as a company id.
// ─────────────────────────────────────────────────────────────────────────────

@Controller('architecture')
export class ArchitectureController {
  constructor(private readonly architectureService: ArchitectureService) {}

  // ── GET /architecture ──────────────────────────────────────────────────────
  // All companies with specializations, services, team and testimonials.
  @Get()
  findAllCompanies() {
    return this.architectureService.findAllCompanies();
  }

  // ── GET /architecture/designs ─────────────────────────────────────────────
  // Filterable house-design card grid.
  // Query params (all optional, all strings — parsed internally):
  //   style      → design style e.g. "Modern"
  //   bedrooms   → minimum bedrooms  (integer string)
  //   bathrooms  → minimum bathrooms (integer string)
  //   minPrice   → minimum LKR price (integer string)
  //   maxPrice   → maximum LKR price (integer string)
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
  // Fully hydrated detail page record including gallery, floor plans, review.
  @Get('designs/:id')
  findDesignById(@Param('id') id: string) {
    return this.architectureService.findDesignById(id);
  }

  // ── GET /architecture/:id ─────────────────────────────────────────────────
  // Single company profile for the DesignsPage firm profile hero.
  @Get(':id')
  findOneCompany(@Param('id') id: string) {
    return this.architectureService.findOneCompany(id);
  }
}
