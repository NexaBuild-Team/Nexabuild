import api from './api';

export interface UserProfileData {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  role: 'USER' | 'ADMIN' | 'AGENT' | 'ARCHITECT' | 'CONTRACTOR';
  isVerified?: boolean;
  createdAt?: string;
}

export const fetchUserProfile = async (): Promise<UserProfileData> => {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await api.get('/users/me', { headers });
  return response.data;
};

export const updateUserProfile = async (
  payload: Partial<UserProfileData>
): Promise<UserProfileData> => {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await api.patch('/users/me', payload, { headers });
  return response.data;
};
