export interface Company {
  id: number
  name: string
  initials: string
  color: string
  rating: number
  reviews: number
  location: string
  description: string
  projects: number
  experience: number
  startingPrice: string
  tags: string[]
  featured?: boolean
  coverBg: string
  coverImage: string
  tagline: string
  established: number
  phone: string
  email: string
  website: string
  about: string
  mission: string
  vision: string
  coreValues: string[]
  avgResponseTime: string
  clientSatisfaction: number
  avgProjectCost: string
}

const companyDefaults = {
  coverImage: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&q=90',
  tagline: 'Building Sri Lanka with premium quality and trusted craftsmanship.',
  established: 2004,
  phone: '+94 11 456 7890',
  email: 'info@company.lk',
  website: 'www.company.lk',
  about: `We are a full-service construction company committed to delivering excellence across residential, commercial, and hospitality projects. Our team blends technical strength with thoughtful design to create buildings that last and inspire.

We focus on transparency, quality, and strong client partnerships, providing end-to-end support from planning through handover. Every project reflects our deep knowledge of Sri Lankan construction standards and modern sustainability best practices.`,
  mission: 'To deliver outstanding built environments through integrity, innovation, and craftsmanship.',
  vision: 'To be the most respected construction partner in Sri Lanka, known for quality, reliability, and sustainable building.',
  coreValues: ['Integrity', 'Excellence', 'Innovation', 'Sustainability', 'Customer Focus'],
  avgResponseTime: '< 2 hrs',
  clientSatisfaction: 98,
  avgProjectCost: 'LKR 18M',
}

export const companies: Company[] = [
  {
    id: 1,
    name: 'Heritage Construction',
    initials: 'H',
    color: '#345b79',
    rating: 4.9,
    reviews: 312,
    location: 'Colombo',
    description: 'Crafting premium residential and commercial masterpieces with over two decades of architectural excellence.',
    projects: 512,
    experience: 19,
    startingPrice: 'LKR 3.5M',
    tags: ['Residential', 'Commercial'],
    featured: true,
    coverBg: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80',
    ...companyDefaults,
  },
  {
    id: 2,
    name: 'CMI Construction Co.',
    initials: 'C',
    color: '#be5d3f',
    rating: 4.7,
    reviews: 198,
    location: 'Gampaha',
    description: "Sri Lanka's leading large-scale commercial and mixed-use development specialist.",
    projects: 270,
    experience: 25,
    startingPrice: 'LKR8M',
    tags: ['Commercial', 'Industrial'],
    featured: true,
    coverBg: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
    ...companyDefaults,
  },
  {
    id: 3,
    name: 'Sithara Builders & Engineers',
    initials: 'S',
    color: '#495d38',
    rating: 4.8,
    reviews: 267,
    location: 'Kandy',
    description: 'Delivering high-quality residential homes and heritage renovations across Central Sri Lanka.',
    projects: 196,
    experience: 11,
    startingPrice: 'LKR 2.6M',
    tags: ['Residential', 'Renovation'],
    coverBg: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
    ...companyDefaults,
  },
  {
    id: 4,
    name: 'Lanka Build Pro (Pvt) Ltd',
    initials: 'L',
    color: '#928d64',
    rating: 4.5,
    reviews: 134,
    location: 'Galle',
    description: 'Fast, reliable and affordable construction with sustainable practices for modern Sri Lankan life.',
    projects: 154,
    experience: 9,
    startingPrice: 'LKR 2.4M',
    tags: ['Residential', 'Commercial'],
    coverBg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
    ...companyDefaults,
  },
  {
    id: 5,
    name: 'Avant-Garde Constructions',
    initials: 'A',
    color: '#6b879c',
    rating: 4.9,
    reviews: 89,
    location: 'Colombo',
    description: 'Bespoke architectural constructions tailored to exacting standards, delivering award-winning structures.',
    projects: 85,
    experience: 11,
    startingPrice: 'LKR 12M',
    tags: ['Luxury', 'Residential'],
    coverBg: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80',
    ...companyDefaults,
  },
  {
    id: 6,
    name: 'Millennium Builders (Pvt) Ltd',
    initials: 'M',
    color: '#be5d3f',
    rating: 4.7,
    reviews: 221,
    location: 'Colombo',
    description: 'Modern high-rise residential and apartment complexes built to a class of its own.',
    projects: 231,
    experience: 21,
    startingPrice: 'LKR 8M',
    tags: ['Commercial', 'Residential'],
    coverBg: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',
    ...companyDefaults,
  },
]
