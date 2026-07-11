import { useState } from 'react'
import { useNavigate, Link } from 'react-router'



// ─── Color Palette (for reference) ───────────────────────────────────────────
// Primary Brick Accent : #be5d3f
// Primary Blue         : #345b79
// Primary Background   : #e6e0d4
// Secondary Background : #ccb7a3
// Secondary Blue       : #6b879c
// Light Accent         : #d59b86
// Olive Accent         : #928d64
// Dark Text            : #1d1d1d
// Green Accent         : #495d38

// ─── Types ───────────────────────────────────────────────────────────────────
interface Property {
  id: number
  image: string
  badge: string
  badgeStyle: string
  price: string
  location: string
  title: string
  beds: number
  baths: number
  area: string
}

interface Partner {
  id: number
  image: string
  badge?: string
  name: string
  specialty: string
  rating: number
  projects: number
}

interface ConstructionPartner {
  id: number
  icon: React.ReactElement
  name: string
  type: string
  description: string
}

interface Testimonial {
  id: number
  rating: number
  text: string
  name: string
  role: string
  avatar: string
}

// ─── Icon helpers ─────────────────────────────────────────────────────────────
const IconHome = ({ cls = 'w-5 h-5' }: { cls?: string }) => (
  <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
)
const IconBuilding = ({ cls = 'w-5 h-5' }: { cls?: string }) => (
  <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" />
  </svg>
)
const IconTool = ({ cls = 'w-5 h-5' }: { cls?: string }) => (
  <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
  </svg>
)
const IconDesign = ({ cls = 'w-5 h-5' }: { cls?: string }) => (
  <svg className={cls} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
  </svg>
)

// ─── Data ────────────────────────────────────────────────────────────────────
const premiumProperties: Property[] = [
  {
    id: 1,
    image: '/property_card_1.png',
    badge: 'Featured',
    badgeStyle: 'bg-[#345b79]',
    price: 'LKR 45,000,000',
    location: 'Colombo 03',
    title: 'Luxury Sky Residences',
    beds: 3,
    baths: 2,
    area: '1,800 sq ft',
  },
  {
    id: 2,
    image: '/property_card_2.png',
    badge: 'New',
    badgeStyle: 'bg-[#495d38]',
    price: 'LKR 78,500,000',
    location: 'Mirissa, Southern',
    title: 'Beachfront Paradise Villa',
    beds: 4,
    baths: 3,
    area: '3,200 sq ft',
  },
  {
    id: 3,
    image: '/property_card_3.png',
    badge: 'Premium',
    badgeStyle: 'bg-[#be5d3f]',
    price: 'LKR 120,000,000',
    location: 'Galle, Southern',
    title: 'Infinity Pool Clifftop Villa',
    beds: 5,
    baths: 4,
    area: '4,500 sq ft',
  },
  {
    id: 4,
    image: '/property_card_4.png',
    badge: 'Heritage',
    badgeStyle: 'bg-[#928d64]',
    price: 'LKR 55,000,000',
    location: 'Kandy, Central',
    title: 'Colonial Heritage Bungalow',
    beds: 4,
    baths: 3,
    area: '2,800 sq ft',
  },
]

const architecturePartners: Partner[] = [
  {
    id: 1,
    image: '/property_card_4.png',
    badge: 'Top Rated',
    name: 'Geoffrey Bawa Studio',
    specialty: 'Tropical Modern Design',
    rating: 4.9,
    projects: 120,
  },
  {
    id: 2,
    image: '/property_card_1.png',
    name: 'Ney & Partners',
    specialty: 'High-Rise Architecture',
    rating: 4.8,
    projects: 85,
  },
  {
    id: 3,
    image: '/property_card_3.png',
    badge: 'Certified',
    name: 'Colombo Architects',
    specialty: 'Contemporary Residential',
    rating: 4.7,
    projects: 200,
  },
  {
    id: 4,
    image: '/property_card_2.png',
    name: 'DCAL Design',
    specialty: 'Eco-Sustainable Builds',
    rating: 4.9,
    projects: 65,
  },
]

