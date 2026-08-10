import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IsString, IsOptional, IsArray, IsEmail } from 'class-validator';

export class CreateAgentDto {
  @IsString()
  firstName!: string;
  lastName!: string;
  email!: string;
  phone!: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}

export class UpdateAgentDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}

export class CreatePropertyDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  price?: any;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  locationName?: string;

  @IsOptional()
  @IsString()
  fullAddress?: string;

  @IsOptional()
  bedrooms?: any;

  @IsOptional()
  bathrooms?: any;

  @IsOptional()
  beds?: any;

  @IsOptional()
  baths?: any;

  @IsOptional()
  garage?: any;

  @IsOptional()
  area?: any;

  @IsOptional()
  floorArea?: any;

  @IsOptional()
  landArea?: any;

  @IsOptional()
  yearBuilt?: any;

  @IsOptional()
  @IsString()
  propertyType?: string;

  @IsOptional()
  @IsString()
  listingType?: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  amenities?: any;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsArray()
  aiTags?: string[];

  @IsOptional()
  visibility?: any;
}

@Injectable()
export class AgentService {
  constructor(private prisma: PrismaService) {}

  // ============================================================
  // AGENT CRUD
  // ============================================================

  async getAllAgents() {
    return this.prisma.agent.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getAgentById(id: string) {
    const agent = await this.prisma.agent.findUnique({
      where: { id },
    });

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    return agent;
  }

  async createAgent(dto: CreateAgentDto) {
    const existingAgent = await this.prisma.agent.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (existingAgent) {
      throw new ConflictException('An agent with this email already exists');
    }

    return this.prisma.agent.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        company: dto.company,
        avatar: dto.avatar,
      },
    });
  }

  async updateAgent(id: string, dto: UpdateAgentDto) {
    const existingAgent = await this.prisma.agent.findUnique({
      where: { id },
    });

    if (!existingAgent) {
      throw new NotFoundException('Agent not found');
    }

    if (dto.email && dto.email !== existingAgent.email) {
      const emailExists = await this.prisma.agent.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (emailExists) {
        throw new ConflictException('Another agent already uses this email');
      }
    }

    return this.prisma.agent.update({
      where: { id },
      data: {
        ...(dto.firstName !== undefined && {
          firstName: dto.firstName,
        }),

        ...(dto.lastName !== undefined && {
          lastName: dto.lastName,
        }),

        ...(dto.email !== undefined && {
          email: dto.email,
        }),

        ...(dto.phone !== undefined && {
          phone: dto.phone,
        }),

        ...(dto.company !== undefined && {
          company: dto.company,
        }),

        ...(dto.avatar !== undefined && {
          avatar: dto.avatar,
        }),
      },
    });
  }

  async deleteAgent(id: string) {
    const existingAgent = await this.prisma.agent.findUnique({
      where: { id },
    });

    if (!existingAgent) {
      throw new NotFoundException('Agent not found');
    }

    await this.prisma.agent.delete({
      where: { id },
    });

    return {
      message: 'Agent deleted successfully',
      id,
    };
  }

  // ============================================================
  // AGENT DASHBOARD
  // ============================================================

  async getDashboardData(userId?: string) {
    const propertiesList = await this.prisma.property.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const landsList = await this.prisma.land.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalPropertiesCount = await this.prisma.property.count();

    const totalLandsCount = await this.prisma.land.count();

    const propertyViewsSubSummary = propertiesList.reduce(
      (acc, property) => acc + (property.views || 0),
      0,
    );

    const landViewsSubSummary = 0;

    const totalViewsCount = propertyViewsSubSummary + landViewsSubSummary;

    const tableListings = [
      ...propertiesList.map((property) => ({
        id: property.id,
        title: property.title,
        type: 'PROPERTY' as const,
        status: property.status || 'Active',
        views: property.views || 0,
        saved: 0,
        imageUrl:
          property.images && property.images.length > 0
            ? property.images[0]
            : '/hero_property.png',
      })),

      ...landsList.map((land) => ({
        id: land.id,
        title: land.name,
        type: 'LAND' as const,
        status: land.status || 'Active',
        views: 0,
        saved: 0,
        imageUrl:
          land.images && land.images.length > 0
            ? land.images[0]
            : '/property_card_1.png',
      })),
    ].slice(0, 8);

    const locationCounts: Record<string, number> = {};

    propertiesList.forEach((property) => {
      const location = property.location.split(',')[0].trim();

      locationCounts[location] = (locationCounts[location] || 0) + 1;
    });

    const totalLocations = propertiesList.length || 1;

    const topLocations = Object.entries(locationCounts)
      .map(([location, count]) => ({
        locationName: location,
        percentage: Math.round((count / totalLocations) * 100),
      }))
      .slice(0, 4);

    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL'];

    const propertyPerformance = months.map((month, index) => ({
      month,
      views:
        propertyViewsSubSummary > 0
          ? Math.round(propertyViewsSubSummary * (0.1 + index * 0.12))
          : 0,
    }));

    const landPerformance = months.map((month, index) => ({
      month,
      views:
        landViewsSubSummary > 0
          ? Math.round(landViewsSubSummary * (0.1 + index * 0.12))
          : 0,
    }));

    const monthlyViews = months.map((month, index) => ({
      month,
      views: propertyPerformance[index].views + landPerformance[index].views,
    }));

    return {
      metrics: {
        totalPropertiesCount,

        propertiesGrowthPercent: totalPropertiesCount > 0 ? '+6%' : '0%',

        totalLandsCount,

        landsGrowthPercent: totalLandsCount > 0 ? '+3%' : '0%',

        totalViewsCount:
          totalViewsCount > 1000
            ? `${(totalViewsCount / 1000).toFixed(1)}K`
            : totalViewsCount,

        viewsGrowthPercent: totalViewsCount > 0 ? '+19%' : '0%',

        savedByUsersCount: 0,
        savedGrowthPercent: '0%',

        totalEnquiriesCount: 0,
        enquiriesGrowthPercent: '0%',

        propertyViewsSubSummary,
        landViewsSubSummary,
      },

      propertyPerformance,
      landPerformance,
      monthlyViews,

      listings: tableListings,

      notifications: [],
      activities: [],

      topLocations,

      agentId: userId || null,
    };
  }

  // ============================================================
  // LISTING STATUS
  // ============================================================

  async updateStatus(id: string, type: 'PROPERTY' | 'LAND', newStatus: string) {
    if (type === 'PROPERTY') {
      const exists = await this.prisma.property.findUnique({
        where: { id },
      });

      if (!exists) {
        throw new NotFoundException('Property not found');
      }

      return this.prisma.property.update({
        where: { id },
        data: {
          status: newStatus,
        },
      });
    }

    const exists = await this.prisma.land.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException('Land not found');
    }

    return this.prisma.land.update({
      where: { id },
      data: {
        status: newStatus,
      },
    });
  }

  // ============================================================
  // DELETE LISTING
  // ============================================================

  async deleteListing(id: string, type: 'PROPERTY' | 'LAND') {
    if (type === 'PROPERTY') {
      const exists = await this.prisma.property.findUnique({
        where: { id },
      });

      if (!exists) {
        throw new NotFoundException('Property not found');
      }

      return this.prisma.property.delete({
        where: { id },
      });
    }

    const exists = await this.prisma.land.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException('Land not found');
    }

    return this.prisma.land.delete({
      where: { id },
    });
  }

  // ============================================================
  // CREATE PROPERTY
  // ============================================================

  async createProperty(userId: string | undefined, dto: CreatePropertyDto) {
    const rawPrice = dto.price;

    const numPrice =
      typeof rawPrice === 'string'
        ? parseFloat(rawPrice.replace(/[^0-9.]/g, '')) || 100000
        : typeof rawPrice === 'number'
          ? rawPrice
          : 100000;

    const rawArea = dto.area || dto.floorArea || dto.landArea;

    const numArea =
      typeof rawArea === 'string'
        ? parseFloat(rawArea.replace(/[^0-9.]/g, '')) || 1500
        : typeof rawArea === 'number'
          ? rawArea
          : 1500;

    const numBeds = Number(dto.bedrooms || dto.beds || 3);

    const numBaths = Number(dto.bathrooms || dto.baths || 2);

    const locStr =
      dto.location ||
      dto.fullAddress ||
      dto.locationName ||
      `${dto.district || 'Colombo'}, ${dto.province || 'Western'}`;

    const propTitle = dto.title || 'New Property Listing';

    return this.prisma.property.create({
      data: {
        title: propTitle,
        description: dto.description || '',
        price: numPrice,
        location: locStr,
        bedrooms: numBeds,
        bathrooms: numBaths,
        area: numArea,
        propertyType: dto.propertyType || 'Villa',
        listingType: dto.listingType || 'Sell',
        images:
          Array.isArray(dto.images) && dto.images.length > 0
            ? dto.images
            : ['/hero_property.png'],

        views: 1,
        status: dto.status === 'Draft' ? 'Pending' : dto.status || 'Active',
      },
    });
  }
}
