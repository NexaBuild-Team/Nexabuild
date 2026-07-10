export type PropertyType = 'House' | 'Apartment' | 'Villa' | 'Commercial'

export interface RecommendedProperty {
  id: number
  image: string
  badge: string
  badgeColor: string
  price: string
  priceNum: number
  title: string
  location: string
  address: string
  district: string
  type: PropertyType
  beds: number
  baths: number
  area: string
  parking: number
  matchScore: number
  reason: string
  tags: string[]
  gallery: { src: string; alt: string }[]
  description: [string, string]
  keyFeatures: string[]
  nearbyFacilities: {
    schools: { name: string; distance: string }[]
    hospitals: { name: string; distance: string }[]
    supermarkets: { name: string; distance: string }[]
  }
  mapCenter: [number, number]
  details: { label: string; value: string }[]
  isFavorite?: boolean
}

const districtCoords: Record<string, [number, number]> = {
  Colombo: [6.9271, 79.8612],
  Kandy: [7.2906, 80.6337],
  Galle: [6.0535, 80.2210],
  Negombo: [7.2095, 79.8368],
}

function withListingDefaults(p: {
  id: number
  image: string
  price: string
  priceNum: number
  title: string
  location: string
  district: string
  type: PropertyType
  beds: number
  baths: number
  area: string
  badge: string
  badgeColor: string
  matchScore: number
  reason: string
  isFavorite?: boolean
  parking?: number
  tags?: string[]
  keyFeatures?: string[]
  propertyTypeLabel?: string
  yearBuilt?: string
}): RecommendedProperty {
  const parking = p.parking ?? 2

  return {
    id: p.id,
    image: p.image,
    badge: p.badge,
    badgeColor: p.badgeColor,
    price: p.price,
    priceNum: p.priceNum,
    title: p.title,
    location: p.location,
    address: p.location,
    district: p.district,
    type: p.type,
    beds: p.beds,
    baths: p.baths,
    area: p.area,
    parking,
    matchScore: p.matchScore,
    reason: p.reason,
    isFavorite: p.isFavorite,
    tags: p.tags ?? ['Prime location', 'Good value', 'Well maintained'],
    gallery: [
      { src: p.image.replace('w=600', 'w=900'), alt: p.title },
      { src: p.image, alt: `${p.title} interior` },
      { src: p.image, alt: `${p.title} exterior` },
    ],
    description: [
      `${p.title} is a standout property in ${p.district}, offering ${p.beds} bedrooms and ${p.baths} bathrooms across ${p.area}.`,
      p.reason,
    ],
    keyFeatures: p.keyFeatures ?? [
      'Modern Finishes',
      'Spacious Layout',
      'Prime Location',
      'Secure Neighbourhood',
      `${p.beds} Bedrooms`,
      `${p.baths} Bathrooms`,
      `Covered Parking (${parking} Cars)`,
      '24/7 Security',
    ],
    nearbyFacilities: {
      schools: [
        { name: 'Nearby International School', distance: '1.2 km' },
        { name: 'Local College', distance: '2.5 km' },
        { name: 'Primary School', distance: '0.8 km' },
      ],
      hospitals: [
        { name: 'District Hospital', distance: '2.0 km' },
        { name: 'Private Medical Centre', distance: '3.5 km' },
        { name: 'Clinic', distance: '1.0 km' },
      ],
      supermarkets: [
        { name: 'Food City', distance: '0.5 km' },
        { name: 'Keells Super', distance: '1.2 km' },
        { name: 'Local Market', distance: '0.9 km' },
      ],
    },
    mapCenter: districtCoords[p.district] ?? [7.8731, 80.7718],
    details: [
      { label: 'Property Type', value: p.propertyTypeLabel ?? p.type },
      { label: 'Status', value: p.badge === 'FOR RENT' ? 'For Rent' : 'For Sale' },
      { label: 'Year Built', value: p.yearBuilt ?? '2018' },
      { label: 'Land Size', value: '10 Perches' },
      { label: 'Floor Area', value: p.area },
      { label: 'Parking', value: `${parking} Cars` },
      { label: 'Furnishing', value: 'Semi-Furnished' },
      { label: 'Ownership', value: 'Freehold' },
    ],
  }
}

