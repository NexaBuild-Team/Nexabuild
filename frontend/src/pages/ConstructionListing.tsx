import { useState } from 'react'
import { Link } from 'react-router'

// ─── Color Palette ─────────────────────────────────────────────────────────────
// Primary Blue         : #345b79
// Primary Brick Accent : #be5d3f
// Primary Background   : #e6e0d4
// Secondary Background : #ccb7a3
// Secondary Blue       : #6b879c
// Light Accent         : #d59b86
// Olive Accent         : #928d64
// Dark Text            : #1d1d1d
// Green Accent         : #495d38

// ─── Data ──────────────────────────────────────────────────────────────────────
const districts = [
  'All Districts','Colombo','Gampaha','Kalutara','Kandy','Matale','Nuwara Eliya',
  'Galle','Matara','Hambantota','Jaffna','Kilinochchi','Mannar','Vavuniya',
  'Mullaitivu','Batticaloa','Ampara','Trincomalee','Kurunegala','Puttalam',
  'Anuradhapura','Polonnaruwa','Badulla','Moneragala','Ratnapura','Kegalle',
]

const budgets = [
  'Any Budget',
  'Under LKR 5M',
  'LKR 5M – 15M',
  'LKR 15M – 30M',
  'LKR 30M – 50M',
  'LKR 50M – 100M',
  'Above LKR 100M',
]

interface Company {
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
}

const companies: Company[] = [
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
  },
  {
    id: 2,
    name: 'CMI Construction Co.',
    initials: 'C',
    color: '#be5d3f',
    rating: 4.7,
    reviews: 198,
    location: 'Gampaha',
    description: 'Sri Lanka\'s leading large-scale commercial and mixed-use development specialist.',
    projects: 270,
    experience: 25,
    startingPrice: 'LKR8M',
    tags: ['Commercial', 'Industrial'],
    featured: true,
    coverBg: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
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
  },
]

const topBuilders = [
  { rank: 1, name: 'Heritage Construction', projects: 712 },
  { rank: 2, name: 'CMI Construction', projects: 498 },
  { rank: 3, name: 'Avant Engineering', projects: 341 },
]

// ─── Sub-components ────────────────────────────────────────────────────────────

function StarRating({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={star <= Math.round(rating) ? '#f59e0b' : 'none'}
          stroke="#f59e0b"
          strokeWidth="2"
          aria-hidden="true"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  )
}

