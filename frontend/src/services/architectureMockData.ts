// src/services/architectureMockData.ts
// ─────────────────────────────────────────────────────────────────────────────
// Realistic mock data for the Nexabuild Architecture Module.
// All firms / designs are based on Sri Lankan context.
// ─────────────────────────────────────────────────────────────────────────────

export interface ArchitectFirm {
  id: string;
  name: string;
  avatar: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  location: string;
  city: string;
  country: string;
  experience: number;
  projectCount: number;
  description: string;
  specializations: string[];
  budgetRange: string;
  email: string;
}

export interface HouseDesign {
  id: string;
  title: string;
  style: string;
  price: number;
  architectName: string;
  architectFirm: string;
  imageUrl: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  location: string;
  saved: boolean;
  tags: string[];
}

export interface DesignDetail {
  id: string;
  title: string;
  breadcrumb: string[];
  architectName: string;
  architectFirm: string;
  location: string;
  year: number;
  status: string;
  heroImage: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  garage: number;
  overview: string;
  gallery: string[];
  threeDVisualization: string;
  floorPlans: { label: string; image: string }[];
  features: { icon: string; label: string }[];
  constructionProgress: { phase: string; detail: string; status: 'done' | 'active' | 'pending' }[];
  review: {
    author: string;
    avatar: string;
    rating: number;
    text: string;
    date: string;
  };
  relatedProjects: { id: string; title: string; image: string; style: string; price: number }[];
}

// ─── Architect Firms ──────────────────────────────────────────────────────────

export const architectFirms: ArchitectFirm[] = [
  {
    id: 'silva-associates',
    name: 'Silva & Associates Architecture',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=360&fit=crop',
    rating: 4.9,
    reviewCount: 47,
    location: 'Colombo 03',
    city: 'Colombo',
    country: 'Sri Lanka',
    experience: 18,
    projectCount: 143,
    description: 'Award-winning studio specialising in contemporary tropical residential and luxury commercial design throughout Sri Lanka.',
    specializations: ['Modern', 'Minimalist'],
    budgetRange: 'LKR 5M – LKR 50M',
    email: 'info@silvaassociates.lk',
  },
  {
    id: 'greenline-design',
    name: 'Greenline Design Studio',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&h=360&fit=crop',
    rating: 4.7,
    reviewCount: 89,
    location: 'Kandy',
    city: 'Kandy',
    country: 'Sri Lanka',
    experience: 11,
    projectCount: 89,
    description: "Sustainable architecture firm renowned for eco-friendly, biophilic designs that harmonise with Sri Lanka's lush highland landscape.",
    specializations: ['Eco-Friendly', 'Residential'],
    budgetRange: 'LKR 3M – LKR 30M',
    email: 'studio@greenline.lk',
  },
  {
    id: 'lotus-architecture',
    name: 'Lotus Architecture Group',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=360&fit=crop',
    rating: 4.8,
    reviewCount: 217,
    location: 'Galle',
    city: 'Galle',
    country: 'Sri Lanka',
    experience: 24,
    projectCount: 217,
    description: 'Established firm with a legacy of iconic commercial and residential architecture across the Southern Province and greater Colombo.',
    specializations: ['Commercial', 'Luxury'],
    budgetRange: 'LKR 10M – LKR 1B',
    email: 'contact@lotusarchgroup.lk',
  },
  {
    id: 'pinnacle-design',
    name: 'Pinnacle Design Co.',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=360&fit=crop',
    rating: 4.6,
    reviewCount: 61,
    location: 'Negombo',
    city: 'Negombo',
    country: 'Sri Lanka',
    experience: 9,
    projectCount: 61,
    description: "Boutique firm specialising in luxury beachfront villas and high-end interior design for Sri Lanka's western coastal belt.",
    specializations: ['Luxury', 'Interior Design'],
    budgetRange: 'LKR 8M – LKR 80M',
    email: 'hello@pinnacledesign.lk',
  },
  {
    id: 'skyline-architects',
    name: 'Skyline Architects Pvt Ltd',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=360&fit=crop',
    rating: 4.5,
    reviewCount: 38,
    location: 'Jaffna',
    city: 'Jaffna',
    country: 'Sri Lanka',
    experience: 7,
    projectCount: 38,
    description: 'Modern practice bringing contemporary design solutions to the Northern Province, blending local vernacular with global aesthetics.',
    specializations: ['Residential', 'Sustainable Design'],
    budgetRange: 'LKR 2M – LKR 20M',
    email: 'info@skylinearchitects.lk',
  },
  {
    id: 'heritage-design',
    name: 'Heritage Design Associates',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1490274456255-cb7c8e66e7be?w=600&h=360&fit=crop',
    rating: 4.9,
    reviewCount: 104,
    location: 'Colombo 07',
    city: 'Colombo',
    country: 'Sri Lanka',
    experience: 22,
    projectCount: 104,
    description: "Masters of colonial revival and heritage restoration, trusted by Sri Lanka's foremost hospitality brands and private estates.",
    specializations: ['Colonial', 'Hospitality'],
    budgetRange: 'LKR 5M – LKR 200M',
    email: 'projects@heritagedesign.lk',
  },
];

