export interface Land {
  id: string
  name: string
  description: string | null
  price: number
  location: string
  perches: number
  sqft: number | null
  status: string
  landType: string
  purpose?: string | null
  environment?: string | null
  developmentPlan?: string | null
  images: string[]
  matchScore: number | null
  rawScore?: number
  latitude: number | null
  longitude: number | null
  createdAt: string
  updatedAt: string
}
