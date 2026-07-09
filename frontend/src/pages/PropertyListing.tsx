import { useState } from 'react'
import { Link } from 'react-router'

// ─── Color Palette ─────────────────────────────────────────────────────────────
// Primary Brick Accent  : #be5d3f
// Primary Blue          : #345b79
// Primary Background    : #e6e0d4
// Secondary Background  : #ccb7a3
// Secondary Blue        : #6b879c
// Light Accent          : #d59b86
// Olive Accent          : #928d64
// Dark Text             : #1d1d1d
// Green Accent          : #495d38

// ─── Types ────────────────────────────────────────────────────────────────────
interface ListingProperty {
  id: number
  image: string
  badge: string
  badgeColor: string
  status: 'FOR SALE' | 'FOR RENT' | 'PREMIUM'
  statusColor: string
  price: string
  title: string
  location: string
  beds: number
  baths: number
  area: string
  areaUnit: string
  isFavorite?: boolean
}

// ─── Sample Property Data ────────────────────────────────────────────────────
const allProperties: ListingProperty[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
    badge: 'FOR SALE',
    badgeColor: '#be5d3f',
    status: 'FOR SALE',
    statusColor: '#be5d3f',
    price: 'LKR 85,000,000',
    title: 'Luxury Villa, Colombo 7',
    location: 'Colombo, Western Province',
    beds: 4,
    baths: 3,
    area: '4,900',
    areaUnit: 'sq ft',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
    badge: 'FOR SALE',
    badgeColor: '#be5d3f',
    status: 'FOR SALE',
    statusColor: '#be5d3f',
    price: 'LKR 32,500,000',
    title: 'Modern Apartment, Kandy',
    location: 'Kandy, Central Province',
    beds: 3,
    baths: 2,
    area: '1,800',
    areaUnit: 'sq ft',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80',
    badge: 'PREMIUM',
    badgeColor: '#495d38',
    status: 'PREMIUM',
    statusColor: '#495d38',
    price: 'LKR 125,000,000',
    title: 'Beachfront Residence, Galle',
    location: 'Galle, Southern Province',
    beds: 5,
    baths: 4,
    area: '6,400',
    areaUnit: 'sq ft',
    isFavorite: true,
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    badge: 'FOR SALE',
    badgeColor: '#be5d3f',
    status: 'FOR SALE',
    statusColor: '#be5d3f',
    price: 'LKR 55,000,000',
    title: 'Premium Townhouse, Negombo',
    location: 'Negombo, Western Province',
    beds: 3,
    baths: 2,
    area: '2,800',
    areaUnit: 'sq ft',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
    badge: 'FOR SALE',
    badgeColor: '#be5d3f',
    status: 'FOR SALE',
    statusColor: '#be5d3f',
    price: 'LKR 48,000,000',
    title: 'Garden Bungalow, Nugegoda',
    location: 'Nugegoda, Western Province',
    beds: 4,
    baths: 3,
    area: '3,200',
    areaUnit: 'sq ft',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&q=80',
    badge: 'FOR SALE',
    badgeColor: '#be5d3f',
    status: 'FOR SALE',
    statusColor: '#be5d3f',
    price: 'LKR 220,000,000',
    title: 'Penthouse, Colombo 3',
    location: 'Colombo 3, Western Province',
    beds: 5,
    baths: 4,
    area: '4,200',
    areaUnit: 'sq ft',
  },
]

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)
const MapPinIcon = ({ cls = 'w-4 h-4' }: { cls?: string }) => (
  <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)
const BedIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12V7a1 1 0 011-1h1m0 0V4a1 1 0 011-1h10a1 1 0 011 1v2m0 0h1a1 1 0 011 1v5M3 12v5m18-5v5M3 12h18M3 17h18" />
  </svg>
)
const BathIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 17v1a3 3 0 006 0v-1H3zm0 0h18M21 17V9a2 2 0 00-2-2h-1V5a2 2 0 00-2-2H8a2 2 0 00-2 2v2H5a2 2 0 00-2 2v8" />
  </svg>
)
const AreaIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
  </svg>
)
const HeartIcon = ({ filled }: { filled?: boolean }) => (
  <svg className="w-4 h-4" fill={filled ? '#be5d3f' : 'none'} stroke={filled ? '#be5d3f' : 'currentColor'} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
)
const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)
const SparklesIcon = () => (
  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
  </svg>
)
const FilterIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
)
const MapIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
)
const XIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

