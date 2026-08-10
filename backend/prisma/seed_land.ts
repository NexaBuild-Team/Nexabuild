import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })


async function main() {
  console.log('Seeding land data...')

  // Clear existing land records to avoid duplicates
  await prisma.land.deleteMany()

  const lands = [
    {
      name: 'Prime Residential Land, Colombo 5',
      description: 'Excellent residential plot in a highly sought-after neighborhood in Colombo 5. Close to leading schools, hospitals, and supermarkets. Ideal for building a luxury family home.',
      price: 28500000,
      location: 'Colombo 5, Western Province',
      perches: 15,
      sqft: 3600,
      status: 'For Sale',
      landType: 'Residential',
      purpose: 'Build Home',
      environment: 'City / Urban Area',
      developmentPlan: 'Build / Develop Immediately',
      images: [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop&q=80'
      ],
      matchScore: 96,
      latitude: 6.8924,
      longitude: 79.8732
    },
    {
      name: 'Scenic Land Parcel, Kandy',
      description: 'Beautiful land with panoramic mountain views in Kandy. Perfect for a vacation home, villa project, or nature-loving residential development. Quiet and serene environment.',
      price: 12000000,
      location: 'Kandy, Central Province',
      perches: 20,
      sqft: 4800,
      status: 'For Sale',
      landType: 'Residential',
      purpose: 'Build Home',
      environment: 'Scenic / Hill Country',
      developmentPlan: 'Build / Develop Immediately',
      images: [
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop&q=80'
      ],
      matchScore: 88,
      latitude: 7.2906,
      longitude: 80.6337
    },
    {
      name: 'Beach Access Land, Negombo',
      description: 'Premium beach-side plot with direct access to the Negombo beach belt. Outstanding opportunity for a boutique hotel, guest house, or high-value tourism development project.',
      price: 54000000,
      location: 'Negombo, Western Province',
      perches: 48,
      sqft: 10890,
      status: 'For Sale',
      landType: 'Tourism',
      purpose: 'Investment',
      environment: 'Coastal / Beachfront',
      developmentPlan: 'Build / Develop Immediately',
      images: [
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80'
      ],
      matchScore: 91,
      latitude: 7.2111,
      longitude: 79.8386
    },
    {
      name: 'Coastal Plot, Galle',
      description: 'Stunning cliffside coastal land near the historic Galle Fort. Offers breathtaking views of the Indian Ocean. Perfect for a luxury hotel development or exclusive private villa.',
      price: 62000000,
      location: 'Galle, Southern Province',
      perches: 35,
      sqft: 7600,
      status: 'Premium',
      landType: 'Tourism',
      purpose: 'Investment',
      environment: 'Coastal / Beachfront',
      developmentPlan: 'Hold for Appreciation',
      images: [
        'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&auto=format&fit=crop&q=80'
      ],
      matchScore: 94,
      latitude: 6.0535,
      longitude: 80.2210
    }
  ]

  for (const land of lands) {
    const created = await prisma.land.create({ data: land })
    console.log(`Created land: ${created.name} (${created.id})`)
  }

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
