/**
 * propertySeed.ts
 * ────────────────────────────────────────────────────────────────────────────
 * Seeds ONLY the Property table with the 9 dummy properties that are
 * displayed on the frontend (data/recommendedProperties.ts).
 *
 * Kept separate from seed.ts to avoid merge conflicts.
 *
 * Run with:
 *   npm run seed:property
 * ────────────────────────────────────────────────────────────────────────────
 */

import 'dotenv/config'
import { PrismaClient, Role } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import * as bcrypt from 'bcrypt'

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
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&q=80',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80',
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
  {
    title: 'Modern House, Kandy',
    description:
      'A beautifully designed modern family home on Peradeniya Road, offering panoramic mountain views and a peaceful residential setting just minutes from Kandy city centre. ' +
      'Built in 2019 with quality craftsmanship, this property features an open-plan layout, landscaped garden, and ample natural light throughout.',
    price: 42_000_000,
    location: 'Peradeniya Road, Kandy',
    bedrooms: 4,
    bathrooms: 3,
    area: 3200,
    propertyType: 'House',
    listingType: 'Buy',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=600&q=80',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&q=80',
    ],
    matchScore: 94,
    latitude: 7.2906,
    longitude: 80.6337,
    // AI Match Fields
    hasGarden: true,
    hasModernKitchen: true,
    hasSecurity: false,
    parkingSpaces: 2,
    isOwnHome: true,
    isVacationHome: true,
    isSuburban: true,
    isRural: false,
    isQuietArea: true,
    isNearSchools: true,
  },
  {
    title: 'Beachfront Villa, Galle',
    description:
      'An exceptional beachfront villa in Unawatuna offering direct access to a pristine stretch of coastline. ' +
      'This premium property is perfect as a luxury vacation home or high-yield rental investment. ' +
      'Spread across 18 perches with 7,500 sqft of living space, the villa features an infinity pool, expansive terraces, and six en-suite bedrooms.',
    price: 110_000_000,
    location: 'Unawatuna, Galle',
    bedrooms: 6,
    bathrooms: 5,
    area: 7500,
    propertyType: 'Villa',
    listingType: 'Buy',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&q=80',
      'https://images.unsplash.com/photo-1600585152915-d0bec72a4e20?w=600&q=80',
    ],
    matchScore: 89,
    latitude: 6.0094,
    longitude: 80.2497,
    // AI Match Fields
    hasPool: true,
    hasGarden: true,
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

  // ── Additional Listing Properties (IDs 4–9) ─────────────────────────────────
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
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    ],
    matchScore: 84,
    latitude: 7.2095,
    longitude: 79.8368,
    // AI Match Fields
    hasGarden: true,
    parkingSpaces: 1,
    isInvestment: true,
    isRentalIncome: true,
    isUrban: true,
    isSuburban: true,
    isNearHighway: true,
    isNearHospital: true,
  },
  {
    title: 'Luxury Modern Villa #12',
    description:
      'Central Colombo villa with modern finishes perfectly suited for an urban lifestyle. ' +
      'Excellent value for the location in Colombo 5.',
    price: 48_000_000,
    location: 'Colombo 5, Western Province',
    bedrooms: 4,
    bathrooms: 3,
    area: 3200,
    propertyType: 'Villa',
    listingType: 'Buy',
    images: [
      'https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=600&q=80',
    ],
    matchScore: 80,
    latitude: 6.9271,
    longitude: 79.8612,
    // AI Match Fields
    hasModernKitchen: true,
    hasSecurity: true,
    parkingSpaces: 2,
    isOwnHome: true,
    isInvestment: true,
    isUrban: true,
    isCityCenter: true,
    isNearSchools: true,
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
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&q=80',
    ],
    matchScore: 76,
    latitude: 6.9147,
    longitude: 79.8519,
    // AI Match Fields
    hasPool: true,
    hasSeaView: true,
    hasModernKitchen: true,
    hasSecurity: true,
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
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
    ],
    matchScore: 73,
    latitude: 6.8649,
    longitude: 79.8997,
    // AI Match Fields
    hasGarden: true,
    hasModernKitchen: true,
    hasSecurity: true,
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
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
    ],
    matchScore: 69,
    latitude: 7.2906,
    longitude: 80.6337,
    // AI Match Fields
    hasSecurity: true,
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
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80',
    ],
    matchScore: 65,
    latitude: 7.2906,
    longitude: 80.6337,
    // AI Match Fields
    hasGarden: true,
    parkingSpaces: 3,
    isOwnHome: true,
    isVacationHome: true,
    isSuburban: true,
    isQuietArea: true,
  },
]