const constructionPartners: ConstructionPartner[] = [
  {
    id: 1,
    icon: <IconBuilding cls="w-6 h-6" />,
    name: 'BuildRight Lanka',
    type: 'General Contractor',
    description: 'End-to-end construction with 20+ years of experience',
  },
  {
    id: 2,
    icon: <IconTool cls="w-6 h-6" />,
    name: 'ElectroPro SL',
    type: 'Electrical Services',
    description: 'Licensed electrical installations for residential & commercial',
  },
  {
    id: 3,
    icon: <IconHome cls="w-6 h-6" />,
    name: 'Trusted Builders Co.',
    type: 'Construction & Renovation',
    description: 'Quality renovation and new-build specialists island-wide',
  },
  {
    id: 4,
    icon: <IconDesign cls="w-6 h-6" />,
    name: 'Lanka Interiors',
    type: 'Interior Design',
    description: 'Premium interior solutions, furniture & fit-outs',
  },
]

const testimonials: Testimonial[] = [
  {
    id: 1,
    rating: 5,
    text: 'NexaBuild helped me find the perfect property in Colombo 3. The AI matching system was incredibly accurate — it suggested exactly what I was looking for within minutes. Exceptional service!',
    name: 'Nimal Perera',
    role: 'Property Investor, Colombo',
    avatar: 'NP',
  },
  {
    id: 2,
    rating: 5,
    text: 'The platform gave me access to pre-vetted builders and architects in one place. The whole process from search to purchase was seamless. I found my dream beach villa in just two weeks!',
    name: 'Dilani Jayawardena',
    role: 'Homeowner, Galle',
    avatar: 'DJ',
  },
  {
    id: 3,
    rating: 5,
    text: "As a first-time buyer, I was nervous about the process. NexaBuild's team and AI tools guided me every step of the way. I saved over LKR 3 million through their negotiation support.",
    name: 'Kasun Fernando',
    role: 'First-time Buyer, Kandy',
    avatar: 'KF',
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────
function SparklesIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  )
}
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-amber-400' : 'text-[#ccb7a3]'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function PropertyCard({ property }: { property: Property }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={property.image}
          alt={property.title}
          className={`w-full h-full object-cover transition-transform duration-500 ${hovered ? 'scale-110' : 'scale-100'}`}
        />
        <span className={`absolute top-3 left-3 ${property.badgeStyle} text-white text-xs font-semibold px-3 py-1 rounded-full tracking-wide`}>
          {property.badge}
        </span>
        <button className="absolute top-3 right-3 w-8 h-8 bg-white/85 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow">
          <svg className="w-4 h-4 text-[#345b79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      <div className="p-4">
        <p className="text-[#be5d3f] font-bold text-sm mb-1">{property.price}</p>
        <div className="flex items-center gap-1 text-[#928d64] text-xs mb-2">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {property.location}
        </div>
        <h3 className="font-semibold text-[#1d1d1d] text-sm mb-3 leading-tight">{property.title}</h3>
        <div className="flex items-center gap-3 text-[#6b879c] text-xs border-t border-[#e6e0d4] pt-3">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {property.beds} Beds
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            {property.baths} Baths
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            {property.area}
          </span>
        </div>
      </div>
    </div>
  )
}

