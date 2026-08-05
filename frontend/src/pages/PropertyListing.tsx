import { useState, lazy, Suspense, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { allPropertiesPool, type RecommendedProperty } from '../data/recommendedProperties'

const SriLankaMap = lazy(() => import('../components/SriLankaMap'))


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
// Using shared RecommendedProperty type from data/recommendedProperties.ts
type ListingProperty = RecommendedProperty

// ─── Property Data (shared from data/recommendedProperties.ts) ───────────────
const allProperties: ListingProperty[] = allPropertiesPool

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
  const navigate = useNavigate()

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer group"
      onClick={() => navigate(`/property-detail/${property.id}`)}
    >
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
          style={{ backgroundColor: property.badgeColor }}
        >
          {property.badge}
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
            {property.area}
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
// Max budget in millions for the slider
const SLIDER_MAX = 500

export default function PropertyListing() {
  // ── Read URL params (from Home page search) ──
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const initQuery     = searchParams.get('query')     ?? ''
  const initType      = (searchParams.get('type') ?? '').replace(/^\w/, c => c.toUpperCase())
  const initMinBudget = parseInt(searchParams.get('minBudget') ?? '0',  10)
  const initMaxBudget = parseInt(searchParams.get('maxBudget') ?? String(SLIDER_MAX), 10)

  // ── Single unified filter state (shared by hero bar + sidebar) ──
  const [searchQuery,       setSearchQuery]       = useState(initQuery)
  const [propertyType,      setPropertyType]      = useState(initType || 'All Types')
  const [minBudgetM,        setMinBudgetM]        = useState(isNaN(initMinBudget) ? 0          : initMinBudget)
  const [maxBudgetM,        setMaxBudgetM]        = useState(isNaN(initMaxBudget) ? SLIDER_MAX : initMaxBudget)
  const [selectedBeds,      setSelectedBeds]      = useState('All')
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([])
  const [currentPage,       setCurrentPage]       = useState(1)
  const [sortBy,            _setSortBy]           = useState('Most Relevant')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const districts     = ['Colombo', 'Kandy', 'Galle', 'Negombo']
  const propertyTypes = ['All Types', 'House', 'Apartment', 'Villa', 'Commercial']
  const bedOptions    = ['All', '1', '2', '3', '4', '5+']

  const toggleDistrict = (d: string) =>
    setSelectedDistricts(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])

  const clearAll = () => {
    setSearchQuery(''); setPropertyType('All Types')
    setMinBudgetM(0); setMaxBudgetM(SLIDER_MAX)
    setSelectedBeds('All'); setSelectedDistricts([]); setCurrentPage(1)
  }

  // ── Unified filtering logic ──
  const filteredProperties = useMemo(() => {
    return allProperties.filter(p => {
      // Text search — location / title
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (!p.title.toLowerCase().includes(q) && !p.location.toLowerCase().includes(q)) return false
      }
      // Property type (shared state)
      if (propertyType && propertyType !== 'All Types')
        if (p.type.toLowerCase() !== propertyType.toLowerCase()) return false
      // Budget range (shared state, in millions)
      const pM = p.priceNum / 1_000_000
      if (minBudgetM > 0    && pM < minBudgetM)   return false
      if (maxBudgetM < SLIDER_MAX && pM > maxBudgetM) return false
      // District (sidebar only)
      if (selectedDistricts.length > 0 && !selectedDistricts.includes(p.district)) return false
      // Bedrooms (sidebar only)
      if (selectedBeds && selectedBeds !== 'All') {
        const req = selectedBeds === '5+' ? 5 : parseInt(selectedBeds, 10)
        if (selectedBeds === '5+') { if (p.beds < 5) return false }
        else                       { if (p.beds !== req) return false }
      }
      return true
    })
  }, [searchQuery, propertyType, minBudgetM, maxBudgetM, selectedDistricts, selectedBeds])

  // ── Budget preset ranges for the hero dropdown ──
  const BUDGET_PRESETS = [
    { label: 'Budget',     min: 0,   max: SLIDER_MAX },
    { label: 'Under 30M',  min: 0,   max: 30  },
    { label: '30M – 60M',  min: 30,  max: 60  },
    { label: '60M – 100M', min: 60,  max: 100 },
    { label: '100M – 200M',min: 100, max: 200 },
    { label: 'Above 200M', min: 200, max: SLIDER_MAX },
  ]
  const heroBudgetLabel = BUDGET_PRESETS.find(
    r => r.min === minBudgetM && r.max === maxBudgetM
  )?.label ?? 'Budget'

  const handleAIRecommend = () => {
    const params = new URLSearchParams()
    if (selectedDistricts.length > 0) params.set('districts', selectedDistricts.join(','))
    if (propertyType !== 'All Types') params.set('type', propertyType)
    if (selectedBeds !== 'All')       params.set('beds', selectedBeds)
    if (minBudgetM > 0)               params.set('minBudget', String(minBudgetM))
    if (maxBudgetM < SLIDER_MAX)      params.set('maxBudget', String(maxBudgetM))
    if (searchQuery)                  params.set('query', searchQuery)
    navigate(`/property-listing-ai?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-[#e6e0d4]" style={{ fontFamily: "'Inter', 'Outfit', sans-serif" }}>
      {/* Range slider thumb styles */}
      <style>{`
        input[type='range'].appearance-none::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px; height: 16px;
          border-radius: 50%;
          background: #345b79;
          border: 2px solid #fff;
          box-shadow: 0 1px 4px rgba(52,91,121,0.35);
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        input[type='range'].appearance-none::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 2px 8px rgba(52,91,121,0.5);
        }
        input[type='range'].appearance-none::-moz-range-thumb {
          width: 16px; height: 16px;
          border-radius: 50%;
          background: #345b79;
          border: 2px solid #fff;
          box-shadow: 0 1px 4px rgba(52,91,121,0.35);
          cursor: pointer;
        }
        input[type='range'].appearance-none::-webkit-slider-runnable-track { background: transparent; }
        input[type='range'].appearance-none::-moz-range-track { background: transparent; }
      `}</style>



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
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white text-center leading-tight mb-3 tracking-tight">
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

            {/* Property Type — synced with sidebar */}
            <div className="relative flex-shrink-0">
              <div className="flex items-center gap-1.5 border rounded-xl px-3 py-2.5" style={{ borderColor: '#e6e0d4' }}>
                <svg className="w-4 h-4 text-[#ccb7a3] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                <select
                  id="pl-hero-type"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="text-sm font-medium bg-transparent outline-none cursor-pointer appearance-none pr-1"
                  style={{ color: propertyType !== 'All Types' ? '#1d1d1d' : '#928d64' }}
                >
                  <option value="All Types">Property Type</option>
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Commercial">Commercial</option>
                </select>
                <ChevronDownIcon />
              </div>
            </div>

            {/* Budget — preset ranges synced with sidebar slider */}
            <div className="relative flex-shrink-0">
              <div className="flex items-center gap-1.5 border rounded-xl px-3 py-2.5" style={{ borderColor: '#e6e0d4' }}>
                <svg className="w-4 h-4 text-[#ccb7a3] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <select
                  id="pl-hero-budget"
                  value={heroBudgetLabel}
                  onChange={(e) => {
                    const preset = BUDGET_PRESETS.find(r => r.label === e.target.value)
                    if (preset) { setMinBudgetM(preset.min); setMaxBudgetM(preset.max) }
                  }}
                  className="text-sm font-medium bg-transparent outline-none cursor-pointer appearance-none pr-1"
                  style={{ color: heroBudgetLabel !== 'Budget' ? '#1d1d1d' : '#928d64' }}
                >
                  {BUDGET_PRESETS.map(r => (
                    <option key={r.label} value={r.label}>{r.label}</option>
                  ))}
                </select>
                <ChevronDownIcon />
              </div>
            </div>

            {/* Search Button */}
            <button
              id="pl-search-btn"
              onClick={() => { setCurrentPage(1) }}
              className="flex items-center justify-center gap-2 text-white font-bold px-6 py-2.5 rounded-xl transition-all duration-200 hover:opacity-90 shadow whitespace-nowrap flex-shrink-0 active:scale-95"
              style={{ backgroundColor: '#be5d3f' }}
            >
              <SearchIcon />
              Search
            </button>
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-center gap-5 sm:gap-8 mt-8 pb-2 flex-wrap">
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
            <div className="bg-white rounded-2xl shadow p-5 sticky top-[76px] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-sm" style={{ color: '#1d1d1d' }}>Property Filters</h2>
                <button
                  onClick={clearAll}
                  className="text-xs font-semibold hover:opacity-80 transition-opacity"
                  style={{ color: '#be5d3f' }}
                >
                  Clear All
                </button>
              </div>

              {/* Location — select controls selectedDistricts */}
              <div className="mb-5">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#928d64' }}>Location</h3>
                <select
                  id="pl-sidebar-location"
                  value={selectedDistricts.length === 1 ? selectedDistricts[0] : ''}
                  onChange={(e) => {
                    if (e.target.value === '') {
                      setSelectedDistricts([])
                    } else {
                      setSelectedDistricts([e.target.value])
                    }
                  }}
                  className="w-full border rounded-lg px-3 py-2 text-xs outline-none mb-3"
                  style={{
                    borderColor: '#e6e0d4',
                    color: selectedDistricts.length > 0 ? '#1d1d1d' : '#928d64',
                    backgroundColor: '#f9f7f4',
                  }}
                >
                  <option value="">All Locations</option>
                  <option value="Colombo">Colombo</option>
                  <option value="Kandy">Kandy</option>
                  <option value="Galle">Galle</option>
                  <option value="Negombo">Negombo</option>
                  <option value="Matara">Matara</option>
                </select>

                {/* District pills — multi-select, in sync with the dropdown */}
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
                </div>
              </div>

              {/* Divider */}
              <div className="border-t my-4" style={{ borderColor: '#e6e0d4' }} />

              {/* Property Type — synced with hero bar */}
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
                </div>
              </div>

              {/* Divider */}
              <div className="border-t my-4" style={{ borderColor: '#e6e0d4' }} />

              {/* Budget Range — real dual-range slider synced with hero */}
              <div className="mb-5">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#928d64' }}>Budget Range</h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold" style={{ color: '#345b79' }}>LKR {minBudgetM}M</span>
                  <span className="text-[11px] font-semibold" style={{ color: '#345b79' }}>LKR {maxBudgetM >= SLIDER_MAX ? `${SLIDER_MAX}M+` : `${maxBudgetM}M`}</span>
                </div>

                {/* Dual range slider */}
                <div className="relative h-6 flex items-center">
                  {/* Track */}
                  <div className="absolute w-full h-1.5 rounded-full" style={{ backgroundColor: '#e6e0d4' }} />
                  {/* Active range fill */}
                  <div
                    className="absolute h-1.5 rounded-full pointer-events-none"
                    style={{
                      left: `${(minBudgetM / SLIDER_MAX) * 100}%`,
                      right: `${100 - (maxBudgetM / SLIDER_MAX) * 100}%`,
                      backgroundColor: '#345b79',
                    }}
                  />
                  {/* Min thumb */}
                  <input
                    id="pl-slider-min"
                    type="range"
                    min={0}
                    max={SLIDER_MAX}
                    step={5}
                    value={minBudgetM}
                    onChange={(e) => {
                      const v = Number(e.target.value)
                      if (v <= maxBudgetM) setMinBudgetM(v)
                    }}
                    className="absolute w-full h-1.5 appearance-none bg-transparent cursor-pointer"
                    style={{ zIndex: minBudgetM > SLIDER_MAX - 10 ? 5 : 3 }}
                  />
                  {/* Max thumb */}
                  <input
                    id="pl-slider-max"
                    type="range"
                    min={0}
                    max={SLIDER_MAX}
                    step={5}
                    value={maxBudgetM}
                    onChange={(e) => {
                      const v = Number(e.target.value)
                      if (v >= minBudgetM) setMaxBudgetM(v)
                    }}
                    className="absolute w-full h-1.5 appearance-none bg-transparent cursor-pointer"
                    style={{ zIndex: 4 }}
                  />
                </div>

                <p className="text-[10px] mt-2" style={{ color: '#ccb7a3' }}>LKR (in millions) · drag both ends</p>
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
                onClick={handleAIRecommend}
                className="w-full flex items-center justify-center gap-2 text-white text-sm font-bold py-3 rounded-xl mb-2.5 transition-all hover:opacity-90 shadow active:scale-95"
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
                <span style={{ color: '#345b79' }}>{filteredProperties.length}</span> propert{filteredProperties.length !== 1 ? 'ies' : 'y'} found
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
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredProperties.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow p-14 text-center">
                <svg className="w-10 h-10 mx-auto mb-3 text-[#ccb7a3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="font-semibold text-sm mb-1" style={{ color: '#1d1d1d' }}>No properties match your filters</p>
                <p className="text-xs mb-5" style={{ color: '#928d64' }}>Try adjusting your search criteria or clearing some filters.</p>
                <button
                  onClick={() => {
                                      setSearchQuery('');
                                      setPropertyType('All Types');
                                      setMinBudgetM(0);
                                      setMaxBudgetM(SLIDER_MAX);
                                      setSelectedBeds('All');
                                      setSelectedDistricts([]);
                                      setCurrentPage(1);
}}
                  className="text-xs font-bold px-6 py-2.5 rounded-xl text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: '#345b79' }}
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination — only when results exist */}
            {filteredProperties.length > 0 && (
              <Pagination current={currentPage} total={Math.max(1, Math.ceil(filteredProperties.length / 6))} onChange={setCurrentPage} />
            )}
          </div>
        </div>
      </section>

      {/* ── Explore on Map ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
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
        <div className="relative rounded-2xl overflow-hidden shadow-xl" style={{ height: '480px' }}>
          {/* React-Leaflet map — CARTO Voyager tiles, centered on Sri Lanka */}
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center" style={{ background: '#e6e0d4' }}>
              <p className="text-sm font-semibold" style={{ color: '#928d64' }}>Loading map…</p>
            </div>
          }>
            <SriLankaMap />
          </Suspense>

          {/* Overlay: NexaBuild branding badge */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md border border-white/60 pointer-events-none" style={{ zIndex: 1000 }}>
            <p className="font-bold text-sm" style={{ color: '#345b79' }}>NexaBuild</p>
            <p className="text-xs" style={{ color: '#928d64' }}>Real Estate · Sri Lanka</p>
          </div>

          {/* Overlay: Legend */}
          <div className="absolute bottom-4 left-4 flex items-center gap-3 pointer-events-none" style={{ zIndex: 1000 }}>
            <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow border border-white/60">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#be5d3f' }} />
              <span className="text-xs font-medium" style={{ color: '#1d1d1d' }}>For Sale</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow border border-white/60">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#345b79' }} />
              <span className="text-xs font-medium" style={{ color: '#1d1d1d' }}>Premium</span>
            </div>
          </div>
        </div>
      </section>

 
    </div>
  )
}
