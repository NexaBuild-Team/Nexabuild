/**
 * architectureSeed.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Seeds the Architecture module tables with data mirrored from:
 *   frontend/src/services/architectureMockData.ts
 *
 * Covers:
 *   - ArchitectureCompany (6 firms)        + CompanySpecialization tags
 *   - FirmService (6 services per firm)    + FirmTeamMember (4 members)
 *   - FirmTestimonial (3 testimonials)
 *   - HouseDesign (9 designs)              + HouseDesignTag
 *   - DesignDetail (1 — Villa Lumina)
 *   - DesignGalleryImage, FloorPlan, DesignFeature
 *   - ConstructionPhase, DesignReview, RelatedProject
 *
 * Run with:
 *   npx ts-node -r tsconfig-paths/register prisma/architectureSeed.ts
 *
 * Or add a convenience script to package.json:
 *   "seed:architecture": "ts-node -r tsconfig-paths/register prisma/architectureSeed.ts"
 * ─────────────────────────────────────────────────────────────────────────────
 */

import 'dotenv/config'
// eslint-disable-next-line @typescript-eslint/no-require-imports
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
// Cast to `any` so the seed compiles before architecture migrations are applied.
// After running `prisma migrate deploy`, remove the cast for full type safety.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new PrismaClient({ adapter }) as any

// ─── Firm data (mirrors architectFirms in architectureMockData.ts) ────────────

const firms = [
  {
    id:              'silva-associates',
    name:            'Silva & Associates Architecture',
    avatarUrl:       'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face',
    coverImageUrl:   'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=360&fit=crop',
    email:           'info@silvaassociates.lk',
    locationLabel:   'Colombo 03',
    city:            'Colombo',
    country:         'Sri Lanka',
    yearsExperience: 18,
    projectCount:    143,
    awardsWon:       14,
    clientSatisfactionPct: 98,
    rating:          4.9,
    reviewCount:     47,
    description:     'Award-winning studio specialising in contemporary tropical residential and luxury commercial design throughout Sri Lanka.',
    budgetRangeLabel: 'LKR 5M – LKR 50M',
    specializations: ['Modern', 'Minimalist'],
  },
  {
    id:              'greenline-design',
    name:            'Greenline Design Studio',
    avatarUrl:       'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=face',
    coverImageUrl:   'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&h=360&fit=crop',
    email:           'studio@greenline.lk',
    locationLabel:   'Kandy',
    city:            'Kandy',
    country:         'Sri Lanka',
    yearsExperience: 11,
    projectCount:    89,
    awardsWon:       6,
    clientSatisfactionPct: 96,
    rating:          4.7,
    reviewCount:     89,
    description:     "Sustainable architecture firm renowned for eco-friendly, biophilic designs that harmonise with Sri Lanka's lush highland landscape.",
    budgetRangeLabel: 'LKR 3M – LKR 30M',
    specializations: ['Eco-Friendly', 'Residential'],
  },
  {
    id:              'lotus-architecture',
    name:            'Lotus Architecture Group',
    avatarUrl:       'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
    coverImageUrl:   'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=360&fit=crop',
    email:           'contact@lotusarchgroup.lk',
    locationLabel:   'Galle',
    city:            'Galle',
    country:         'Sri Lanka',
    yearsExperience: 24,
    projectCount:    217,
    awardsWon:       22,
    clientSatisfactionPct: 99,
    rating:          4.8,
    reviewCount:     217,
    description:     'Established firm with a legacy of iconic commercial and residential architecture across the Southern Province and greater Colombo.',
    budgetRangeLabel: 'LKR 10M – LKR 1B',
    specializations: ['Commercial', 'Luxury'],
  },
  {
    id:              'pinnacle-design',
    name:            'Pinnacle Design Co.',
    avatarUrl:       'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&crop=face',
    coverImageUrl:   'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=360&fit=crop',
    email:           'hello@pinnacledesign.lk',
    locationLabel:   'Negombo',
    city:            'Negombo',
    country:         'Sri Lanka',
    yearsExperience: 9,
    projectCount:    61,
    awardsWon:       4,
    clientSatisfactionPct: 95,
    rating:          4.6,
    reviewCount:     61,
    description:     "Boutique firm specialising in luxury beachfront villas and high-end interior design for Sri Lanka's western coastal belt.",
    budgetRangeLabel: 'LKR 8M – LKR 80M',
    specializations: ['Luxury', 'Interior Design'],
  },
  {
    id:              'skyline-architects',
    name:            'Skyline Architects Pvt Ltd',
    avatarUrl:       'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
    coverImageUrl:   'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=360&fit=crop',
    email:           'info@skylinearchitects.lk',
    locationLabel:   'Jaffna',
    city:            'Jaffna',
    country:         'Sri Lanka',
    yearsExperience: 7,
    projectCount:    38,
    awardsWon:       3,
    clientSatisfactionPct: 94,
    rating:          4.5,
    reviewCount:     38,
    description:     'Modern practice bringing contemporary design solutions to the Northern Province, blending local vernacular with global aesthetics.',
    budgetRangeLabel: 'LKR 2M – LKR 20M',
    specializations: ['Residential', 'Sustainable Design'],
  },
  {
    id:              'heritage-design',
    name:            'Heritage Design Associates',
    avatarUrl:       'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    coverImageUrl:   'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=360&fit=crop&auto=format',
    email:           'projects@heritagedesign.lk',
    locationLabel:   'Colombo 07',
    city:            'Colombo',
    country:         'Sri Lanka',
    yearsExperience: 22,
    projectCount:    104,
    awardsWon:       18,
    clientSatisfactionPct: 99,
    rating:          4.9,
    reviewCount:     104,
    description:     "Masters of colonial revival and heritage restoration, trusted by Sri Lanka's foremost hospitality brands and private estates.",
    budgetRangeLabel: 'LKR 5M – LKR 200M',
    specializations: ['Colonial', 'Hospitality'],
  },
]

