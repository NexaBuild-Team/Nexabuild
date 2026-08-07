import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// ─── Filter shape for GET /architecture/designs ──────────────────────────────
export interface DesignFilters {
  style?: string;
  bedrooms?: number;
  bathrooms?: number;
  minPrice?: bigint;
  maxPrice?: bigint;
}

// NOTE: The architecture models (HouseDesign, DesignDetail, etc.) are defined
// in backend/prisma/schema/architecture.prisma. They will be fully typed by
// @prisma/client once migrations are run against the Neon database. Until then,
// prisma is cast to `any` for the new models so the build stays clean.
// The `architectureCompany` model is in the current client with its original
// 3 fields — it will gain the new fields after migration.

@Injectable()
export class ArchitectureService {
  constructor(private readonly prisma: PrismaService) {}

  // ───────────────────────────────────────────────────────────────────────────
  // GET /architecture
  // Returns all architecture companies with their nested relations.
  // Powers the ArchitecturePage company listing cards.
  // ───────────────────────────────────────────────────────────────────────────
  async findAllCompanies() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = this.prisma as any;
    return db.architectureCompany.findMany({
      include: {
        specializations: { orderBy: { label: 'asc' } },
        services:        { orderBy: { sortOrder: 'asc' } },
        teamMembers:     { orderBy: { sortOrder: 'asc' } },
        testimonials:    { orderBy: { createdAt: 'desc' } },
        _count: {
          select: { houseDesigns: true },
        },
      },
      orderBy: { rating: 'desc' },
    });
  }

  // ───────────────────────────────────────────────────────────────────────────
  // GET /architecture/:id
  // Returns a single company profile for the DesignsPage firm profile view.
  // ───────────────────────────────────────────────────────────────────────────
  async findOneCompany(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = this.prisma as any;
    const company = await db.architectureCompany.findUnique({
      where: { id },
      include: {
        specializations: { orderBy: { label: 'asc' } },
        services:        { orderBy: { sortOrder: 'asc' } },
        teamMembers:     { orderBy: { sortOrder: 'asc' } },
        testimonials:    { orderBy: { createdAt: 'desc' } },
        houseDesigns: {
          include: { tags: true },
          orderBy: { createdAt: 'desc' },
          take: 9,
        },
      },
    });

    if (!company) {
      throw new NotFoundException(`Architecture company with id "${id}" not found.`);
    }

    return company;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // GET /architecture/designs
  // Returns a filterable list of HouseDesign listing cards.
  // Supports: style, bedrooms (gte), bathrooms (gte), minPrice, maxPrice.
  // ───────────────────────────────────────────────────────────────────────────
  async findAllDesigns(filters: DesignFilters = {}) {
    const { style, bedrooms, bathrooms, minPrice, maxPrice } = filters;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = this.prisma as any;

    return db.houseDesign.findMany({
      where: {
        ...(style     && { style:     { equals: style, mode: 'insensitive' } }),
        ...(bedrooms  && { bedrooms:  { gte: bedrooms  } }),
        ...(bathrooms && { bathrooms: { gte: bathrooms } }),
        ...((minPrice !== undefined || maxPrice !== undefined) && {
          priceLkr: {
            ...(minPrice !== undefined && { gte: minPrice }),
            ...(maxPrice !== undefined && { lte: maxPrice }),
          },
        }),
      },
      include: {
        tags:    true,
        company: {
          select: {
            id:           true,
            name:         true,
            avatarUrl:    true,
            rating:       true,
            reviewCount:  true,
            city:         true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ───────────────────────────────────────────────────────────────────────────
  // GET /architecture/designs/:id
  // Returns a fully hydrated DesignDetail record for the DesignDetailPage.
  // Includes: gallery, floor plans, features, construction phases, review,
  // related project tiles, and the parent HouseDesign + firm info.
  // ───────────────────────────────────────────────────────────────────────────
  async findDesignById(designId: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = this.prisma as any;

    const houseDesign = await db.houseDesign.findUnique({
      where: { id: designId },
      include: {
        tags:    true,
        company: {
          select: {
            id:               true,
            name:             true,
            avatarUrl:        true,
            coverImageUrl:    true,
            rating:           true,
            reviewCount:      true,
            email:            true,
            city:             true,
            country:          true,
            budgetRangeLabel: true,
          },
        },
        detail: {
          include: {
            gallery:              { orderBy: { sortOrder: 'asc' } },
            floorPlans:           { orderBy: { sortOrder: 'asc' } },
            features:             { orderBy: { sortOrder: 'asc' } },
            constructionProgress: { orderBy: { sortOrder: 'asc' } },
            review:               true,
            relatedProjects:      { orderBy: { sortOrder: 'asc' } },
          },
        },
      },
    });

    if (!houseDesign) {
      throw new NotFoundException(`Design with id "${designId}" not found.`);
    }

    return houseDesign;
  }

  // ── Stubs preserved to keep DTO imports stable ────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(_dto: unknown)              { return null; }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(_id: number, _dto: unknown) { return null; }
  remove(_id: number)                { return null; }
}
