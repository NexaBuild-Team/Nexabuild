import api from './api'
import type { Land } from '../types/land'

export function getAllLands(): Promise<Land[]> {
  return api.get<Land[]>('/land').then(res => res.data)
}

export function getLandById(id: string): Promise<Land> {
  return api.get<Land>(`/land/${id}`).then(res => res.data)
}

export function createLand(data: Partial<Land>): Promise<Land> {
  return api.post<Land>('/land', data).then(res => res.data)
}

export function updateLand(id: string, data: Partial<Land>): Promise<Land> {
  return api.put<Land>(`/land/${id}`, data).then(res => res.data)
}

export function deleteLand(id: string): Promise<Land> {
  return api.delete<Land>(`/land/${id}`).then(res => res.data)
}

export const uploadLandImageApi = async (
  file: File
): Promise<{ message: string; url: string; public_id: string }> => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await api.post('/cloudinary/upload', formData)
  return response.data
}
