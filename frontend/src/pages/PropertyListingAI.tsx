import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

import { fetchAllProperties, type MappedProperty } from '../services/propertyService'

// ─── Color Palette ─────────────────────────────────────────────────────────────
// Primary Brick Accent : #be5d3f  |  Primary Blue  : #345b79
// Primary BG           : #e6e0d4  |  Secondary BG  : #ccb7a3
// Secondary Blue       : #6b879c  |  Light Accent  : #d59b86
// Olive Accent         : #928d64  |  Dark Text     : #1d1d1d
// Green Accent         : #495d38

type AIProperty = MappedProperty

// ─── Full Property Pool ───────────────────────────────────────────────────────
// (imported from shared data — see data/recommendedProperties.ts)

const marketInsights = [
  { city: 'Colombo 7', trend: '+2.3%', trendUp: true,  value: 'LKR 48M avg' },
  { city: 'Kandy City', trend: '+1.1%', trendUp: true,  value: 'LKR 18M avg' },
  { city: 'Negombo',    trend: '-0.5%', trendUp: false, value: 'LKR 22M avg' },
  { city: 'Colombo 3',  trend: '+3.7%', trendUp: true,  value: 'LKR 95M avg' },
]

const bestInvestmentZones = [
  { name: 'Colombo 10', avgPrice: 'LKR 41M', barWidth: '72%', color: '#345b79' },
  { name: 'Galle Face',  avgPrice: 'LKR 88M', barWidth: '90%', color: '#be5d3f' },
]

const ALL_DISTRICTS  = ['Colombo', 'Kandy', 'Galle', 'Negombo']
const PROP_TYPES     = ['All Types', 'Apartment', 'Villa', 'House', 'Commercial']
const BED_OPTIONS    = ['Any', '1', '2', '3', '4', '5+']

// ─── AI Preference Questions ──────────────────────────────────────────────────
const AI_QUESTIONS = [
  {
    id: 'purpose',
    label: 'What is your purpose?',
    emoji: '🎯',
    options: ['Investment', 'Own Home', 'Vacation Home', 'Rental Income'],
  },
  {
    id: 'features',
    label: 'Must-have features?',
    emoji: '✨',
    options: ['Pool', 'Garden', 'Sea View', 'Modern Kitchen', 'Security', 'Parking'],
  },
  {
    id: 'lifestyle',
    label: 'Preferred lifestyle?',
    emoji: '🏙',
    options: ['Urban', 'Suburban', 'Coastal', 'Rural', 'City Center'],
  },
  {
    id: 'priority',
    label: 'What matters most?',
    emoji: '⭐',
    options: ['Near Schools', 'Near Hospital', 'Near Highway', 'Quiet Area', 'Near Beach'],
  },
]

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const SparklesIcon = ({ cls = 'w-3.5 h-3.5' }: { cls?: string }) => (
  <svg className={cls} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
  </svg>
)
const MapPinIcon = ({ cls = 'w-4 h-4' }: { cls?: string }) => (
  <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)
const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)
const ChevronDownIcon = ({ cls = 'w-4 h-4' }: { cls?: string }) => (
  <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)
const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg className="w-4 h-4" fill={filled ? '#be5d3f' : 'none'} stroke={filled ? '#be5d3f' : 'currentColor'} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
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
const TrendUpIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)
const TrendDownIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
  </svg>
)
const FilterIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
)
const ArrowRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)
const XIcon = ({ cls = 'w-3 h-3' }: { cls?: string }) => (
  <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)
const SortIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
  </svg>
)
const CheckIcon = () => (
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
)