// ─── House Designs ────────────────────────────────────────────────────────────

export const houseDesigns: HouseDesign[] = [
  {
    id: 'villa-lumina',
    title: 'Villa Lumina',
    style: 'Modern',
    price: 2400000,
    architectName: 'Arjun Silva',
    architectFirm: 'Silva & Associates Architecture',
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop',
    bedrooms: 5,
    bathrooms: 4,
    sqft: 4200,
    location: 'Colombo 05',
    saved: false,
    tags: ['Modern', 'Luxury'],
  },
  {
    id: 'green-haven',
    title: 'Green Haven Residence',
    style: 'Sustainable',
    price: 1200000,
    architectName: 'Priya Mendis',
    architectFirm: 'Greenline Design Studio',
    imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&h=400&fit=crop',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 3100,
    location: 'Kandy',
    saved: true,
    tags: ['Sustainable', 'Eco-Friendly'],
  },
  {
    id: 'ocean-breeze',
    title: 'Ocean Breeze Villa',
    style: 'Luxury',
    price: 3800000,
    architectName: 'Kasun Rajapaksa',
    architectFirm: 'Pinnacle Design Co.',
    imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop',
    bedrooms: 6,
    bathrooms: 5,
    sqft: 5800,
    location: 'Negombo',
    saved: false,
    tags: ['Luxury', 'Beachfront'],
  },
  {
    id: 'highland-retreat',
    title: 'Highland Retreat',
    style: 'Minimalist',
    price: 950000,
    architectName: 'Nisha Fernando',
    architectFirm: 'Greenline Design Studio',
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 2200,
    location: 'Nuwara Eliya',
    saved: false,
    tags: ['Minimalist', 'Hillside'],
  },
  {
    id: 'pearl-residence',
    title: 'The Pearl Residence',
    style: 'Colonial',
    price: 1750000,
    architectName: 'Dilshan Perera',
    architectFirm: 'Heritage Design Associates',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop',
    bedrooms: 5,
    bathrooms: 4,
    sqft: 4600,
    location: 'Colombo 07',
    saved: true,
    tags: ['Colonial', 'Heritage'],
  },
  {
    id: 'lotus-tower-penthouse',
    title: 'Lotus Tower Penthouse',
    style: 'Modern',
    price: 5200000,
    architectName: 'Rohan Gunasekara',
    architectFirm: 'Lotus Architecture Group',
    imageUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=400&fit=crop',
    bedrooms: 4,
    bathrooms: 4,
    sqft: 3900,
    location: 'Colombo 01',
    saved: false,
    tags: ['Modern', 'High-Rise'],
  },
  {
    id: 'galle-coast-house',
    title: 'Galle Coast House',
    style: 'Sustainable',
    price: 1450000,
    architectName: 'Amaya Wickramasinghe',
    architectFirm: 'Skyline Architects Pvt Ltd',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 3400,
    location: 'Galle',
    saved: false,
    tags: ['Sustainable', 'Coastal'],
  },
  {
    id: 'ayura-sanctuary',
    title: 'Ayura Sanctuary',
    style: 'Minimalist',
    price: 820000,
    architectName: 'Thilini Jayawardena',
    architectFirm: 'Heritage Design Associates',
    imageUrl: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=600&h=400&fit=crop',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1900,
    location: 'Bentota',
    saved: false,
    tags: ['Minimalist', 'Wellness'],
  },
  {
    id: 'mahaweli-manor',
    title: 'Mahaweli Manor',
    style: 'Luxury',
    price: 2900000,
    architectName: 'Ravi Wijeratne',
    architectFirm: 'Lotus Architecture Group',
    imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&h=400&fit=crop',
    bedrooms: 6,
    bathrooms: 5,
    sqft: 6200,
    location: 'Kandy',
    saved: false,
    tags: ['Luxury', 'Riverside'],
  },
];

