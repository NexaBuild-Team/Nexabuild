import { useState, useEffect, useMemo, lazy, Suspense } from 'react'
import { useNavigate } from 'react-router'
import { getAllLands } from '../services/landApi'
import type { Land } from '../types/land'

const SriLankaLandMap = lazy(() => import('../components/SriLankaLandMap'))

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const SparklesIcon = ({ cls = 'w-3.5 h-3.5' }: { cls?: string }) => (
  <svg className={cls} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
  </svg>
)
const FilterIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
)

function getRoadAccessWidth(land: Land): string {
  const desc = (land.description || '').toLowerCase()
  const name = land.name.toLowerCase()

  if (desc.includes('40ft') || desc.includes('40-foot') || name.includes('malabe')) return '20+ Feet'
  if (desc.includes('30ft') || desc.includes('30-foot') || desc.includes('container') || name.includes('kaduwela') || name.includes('negombo')) return '20+ Feet'
  if (desc.includes('20ft') || desc.includes('20-foot') || name.includes('colombo') || name.includes('galle')) return '20+ Feet'
  if (desc.includes('15ft') || desc.includes('15-foot') || name.includes('battaramulla') || name.includes('kurunegala')) return '15–20 Feet'
  if (desc.includes('12ft') || desc.includes('12-foot') || name.includes('kandy')) return '12–15 Feet'

  return '< 12 Feet'
}

const SRI_LANKA_DISTRICTS = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 
  'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara', 
  'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar', 
  'Matale', 'Matara', 'Moneragala', 'Mullaitivu', 'Nuwara Eliya', 
  'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
]