function CompanyCard({ company }: { company: Company }) {
  return (
    <article
      id={`company-card-${company.id}`}
      className="group bg-white rounded-3xl overflow-hidden cursor-pointer"
      style={{
        boxShadow: '0 2px 16px rgba(52,91,121,0.10)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)'
        e.currentTarget.style.boxShadow = '0 16px 48px rgba(52,91,121,0.18)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 2px 16px rgba(52,91,121,0.10)'
      }}
    >
      {/* Cover Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={company.coverBg}
          alt={`${company.name} project`}
          className="w-full h-full object-cover"
          style={{ transition: 'transform 0.4s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.45))' }} />
        {company.featured && (
          <span
            className="absolute top-3 left-3 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider"
            style={{ backgroundColor: '#be5d3f' }}
          >
            Featured
          </span>
        )}
        <span
          className="absolute top-3 right-3 flex items-center gap-1 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: 'rgba(73,93,56,0.95)' }}
        >
          <svg width="10" height="10" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Verified
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Logo + Name Row */}
        <div className="flex items-start gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-base -mt-8 relative z-10 shadow-lg"
            style={{ backgroundColor: company.color, border: '2px solid white' }}
          >
            {company.initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-tight truncate" style={{ color: '#1d1d1d' }}>
              {company.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <StarRating rating={company.rating} size={10} />
              <span className="text-xs font-semibold" style={{ color: '#f59e0b' }}>{company.rating}</span>
              <span className="text-xs" style={{ color: '#928d64' }}>({company.reviews})</span>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 mb-2">
          <svg width="12" height="12" fill="none" stroke="#6b879c" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-xs" style={{ color: '#6b879c' }}>{company.location}</span>
        </div>

        {/* Description */}
        <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: '#928d64' }}>
          {company.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-3 py-3 rounded-xl" style={{ backgroundColor: '#f7f4f0' }}>
          <div className="text-center">
            <p className="text-sm font-bold" style={{ color: '#1d1d1d' }}>{company.projects}</p>
            <p className="text-[9px] uppercase tracking-wide" style={{ color: '#928d64' }}>Projects</p>
          </div>
          <div className="text-center" style={{ borderLeft: '1px solid #e6e0d4', borderRight: '1px solid #e6e0d4' }}>
            <p className="text-sm font-bold" style={{ color: '#1d1d1d' }}>{company.experience}yrs</p>
            <p className="text-[9px] uppercase tracking-wide" style={{ color: '#928d64' }}>Experience</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold" style={{ color: '#1d1d1d' }}>{company.startingPrice}</p>
            <p className="text-[9px] uppercase tracking-wide" style={{ color: '#928d64' }}>Starting</p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {company.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: '#e6e0d4', color: '#345b79' }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            to={`/construction-companies/${company.id}`}
            id={`view-profile-${company.id}`}
            className="flex-1 text-center text-xs font-semibold py-2 rounded-xl text-white no-underline transition-all duration-150 hover:opacity-90"
            style={{ backgroundColor: '#345b79' }}
          >
            View Profile
          </Link>
          <button
            id={`bookmark-${company.id}`}
            aria-label={`Bookmark ${company.name}`}
            className="p-2 rounded-xl transition-colors hover:bg-gray-100"
            style={{ border: '1px solid #e6e0d4' }}
          >
            <svg width="14" height="14" fill="none" stroke="#6b879c" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
          <button
            id={`email-${company.id}`}
            aria-label={`Email ${company.name}`}
            className="p-2 rounded-xl transition-colors hover:bg-gray-100"
            style={{ border: '1px solid #e6e0d4' }}
          >
            <svg width="14" height="14" fill="none" stroke="#6b879c" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ConstructionListing() {
  const [search, setSearch] = useState('')
  const [district, setDistrict] = useState('All Districts')
  const [budget, setBudget] = useState('Any Budget')
  const [currentPage, setCurrentPage] = useState(1)
  const [budgetSlider, setBudgetSlider] = useState(50)
  const [minRating, setMinRating] = useState(0)
  const [locations, setLocations] = useState<string[]>([])
  const [experience, setExperience] = useState('')
  const [specialization, setSpecialization] = useState('')

  const locationOptions = ['Colombo', 'Gampaha', 'Kandy', 'Galle', 'Matara']
  const experienceOptions = ['1 – 5 Years', '5 – 10 Years', '10 – 20 Years', '20+ Years']
  const specializationOptions = ['Residential', 'Commercial', 'Luxury Villas', 'Interior Design', 'Sustainable Design']

  const toggleLocation = (loc: string) => {
    setLocations((prev) => prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc])
  }

  const clearFilters = () => {
    setSearch(''); setDistrict('All Districts'); setBudget('Any Budget')
    setBudgetSlider(50); setMinRating(0); setLocations([]); setExperience(''); setSpecialization('')
  }

  return (
    <div style={{ backgroundColor: '#e6e0d4', minHeight: '100vh', fontFamily: "'Poppins', sans-serif" }}>
      {/* ── Hero Section ─────────────────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative pt-28 pb-16 px-4"
        style={{
          background: 'linear-gradient(135deg, #1d3a4f 0%, #345b79 50%, #4a7a9b 100%)',
          overflow: 'hidden',
        }}
      >
        {/* Architectural grid texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-white/25 backdrop-blur-sm"
               style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
            <svg width="14" height="14" fill="#d59b86" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-medium text-white/90 uppercase tracking-widest">250+ Verified Construction Companies Across Sri Lanka</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Find Trusted<br />
            <span style={{ color: '#d59b86' }}>Construction Companies</span>
          </h1>
          <p className="text-white/75 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Compare verified construction companies, explore completed projects and request quotations powered by AI.
          </p>

          {/* Search Container */}
          <div
            className="rounded-2xl p-3 max-w-3xl mx-auto"
            style={{ backgroundColor: 'white', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}
          >
            <div className="flex flex-col md:flex-row gap-2">
              {/* Company Name */}
              <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: '#f7f4f0' }}>
                <svg width="16" height="16" fill="none" stroke="#6b879c" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  id="search-company-name"
                  type="text"
                  placeholder="Search Company Name"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent w-full text-sm outline-none"
                  style={{ color: '#1d1d1d', fontFamily: "'Poppins', sans-serif" }}
                />
              </div>
              {/* District */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl md:w-44" style={{ backgroundColor: '#f7f4f0' }}>
                <svg width="16" height="16" fill="none" stroke="#6b879c" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <select
                  id="search-district"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="bg-transparent text-sm outline-none w-full"
                  style={{ color: '#1d1d1d', fontFamily: "'Poppins', sans-serif" }}
                >
                  {districts.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              {/* Budget */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl md:w-44" style={{ backgroundColor: '#f7f4f0' }}>
                <svg width="16" height="16" fill="none" stroke="#6b879c" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <select
                  id="search-budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="bg-transparent text-sm outline-none w-full"
                  style={{ color: '#1d1d1d', fontFamily: "'Poppins', sans-serif" }}
                >
                  {budgets.map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
              {/* Search Button */}
              <button
                id="hero-search-btn"
                className="flex items-center justify-center gap-2 px-7 py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-all duration-150 hover:shadow-lg"
                style={{ backgroundColor: '#be5d3f', minWidth: '120px' }}
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
                </svg>
                Search
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-10 mt-10">
            {[
              { value: '250+', label: 'Verified Builders' },
              { value: '15,000+', label: 'Completed Projects' },
              { value: '98%', label: 'Customer Satisfaction' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-xs uppercase tracking-widest mt-1" style={{ color: '#d59b86' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_260px] gap-7">

          {/* ── Left Sidebar: Filters ────────────────────────────────────────── */}
          <aside id="filters-sidebar" aria-label="Filters">
            <div
              className="bg-white rounded-3xl p-6 sticky top-20"
              style={{ boxShadow: '0 4px 24px rgba(52,91,121,0.10)' }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-sm uppercase tracking-widest" style={{ color: '#1d1d1d' }}>
                  Filters
                </h2>
                <button
                  id="clear-filters-btn"
                  onClick={clearFilters}
                  className="text-xs font-medium transition-opacity hover:opacity-70"
                  style={{ color: '#be5d3f' }}
                >
                  Clear All
                </button>
              </div>

              {/* Location */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#6b879c' }}>Location</h3>
                <div className="space-y-2">
                  {locationOptions.map((loc) => (
                    <label key={loc} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={locations.includes(loc)}
                        onChange={() => toggleLocation(loc)}
                        className="rounded"
                        style={{ accentColor: '#345b79' }}
                      />
                      <span className="text-sm group-hover:opacity-70 transition-opacity" style={{ color: '#1d1d1d' }}>{loc}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="my-4" style={{ borderTop: '1px solid #e6e0d4' }} />

              {/* Years of Experience */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#6b879c' }}>Years of Experience</h3>
                <div className="space-y-2">
                  {experienceOptions.map((opt) => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="experience"
                        checked={experience === opt}
                        onChange={() => setExperience(opt)}
                        style={{ accentColor: '#345b79' }}
                      />
                      <span className="text-sm group-hover:opacity-70 transition-opacity" style={{ color: '#1d1d1d' }}>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="my-4" style={{ borderTop: '1px solid #e6e0d4' }} />

              {/* Specialization */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#6b879c' }}>Specialization</h3>
                <div className="space-y-2">
                  {specializationOptions.map((opt) => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="specialization"
                        checked={specialization === opt}
                        onChange={() => setSpecialization(opt)}
                        style={{ accentColor: '#345b79' }}
                      />
                      <span className="text-sm group-hover:opacity-70 transition-opacity" style={{ color: '#1d1d1d' }}>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="my-4" style={{ borderTop: '1px solid #e6e0d4' }} />

              {/* Budget Slider */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#6b879c' }}>Budget Range</h3>
                  <span className="text-xs font-bold" style={{ color: '#345b79' }}>LKR {budgetSlider}M</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px]" style={{ color: '#928d64' }}>LKR 500K</span>
                  <input
                    id="budget-slider"
                    type="range"
                    min={1}
                    max={100}
                    value={budgetSlider}
                    onChange={(e) => setBudgetSlider(Number(e.target.value))}
                    className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: '#345b79', backgroundColor: '#e6e0d4' }}
                  />
                  <span className="text-[10px]" style={{ color: '#928d64' }}>LKR 100M</span>
                </div>
              </div>

              <div className="my-4" style={{ borderTop: '1px solid #e6e0d4' }} />

              {/* Min Rating */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#6b879c' }}>Minimum Rating</h3>
                <div className="flex items-center gap-2">
                  {[4, 4.5, 5].map((r) => (
                    <button
                      key={r}
                      id={`rating-filter-${r}`}
                      onClick={() => setMinRating(r)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-150"
                      style={minRating === r
                        ? { backgroundColor: '#345b79', color: 'white' }
                        : { backgroundColor: '#e6e0d4', color: '#345b79' }
                      }
                    >
                      <span>⭐ {r}+</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                id="apply-filters-btn"
                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#345b79' }}
              >
                Apply Filters
              </button>
            </div>
          </aside>

          {/* ── Center: Company Cards ────────────────────────────────────────── */}
          <section aria-label="Construction companies listing">
            {/* Results header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold" style={{ color: '#1d1d1d' }}>
                  Construction Companies
                </h2>
                <p className="text-sm mt-0.5" style={{ color: '#928d64' }}>Showing {companies.length} of 250+ verified companies</p>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs" style={{ color: '#928d64' }}>Sort by:</label>
                <select
                  id="sort-select"
                  className="text-sm rounded-lg px-3 py-1.5 outline-none"
                  style={{ backgroundColor: 'white', color: '#1d1d1d', border: '1px solid #e6e0d4', fontFamily: "'Poppins', sans-serif" }}
                >
                  <option>Top Rated</option>
                  <option>Most Projects</option>
                  <option>Price: Low to High</option>
                  <option>Newest</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              {companies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>

            {/* Pagination */}
            <div id="pagination" className="flex items-center justify-center gap-2">
              <button
                id="page-prev"
                className="w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-colors hover:opacity-80"
                style={{ backgroundColor: 'white', color: '#1d1d1d', boxShadow: '0 2px 8px rgba(52,91,121,0.10)', border: '1px solid #e6e0d4' }}
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                aria-label="Previous page"
              >
                ‹
              </button>
              {[1, 2, 3, '…', 12].map((page, idx) => (
                <button
                  key={idx}
                  id={`page-${page}`}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-medium transition-all duration-150"
                  style={currentPage === page
                    ? { backgroundColor: '#345b79', color: 'white', boxShadow: '0 4px 12px rgba(52,91,121,0.3)' }
                    : { backgroundColor: 'white', color: '#1d1d1d', border: '1px solid #e6e0d4' }
                  }
                  onClick={() => typeof page === 'number' && setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              <button
                id="page-next"
                className="w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-colors hover:opacity-80"
                style={{ backgroundColor: 'white', color: '#1d1d1d', boxShadow: '0 2px 8px rgba(52,91,121,0.10)', border: '1px solid #e6e0d4' }}
                onClick={() => setCurrentPage(currentPage + 1)}
                aria-label="Next page"
              >
                ›
              </button>
            </div>
          </section>

          {/* ── Right Sidebar ────────────────────────────────────────────────── */}
          <aside id="market-insights-sidebar" aria-label="Market insights">
            {/* Market Insights */}
            <div
              className="bg-white rounded-3xl p-6 mb-6"
              style={{ boxShadow: '0 4px 24px rgba(52,91,121,0.10)' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#345b79' }}>
                  <svg width="14" height="14" fill="white" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
                <h3 className="font-bold text-sm" style={{ color: '#1d1d1d' }}>Market Insights</h3>
              </div>

              <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: '#928d64' }}>
                Avg. Construction Cost / Sqft
              </p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl font-bold" style={{ color: '#345b79' }}>LKR 4,200</span>
              </div>
              <p className="text-[10px] mb-4 flex items-center gap-1" style={{ color: '#495d38' }}>
                <svg width="10" height="10" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                +8.2% from last year
              </p>

              <div className="space-y-3">
                {[
                  { label: 'Residential', value: 'LKR 3.8K', color: '#345b79', pct: 70 },
                  { label: 'Commercial', value: 'LKR 5.2K', color: '#be5d3f', pct: 85 },
                  { label: 'Industrial', value: 'LKR 2.9K', color: '#928d64', pct: 55 },
                  { label: 'Luxury', value: 'LKR 8.5K', color: '#d59b86', pct: 95 },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs" style={{ color: '#928d64' }}>{item.label}</span>
                      <span className="text-xs font-semibold" style={{ color: '#1d1d1d' }}>{item.value}</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ backgroundColor: '#e6e0d4' }}>
                      <div
                        className="h-1.5 rounded-full"
                        style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Residential Builders */}
            <div
              className="bg-white rounded-3xl p-6"
              style={{ boxShadow: '0 4px 24px rgba(52,91,121,0.10)' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#be5d3f' }}>
                  <svg width="14" height="14" fill="white" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <h3 className="font-bold text-sm" style={{ color: '#1d1d1d' }}>Top Residential Builders</h3>
              </div>

              <div className="space-y-3">
                {topBuilders.map((builder) => (
                  <div key={builder.rank} className="flex items-center gap-3">
                    <span
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: builder.rank === 1 ? '#be5d3f' : builder.rank === 2 ? '#6b879c' : '#928d64' }}
                    >
                      {builder.rank}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: '#1d1d1d' }}>{builder.name}</p>
                      <p className="text-[10px]" style={{ color: '#928d64' }}>{builder.projects} projects</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/construction-companies"
                id="view-all-builders-btn"
                className="mt-5 block text-center text-xs font-semibold py-2.5 rounded-xl no-underline transition-all hover:opacity-90"
                style={{ backgroundColor: '#e6e0d4', color: '#345b79' }}
              >
                View All Rankings
              </Link>
            </div>
          </aside>

        </div>
      </main>
    </div>
  )
}
