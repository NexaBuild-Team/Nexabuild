import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateHouseDesignDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  style?: string;

  @IsOptional()
  @IsNumber()
  priceLkr?: number;

  @IsOptional()
  @IsString()
  architectName?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsNumber()
  bedrooms?: number;

  @IsOptional()
  @IsNumber()
  bathrooms?: number;

  @IsOptional()
  @IsNumber()
  sqftArea?: number;

  @IsOptional()
  @IsString()
  locationLabel?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

export interface DesignFilters {
  style?: string;
  bedrooms?: number;
  bathrooms?: number;
  minPrice?: bigint;
  maxPrice?: bigint;
}

@Injectable()
export class ArchitectureService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllCompanies() {
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

  async findOneCompany(id: string) {
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

  async findAllDesigns(filters: DesignFilters = {}) {
    const { style, bedrooms, bathrooms, minPrice, maxPrice } = filters;
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

  async findDesignById(designId: string) {
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

  // ─── Architect Dashboard Endpoints ─────────────────────────────────────────

  async getDashboardData() {
    const db = this.prisma as any;
    const allDesigns = await db.houseDesign.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const totalViews = allDesigns.reduce((acc: number, d: any) => acc + (d.views || 0), 0);
    const mostViewed = [...allDesigns].sort((a: any, b: any) => (b.views || 0) - (a.views || 0))[0] || null;

    // Group design styles count dynamically from DB
    const styleMap: Record<string, number> = {};
    allDesigns.forEach((d: any) => {
      const st = d.style || 'Modern';
      styleMap[st] = (styleMap[st] || 0) + 1;
    });

    const designStyles = Object.entries(styleMap).map(([name, count]) => ({ name, count }));

    return {
      metrics: {
        portfolioViewsCount: totalViews,
        viewsGrowthPercent: totalViews > 0 ? '+12.4%' : '0%',
        totalProjectsCount: allDesigns.length,
        projectsGrowthCount: allDesigns.length > 0 ? `+${allDesigns.length}` : '0',
        housePlansCount: allDesigns.length,
        plansGrowthCount: allDesigns.length > 0 ? `+${allDesigns.length}` : '0',
        threeDDesignsCount: allDesigns.length,
        designsGrowthCount: allDesigns.length > 0 ? `+${allDesigns.length}` : '0',
        followersCount: 0,
        followersGrowthPercent: '0%',
      },
      latestPortfolio: allDesigns.slice(0, 3).map((d: any) => ({
        id: d.id,
        title: d.title,
        tag: (d.style || 'MODERN').toUpperCase(),
        views: d.views || 0,
        likes: d.likes || 0,
        img: d.imageUrl || '/hero_property.png'
      })),
      mostViewedDesign: mostViewed ? {
        id: mostViewed.id,
        title: mostViewed.title,
        tag: (mostViewed.style || 'LUXURY').toUpperCase(),
        views: mostViewed.views || 0,
        likes: mostViewed.likes || 0,
        bookmarks: 0,
        img: mostViewed.imageUrl || '/hero_property.png'
      } : null,
      housePlans: allDesigns.map((d: any) => ({
        id: d.id,
        title: d.title,
        beds: d.bedrooms || 0,
        baths: d.bathrooms || 0,
        sqft: d.sqftArea ? Number(d.sqftArea).toLocaleString() : '0',
        img: d.imageUrl || '/hero_property.png'
      })),
      tableProjects: allDesigns.map((d: any) => ({
        id: d.id,
        name: d.title,
        views: d.views || 0,
        likes: d.likes || 0,
        status: d.status || 'Active',
        date: new Date(d.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        icon: '/svg/home.svg'
      })),
      galleryItems: allDesigns.slice(0, 5).map((d: any) => ({
        name: d.title,
        imgUrl: d.imageUrl || '/hero_property.png'
      })),
      designStyles: designStyles
    };
  }

  async createProject(dto: CreateHouseDesignDto) {
    const db = this.prisma as any;
    return db.houseDesign.create({
      data: {
        title: dto.title || 'Untitled Design',
        style: dto.style || 'Modern',
        priceLkr: Number(dto.priceLkr) || 5000000,
        architectName: dto.architectName || 'NexaBuild Studio',
        imageUrl: dto.imageUrl || '/hero_property.png',
        bedrooms: Number(dto.bedrooms) || 3,
        bathrooms: Number(dto.bathrooms) || 2,
        sqftArea: Number(dto.sqftArea) || 2500,
        locationLabel: dto.locationLabel || 'Colombo',
        status: dto.status || 'Active',
      }
    });
  }

  async updateStatus(id: string, status: string) {
    const db = this.prisma as any;
    return db.houseDesign.update({
      where: { id },
      data: { status }
    });
  }

  async deleteProject(id: string) {
    const db = this.prisma as any;
    return db.houseDesign.delete({
      where: { id }
    });
  }
}