// ─── Main ─────────────────────────────────────────────────────────────────────
// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🌱  Starting property seed…')

  const agentData = [
    {
      firstName: 'Saman',
      lastName: 'Perera',
      email: 'saman@nexabuild.lk',
      phone: '+94 77 123 4567',
      company: 'NexaBuild Realty',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150',
    },
    {
      firstName: 'Kasun',
      lastName: 'Perera',
      email: 'kasun.perera@nexabuild.com',
      phone: '+94 77 123 4567',
      company: 'NexaBuild Properties',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    },
    {
      firstName: 'Amaya',
      lastName: 'Fernando',
      email: 'amaya.fernando@nexabuild.com',
      phone: '+94 76 234 5678',
      company: 'NexaBuild Lands',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    },
    {
      firstName: 'Dilan',
      lastName: 'Wijesinghe',
      email: 'dilan.wijesinghe@nexabuild.com',
      phone: '+94 71 345 6789',
      company: 'NexaBuild Realty',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    },
    {
      firstName: 'Ravindu',
      lastName: 'Gamage',
      email: 'ravindugamage@gmail.com',
      phone: '7854321456',
      company: 'NexaBuild Agent Partner',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
  ]

  console.log('👤  Seeding agents and synchronizing user profiles...')
  const hashedPassword = await bcrypt.hash('password123', 10)
  const agentMap: Record<string, string> = {}

  for (const a of agentData) {
    // 1. Ensure user exists
    await prisma.user.upsert({
      where: { email: a.email },
      update: {
        firstName: a.firstName,
        lastName: a.lastName,
        phone: a.phone,
        role: Role.AGENT,
        avatar: a.avatar,
      },
      create: {
        email: a.email,
        firstName: a.firstName,
        lastName: a.lastName,
        password: hashedPassword,
        phone: a.phone,
        role: Role.AGENT,
        isVerified: true,
        avatar: a.avatar,
      },
    })

    // 2. Ensure agent profile exists
    const agent = await prisma.agent.upsert({
      where: { email: a.email },
      update: {
        firstName: a.firstName,
        lastName: a.lastName,
        phone: a.phone,
        company: a.company,
        avatar: a.avatar,
      },
      create: {
        firstName: a.firstName,
        lastName: a.lastName,
        email: a.email,
        phone: a.phone,
        company: a.company,
        avatar: a.avatar,
      },
    })

    agentMap[a.email] = agent.id
    console.log(`   - Seeded Agent/User: ${a.firstName} ${a.lastName} (${a.email})`)
  }

  // Clear existing properties
  const deleted = await prisma.property.deleteMany()
  console.log(`🗑️   Cleared ${deleted.count} existing property record(s).`)

  // Map each property to an agent
  const propertiesToInsert = properties.map((p, index) => {
    let email = 'saman@nexabuild.lk' // default
    if (index === 1 || index === 5) email = 'kasun.perera@nexabuild.com'
    else if (index === 2 || index === 6) email = 'amaya.fernando@nexabuild.com'
    else if (index === 3 || index === 7) email = 'dilan.wijesinghe@nexabuild.com'
    else if (index === 8) email = 'ravindugamage@gmail.com'

    return {
      ...p,
      agentId: agentMap[email] || null,
    }
  })

  // Insert properties
  const result = await prisma.property.createMany({
    data: propertiesToInsert,
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
