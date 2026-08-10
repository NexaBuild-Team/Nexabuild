/**
 * propertySeed.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Seeds ONLY the Property table with the same 9 dummy properties that are
 * currently displayed on the frontend (data/recommendedProperties.ts).
 *
 * Kept separate from seed.ts (being worked on by another team member)
 * to avoid merge conflicts.
 *
 * Run with:
 *   npx ts-node -r tsconfig-paths/register prisma/propertySeed.ts
 *
 * Or add a convenience script to package.json:
 *   "seed:property": "ts-node -r tsconfig-paths/register prisma/propertySeed.ts"
 * ─────────────────────────────────────────────────────────────────────────────
 */

import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

// ─── Property seed data (mirrors frontend/src/data/recommendedProperties.ts) ─
const properties = [
  // ── Featured / AI-Picked (IDs 1–3) ─────────────────────────────────────────
  {
    title: 'Luxury Villa, Colombo 7',
    description:
      'This stunning luxury villa in the heart of Colombo 7 offers an unparalleled living experience. ' +
      "Designed by a renowned local architect, the property features contemporary tropical modern aesthetics with premium finishes throughout. " +
      "Set on a generous 12-perch plot in one of Colombo's most prestigious neighbourhoods, this residence combines privacy, elegance, and convenience.",
    price: 85_000_000,
    location: 'Cinnamon Gardens, Colombo 07',
    bedrooms: 5,
    bathrooms: 4,
    area: 6800,
    propertyType: 'Villa',
    listingType: 'Buy',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=80',
    ],
    matchScore: 98,
    latitude: 6.9135,
    longitude: 79.854,
    // AI Match Fields
    hasPool: true,
    hasGarden: true,
    hasModernKitchen: true,
    hasSecurity: true,
    parkingSpaces: 2,
    isInvestment: true,
    isOwnHome: true,
    isVacationHome: false,
    isRentalIncome: true,
    isUrban: true,
    isCityCenter: true,
    isNearSchools: true,
    isNearHospital: true,
  },
  // ── Comparison Pair 1: Kandy Houses ────────────────────────────────────────
  {
    title: 'Hilltop Family Residence',
    description:
      'A beautifully designed modern family home on Peradeniya Road, offering panoramic mountain views. ' +
      'Ideal for families prioritising education and security, with top schools just a walk away.',
    price: 42_000_000,
    location: 'Peradeniya Road, Kandy',
    bedrooms: 4,
    bathrooms: 3,
    area: 3200,
    propertyType: 'House',
    listingType: 'Buy',
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=900&q=80',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=600&q=80',
    ],
    matchScore: 94,
    latitude: 7.2906,
    longitude: 80.6337,
    // AI Match Fields
    hasGarden: true,
    hasPool: false,
    hasModernKitchen: true,
    hasSecurity: true,
    parkingSpaces: 2,
    isOwnHome: true,
    isVacationHome: false,
    isSuburban: true,
    isRural: false,
    isQuietArea: false,
    isNearSchools: true,
  },
  {
    title: 'Serene Valley Home',
    description:
      'A secluded house on Peradeniya Road surrounded by lush nature. ' +
      'Perfect for those seeking peace and quiet away from the bustling city, featuring traditional architecture.',
    price: 44_000_000,
    location: 'Peradeniya Road, Kandy',
    bedrooms: 4,
    bathrooms: 3,
    area: 3100,
    propertyType: 'House',
    listingType: 'Buy',
    images: [
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=900&q=80',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&q=80',
    ],
    matchScore: 91,
    latitude: 7.2910,
    longitude: 80.6340,
    // AI Match Fields
    hasGarden: true,
    hasPool: false,
    hasModernKitchen: false,
    hasSecurity: false,
    parkingSpaces: 2,
    isOwnHome: true,
    isVacationHome: false,
    isSuburban: true,
    isRural: false,
    isQuietArea: true,
    isNearSchools: false,
  },
  // ── Comparison Pair 2: Beachfront Villas ──────────────────────────────────
  {
    title: 'Oceanfront Oasis Villa',
    description:
      'An exceptional beachfront villa in Unawatuna offering direct access to a pristine stretch of coastline. ' +
      'Features a stunning infinity pool and modern kitchen for the ultimate luxury vacation.',
    price: 110_000_000,
    location: 'Unawatuna, Galle',
    bedrooms: 6,
    bathrooms: 5,
    area: 7500,
    propertyType: 'Villa',
    listingType: 'Buy',
    images: [
      'https://images.unsplash.com/photo-1531971589569-0d9370cbe1e5?w=900&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80',
    ],
    matchScore: 89,
    latitude: 6.0094,
    longitude: 80.2497,
    // AI Match Fields
    hasPool: true,
    hasGarden: false,
    hasSeaView: true,
    hasModernKitchen: true,
    hasSecurity: true,
    parkingSpaces: 4,
    isInvestment: true,
    isVacationHome: true,
    isRentalIncome: true,
    isCoastal: true,
    isNearBeach: true,
    isQuietArea: true,
  },
  {
    title: 'Coastal Heritage Villa',
    description:
      'An exceptional beachfront villa in Unawatuna. ' +
      'Features a massive lush garden and classical architecture, perfect for outdoor living and nature lovers.',
    price: 114_000_000,
    location: 'Unawatuna, Galle',
    bedrooms: 6,
    bathrooms: 5,
    area: 7600,
    propertyType: 'Villa',
    listingType: 'Buy',
    images: [
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=900&q=80',
      'https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=600&q=80',
    ],
    matchScore: 88,
    latitude: 6.0095,
    longitude: 80.2498,
    // AI Match Fields
    hasPool: false,
    hasGarden: true,
    hasSeaView: true,
    hasModernKitchen: false,
    hasSecurity: true,
    parkingSpaces: 2,
    isInvestment: true,
    isVacationHome: true,
    isRentalIncome: true,
    isCoastal: true,
    isNearBeach: true,
    isQuietArea: true,
  },
  // ── Comparison Pair 3: Colombo 5 Apartments ───────────────────────────────
  {
    title: 'Skyline View Apartment',
    description:
      'A high-rise apartment in Colombo 5 offering spectacular skyline views. ' +
      'Enjoy resort-style living with a rooftop pool and 24/7 building security.',
    price: 65_000_000,
    location: 'Colombo 5, Western Province',
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    propertyType: 'Apartment',
    listingType: 'Buy',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80',
      'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=900&q=80',
    ],
    matchScore: 84,
    latitude: 6.8900,
    longitude: 79.8700,
    // AI Match Fields
    hasPool: true,
    hasGarden: false,
    hasSeaView: false,
    hasModernKitchen: true,
    hasSecurity: true,
    parkingSpaces: 2,
    isInvestment: true,
    isOwnHome: true,
    isUrban: true,
    isCityCenter: true,
    isNearHighway: true,
  },
  {
    title: 'Boutique Urban Apartment',
    description:
      'An intimate boutique apartment in Colombo 5 focused on interior luxury. ' +
      'Boasts a state-of-the-art modern kitchen for culinary enthusiasts, though without a pool facility.',
    price: 68_000_000,
    location: 'Colombo 5, Western Province',
    bedrooms: 3,
    bathrooms: 2,
    area: 1850,
    propertyType: 'Apartment',
    listingType: 'Buy',
    images: [
      'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=900&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80',
    ],
    matchScore: 82,
    latitude: 6.8905,
    longitude: 79.8705,
    // AI Match Fields
    hasPool: false,
    hasGarden: false,
    hasSeaView: false,
    hasModernKitchen: true,
    hasSecurity: false,
    parkingSpaces: 0,
    isInvestment: true,
    isOwnHome: true,
    isUrban: true,
    isCityCenter: true,
    isNearHighway: true,
  },
  // ── Additional Diverse Properties ──────────────────────────────────────────
  {
    title: 'Premium Townhouse, Negombo',
    description:
      'Well-maintained premium townhouse in the heart of Negombo. ' +
      'A solid investment with strong resale value sitting in the Negombo growth corridor.',
    price: 55_000_000,
    location: 'Negombo, Western Province',
    bedrooms: 3,
    bathrooms: 2,
    area: 2800,
    propertyType: 'House',
    listingType: 'Buy',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80',
    ],
    matchScore: 84,
    latitude: 7.2095,
    longitude: 79.8368,
    // AI Match Fields
    hasGarden: true,
    hasPool: false,
    parkingSpaces: 1,
    isInvestment: true,
    isRentalIncome: true,
    isUrban: true,
    isSuburban: true,
    isNearHighway: true,
    isNearHospital: true,
  },
  {
    title: 'Penthouse, Colombo 3',
    description:
      'Iconic penthouse on the upper floors of a landmark building in Colombo 3 offering panoramic city and ocean views. ' +
      'A top-tier investment asset with premium finishes throughout.',
    price: 220_000_000,
    location: 'Colombo 3, Western Province',
    bedrooms: 5,
    bathrooms: 4,
    area: 4200,
    propertyType: 'Apartment',
    listingType: 'Buy',
    images: [
      'https://images.unsplash.com/photo-1515263487990-61b07816b324?w=900&q=80',
    ],
    matchScore: 76,
    latitude: 6.9147,
    longitude: 79.8519,
    // AI Match Fields
    hasPool: true,
    hasSeaView: true,
    hasModernKitchen: true,
    hasSecurity: true,
    hasGarden: false,
    parkingSpaces: 2,
    isInvestment: true,
    isRentalIncome: true,
    isUrban: true,
    isCityCenter: true,
    isNearBeach: true,
  },
  {
    title: 'Garden Bungalow, Nugegoda',
    description:
      'Spacious garden home nestled in a quiet Nugegoda suburb — excellent for families. ' +
      'Features a large manicured garden, modern kitchen, and 24/7 security.',
    price: 38_000_000,
    location: 'Nugegoda, Western Province',
    bedrooms: 4,
    bathrooms: 3,
    area: 3200,
    propertyType: 'House',
    listingType: 'Buy',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&q=80',
    ],
    matchScore: 73,
    latitude: 6.8649,
    longitude: 79.8997,
    // AI Match Fields
    hasGarden: true,
    hasModernKitchen: true,
    hasSecurity: true,
    hasPool: false,
    parkingSpaces: 2,
    isOwnHome: true,
    isSuburban: true,
    isQuietArea: true,
    isNearSchools: true,
  },
  {
    title: 'City Apartment, Kandy',
    description:
      'Affordable city-centre apartment in Kandy — a great entry-level investment or starter home. ' +
      'Compact, well-lit unit minutes from shops, hospitals and transport.',
    price: 18_500_000,
    location: 'Kandy City, Central Province',
    bedrooms: 2,
    bathrooms: 1,
    area: 950,
    propertyType: 'Apartment',
    listingType: 'Rent',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1c24240f38?w=900&q=80',
    ],
    matchScore: 69,
    latitude: 7.2906,
    longitude: 80.6337,
    // AI Match Fields
    hasSecurity: true,
    hasPool: false,
    hasGarden: false,
    parkingSpaces: 1,
    isInvestment: true,
    isRentalIncome: true,
    isUrban: true,
    isCityCenter: true,
    isNearHospital: true,
    isNearSchools: true,
  },
  {
    title: 'Colonial Heritage Bungalow',
    description:
      'A rare colonial-era heritage bungalow in a sought-after Kandy address. ' +
      'Lovingly restored with modern upgrades while preserving the original character and charm.',
    price: 62_000_000,
    location: 'Kandy, Central Province',
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    propertyType: 'House',
    listingType: 'Buy',
    images: [
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=900&q=80',
    ],
    matchScore: 65,
    latitude: 7.2906,
    longitude: 80.6337,
    // AI Match Fields
    hasGarden: true,
    hasPool: false,
    hasModernKitchen: false,
    parkingSpaces: 3,
    isOwnHome: true,
    isVacationHome: true,
    isSuburban: true,
    isQuietArea: true,
  },
  {
    title: 'Eco-Friendly Retreat, Ella',
    description: 'A unique sustainable lodge tucked away in the lush mountains of Ella, offering breathtaking valley views.',
    price: 25_000_000,
    location: 'Ella, Uva Province',
    bedrooms: 2,
    bathrooms: 1,
    area: 1200,
    propertyType: 'Villa',
    listingType: 'Buy',
    images: [
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=900&q=80'
    ],
    matchScore: 85,
    latitude: 6.8667,
    longitude: 81.0466,
    // AI Match Fields
    hasGarden: true,
    hasPool: false,
    hasSecurity: false,
    isVacationHome: true,
    isRural: true,
    isQuietArea: true,
    isRentalIncome: true,
  },
  {
    title: 'Suburban Duplex, Malabe',
    description: 'Modern newly built duplex ideal for IT professionals working around the Malabe tech hub.',
    price: 32_500_000,
    location: 'Malabe, Western Province',
    bedrooms: 3,
    bathrooms: 2,
    area: 2200,
    propertyType: 'House',
    listingType: 'Buy',
    images: [
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=900&q=80'
    ],
    matchScore: 78,
    latitude: 6.9044,
    longitude: 79.9620,
    // AI Match Fields
    hasModernKitchen: true,
    hasGarden: true,
    hasPool: false,
    parkingSpaces: 2,
    isSuburban: true,
    isOwnHome: true,
    isNearSchools: true,
  },
  {
    title: 'Tea Estate Bungalow, Nuwara Eliya',
    description: 'A charming 19th-century bungalow surrounded by rolling tea hills and misty landscapes.',
    price: 95_000_000,
    location: 'Nuwara Eliya, Central Province',
    bedrooms: 5,
    bathrooms: 4,
    area: 4500,
    propertyType: 'House',
    listingType: 'Buy',
    images: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=900&q=80'
    ],
    matchScore: 91,
    latitude: 6.9497,
    longitude: 80.7828,
    // AI Match Fields
    hasGarden: true,
    hasPool: false,
    hasSecurity: true,
    isRural: true,
    isQuietArea: true,
    isVacationHome: true,
  }
]

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🌱  Starting property seed…')

  // Optional: wipe existing property rows first so the seed is idempotent.
  // Comment this out if you want to keep existing records.
  const deleted = await prisma.property.deleteMany()
  console.log(`🗑️   Cleared ${deleted.count} existing property record(s).`)

  // Insert all properties
  const result = await prisma.property.createMany({
    data: properties,
    skipDuplicates: true,
  })

  console.log(`✅  Seeded ${result.count} propert${result.count !== 1 ? 'ies' : 'y'} successfully.`)
}

main()
  .catch((err) => {
    console.error('❌  Property seed failed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