// ─── Recommended Card ─────────────────────────────────────────────────────────
function RecommendedCard({
  property,
  displayScore,
  displayReason,
}: {
  property: AIProperty
  displayScore: number
  displayReason: string
}) {
  const [fav, setFav] = useState(property.isFavorite ?? false)
  const navigate = useNavigate()
  const circumference = 113.1
  const dash = (displayScore / 100) * circumference

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row">
      {/* Image */}
      <div className="relative flex-shrink-0 w-full sm:w-44 h-44 sm:h-auto overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        <span
          className="absolute top-2 left-2 text-white text-[9px] font-bold px-2 py-0.5 rounded tracking-widest uppercase"
          style={{ backgroundColor: property.badgeColor }}
        >
          {property.badge}
        </span>
        <button
          onClick={() => setFav(!fav)}
          className="absolute top-2 right-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        >
          <HeartIcon filled={fav} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <p className="text-[#be5d3f] font-bold text-sm">{property.price}</p>
              <h3 className="font-semibold text-[#1d1d1d] text-sm leading-tight">{property.title}</h3>
            </div>
            {/* Match Score Ring — animates when score changes */}
            <div className="flex-shrink-0 relative w-11 h-11">
              <svg className="w-11 h-11 -rotate-90" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(52,91,121,0.15)" strokeWidth="4" />
                <circle
                  cx="22" cy="22" r="18" fill="none"
                  stroke="#345b79" strokeWidth="4"
                  strokeDasharray={`${dash} ${circumference}`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dasharray 0.8s ease' }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#345b79]">
                {displayScore}%
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[#928d64] text-xs mb-2">
            <MapPinIcon cls="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-[#6b879c] mb-3 py-2 border-t border-[#e6e0d4]">
            <span className="flex items-center gap-1"><BedIcon />{property.beds} Beds</span>
            <span className="flex items-center gap-1"><BathIcon />{property.baths} Baths</span>
            <span className="flex items-center gap-1"><AreaIcon />{property.area}</span>
          </div>

          {/* Why recommended */}
          <div className="bg-[#e6e0d4] rounded-lg px-3 py-2">
            <p className="text-[10px] font-bold text-[#345b79] uppercase tracking-wider mb-0.5 flex items-center gap-1">
              <SparklesIcon cls="w-3 h-3" />
              Why Recommended
            </p>
            <p className="text-[10px] text-[#928d64] leading-relaxed">{displayReason}</p>
          </div>
        </div>

        <button
          onClick={() => navigate(`/property-detail/${property.id}`, { state: { fromAI: true } })}
          className="mt-3 w-full text-xs font-bold py-2 rounded-lg text-white transition-all hover:opacity-90"
          style={{ backgroundColor: '#345b79' }}
        >
          View Details
        </button>
      </div>
    </div>
  )
}

// ─── Browse Card ───────────────────────────────────────────────────────────────
function BrowseCard({ property }: { property: AIProperty }) {
  const [fav, setFav] = useState(property.isFavorite ?? false)
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer group">
      <div className="relative overflow-hidden h-40">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span
          className="absolute top-2.5 left-2.5 text-white text-[9px] font-bold px-2 py-0.5 rounded tracking-widest uppercase"
          style={{ backgroundColor: property.badgeColor }}
        >
          {property.badge}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); setFav(!fav) }}
          className="absolute top-2.5 right-2.5 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        >
          <HeartIcon filled={fav} />
        </button>
      </div>
      <div className="p-3">
        <p className="text-[#be5d3f] font-bold text-sm mb-0.5">{property.price}</p>
        <h3 className="font-semibold text-[#1d1d1d] text-xs leading-tight mb-1">{property.title}</h3>
        <div className="flex items-center gap-1 text-[#928d64] text-[10px] mb-2">
          <MapPinIcon cls="w-2.5 h-2.5 flex-shrink-0" />
          <span className="truncate">{property.location}</span>
        </div>
        <div className="flex items-center gap-3 pt-2 text-[10px] text-[#6b879c] border-t border-[#e6e0d4] mb-2.5">
          <span className="flex items-center gap-1"><BedIcon />{property.beds} Beds</span>
          <span className="flex items-center gap-1"><BathIcon />{property.baths} Baths</span>
          <span className="flex items-center gap-1 ml-auto"><AreaIcon />{property.area}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/property-detail/${property.id}`, { state: { fromAI: true } })}
            className="flex-1 text-[10px] font-bold py-1.5 rounded-lg text-white transition-all hover:opacity-90"
            style={{ backgroundColor: '#345b79' }}
          >
            View Details
          </button>
          <button
            className="flex-1 text-[10px] font-bold py-1.5 rounded-lg border transition-all hover:opacity-80"
            style={{ color: '#be5d3f', borderColor: '#be5d3f' }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Filter Chip ───────────────────────────────────────────────────────────────
function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full"
      style={{ backgroundColor: 'rgba(52,91,121,0.12)', color: '#345b79' }}
    >
      <CheckIcon />
      {label}
      <button onClick={onRemove} className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity">
        <XIcon cls="w-2.5 h-2.5" />
      </button>
    </span>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function PropertyListingAI() {
  const navigate = useNavigate()
  // ── Read URL params passed from PropertyListing "AI Smart Recommend" ──
  const [searchParams, setSearchParams] = useSearchParams()

  const initDistricts = useMemo(
    () => searchParams.get('districts')?.split(',').filter(Boolean) ?? [],
    [] // run once on mount
  )
  const initType      = searchParams.get('type')      ?? ''
  const initBeds      = searchParams.get('beds')      ?? ''
  const initMinBudget = parseInt(searchParams.get('minBudget') ?? '0', 10)
  const initMaxBudget = parseInt(searchParams.get('maxBudget') ?? '500', 10)
  const initQuery     = searchParams.get('query')     ?? ''

  const hasIncomingFilters =
    initDistricts.length > 0 || initType || initBeds || initMinBudget > 0 || initMaxBudget < 500 || initQuery

  // ── Local filter state — seeded from URL params ──
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>(
    initDistricts.length > 0 ? initDistricts : []
  )
  const [propertyTypeFilter, setPropertyTypeFilter] = useState(initType || 'All Types')
  const [selectedBedIndex, setSelectedBedIndex]     = useState(() => {
    const idx = BED_OPTIONS.indexOf(initBeds)
    return idx >= 0 ? idx : 0
  })
  
  const SLIDER_MAX = 500
  const [minBudgetM, setMinBudgetM] = useState(isNaN(initMinBudget) ? 0 : initMinBudget)
  const [maxBudgetM, setMaxBudgetM] = useState(isNaN(initMaxBudget) ? SLIDER_MAX : initMaxBudget)
  
  const [heroLocation, setHeroLocation] = useState(() => {
    if (initDistricts.length > 0) return initDistricts.join(', ')
    return initQuery
  })
  const [searchQuery, setSearchQuery] = useState(initQuery)

  // Clear a single URL param chip
  const clearParam = (key: string) => {
    const next = new URLSearchParams(searchParams)
    next.delete(key)
    setSearchParams(next)
    if (key === 'districts') { setSelectedDistricts([]); setHeroLocation('') }
    if (key === 'type')      setPropertyTypeFilter('All Types')
    if (key === 'beds')      setSelectedBedIndex(0)
    if (key === 'minBudget') setMinBudgetM(0)
    if (key === 'maxBudget') setMaxBudgetM(SLIDER_MAX)
    if (key === 'query')     { setSearchQuery(''); setHeroLocation('') }
  }

  const setDistrictsAndHero = (districts: string[]) => {
    setSelectedDistricts(districts)
    setHeroLocation(districts.length === 1 ? districts[0] : districts.join(', '))
    setSearchQuery('')
  }

  const toggleDistrict = (d: string) => {
    const next = selectedDistricts.includes(d) ? selectedDistricts.filter(x => x !== d) : [...selectedDistricts, d]
    setDistrictsAndHero(next)
  }

  const handleHeroSearch = () => {
    const raw = heroLocation.trim()
    const parts = raw.split(',').map(s => s.trim()).filter(Boolean)
    const matchedDistricts = parts.filter(p =>
      ALL_DISTRICTS.some(d => d.toLowerCase() === p.toLowerCase())
    ).map(p => ALL_DISTRICTS.find(d => d.toLowerCase() === p.toLowerCase())!)

    if (matchedDistricts.length > 0) {
      setSelectedDistricts(matchedDistricts)
      setSearchQuery('')
    } else {
      setSelectedDistricts([])
      setSearchQuery(raw)
    }
  }

  // ── API data ──
  const [propertyPool,  setPropertyPool]  = useState<AIProperty[]>([])
  const [_isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    fetchAllProperties()
      .then(setPropertyPool)
      .catch(() => setPropertyPool([]))
      .finally(() => setIsLoadingData(false))
  }, [])

  // ── Derived filter logic ───────────────────────────────────────────────────
  const filteredPool = useMemo(() => {
    return propertyPool.filter(p => {
      // District filter
      if (selectedDistricts.length > 0 && !selectedDistricts.includes(p.district)) return false

      // Property type filter
      if (propertyTypeFilter && propertyTypeFilter !== 'All Types' && p.type !== propertyTypeFilter) return false

      // Bedrooms filter
      const bedLabel = BED_OPTIONS[selectedBedIndex]
      if (bedLabel && bedLabel !== 'Any') {
        const required = bedLabel === '5+' ? 5 : parseInt(bedLabel, 10)
        if (bedLabel === '5+') { if (p.beds < 5) return false }
        else                   { if (p.beds !== required) return false }
      }

      // Budget filter (in millions)
      const pM = p.priceNum / 1_000_000
      if (minBudgetM > 0 && pM < minBudgetM) return false
      if (maxBudgetM < SLIDER_MAX && pM > maxBudgetM) return false

      // Text search
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        if (!p.title.toLowerCase().includes(q) && !p.location.toLowerCase().includes(q)) return false
      }

      return true
    })
    // Sort by match score descending
    .sort((a, b) => b.matchScore - a.matchScore)
  }, [propertyPool, selectedDistricts, propertyTypeFilter, selectedBedIndex, minBudgetM, maxBudgetM, searchQuery])

  // ── AI Preference state ──────────────────────────────────────────────────
  const [aiPrefs, setAiPrefs] = useState<Record<string, string[]>>({
    purpose: [], features: [], lifestyle: [], priority: [],
  })
  const [hasGenerated, setHasGenerated] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const totalSelected = Object.values(aiPrefs).flat().length

  const togglePref = (cat: string, val: string) => {
    setHasGenerated(false) // reset results when prefs change
    setAiPrefs(prev => ({
      ...prev,
      [cat]: prev[cat].includes(val)
        ? prev[cat].filter(v => v !== val)
        : [...prev[cat], val],
    }))
  }

  // ── AI scoring engine ─────────────────────────────────────────────────────
  const scoreWithAI = (p: AIProperty): number => {
    if (!hasGenerated || totalSelected === 0) return p.matchScore
    
    // Start with the base match score (which is already based on hard filters)
    let score = p.matchScore
    const { purpose, features, lifestyle, priority } = aiPrefs

    // Purpose scoring
    if (purpose.includes('Investment')) {
      if (p.isInvestment) score += 12
      else score -= 5
    }
    if (purpose.includes('Own Home')) {
      if (p.isOwnHome) score += 10
      else score -= 5
    }
    if (purpose.includes('Vacation Home')) {
      if (p.isVacationHome) score += 15
      else score -= 10
    }
    if (purpose.includes('Rental Income')) {
      if (p.isRentalIncome) score += 12
      else score -= 5
    }

    // Features scoring
    if (features.includes('Pool')) {
       if (p.hasPool) score += 10 
       else score -= 15
    }
    if (features.includes('Garden')) {
       if (p.hasGarden) score += 8
       else score -= 8
    }
    if (features.includes('Sea View')) {
       if (p.hasSeaView) score += 12
       else score -= 15
    }
    if (features.includes('Modern Kitchen')) {
       if (p.hasModernKitchen) score += 5
    }
    if (features.includes('Security')) {
       if (p.hasSecurity) score += 8
    }
    if (features.includes('Parking')) {
       if (p.parkingSpaces > 0) score += 6
       else score -= 5
    }

    // Lifestyle scoring
    if (lifestyle.includes('Urban')) {
       if (p.isUrban) score += 8
    }
    if (lifestyle.includes('Coastal')) {
       if (p.isCoastal) score += 10
       else score -= 10
    }
    if (lifestyle.includes('Suburban')) {
       if (p.isSuburban) score += 8
    }
    if (lifestyle.includes('Rural')) {
       if (p.isRural) score += 8
    }
    if (lifestyle.includes('City Center')) {
       if (p.isCityCenter) score += 10
       else score -= 5
    }

    // Priority scoring
    if (priority.includes('Near Schools')) {
       if (p.isNearSchools) score += 8
    }
    if (priority.includes('Near Beach')) {
       if (p.isNearBeach) score += 12
       else score -= 15
    }
    if (priority.includes('Quiet Area')) {
       if (p.isQuietArea) score += 10
       else score -= 8
    }
    if (priority.includes('Near Highway')) {
       if (p.isNearHighway) score += 8
    }
    if (priority.includes('Near Hospital')) {
       if (p.isNearHospital) score += 6 
    }

    return Math.max(10, Math.min(99, score))
  }

  // ── Dynamic reason generator ──────────────────────────────────────────────
  const reasonWithAI = (p: AIProperty): string => {
    if (!hasGenerated || totalSelected === 0) return p.reason
    const reasons: string[] = []
    const { purpose, features, lifestyle, priority } = aiPrefs
    
    if (purpose.includes('Investment') && p.isInvestment)
      reasons.push('Excellent investment property')
    else if (purpose.includes('Investment'))
      reasons.push('Not ideal for pure investment')
      
    if (purpose.includes('Vacation Home') && p.isVacationHome)
      reasons.push('Perfect holiday retreat')
      
    if (purpose.includes('Own Home') && p.isOwnHome)
      reasons.push('Ideal family home layout')
      
    if (purpose.includes('Rental Income') && p.isRentalIncome)
      reasons.push('Strong rental yield potential')

    if (features.includes('Sea View')) {
      if (!p.hasSeaView) reasons.push('Note: Lacks a sea view')
      else reasons.push('Beautiful coastal views')
    }
      
    if (lifestyle.includes('City Center') && p.isCityCenter)
      reasons.push('Prime central location')
      
    if (priority.includes('Near Beach')) {
      if (!p.isNearBeach) reasons.push('Note: Not located near a beach')
      else reasons.push('Minutes from the beach')
    }
    
    if (priority.includes('Quiet Area') && p.isQuietArea)
      reasons.push('Peaceful neighbourhood')

    if (reasons.length === 0) return p.reason
    return reasons.join(' · ')
  }

  // ── Scored pool (re-sorts when AI recommendations generated) ─────────────
  const scoredPool = useMemo(() => {
    return filteredPool
      .map(p => ({ ...p, _aiScore: scoreWithAI(p), _aiReason: reasonWithAI(p) }))
      .sort((a, b) => b._aiScore - a._aiScore)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredPool, propertyPool, hasGenerated])

  // Top 2 → Recommended, rest → Browse All
  const recommended = scoredPool.slice(0, 2)
  const browseAll   = scoredPool.slice(2)

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
  )?.label ?? (minBudgetM > 0 || maxBudgetM < SLIDER_MAX ? `${minBudgetM}M – ${maxBudgetM >= SLIDER_MAX ? `${SLIDER_MAX}M+` : `${maxBudgetM}M`}` : 'Budget')

  const runAIRecommendation = async () => {
    // 1. Apply current filters to URL (shows filtered results immediately)
    const params = new URLSearchParams()
    if (selectedDistricts.length > 0) params.set('districts', selectedDistricts.join(','))
    if (propertyTypeFilter !== 'All Types') params.set('type', propertyTypeFilter)
    if (BED_OPTIONS[selectedBedIndex] !== 'Any') params.set('beds', BED_OPTIONS[selectedBedIndex])
    if (minBudgetM > 0) params.set('minBudget', String(minBudgetM))
    if (maxBudgetM < SLIDER_MAX) params.set('maxBudget', String(maxBudgetM))
    if (searchQuery) params.set('query', searchQuery)
    setSearchParams(params)

    // 2. Reset AI state to trigger animation & show filtered results first
    setHasGenerated(false)
    setIsGenerating(true)
    
    // Wait for AI to "analyze"
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 3. Apply AI filter with AI questions (shows AI score and reason)
    setHasGenerated(true)
    setIsGenerating(false)
  }

  const handleGenerate = async () => {
    if (totalSelected === 0) return
    await runAIRecommendation()
  }

  return (
    <>
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

      <div className="min-h-screen bg-[#e6e0d4]" style={{ fontFamily: "'Inter', 'Outfit', sans-serif" }}>

      {/* ── Hero / Search Bar ── */}
      <section className="pt-[60px]" style={{ backgroundColor: '#345b79' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* AI Badge */}
          <div className="flex justify-center mb-4">
            <span
              className="inline-flex items-center gap-1.5 text-[10px] font-bold px-4 py-1.5 rounded-full border uppercase tracking-widest"
              style={{ color: '#d59b86', borderColor: 'rgba(213,155,134,0.4)', backgroundColor: 'rgba(213,155,134,0.12)' }}
            >
              <SparklesIcon cls="w-3 h-3" />
              AI-Powered Intelligence
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white text-center leading-tight mb-2 tracking-tight">
            Find Your Perfect Property with AI
          </h1>
          <p className="text-center text-xs mb-6 max-w-md mx-auto leading-relaxed" style={{ color: 'rgba(230,224,212,0.70)' }}>
            Search thousands of properties and receive personalised recommendations{' '}
            based on your lifestyle and goals.
          </p>

          {/* Search Box */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-3 flex flex-col sm:flex-row gap-2.5 items-stretch">
            <div className="flex-1 flex items-center gap-2 border rounded-xl px-3 py-2.5" style={{ borderColor: '#e6e0d4' }}>
              <MapPinIcon cls="w-4 h-4 flex-shrink-0 text-[#ccb7a3]" />
              <input
                id="ai-search-location"
                type="text"
                value={heroLocation}
                onChange={(e) => setHeroLocation(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleHeroSearch() }}
                placeholder="Search by city, district or property name..."
                className="w-full text-xs outline-none bg-transparent text-[#1d1d1d] placeholder:text-[#ccb7a3]"
              />
            </div>
            <div className="relative flex-shrink-0">
              <div className="flex items-center gap-1.5 border rounded-xl px-3 py-2.5 cursor-pointer h-full" style={{ borderColor: '#e6e0d4' }}>
                <svg className="w-4 h-4 text-[#ccb7a3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                <select
                  id="ai-hero-type"
                  value={propertyTypeFilter}
                  onChange={(e) => setPropertyTypeFilter(e.target.value)}
                  className="text-xs font-medium bg-transparent outline-none cursor-pointer appearance-none pr-1 h-full"
                  style={{ color: propertyTypeFilter !== 'All Types' ? '#1d1d1d' : '#928d64' }}
                >
                  <option value="All Types">Property Type</option>
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Commercial">Commercial</option>
                </select>
                <ChevronDownIcon cls="w-3.5 h-3.5 text-[#ccb7a3]" />
              </div>
            </div>
            <div className="relative flex-shrink-0">
              <div className="flex items-center gap-1.5 border rounded-xl px-3 py-2.5 cursor-pointer h-full" style={{ borderColor: '#e6e0d4' }}>
                <svg className="w-4 h-4 text-[#ccb7a3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <select
                  id="ai-hero-budget"
                  value={heroBudgetLabel}
                  onChange={(e) => {
                    const preset = BUDGET_PRESETS.find(r => r.label === e.target.value)
                    if (preset) { setMinBudgetM(preset.min); setMaxBudgetM(preset.max) }
                  }}
                  className="text-xs font-medium bg-transparent outline-none cursor-pointer appearance-none pr-1 h-full"
                  style={{ color: heroBudgetLabel !== 'Budget' ? '#1d1d1d' : '#928d64' }}
                >
                  {heroBudgetLabel !== 'Budget' && !BUDGET_PRESETS.some(r => r.label === heroBudgetLabel) && (
                    <option value={heroBudgetLabel} hidden>{heroBudgetLabel}</option>
                  )}
                  {BUDGET_PRESETS.map(r => (
                    <option key={r.label} value={r.label}>{r.label}</option>
                  ))}
                </select>
                <ChevronDownIcon cls="w-3.5 h-3.5 text-[#ccb7a3]" />
              </div>
            </div>
            <button
              id="ai-search-btn"
              onClick={handleHeroSearch}
              className="flex items-center justify-center gap-2 text-white font-bold px-6 py-2.5 rounded-xl transition-all hover:opacity-90 shadow whitespace-nowrap flex-shrink-0"
              style={{ backgroundColor: '#be5d3f' }}
            >
              <SearchIcon />
              Search
            </button>
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-center gap-5 sm:gap-10 mt-6 pb-2 flex-wrap">
            {[
              { value: `${filteredPool.length}`, label: 'Properties Matched' },
              { value: '98%',                    label: 'AI Match Accuracy' },
              { value: '340+',                   label: 'Verified Builders' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-base font-extrabold text-white">{stat.value}</p>
                <p className="text-[10px]" style={{ color: 'rgba(230,224,212,0.65)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Applied Filters Banner (only when navigated from PropertyListing) ── */}
      {hasIncomingFilters && (
        <div className="border-b" style={{ backgroundColor: '#fff', borderColor: '#e6e0d4' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: '#345b79' }}>
              <SparklesIcon cls="w-3 h-3" />
              Filters Applied:
            </span>
            {initDistricts.length > 0 && (
              <FilterChip label={`📍 ${initDistricts.join(', ')}`} onRemove={() => clearParam('districts')} />
            )}
            {initType && (
              <FilterChip label={`🏠 ${initType}`} onRemove={() => clearParam('type')} />
            )}
            {initBeds && (
              <FilterChip label={`🛏 ${initBeds} Beds`} onRemove={() => clearParam('beds')} />
            )}
            {initMinBudget > 0 && (
              <FilterChip label={`💰 Min ${initMinBudget}M`} onRemove={() => clearParam('minBudget')} />
            )}
            {initMaxBudget < 500 && (
              <FilterChip label={`💰 Max ${initMaxBudget}M`} onRemove={() => clearParam('maxBudget')} />
            )}
            {initQuery && (
              <FilterChip label={`🔍 "${initQuery}"`} onRemove={() => clearParam('query')} />
            )}
            <span className="ml-auto text-[10px] font-semibold" style={{ color: '#928d64' }}>
              {filteredPool.length} result{filteredPool.length !== 1 ? 's' : ''} found
            </span>
          </div>
        </div>
      )}

      {/* ── Main Three-Column Layout ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-5">

          {/* ── LEFT SIDEBAR: Property Filters ── */}
          <aside className="hidden lg:block w-[220px] flex-shrink-0">
            <div className="bg-white rounded-2xl shadow p-4 sticky top-[76px]">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-sm" style={{ color: '#1d1d1d' }}>Property Filters</h2>
                <button
                  className="text-[10px] font-semibold hover:opacity-80"
                  style={{ color: '#be5d3f' }}
                  onClick={() => {
                    setDistrictsAndHero([])
                    setPropertyTypeFilter('All Types')
                    setSelectedBedIndex(0)
                    setMinBudgetM(0)
                    setMaxBudgetM(SLIDER_MAX)
                    setSearchQuery('')
                    setSearchParams(new URLSearchParams())
                  }}
                >
                  Clear All
                </button>
              </div>

              {/* Location */}
              <div className="mb-4">
                <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#928d64' }}>Location</h3>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_DISTRICTS.map((d) => (
                    <button
                      key={d}
                      onClick={() => toggleDistrict(d)}
                      className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full transition-all"
                      style={
                        selectedDistricts.includes(d)
                          ? { backgroundColor: '#345b79', color: '#fff' }
                          : { backgroundColor: '#e6e0d4', color: '#928d64' }
                      }
                    >
                      {d}
                      {selectedDistricts.includes(d) && <XIcon cls="w-2.5 h-2.5" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t my-3" style={{ borderColor: '#e6e0d4' }} />

              {/* Property Type */}
              <div className="mb-4">
                <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#928d64' }}>Property Type</h3>
                <div className="space-y-1.5">
                  {PROP_TYPES.map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <div
                        className="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                        style={
                          propertyTypeFilter === type
                            ? { borderColor: '#345b79', backgroundColor: '#345b79' }
                            : { borderColor: '#ccb7a3' }
                        }
                        onClick={() => setPropertyTypeFilter(type)}
                      >
                        {propertyTypeFilter === type && <div className="w-1 h-1 rounded-full bg-white" />}
                      </div>
                      <span
                        className="text-[11px] font-medium cursor-pointer"
                        style={{ color: '#1d1d1d' }}
                        onClick={() => setPropertyTypeFilter(type)}
                      >
                        {type}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t my-3" style={{ borderColor: '#e6e0d4' }} />

              {/* Budget Range */}
              <div className="mb-4">
                <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#928d64' }}>Budget Range</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold" style={{ color: '#345b79' }}>LKR {minBudgetM}M</span>
                  <span className="text-[10px] font-semibold" style={{ color: '#345b79' }}>LKR {maxBudgetM >= SLIDER_MAX ? `${SLIDER_MAX}M+` : `${maxBudgetM}M`}</span>
                </div>
                
                {/* Dual range slider */}
                <div className="relative h-5 flex items-center mb-1">
                  {/* Track */}
                  <div className="absolute w-full h-1 rounded-full" style={{ backgroundColor: '#e6e0d4' }} />
                  {/* Active range fill */}
                  <div
                    className="absolute h-1 rounded-full pointer-events-none"
                    style={{
                      left: `${(minBudgetM / SLIDER_MAX) * 100}%`,
                      right: `${100 - (maxBudgetM / SLIDER_MAX) * 100}%`,
                      backgroundColor: '#345b79',
                    }}
                  />
                  {/* Min thumb */}
                  <input
                    id="ai-slider-min"
                    type="range"
                    min={0}
                    max={SLIDER_MAX}
                    step={5}
                    value={minBudgetM}
                    onChange={(e) => {
                      const v = Number(e.target.value)
                      if (v <= maxBudgetM) setMinBudgetM(v)
                    }}
                    className="absolute w-full h-1 appearance-none bg-transparent cursor-pointer"
                    style={{ zIndex: minBudgetM > SLIDER_MAX - 10 ? 5 : 3 }}
                  />
                  {/* Max thumb */}
                  <input
                    id="ai-slider-max"
                    type="range"
                    min={0}
                    max={SLIDER_MAX}
                    step={5}
                    value={maxBudgetM}
                    onChange={(e) => {
                      const v = Number(e.target.value)
                      if (v >= minBudgetM) setMaxBudgetM(v)
                    }}
                    className="absolute w-full h-1 appearance-none bg-transparent cursor-pointer"
                    style={{ zIndex: 4 }}
                  />
                </div>
                <p className="text-[9px]" style={{ color: '#ccb7a3' }}>LKR (in millions) · drag both ends</p>
              </div>

              <div className="border-t my-3" style={{ borderColor: '#e6e0d4' }} />

              {/* Bedrooms */}
              <div className="mb-5">
                <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#928d64' }}>Bedrooms</h3>
                <div className="flex gap-1.5 flex-wrap">
                  {BED_OPTIONS.map((b, i) => (
                    <button
                      key={b}
                      onClick={() => setSelectedBedIndex(i)}
                      className="w-7 h-7 rounded-lg text-[10px] font-semibold transition-all"
                      style={
                        selectedBedIndex === i
                          ? { backgroundColor: '#345b79', color: '#fff' }
                          : { backgroundColor: '#e6e0d4', color: '#928d64' }
                      }
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Smart Recommend (re-apply) */}
              <button
                id="ai-smart-recommend-btn"
                onClick={runAIRecommendation}
                className="w-full flex items-center justify-center gap-1.5 text-white text-xs font-bold py-2.5 rounded-xl mb-2 transition-all hover:opacity-90 shadow"
                style={{ background: 'linear-gradient(135deg, #345b79, #6b879c)' }}
              >
                <SparklesIcon />
                AI Smart Recommend
              </button>

              <button
                id="ai-apply-filters-btn"
                onClick={() => {
                  const params = new URLSearchParams()
                  if (selectedDistricts.length > 0) params.set('districts', selectedDistricts.join(','))
                  if (propertyTypeFilter !== 'All Types') params.set('type', propertyTypeFilter)
                  if (BED_OPTIONS[selectedBedIndex] !== 'Any') params.set('beds', BED_OPTIONS[selectedBedIndex])
                  if (minBudgetM > 0) params.set('minBudget', String(minBudgetM))
                  if (maxBudgetM < SLIDER_MAX) params.set('maxBudget', String(maxBudgetM))
                  if (searchQuery) params.set('query', searchQuery)
                  setSearchParams(params)
                }}
                className="w-full flex items-center justify-center gap-1.5 text-xs font-bold py-2.5 rounded-xl transition-all hover:opacity-90 border"
                style={{ color: '#345b79', borderColor: '#345b79' }}
              >
                <FilterIcon />
                Apply Filters
              </button>
            </div>

            {/* AI Market Insight mini card */}
            <div className="bg-white rounded-2xl shadow p-4 mt-4">
              <div className="flex items-center gap-1.5 mb-2">
                <SparklesIcon cls="w-3 h-3 text-[#345b79]" />
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#345b79' }}>AI Market Insight</p>
              </div>
              <p className="text-[10px] leading-relaxed" style={{ color: '#928d64' }}>
                Property values in Colombo have increased 6.2% this quarter. Your budget aligns with top investment zones.
              </p>
              <button className="mt-2 text-[10px] font-bold flex items-center gap-1 hover:gap-1.5 transition-all" style={{ color: '#be5d3f' }}>
                View related report <ArrowRightIcon />
              </button>
            </div>
          </aside>

          {/* ── CENTER ── */}
          <div className="flex-1 min-w-0 space-y-5">

            {/* ── AI Smart Preference Assistant ── */}
            <div className="bg-white rounded-2xl shadow overflow-hidden">
              <div
                className="px-5 py-3.5 flex items-center justify-between"
                style={{ background: 'linear-gradient(90deg, #345b79 0%, #6b879c 100%)' }}
              >
                <div className="flex items-center gap-2">
                  <SparklesIcon cls="w-4 h-4 text-[#d59b86]" />
                  <div>
                    <p className="text-white font-bold text-sm">AI Smart Preference Assistant</p>
                    <p className="text-[10px]" style={{ color: 'rgba(230,224,212,0.70)' }}>
                      {hasIncomingFilters
                        ? (filteredPool.length === 0 ? 'No properties match your strict filters.' : 'Showing results based on your applied filters')
                        : 'Tell us about your ideal property to get better recommendations'}
                    </p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(73,93,56,0.35)', color: '#a8c87a' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Active
                </span>
              </div>

              {/* Interactive Q&A body */}
              <div className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  {AI_QUESTIONS.map(q => (
                    <div key={q.id}>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: '#928d64' }}>
                        <span className="text-sm leading-none">{q.emoji}</span>
                        {q.label}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {q.options.map(opt => {
                          const active = aiPrefs[q.id].includes(opt)
                          return (
                            <button
                              key={opt}
                              onClick={() => togglePref(q.id, opt)}
                              className="text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all duration-150 active:scale-95"
                              style={
                                active
                                  ? { backgroundColor: '#345b79', color: '#fff', borderColor: '#345b79' }
                                  : { backgroundColor: '#f5f3f0', color: '#928d64', borderColor: '#e6e0d4' }
                              }
                            >
                              {active && '✓ '}{opt}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-[#e6e0d4] flex items-center justify-between flex-wrap gap-3">
                  <div>
                    {hasGenerated ? (
                      <p className="text-[10px] font-semibold flex items-center gap-1" style={{ color: '#495d38' }}>
                        <span>✓</span>
                        AI matched {scoredPool.length} propert{scoredPool.length !== 1 ? 'ies' : 'y'} to your preferences
                      </p>
                    ) : totalSelected > 0 ? (
                      <p className="text-[10px]" style={{ color: '#928d64' }}>
                        <span className="font-semibold" style={{ color: '#345b79' }}>{totalSelected}</span>
                        {' '}preference{totalSelected > 1 ? 's' : ''} selected — ready to generate
                      </p>
                    ) : (
                      <p className="text-[10px]" style={{ color: '#ccb7a3' }}>
                        Select your preferences above to get AI recommendations
                      </p>
                    )}
                  </div>

                  <button
                    id="ai-generate-btn"
                    onClick={handleGenerate}
                    disabled={isGenerating || totalSelected === 0}
                    className="flex items-center gap-2 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow"
                    style={{
                      background: totalSelected === 0
                        ? '#ccb7a3'
                        : 'linear-gradient(135deg, #be5d3f, #d59b86)',
                      opacity: isGenerating ? 0.85 : 1,
                      cursor: totalSelected === 0 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {isGenerating ? (
                      <>
                        {/* Spinner */}
                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Analysing preferences…
                      </>
                    ) : (
                      <>
                        <SparklesIcon />
                        {hasGenerated ? 'Re-generate Results' : 'Generate AI Smart Recommendations'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* ── Recommended For You ── */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-0.5 rounded-full inline-block" style={{ backgroundColor: '#be5d3f' }} />
                  <h2 className="font-bold text-sm" style={{ color: '#1d1d1d' }}>Recommended For You</h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: 'rgba(190,93,63,0.12)', color: '#be5d3f' }}>
                    {recommended.length} match{recommended.length !== 1 ? 'es' : ''}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px]" style={{ color: '#928d64' }}>Sort:</span>
                  <div className="flex items-center gap-1 border rounded-lg px-2.5 py-1 text-[10px] font-semibold" style={{ borderColor: '#ccb7a3', color: '#1d1d1d', backgroundColor: '#fff' }}>
                    <SortIcon /> Best Match <ChevronDownIcon cls="w-3 h-3" />
                  </div>
                </div>
              </div>

              {recommended.length > 0 ? (
                <div className="space-y-3.5">
                  {recommended.map((p) => (
                    <RecommendedCard
                      key={p.id}
                      property={p}
                      displayScore={p._aiScore}
                      displayReason={p._aiReason}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow p-10 text-center">
                  <SparklesIcon cls="w-8 h-8 mx-auto mb-3 text-[#ccb7a3]" />
                  <p className="font-semibold text-sm" style={{ color: '#1d1d1d' }}>No exact matches found</p>
                  <p className="text-xs mt-1" style={{ color: '#928d64' }}>Try relaxing your filters to see more results.</p>
                  <button
                    className="mt-4 text-xs font-bold px-5 py-2 rounded-xl text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: '#345b79' }}
                    onClick={() => {
                      setDistrictsAndHero([])
                      setPropertyTypeFilter('All Types')
                      setSelectedBedIndex(0)
                      setMinBudgetM(0)
                      setMaxBudgetM(SLIDER_MAX)
                      setSearchQuery('')
                      setSearchParams(new URLSearchParams())
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>

            {/* ── Browse All Properties ── */}
            {browseAll.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="w-5 h-0.5 rounded-full inline-block" style={{ backgroundColor: '#be5d3f' }} />
                      <h2 className="font-bold text-sm" style={{ color: '#1d1d1d' }}>Browse All Properties</h2>
                    </div>
                    <p className="text-[10px] ml-7" style={{ color: '#928d64' }}>
                      Showing {browseAll.length} more result{browseAll.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px]" style={{ color: '#928d64' }}>Sort:</span>
                    <div className="flex items-center gap-1 border rounded-lg px-2.5 py-1 text-[10px] font-semibold" style={{ borderColor: '#ccb7a3', color: '#1d1d1d', backgroundColor: '#fff' }}>
                      <SortIcon /> Nearest <ChevronDownIcon cls="w-3 h-3" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {browseAll.map((p) => <BrowseCard key={p.id} property={p} />)}
                </div>

                <div className="mt-5 flex justify-center">
                  <button
                    id="ai-load-more-btn"
                    className="flex items-center gap-2 text-xs font-bold px-8 py-3 rounded-xl border-2 transition-all hover:bg-[#345b79] hover:text-white hover:border-[#345b79]"
                    style={{ color: '#345b79', borderColor: '#345b79' }}
                  >
                    Load More Properties
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT SIDEBAR: AI Market Insights ── */}
          <aside className="hidden xl:block w-[220px] flex-shrink-0">
            <div className="bg-white rounded-2xl shadow p-4 sticky top-[76px]">
              <div className="flex items-center gap-1.5 mb-4">
                <SparklesIcon cls="w-3.5 h-3.5 text-[#345b79]" />
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#345b79' }}>AI Market Insights</p>
              </div>

              {/* Popular Locations */}
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase tracking-wider mb-2.5" style={{ color: '#928d64' }}>Popular Locations</p>
                <div className="space-y-2">
                  {marketInsights.map((insight) => (
                    <div key={insight.city} className="flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-semibold" style={{ color: '#1d1d1d' }}>{insight.city}</p>
                        <p className="text-[9px]" style={{ color: '#928d64' }}>{insight.value}</p>
                      </div>
                      <span
                        className="flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={
                          insight.trendUp
                            ? { color: '#495d38', backgroundColor: 'rgba(73,93,56,0.12)' }
                            : { color: '#be5d3f', backgroundColor: 'rgba(190,93,63,0.10)' }
                        }
                      >
                        {insight.trendUp ? <TrendUpIcon /> : <TrendDownIcon />}
                        {insight.trend}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t my-3" style={{ borderColor: '#e6e0d4' }} />

              {/* Fast Growing Areas */}
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase tracking-wider mb-2.5" style={{ color: '#928d64' }}>Fast Growing Areas</p>
                <div className="flex gap-2 text-center">
                  {[
                    { label: 'Rajagiriya', pct: '+21%', height: '70%', color: '#345b79', avg: 'LKR 42M avg' },
                    { label: 'Peliyagoda',  pct: '+19%', height: '85%', color: '#be5d3f', avg: 'LKR 38M avg' },
                  ].map(z => (
                    <div key={z.label} className="flex-1">
                      <p className="text-xs font-bold" style={{ color: z.color }}>{z.pct}</p>
                      <div className="relative mx-auto w-3 mt-1" style={{ height: '48px', backgroundColor: '#e6e0d4', borderRadius: '4px' }}>
                        <div className="absolute bottom-0 w-full rounded" style={{ height: z.height, backgroundColor: z.color, borderRadius: '4px' }} />
                      </div>
                      <p className="text-[9px] mt-1" style={{ color: '#928d64' }}>{z.label}</p>
                      <p className="text-[8px]" style={{ color: '#ccb7a3' }}>{z.avg}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[9px] mt-2 italic" style={{ color: '#928d64' }}>↑ Average price info 2025</p>
              </div>

              <div className="border-t my-3" style={{ borderColor: '#e6e0d4' }} />

              {/* Best Investment Zones */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-2.5" style={{ color: '#928d64' }}>Best Investment Zones</p>
                <div className="space-y-2.5">
                  {bestInvestmentZones.map((zone) => (
                    <div key={zone.name}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[10px] font-semibold" style={{ color: '#1d1d1d' }}>{zone.name}</p>
                        <p className="text-[9px]" style={{ color: '#928d64' }}>{zone.avgPrice}</p>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ backgroundColor: '#e6e0d4' }}>
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: zone.barWidth, backgroundColor: zone.color }} />
                      </div>
                    </div>
                  ))}
                  <p className="text-[8px]" style={{ color: '#928d64' }}>↑ Average price info 2025</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-10" style={{ backgroundColor: '#345b79' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1" style={{ color: '#d59b86' }}>
                <SparklesIcon cls="w-3 h-3" />
                AI-Powered Matching
              </p>
              <h2 className="text-2xl font-extrabold text-white leading-tight mb-2">
                {filteredPool.length > 2
                  ? `${filteredPool.length - 2} More Properties Match Your Profile`
                  : '20 More Properties Match Your Profile'}
              </h2>
              <p className="text-xs leading-relaxed max-w-md" style={{ color: 'rgba(230,224,212,0.70)' }}>
                Expand your criteria to unlock even more personalised matches from across Sri Lanka.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0 w-full sm:w-auto">
              <button
                id="ai-cta-view-matches-btn"
                onClick={() => navigate('/property-ai-recommended')}
                className="flex items-center gap-2 text-white font-bold px-6 py-3 rounded-xl transition-all hover:opacity-90 shadow"
                style={{ backgroundColor: '#be5d3f' }}
              >
                View AI Matches
              </button>
              <button
                id="ai-cta-refine-btn"
                className="flex items-center gap-2 font-bold px-6 py-3 rounded-xl border-2 transition-all hover:bg-white/10"
                style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}
              >
                Refine Preferences
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        </div>
      </section>

      </div>


    </>
  )
}
