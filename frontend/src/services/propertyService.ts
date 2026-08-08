/**
 * propertyService.ts
 * Fetches property data from the NestJS backend and maps it
 * to the MappedProperty shape used by all property pages.
 */

import api from './api'

// ─── Backend response type (matches Prisma Property model) ───────────────────
export interface ApiProperty {
  id: string          // UUID
  title: string
  description: string | null
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  area: number        // sqft as a number
  propertyType: string  // 'House' | 'Apartment' | 'Villa' | 'Commercial'
  listingType: string   // 'Buy' | 'Rent' | 'Sell'
  images: string[]
  matchScore: number | null
  latitude: number | null
  longitude: number | null
  createdAt: string
  updatedAt: string
  // AI Match Fields
  hasPool?: boolean
  hasGarden?: boolean
  hasSeaView?: boolean
  hasSecurity?: boolean
  hasModernKitchen?: boolean
  parkingSpaces?: number
  isInvestment?: boolean
  isOwnHome?: boolean
  isVacationHome?: boolean
  isRentalIncome?: boolean
  isUrban?: boolean
  isSuburban?: boolean
  isCoastal?: boolean
  isRural?: boolean
  isCityCenter?: boolean
  isNearSchools?: boolean
  isNearHospital?: boolean
  isNearHighway?: boolean
  isQuietArea?: boolean
  isNearBeach?: boolean
}

