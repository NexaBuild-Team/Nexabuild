import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router'

// ─── Mock Data ────────────────────────────────────────────────────────────────
const landDetailsData: Record<string, {
  id: number
  name: string
  location: string
  province: string
  price: string
  pricePerPerch: string
  perches: string
  sqft: string
  type: string
  zoning: string
  roadFrontage: string
  utilities: string
  shape: string
  facing: string
  terrain: string
  titleType: string
  description: string
  highlights: string[]
  matchScore: number
  imgMain: string
  imgSec: string
  mapImg: string
  allImages: string[]
  schools: { name: string; dist: string }[]
  hospitals: { name: string; dist: string }[]
  supermarkets: { name: string; dist: string }[]
  agent: {
    name: string
    title: string
    rating: string
    reviews: string
    phone: string
    email: string
    img: string
  }
}> = {
  '1': {
    id: 1,
    name: 'Prime Residential Land, Colombo 5',
    location: 'Colombo 5, Western Province',
    province: 'Western Province',
    price: '28,500,000',
    pricePerPerch: '1,900,000',
    perches: '15 Perches',
    sqft: '3,600 sqft',
    type: 'Residential',
    zoning: 'Residential (R2)',
    roadFrontage: '20 ft Paved Road',
    utilities: 'Electricity, Water, Sewage',
    shape: 'Regular / Rectangular',
    facing: 'East Facing',
    terrain: 'Flat',
    titleType: 'Freehold',
    description: 'This exceptional residential land parcel is located in the heart of Colombo 5, one of Sri Lanka\'s most sought-after residential addresses. The 15-perch flat terrain plot offers 20ft road frontage with easy access to major arterial roads, schools, and hospitals.\n\nFully serviced with electricity, water and sewage connections available at the boundary. The land is freehold and comes with a clear title, making it ideal for constructing a luxury family residence or boutique development.',
    highlights: [
      '20ft paved road access',
      'Flat and regular terrain',
      'Freehold clear title',
      'All utilities available',
      'Walking distance to schools',
      '5 min drive to Colombo city',
    ],
    matchScore: 96,
    imgMain: 'https://images.unsplash.com/photo-1500382017468-1049fed747ef?w=1200&auto=format&fit=crop&q=80',
    imgSec: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop&q=80',
    mapImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCI_JnVYXjuzdrylMsDM2KZh0SVqpGGL0PCDYY_V0VXOymQap78MtFqlRbzdZ5Jh3vA8WnM4dDtM_zFpF3QU4aQQ13kAd0t7332qwhhlYt4vYcaJ7ncSDveAFZVlsFKgva_Iv-pvhhBUMfhLij-I871AhlDg_XkLeIwNqeXjS5KTjhYlnxC6AHAarTuWL-J6c0n9vUpBrpZqUjqn09scOOns04Q05opFD8nlFEhimlk9UNG-HW4TrxWGk6KrodOtiSVtXxU82XpMK8',
    allImages: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    ],
    schools: [
      { name: 'Royal College Colombo', dist: '0.4 km' },
      { name: 'Ladies College', dist: '0.7 km' },
      { name: 'Colombo International School', dist: '1.2 km' },
    ],
    hospitals: [
      { name: 'Asiri Medical Hospital', dist: '0.6 km' },
      { name: 'Nawaloka Hospital', dist: '1.1 km' },
      { name: 'Lanka Hospital', dist: '2.3 km' },
    ],
    supermarkets: [
      { name: 'Cargills Food City', dist: '0.3 km' },
      { name: 'Keells Super', dist: '0.8 km' },
      { name: 'Arpico Supercentre', dist: '1.6 km' },
    ],
    agent: {
      name: 'Saman Perera',
      title: 'Senior Land Consultant',
      rating: '4.9',
      reviews: '86 reviews',
      phone: '+94 77 234 5678',
      email: 'saman@nexabuild.lk',
      img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    },
  },
  '2': {
    id: 2,
    name: 'Scenic Land Parcel, Kandy',
    location: 'Kandy, Central Province',
    province: 'Central Province',
    price: '12,000,000',
    pricePerPerch: '600,000',
    perches: '20 Perches',
    sqft: '4,800 sqft',
    type: 'Residential',
    zoning: 'Residential (R1)',
    roadFrontage: '15 ft Tar Road',
    utilities: 'Electricity, Water Line',
    shape: 'Slight Slope',
    facing: 'North Facing',
    terrain: 'Hilly / Stepped',
    titleType: 'Freehold Sinnakkara Title',
    description: 'Beautiful stepped plot overlooking Kandy valley. Ideal for an eco-villa, holiday cottage, or unique multi-level home design. Located just 15 minutes away from the main Kandy city center with peaceful and calm surroundings.',
    highlights: [
      'Stunning mountain views',
      'Clean air and quiet environment',
      'Freehold Sinnakkara title deeds',
      'Electricity and water board connection ready',
      '15 min drive to Kandy Town',
    ],
    matchScore: 88,
    imgMain: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop&q=80',
    imgSec: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
    mapImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCI_JnVYXjuzdrylMsDM2KZh0SVqpGGL0PCDYY_V0VXOymQap78MtFqlRbzdZ5Jh3vA8WnM4dDtM_zFpF3QU4aQQ13kAd0t7332qwhhlYt4vYcaJ7ncSDveAFZVlsFKgva_Iv-pvhhBUMfhLij-I871AhlDg_XkLeIwNqeXjS5KTjhYlnxC6AHAarTuWL-J6c0n9vUpBrpZqUjqn09scOOns04Q05opFD8nlFEhimlk9UNG-HW4TrxWGk6KrodOtiSVtXxU82XpMK8',
    allImages: [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    ],
    schools: [
      { name: 'Trinity College Kandy', dist: '2.5 km' },
      { name: 'Dharmaraja College', dist: '3.1 km' },
      { name: 'Kingswood College', dist: '3.8 km' },
    ],
    hospitals: [
      { name: 'Kandy General Hospital', dist: '2.9 km' },
      { name: 'Lakeside Adventist Hospital', dist: '3.4 km' },
    ],
    supermarkets: [
      { name: 'Keells Kandy City Centre', dist: '2.2 km' },
      { name: 'Cargills Food City', dist: '1.8 km' },
    ],
    agent: {
      name: 'Kumari Fernando',
      title: 'Property Consultant',
      rating: '4.8',
      reviews: '42 reviews',
      phone: '+94 77 987 6543',
      email: 'kumari@nexabuild.lk',
      img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
  },
  '3': {
    id: 3,
    name: 'Scenic Land, Nuwara Eliya',
    location: 'Nuwara Eliya, CP',
    province: 'Central Province',
    price: '45,000,000',
    pricePerPerch: '750,000',
    perches: '60 Perches',
    sqft: '14,400 sqft',
    type: 'Agricultural / Tourism',
    zoning: 'Agricultural / Tourism',
    roadFrontage: '12 ft Private Access',
    utilities: 'Electricity, Natural Well Water',
    shape: 'Slightly Terraced',
    facing: 'South Facing',
    terrain: 'Valley Vista',
    titleType: 'Freehold Sinnakkara',
    description: 'Perfect commercial or high-end residential land plot in cool Nuwara Eliya. Ideal for a tea garden villa, boutique resort, or retirement home. The site enjoys scenic panoramic valley vistas and cold mountain climate year-round.',
    highlights: [
      'Panoramic tea estate vistas',
      'Quiet, pristine cold climate zone',
      'Freehold Sinnakkara clear deed',
      'High growth tourism zone',
    ],
    matchScore: 78,
    imgMain: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
    imgSec: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
    mapImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCI_JnVYXjuzdrylMsDM2KZh0SVqpGGL0PCDYY_V0VXOymQap78MtFqlRbzdZ5Jh3vA8WnM4dDtM_zFpF3QU4aQQ13kAd0t7332qwhhlYt4vYcaJ7ncSDveAFZVlsFKgva_Iv-pvhhBUMfhLij-I871AhlDg_XkLeIwNqeXjS5KTjhYlnxC6AHAarTuWL-J6c0n9vUpBrpZqUjqn09scOOns04Q05opFD8nlFEhimlk9UNG-HW4TrxWGk6KrodOtiSVtXxU82XpMK8',
    allImages: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
    ],
    schools: [
      { name: 'Our Lady Primary School', dist: '1.9 km' },
      { name: 'Nuwara Eliya High School', dist: '2.5 km' },
    ],
    hospitals: [
      { name: 'District General Hospital', dist: '1.2 km' },
    ],
    supermarkets: [
      { name: 'Cargills Nuwara Eliya 2', dist: '1.4 km' },
      { name: 'Keells Super', dist: '2.0 km' },
    ],
    agent: {
      name: 'Saman Perera',
      title: 'Senior Land Consultant',
      rating: '4.9',
      reviews: '86 reviews',
      phone: '+94 77 234 5678',
      email: 'saman@nexabuild.lk',
      img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    },
  },
  '4': {
    id: 4,
    name: 'Coastal Plot, Galle',
    location: 'Galle, Southern Province',
    province: 'Southern Province',
    price: '62,000,000',
    pricePerPerch: '1,771,428',
    perches: '35 Perches',
    sqft: '8,400 sqft',
    type: 'Commercial / Residential',
    zoning: 'Commercial / Residential',
    roadFrontage: '30 ft Main Road Access',
    utilities: 'Three-Phase CEB, Water Mains',
    shape: 'Rectangular Corner Plot',
    facing: 'West Facing Sea View',
    terrain: 'Flat Leveled Beachfront',
    titleType: 'Freehold Sinnakkara Title',
    description: 'Stunning beach access commercial land plot in Galle. Located in an extremely high-traffic tourist zone, this is a prime asset for building a boutique hotel, restaurant, surf retreat, or upscale luxury villa.',
    highlights: [
      'Immediate beach road access',
      'Rectangular flat corner site',
      'Three-phase electricity connection ready',
      'Ideal for hotel/tourism investments',
    ],
    matchScore: 92,
    imgMain: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    imgSec: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
    mapImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCI_JnVYXjuzdrylMsDM2KZh0SVqpGGL0PCDYY_V0VXOymQap78MtFqlRbzdZ5Jh3vA8WnM4dDtM_zFpF3QU4aQQ13kAd0t7332qwhhlYt4vYcaJ7ncSDveAFZVlsFKgva_Iv-pvhhBUMfhLij-I871AhlDg_XkLeIwNqeXjS5KTjhYlnxC6AHAarTuWL-J6c0n9vUpBrpZqUjqn09scOOns04Q05opFD8nlFEhimlk9UNG-HW4TrxWGk6KrodOtiSVtXxU82XpMK8',
    allImages: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
    ],
    schools: [
      { name: 'Richmond College Galle', dist: '3.8 km' },
      { name: 'Aloysius College', dist: '4.2 km' },
    ],
    hospitals: [
      { name: 'Karapitiya Teaching Hospital', dist: '5.1 km' },
      { name: 'Galle Co-op Hospital', dist: '3.2 km' },
    ],
    supermarkets: [
      { name: 'Arpico Supercentre Galle', dist: '2.5 km' },
      { name: 'Keells Galle Fort', dist: '1.9 km' },
    ],
    agent: {
      name: 'Kumari Fernando',
      title: 'Property Consultant',
      rating: '4.8',
      reviews: '42 reviews',
      phone: '+94 77 987 6543',
      email: 'kumari@nexabuild.lk',
      img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
  },
  '5': {
    id: 5,
    name: 'Agricultural Land, Kurunegala',
    location: 'Kurunegala, NW Province',
    province: 'North Western Province',
    price: '8,500,000',
    pricePerPerch: '26,562',
    perches: '320 Perches (2 Acres)',
    sqft: '87,120 sqft',
    type: 'Agricultural',
    zoning: 'Agricultural',
    roadFrontage: '12 ft Gravel Access Road',
    utilities: 'Single Phase CEB Boundary, Well Water',
    shape: 'Large Irregular Plot',
    facing: 'North-East Facing',
    terrain: 'Leveled Coconut Fields',
    titleType: 'Freehold Sinnakkara Title Deeds',
    description: 'Fully active coconut plantation field in Kurunegala. Yields approx 3,000 coconuts per harvest cycle. Contains fertile sandy loam soil with excellent drainage, border fences, and standard security locks.',
    highlights: [
      'Active coconut plantation yield',
      'Sandy loam soil perfect for crops',
      'Freehold Sinnakkara title deeds',
      'Boundary fully fenced and guarded',
    ],
    matchScore: 84,
    imgMain: 'https://images.unsplash.com/photo-1500049691191-0d58222e945c?w=1200&auto=format&fit=crop&q=80',
    imgSec: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
    mapImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCI_JnVYXjuzdrylMsDM2KZh0SVqpGGL0PCDYY_V0VXOymQap78MtFqlRbzdZ5Jh3vA8WnM4dDtM_zFpF3QU4aQQ13kAd0t7332qwhhlYt4vYcaJ7ncSDveAFZVlsFKgva_Iv-pvhhBUMfhLij-I871AhlDg_XkLeIwNqeXjS5KTjhYlnxC6AHAarTuWL-J6c0n9vUpBrpZqUjqn09scOOns04Q05opFD8nlFEhimlk9UNG-HW4TrxWGk6KrodOtiSVtXxU82XpMK8',
    allImages: [
      'https://images.unsplash.com/photo-1500049691191-0d58222e945c?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
    ],
    schools: [
      { name: 'Maliyadeva College', dist: '5.4 km' },
    ],
    hospitals: [
      { name: 'Kurunegala General Hospital', dist: '4.8 km' },
    ],
    supermarkets: [
      { name: 'Cargills Food City Kurunegala', dist: '4.2 km' },
    ],
    agent: {
      name: 'Saman Perera',
      title: 'Senior Land Consultant',
      rating: '4.9',
      reviews: '86 reviews',
      phone: '+94 77 234 5678',
      email: 'saman@nexabuild.lk',
      img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    },
  },
  '6': {
    id: 6,
    name: 'Lakefront Land, Colombo 10',
    location: 'Colombo 10, Western Province',
    province: 'Western Province',
    price: '55,000,000',
    pricePerPerch: '1,833,333',
    perches: '30 Perches',
    sqft: '7,200 sqft',
    type: 'Commercial / Residential',
    zoning: 'Commercial / Residential (R3)',
    roadFrontage: '30 ft Paved Road Access',
    utilities: 'Electricity, Water, Sewage',
    shape: 'Regular / Rectangular',
    facing: 'West Facing Lake View',
    terrain: 'Flat Leveled Lakefront',
    titleType: 'Freehold Sinnakkara Title',
    description: 'Prime lakefront land parcel in the heart of Colombo 10. Perfect for building a premium corporate office, residential complex, or large commercial venture with beautiful water views.',
    highlights: [
      'Stunning lakefront vistas',
      'Flat and rectangular corner plot',
      'Freehold clear title deeds ready',
      'High appreciation zone in Colombo center',
    ],
    matchScore: 94,
    imgMain: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    imgSec: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
    mapImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCI_JnVYXjuzdrylMsDM2KZh0SVqpGGL0PCDYY_V0VXOymQap78MtFqlRbzdZ5Jh3vA8WnM4dDtM_zFpF3QU4aQQ13kAd0t7332qwhhlYt4vYcaJ7ncSDveAFZVlsFKgva_Iv-pvhhBUMfhLij-I871AhlDg_XkLeIwNqeXjS5KTjhYlnxC6AHAarTuWL-J6c0n9vUpBrpZqUjqn09scOOns04Q05opFD8nlFEhimlk9UNG-HW4TrxWGk6KrodOtiSVtXxU82XpMK8',
    allImages: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
    ],
    schools: [
      { name: 'Nalanda College Colombo', dist: '1.2 km' },
      { name: 'Ananda College', dist: '1.5 km' },
    ],
    hospitals: [
      { name: 'National Hospital Colombo', dist: '2.0 km' },
    ],
    supermarkets: [
      { name: 'Arpico Supercentre Colombo 10', dist: '0.9 km' },
    ],
    agent: {
      name: 'Saman Perera',
      title: 'Senior Land Consultant',
      rating: '4.9',
      reviews: '86 reviews',
      phone: '+94 77 234 5678',
      email: 'saman@nexabuild.lk',
      img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    },
  },
  '7': {
    id: 7,
    name: 'Beach Access Land, Negombo',
    location: 'Negombo, Western Province',
    province: 'Western Province',
    price: '54,000,000',
    pricePerPerch: '1,125,000',
    perches: '48 Perches',
    sqft: '11,520 sqft',
    type: 'Tourism / Holiday',
    zoning: 'Tourism / Residential',
    roadFrontage: '25 ft Paved Road',
    utilities: 'Electricity, Main Water Board Connection',
    shape: 'Rectangular Plot',
    facing: 'West Facing Sea Vista',
    terrain: 'Flat Beach Access',
    titleType: 'Freehold Sinnakkara Title Deeds',
    description: 'Prime beach access land plot in Negombo. Ideal for building a luxury boutique hotel, tourist retreat, or private holiday home. Excellent connection to airport expressway.',
    highlights: [
      'Direct beach road frontage',
      'Flat leveled land ready for construction',
      'Freehold Sinnakkara title deeds',
      'Close to Colombo Airport and Expressway',
    ],
    matchScore: 91,
    imgMain: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    imgSec: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
    mapImg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCI_JnVYXjuzdrylMsDM2KZh0SVqpGGL0PCDYY_V0VXOymQap78MtFqlRbzdZ5Jh3vA8WnM4dDtM_zFpF3QU4aQQ13kAd0t7332qwhhlYt4vYcaJ7ncSDveAFZVlsFKgva_Iv-pvhhBUMfhLij-I871AhlDg_XkLeIwNqeXjS5KTjhYlnxC6AHAarTuWL-J6c0n9vUpBrpZqUjqn09scOOns04Q05opFD8nlFEhimlk9UNG-HW4TrxWGk6KrodOtiSVtXxU82XpMK8',
    allImages: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
    ],
    schools: [
      { name: 'Maris Stella College', dist: '2.1 km' },
      { name: 'Ave Maria Convent', dist: '2.4 km' },
    ],
    hospitals: [
      { name: 'Negombo General Hospital', dist: '1.9 km' },
    ],
    supermarkets: [
      { name: 'Cargills Food City Negombo', dist: '1.5 km' },
    ],
    agent: {
      name: 'Kumari Fernando',
      title: 'Property Consultant',
      rating: '4.8',
      reviews: '42 reviews',
      phone: '+94 77 987 6543',
      email: 'kumari@nexabuild.lk',
      img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
  },
}

