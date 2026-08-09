import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IsString, IsOptional } from 'class-validator';

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

@Injectable()
export class ConstructionService {
  constructor(private readonly prisma: PrismaService) {}

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
        name: p.name,
        category: p.category || 'Commercial',
        status: p.status || 'Active',
        views: p.views ? p.views.toLocaleString() : '0',
        date: new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      })),
      recentActivities: allProjects.slice(0, 4).map((p: any, idx: number) => ({
        id: idx + 1,
        title: p.status === 'Completed' ? 'Project Completed' : 'New Project Added',
        description: `${p.name} — status set to ${p.status}`,
        timeAgo: 'Recently',
        type: p.status === 'Completed' ? 'complete' : 'project'
      })),
      galleryItems: allProjects.slice(0, 3).map((p: any) => ({
        id: p.id,
        title: p.name,
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