// ─── Frontend-friendly type used by all property pages ───────────────────────
export interface MappedProperty {
  id: string
  image: string
  badge: string
  badgeColor: string
  price: string         // formatted: 'LKR 85,000,000'
  priceNum: number
  title: string
  location: string
  address: string
  district: string
  type: 'House' | 'Apartment' | 'Villa' | 'Commercial'
  beds: number
  baths: number
  area: string          // formatted: '6,800 sqft'
  parking: number
  matchScore: number
  reason: string
  tags: string[]
  gallery: { src: string; alt: string }[]
  description: [string, string]
  keyFeatures: string[]
  nearbyFacilities: {
    schools:      { name: string; distance: string }[]
    hospitals:    { name: string; distance: string }[]
    supermarkets: { name: string; distance: string }[]
  }
  mapCenter: [number, number]
  details: { label: string; value: string }[]
  isFavorite?: boolean
  // AI Match Fields
  hasPool: boolean
  hasGarden: boolean
  hasSeaView: boolean
  hasSecurity: boolean
  hasModernKitchen: boolean
  parkingSpaces: number
  isInvestment: boolean
  isOwnHome: boolean
  isVacationHome: boolean
  isRentalIncome: boolean
  isUrban: boolean
  isSuburban: boolean
  isCoastal: boolean
  isRural: boolean
  isCityCenter: boolean
  isNearSchools: boolean
  isNearHospital: boolean
  isNearHighway: boolean
  isQuietArea: boolean
  isNearBeach: boolean
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatPrice(n: number): string {
  return `LKR ${n.toLocaleString('en-LK')}`
}

function formatArea(n: number): string {
  return `${n.toLocaleString('en-LK')} sqft`
}

function extractDistrict(location: string): string {
  const districts = [
    'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 'Gampaha', 'Hambantota',
    'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar', 'Matale',
    'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 'Ratnapura',
    'Trincomalee', 'Vavuniya'
  ]
  return districts.find((d) => location.toLowerCase().includes(d.toLowerCase())) ?? location.split(',')[0].trim()
}

function getBadgeInfo(listingType: string): { badge: string; badgeColor: string } {
  if (listingType === 'Rent') return { badge: 'FOR RENT',  badgeColor: '#6b879c' }
  if (listingType === 'Buy')  return { badge: 'FOR SALE',  badgeColor: '#be5d3f' }
  return                             { badge: 'PREMIUM',   badgeColor: '#495d38' }
}

const districtCoords: Record<string, [number, number]> = {
  Colombo: [6.9271, 79.8612],
  Kandy:   [7.2906, 80.6337],
  Galle:   [6.0535, 80.2210],
  Negombo: [7.2095, 79.8368],
}

// ─── Mapper: ApiProperty → MappedProperty ────────────────────────────────────
export function mapApiProperty(p: ApiProperty): MappedProperty {
  const { badge, badgeColor } = getBadgeInfo(p.listingType)
  const district  = extractDistrict(p.location)
  const mainImage = p.images[0] ??
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80'
  const parking   = 2

  const gallery: MappedProperty['gallery'] =
    p.images.length > 0
      ? p.images.map((src, i) => ({
          src,
          alt: i === 0 ? p.title : `${p.title} — view ${i + 1}`,
        }))
      : [{ src: mainImage, alt: p.title }]

  const desc1 =
    p.description ??
    `${p.title} is a ${p.propertyType.toLowerCase()} in ${p.location}, ` +
    `offering ${p.bedrooms} bedrooms and ${p.bathrooms} bathrooms across ${formatArea(p.area)}.`

  const desc2 =
    `Competitively priced at ${formatPrice(p.price)}, this property in ${district} ` +
    `presents excellent value and strong long-term appreciation potential.`

  return {
    id: p.id,
    image: mainImage,
    badge,
    badgeColor,
    price:    formatPrice(p.price),
    priceNum: p.price,
    title:    p.title,
    location: p.location,
    address:  p.location,
    district,
    type:     p.propertyType as MappedProperty['type'],
    beds:     p.bedrooms,
    baths:    p.bathrooms,
    area:     formatArea(p.area),
    parking,
    matchScore: p.matchScore ?? 75,
    reason: `This ${p.propertyType.toLowerCase()} in ${district} offers great value at ` +
            `${formatPrice(p.price)} with ${p.bedrooms} bedrooms and ${p.bathrooms} bathrooms.`,
    tags: ['Prime location', 'Good value', 'Well maintained'],
    gallery,
    description: [desc1, desc2],
    keyFeatures: [
      'Modern Finishes',
      'Spacious Layout',
      'Prime Location',
      'Secure Neighbourhood',
      `${p.bedrooms} Bedrooms`,
      `${p.bathrooms} Bathrooms`,
      `Covered Parking (${parking} Cars)`,
      '24/7 Security',
    ],
    nearbyFacilities: {
      schools: [
        { name: 'Nearby International School', distance: '1.2 km' },
        { name: 'Local College',               distance: '2.5 km' },
        { name: 'Primary School',              distance: '0.8 km' },
      ],
      hospitals: [
        { name: 'District Hospital',       distance: '2.0 km' },
        { name: 'Private Medical Centre',  distance: '3.5 km' },
        { name: 'Clinic',                  distance: '1.0 km' },
      ],
      supermarkets: [
        { name: 'Food City',    distance: '0.5 km' },
        { name: 'Keells Super', distance: '1.2 km' },
        { name: 'Local Market', distance: '0.9 km' },
      ],
    },
    mapCenter:
      p.latitude != null && p.longitude != null
        ? [p.latitude, p.longitude]
        : districtCoords[district] ?? [7.8731, 80.7718],
    details: [
      { label: 'Property Type', value: p.propertyType },
      { label: 'Status',        value: p.listingType === 'Rent' ? 'For Rent' : 'For Sale' },
      { label: 'Year Built',    value: '2018' },
      { label: 'Land Size',     value: '10 Perches' },
      { label: 'Floor Area',    value: formatArea(p.area) },
      { label: 'Parking',       value: `${parking} Cars` },
      { label: 'Furnishing',    value: 'Semi-Furnished' },
      { label: 'Ownership',     value: 'Freehold' },
    ],
    // AI Match Fields
    hasPool: !!p.hasPool,
    hasGarden: !!p.hasGarden,
    hasSeaView: !!p.hasSeaView,
    hasSecurity: !!p.hasSecurity,
    hasModernKitchen: !!p.hasModernKitchen,
    parkingSpaces: p.parkingSpaces || 0,
    isInvestment: !!p.isInvestment,
    isOwnHome: !!p.isOwnHome,
    isVacationHome: !!p.isVacationHome,
    isRentalIncome: !!p.isRentalIncome,
    isUrban: !!p.isUrban,
    isSuburban: !!p.isSuburban,
    isCoastal: !!p.isCoastal,
    isRural: !!p.isRural,
    isCityCenter: !!p.isCityCenter,
    isNearSchools: !!p.isNearSchools,
    isNearHospital: !!p.isNearHospital,
    isNearHighway: !!p.isNearHighway,
    isQuietArea: !!p.isQuietArea,
    isNearBeach: !!p.isNearBeach,
  }
}

// ─── API calls ───────────────────────────────────────────────────────────────
export async function fetchAllProperties(): Promise<MappedProperty[]> {
  const { data } = await api.get<ApiProperty[]>('/properties')
  return data.map(mapApiProperty)
}

export async function fetchPropertyById(id: string): Promise<MappedProperty> {
  const { data } = await api.get<ApiProperty>(`/properties/${id}`)
  return mapApiProperty(data)
}