const featuredProperties: RecommendedProperty[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',
    badge: 'AI Pick',
    badgeColor: '#345b79',
    price: 'LKR 85,000,000',
    priceNum: 85_000_000,
    title: 'Luxury Villa, Colombo 7',
    location: 'Cinnamon Gardens, Colombo 07',
    address: 'Colombo 7, Western Province, Sri Lanka',
    district: 'Colombo',
    type: 'Villa',
    beds: 5,
    baths: 4,
    area: '6,800 sqft',
    parking: 2,
    matchScore: 98,
    reason: 'Perfect match for your budget and preferred Colombo location. Features a private pool, landscaped garden, and is within walking distance of top international schools.',
    tags: ['Within budget', 'Preferred location', 'Pool & garden', 'Top schools nearby'],
    gallery: [
      { src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80', alt: 'Grand interior staircase' },
      { src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=80', alt: 'Modern living room' },
      { src: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&q=80', alt: 'Luxury bedroom' },
      { src: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80', alt: 'Property exterior' },
    ],
    description: [
      'This stunning luxury villa in the heart of Colombo 7 offers an unparalleled living experience. Designed by a renowned local architect, the property features contemporary tropical modern aesthetics with premium finishes throughout.',
      'Set on a generous 12-perch plot in one of Colombo\'s most prestigious neighbourhoods, this residence combines privacy, elegance, and convenience. Walking distance to international schools, hospitals, and fine dining establishments.',
    ],
    keyFeatures: [
      'Swimming Pool',
      'Modern European Kitchen',
      'Solar Panel System',
      '24/7 Security',
      'Landscaped Garden',
      'Home Automation',
      'Servant Quarters',
      'Covered Parking (2 Cars)',
    ],
    nearbyFacilities: {
      schools: [
        { name: 'Royal College Colombo', distance: '0.4 km' },
        { name: "Ladies' College", distance: '0.6 km' },
        { name: "Bishop's College", distance: '0.8 km' },
      ],
      hospitals: [
        { name: 'Nawaloka Hospital', distance: '1.2 km' },
        { name: 'Lanka Hospitals', distance: '2.1 km' },
        { name: 'Asiri Hospital', distance: '2.8 km' },
      ],
      supermarkets: [
        { name: 'Keells Super', distance: '0.3 km' },
        { name: 'Cargills Food City', distance: '0.5 km' },
        { name: 'Arpico Supercentre', distance: '1.0 km' },
      ],
    },
    mapCenter: [6.9135, 79.8540],
    details: [
      { label: 'Property Type', value: 'Luxury Villa' },
      { label: 'Status', value: 'For Sale' },
      { label: 'Year Built', value: '2021' },
      { label: 'Land Size', value: '12 Perches' },
      { label: 'Floor Area', value: '6,800 sqft' },
      { label: 'Parking', value: '2 Cars' },
      { label: 'Furnishing', value: 'Semi-Furnished' },
      { label: 'Ownership', value: 'Freehold' },
    ],
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    badge: 'AI Pick',
    badgeColor: '#345b79',
    price: 'LKR 42,000,000',
    priceNum: 42_000_000,
    title: 'Modern House, Kandy',
    location: 'Peradeniya Road, Kandy',
    address: 'Kandy, Central Province, Sri Lanka',
    district: 'Kandy',
    type: 'House',
    beds: 4,
    baths: 3,
    area: '3,200 sqft',
    parking: 2,
    matchScore: 94,
    reason: 'Excellent value within your budget range. Spacious family home in your preferred Kandy area with mountain views and modern finishes throughout.',
    tags: ['Within budget', 'Preferred location', 'Mountain views', 'Family-friendly'],
    gallery: [
      { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80', alt: 'Modern house exterior' },
      { src: 'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=600&q=80', alt: 'Open plan living area' },
      { src: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&q=80', alt: 'Master bedroom' },
      { src: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80', alt: 'Garden view' },
    ],
    description: [
      'A beautifully designed modern family home on Peradeniya Road, offering panoramic mountain views and a peaceful residential setting just minutes from Kandy city centre.',
      'Built in 2019 with quality craftsmanship, this property features an open-plan layout, landscaped garden, and ample natural light throughout — ideal for families seeking comfort and value.',
    ],
    keyFeatures: [
      'Mountain Views',
      'Open-Plan Living',
      'Landscaped Garden',
      'Modern Kitchen',
      'Servant\'s Room',
      'Covered Parking (2 Cars)',
      'Rainwater Harvesting',
      'Security System',
    ],
    nearbyFacilities: {
      schools: [
        { name: 'Trinity College Kandy', distance: '1.5 km' },
        { name: 'Kandy International School', distance: '2.0 km' },
        { name: 'Dharmaraja College', distance: '2.8 km' },
      ],
      hospitals: [
        { name: 'Kandy General Hospital', distance: '3.2 km' },
        { name: 'Asiri Hospital Kandy', distance: '4.1 km' },
        { name: 'Teaching Hospital Peradeniya', distance: '5.5 km' },
      ],
      supermarkets: [
        { name: 'Cargills Food City', distance: '1.8 km' },
        { name: 'Keells Super', distance: '2.3 km' },
        { name: 'Arpico', distance: '2.6 km' },
      ],
    },
    mapCenter: [7.2906, 80.6337],
    details: [
      { label: 'Property Type', value: 'Modern House' },
      { label: 'Status', value: 'For Sale' },
      { label: 'Year Built', value: '2019' },
      { label: 'Land Size', value: '10 Perches' },
      { label: 'Floor Area', value: '3,200 sqft' },
      { label: 'Parking', value: '2 Cars' },
      { label: 'Furnishing', value: 'Unfurnished' },
      { label: 'Ownership', value: 'Freehold' },
    ],
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    badge: 'Premium',
    badgeColor: '#be5d3f',
    price: 'LKR 110,000,000',
    priceNum: 110_000_000,
    title: 'Beachfront Villa, Galle',
    location: 'Unawatuna, Galle',
    address: 'Unawatuna, Southern Province, Sri Lanka',
    district: 'Galle',
    type: 'Villa',
    beds: 6,
    baths: 5,
    area: '7,500 sqft',
    parking: 3,
    matchScore: 89,
    reason: 'Stunning beachfront property with direct ocean access. Ideal for vacation home or rental income with high appreciation potential in Southern Province.',
    tags: ['Sea view', 'Investment potential', 'Spacious', 'Private beach access'],
    gallery: [
      { src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80', alt: 'Beachfront villa exterior' },
      { src: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80', alt: 'Infinity pool with ocean view' },
      { src: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&q=80', alt: 'Luxury master suite' },
      { src: 'https://images.unsplash.com/photo-1600585152915-d0bec72a4e20?w=600&q=80', alt: 'Ocean terrace' },
    ],
    description: [
      'An exceptional beachfront villa in Unawatuna offering direct access to a pristine stretch of coastline. This premium property is perfect as a luxury vacation home or high-yield rental investment.',
      'Spread across 18 perches with 7,500 sqft of living space, the villa features an infinity pool, expansive terraces, and six en-suite bedrooms designed for entertaining and relaxation.',
    ],
    keyFeatures: [
      'Private Beach Access',
      'Infinity Pool',
      'Ocean Views',
      '6 En-Suite Bedrooms',
      'Entertainment Terrace',
      'Staff Quarters',
      'Covered Parking (3 Cars)',
      'Rental Income Potential',
    ],
    nearbyFacilities: {
      schools: [
        { name: 'Southlands College Galle', distance: '4.5 km' },
        { name: 'Richmond College Galle', distance: '5.2 km' },
        { name: 'Leeds International School', distance: '6.0 km' },
      ],
      hospitals: [
        { name: 'Karapitiya Teaching Hospital', distance: '8.5 km' },
        { name: 'Galle District Hospital', distance: '6.8 km' },
        { name: 'Southern Hospital Galle', distance: '7.2 km' },
      ],
      supermarkets: [
        { name: 'Cargills Food City Galle', distance: '5.5 km' },
        { name: 'Keells Super Unawatuna', distance: '1.2 km' },
        { name: 'Arpico Galle', distance: '6.0 km' },
      ],
    },
    mapCenter: [6.0094, 80.2497],
    details: [
      { label: 'Property Type', value: 'Beachfront Villa' },
      { label: 'Status', value: 'For Sale' },
      { label: 'Year Built', value: '2020' },
      { label: 'Land Size', value: '18 Perches' },
      { label: 'Floor Area', value: '7,500 sqft' },
      { label: 'Parking', value: '3 Cars' },
      { label: 'Furnishing', value: 'Fully Furnished' },
      { label: 'Ownership', value: 'Freehold' },
    ],
  },
]

const additionalListingProperties: RecommendedProperty[] = [
  withListingDefaults({
    id: 4,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    price: 'LKR 55,000,000', priceNum: 55_000_000,
    title: 'Premium Townhouse, Negombo',
    location: 'Negombo, Western Province', district: 'Negombo', type: 'House',
    beds: 3, baths: 2, area: '2,800 sq ft',
    badge: 'FOR SALE', badgeColor: '#be5d3f',
    matchScore: 84,
    reason: 'Well within budget with strong resale value in Negombo growth corridor.',
  }),
  withListingDefaults({
    id: 5,
    image: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=600&q=80',
    price: 'LKR 48,000,000', priceNum: 48_000_000,
    title: 'Luxury Modern Villa #12',
    location: 'Colombo 5, Western Province', district: 'Colombo', type: 'Villa',
    beds: 4, baths: 3, area: '3,200 sq ft',
    badge: 'FOR SALE', badgeColor: '#be5d3f',
    matchScore: 80,
    reason: 'Central Colombo location with modern finishes, suits urban lifestyle.',
  }),
  withListingDefaults({
    id: 6,
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&q=80',
    price: 'LKR 220,000,000', priceNum: 220_000_000,
    title: 'Penthouse, Colombo 3',
    location: 'Colombo 3, Western Province', district: 'Colombo', type: 'Apartment',
    beds: 5, baths: 4, area: '4,200 sq ft',
    badge: 'PREMIUM', badgeColor: '#495d38',
    matchScore: 76,
    reason: 'Iconic penthouse offering panoramic views — top-tier investment asset.',
    parking: 3,
    propertyTypeLabel: 'Penthouse',
    yearBuilt: '2022',
  }),
  withListingDefaults({
    id: 7,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
    price: 'LKR 38,000,000', priceNum: 38_000_000,
    title: 'Garden Bungalow, Nugegoda',
    location: 'Nugegoda, Western Province', district: 'Colombo', type: 'House',
    beds: 4, baths: 3, area: '3,200 sq ft',
    badge: 'FOR SALE', badgeColor: '#be5d3f',
    matchScore: 73,
    reason: 'Spacious garden home in quiet suburb, excellent for families.',
    keyFeatures: ['Large Garden', 'Quiet Suburb', 'Family-Friendly', 'Modern Kitchen', '4 Bedrooms', '3 Bathrooms', 'Covered Parking (2 Cars)', '24/7 Security'],
  }),
  withListingDefaults({
    id: 8,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
    price: 'LKR 18,500,000', priceNum: 18_500_000,
    title: 'City Apartment, Kandy',
    location: 'Kandy City, Central Province', district: 'Kandy', type: 'Apartment',
    beds: 2, baths: 1, area: '950 sq ft',
    badge: 'FOR RENT', badgeColor: '#6b879c',
    matchScore: 69,
    reason: 'Affordable city-centre apartment — great entry-level investment.',
    parking: 1,
  }),
  withListingDefaults({
    id: 9,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80',
    price: 'LKR 62,000,000', priceNum: 62_000_000,
    title: 'Colonial Heritage Bungalow',
    location: 'Kandy, Central Province', district: 'Kandy', type: 'House',
    beds: 4, baths: 3, area: '2,800 sq ft',
    badge: 'FOR SALE', badgeColor: '#be5d3f',
    matchScore: 65,
    reason: 'Heritage character with modern upgrades in a sought-after Kandy address.',
    propertyTypeLabel: 'Heritage Bungalow',
    yearBuilt: '1952',
  }),
]

/** Top 3 AI-recommended properties shown on PropertyAIrecommended page */
export const recommendedProperties: RecommendedProperty[] = featuredProperties

/** Full property pool used by PropertyListingAI */
export const allPropertiesPool: RecommendedProperty[] = [
  ...featuredProperties,
  ...additionalListingProperties,
]

export function getPropertyById(id: number): RecommendedProperty | undefined {
  return allPropertiesPool.find((p) => p.id === id)
}

export function getSimilarProperties(currentId: number, limit = 3): RecommendedProperty[] {
  return allPropertiesPool.filter((p) => p.id !== currentId).slice(0, limit)
}