// ─── Services shared template (one set per firm — localised per firm below) ──

const sharedServices = [
  { icon: '🏠', title: 'Residential Design',    description: 'Custom home designs tailored to your lifestyle, from modern urban homes to tropical retreat residences throughout Sri Lanka.', sortOrder: 0 },
  { icon: '🏖️', title: 'Luxury Villas',         description: 'High-end villa architecture with premium finishes, panoramic layouts, and resort-style amenities for discerning clients.', sortOrder: 1 },
  { icon: '🏢', title: 'Commercial Buildings',   description: 'Corporate offices, retail complexes, and hospitality developments built to the highest international design standards.', sortOrder: 2 },
  { icon: '🛋️', title: 'Interior Design',        description: 'Seamless interior design services that extend the architectural vision into every space, surface, and material detail.', sortOrder: 3 },
  { icon: '🌿', title: 'Landscape Design',       description: 'Biophilic outdoor environments, courtyard gardens, and sustainable landscape masterplanning for tropical climates.', sortOrder: 4 },
  { icon: '🔨', title: 'Renovation',             description: 'Breathing new life into existing structures through thoughtful architectural transformation and sensitive heritage adaptation.', sortOrder: 5 },
]

// ─── Team members (assigned to silva-associates; adjust IDs for other firms) ─

