import api from './api';

export interface AgentDashboardData {
  metrics: {
    totalPropertiesCount: number;
    propertiesGrowthPercent: string;
    totalLandsCount: number;
    landsGrowthPercent: string;
    totalViewsCount: string | number;
    viewsGrowthPercent: string;
    savedByUsersCount: number;
    savedGrowthPercent: string;
    totalEnquiriesCount: number;
    enquiriesGrowthPercent: string;
    propertyViewsSubSummary: number;
    landViewsSubSummary: number;
  };
  listings: Array<{
    id: string;
    title: string;
    type: 'PROPERTY' | 'LAND';
    status: 'Active' | 'Pending' | 'Inactive';
    views: number;
    saved: number;
    imageUrl: string;
  }>;
  notifications: Array<{
    id: string | number;
    message: string;
    timeAgo: string;
    type: 'enquiry' | 'views' | 'saved';
  }>;
  activities: Array<{
    id: string | number;
    description: string;
    timeAgo: string;
    type: 'views' | 'saved' | 'enquiry';
  }>;
  topLocations: Array<{
    locationName: string;
    percentage: number;
  }>;
  propertyPerformance?: Array<{ month: string; views: number }>;
  landPerformance?: Array<{ month: string; views: number }>;
  monthlyViews?: Array<{ month: string; views: number }>;
}

export const fetchAgentDashboard = async (): Promise<AgentDashboardData> => {
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await api.get('/agent/dashboard', { headers });
  return response.data;
};

export const updateListingStatusApi = async (
  id: string,
  type: 'PROPERTY' | 'LAND',
  status: string
): Promise<any> => {
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await api.patch(
    `/agent/listings/${id}/status`,
    { type, status },
    { headers }
  );
  return response.data;
};

export const deleteListingApi = async (
  id: string,
  type: 'PROPERTY' | 'LAND'
): Promise<any> => {
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await api.delete(`/agent/listings/${id}?type=${type}`, {
    headers,
  });
  return response.data;
};

export const createPropertyApi = async (payload: any): Promise<any> => {
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await api.post('/agent/properties', payload, { headers });
  return response.data;
};


export const uploadPropertyImageApi = async (file: File): Promise<{
  message: string;
  url: string;
  public_id: string;
}> => {
  const token = localStorage.getItem('accessToken');

  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/cloudinary/upload', formData, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return response.data;
};