function ArchitecturePartnerCard({ partner }: { partner: Partner }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer">
      <div className="relative h-40 overflow-hidden">
        <img
          src={partner.image}
          alt={partner.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        {partner.badge && (
          <span className="absolute top-3 left-3 bg-[#be5d3f] text-white text-xs font-semibold px-3 py-1 rounded-full">
            {partner.badge}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-[#1d1d1d] text-sm mb-1">{partner.name}</h3>
        <p className="text-[#6b879c] text-xs mb-3">{partner.specialty}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <StarRating rating={Math.floor(partner.rating)} />
            <span className="text-xs text-[#928d64] ml-1">{partner.rating}</span>
          </div>
          <span className="text-xs text-[#ccb7a3] font-medium">{partner.projects}+ Projects</span>
        </div>
      </div>
    </div>
  )
}

function ConstructionPartnerCard({ partner }: { partner: ConstructionPartner }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer border border-[#e6e0d4]">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-white" style={{ background: '#345b79' }}>
        {partner.icon}
      </div>
      <h3 className="font-semibold text-[#1d1d1d] text-sm mb-1">{partner.name}</h3>
      <p className="text-[#be5d3f] text-xs font-semibold mb-2 uppercase tracking-wide">{partner.type}</p>
      <p className="text-[#928d64] text-xs leading-relaxed mb-5">{partner.description}</p>
      <button className="text-xs text-[#345b79] font-semibold flex items-center gap-1.5 group hover:gap-2.5 transition-all">
        View Profile
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}

// ─── Section Label ─────────────────────────────────────────────────────────────
function SectionLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="w-6 h-0.5 bg-[#be5d3f] rounded-full inline-block" />
      <p className="text-[#be5d3f] text-xs font-bold uppercase tracking-widest">{text}</p>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
function Home() {
  const [propertyType, setPropertyType] = useState('')
  const [location, setLocation]         = useState('')
  const [budget, setBudget]             = useState('')  // preset key e.g. '0-30'
  const navigate = useNavigate()



  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', 'Outfit', sans-serif" }}>

    

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center pt-[60px]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/hero_property.png"
            alt="Find Your Dream Property in Sri Lanka"
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay using primary blue */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, rgba(52,91,121,0.90) 0%, rgba(52,91,121,0.70) 45%, rgba(52,91,121,0.20) 100%)',
            }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
          <div className="flex flex-col items-center text-center">

            {/* AI Badge */}
            <div className="mb-5">
              <span
                className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest px-4 py-1.5 rounded-full border uppercase"
                style={{ color: '#d59b86', borderColor: 'rgba(213,155,134,0.4)', backgroundColor: 'rgba(213,155,134,0.12)' }}
              >
                <SparklesIcon />
                AI-Powered Intelligence
              </span>
            </div>

            {/* Heading + subtitle + search bar — auto-width wrapper matching h1 */}
            <div className="flex flex-col items-center w-full max-w-3xl">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] mb-5 tracking-tight text-center">
                Find Your Dream Property{' '}
                <span style={{ color: '#d59b86' }}>in Sri Lanka</span>
              </h1>
              <p className="text-sm sm:text-base mb-8 leading-relaxed text-center px-2" style={{ color: 'rgba(230,224,212,0.85)' }}>
                Connect with top architects, construction companies and premium{' '}
                all-in-one intelligent platform
              </p>

            {/* Search Box — stacks vertically on mobile, horizontal pill on sm+ */}
            <div
              className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white shadow-2xl overflow-hidden w-full"
              style={{ borderRadius: '12px' }}
            >
              {/* Property Type dropdown */}
              <div className="flex items-center gap-2 px-5 py-4 sm:py-5 sm:flex-shrink-0 border-b sm:border-b-0" style={{ borderColor: '#e6e0d4' }}>
                <svg className="w-4 h-4 flex-shrink-0" style={{ color: '#ccb7a3' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <select
                  id="search-property-type"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="flex-1 sm:w-44 text-sm font-medium bg-transparent outline-none cursor-pointer appearance-none pr-4"
                  style={{ color: propertyType ? '#1d1d1d' : '#928d64' }}
                >
                  <option value="">Property Type</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="commercial">Commercial</option>
                  <option value="land">Land</option>
                </select>
                <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#ccb7a3' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Divider — vertical on sm+, horizontal on mobile (already handled by border-b above) */}
              <div className="hidden sm:block w-px self-stretch my-2" style={{ backgroundColor: '#e6e0d4' }} />

              {/* Location input */}
              <div className="flex items-center gap-2 px-5 py-4 sm:py-5 flex-1 min-w-0 border-b sm:border-b-0" style={{ borderColor: '#e6e0d4' }}>
                <svg className="w-4 h-4 flex-shrink-0" style={{ color: '#ccb7a3' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  id="search-location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="w-full text-sm bg-transparent outline-none"
                  style={{ color: '#1d1d1d' }}
                />
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px self-stretch my-2" style={{ backgroundColor: '#e6e0d4' }} />

              {/* Budget dropdown */}
              <div className="flex items-center gap-2 px-5 py-4 sm:py-5 sm:flex-shrink-0 border-b sm:border-b-0" style={{ borderColor: '#e6e0d4' }}>
                <svg className="w-4 h-4 flex-shrink-0" style={{ color: '#ccb7a3' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <select
                  id="search-budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="flex-1 sm:w-40 text-sm font-medium bg-transparent outline-none cursor-pointer appearance-none pr-4"
                  style={{ color: budget ? '#1d1d1d' : '#928d64' }}
                >
                  <option value="">Budget Range</option>
                  <option value="0-30">Under LKR 30M</option>
                  <option value="30-60">LKR 30M – 60M</option>
                  <option value="60-100">LKR 60M – 100M</option>
                  <option value="100-200">LKR 100M – 200M</option>
                  <option value="200-500">Above LKR 200M</option>
                </select>
                <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#ccb7a3' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <button
                id="search-btn"
                onClick={() => {
                  const params = new URLSearchParams()
                  if (location.trim()) params.set('query', location.trim())
                  if (propertyType)    params.set('type',  propertyType)
                  if (budget) {
                    const [min, max] = budget.split('-')
                    params.set('minBudget', min)
                    params.set('maxBudget', max)
                  }
                  const qs = params.toString()
                  navigate(`/property-listing${qs ? `?${qs}` : ''}`)
                }}
                className="flex items-center justify-center gap-2 text-white font-bold px-8 py-4 sm:py-5 transition-all duration-200 hover:opacity-90 whitespace-nowrap active:scale-95"
                style={{ backgroundColor: '#be5d3f' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </button>
            </div>
            </div>{/* end flex col */}
          </div>{/* end flex-col items-center */}
        </div>
      </section>

      {/* ── Premium Properties ── */}
      <section className="py-20" style={{ backgroundColor: '#e6e0d4' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <SectionLabel text="Premium Listings" />
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: '#1d1d1d' }}>
                Premium Properties In Sri Lanka
              </h2>
            </div>
            <Link
              to="/property-listing"
              className="flex items-center gap-1 text-sm font-semibold transition-all hover:gap-2 self-start sm:self-auto"
              style={{ color: '#345b79' }}
            >
              View All Properties
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {premiumProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>


        </div>
      </section>

      {/* ── Architecture Partners ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <SectionLabel text="Architecture & Design" />
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: '#1d1d1d' }}>
                Trusted Architecture Partners
              </h2>
            </div>
            <a href="#" className="flex items-center gap-1 text-sm font-semibold hover:gap-2 transition-all self-start sm:self-auto" style={{ color: '#345b79' }}>
              View All Architecture Companies
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {architecturePartners.map((partner) => (
              <ArchitecturePartnerCard key={partner.id} partner={partner} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Construction Partners ── */}
      <section className="py-20" style={{ backgroundColor: '#ccb7a3' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <SectionLabel text="Build & Renovate" />
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: '#1d1d1d' }}>
                Top Construction Partners
              </h2>
            </div>
            <a href="#" className="flex items-center gap-1 text-sm font-semibold hover:gap-2 transition-all self-start sm:self-auto" style={{ color: '#345b79' }}>
              View All Construction Companies
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {constructionPartners.map((partner) => (
              <ConstructionPartnerCard key={partner.id} partner={partner} />
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Property Match CTA ── */}
      <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#345b79' }}>
        {/* Decorative blobs */}
        <div
          className="absolute top-0 right-0 w-[480px] h-[480px] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"
          style={{ backgroundColor: 'rgba(190,93,63,0.18)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-72 h-72 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none"
          style={{ backgroundColor: 'rgba(146,141,100,0.15)' }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">

            {/* Left Text */}
            <div>
              <SectionLabel text="AI-Powered Search" />
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-5 leading-tight tracking-tight">
                Let AI Find Your Perfect{' '}
                <span style={{ color: '#d59b86' }}>Property Match</span>
              </h2>
              <p className="text-base leading-relaxed mb-8 max-w-lg" style={{ color: 'rgba(230,224,212,0.80)' }}>
                Our advanced AI analyzes your lifestyle preferences, budget, and requirements to suggest
                properties that truly match your dream. Smarter search, better results — saving you
                hundreds of hours of browsing.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  id="ai-match-btn"
                  onClick={() => navigate('/property-listing')}
                  className="font-bold text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 shadow-lg"
                  style={{ backgroundColor: '#be5d3f' }}
                >
                  Find My Match Now
                </button>
                <button
                  className="font-semibold px-6 py-3 sm:px-8 sm:py-4 rounded-xl border transition-all duration-200 hover:bg-white/10"
                  style={{ color: '#e6e0d4', borderColor: 'rgba(230,224,212,0.35)' }}
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Right Stat Cards */}
            <div className="grid grid-cols-1 gap-4 w-full lg:max-w-sm lg:ml-auto">
              {/* Accuracy ring card */}
              <div
                className="rounded-2xl p-6 flex items-center gap-5 backdrop-blur-sm"
                style={{ backgroundColor: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.18)' }}
              >
                <div className="relative w-16 h-16 flex-shrink-0">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="6" />
                    <circle
                      cx="32" cy="32" r="28" fill="none"
                      stroke="#be5d3f" strokeWidth="6"
                      strokeDasharray="175.9" strokeDashoffset="26.4"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">85%</span>
                </div>
                <div>
                  <p className="text-white font-bold text-base">85% Match Rate</p>
                  <p className="text-sm mt-0.5" style={{ color: '#d59b86' }}>AI accuracy score</p>
                </div>
              </div>

              {/* Listings card */}
              <div
                className="rounded-2xl p-6 flex items-center gap-5 backdrop-blur-sm"
                style={{ backgroundColor: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.18)' }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#be5d3f' }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold text-base">1,264+ Listings</p>
                  <p className="text-sm mt-0.5" style={{ color: '#d59b86' }}>Active properties island-wide</p>
                </div>
              </div>

              {/* Happy clients card */}
              <div
                className="rounded-2xl p-6 flex items-center gap-5 backdrop-blur-sm"
                style={{ backgroundColor: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.18)' }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#495d38' }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold text-base">10,200+ Happy Clients</p>
                  <p className="text-sm mt-0.5" style={{ color: '#d59b86' }}>Successful property matches</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <SectionLabel text="Client Stories" />
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: '#1d1d1d' }}>
              What Our Clients Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="rounded-2xl p-8 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                style={{ backgroundColor: '#e6e0d4', border: '1px solid #ccb7a3' }}
              >
                <div
                  className="text-7xl font-serif leading-none absolute top-3 right-5 select-none pointer-events-none"
                  style={{ color: 'rgba(190,93,63,0.15)' }}
                >
                  "
                </div>
                <div className="mb-4">
                  <StarRating rating={testimonial.rating} />
                </div>
                <p className="text-sm leading-relaxed mb-6 relative z-10" style={{ color: '#1d1d1d' }}>
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3 pt-5" style={{ borderTop: '1px solid #ccb7a3' }}>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #be5d3f, #345b79)' }}
                  >
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#1d1d1d' }}>{testimonial.name}</p>
                    <p className="text-xs" style={{ color: '#928d64' }}>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats / Numbers ── */}
      <section className="py-20" style={{ backgroundColor: '#ccb7a3' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <SectionLabel text="Our Impact" />
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: '#1d1d1d' }}>
              NexaBuild by the Numbers
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: '12,400+', label: 'Properties Listed', desc: 'Verified listings island-wide', color: '#345b79' },
              { value: '860+', label: 'Architecture Partners', desc: 'Certified design professionals', color: '#be5d3f' },
              { value: '340+', label: 'Construction Firms', desc: 'Trusted build partners', color: '#928d64' },
              { value: '35,000+', label: 'Happy Clients', desc: 'Satisfied property seekers', color: '#495d38' },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 sm:p-8 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5" style={{ border: '1px solid rgba(204,183,163,0.4)' }}>
                <p className="text-2xl sm:text-4xl font-extrabold mb-2 tracking-tight" style={{ color: stat.color }}>{stat.value}</p>
                <p className="font-semibold text-sm mb-1" style={{ color: '#1d1d1d' }}>{stat.label}</p>
                <p className="text-xs" style={{ color: '#928d64' }}>{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


    </div>
  )
}

export default Home