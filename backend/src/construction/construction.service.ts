import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { IsString, IsOptional } from 'class-validator';
import { PrismaService } from '../prisma/prisma.service';
import { QueryConstructionCompanyDto } from './dto/query-construction-company.dto';
import { CreateConstructionCompanyDto } from './dto/create-construction-company.dto';
import { UpdateConstructionCompanyDto } from './dto/update-construction-company.dto';

export class CreateConstructionProjectDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  clientName?: string;

  @IsOptional()
  @IsString()
  siteLocation?: string;

  @IsOptional()
  @IsString()
  totalBudget?: string;

  @IsOptional()
  @IsString()
  estimatedCompletion?: string;

  @IsOptional()
  @IsString()
  teamSize?: string;

  @IsOptional()
  @IsString()
  blueprintFileName?: string;

  @IsOptional()
  @IsString()
  visibility?: string;
}

// Full include for company profile endpoint
const COMPANY_FULL_INCLUDE = {
  district: true,
  story: true,
  contact: true,
  services: {
    orderBy: { displayOrder: 'asc' as const },
  },
  brochures: {
    orderBy: { uploadedAt: 'desc' as const },
  },
  projects: {
    orderBy: { displayOrder: 'asc' as const },
    include: {
      images: {
        orderBy: { sortOrder: 'asc' as const },
      },
    },
  },
  reviews: {
    orderBy: { reviewDate: 'desc' as const },
  },
  specializations: {
    include: {
      specialization: true,
    },
  },
  certifications: {
    include: {
      certification: true,
    },
  },
} as const;

// Lightweight include for listing
const COMPANY_LIST_INCLUDE = {
  district: true,
  specializations: {
    include: { specialization: true },
  },
  certifications: {
    include: { certification: true },
  },
} as const;

@Injectable()
export class ConstructionService {
  constructor(private prisma: PrismaService) {}

  // ──────────────────────────────────────────────────────────
  // LIST COMPANIES
  // ──────────────────────────────────────────────────────────

