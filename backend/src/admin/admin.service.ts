import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardData() {
    const db = this.prisma as any;

    const [
      totalUsers,
      totalProperties,
      totalLands,
      recentUsers,
      latestProps,
      latestLands,
      pendingProps,
      pendingLands,
    ] = await Promise.all([
      db.user.count(),
      db.property ? db.property.count() : 0,
      db.land ? db.land.count() : 0,
      db.user.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
      db.property ? db.property.findMany({ take: 4, orderBy: { createdAt: 'desc' } }) : [],
      db.land ? db.land.findMany({ take: 4, orderBy: { createdAt: 'desc' } }) : [],
      db.property ? db.property.findMany({ where: { status: 'Pending' }, take: 5 }) : [],
      db.land ? db.land.findMany({ where: { status: 'Pending' }, take: 5 }) : [],
    ]);

    const totalCompanies = (
      (db.constructionCompany ? await db.constructionCompany.count() : 0) +
      (db.architectureCompany ? await db.architectureCompany.count() : 0)
    );

    // Monthly distribution (Jul -> Jan)
    const monthNames = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
    
    // Default zero-filled arrays if DB is empty
    const userGrowthData = monthNames.map((month, idx) => ({
      month,
      count: idx === monthNames.length - 1 ? totalUsers : 0,
    }));

    const propertyGrowthData = monthNames.map((month, idx) => ({
      month,
      count: idx === monthNames.length - 1 ? totalProperties : 0,
    }));

    const landGrowthData = monthNames.map((month, idx) => ({
      month,
      count: idx === monthNames.length - 1 ? totalLands : 0,
    }));

    const aiBarData = monthNames.map((month) => ({
      month,
      count: 0,
    }));

    // Format Registrations
    const registrations = recentUsers.map((u: any) => ({
      id: u.id,
      name: u.firstName ? `${u.firstName} ${u.lastName || ''}`.trim() : (u.email ? u.email.split('@')[0] : 'User'),
      email: u.email,
      role: u.role || 'Property Buyer',
      district: u.district || 'N/A',
      date: new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: u.status || 'Active',
    }));

    // Format Latest Properties
    const formattedProperties = latestProps.map((p: any) => ({
      id: p.id,
      title: p.title || 'Untitled Property',
      location: p.location || p.city || 'N/A',
      price: p.price ? `LKR ${Number(p.price).toLocaleString()}` : 'LKR 0',
      type: p.listingType || p.propertyType || 'SALE',
      status: p.status || 'Active',
      imageUrl: p.images?.[0] || '/property_card_1.png',
    }));

    // Format Latest Lands
    const formattedLands = latestLands.map((l: any) => ({
      id: l.id,
      title: l.title || 'Untitled Land',
      location: l.location || l.city || 'N/A',
      price: l.price ? `LKR ${Number(l.price).toLocaleString()}` : 'LKR 0',
      type: 'LAND',
      status: l.status || 'Active',
      imageUrl: l.images?.[0] || '/hero_property.png',
    }));

    // Format Pending Governance
    const governanceListings = [
      ...pendingProps.map((p: any) => ({
        id: p.id,
        title: p.title,
        type: 'Property',
        owner: 'Owner',
        district: p.location || 'N/A',
        price: p.price ? `LKR ${Number(p.price).toLocaleString()}` : 'LKR 0',
        status: 'Pending',
      })),
      ...pendingLands.map((l: any) => ({
        id: l.id,
        title: l.title,
        type: 'Land',
        owner: 'Owner',
        district: l.location || 'N/A',
        price: l.price ? `LKR ${Number(l.price).toLocaleString()}` : 'LKR 0',
        status: 'Pending',
      })),
    ];

    return {
      kpiStats: [
        { name: 'TOTAL USERS', value: totalUsers.toLocaleString(), change: totalUsers > 0 ? `+${totalUsers}` : '0%', isPositive: totalUsers > 0 },
        { name: 'TOTAL PROPERTIES', value: totalProperties.toLocaleString(), change: totalProperties > 0 ? `+${totalProperties}` : '0%', isPositive: totalProperties > 0 },
        { name: 'TOTAL LANDS', value: totalLands.toLocaleString(), change: totalLands > 0 ? `+${totalLands}` : '0%', isPositive: totalLands > 0 },
        { name: 'TOTAL COMPANIES', value: totalCompanies.toLocaleString(), change: totalCompanies > 0 ? `+${totalCompanies}` : '0%', isPositive: totalCompanies > 0 },
      ],
      userGrowthData,
      propertyGrowthData,
      landGrowthData,
      aiBarData,
      registrations,
      latestProperties: formattedProperties,
      latestLands: formattedLands,
      governanceListings,
      popularDistricts: [],
      activities: [],
      notifications: [],
      systemHealth: {
        cpuUsage: 0,
        memoryUsage: 0,
        apiUptime: 100,
        storageUsedGb: 0,
        storageTotalGb: 2000,
      },
    };
  }

  async getUsers() {
    const db = this.prisma as any;
    const users = await db.user.findMany({ orderBy: { createdAt: 'desc' } });
    const activeCount = users.filter((u: any) => (u.status || 'Active') === 'Active').length;
    const pendingCount = users.filter((u: any) => u.status === 'Pending').length;
    const suspendedCount = users.filter((u: any) => u.status === 'Suspended').length;

    return {
      metrics: {
        totalUsersCount: users.length,
        activeCount,
        pendingCount,
        suspendedCount,
      },
      users: users.map((u: any) => ({
        id: u.id,
        name: u.firstName ? `${u.firstName} ${u.lastName || ''}`.trim() : (u.email ? u.email.split('@')[0] : 'User'),
        avatar: u.firstName ? u.firstName[0].toUpperCase() : 'U',
        role: u.role || 'Property Buyer',
        email: u.email,
        status: u.status || 'Active',
        joined: new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        lastLogin: 'Recently',
      })),
    };
  }

  async getProperties() {
    const db = this.prisma as any;
    const props = db.property ? await db.property.findMany({ orderBy: { createdAt: 'desc' } }) : [];
    const lands = db.land ? await db.land.findMany({ orderBy: { createdAt: 'desc' } }) : [];

    const activeCount = props.filter((p: any) => (p.status || 'Active') === 'Active').length;
    const pendingCount = props.filter((p: any) => p.status === 'Pending').length;
    const rejectedCount = props.filter((p: any) => p.status === 'Rejected').length;

    return {
      metrics: {
        totalPropertiesCount: props.length + lands.length,
        activeCount,
        pendingCount,
        rejectedCount,
      },
      properties: [
        ...props.map((p: any) => ({
          id: p.id,
          title: p.title || 'Untitled Property',
          category: p.propertyType || 'Property',
          owner: 'Property Owner',
          district: p.location || 'N/A',
          price: p.price ? `LKR ${Number(p.price).toLocaleString()}` : 'LKR 0',
          status: p.status || 'Active',
          type: 'Property',
          date: new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          imageUrl: p.images?.[0] || '/property_card_1.png',
        })),
        ...lands.map((l: any) => ({
          id: l.id,
          title: l.title || 'Untitled Land',
          category: 'Land',
          owner: 'Land Owner',
          district: l.location || 'N/A',
          price: l.price ? `LKR ${Number(l.price).toLocaleString()}` : 'LKR 0',
          status: l.status || 'Active',
          type: 'Land',
          date: new Date(l.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          imageUrl: l.images?.[0] || '/hero_property.png',
        })),
      ],
    };
  }

  async getAnalyticsData() {
    const db = this.prisma as any;
    const [totalUsers, totalProperties, totalLands] = await Promise.all([
      db.user.count(),
      db.property ? db.property.count() : 0,
      db.land ? db.land.count() : 0,
    ]);

    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
    const trafficData = months.map((month) => ({ month, pageViews: 0, uniqueVisitors: 0 }));
    const conversionData = months.map((month) => ({ month, leads: 0, inquiries: 0 }));

    return {
      overviewMetrics: {
        totalTrafficCount: 0,
        avgSessionDuration: '0m 0s',
        conversionRatePercent: '0%',
        aiMatchesCount: 0,
      },
      trafficData,
      conversionData,
      userDemographics: [],
      propertyTypeBreakdown: [
        { type: 'Properties', count: totalProperties, percentage: totalProperties > 0 ? 50 : 0 },
        { type: 'Lands', count: totalLands, percentage: totalLands > 0 ? 50 : 0 },
      ],
    };
  }

  async updateUser(id: string, data: { firstName?: string; lastName?: string; email?: string; role?: string; district?: string; status?: string }) {
    const db = this.prisma as any;
    return db.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: string) {
    const db = this.prisma as any;
    return db.user.delete({
      where: { id },
    });
  }
}
