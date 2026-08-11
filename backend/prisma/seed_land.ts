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
      description: 'Excellent residential plot in a highly sought-after neighborhood in Colombo 5. Wide 20ft carpeted road access. Close to leading schools, hospitals, and supermarkets. Ideal for building a luxury family home.',
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
        'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=800&auto=format&fit=crop&q=80'
      ],
      matchScore: 96,
      latitude: 6.8924,
      longitude: 79.8732
    },
    {
      name: 'Scenic Land Parcel, Kandy',
      description: 'Beautiful land with panoramic mountain views in Kandy. 12ft scenic access road. Perfect for a vacation home, villa project, or nature-loving residential development. Quiet and serene environment.',
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
        'https://images.unsplash.com/photo-1545167622-3a6ac756afa4?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1563889362-383b7afc601c?w=800&auto=format&fit=crop&q=80'
      ],
      matchScore: 88,
      latitude: 7.2906,
      longitude: 80.6337
    },
    {
      name: 'Beach Access Land, Negombo',
      description: 'Premium beach-side plot with direct access to the Negombo beach belt. Wide 30ft container access road. Outstanding opportunity for a boutique hotel, guest house, or high-value tourism development project.',
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
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&auto=format&fit=crop&q=80'
      ],
      matchScore: 91,
      latitude: 7.2111,
      longitude: 79.8386
    },
    {
      name: 'Coastal Plot, Galle',
      description: 'Stunning cliffside coastal land near the historic Galle Fort. Offers breathtaking views of the Indian Ocean. Wide 20ft road. Perfect for a luxury hotel development or exclusive private villa.',
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
        'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&auto=format&fit=crop&q=80'
      ],
      matchScore: 94,
      latitude: 6.0535,
      longitude: 80.2210
    },
    {
      name: 'Commercial Plot, Malabe',
      description: 'Strategically located commercial plot on the main road in Malabe. Wide 40ft main road frontage. Highly visible and ideal for office spaces, retail store, or showroom development.',
      price: 22000000,
      location: 'Malabe, Colombo, Western Province',
      perches: 12,
      sqft: 2800,
      status: 'For Sale',
      landType: 'Commercial',
      purpose: 'Commercial Project',
      environment: 'City / Urban Area',
      developmentPlan: 'Build / Develop Immediately',
      images: [
        'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&auto=format&fit=crop&q=80'
      ],
      matchScore: 82,
      latitude: 6.9060,
      longitude: 79.9540
    },
    {
      name: 'Agricultural Estate, Kurunegala',
      description: 'Extensive agricultural coconut estate in Kurunegala. 15ft access road. Fully cultivated with high annual yields. Features good road access and utility connections.',
      price: 8500000,
      location: 'Kurunegala, North Western Province',
      perches: 160,
      sqft: 43560,
      status: 'For Sale',
      landType: 'Agricultural',
      purpose: 'Agriculture',
      environment: 'Countryside / Rural',
      developmentPlan: 'Agricultural Cultivation',
      images: [
        'https://images.unsplash.com/photo-1621274790572-7c325d6bc67f?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80'
      ],
      matchScore: 90,
      latitude: 7.4863,
      longitude: 80.3647
    },
    {
      name: 'Quiet Residential Plot, Battaramulla',
      description: 'Cozy and peaceful residential plot in Battaramulla. 15ft carpeted road access. Surrounded by green environments and situated in a secure gated community zone.',
      price: 19000000,
      location: 'Battaramulla, Colombo, Western Province',
      perches: 8,
      sqft: 1800,
      status: 'For Sale',
      landType: 'Residential',
      purpose: 'Build Home',
      environment: 'City / Urban Area',
      developmentPlan: 'Build / Develop Immediately',
      images: [
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop&q=80'
      ],
      matchScore: 78,
      latitude: 6.8989,
      longitude: 79.9224
    },
    {
      name: 'Industrial Land, Kaduwela',
      description: 'Spacious industrial land zone close to the outer circular highway interchange in Kaduwela. Wide 30ft heavy vehicle container road access. Perfect factory building, warehouses, or yards.',
      price: 45000000,
      location: 'Kaduwela, Colombo, Western Province',
      perches: 80,
      sqft: 21780,
      status: 'Premium',
      landType: 'Commercial',
      purpose: 'Commercial Project',
      environment: 'City / Urban Area',
      developmentPlan: 'Build / Develop Immediately',
      images: [
        'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&auto=format&fit=crop&q=80'
      ],
      matchScore: 85,
      latitude: 6.9356,
      longitude: 79.9842
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