  async findAll(query: QueryConstructionCompanyDto) {
    const page = Math.max(1, parseInt(String(query.page ?? '1'), 10));
    const limit = Math.min(100, Math.max(1, parseInt(String(query.limit ?? '10'), 10)));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { tagline: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.districtId) {
      where.districtId = query.districtId;
    }

    if (query.isVerified !== undefined) {
      where.isVerified = query.isVerified === 'true';
    }

    if (query.isFeatured !== undefined) {
      where.isFeatured = query.isFeatured === 'true';
    }

    if (query.status) {
      where.status = query.status;
    }

    const orderBy: any = {};
    if (query.sortBy) {
      orderBy[query.sortBy] = query.sortOrder ?? 'desc';
    } else {
      orderBy.isFeatured = 'desc';
    }

    const [data, total] = await Promise.all([
      this.prisma.constructionCompany.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: COMPANY_LIST_INCLUDE,
      }),
      this.prisma.constructionCompany.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ──────────────────────────────────────────────────────────
  // GET ONE COMPANY (full profile — by UUID or slug)
  // ──────────────────────────────────────────────────────────

  async findOne(idOrSlug: string) {
    // Search by id first, then fall back to slug
    // (handles both UUID primary keys and string IDs like 'construction-demo-001')
    const company = await this.prisma.constructionCompany.findFirst({
      where: {
        OR: [
          { id: idOrSlug },
          { slug: idOrSlug },
        ],
      },
      include: COMPANY_FULL_INCLUDE,
    });

    if (!company) throw new NotFoundException(`Construction company "${idOrSlug}" not found`);
    return company;
  }

  // ──────────────────────────────────────────────────────────
  // CREATE
  // ──────────────────────────────────────────────────────────

  async create(data: CreateConstructionCompanyDto) {
    if (!data.name) throw new BadRequestException('name is required');

    return this.prisma.constructionCompany.create({
      data: {
        name:             data.name,
        slug:             data.slug,
        tagline:          data.tagline,
        logoUrl:          data.logoUrl,
        coverImageUrl:    data.coverImageUrl,
        districtId:       data.districtId,
        establishedYear:  data.establishedYear,
        yearsInBusiness:  data.yearsInBusiness,
        isVerified:       data.isVerified ?? false,
        isFeatured:       data.isFeatured ?? false,
        status:           (data.status as any) ?? 'active',
        teamSize:         data.teamSize ?? 0,
        budgetMin:        data.budgetMin,
        budgetMax:        data.budgetMax,
      },
      include: COMPANY_FULL_INCLUDE,
    });
  }

  // ──────────────────────────────────────────────────────────
  // UPDATE
  // ──────────────────────────────────────────────────────────

  async update(id: string, data: UpdateConstructionCompanyDto) {
    await this.ensureExists(id);

    return this.prisma.constructionCompany.update({
      where: { id },
      data: {
        ...(data.name            !== undefined && { name: data.name }),
        ...(data.slug            !== undefined && { slug: data.slug }),
        ...(data.tagline         !== undefined && { tagline: data.tagline }),
        ...(data.logoUrl         !== undefined && { logoUrl: data.logoUrl }),
        ...(data.coverImageUrl   !== undefined && { coverImageUrl: data.coverImageUrl }),
        ...(data.districtId      !== undefined && { districtId: data.districtId }),
        ...(data.establishedYear !== undefined && { establishedYear: data.establishedYear }),
        ...(data.yearsInBusiness !== undefined && { yearsInBusiness: data.yearsInBusiness }),
        ...(data.isVerified      !== undefined && { isVerified: data.isVerified }),
        ...(data.isFeatured      !== undefined && { isFeatured: data.isFeatured }),
        ...(data.status          !== undefined && { status: data.status as any }),
        ...(data.teamSize        !== undefined && { teamSize: data.teamSize }),
        ...(data.budgetMin       !== undefined && { budgetMin: data.budgetMin }),
        ...(data.budgetMax       !== undefined && { budgetMax: data.budgetMax }),
      },
      include: COMPANY_FULL_INCLUDE,
    });
  }

  // ──────────────────────────────────────────────────────────
  // SOFT DELETE (suspend)
  // ──────────────────────────────────────────────────────────

  async remove(id: string) {
    await this.ensureExists(id);

    return this.prisma.constructionCompany.update({
      where: { id },
      data: { status: 'suspended' as any },
    });
  }

  // ──────────────────────────────────────────────────────────
  // STORY
  // ──────────────────────────────────────────────────────────

  async getStory(companyId: string) {
    await this.ensureExists(companyId);

    const story = await this.prisma.constructionCompanyStory.findUnique({
      where: { companyId },
    });

    if (!story) throw new NotFoundException(`No story found for company "${companyId}"`);
    return story;
  }

  // ──────────────────────────────────────────────────────────
  // SERVICES
  // ──────────────────────────────────────────────────────────

  async getServices(companyId: string) {
    await this.ensureExists(companyId);

    return this.prisma.constructionService.findMany({
      where: { companyId },
      orderBy: { displayOrder: 'asc' },
    });
  }

  // ──────────────────────────────────────────────────────────
  // PROJECTS
  // ──────────────────────────────────────────────────────────

  async getProjects(companyId: string) {
    await this.ensureExists(companyId);

    return this.prisma.constructionProject.findMany({
      where: { companyId },
      orderBy: { displayOrder: 'asc' },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });
  }

  // ──────────────────────────────────────────────────────────
  // REVIEWS
  // ──────────────────────────────────────────────────────────

  async getReviews(companyId: string) {
    await this.ensureExists(companyId);

    return this.prisma.constructionReview.findMany({
      where: { companyId },
      orderBy: { reviewDate: 'desc' },
    });
  }

  // ──────────────────────────────────────────────────────────
  // CONTACT
  // ──────────────────────────────────────────────────────────

  async getContact(companyId: string) {
    await this.ensureExists(companyId);

    const contact = await this.prisma.constructionContactInfo.findUnique({
      where: { companyId },
    });

    if (!contact) throw new NotFoundException(`No contact info found for company "${companyId}"`);
    return contact;
  }

  // ──────────────────────────────────────────────────────────
  // CERTIFICATIONS
  // ──────────────────────────────────────────────────────────

  async getCertifications(companyId: string) {
    await this.ensureExists(companyId);

    return this.prisma.constructionCompanyCertification.findMany({
      where: { companyId },
      include: { certification: true },
    });
  }

  // ──────────────────────────────────────────────────────────
  // SPECIALIZATIONS
  // ──────────────────────────────────────────────────────────

  async getSpecializations(companyId: string) {
    await this.ensureExists(companyId);

    return this.prisma.constructionCompanySpecialization.findMany({
      where: { companyId },
      include: { specialization: true },
    });
  }

  // ──────────────────────────────────────────────────────────
  // BROCHURES
  // ──────────────────────────────────────────────────────────

  async getBrochures(companyId: string) {
    await this.ensureExists(companyId);

    return this.prisma.constructionBrochure.findMany({
      where: { companyId },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  // ──────────────────────────────────────────────────────────
  // DISTRICTS
  // ──────────────────────────────────────────────────────────

  async getDistricts() {
    return this.prisma.constructionDistrict.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { companies: true } },
      },
    });
  }

