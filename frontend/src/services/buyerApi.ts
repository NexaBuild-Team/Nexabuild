import api from './api';

export interface BuyerDashboardData {
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
    avatar?: string;
  };
  kpis: {
    savedPropertiesCount: number;
    savedLandsCount: number;
    aiMatchesCount: number;
    recentSearchesCount: number;
  };
  aiInsightText: string;
  properties: Array<{
    id: string;
    title: string;
    price: number;
    location: string;
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
    propertyType?: string;
    images?: string[];
    matchScore?: number;
    isSaved?: boolean;
    isAiPick?: boolean;
  }>;
  lands: Array<{
    id: string;
    name: string;
    price: number;
    location: string;
    perches: number;
    landType?: string;
    images?: string[];
    matchScore?: number;
    isSaved?: boolean;
  }>;
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    type: string;
    createdAt: string;
  }>;
  savedPropertiesPreview: any[];
  savedLandsPreview: any[];
  hotspots: Array<{
    district: string;
    category: string;
    growth: string;
    count: number;
  }>;
}

export const fetchBuyerDashboard = async (): Promise<BuyerDashboardData> => {
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await api.get('/buyer/dashboard', { headers });
  return response.data;
};

export const fetchSavedProperties = async (): Promise<any[]> => {
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await api.get('/buyer/saved-properties', { headers });
  return response.data;
};

export const toggleSavePropertyApi = async (propertyId: string): Promise<{ isSaved: boolean; propertyId: string }> => {
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await api.post(`/buyer/saved-properties/${propertyId}`, {}, { headers });
  return response.data;
};

export const fetchSavedLands = async (): Promise<any[]> => {
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await api.get('/buyer/saved-lands', { headers });
  return response.data;
};

export const toggleSaveLandApi = async (landId: string): Promise<{ isSaved: boolean; landId: string }> => {
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await api.post(`/buyer/saved-lands/${landId}`, {}, { headers });
  return response.data;
};

export const fetchRecentlyViewed = async (): Promise<any[]> => {
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await api.get('/buyer/recently-viewed', { headers });
  return response.data;
};