// ─── Similar list generator ──────────────────────────────────────────────────
const similarLandsList = [
  { id: 3, name: 'Scenic Land, Nuwara Eliya', location: 'Nuwara Eliya, CP', price: 'LKR 45M', perches: '60 Perches', sqft: '14,400 sqft', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80' },
  { id: 4, name: 'Coastal Plot, Galle', location: 'Galle, Southern Province', price: 'LKR 62M', perches: '35 Perches', sqft: '8,400 sqft', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80' },
  { id: 5, name: 'Agricultural Land, Kurunegala', location: 'Kurunegala, NW Province', price: 'LKR 8.5M', perches: '2 Acres', sqft: '87,120 sqft', img: 'https://images.unsplash.com/photo-1500049691191-0d58222e945c?w=400&q=80' },
  { id: 6, name: 'Lakefront Land, Colombo 10', location: 'Colombo 10, Western Province', price: 'LKR 55M', perches: '30 Perches', sqft: '7,200 sqft', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80' },
]

export default function LandDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])
  const [saved, setSaved] = useState(false)
  const [showContact, setShowContact] = useState(false)
  const [contactMessage, setContactMessage] = useState('')
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false)

  // Fetch the land by dynamic ID, default to Colombo 5 (ID '1')
  const landIdStr = id && landDetailsData[id] ? id : '1'
  const land = landDetailsData[landIdStr]

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    setContactMessage('')
    setShowContact(false)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e6e0d4', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Navbar Spacer */}
      <div className="h-[80px]" />

      {/* Gallery Slideshow Modal */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col justify-between p-6">
          <div className="flex justify-between items-center text-white">
            <span className="text-sm font-semibold">Photo Gallery ({activeImageIndex + 1}/{land.allImages.length})</span>
            <button onClick={() => setIsGalleryModalOpen(false)} className="text-2xl font-bold cursor-pointer hover:opacity-75">✕</button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <img src={land.allImages[activeImageIndex]} alt="Detailed plot view" className="max-w-full max-h-[75vh] object-contain rounded-lg" />
          </div>
          <div className="flex justify-center gap-2 pb-4 overflow-x-auto">
            {land.allImages.map((imgUrl, i) => (
              <button
                key={i}
                onClick={() => setActiveImageIndex(i)}
                className="w-16 h-12 rounded border-2 overflow-hidden flex-shrink-0 transition-all"
                style={{ borderColor: activeImageIndex === i ? '#be5d3f' : 'transparent' }}
              >
                <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Main Container ── */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* ── Image Gallery ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8 rounded-2xl overflow-hidden h-[300px] md:h-[500px]">
          <div className="md:col-span-2 relative cursor-pointer group" onClick={() => { setActiveImageIndex(0); setIsGalleryModalOpen(true) }}>
            <img alt="Main property view" className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300" src={land.imgMain} />
          </div>
          <div className="relative h-full hidden md:block cursor-pointer group" onClick={() => { setActiveImageIndex(1); setIsGalleryModalOpen(true) }}>
            <img alt="Secondary view" className="w-full h-full object-cover brightness-75 group-hover:scale-[1.01] transition-transform duration-300" src={land.imgSec} />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <button className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2 text-slate-900 font-medium shadow-lg hover:bg-white transition-all cursor-pointer pointer-events-auto">
                📷 +{land.allImages.length} Photos
              </button>
            </div>
          </div>
        </section>

        {/* ── Split Layout: Left Content & Right Sidebar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ── LEFT CONTENT AREA ── */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Property Summary Header */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-2 font-medium">
                    <span>📍</span> {land.location.toUpperCase()}
                  </div>
                  <h1 className="text-3xl font-bold mb-4" style={{ color: '#1d1d1d' }}>{land.name}</h1>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded text-xs font-semibold">{land.type}</span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded text-xs font-semibold">{land.titleType}</span>
                    <span className="text-slate-400 text-xs ml-2">Listed: 3 days ago | ID: NXB-L-2025-0198</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-2xl font-bold text-slate-900">
                    <span className="text-sm font-semibold mr-1" style={{ color: '#be5d3f' }}>LKR</span>
                    {land.price}
                  </div>
                  <div className="text-slate-500 text-xs mt-1">LKR {land.pricePerPerch} per perch</div>
                  <span className="inline-block mt-2 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded">Negotiable</span>
                </div>
              </div>

              {/* Key Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-100">
                {[
                  { label: 'Land Size', val: land.perches, icon: '📐' },
                  { label: 'Total Area', val: land.sqft, icon: '⬛' },
                  { label: 'Road Frontage', val: land.roadFrontage.split(' ')[0] + ' ' + land.roadFrontage.split(' ')[1], icon: '🛣️' },
                  { label: 'Zoning', val: land.zoning, icon: '🗺️' },
                ].map(stat => (
                  <div key={stat.label} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 text-lg">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">{stat.label}</p>
                      <p className="text-sm font-bold text-slate-800">{stat.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Land Information Details Grid */}
            <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Land Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                {[
                  { label: 'LAND SIZE', val: `${land.perches} (${land.sqft})`, icon: '📐' },
                  { label: 'ZONING', val: land.zoning, icon: '🗺️' },
                  { label: 'ROAD ACCESS', val: land.roadFrontage, icon: '🛣️' },
                  { label: 'UTILITIES', val: land.utilities, icon: '⚡' },
                  { label: 'LAND SHAPE', val: land.shape, icon: '📦' },
                  { label: 'FACING DIRECTION', val: land.facing, icon: '🧭' },
                  { label: 'TERRAIN', val: land.terrain, icon: '⛰️' },
                  { label: 'TITLE TYPE', val: land.titleType, icon: '📄' },
                ].map(info => (
                  <div key={info.label} className="flex items-start gap-4">
                    <span className="text-lg mt-1">{info.icon}</span>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">{info.label}</p>
                      <p className="text-sm font-bold text-slate-800">{info.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* About This Land */}
            <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">About This Land</h2>
              <div className="space-y-4 text-slate-600 leading-relaxed text-sm">
                {land.description.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
              <h3 className="font-bold text-slate-900 mt-8 mb-4">Key Highlights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                {land.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: '#495d38' }} />
                    {h}
                  </div>
                ))}
              </div>
            </section>

            {/* Nearby Facilities */}
            <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Nearby Facilities</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Schools */}
                <div>
                  <div className="flex items-center gap-2 font-bold text-slate-900 mb-4">
                    <span style={{ color: '#345b79' }}>🎓</span> Schools
                  </div>
                  <ul className="space-y-2 text-xs">
                    {land.schools.map(school => (
                      <li key={school.name} className="flex justify-between text-slate-700">
                        <span>{school.name}</span>
                        <span className="text-slate-400">{school.dist}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Hospitals */}
                <div>
                  <div className="flex items-center gap-2 font-bold text-slate-900 mb-4">
                    <span style={{ color: '#be5d3f' }}>🏥</span> Hospitals
                  </div>
                  <ul className="space-y-2 text-xs">
                    {land.hospitals.map(hosp => (
                      <li key={hosp.name} className="flex justify-between text-slate-700">
                        <span>{hosp.name}</span>
                        <span className="text-slate-400">{hosp.dist}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Supermarkets */}
                <div>
                  <div className="flex items-center gap-2 font-bold text-slate-900 mb-4">
                    <span style={{ color: '#495d38' }}>🛒</span> Supermarkets
                  </div>
                  <ul className="space-y-2 text-xs">
                    {land.supermarkets.map(market => (
                      <li key={market.name} className="flex justify-between text-slate-700">
                        <span>{market.name}</span>
                        <span className="text-slate-400">{market.dist}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Location Map */}
            <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">Location Map</h2>
                <button className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                  🗺️ Open Full Map
                </button>
              </div>
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                <img alt="Location Map" className="w-full h-full object-cover opacity-60" src={land.mapImg} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 bg-red-500 rounded-full border-4 border-white shadow-xl flex items-center justify-center animate-bounce">
                    <span className="text-white">📍</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* ── SIDEBAR ── */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Action Buttons & Match Score */}
            <div className="space-y-3">
              <button
                id="save-land-btn"
                onClick={() => setSaved(!saved)}
                className="w-full py-4 border-2 font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
                style={saved
                  ? { backgroundColor: '#be5d3f', color: '#fff', borderColor: '#be5d3f' }
                  : { color: '#be5d3f', borderColor: '#be5d3f', backgroundColor: '#fff' }
                }
              >
                {saved ? '❤️ Saved Land' : '🤍 Save Land'}
              </button>
              
              <button
                id="share-land-btn"
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                className="w-full py-4 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
                style={{ backgroundColor: '#ccb7a3' }}
              >
                🔗 Share This Land
              </button>

              {/* AI Match score widget */}
              <div className="rounded-xl p-6 text-white" style={{ backgroundColor: '#345b79' }}>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path className="text-slate-600/50" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3"></path>
                      <path className="text-orange-500" style={{ stroke: '#be5d3f' }} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${land.matchScore}, 100`} strokeLinecap="round" strokeWidth="3"></path>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center font-bold text-sm">{land.matchScore}%</div>
                  </div>
                  <div>
                    <p className="font-bold text-lg">AI Match Score</p>
                    <p className="text-xs text-slate-300 font-medium">Based on your preferences</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Agent Info Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-bold uppercase mb-4 tracking-wider" style={{ color: '#928d64' }}>Listed by Agent</p>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-200">
                  <img alt={land.agent.name} className="w-full h-full object-cover" src={land.agent.img} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{land.agent.name}</h3>
                  <p className="text-xs font-semibold" style={{ color: '#be5d3f' }}>{land.agent.title}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-orange-400">★</span>
                    <span className="text-[10px] text-slate-400">{land.agent.rating} ({land.agent.reviews})</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <a href={`tel:${land.agent.phone}`} className="flex items-center gap-3 text-sm text-slate-600 hover:underline">
                  <span>📞</span> {land.agent.phone}
                </a>
                <a href={`mailto:${land.agent.email}`} className="flex items-center gap-3 text-sm text-slate-600 hover:underline">
                  <span>✉️</span> {land.agent.email}
                </a>
              </div>

              {showContact && (
                <form onSubmit={handleSendMessage} className="mb-4 p-3 rounded-xl border border-gray-200" style={{ backgroundColor: '#e6e0d4' }}>
                  <p className="text-[11px] mb-2 font-medium" style={{ color: '#1d1d1d' }}>Send a message to Saman:</p>
                  <textarea
                    rows={3}
                    className="w-full text-xs bg-white border border-gray-300 rounded p-2 outline-none resize-none text-slate-800"
                    placeholder="I'm interested in this land..."
                    value={contactMessage}
                    onChange={e => setContactMessage(e.target.value)}
                  />
                  <button type="submit" className="w-full mt-2 py-2 rounded-lg text-xs font-bold text-white hover:opacity-90" style={{ backgroundColor: '#be5d3f' }}>
                    Send Message
                  </button>
                </form>
              )}

              <button
                id="contact-agent-btn"
                onClick={() => setShowContact(!showContact)}
                className="w-full py-4 text-white font-bold rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
                style={{ backgroundColor: '#345b79' }}
              >
                Contact Agent
              </button>
            </div>

            {/* Quick Facts List */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-bold uppercase mb-4 tracking-wider" style={{ color: '#928d64' }}>Land Details</p>
              <div className="space-y-3">
                {[
                  { label: 'Land Type', val: land.type },
                  { label: 'Land Status', val: 'For Sale' },
                  { label: 'Province', val: land.province },
                  { label: 'District', val: land.location.split(',')[0].trim() },
                  { label: 'Perches', val: land.perches },
                  { label: 'Land ID', val: 'NXB-L-2025-0198' },
                ].map(fact => (
                  <div key={fact.label} className="flex justify-between text-xs py-2 border-b border-slate-100 last:border-0">
                    <span className="text-slate-500 font-medium">{fact.label}</span>
                    <span className="font-bold text-slate-800">{fact.val}</span>
                  </div>
                ))}
              </div>
            </div>

          </aside>
        </div>

        {/* ── Similar Land Parcels ── */}
        <section className="mt-16">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Similar Land Parcels</h2>
              <p className="text-sm text-slate-500">Lands near Colombo 5 matching your criteria</p>
            </div>
            <Link to="/land" className="text-sm font-bold flex items-center gap-1 hover:opacity-85" style={{ color: '#345b79' }}>
              View All Land Listings →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarLandsList.map(s => (
              <div
                key={s.id}
                onClick={() => navigate(`/land/detail/${s.id}`)}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group cursor-pointer"
              >
                <div className="relative h-48">
                  <img alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={s.img} />
                  <span className="absolute top-3 left-3 text-white text-[10px] font-bold px-2 py-1 rounded" style={{ backgroundColor: '#be5d3f' }}>Featured</span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 truncate">{s.name}</h3>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-3">
                    <span>📍</span> {s.location}
                  </div>
                  <div className="text-xl font-bold text-slate-900 mb-4">{s.price}</div>
                  <div className="flex justify-between text-[10px] text-slate-500 mb-4 font-semibold">
                    <span>{s.perches}</span>
                    <span>{s.sqft}</span>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex gap-2">
                    <button
                      id={`compare-btn-${s.id}`}
                      onClick={e => {
                        e.stopPropagation()
                      }}
                      className="w-full py-2 bg-slate-50 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      Compare
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  )
}
