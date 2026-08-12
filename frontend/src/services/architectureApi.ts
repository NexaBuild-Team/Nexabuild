import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export interface ArchitectureSummaryMetrics {
  portfolioViewsCount?: number;
  viewsGrowthPercent?: string;
  totalProjectsCount?: number;
  projectsGrowthCount?: string;
  housePlansCount?: number;
  plansGrowthCount?: string;
  threeDDesignsCount?: number;
  designsGrowthCount?: string;
  followersCount?: number;
  followersGrowthPercent?: string;
}

export interface ArchitectureProjectItem {
  id: string | number;
  name: string;
  views: number;
  likes: number;
  status: 'Active' | 'Completed' | 'In Review' | 'Pending';
  date: string;
  icon?: string;
}

export interface HousePlanItem {
  id: string | number;
  title: string;
  beds: number;
  baths: number;
  sqft: string;
  img: string;
}

export interface GalleryDesignItem {
  name: string;
  imgUrl: string;
}

export interface DesignStyleMetric {
  name: string;
  count: number;
}

export interface ArchitectureDashboardData {
  metrics: ArchitectureSummaryMetrics;
  latestPortfolio: Array<{ id: string; title: string; tag: string; views: number; likes: number; img: string }>;
  mostViewedDesign: { id: string; title: string; tag: string; views: number; likes: number; bookmarks: number; img: string } | null;
  housePlans: HousePlanItem[];
  tableProjects: ArchitectureProjectItem[];
  galleryItems: GalleryDesignItem[];
  designStyles: DesignStyleMetric[];
}

export const architectureApi = {
  getDashboardData: async (): Promise<ArchitectureDashboardData> => {
    const response = await axios.get(`${API_BASE_URL}/architecture/dashboard`, { withCredentials: true });
    return response.data;
  },

  createProject: async (projectData: {
    title: string;
    style?: string;
    priceLkr?: number;
    architectName?: string;
    imageUrl?: string;
    bedrooms?: number;
    bathrooms?: number;
    sqftArea?: number;
    locationLabel?: string;
    status?: string;
  }) => {
    const response = await axios.post(`${API_BASE_URL}/architecture/projects`, projectData, { withCredentials: true });
    return response.data;
  },

  updateStatus: async (id: string | number, status: string) => {
    const response = await axios.patch(`${API_BASE_URL}/architecture/projects/${id}/status`, { status }, { withCredentials: true });
    return response.data;
  },

  deleteProject: async (id: string | number) => {
    const response = await axios.delete(`${API_BASE_URL}/architecture/projects/${id}`, { withCredentials: true });
    return response.data;
  }
};