  // ──────────────────────────────────────────────────────────
  // MARKET INSIGHTS
  // ──────────────────────────────────────────────────────────

  async getMarketInsights(districtId?: string) {
    return this.prisma.constructionMarketInsight.findMany({
      where: districtId ? { districtId } : undefined,
      include: { district: true },
      orderBy: { monthYear: 'desc' },
    });
  }

  async getMarketInsightsByDistrict(districtId: string) {
    return this.prisma.constructionMarketInsight.findMany({
      where: { districtId },
      include: { district: true },
      orderBy: { monthYear: 'desc' },
    });
  }

  // ──────────────────────────────────────────────────────────
  // REFERENCE DATA
  // ──────────────────────────────────────────────────────────

  async getAllSpecializations() {
    return this.prisma.constructionSpecialization.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async getAllCertifications() {
    return this.prisma.constructionCertification.findMany({
      orderBy: { name: 'asc' },
    });
  }

  // ──────────────────────────────────────────────────────────
  // PRIVATE HELPERS
  // ──────────────────────────────────────────────────────────

  private async ensureExists(id: string): Promise<void> {
    const exists = await this.prisma.constructionCompany.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException(`Construction company "${id}" not found`);
  }

  async getDashboardData() {
    const db = this.prisma as any;
    const allProjects = await db.constructionProject.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const totalViews = allProjects.reduce((acc: number, p: any) => acc + (p.views || 0), 0);
    const completedCount = allProjects.filter((p: any) => p.status === 'Completed').length;

    // Group projects count by service category dynamically
    const serviceCategories = ['Residential', 'Commercial', 'Renovation', 'Interior Design'];
    const totalCount = allProjects.length;

    const services = serviceCategories.map((name) => {
      const count = allProjects.filter((p: any) => p.category?.toLowerCase() === name.toLowerCase()).length;
      const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
      return { name, projectsCount: count, percentage };
    });

    return {
      metrics: {
        totalProjectsCount: totalCount,
        projectsGrowthPercent: totalCount > 0 ? `+${totalCount}` : '0%',
        totalViewsCount: totalViews > 0 ? `${(totalViews / 1000).toFixed(1)}k` : '0',
        viewsGrowthPercent: totalViews > 0 ? '+8.5%' : '0%',
        completedProjectsCount: completedCount,
        completedGrowthPercent: completedCount > 0 ? `+${completedCount}` : '0%',
        clientReviewsRating: totalCount > 0 ? 4.8 : 0,
        ratingGrowth: totalCount > 0 ? '+0.2' : '0',
        onSchedulePercent: totalCount > 0 ? 91 : 0,
        activeNowCount: allProjects.filter((p: any) => p.status === 'Active').length,
      },
      latestProjects: allProjects.map((p: any) => ({
        id: p.id,
        name: p.name || p.title || 'Untitled Project',
        category: p.category || 'Commercial',
        status: p.status || 'Active',
        views: p.views ? p.views.toLocaleString() : '0',
        date: new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      })),
      recentActivities: allProjects.slice(0, 4).map((p: any, idx: number) => ({
        id: idx + 1,
        title: p.status === 'Completed' ? 'Project Completed' : 'New Project Added',
        description: `${p.name || p.title || 'Project'} — status set to ${p.status}`,
        timeAgo: 'Recently',
        type: p.status === 'Completed' ? 'complete' : 'project'
      })),
      galleryItems: allProjects.slice(0, 3).map((p: any) => ({
        id: p.id,
        title: p.name || p.title || 'Untitled Project',
        category: p.category || 'Commercial',
        views: p.views ? `${(p.views / 1000).toFixed(1)}k` : '0',
        imageUrl: '/hero_property.png'
      })),
      services: services
    };
  }

  async createProject(dto: CreateConstructionProjectDto) {
    const db = this.prisma as any;
    return db.constructionProject.create({
      data: {
        name: dto.name || 'Untitled Construction Project',
        title: dto.name || 'Untitled Construction Project',
        category: dto.category || 'Commercial',
        status: dto.status || 'Active',
        description: dto.description || '',
        clientName: dto.clientName || null,
        siteLocation: dto.siteLocation || null,
        totalBudget: dto.totalBudget || null,
        estimatedCompletion: dto.estimatedCompletion || null,
        teamSize: dto.teamSize || null,
        blueprintFileName: dto.blueprintFileName || null,
        visibility: dto.visibility || 'Public',
      }
    });
  }

  async updateStatus(id: string, status: string) {
    const db = this.prisma as any;
    return db.constructionProject.update({
      where: { id },
      data: { status }
    });
  }

  async deleteProject(id: string) {
    const db = this.prisma as any;
    return db.constructionProject.delete({
      where: { id }
    });
  }
}