// ─── Design Detail — Villa Lumina ─────────────────────────────────────────────

export const designDetail: DesignDetail = {
  id: 'villa-lumina',
  title: 'Villa Lumina',
  breadcrumb: ['Home', 'Architecture Designs', 'Villa Lumina'],
  architectName: 'Arjun Silva',
  architectFirm: 'Silva & Associates Architecture',
  location: 'Colombo 05, Sri Lanka',
  year: 2024,
  status: 'Completed',
  heroImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1400&h=600&fit=crop',
  price: 2400000,
  bedrooms: 5,
  bathrooms: 4,
  sqft: 4200,
  garage: 2,
  overview: `Villa Lumina is a landmark contemporary residence nestled in the heart of Colombo 05, conceived as a luminous retreat that bridges indoor and outdoor living. 
  
  Designed by award-winning architect Arjun Silva, the project draws inspiration from Sri Lanka's tropical light, using expansive glazing, natural stone, and lush courtyard gardens to create a home that breathes with its environment. 
  
  The 4,200 sq ft layout encompasses five en-suite bedrooms, a chef's kitchen with Calacatta marble finishes, a sky-deck pool, and a home theatre — all orchestrated around a double-height living pavilion flooded with natural light.`,
  gallery: [
    'https://images.unsplash.com/photo-1560185127-6a7a1b5e7e1f?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=400&h=300&fit=crop',
  ],
  threeDVisualization: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=500&fit=crop',
  floorPlans: [
    { label: 'Ground Floor Plan', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop' },
    { label: 'Upper Floor Plan', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&sat=-100' },
  ],
  features: [
    { icon: '🌿', label: 'Tropical Garden' },
    { icon: '🏊', label: 'Sky-Deck Pool' },
    { icon: '⚡', label: 'Solar Panels' },
    { icon: '🎬', label: 'Home Theatre' },
    { icon: '🚗', label: '2-Car Garage' },
    { icon: '🔒', label: 'Smart Security' },
    { icon: '💧', label: 'Rainwater Harvest' },
    { icon: '🌬️', label: 'Natural Ventilation' },
  ],
  constructionProgress: [
    { phase: 'Design & Planning', detail: 'Architectural drawings, structural engineering, MEP design completed. Council permits approved.', status: 'done' },
    { phase: 'Foundation & Structure', detail: 'Reinforced concrete raft foundation and post-tensioned slabs completed across all three levels.', status: 'done' },
    { phase: 'Shell & Core', detail: 'Masonry walls, roof structure, and external glazing installation — 100% complete.', status: 'done' },
    { phase: 'Off-Site Interiors', detail: 'Custom joinery, marble slabs, and imported fittings fabricated and delivered on site.', status: 'active' },
  ],
  review: {
    author: 'Chaminda Senanayake',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=80&h=80&fit=crop&crop=face',
    rating: 5,
    text: 'Working with Arjun Silva and the team was an absolute pleasure from start to finish. They translated our vision into a home that surpasses every expectation — from the breathtaking double-height living space to the finest material selections. Villa Lumina is not just a house, it is an experience.',
    date: 'March 2025',
  },
  relatedProjects: [
    { id: 'pearl-residence', title: 'The Pearl Residence', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=260&fit=crop', style: 'Colonial', price: 1750000 },
    { id: 'ocean-breeze', title: 'Ocean Breeze Villa', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=260&fit=crop', style: 'Luxury', price: 3800000 },
    { id: 'lotus-tower-penthouse', title: 'Lotus Tower Penthouse', image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=260&fit=crop', style: 'Modern', price: 5200000 },
  ],
};
