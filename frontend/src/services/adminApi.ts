import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export interface AdminDashboardData {
  kpiStats: Array<{
    name: string;
    value: string | number;
    change: string;
    isPositive: boolean;
  }>;
  userGrowthData: Array<{ month: string; count: number }>;
  propertyGrowthData: Array<{ month: string; count: number }>;
  landGrowthData: Array<{ month: string; count: number }>;
  aiBarData: Array<{ month: string; count: number }>;
  registrations: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    district: string;
    date: string;
    status: string;
  }>;
  latestProperties: Array<{
    id: string;
    title: string;
    location: string;
    price: string;
    type: string;
    status: string;
    imageUrl?: string;
  }>;
  latestLands: Array<{
    id: string;
    title: string;
    location: string;
    price: string;
    type: string;
    status: string;
    imageUrl?: string;
  }>;
  governanceListings: Array<{
    id: string;
    title: string;
    type: string;
    owner: string;
    district: string;
    price: string;
    status: string;
  }>;
  popularDistricts: Array<{ name: string; count: number }>;
  activities: Array<{ title: string; time: string; type: string }>;
  notifications: Array<{ title: string; badgeBg: string; textColor: string }>;
  systemHealth: {
    cpuUsage: number;
    memoryUsage: number;
    apiUptime: number;
    storageUsedGb: number;
    storageTotalGb: number;
  };
}

export interface AdminUserManagementData {
  metrics: {
    totalUsersCount: number;
    activeCount: number;
    pendingCount: number;
    suspendedCount: number;
  };
  users: Array<{
    id: string;
    name: string;
    avatar: string;
    role: string;
    email: string;
    status: 'Active' | 'Pending' | 'Suspended';
    joined: string;
    lastLogin: string;
  }>;
}

export interface AdminPropertyManagementData {
  metrics: {
    totalPropertiesCount: number;
    activeCount: number;
    pendingCount: number;
    rejectedCount: number;
  };
  properties: Array<{
    id: string;
    title: string;
    category: string;
    owner: string;
    district: string;
    price: string;
    status: 'Active' | 'Pending' | 'Rejected';
    type: 'Property' | 'Land';
    date: string;
    imageUrl?: string;
  }>;
}

export interface AdminAnalyticsData {
  overviewMetrics: {
    totalTrafficCount: number;
    avgSessionDuration: string;
    conversionRatePercent: string;
    aiMatchesCount: number;
  };
  trafficData: Array<{ month: string; pageViews: number; uniqueVisitors: number }>;
  conversionData: Array<{ month: string; leads: number; inquiries: number }>;
  userDemographics: Array<{ category: string; count: number; percentage: number }>;
  propertyTypeBreakdown: Array<{ type: string; count: number; percentage: number }>;
}

export const adminApi = {
  getDashboardData: async (): Promise<AdminDashboardData> => {
    const response = await axios.get(`${API_BASE_URL}/admin/dashboard`, { withCredentials: true });
    return response.data;
  },

  getUsers: async (): Promise<AdminUserManagementData> => {
    const response = await axios.get(`${API_BASE_URL}/admin/users`, { withCredentials: true });
    return response.data;
  },

  getProperties: async (): Promise<AdminPropertyManagementData> => {
    const response = await axios.get(`${API_BASE_URL}/admin/properties`, { withCredentials: true });
    return response.data;
  },

  getAnalyticsData: async (): Promise<AdminAnalyticsData> => {
    const response = await axios.get(`${API_BASE_URL}/admin/analytics`, { withCredentials: true });
    return response.data;
  },

  updateUser: async (id: string, userData: { firstName?: string; lastName?: string; email?: string; role?: string; district?: string; status?: string }) => {
    const response = await axios.patch(`${API_BASE_URL}/admin/users/${id}`, userData, { withCredentials: true });
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await axios.delete(`${API_BASE_URL}/admin/users/${id}`, { withCredentials: true });
    return response.data;
  }
};
