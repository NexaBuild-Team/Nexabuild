import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export interface ConstructionSummaryMetrics {
  totalProjectsCount?: number;
  projectsGrowthPercent?: string;
  totalViewsCount?: string | number;
  viewsGrowthPercent?: string;
  completedProjectsCount?: number;
  completedGrowthPercent?: string;
  clientReviewsRating?: number;
  ratingGrowth?: string;
  onSchedulePercent?: number;
  activeNowCount?: number;
}

export interface ConstructionProjectItem {
  id: string | number;
  name: string;
  category: 'Residential' | 'Commercial' | 'Renovation' | 'Industrial';
  status: 'Active' | 'Completed' | 'Planning' | 'On Hold';
  views: string | number;
  date: string;
}

export interface ConstructionActivityItem {
  id: string | number;
  title: string;
  description: string;
  timeAgo: string;
  type: 'gallery' | 'complete' | 'review' | 'project';
}

export interface ConstructionGalleryItem {
  id: string | number;
  title: string;
  category: string;
  views: string;
  imageUrl: string;
}

export interface ConstructionServiceMetric {
  name: string;
  projectsCount: number;
  percentage: number;
}

export interface ConstructionDashboardData {
  metrics: ConstructionSummaryMetrics;
  latestProjects: ConstructionProjectItem[];
  recentActivities: ConstructionActivityItem[];
  galleryItems: ConstructionGalleryItem[];
  services: ConstructionServiceMetric[];
}

export const constructionApi = {
  getDashboardData: async (): Promise<ConstructionDashboardData> => {
    const response = await axios.get(`${API_BASE_URL}/construction/dashboard`, { withCredentials: true });
    return response.data;
  },

  createProject: async (projectData: {
    name: string;
    category?: string;
    status?: string;
    description?: string;
    clientName?: string;
    siteLocation?: string;
    totalBudget?: string;
    estimatedCompletion?: string;
    teamSize?: string;
    blueprintFileName?: string;
    visibility?: string;
  }) => {
    const response = await axios.post(`${API_BASE_URL}/construction/projects`, projectData, { withCredentials: true });
    return response.data;
  },

  updateStatus: async (id: string | number, status: string) => {
    const response = await axios.patch(`${API_BASE_URL}/construction/projects/${id}/status`, { status }, { withCredentials: true });
    return response.data;
  },

  deleteProject: async (id: string | number) => {
    const response = await axios.delete(`${API_BASE_URL}/construction/projects/${id}`, { withCredentials: true });
    return response.data;
  }
};
