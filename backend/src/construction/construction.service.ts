import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConstructionService {
  constructor(private prisma: PrismaService) {}

  async findCompanies(query: any) {
    const page = Math.max(1, parseInt(query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || '10', 10)));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.search) {
      where.OR = [{ name: { contains: query.search, mode: 'insensitive' } }, { description: { contains: query.search, mode: 'insensitive' } }];
    }
    if (query.district) where.district = { equals: query.district };
    if (query.minExperience) where.yearsOfExperience = { gte: parseInt(query.minExperience, 10) };
    if (query.specialization) {
      // filter via relation
      where.specializations = { some: { specialization: { name: { equals: query.specialization } } } };
    }
    if (query.minRating) where.rating = { gte: parseFloat(query.minRating) };
    if (query.verified) where.verified = { equals: query.verified === 'true' };
    if (query.featured) where.featured = { equals: query.featured === 'true' };
    if (query.minBudget || query.maxBudget) {
      const gte = query.minBudget ? parseFloat(query.minBudget) : undefined;
      const lte = query.maxBudget ? parseFloat(query.maxBudget) : undefined;
      where.startingBudget = {};
      if (gte !== undefined) where.startingBudget.gte = gte;
      if (lte !== undefined) where.startingBudget.lte = lte;
    }

    // sorting
    const orderBy: any = {};
    switch (query.sort) {
      case 'rating_asc':
        orderBy.rating = 'asc';
        break;
      case 'rating_desc':
      default:
        orderBy.rating = 'desc';
        break;
      case 'experience_asc':
        orderBy.yearsOfExperience = 'asc';
        break;
      case 'experience_desc':
        orderBy.yearsOfExperience = 'desc';
        break;
      case 'budget_asc':
        orderBy.startingBudget = 'asc';
        break;
      case 'budget_desc':
        orderBy.startingBudget = 'desc';
        break;
      case 'newest':
        orderBy.createdAt = 'desc';
        break;
    }

    const [data, total] = await Promise.all([
      this.prisma.constructionCompany.findMany({ where, skip, take: limit, orderBy, include: { images: true } }),
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

  async findOne(id: string) {
    const company = await this.prisma.constructionCompany.findUnique({ where: { id }, include: { projects: true, reviews: true, images: true, specializations: { include: { specialization: true } } } });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async createCompany(data: any) {
    if (!data.name) throw new BadRequestException('name is required');
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    // check duplicate slug
    const exists = await this.prisma.constructionCompany.findUnique({ where: { slug } });
    if (exists) throw new BadRequestException('Duplicate company slug');

    const specializations = data.specializations || [];

    return this.prisma.constructionCompany.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        logo: data.logo,
        district: data.district,
        address: data.address,
        phone: data.phone,
        email: data.email,
        website: data.website,
        yearsOfExperience: data.yearsOfExperience || 0,
        startingBudget: data.startingBudget,
        verified: !!data.verified,
        featured: !!data.featured,
        specializations: {
          create: specializations.map((s: string) => ({
            specialization: {
              connectOrCreate: {
                where: { name: s },
                create: { name: s },
              },
            },
          })),
        },
      },
    });
  }

  async updateCompany(id: string, data: any) {
    const company = await this.prisma.constructionCompany.findUnique({ where: { id } });
    if (!company) throw new NotFoundException('Company not found');
    const updateData: any = { ...data };
    if (data.specializations) {
      // replace specializations: delete existing join rows then create new join rows with connectOrCreate on specialization
      updateData.specializations = {
        deleteMany: {},
        create: data.specializations.map((s: string) => ({
          specialization: { connectOrCreate: { where: { name: s }, create: { name: s } } },
        })),
      };
    }

    return this.prisma.constructionCompany.update({ where: { id }, data: updateData });
  }

  async deleteCompany(id: string) {
    const exists = await this.prisma.constructionCompany.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Company not found');
    return this.prisma.constructionCompany.delete({ where: { id } });
  }

  // Projects
  async findProjects(companyId: string, opts: { page: number; limit: number }) {
    const company = await this.prisma.constructionCompany.findUnique({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Company not found');
    const skip = (opts.page - 1) * opts.limit;
    const [data, total] = await Promise.all([
      this.prisma.constructionProject.findMany({ where: { companyId }, skip, take: opts.limit }),
      this.prisma.constructionProject.count({ where: { companyId } }),
    ]);
    return { data, meta: { page: opts.page, limit: opts.limit, total, totalPages: Math.ceil(total / opts.limit) } };
  }

  async createProject(companyId: string, data: any) {
    const company = await this.prisma.constructionCompany.findUnique({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Company not found');
    const project = await this.prisma.constructionProject.create({ data: { ...data, companyId } });
    await this.prisma.constructionCompany.update({ where: { id: companyId }, data: { projectCount: { increment: 1 } as any } });
    return project;
  }

  async getProject(id: string) {
    const p = await this.prisma.constructionProject.findUnique({
      where: { id },
      include: { company: true },
    })
    if (!p) throw new NotFoundException('Project not found')
    return p
  }

  async updateProject(id: string, data: any) {
    const p = await this.prisma.constructionProject.findUnique({ where: { id } });
    if (!p) throw new NotFoundException('Project not found');
    return this.prisma.constructionProject.update({ where: { id }, data });
  }

  async deleteProject(id: string) {
    const p = await this.prisma.constructionProject.findUnique({ where: { id } });
    if (!p) throw new NotFoundException('Project not found');
    const res = await this.prisma.constructionProject.delete({ where: { id } });
    await this.prisma.constructionCompany.update({ where: { id: p.companyId }, data: { projectCount: { decrement: 1 } as any } });
    return res;
  }

  // Reviews
  async findReviews(companyId: string, opts: { page: number; limit: number }) {
    const company = await this.prisma.constructionCompany.findUnique({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Company not found');
    const skip = (opts.page - 1) * opts.limit;
    const [data, total] = await Promise.all([
      this.prisma.constructionReview.findMany({ where: { companyId }, skip, take: opts.limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.constructionReview.count({ where: { companyId } }),
    ]);
    return { data, meta: { page: opts.page, limit: opts.limit, total, totalPages: Math.ceil(total / opts.limit) } };
  }

  async createReview(companyId: string, data: any) {
    const company = await this.prisma.constructionCompany.findUnique({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Company not found');
    const rating = parseInt(data.rating, 10);
    if (isNaN(rating) || rating < 1 || rating > 5) throw new BadRequestException('rating must be 1-5');

    // create review and recalc aggregates
    const review = await this.prisma.constructionReview.create({ data: { companyId, rating, comment: data.comment } });
    const agg = await this.prisma.constructionReview.aggregate({ where: { companyId }, _avg: { rating: true }, _count: { rating: true } });
    const avg = agg._avg.rating ?? 0;
    const count = agg._count.rating ?? 0;
    await this.prisma.constructionCompany.update({ where: { id: companyId }, data: { rating: avg, reviewCount: count } });
    return review;
  }

  async updateReview(id: string, data: any) {
    const r = await this.prisma.constructionReview.findUnique({ where: { id } });
    if (!r) throw new NotFoundException('Review not found');
    if (data.rating) {
      const rating = parseInt(data.rating, 10);
      if (isNaN(rating) || rating < 1 || rating > 5) throw new BadRequestException('rating must be 1-5');
    }
    const updated = await this.prisma.constructionReview.update({ where: { id }, data });
    const agg = await this.prisma.constructionReview.aggregate({ where: { companyId: updated.companyId }, _avg: { rating: true }, _count: { rating: true } });
    await this.prisma.constructionCompany.update({ where: { id: updated.companyId }, data: { rating: agg._avg.rating ?? 0, reviewCount: agg._count.rating ?? 0 } });
    return updated;
  }

  async deleteReview(id: string) {
    const r = await this.prisma.constructionReview.findUnique({ where: { id } });
    if (!r) throw new NotFoundException('Review not found');
    const deleted = await this.prisma.constructionReview.delete({ where: { id } });
    const agg = await this.prisma.constructionReview.aggregate({ where: { companyId: r.companyId }, _avg: { rating: true }, _count: { rating: true } });
    await this.prisma.constructionCompany.update({ where: { id: r.companyId }, data: { rating: agg._avg.rating ?? 0, reviewCount: agg._count.rating ?? 0 } });
    return deleted;
  }

  async findTopRated(limit = 5) {
    const companies = await this.prisma.constructionCompany.findMany({ orderBy: [{ rating: 'desc' }, { reviewCount: 'desc' }], take: limit, include: { images: true } });
    return companies;
  }

  async getMarketInsights() {
    return this.prisma.constructionMarketInsight.findMany({ orderBy: { year: 'desc' } });
  }
}
