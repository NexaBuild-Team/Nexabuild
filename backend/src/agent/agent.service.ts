import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IsString, IsOptional, IsArray } from 'class-validator';

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

  async getDashboardData(userId?: string) {
    const propertyWhere = userId ? { agentId: userId } : {};
    const landWhere = userId ? { agentId: userId } : {};

    const [
      totalPropertiesCount,
      totalLandsCount,
      propertiesList,
      landsList,
      enquiriesCount,
      notifications,
      activities
    ] = await Promise.all([
      this.prisma.property.count({ where: propertyWhere }),
      this.prisma.land.count({ where: landWhere }),
      this.prisma.property.findMany({
        where: propertyWhere,
        take: 10,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.land.findMany({
        where: landWhere,
        take: 10,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.enquiry.count({
        where: userId ? { agentId: userId } : {},
      }),
      this.prisma.notification.findMany({
        where: userId ? { userId } : {},
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.agentActivity.findMany({
        where: userId ? { agentId: userId } : {},
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    // Compute aggregated view counts
    const propertyViewsSubSummary = propertiesList.reduce((acc, p) => acc + (p.views || 0), 0);
    const landViewsSubSummary = landsList.reduce((acc, l) => acc + (l.views || 0), 0);
    const totalViewsCount = propertyViewsSubSummary + landViewsSubSummary;

    // Get saved counts for these properties & lands
    const propIds = propertiesList.map(p => p.id);
    const landIds = landsList.map(l => l.id);

    const [savedPropsCount, savedLandsCount] = await Promise.all([
      this.prisma.savedProperty.count({ where: { propertyId: { in: propIds } } }),
      this.prisma.savedLand.count({ where: { landId: { in: landIds } } }),
    ]);

    const savedByUsersCount = savedPropsCount + savedLandsCount;

    // Map unified listings table
    const tableListings = [
      ...propertiesList.map(p => ({
        id: p.id,
        title: p.title,
        type: 'PROPERTY' as const,
        status: p.status || 'Active',
        views: p.views || 0,
        saved: 0,
        imageUrl: (p.images && p.images.length > 0) ? p.images[0] : '/hero_property.png',
      })),
      ...landsList.map(l => ({
        id: l.id,
        title: l.name,
        type: 'LAND' as const,
        status: l.status || 'Active',
        views: l.views || 0,
        saved: 0,
        imageUrl: (l.images && l.images.length > 0) ? l.images[0] : '/property_card_1.png',
      }))
    ].slice(0, 8);

    // Format locations distribution
    const locationCounts: Record<string, number> = {};
    propertiesList.forEach(p => {
      const loc = p.location.split(',')[0].trim();
      locationCounts[loc] = (locationCounts[loc] || 0) + 1;
    });

    const totalLocs = propertiesList.length || 1;
    const topLocations = Object.entries(locationCounts)
      .map(([loc, count]) => ({
        locationName: loc,
        percentage: Math.round((count / totalLocs) * 100),
      }))
      .slice(0, 4);

    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL'];

    const propertyPerformance = months.map((month, idx) => ({
      month,
      views: propertyViewsSubSummary > 0 ? Math.round(propertyViewsSubSummary * (0.1 + (idx * 0.12))) : 0,
    }));

    const landPerformance = months.map((month, idx) => ({
      month,
      views: landViewsSubSummary > 0 ? Math.round(landViewsSubSummary * (0.1 + (idx * 0.12))) : 0,
    }));

    const monthlyViews = months.map((month, idx) => ({
      month,
      views: propertyPerformance[idx].views + landPerformance[idx].views,
    }));

    return {
      metrics: {
        totalPropertiesCount,
        propertiesGrowthPercent: totalPropertiesCount > 0 ? '+6%' : '0%',
        totalLandsCount,
        landsGrowthPercent: totalLandsCount > 0 ? '+3%' : '0%',
        totalViewsCount: totalViewsCount > 1000 ? `${(totalViewsCount / 1000).toFixed(1)}K` : totalViewsCount,
        viewsGrowthPercent: totalViewsCount > 0 ? '+19%' : '0%',
        savedByUsersCount: savedByUsersCount,
        savedGrowthPercent: savedByUsersCount > 0 ? '+9%' : '0%',
        totalEnquiriesCount: enquiriesCount,
        enquiriesGrowthPercent: enquiriesCount > 0 ? '+23%' : '0%',
        propertyViewsSubSummary,
        landViewsSubSummary,
      },
      propertyPerformance,
      landPerformance,
      monthlyViews,
      listings: tableListings,
      notifications: notifications.map(n => ({
        id: n.id,
        message: n.message,
        timeAgo: 'Just now',
        type: n.type.toLowerCase() as any,
      })),
      activities: activities.map(a => ({
        id: a.id,
        description: a.description,
        timeAgo: 'Today',
        type: a.type as any,
      })),
      topLocations,
    };
  }

  async updateStatus(id: string, type: 'PROPERTY' | 'LAND', newStatus: string) {
    if (type === 'PROPERTY') {
      const exists = await this.prisma.property.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('Property not found');
      return this.prisma.property.update({
        where: { id },
        data: { status: newStatus },
      });
    } else {
      const exists = await this.prisma.land.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('Land not found');
      return this.prisma.land.update({
        where: { id },
        data: { status: newStatus },
      });
    }
  }

  async deleteListing(id: string, type: 'PROPERTY' | 'LAND') {
    if (type === 'PROPERTY') {
      return this.prisma.property.delete({ where: { id } });
    } else {
      return this.prisma.land.delete({ where: { id } });
    }
  }

  async createProperty(userId: string | undefined, dto: CreatePropertyDto) {
    const rawPrice = dto.price;
    const numPrice = typeof rawPrice === 'string'
      ? parseFloat(rawPrice.replace(/[^0-9.]/g, '')) || 100000
      : (typeof rawPrice === 'number' ? rawPrice : 100000);

    const rawArea = dto.area || dto.floorArea || dto.landArea;
    const numArea = typeof rawArea === 'string'
      ? parseFloat(rawArea.replace(/[^0-9.]/g, '')) || 1500
      : (typeof rawArea === 'number' ? rawArea : 1500);

    const numBeds = Number(dto.bedrooms || dto.beds || 3);
    const numBaths = Number(dto.bathrooms || dto.baths || 2);
    const locStr = dto.location || dto.fullAddress || dto.locationName || `${dto.district || 'Colombo'}, ${dto.province || 'Western'}`;
    const propTitle = dto.title || 'New Property Listing';

    let agentId: string | null = null;
    if (userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        agentId = user.id;
      }
    }

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
        images: Array.isArray(dto.images) && dto.images.length > 0 ? dto.images : ['/hero_property.png'],
        agentId: agentId,
        views: 1,
        status: dto.status === 'Draft' ? 'Pending' : (dto.status || 'Active'),
      },
    });
  }
}