// ─── Property Card ────────────────────────────────────────────────────────────
function PropertyCard({ property }: { property: ListingProperty }) {
  const [fav, setFav] = useState(property.isFavorite ?? false)

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer group">
      {/* Image */}
      <div className="relative overflow-hidden h-44">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Status badge top-left */}
        <span
          className="absolute top-2.5 left-2.5 text-white text-[10px] font-bold px-2.5 py-1 rounded tracking-widest uppercase"
          style={{ backgroundColor: property.statusColor }}
        >
          {property.status}
        </span>
        {/* Favorite button top-right */}
        <button
          onClick={(e) => { e.stopPropagation(); setFav(!fav) }}
          className="absolute top-2.5 right-2.5 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
        >
          <HeartIcon filled={fav} />
        </button>
      </div>

      {/* Content */}
      <div className="p-3.5">
        <p className="text-[#be5d3f] font-bold text-sm mb-0.5">{property.price}</p>
        <h3 className="font-semibold text-[#1d1d1d] text-sm leading-tight mb-1.5">{property.title}</h3>
        <div className="flex items-center gap-1 text-[#928d64] text-xs mb-3">
          <MapPinIcon cls="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{property.location}</span>
        </div>
        {/* Stats */}
        <div
          className="flex items-center gap-3 pt-2.5 text-xs text-[#6b879c]"
          style={{ borderTop: '1px solid #e6e0d4' }}
        >
          <span className="flex items-center gap-1">
            <BedIcon />
            {property.beds} Beds
          </span>
          <span className="flex items-center gap-1">
            <BathIcon />
            {property.baths} Baths
          </span>
          <span className="flex items-center gap-1 ml-auto">
            <AreaIcon />
            {property.area} {property.areaUnit}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function Pagination({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void }) {
  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      {Array.from({ length: total }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onChange(page)}
          className="w-8 h-8 rounded-lg text-sm font-semibold transition-all duration-150"
          style={
            page === current
              ? { backgroundColor: '#345b79', color: '#fff' }
              : { backgroundColor: '#e6e0d4', color: '#928d64' }
          }
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onChange(Math.min(total, current + 1))}
        className="w-8 h-8 rounded-lg text-sm font-semibold flex items-center justify-center transition-all duration-150 hover:bg-[#e6e0d4]"
        style={{ color: '#928d64' }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PropertyListing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [propertyType, setPropertyType] = useState('All Types')
  const [selectedBeds, setSelectedBeds] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('Most Relevant')
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>(['Colombo'])
  const [searchQuery, setSearchQuery] = useState('')
  const [minBudget, setMinBudget] = useState('')
  const [maxBudget, setMaxBudget] = useState('')
  const [selectedBudgetRange, setSelectedBudgetRange] = useState<[number, number]>([0, 500])
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Property Search', href: '/property-listing', active: true },
    { label: 'Land Search', href: '#' },
    { label: 'Architecture Companies', href: '#' },
    { label: 'Construction Companies', href: '#' },
  ]

  const districts = ['Colombo', 'Kandy', 'Galle', 'Negombo']

  const toggleDistrict = (d: string) => {
    setSelectedDistricts((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    )
  }

  const propertyTypes = ['All Types', 'House', 'Apartment', 'Villa']

  const bedOptions = ['All', '1', '2', '3', '4', '5+']

  return (
    <div className="min-h-screen bg-[#e6e0d4]" style={{ fontFamily: "'Inter', 'Outfit', sans-serif" }}>

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: '#345b79' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[60px]">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 no-underline">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#be5d3f' }}
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
              <span className="text-lg font-bold tracking-tight text-white">NexaBuild</span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="px-3 py-1.5 text-[13px] font-medium rounded-lg transition-all duration-150 whitespace-nowrap"
                  style={
                    link.active
                      ? { color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.15)' }
                      : { color: 'rgba(255,255,255,0.75)' }
                  }
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right: Login + Register */}
            <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
              <button className="text-sm font-medium px-4 py-1.5 rounded-lg border transition-all duration-150 hover:bg-white/10"
                style={{ color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.35)' }}>
                Login
              </button>
              <button
                className="text-sm font-semibold text-white px-5 py-1.5 rounded-lg transition-all duration-150 hover:opacity-90 shadow"
                style={{ backgroundColor: '#be5d3f' }}
              >
                Register
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg text-white/80 hover:bg-white/10 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 pb-5 pt-2 space-y-1 border-t border-white/15" style={{ backgroundColor: '#2d4f69' }}>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 px-3 text-sm font-medium rounded-lg transition-colors hover:bg-white/10"
                style={{ color: link.active ? '#ffffff' : 'rgba(255,255,255,0.75)' }}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-3 pt-3 border-t border-white/15 mt-2">
              <button className="flex-1 py-2.5 text-sm font-medium text-white border border-white/30 rounded-lg hover:bg-white/10 transition-colors">Login</button>
              <button className="flex-1 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors" style={{ backgroundColor: '#be5d3f' }}>Register</button>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero / Search Bar ── */}
      <section className="pt-[60px]" style={{ backgroundColor: '#345b79' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          {/* AI Badge */}
          <div className="flex justify-center mb-5">
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-full border"
              style={{ color: '#d59b86', borderColor: 'rgba(213,155,134,0.4)', backgroundColor: 'rgba(213,155,134,0.12)' }}
            >
              <SparklesIcon />
              AI-POWERED INTELLIGENCE
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white text-center leading-tight mb-3 tracking-tight">
            Find Your Perfect Property with AI
          </h1>
          <p className="text-center text-sm mb-8 max-w-md mx-auto leading-relaxed" style={{ color: 'rgba(230,224,212,0.70)' }}>
            Search thousands of properties and receive personalised recommendations
            based on your lifestyle and goals.
          </p>

          {/* Search Box */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-3 flex flex-col sm:flex-row gap-3 items-stretch">
            {/* Location input */}
            <div className="flex-1 flex items-center gap-2.5 border rounded-xl px-3 py-2.5" style={{ borderColor: '#e6e0d4' }}>
              <MapPinIcon cls="w-4 h-4 flex-shrink-0 text-[#ccb7a3]" />
              <input
                id="pl-search-location"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by city, district or property name..."
                className="w-full text-sm outline-none bg-transparent text-[#1d1d1d] placeholder:text-[#ccb7a3]"
              />
            </div>

            {/* Property Type dropdown */}
            <div className="relative flex-shrink-0">
              <div className="flex items-center gap-1.5 border rounded-xl px-3 py-2.5 cursor-pointer" style={{ borderColor: '#e6e0d4' }}>
                <svg className="w-4 h-4 text-[#ccb7a3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                <span className="text-sm text-[#1d1d1d] font-medium whitespace-nowrap">Property Type</span>
                <ChevronDownIcon />
              </div>
            </div>

            {/* Budget dropdown */}
            <div className="relative flex-shrink-0">
              <div className="flex items-center gap-1.5 border rounded-xl px-3 py-2.5 cursor-pointer" style={{ borderColor: '#e6e0d4' }}>
                <svg className="w-4 h-4 text-[#ccb7a3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-[#1d1d1d] font-medium">Budget</span>
                <ChevronDownIcon />
              </div>
            </div>

            {/* Search Button */}
            <button
              id="pl-search-btn"
              className="flex items-center justify-center gap-2 text-white font-bold px-6 py-2.5 rounded-xl transition-all duration-200 hover:opacity-90 shadow whitespace-nowrap flex-shrink-0"
              style={{ backgroundColor: '#be5d3f' }}
            >
              <SearchIcon />
              Search
            </button>
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-center gap-8 mt-8 pb-2">
            {[
              { value: '24,000+', label: 'Properties Listed' },
              { value: '98%', label: 'AI Match Accuracy' },
              { value: '340+', label: 'Verified Builders' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-lg font-extrabold text-white">{stat.value}</p>
                <p className="text-xs" style={{ color: 'rgba(230,224,212,0.65)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Content: Filters + Listings ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile filters toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl text-white"
            style={{ backgroundColor: '#345b79' }}
          >
            <FilterIcon />
            {mobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <div className="flex gap-6">
          {/* ── Left Sidebar Filters ── */}
          <aside className={`${mobileFiltersOpen ? 'block' : 'hidden'} lg:block w-full lg:w-[240px] flex-shrink-0`}>
            <div className="bg-white rounded-2xl shadow p-5 sticky top-[76px]">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-sm" style={{ color: '#1d1d1d' }}>Property Filters</h2>
                <button className="text-xs font-semibold hover:opacity-80 transition-opacity" style={{ color: '#be5d3f' }}>
                  Clear All
                </button>
              </div>

              {/* Location */}
              <div className="mb-5">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#928d64' }}>Location</h3>
                <select className="w-full border rounded-lg px-3 py-2 text-xs outline-none mb-3"
                  style={{ borderColor: '#e6e0d4', color: '#1d1d1d', backgroundColor: '#f9f7f4' }}>
                  <option>Select District...</option>
                  <option>Colombo</option>
                  <option>Kandy</option>
                  <option>Galle</option>
                  <option>Negombo</option>
                  <option>Matara</option>
                </select>

                {/* District pills */}
                <div className="flex flex-wrap gap-1.5">
                  {districts.map((d) => (
                    <button
                      key={d}
                      onClick={() => toggleDistrict(d)}
                      className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full transition-all duration-150"
                      style={
                        selectedDistricts.includes(d)
                          ? { backgroundColor: '#345b79', color: '#fff' }
                          : { backgroundColor: '#e6e0d4', color: '#928d64' }
                      }
                    >
                      {d}
                      {selectedDistricts.includes(d) && (
                        <span className="opacity-70"><XIcon /></span>
                      )}
                    </button>
                  ))}
                  <button className="text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: '#e6e0d4', color: '#928d64' }}>
                    Negombo
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t my-4" style={{ borderColor: '#e6e0d4' }} />

              {/* Property Type */}
              <div className="mb-5">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#928d64' }}>Property Type</h3>
                <div className="space-y-2">
                  {propertyTypes.map((type) => (
                    <label key={type} className="flex items-center gap-2.5 cursor-pointer group">
                      <div
                        className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                        style={
                          propertyType === type
                            ? { borderColor: '#345b79', backgroundColor: '#345b79' }
                            : { borderColor: '#ccb7a3' }
                        }
                        onClick={() => setPropertyType(type)}
                      >
                        {propertyType === type && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <span className="text-xs font-medium" style={{ color: '#1d1d1d' }} onClick={() => setPropertyType(type)}>
                        {type}
                      </span>
                    </label>
                  ))}
                  {['Apartment', 'Villa'].filter(t => !propertyTypes.includes(t)).length === 0 && null}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t my-4" style={{ borderColor: '#e6e0d4' }} />

              {/* Budget Range */}
              <div className="mb-5">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#928d64' }}>Budget Range</h3>
                <p className="text-xs mb-3" style={{ color: '#ccb7a3' }}>LKR (in millions)</p>
                {/* Range slider visual */}
                <div className="relative h-1.5 rounded-full mb-3" style={{ backgroundColor: '#e6e0d4' }}>
                  <div className="absolute h-full rounded-full" style={{ left: '0%', right: '40%', backgroundColor: '#345b79' }} />
                  <div className="absolute w-3.5 h-3.5 rounded-full -translate-y-1/2 top-1/2 cursor-pointer shadow border-2 border-white"
                    style={{ left: '0%', backgroundColor: '#345b79' }} />
                  <div className="absolute w-3.5 h-3.5 rounded-full -translate-y-1/2 top-1/2 cursor-pointer shadow border-2 border-white"
                    style={{ right: '40%', backgroundColor: '#345b79' }} />
                </div>
                <div className="flex gap-2">
                  <input
                    id="pl-min-budget"
                    type="text"
                    placeholder="Min: LKR 0"
                    value={minBudget}
                    onChange={(e) => setMinBudget(e.target.value)}
                    className="flex-1 border rounded-lg px-2.5 py-2 text-xs outline-none"
                    style={{ borderColor: '#e6e0d4', color: '#1d1d1d' }}
                  />
                  <input
                    id="pl-max-budget"
                    type="text"
                    placeholder="Max: LKR 500M"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    className="flex-1 border rounded-lg px-2.5 py-2 text-xs outline-none"
                    style={{ borderColor: '#e6e0d4', color: '#1d1d1d' }}
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t my-4" style={{ borderColor: '#e6e0d4' }} />

              {/* Bedrooms */}
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#928d64' }}>Bedrooms</h3>
                <div className="flex gap-1.5 flex-wrap">
                  {bedOptions.map((b) => (
                    <button
                      key={b}
                      onClick={() => setSelectedBeds(b)}
                      className="w-8 h-8 rounded-lg text-xs font-semibold transition-all duration-150"
                      style={
                        selectedBeds === b
                          ? { backgroundColor: '#345b79', color: '#fff' }
                          : { backgroundColor: '#e6e0d4', color: '#928d64' }
                      }
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Smart Recommend */}
              <button
                id="pl-ai-recommend-btn"
                className="w-full flex items-center justify-center gap-2 text-white text-sm font-bold py-3 rounded-xl mb-2.5 transition-all hover:opacity-90 shadow"
                style={{ background: 'linear-gradient(135deg, #345b79, #6b879c)' }}
              >
                <SparklesIcon />
                AI Smart Recommend
              </button>

              {/* Apply Filters */}
              <button
                id="pl-apply-filters-btn"
                className="w-full flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-xl transition-all hover:opacity-90 border"
                style={{ color: '#345b79', borderColor: '#345b79', backgroundColor: 'transparent' }}
              >
                <FilterIcon />
                Apply Filters
              </button>
            </div>
          </aside>

          {/* ── Right: Property Grid ── */}
          <div className="flex-1 min-w-0">
            {/* Sort + count row */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <p className="text-sm font-semibold" style={{ color: '#1d1d1d' }}>
                <span style={{ color: '#345b79' }}>268</span> properties found
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: '#928d64' }}>Sort by</span>
                <div
                  className="flex items-center gap-1.5 border rounded-lg px-3 py-1.5 cursor-pointer text-xs font-semibold"
                  style={{ borderColor: '#ccb7a3', color: '#1d1d1d', backgroundColor: '#fff' }}
                >
                  {sortBy}
                  <ChevronDownIcon />
                </div>
              </div>
            </div>

            {/* 3-column grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {allProperties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination current={currentPage} total={4} onChange={setCurrentPage} />
          </div>
        </div>
      </section>

      {/* ── Explore on Map ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        {/* Section header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-0.5 rounded-full inline-block" style={{ backgroundColor: '#be5d3f' }} />
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#be5d3f' }}>MAP VIEW</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: '#1d1d1d' }}>
              Explore Properties on Map
            </h2>
          </div>
          <button
            id="pl-open-map-btn"
            className="hidden sm:flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl text-white transition-all hover:opacity-90 shadow"
            style={{ backgroundColor: '#345b79' }}
          >
            <MapIcon />
            Open Full Map
          </button>
        </div>

        {/* Map container */}
        <div className="relative rounded-2xl overflow-hidden shadow-xl" style={{ height: '380px' }}>
          {/* Satellite map background using a dark topographic style */}
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(160deg, #1a2f3e 0%, #243b4d 40%, #1e3548 70%, #162432 100%)',
            }}
          >
            {/* Simulated Sri Lanka island shape */}
            <div className="relative w-full h-full">
              {/* Map overlay label */}
              <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20">
                <p className="text-white font-bold text-sm">NexaBuild</p>
                <p className="text-white/70 text-xs">Real Estate Portfolio · Sri Lanka</p>
              </div>

              {/* Zoom controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-0.5">
                <button className="w-7 h-7 bg-white rounded-t-md flex items-center justify-center text-[#1d1d1d] font-bold text-lg hover:bg-gray-100 transition-colors shadow">
                  +
                </button>
                <button className="w-7 h-7 bg-white rounded-b-md flex items-center justify-center text-[#1d1d1d] font-bold text-lg hover:bg-gray-100 transition-colors shadow border-t border-gray-100">
                  −
                </button>
              </div>

              {/* SVG Sri Lanka outline shape */}
              <svg
                viewBox="0 0 300 450"
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="xMidYMid meet"
                style={{ opacity: 0.95 }}
              >
                {/* Ocean */}
                <rect width="300" height="450" fill="transparent" />

                {/* Sri Lanka approximate shape */}
                <path
                  d="M145,40 C155,38 168,42 175,52 C185,65 188,80 186,95 C190,110 195,125 193,140 C198,155 200,170 196,185 C198,200 197,215 192,228 C195,242 193,256 188,268 C190,280 186,292 180,302 C176,315 168,325 160,332 C152,342 140,348 130,348 C118,350 107,344 98,336 C88,326 82,313 78,300 C72,288 70,274 73,260 C68,247 67,232 70,218 C66,204 66,189 70,175 C67,160 68,144 73,130 C71,115 73,99 79,86 C83,72 92,60 103,52 C112,43 128,39 145,40Z"
                  fill="#2d5a27"
                  stroke="#4a8a40"
                  strokeWidth="1.5"
                  opacity="0.85"
                />

                {/* Water body - Colombo area */}
                <circle cx="108" cy="118" r="8" fill="rgba(52,91,121,0.6)" />
                <circle cx="118" cy="165" r="6" fill="rgba(52,91,121,0.5)" />

                {/* Property pins */}
                {[
                  { x: 112, y: 110, label: 'LKR 85M', color: '#be5d3f' },
                  { x: 125, y: 145, label: 'LKR 45M', color: '#be5d3f' },
                  { x: 145, y: 185, label: 'LKR 125M', color: '#495d38' },
                  { x: 130, y: 225, label: 'LKR 55M', color: '#be5d3f' },
                  { x: 155, y: 260, label: 'LKR 48M', color: '#be5d3f' },
                  { x: 120, y: 295, label: 'LKR 220M', color: '#be5d3f' },
                  { x: 108, y: 175, label: 'LKR 32M', color: '#be5d3f' },
                  { x: 140, y: 320, label: 'LKR 75M', color: '#345b79' },
                ].map((pin, i) => (
                  <g key={i} style={{ cursor: 'pointer' }}>
                    <rect
                      x={pin.x - 18}
                      y={pin.y - 11}
                      width="36"
                      height="16"
                      rx="8"
                      fill={pin.color}
                      opacity="0.92"
                    />
                    <text
                      x={pin.x}
                      y={pin.y + 1}
                      textAnchor="middle"
                      fill="white"
                      fontSize="5.5"
                      fontWeight="700"
                      fontFamily="Inter, sans-serif"
                    >
                      {pin.label}
                    </text>
                    <polygon
                      points={`${pin.x - 3},${pin.y + 5} ${pin.x + 3},${pin.y + 5} ${pin.x},${pin.y + 10}`}
                      fill={pin.color}
                      opacity="0.92"
                    />
                  </g>
                ))}
              </svg>

              {/* Legend */}
              <div className="absolute bottom-4 left-4 flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/20">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#be5d3f' }} />
                  <span className="text-white text-xs font-medium">Selected</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/20">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#345b79' }} />
                  <span className="text-white text-xs font-medium">Available</span>
                </div>
              </div>

              {/* Full Map View button */}
              <button className="absolute bottom-4 right-4 sm:hidden flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/20">
                <MapIcon />
                <span className="text-white text-xs font-medium">Full Map View</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="pt-14 pb-8" style={{ backgroundColor: '#1d1d1d' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#be5d3f' }}>
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">NexaBuild</span>
              </div>
              <p className="text-sm leading-relaxed mb-5" style={{ color: '#928d64' }}>
                Sri Lanka's AI-powered property and construction platform. Connecting buyers, architects, and builders.
              </p>
              {/* Social icons */}
              <div className="flex gap-2">
                {[
                  { d: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
                  { d: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M7.5 21h9a4.5 4.5 0 004.5-4.5v-9A4.5 4.5 0 0016.5 3h-9A4.5 4.5 0 003 7.5v9A4.5 4.5 0 007.5 21z' },
                  { d: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z' },
                ].map((s, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: '#345b79' }}
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={s.d} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Properties */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest mb-4" style={{ color: '#d59b86' }}>PROPERTIES</h4>
              <ul className="space-y-2.5">
                {['Buy Property', 'Rent Property', 'Land for Sale', 'Commercial', 'New Projects'].map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm hover:opacity-80 transition-opacity" style={{ color: '#928d64' }}>{l}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest mb-4" style={{ color: '#d59b86' }}>SERVICES</h4>
              <ul className="space-y-2.5">
                {['Architecture Designs', 'Construction Companies', 'AI Matching', 'Property Valuation', 'Legal Guidance'].map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm hover:opacity-80 transition-opacity" style={{ color: '#928d64' }}>{l}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest mb-4" style={{ color: '#d59b86' }}>CONTACT US</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <MapPinIcon cls="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="text-sm" style={{ color: '#928d64' }}>42 Galle Road, Colombo 03, Sri Lanka</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0 text-[#928d64]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-sm" style={{ color: '#928d64' }}>+94 11 234 5678</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0 text-[#928d64]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm" style={{ color: '#928d64' }}>hello@nexabuild.lk</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
            style={{ borderTop: '1px solid rgba(146,141,100,0.2)' }}
          >
            <p className="text-xs" style={{ color: '#928d64' }}>
              © 2026 NEXABUILD (PVT) LTD. ALL RIGHTS RESERVED.
            </p>
            <div className="flex gap-5">
              {['PRIVACY POLICY', 'TERMS OF USE', 'COOKIE POLICY'].map((l) => (
                <a key={l} href="#" className="text-xs hover:opacity-80 transition-opacity uppercase tracking-wide" style={{ color: '#928d64' }}>
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