const silvaTeam = [
  { name: 'Arjun Silva',    title: 'Principal Architect', photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face', sortOrder: 0 },
  { name: 'Priya Mendis',   title: 'Creative Director',   photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face', sortOrder: 1 },
  { name: 'Rohan Fernando', title: 'Senior Architect',    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face', sortOrder: 2 },
  { name: 'Nisha Perera',   title: 'Project Manager',     photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face', sortOrder: 3 },
]

// ─── Testimonials (assigned to silva-associates) ──────────────────────────────

const silvaTestimonials = [
  {
    rating:    5,
    text:      'Silva & Associates exceeded every expectation. Their attention to detail and commitment to our vision produced a home that is truly extraordinary. The process was seamless from concept to completion.',
    author:    'Chaminda Senanayake',
    role:      'Homeowner · Colombo',
    avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=80&h=80&fit=crop&crop=face',
  },
  {
    rating:    5,
    text:      "Working with Arjun Silva's team was a transformative experience. They brought creativity, professionalism, and precision to every phase of our commercial development in Kandy.",
    author:    'Ravi Wickramasinghe',
    role:      'Developer · Kandy',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
  },
  {
    rating:    5,
    text:      'From the first consultation to the final walkthrough, Silva & Associates delivered a level of service that set the benchmark. Our villa is beyond anything we had ever imagined.',
    author:    'Priya Jayasuriya',
    role:      'Homeowner · Galle',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=face',
  },
]

// ─── House designs (mirrors houseDesigns in architectureMockData.ts) ──────────

const designs = [
  {
    id:            'villa-lumina',
    title:         'Villa Lumina',
    style:         'Modern',
    priceLkr:      2_400_000,
    architectName: 'Arjun Silva',
    companyId:     'silva-associates',
    imageUrl:      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop',
    bedrooms:      5,
    bathrooms:     4,
    sqftArea:      4200,
    locationLabel: 'Colombo 05',
    isSaved:       false,
    tags:          ['Modern', 'Luxury'],
  },
  {
    id:            'green-haven',
    title:         'Green Haven Residence',
    style:         'Sustainable',
    priceLkr:      1_200_000,
    architectName: 'Priya Mendis',
    companyId:     'greenline-design',
    imageUrl:      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&h=400&fit=crop',
    bedrooms:      4,
    bathrooms:     3,
    sqftArea:      3100,
    locationLabel: 'Kandy',
    isSaved:       true,
    tags:          ['Sustainable', 'Eco-Friendly'],
  },
  {
    id:            'ocean-breeze',
    title:         'Ocean Breeze Villa',
    style:         'Luxury',
    priceLkr:      3_800_000,
    architectName: 'Kasun Rajapaksa',
    companyId:     'pinnacle-design',
    imageUrl:      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop',
    bedrooms:      6,
    bathrooms:     5,
    sqftArea:      5800,
    locationLabel: 'Negombo',
    isSaved:       false,
    tags:          ['Luxury', 'Beachfront'],
  },
  {
    id:            'highland-retreat',
    title:         'Highland Retreat',
    style:         'Minimalist',
    priceLkr:      950_000,
    architectName: 'Nisha Fernando',
    companyId:     'greenline-design',
    imageUrl:      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop',
    bedrooms:      3,
    bathrooms:     2,
    sqftArea:      2200,
    locationLabel: 'Nuwara Eliya',
    isSaved:       false,
    tags:          ['Minimalist', 'Hillside'],
  },
  {
    id:            'pearl-residence',
    title:         'The Pearl Residence',
    style:         'Colonial',
    priceLkr:      1_750_000,
    architectName: 'Dilshan Perera',
    companyId:     'heritage-design',
    imageUrl:      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop',
    bedrooms:      5,
    bathrooms:     4,
    sqftArea:      4600,
    locationLabel: 'Colombo 07',
    isSaved:       true,
    tags:          ['Colonial', 'Heritage'],
  },
  {
    id:            'lotus-tower-penthouse',
    title:         'Lotus Tower Penthouse',
    style:         'Modern',
    priceLkr:      5_200_000,
    architectName: 'Rohan Gunasekara',
    companyId:     'lotus-architecture',
    imageUrl:      'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=400&fit=crop',
    bedrooms:      4,
    bathrooms:     4,
    sqftArea:      3900,
    locationLabel: 'Colombo 01',
    isSaved:       false,
    tags:          ['Modern', 'High-Rise'],
  },
  {
    id:            'galle-coast-house',
    title:         'Galle Coast House',
    style:         'Sustainable',
    priceLkr:      1_450_000,
    architectName: 'Amaya Wickramasinghe',
    companyId:     'skyline-architects',
    imageUrl:      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop',
    bedrooms:      4,
    bathrooms:     3,
    sqftArea:      3400,
    locationLabel: 'Galle',
    isSaved:       false,
    tags:          ['Sustainable', 'Coastal'],
  },
  {
    id:            'ayura-sanctuary',
    title:         'Ayura Sanctuary',
    style:         'Minimalist',
    priceLkr:      820_000,
    architectName: 'Thilini Jayawardena',
    companyId:     'heritage-design',
    imageUrl:      'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=600&h=400&fit=crop',
    bedrooms:      3,
    bathrooms:     2,
    sqftArea:      1900,
    locationLabel: 'Bentota',
    isSaved:       false,
    tags:          ['Minimalist', 'Wellness'],
  },
  {
    id:            'mahaweli-manor',
    title:         'Mahaweli Manor',
    style:         'Luxury',
    priceLkr:      2_900_000,
    architectName: 'Ravi Wijeratne',
    companyId:     'lotus-architecture',
    imageUrl:      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&h=400&fit=crop',
    bedrooms:      6,
    bathrooms:     5,
    sqftArea:      6200,
    locationLabel: 'Kandy',
    isSaved:       false,
    tags:          ['Luxury', 'Riverside'],
  },
]

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱  Starting Architecture module seed…')

  // ── 1. Clear existing architecture data (order matters for FK constraints) ──
  console.log('🗑️   Clearing existing architecture records…')
  await prisma.relatedProject.deleteMany()
  await prisma.designReview.deleteMany()
  await prisma.constructionPhase.deleteMany()
  await prisma.designFeature.deleteMany()
  await prisma.floorPlan.deleteMany()
  await prisma.designGalleryImage.deleteMany()
  await prisma.designDetail.deleteMany()
  await prisma.houseDesignTag.deleteMany()
  await prisma.houseDesign.deleteMany()
  await prisma.firmTestimonial.deleteMany()
  await prisma.firmTeamMember.deleteMany()
  await prisma.firmService.deleteMany()
  await prisma.companySpecialization.deleteMany()
  await prisma.architectureCompany.deleteMany()
  console.log('✅  Architecture tables cleared.')

  // ── 2. Seed ArchitectureCompany rows + relations ───────────────────────────
  console.log('🏢  Seeding architecture companies…')
  for (const firm of firms) {
    const { specializations, ...firmData } = firm
    await prisma.architectureCompany.create({
      data: {
        ...firmData,
        specializations: {
          create: specializations.map((label) => ({ label })),
        },
        // Seed services for every firm using the shared template
        services: {
          create: sharedServices.map((s) => ({ ...s })),
        },
        // Only seed team + testimonials for the primary firm (silva-associates)
        ...(firm.id === 'silva-associates' && {
          teamMembers:  { create: silvaTeam },
          testimonials: { create: silvaTestimonials },
        }),
      },
    })
  }
  console.log(`✅  Seeded ${firms.length} companies.`)

  // ── 3. Seed HouseDesign rows ───────────────────────────────────────────────
  console.log('🏠  Seeding house designs…')
  for (const design of designs) {
    const { tags, ...designData } = design
    await prisma.houseDesign.create({
      data: {
        ...designData,
        tags: { create: tags.map((label) => ({ label })) },
      },
    })
  }
  console.log(`✅  Seeded ${designs.length} house designs.`)

  // ── 4. Seed DesignDetail for Villa Lumina ─────────────────────────────────
  console.log('🏛️   Seeding Villa Lumina design detail…')

  await prisma.designDetail.create({
    data: {
      designId:              'villa-lumina',
      breadcrumb:            ['Home', 'Architecture Designs', 'Villa Lumina'],
      architectName:         'Arjun Silva',
      architectFirm:         'Silva & Associates Architecture',
      locationLabel:         'Colombo 05, Sri Lanka',
      completionYear:        2024,
      status:                'COMPLETED',
      heroImageUrl:          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1400&h=600&fit=crop',
      threeDVisualizationUrl:'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=500&fit=crop',
      priceLkr:              2_400_000,
      bedrooms:              5,
      bathrooms:             4,
      sqftArea:              4200,
      garageSpaces:          2,
      overview:
        'Villa Lumina is a landmark contemporary residence nestled in the heart of Colombo 05, conceived as a luminous retreat that bridges indoor and outdoor living.\n\n' +
        "Designed by award-winning architect Arjun Silva, the project draws inspiration from Sri Lanka's tropical light, using expansive glazing, natural stone, and lush courtyard gardens to create a home that breathes with its environment.\n\n" +
        'The 4,200 sq ft layout encompasses five en-suite bedrooms, a chef\'s kitchen with Calacatta marble finishes, a sky-deck pool, and a home theatre — all orchestrated around a double-height living pavilion flooded with natural light.',
      designStyle:   'Modern Minimalist',
      structureType: 'Reinforced Concrete',
      interiorFinish:'Custom Designed',

      // Gallery images
      gallery: {
        create: [
          { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',  altText: 'Villa Lumina — main living area',  sortOrder: 0 },
          { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',    altText: 'Villa Lumina — kitchen',           sortOrder: 1 },
          { url: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=400&h=300&fit=crop',  altText: 'Villa Lumina — bedroom suite',     sortOrder: 2 },
          { url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop',  altText: 'Villa Lumina — dining room',       sortOrder: 3 },
          { url: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=400&h=300&fit=crop',  altText: 'Villa Lumina — exterior pool deck', sortOrder: 4 },
        ],
      },

      // Floor plans
      floorPlans: {
        create: [
          { label: 'Ground Floor Plan', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',            sortOrder: 0 },
          { label: 'Upper Floor Plan',  imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&sat=-100',   sortOrder: 1 },
        ],
      },

      // Features
      features: {
        create: [
          { icon: '🌿', label: 'Tropical Garden',      sortOrder: 0 },
          { icon: '🏊', label: 'Sky-Deck Pool',         sortOrder: 1 },
          { icon: '⚡', label: 'Solar Panels',           sortOrder: 2 },
          { icon: '🎬', label: 'Home Theatre',           sortOrder: 3 },
          { icon: '🚗', label: '2-Car Garage',           sortOrder: 4 },
          { icon: '🔒', label: 'Smart Security',         sortOrder: 5 },
          { icon: '💧', label: 'Rainwater Harvest',      sortOrder: 6 },
          { icon: '🌬️', label: 'Natural Ventilation',   sortOrder: 7 },
        ],
      },

      // Construction progress timeline
      constructionProgress: {
        create: [
          {
            phase:     'Design & Planning',
            detail:    'Architectural drawings, structural engineering, MEP design completed. Council permits approved.',
            status:    'DONE',
            sortOrder: 0,
          },
          {
            phase:     'Foundation & Structure',
            detail:    'Reinforced concrete raft foundation and post-tensioned slabs completed across all three levels.',
            status:    'DONE',
            sortOrder: 1,
          },
          {
            phase:     'Shell & Core',
            detail:    'Masonry walls, roof structure, and external glazing installation — 100% complete.',
            status:    'DONE',
            sortOrder: 2,
          },
          {
            phase:     'Off-Site Interiors',
            detail:    'Custom joinery, marble slabs, and imported fittings fabricated and delivered on site.',
            status:    'ACTIVE',
            sortOrder: 3,
          },
        ],
      },

      // Featured client review
      review: {
        create: {
          author:     'Chaminda Senanayake',
          avatarUrl:  'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=80&h=80&fit=crop&crop=face',
          rating:     5,
          text:       'Working with Arjun Silva and the team was an absolute pleasure from start to finish. They translated our vision into a home that surpasses every expectation — from the breathtaking double-height living space to the finest material selections. Villa Lumina is not just a house, it is an experience.',
          reviewDate: 'March 2025',
        },
      },

      // Related project tiles
      relatedProjects: {
        create: [
          { targetDesignId: 'pearl-residence',       title: 'The Pearl Residence',    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=260&fit=crop', style: 'Colonial', priceLkr: 1_750_000, sortOrder: 0 },
          { targetDesignId: 'ocean-breeze',          title: 'Ocean Breeze Villa',     imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=260&fit=crop', style: 'Luxury',   priceLkr: 3_800_000, sortOrder: 1 },
          { targetDesignId: 'lotus-tower-penthouse', title: 'Lotus Tower Penthouse',  imageUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=260&fit=crop', style: 'Modern',   priceLkr: 5_200_000, sortOrder: 2 },
        ],
      },
    },
  })

  console.log('✅  Villa Lumina design detail seeded.')
  console.log('🎉  Architecture module seed complete!')
}

main()
  .catch((err) => {
    console.error('❌  Architecture seed failed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