export default function LandListing() {
  const navigate = useNavigate()
  const [lands, setLands] = useState<Land[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedType, setSelectedType] = useState('all')
  const [appliedType, setAppliedType] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [savedCards, setSavedCards] = useState<string[]>([])
  const [activeLocation, setActiveLocation] = useState('Any')
  const [appliedLocation, setAppliedLocation] = useState('Any')
  const [activeRoadAccess, setActiveRoadAccess] = useState('Any')
  const [appliedRoadAccess, setAppliedRoadAccess] = useState('Any')
  const [priceMax, setPriceMax] = useState(150)
  const [appliedPriceMax, setAppliedPriceMax] = useState(150)
  const [sortBy, setSortBy] = useState('Most Relevant')
  const [searchText, setSearchText] = useState('')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const [searchLocation, setSearchLocation] = useState(() => {
    return localStorage.getItem('nexabuild_land_filter_location') || 'Any'
  })
  const [searchType, setSearchType] = useState(() => {
    return localStorage.getItem('nexabuild_land_filter_type') || 'all'
  })
  const [searchBudget, setSearchBudget] = useState(() => {
    const savedPriceMax = localStorage.getItem('nexabuild_land_filter_pricemax')
    if (savedPriceMax === '10') return 'Under LKR 10M'
    if (savedPriceMax === '30') return 'LKR 10M - 30M'
    if (savedPriceMax === '60') return 'LKR 30M - 60M'
    if (savedPriceMax === '100') return 'LKR 60M - 100M'
    if (savedPriceMax === '150') return 'LKR 100M - 150M'
    return 'Any Budget'
  })

  const handleHeroSearch = () => {
    setActiveLocation(searchLocation)
    setAppliedLocation(searchLocation)
    setSelectedType(searchType)
    setAppliedType(searchType)
    
    let maxVal = 150
    if (searchBudget === 'Under LKR 10M') maxVal = 10
    else if (searchBudget === 'LKR 10M - 30M') maxVal = 30
    else if (searchBudget === 'LKR 30M - 60M') maxVal = 60
    else if (searchBudget === 'LKR 60M - 100M') maxVal = 100
    else if (searchBudget === 'LKR 100M - 150M') maxVal = 150
    
    setPriceMax(maxVal)
    setAppliedPriceMax(maxVal)
    localStorage.setItem('nexabuild_land_filter_pricemax', String(maxVal))
    localStorage.setItem('nexabuild_land_filter_location', searchLocation)
    localStorage.setItem('nexabuild_land_filter_type', searchType)
    setSearchText('')

    const target = document.getElementById('listings-section')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }
  const [aiAnalyzing] = useState(false)
  const [aiStepText] = useState('')
  const [aiProgress] = useState(0)

  useEffect(() => {
    getAllLands()
      .then(data => { setLands(data); setLoading(false) })
      .catch(() => { setError('Failed to load land listings. Please try again later.'); setLoading(false) })
  }, [])

  const toggleSave = (id: string) => {
    setSavedCards(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const handleClearAll = () => {
    setSelectedType('all')
    setAppliedType('all')
    setActiveLocation('Any')
    setAppliedLocation('Any')
    setActiveRoadAccess('Any')
    setAppliedRoadAccess('Any')
    setPriceMax(150)
    setAppliedPriceMax(150)
    setSearchText('')
  }

  const handleAISmartRecommend = () => {
    localStorage.setItem('nexabuild_land_filter_location', activeLocation || 'Any')
    localStorage.setItem('nexabuild_land_filter_type', selectedType || 'all')
    localStorage.setItem('nexabuild_land_filter_pricemax', String(priceMax))
    localStorage.setItem('nexabuild_land_pref_road_access', activeRoadAccess || 'Any')
    if (selectedType && selectedType !== 'all') {
      const typePurposeMap: Record<string, string> = {
        residential: 'Build Home',
        commercial: 'Commercial Project',
        agricultural: 'Agriculture',
        tourism: 'Investment',
        industrial: 'Commercial Project',
      }
      if (typePurposeMap[selectedType]) {
        localStorage.setItem('nexabuild_land_pref_purpose', typePurposeMap[selectedType])
      }
    }
    navigate('/land/ai-recommendations')
  }

  const filteredLands = useMemo(() => {
    let filtered = [...lands]

    // Search query
    if (searchText.trim() !== '') {
      const q = searchText.toLowerCase()
      filtered = filtered.filter(l =>
        l.name.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q) ||
        (l.description || '').toLowerCase().includes(q)
      )
    }

    // Locations (only filter if non-default location is selected)
    if (appliedLocation && appliedLocation !== 'Any') {
      filtered = filtered.filter(l => l.location.toLowerCase().includes(appliedLocation.toLowerCase()))
    }

    // Land Types
    if (appliedType && appliedType !== 'all') {
      filtered = filtered.filter(l => l.landType.toLowerCase() === appliedType.toLowerCase())
    }

    // Road Access
    if (appliedRoadAccess && appliedRoadAccess !== 'Any') {
      filtered = filtered.filter(l => getRoadAccessWidth(l) === appliedRoadAccess)
    }

    // Max Price
    if (appliedPriceMax) {
      filtered = filtered.filter(l => (l.price / 1_000_000) <= appliedPriceMax)
    }

    // Sort
    if (sortBy === 'Price: Low to High') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'Price: High to Low') {
      filtered.sort((a, b) => b.price - a.price)
    }

    return filtered
  }, [lands, searchText, appliedLocation, appliedType, appliedPriceMax, appliedRoadAccess, sortBy])

  // Pagination Constants & Logic
  const ITEMS_PER_PAGE = 9

  // Reset page to 1 when filter states change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchText, appliedLocation, appliedType, appliedPriceMax, appliedRoadAccess, sortBy])

  const paginatedLands = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredLands.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredLands, currentPage])

  const totalPages = Math.ceil(filteredLands.length / ITEMS_PER_PAGE) || 1

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)
      if (currentPage <= 2) {
        end = 4
      } else if (currentPage >= totalPages - 1) {
        start = totalPages - 3
      }
      if (start > 2) {
        pages.push('ellipsis-start')
      }
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      if (end < totalPages - 1) {
        pages.push('ellipsis-end')
      }
      pages.push(totalPages)
    }
    return pages
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    const target = document.getElementById('listings-section')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div style={{ backgroundColor: '#e6e0d4', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Hero Section ── */}
      <section className="pt-[60px]" style={{ backgroundColor: '#345b79' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          {/* AI Badge */}
          <div className="flex justify-center mb-5">
            <span
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-full border"
              style={{ color: '#d59b86', borderColor: 'rgba(213,155,134,0.4)', backgroundColor: 'rgba(213,155,134,0.12)' }}
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
              </svg>
              AI-Powered Intelligence
            </span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold text-white text-center leading-tight mb-8 tracking-tight">Find Your Perfect Land with AI</h1>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-3 flex flex-col sm:flex-row gap-3 items-stretch">
            {/* Location Dropdown */}
            <div className="flex-1 flex items-center gap-2.5 border rounded-xl px-3 py-2.5" style={{ borderColor: '#e6e0d4' }}>
              <svg className="w-4 h-4 flex-shrink-0 text-[#ccb7a3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <select
                id="land-search-location"
                value={searchLocation}
                onChange={e => setSearchLocation(e.target.value)}
                className="w-full text-sm font-medium bg-transparent outline-none cursor-pointer appearance-none pr-6 text-[#928d64]"
              >
                <option value="Any">All Districts</option>
                {SRI_LANKA_DISTRICTS.map(dist => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
              <svg className="w-4 h-4 text-[#ccb7a3] pointer-events-none -ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Land Type Dropdown */}
            <div className="relative flex-shrink-0">
              <div className="flex items-center gap-1.5 border rounded-xl px-3 py-2.5" style={{ borderColor: '#e6e0d4' }}>
                <svg className="w-4 h-4 text-[#ccb7a3] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
                <select
                  id="land-type-select"
                  value={searchType}
                  onChange={e => setSearchType(e.target.value)}
                  className="text-sm font-medium bg-transparent outline-none cursor-pointer appearance-none pr-6 text-[#928d64]"
                >
                  <option value="all">All Types</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="agricultural">Agricultural</option>
                  <option value="industrial">Industrial</option>
                </select>
                <svg className="w-4 h-4 text-[#ccb7a3] pointer-events-none -ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Budget Dropdown */}
            <div className="relative flex-shrink-0">
              <div className="flex items-center gap-1.5 border rounded-xl px-3 py-2.5" style={{ borderColor: '#e6e0d4' }}>
                <svg className="w-4 h-4 text-[#ccb7a3] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <select
                  id="land-budget-select"
                  value={searchBudget}
                  onChange={e => setSearchBudget(e.target.value)}
                  className="text-sm font-medium bg-transparent outline-none cursor-pointer appearance-none pr-6 text-[#928d64]"
                >
                  <option value="Any Budget">Any Budget</option>
                  <option value="Under LKR 10M">Under LKR 10M</option>
                  <option value="LKR 10M - 30M">LKR 10M - 30M</option>
                  <option value="LKR 30M - 60M">LKR 30M - 60M</option>
                  <option value="LKR 60M - 100M">LKR 60M - 100M</option>
                  <option value="LKR 100M - 150M">LKR 100M - 150M</option>
                </select>
                <svg className="w-4 h-4 text-[#ccb7a3] pointer-events-none -ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Search Button */}
            <button
              id="land-search-btn"
              onClick={handleHeroSearch}
              className="flex items-center justify-center gap-2 text-white font-bold px-6 py-2.5 rounded-xl transition-all duration-200 hover:opacity-90 shadow whitespace-nowrap flex-shrink-0 active:scale-95 cursor-pointer w-full sm:w-auto"
              style={{ backgroundColor: '#be5d3f' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>
          </div>

          {/* Stats */}
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

      {/* ── Main Content ── */}
      <section id="listings-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile filters toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl text-white"
            style={{ backgroundColor: '#345b79' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {mobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <div className="flex gap-6">
          {/* ── Left Sidebar Filters ── */}
          <aside className={`${mobileFiltersOpen ? 'block' : 'hidden'} lg:block w-full lg:w-[240px] flex-shrink-0`}>
            {/* Filters Card */}
            <div className="bg-white rounded-2xl shadow p-4 sticky top-[76px] border border-slate-100">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-sm" style={{ color: '#1d1d1d' }}>Land Filters</h2>
                <button
                  id="clear-all-btn"
                  onClick={handleClearAll}
                  className="text-[10px] font-semibold hover:opacity-80 transition-opacity"
                  style={{ color: '#be5d3f' }}
                >
                  Clear All
                </button>
              </div>

              {/* Location */}
              <div className="mb-4">
                <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#928d64' }}>Location</h3>
                <select
                  id="filter-district-input"
                  value={activeLocation === 'Any' ? '' : activeLocation}
                  onChange={(e) => setActiveLocation(e.target.value || 'Any')}
                  className="w-full border rounded-lg px-2 py-1.5 text-[10px] outline-none mb-2"
                  style={{ borderColor: '#e6e0d4', color: '#1d1d1d', backgroundColor: '#f9f7f4' }}
                >
                  <option value="">All Districts</option>
                  {SRI_LANKA_DISTRICTS.map(dist => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>

                {/* Location pill chips */}
                <div className="flex flex-wrap gap-1.5">
                  {['Colombo', 'Kandy', 'Galle'].map(loc => (
                    <button
                      key={loc}
                      id={`loc-chip-${loc.toLowerCase()}`}
                      onClick={() => setActiveLocation(loc)}
                      className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full transition-all duration-150 cursor-pointer"
                      style={
                        activeLocation === loc
                          ? { backgroundColor: '#345b79', color: '#fff' }
                          : { backgroundColor: '#e6e0d4', color: '#928d64' }
                      }
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t my-3" style={{ borderColor: '#e6e0d4' }} />

              {/* Land Type */}
              <div className="mb-4">
                <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#928d64' }}>Land Type</h3>
                <div className="space-y-1.5">
                  {[
                    { label: 'All Types', val: 'all' },
                    { label: 'Residential', val: 'residential' },
                    { label: 'Commercial', val: 'commercial' },
                    { label: 'Agricultural', val: 'agricultural' },
                    { label: 'Industrial', val: 'industrial' },
                  ].map(item => (
                    <label key={item.val} className="flex items-center gap-2 cursor-pointer group">
                      <div
                        className="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                        style={
                          selectedType === item.val
                            ? { borderColor: '#345b79', backgroundColor: '#345b79' }
                            : { borderColor: '#ccb7a3' }
                        }
                        onClick={() => setSelectedType(item.val)}
                      >
                        {selectedType === item.val && (
                          <div className="w-1 h-1 rounded-full bg-white" />
                        )}
                      </div>
                      <span
                        className="text-[11px] font-medium"
                        style={{ color: '#1d1d1d' }}
                        onClick={() => setSelectedType(item.val)}
                      >
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t my-3" style={{ borderColor: '#e6e0d4' }} />

              {/* Price Range */}
              <div className="mb-4">
                <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#928d64' }}>Budget Range</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold" style={{ color: '#345b79' }}>LKR 5M</span>
                  <span className="text-[10px] font-semibold" style={{ color: '#345b79' }}>LKR 150M</span>
                </div>
                <div className="relative h-5 flex items-center">
                  <div className="absolute w-full h-1.5 rounded-full" style={{ backgroundColor: '#e6e0d4' }} />
                  <div
                    className="absolute h-1.5 rounded-full pointer-events-none"
                    style={{ left: '0%', right: '0%', backgroundColor: '#345b79' }}
                  />
                  <input
                    id="ll-slider-price"
                    type="range"
                    min={5} max={150} step={5} value={priceMax}
                    onChange={e => setPriceMax(Number(e.target.value))}
                    className="absolute w-full h-1.5 appearance-none bg-transparent cursor-pointer"
                    style={{ accentColor: '#345b79' }}
                  />
                </div>
                <p className="text-[9px] mt-1.5 flex justify-between" style={{ color: '#ccb7a3' }}>
                  <span>Up to LKR {priceMax}M</span>
                  <span>drag to filter</span>
                </p>
              </div>

              {/* Divider */}
              <div className="border-t my-3" style={{ borderColor: '#e6e0d4' }} />

              {/* Road Access Width */}
              <div className="mb-4">
                <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#928d64' }}>Road Access</h3>
                <div className="flex gap-1.5 flex-wrap">
                  {['Any', '< 12 Feet', '12–15 Feet', '15–20 Feet', '20+ Feet'].map(width => (
                    <button
                      key={width}
                      id={`road-access-btn-${width.replace(/[^a-z0-9]/gi, '')}`}
                      onClick={() => setActiveRoadAccess(width)}
                      className="px-2.5 h-7 rounded-lg text-[10px] font-semibold transition-all duration-150 cursor-pointer"
                      style={
                        activeRoadAccess === width
                          ? { backgroundColor: '#345b79', color: '#fff' }
                          : { backgroundColor: '#e6e0d4', color: '#928d64' }
                      }
                    >
                      {width}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Smart Recommend */}
              <button
                id="ai-smart-recommend-btn"
                onClick={handleAISmartRecommend}
                className="w-full flex items-center justify-center gap-1.5 text-white text-[11px] font-bold py-2.5 rounded-xl mb-2 transition-all hover:opacity-90 shadow cursor-pointer active:scale-95"
                style={{ background: 'linear-gradient(135deg, #345b79, #6b879c)' }}
              >
                <SparklesIcon />
                AI Smart Recommend
              </button>

              {/* Apply Filters */}
              <button
                id="apply-filters-btn"
                onClick={() => {
                  setAppliedType(selectedType)
                  setAppliedLocation(activeLocation)
                  setAppliedRoadAccess(activeRoadAccess)
                  setAppliedPriceMax(priceMax)
                  setMobileFiltersOpen(false)
                }}
                className="w-full flex items-center justify-center gap-1.5 text-[11px] font-bold py-2.5 rounded-xl transition-all hover:opacity-90 border cursor-pointer active:scale-95"
                style={{ color: '#345b79', borderColor: '#345b79', backgroundColor: 'transparent' }}
              >
                <FilterIcon />
                Apply Filters
              </button>
            </div>
          </aside>

          {/* ── Property Listings Grid ── */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: '#1d1d1d' }}>
                {loading ? 'Loading...' : `${filteredLands.length} land parcels found`}
              </h2>
              <div className="flex items-center gap-2 text-sm">
                <span style={{ color: '#928d64' }}>Sort by:</span>
                <select
                  id="sort-select"
                  className="bg-transparent font-bold outline-none text-sm"
                  style={{ color: '#1d1d1d' }}
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                >
                  <option>Most Relevant</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Loading / Error States */}
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <div key={n} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                    <div className="h-48 bg-gray-200" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="text-center py-16">
                <p className="text-sm font-semibold" style={{ color: '#be5d3f' }}>{error}</p>
              </div>
            )}

            {/* Cards Grid */}
            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedLands.map(parcel => (
                  <article
                    key={parcel.id}
                    id={`land-card-${parcel.id}`}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer group"
                    onClick={() => navigate(`/land/detail/${parcel.id}`)}
                  >
                    {/* Image */}
                    <div className="h-48 overflow-hidden relative">
                      {parcel.images[0] ? (
                        <img
                          alt={parcel.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          src={parcel.images[0]}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#e6e0d4' }}>
                          <span className="text-sm" style={{ color: '#928d64' }}>No image</span>
                        </div>
                      )}
                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span
                          className="text-white text-[10px] font-bold px-2 py-1 rounded"
                          style={{ backgroundColor: '#be5d3f' }}
                        >
                          {parcel.status}
                        </span>
                      </div>
                      {/* Save Button */}
                      <button
                        className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white transition-all"
                        style={{ backgroundColor: 'rgba(255,255,255,0.20)', backdropFilter: 'blur(4px)' }}
                        onClick={e => { e.stopPropagation(); toggleSave(parcel.id) }}
                        aria-label="Save property"
                      >
                        {savedCards.includes(parcel.id) ? '♥' : '♡'}
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="font-bold text-lg mb-1" style={{ color: '#be5d3f' }}>
                        LKR {parcel.price.toLocaleString()}
                      </div>
                      <h3 className="font-bold mb-1" style={{ color: '#1d1d1d' }}>{parcel.name}</h3>
                      <p className="text-xs mb-4 flex items-center gap-1" style={{ color: '#928d64' }}>
                        {parcel.location}
                      </p>
                      <div className="flex items-center gap-4 text-xs pt-4 border-t border-gray-100 flex-wrap" style={{ color: '#6b879c' }}>
                        <span className="flex items-center gap-1">⬛ {parcel.perches} perches</span>
                        {parcel.sqft && <span className="flex items-center gap-1">⤢ {parcel.sqft} sqft</span>}
                        <span className="flex items-center gap-1">🛣 {getRoadAccessWidth(parcel)} Road</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center border border-gray-200 bg-white hover:bg-gray-50 transition-colors ${
                    currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  ‹
                </button>
                {getPageNumbers().map((p, idx) => {
                  if (p === 'ellipsis-start' || p === 'ellipsis-end') {
                    return (
                      <span key={`ellipsis-${idx}`} className="px-2" style={{ color: '#928d64' }}>
                        ...
                      </span>
                    )
                  }
                  return (
                    <button
                      key={`page-${p}`}
                      id={`page-btn-${p}`}
                      onClick={() => handlePageChange(Number(p))}
                      className="w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-all cursor-pointer"
                      style={currentPage === p
                        ? { backgroundColor: '#345b79', color: '#fff' }
                        : { backgroundColor: '#fff', border: '1px solid #e5e7eb', color: '#1d1d1d' }
                      }
                    >
                      {p}
                    </button>
                  )
                })}
                <button
                  onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center border border-gray-200 bg-white hover:bg-gray-50 transition-colors ${
                    currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Map View Section ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        {/* Section header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-0.5 rounded-full inline-block" style={{ backgroundColor: '#be5d3f' }} />
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#be5d3f' }}>MAP VIEW</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: '#1d1d1d' }}>
              Explore Land Parcels on Map
            </h2>
          </div>
          <button
            id="open-fullmap-btn"
            className="hidden sm:flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl text-white transition-all hover:opacity-90 shadow"
            style={{ backgroundColor: '#345b79' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Open Full Map
          </button>
        </div>

        {/* Map container */}
        <div className="relative rounded-2xl overflow-hidden shadow-xl" style={{ height: '480px' }}>
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center" style={{ background: '#e6e0d4' }}>
              <p className="text-sm font-semibold" style={{ color: '#928d64' }}>Loading map…</p>
            </div>
          }>
            <SriLankaLandMap />
          </Suspense>

          {/* Overlay: NexaBuild branding badge */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md border border-white/60 pointer-events-none" style={{ zIndex: 1000 }}>
            <p className="font-bold text-sm" style={{ color: '#345b79' }}>NexaBuild</p>
            <p className="text-xs" style={{ color: '#928d64' }}>Land Parcels · Sri Lanka</p>
          </div>

          {/* Overlay: Legend */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 pointer-events-none" style={{ zIndex: 1000 }}>
            <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow border border-white/60">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#be5d3f' }} />
              <span className="text-xs font-medium" style={{ color: '#1d1d1d' }}>For Sale</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow border border-white/60">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#495d38' }} />
              <span className="text-xs font-medium" style={{ color: '#1d1d1d' }}>Agricultural</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow border border-white/60">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#928d64' }} />
              <span className="text-xs font-medium" style={{ color: '#1d1d1d' }}>Premium</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI Processing Modal Overlay ── */}
      {aiAnalyzing && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center space-y-4 border border-slate-100">
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white text-2xl shadow-lg animate-pulse" style={{ background: 'linear-gradient(135deg, #345b79, #be5d3f)' }}>
              ✦
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-1">Nexa AI Engine Active</h3>
              <p className="text-xs text-slate-600 font-medium">{aiStepText}</p>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${aiProgress}%`, backgroundColor: '#be5d3f' }}
              />
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Matching parameters against Sri Lanka land database...</p>
          </div>
        </div>
      )}

    </div>
  )
}
