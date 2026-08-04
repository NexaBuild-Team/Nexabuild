# Source Code for Land Module Pages

This document compiles the complete, clean source code for the following Land Module pages:
* [LandListing.tsx](file:///c:/Users/Ganindu/Nexabuild/frontend/src/pages/LandListing.tsx)
* [LandDetail.tsx](file:///c:/Users/Ganindu/Nexabuild/frontend/src/pages/LandDetail.tsx)
* [AIRecommendationsList.tsx](file:///c:/Users/Ganindu/Nexabuild/frontend/src/pages/AIRecommendationsList.tsx)
* [AIRecommendations.tsx](file:///c:/Users/Ganindu/Nexabuild/frontend/src/pages/AIRecommendations.tsx)

All line number annotations have been removed so the code is ready for copy-pasting or file backups.

---

## 1. LandListing.tsx
```tsx
import { useState, lazy, Suspense } from 'react'
import { useNavigate } from 'react-router'

const SriLankaLandMap = lazy(() => import('../components/SriLankaLandMap'))

// ─── Land parcel data ────────────────────────────────────────────────────────
const landParcels = [
  {
    id: 1,
    price: 'LKR 28,500,000',
    name: 'Prime Residential Land, Colombo 5',
    location: 'Colombo 5, Western Province',
    perches: '15 Perches',
    sqft: '3,600 sqft',
    status: 'For Sale',
    badge: null,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDUnjs4HgWEu4qNcKTxly28yrWx6r40aNpzLEmiYE4Z5p_Gr9DphZX0jLA-iIE7162pSfOh4hdBUeInbYe570xkeND5GJs7nTD79SD3m2OHR5Ry1K-MGp8P0XYukqxt4gldXPVyjOMpNmewVgHYkoISz32Co2TpR-_XoPNy7gd_U9idips4QK9R_0lcnQFvX_5sTDoqvxiaE03bE8AKAMCykZfaIed8vG_sBh6gN28-Ah4dZsZNAElyWUJKf5Fd_UZohCh5dqlUrEg',
  },
  {
    id: 2,
    price: 'LKR 12,000,000',
    name: 'Scenic Land Parcel, Kandy',
    location: 'Kandy, Central Province',
    perches: '20 Perches',
    sqft: '4,800 sqft',
    status: 'For Sale',
    badge: 'AI Pick',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRZRZkxxz2VyvXW8ObJnYxlXFTps_oZX30jOhNygHqLKzYn8J_DSyY6S90hgP0nx_1XhTe16DSaJORxbGJ7xZ8rg-KmWXjCXTCxeIUJj2YcdDayhz6aYZZ2-0yya7NvyO-qXDgBBuFltsGQ-v0tu3GXVreqwTxz1KrSbFYx_WkNsZNb-StW7SGoBqnfsrLKE_n5sMmRhnZC3mLxJDBCAYrhI4B38EaAjmxjETevg-Y42xfHPIouTTcrT5XHIE-oMrHYP5KabFJykw',
  },
  {
    id: 4,
    price: 'LKR 75,000,000',
    name: 'Beachfront Land, Galle Fort',
    location: 'Galle Fort, Southern Province',
    perches: '40 Perches',
    sqft: '9,600 sqft',
    status: 'For Sale',
    badge: 'Premium',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCw_IHOEQrBk8u_UV8cHMd_kLsQuBvgeBtbqHbTO74gjnIOfvqtwqqYBlqxPa9cR1kxrZtxx4ALjnrd-kHi89degp58ryI0MGafHewNp4KWxz-gJ02P1bXf-_BwMmAMm_xUWRC2-NZYov6CMVXF2vBC4TNrgv44lcmm0zYgvuLTk3mTl2t19AsSdAlZXeGIHVtMbi3iZaST5wNQ6F2LQMrbucfRE4MgL6eNj4cccWotMQK4sYSc7oGbL8tZglz-NNNhnE9TeTiAhT8',
  },
  {
    id: 7,
    price: 'LKR 18,000,000',
    name: 'Road Frontage Land, Negombo',
    location: 'Negombo, Western Province',
    perches: '12 Perches',
    sqft: null,
    status: 'For Sale',
    badge: null,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUzHm0uxsFvqvUY8TU5K-eURSeYC0zH0EQrQg1jQdXaGcls0R0ENl5yf8vmJLfdId1XuUd0k7Wn__Qb6bod9CuGxy7YyFlWAVyWqe6B_pzUh-Ext8IuEB2SlNkwG8kmne4h3uFv_6nXtQprL1KrmJots_MJdfNzU8DFi2RH07yFrKU2w4oWZfNFkAyqf3stALBybP-8bHIl-sPp9zkYacQw3WXGKNYJBkrrkLmwS9r_1zOJi8jgFgfWCq6zTBQX8pMT-sqDCwtu4I',
  },
  {
    id: 5,
    price: 'LKR 6,800,000',
    name: 'Coconut Estate, Kurunegala',
    location: 'Kurunegala, North Western',
    perches: '1 Acre',
    sqft: null,
    status: 'For Sale',
    badge: null,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrCkajKEkt1AinXQFyqNavQeWq7Ba415sKR4xIHWfIjLshKrp5KqVIz1QvxVCUzPnoDpuWN-Rg2XH8WCQUPXXy_JWh3p_7mMGg9k5aFyQpqzeHnZ9k4Yx6S6q-3_d-QP7feMDtl8iAgDn2_dQP0ZwE4r8RbigRtZL03Embazo_SjQp4C7Dm4BZ3KVCjU1suKde2setwoz_WsXpiyii8ALAhf05_psNBduhLHq90eDpa9XR1ZKDWcC54ZRov3Ur1SsoYvHyIszOT4M',
  },
  {
    id: 6,
    price: 'LKR 55,000,000',
    name: 'Lakefront Land, Colombo 10',
    location: 'Colombo 10, Western Province',
    perches: '30 Perches',
    sqft: null,
    status: 'For Sale',
    badge: null,
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATIpFizwFtC7GLjpaiT0udAxkuI7GN6NKRkHzn0LAJxMupOj6AoqjsMrGzxgs2jPLRS7q3aKjusDSIE2J7lSC8yKVaLCSIHNpzKbp7aQ-namroH5rwgsyIt8mL0Kp4sTzVNPwCHKcIlHT7UmsrZjOxMh__8QQhCS8HH4PUu9QwJKp2SRbhawE4JvmT5MXpmzurlpiPD0ct3CLO3ZSAB40HoOgg09jihUKfdGG5wdQi3puWaAAqqNOqtaXqi_EAXWCORBWLsUP93Q0',
  },
]

export default function LandListing() {
  const navigate = useNavigate()
  const [selectedType, setSelectedType] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [savedCards, setSavedCards] = useState<number[]>([])
  const [activeLocation, setActiveLocation] = useState('Colombo')
  const [activeSize, setActiveSize] = useState('Any')
  const [sortBy, setSortBy] = useState('Most Relevant')
  const [searchText, setSearchText] = useState('')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const toggleSave = (id: number) => {
    setSavedCards(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const handleClearAll = () => {
    setSelectedType('all')
    setActiveLocation('Colombo')
    setActiveSize('Any')
    setSearchText('')
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

          <h1 className="text-4xl lg:text-5xl font-extrabold text-white text-center leading-tight mb-3 tracking-tight">Find Your Perfect Land with AI</h1>
          <p className="text-center text-sm mb-8 max-w-md mx-auto leading-relaxed" style={{ color: 'rgba(230,224,212,0.70)' }}>
            Search thousands of lands and receive personalized recommendations based on your lifestyle and goals.
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-3 flex flex-col sm:flex-row gap-3 items-stretch">
            {/* Location input */}
            <div className="flex-1 flex items-center gap-2.5 border rounded-xl px-3 py-2.5" style={{ borderColor: '#e6e0d4' }}>
              <svg className="w-4 h-4 flex-shrink-0 text-[#ccb7a3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input
                id="land-search-input"
                type="text"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && undefined}
                placeholder="Search by city, district or land name..."
                className="w-full text-sm outline-none bg-transparent text-[#1d1d1d] placeholder:text-[#ccb7a3]"
              />
            </div>

            {/* Land Type */}
            <div className="relative flex-shrink-0">
              <div className="flex items-center gap-1.5 border rounded-xl px-3 py-2.5" style={{ borderColor: '#e6e0d4' }}>
                <svg className="w-4 h-4 text-[#ccb7a3] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
                <select
                  id="land-type-select"
                  className="text-sm font-medium bg-transparent outline-none cursor-pointer appearance-none pr-1"
                  style={{ color: '#928d64' }}
                >
                  <option>Land Type</option>
                  <option>Residential</option>
                  <option>Commercial</option>
                  <option>Agricultural</option>
                </select>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Budget */}
            <div className="relative flex-shrink-0">
              <div className="flex items-center gap-1.5 border rounded-xl px-3 py-2.5" style={{ borderColor: '#e6e0d4' }}>
                <svg className="w-4 h-4 text-[#ccb7a3] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <select
                  id="land-budget-select"
                  className="text-sm font-medium bg-transparent outline-none cursor-pointer appearance-none pr-1"
                  style={{ color: '#928d64' }}
                >
                  <option>Budget</option>
                  <option>LKR 5M - 10M</option>
                  <option>LKR 10M - 50M</option>
                  <option>Above LKR 50M</option>
                </select>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Search Button */}
            <button
              id="land-search-btn"
              className="flex items-center justify-center gap-2 text-white font-bold px-6 py-2.5 rounded-xl transition-all duration-200 hover:opacity-90 shadow whitespace-nowrap flex-shrink-0 active:scale-95"
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
              { value: '98%',     label: 'AI Match Accuracy' },
              { value: '340+',    label: 'Verified Builders'  },
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <div className="bg-white rounded-2xl shadow p-5 sticky top-[76px] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-sm" style={{ color: '#1d1d1d' }}>Land Filters</h2>
                <button
                  id="clear-all-btn"
                  onClick={handleClearAll}
                  className="text-xs font-semibold hover:opacity-80 transition-opacity"
                  style={{ color: '#be5d3f' }}
                >
                  Clear All
                </button>
              </div>

              {/* Location */}
              <div className="mb-5">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#928d64' }}>Location</h3>
                <select
                  id="filter-district-input"
                  value={activeLocation === 'Colombo' ? '' : activeLocation}
                  onChange={(e) => setActiveLocation(e.target.value || 'Colombo')}
                  className="w-full border rounded-lg px-3 py-2 text-xs outline-none mb-3"
                  style={{
                    borderColor: '#e6e0d4',
                    color: '#928d64',
                    backgroundColor: '#f9f7f4',
                  }}
                >
                  <option value="">Select District...</option>
                  <option value="Colombo">Colombo</option>
                  <option value="Kandy">Kandy</option>
                  <option value="Galle">Galle</option>
                </select>

                {/* Location pill chips */}
                <div className="flex flex-wrap gap-1.5">
                  {['Colombo', 'Kandy', 'Galle'].map(loc => (
                    <button
                      key={loc}
                      id={`loc-chip-${loc.toLowerCase()}`}
                      onClick={() => setActiveLocation(loc)}
                      className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full transition-all duration-150"
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
              <div className="border-t my-4" style={{ borderColor: '#e6e0d4' }} />

              {/* Land Type */}
              <div className="mb-5">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#928d64' }}>Land Type</h3>
                <div className="space-y-2">
                  {[
                    { label: 'All Types',    val: 'all'          },
                    { label: 'Residential',  val: 'residential'  },
                    { label: 'Commercial',   val: 'commercial'   },
                    { label: 'Agricultural', val: 'agricultural' },
                    { label: 'Industrial',   val: 'industrial'   },
                  ].map(item => (
                    <label key={item.val} className="flex items-center gap-2.5 cursor-pointer group">
                      <div
                        className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                        style={
                          selectedType === item.val
                            ? { borderColor: '#345b79', backgroundColor: '#345b79' }
                            : { borderColor: '#ccb7a3' }
                        }
                        onClick={() => setSelectedType(item.val)}
                      >
                        {selectedType === item.val && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <span
                        className="text-xs font-medium"
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
              <div className="border-t my-4" style={{ borderColor: '#e6e0d4' }} />

              {/* Price Range */}
              <div className="mb-5">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#928d64' }}>Price Range</h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold" style={{ color: '#345b79' }}>LKR 5M</span>
                  <span className="text-[11px] font-semibold" style={{ color: '#345b79' }}>LKR 150M</span>
                </div>
                {/* Slider track */}
                <div className="relative h-6 flex items-center">
                  <div className="absolute w-full h-1.5 rounded-full" style={{ backgroundColor: '#e6e0d4' }} />
                  <div
                    className="absolute h-1.5 rounded-full pointer-events-none"
                    style={{ left: '0%', right: '0%', backgroundColor: '#345b79' }}
                  />
                  <input
                    id="ll-slider-price"
                    type="range"
                    min={5} max={150} step={5} defaultValue={150}
                    className="absolute w-full h-1.5 appearance-none bg-transparent cursor-pointer"
                    style={{ accentColor: '#345b79' }}
                  />
                </div>
                <p className="text-[10px] mt-2" style={{ color: '#ccb7a3' }}>LKR (in millions) · drag to filter</p>
              </div>

              {/* Divider */}
              <div className="border-t my-4" style={{ borderColor: '#e6e0d4' }} />

              {/* Land Size */}
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#928d64' }}>Land Size</h3>
                <div className="flex gap-1.5 flex-wrap">
                  {['Any', '< 10P', '10–20P', '> 1 Acre'].map(size => (
                    <button
                      key={size}
                      id={`size-btn-${size.replace(/[^a-z0-9]/gi,'')}`}
                      onClick={() => setActiveSize(size)}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
                      style={
                        activeSize === size
                          ? { backgroundColor: '#345b79', color: '#fff' }
                          : { backgroundColor: '#e6e0d4', color: '#928d64' }
                      }
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Smart Recommend */}
              <button
                id="ai-smart-recommend-btn"
                onClick={() => navigate('/land/ai-recommendations')}
                className="w-full flex items-center justify-center gap-2 text-white text-sm font-bold py-3 rounded-xl mb-2.5 transition-all hover:opacity-90 shadow active:scale-95"
                style={{ background: 'linear-gradient(135deg, #345b79, #6b879c)' }}
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                </svg>
                 AI Smart Recommend
              </button>

              {/* Apply Filters */}
              <button
                id="apply-filters-btn"
                className="w-full flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-xl transition-all hover:opacity-90 border"
                style={{ color: '#345b79', borderColor: '#345b79', backgroundColor: 'transparent' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                 Apply Filters
              </button>
            </div>
          </aside>

        {/* ── Property Listings Grid ── */}
        <div className="flex-1">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: '#1d1d1d' }}>
              <span style={{ color: '#be5d3f' }}></span> 184 land parcels found
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
                <option>Latest</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {landParcels.map(parcel => (
              <article
                key={parcel.id}
                id={`land-card-${parcel.id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => navigate(`/land/detail/${parcel.id}`)}
              >
                {/* Image */}
                <div className="h-48 overflow-hidden relative">
                  <img
                    alt={parcel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src={parcel.img}
                  />
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span
                      className="text-white text-[10px] font-bold px-2 py-1 rounded"
                      style={{ backgroundColor: '#be5d3f' }}
                    >
                      {parcel.status}
                    </span>
                    {parcel.badge === 'AI Pick' && (
                      <span
                        className="text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1"
                        style={{ backgroundColor: '#345b79' }}
                      >
                        ✦ AI Pick
                      </span>
                    )}
                    {parcel.badge === 'Premium' && (
                      <span
                        className="text-white text-[10px] font-bold px-2 py-1 rounded"
                        style={{ backgroundColor: '#928d64' }}
                      >
                        Premium
                      </span>
                    )}
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
                  <div className="font-bold text-lg mb-1" style={{ color: '#be5d3f' }}>{parcel.price}</div>
                  <h3 className="font-bold mb-1" style={{ color: '#1d1d1d' }}>{parcel.name}</h3>
                  <p className="text-xs mb-4 flex items-center gap-1" style={{ color: '#928d64' }}>
                     {parcel.location}
                  </p>
                  <div className="flex items-center gap-4 text-xs pt-4 border-t border-gray-100" style={{ color: '#6b879c' }}>
                    <span className="flex items-center gap-1">⬛ {parcel.perches}</span>
                    {parcel.sqft && <span className="flex items-center gap-1">⤢ {parcel.sqft}</span>}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center items-center gap-2">
            <button className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-200 bg-white hover:bg-gray-50">
              ‹
            </button>
            {[1, 2, 3].map(p => (
              <button
                key={p}
                id={`page-btn-${p}`}
                onClick={() => setCurrentPage(p)}
                className="w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-all"
                style={currentPage === p
                  ? { backgroundColor: '#345b79', color: '#fff' }
                  : { backgroundColor: '#fff', border: '1px solid #e5e7eb', color: '#1d1d1d' }
                }
              >
                {p}
              </button>
            ))}
            <span className="px-2" style={{ color: '#928d64' }}>...</span>
            <button
              className="w-10 h-10 rounded-lg flex items-center justify-center font-bold bg-white border border-gray-200 hover:bg-gray-50"
              style={{ color: '#1d1d1d' }}
            >
              8
            </button>
            <button className="w-10 h-10 rounded-lg flex items-center justify-center border border-gray-200 bg-white hover:bg-gray-50">
              ›
            </button>
          </div>
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
          {/* React-Leaflet map — CARTO Voyager tiles, centered on Sri Lanka */}
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

    </div>
  )
}
```

---

## 2. LandDetail.tsx
```tsx
import { useState, useEffect, lazy, Suspense } from 'react'
import { useParams, useNavigate, Link } from 'react-router'

const PropertyLocationMap = lazy(() => import('../components/PropertyLocationMap'))

// ─── Icons ────────────────────────────────────────────────────────────────────
const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg className="w-4 h-4" fill={filled ? '#be5d3f' : 'none'} stroke={filled ? '#be5d3f' : 'currentColor'} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
)

function MatchScoreRing({ score }: { score: number }) {
  const circumference = 163.36
  const dash = (score / 100) * circumference

  return (
    <div className="relative w-20 h-20 mx-auto">
      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="5" />
        <circle
          cx="32" cy="32" r="26" fill="none"
          stroke="#ffffff" strokeWidth="5"
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xl font-extrabold text-white">
        {score}%
      </span>
    </div>
  )
}


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
  mapCenter: [number, number]
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
    mapCenter: [6.8939, 79.8650] as [number, number],
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
    imgMain: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80',
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
    mapCenter: [7.2906, 80.6337] as [number, number],
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
    mapCenter: [6.9497, 80.7891] as [number, number],
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
    mapCenter: [6.0535, 80.2210] as [number, number],
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
    mapCenter: [7.4863, 80.3623] as [number, number],
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
    mapCenter: [6.9220, 79.8570] as [number, number],
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
    mapCenter: [7.2095, 79.8368] as [number, number],
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
  const [agentSaved, setAgentSaved] = useState(false)
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

              {/* NexaBuild / land type label */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider text-white"
                  style={{ backgroundColor: '#345b79' }}
                >
                  {land.type}
                </span>
                <span className="text-xs text-slate-400 font-medium">{land.location}</span>
              </div>

              {/* Live Leaflet map */}
              <div className="w-full rounded-xl overflow-hidden border border-slate-200" style={{ height: '320px' }}>
                <Suspense
                  fallback={
                    <div
                      className="w-full h-full flex items-center justify-center text-sm font-semibold"
                      style={{ backgroundColor: '#e6e0d4', color: '#928d64' }}
                    >
                      Loading map…
                    </div>
                  }
                >
                  <PropertyLocationMap center={land.mapCenter} />
                </Suspense>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#345b79' }} />
                  <span className="text-[11px] font-medium text-slate-500">Land Location</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-3 h-3" fill="none" stroke="#928d64" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-[11px] font-medium text-slate-500">Exact pin on parcel</span>
                </div>
              </div>
            </section>
          </div>

          {/* ── SIDEBAR ── */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-sm p-5 space-y-3">
              <button
                id="save-land-btn"
                onClick={() => setSaved(!saved)}
                className="w-full flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-xl border-2 transition-all hover:bg-[#be5d3f]/5 cursor-pointer"
                style={{ color: '#be5d3f', borderColor: '#be5d3f' }}
              >
                <HeartIcon filled={saved} />
                Save Land
              </button>
              <button
                id="share-land-btn"
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                className="w-full flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-xl transition-all hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: '#ccb7a3', color: '#1d1d1d' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share This Land
              </button>
            </div>

            {/* AI Match Score */}
            <div className="rounded-2xl shadow-sm p-6 text-center" style={{ backgroundColor: '#345b79' }}>
              <MatchScoreRing score={land.matchScore} />
              <p className="text-white font-bold text-sm mt-3">AI Match Score</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(230,224,212,0.75)' }}>Based on your preferences</p>
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
                className="w-full text-sm font-bold py-3 rounded-xl text-white mb-2 transition-all hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: '#345b79' }}
              >
                Contact Agent
              </button>
              <button
                id="save-agent-land-btn"
                onClick={() => setAgentSaved(!agentSaved)}
                className="w-full flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-xl border-2 transition-all hover:bg-[#be5d3f]/5 cursor-pointer"
                style={{ color: '#be5d3f', borderColor: '#be5d3f' }}
              >
                <HeartIcon filled={agentSaved} />
                Save Land
              </button>

              <div
                className="mt-4 text-center text-xs font-bold text-white py-2 rounded-lg"
                style={{ backgroundColor: '#345b79' }}
              >
                AI Match Score {land.matchScore}%
              </div>
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
                      id={`view-details-btn-${s.id}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/land/detail/${s.id}`)
                      }}
                      className="w-full py-2 text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all cursor-pointer"
                      style={{ backgroundColor: '#345b79' }}
                    >
                      View Details
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
```

---

## 3. AIRecommendationsList.tsx
```tsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router'

// ─── Data ─────────────────────────────────────────────────────────────────────
const matchStats = [
  { label: 'Budget Match', sub: 'Within range', pct: 96, iconColor: '#345b79', iconBg: '#eff6ff' },
  { label: 'Location Match', sub: 'Colombo & Kandy', pct: 94, iconColor: '#be5d3f', iconBg: '#fff7f5' },
  { label: 'Type Match', sub: 'Villa, House', pct: 88, iconColor: '#495d38', iconBg: '#f0fdf4' },
  { label: 'Lifestyle Match', sub: 'Schools nearby', pct: 82, iconColor: '#928d64', iconBg: '#fefce8' },
]

const recommendedCards = [
  {
    id: 1,
    rank: '#1 AI Top Pick',
    rankBg: '#be5d3f',
    rankColor: '#fff',
    price: 'LKR 28,500,000',
    name: 'Prime Residential Land, Colombo 5',
    location: 'Colombo 5, Western Province',
    perches: '15 Perches',
    sqft: '3,600 sqft',
    type: 'Residential',
    match: 96,
    matchColor: '#495d38',
    matchBorder: '#16a34a',
    img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
    aiCardBg: '#fff7f5',
    aiBorder: '#fed7aa',
    aiTitleColor: '#be5d3f',
    reasons: [
      'Matches your preferred Colombo area and falls within your LKR 20M—50M budget.',
      'The 15-perch plot aligns perfectly with your preferred land size for residential development.',
    ],
    badges: ['Budget Match', 'Preferred Location', 'Right Plot Size'],
  },
  {
    id: 2,
    rank: '#2 AI Recommended',
    rankBg: '#e6e0d4',
    rankColor: '#be5d3f',
    price: 'LKR 12,000,000',
    name: 'Scenic Land Parcel, Kandy',
    location: 'Kandy, Central Province',
    perches: '20 Perches',
    sqft: '4,800 sqft',
    type: 'Residential',
    match: 88,
    matchColor: '#345b79',
    matchBorder: '#ccb7a3',
    img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop&q=80',
    aiCardBg: '#f8f8f8',
    aiBorder: '#e5e7eb',
    aiTitleColor: '#1d1d1d',
    reasons: [
      'Within your budget and located in the hill country area you indicated interest in.',
      'Larger land size offers great value for investment or development.',
    ],
    badges: ['Within Budget', 'Hill Country', 'Investment Potential'],
  },
]

export default function AIRecommendationsList() {
  const navigate = useNavigate()
  const [activeLocations, setActiveLocations] = useState(['Colombo', 'Kandy'])
  const [checkedTypes, setCheckedTypes] = useState(['Villa', 'House'])
  const [savedCards, setSavedCards] = useState<number[]>([])
  const [budgetMin, setBudgetMin] = useState('20M')
  const [budgetMax, setBudgetMax] = useState('100M')
  const [sortBy, setSortBy] = useState('Best Match')

  const toggleLocation = (loc: string) => {
    setActiveLocations(prev =>
      prev.includes(loc) ? prev.filter(l => l !== loc) : [...prev, loc]
    )
  }

  const toggleType = (type: string) => {
    setCheckedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  const toggleSave = (id: number) => {
    setSavedCards(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  return (
    <div style={{ backgroundColor: '#e6e0d4', fontFamily: 'Inter, sans-serif' }}>
      
      {/* ── Main Content ── */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* ── Breadcrumb ── */}
        <nav aria-label="Breadcrumb" className="flex text-xs mb-8" style={{ color: '#928d64' }}>
          <ol className="flex items-center space-x-2">
            <li><Link to="/" className="hover:underline" style={{ color: '#928d64' }}>Home</Link></li>
            <li><span className="mx-1">›</span></li>
            <li className="font-semibold" style={{ color: '#345b79' }}>AI Recommendations</li>
          </ol>
        </nav>

        {/* ── Header & Stats ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end mb-10">
          <div className="lg:col-span-2">
            <div className="flex items-center font-bold text-xs uppercase tracking-widest mb-2" style={{ color: '#be5d3f' }}>
              <span className="mr-2">✦</span> AI-Powered Intelligence
            </div>
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#1d1d1d' }}>Your AI Land Matches</h1>
            <p className="max-w-2xl" style={{ color: '#928d64' }}>
              Personalized recommendations based on your preferences, budget and lifestyle — updated in real-time.
            </p>
          </div>

          {/* Stats Box */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200" style={{ backgroundColor: 'rgba(255,255,255,0.50)' }}>
            <div className="text-center px-4">
              <div className="text-2xl font-bold" style={{ color: '#1d1d1d' }}>98%</div>
              <div className="text-[10px] uppercase font-bold tracking-tighter" style={{ color: '#928d64' }}>Top Match Score</div>
            </div>
            <div className="h-10 w-px bg-gray-300"></div>
            <div className="text-center px-4">
              <div className="text-2xl font-bold" style={{ color: '#1d1d1d' }}>24</div>
              <div className="text-[10px] uppercase font-bold tracking-tighter" style={{ color: '#928d64' }}>Properties Found</div>
            </div>
            <div className="h-10 w-px bg-gray-300"></div>
            <div className="text-center px-4">
              <div className="text-2xl font-bold" style={{ color: '#1d1d1d' }}>&lt; 2 min</div>
              <div className="text-[10px] uppercase font-bold tracking-tighter" style={{ color: '#928d64' }}>Analysis Time</div>
            </div>
          </div>
        </div>

        {/* ── Match Categories Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {matchStats.map(stat => (
            <div key={stat.label} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-lg" style={{ backgroundColor: stat.iconBg, color: stat.iconColor }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div className="text-2xl font-bold" style={{ color: '#1d1d1d' }}>{stat.pct}%</div>
              </div>
              <div className="text-sm font-bold text-gray-800">{stat.label}</div>
              <div className="text-xs text-gray-500 mb-3">{stat.sub}</div>
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${stat.pct}%`, backgroundColor: '#345b79' }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Sidebar & List ── */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* ── Sidebar Filter ── */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900">Property Filters</h3>
                <button className="text-xs font-semibold" style={{ color: '#345b79' }}>Edit</button>
              </div>

              {/* Locations */}
              <div className="mb-6">
                <label className="block text-[10px] uppercase font-bold mb-3 tracking-wide flex items-center" style={{ color: '#928d64' }}>
                  Preferred Locations
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Colombo', 'Kandy', 'Galle', 'Negombo'].map(loc => (
                    <button
                      key={loc}
                      onClick={() => toggleLocation(loc)}
                      className="px-3 py-1 text-xs rounded-full transition-colors"
                      style={activeLocations.includes(loc)
                        ? { backgroundColor: '#345b79', color: '#fff' }
                        : { backgroundColor: '#e6e0d4', color: '#1d1d1d' }
                      }
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Type */}
              <div className="mb-6">
                <label className="block text-[10px] uppercase font-bold mb-3 tracking-wide flex items-center" style={{ color: '#928d64' }}>
                  Property Type
                </label>
                <div className="space-y-2">
                  {['Villa', 'House', 'Apartment', 'Land'].map(type => (
                    <label key={type} className="flex items-center text-xs font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checkedTypes.includes(type)}
                        onChange={() => toggleType(type)}
                        className="rounded mr-2"
                        style={{ accentColor: '#345b79' }}
                      />
                      <span style={{ color: checkedTypes.includes(type) ? '#1d1d1d' : '#928d64' }}>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div className="mb-8">
                <label className="block text-[10px] uppercase font-bold mb-3 tracking-wide flex items-center" style={{ color: '#928d64' }}>
                  Budget Range
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    className="w-full text-[10px] border-gray-200 rounded p-1 text-center outline-none"
                    type="text"
                    value={`LKR ${budgetMin}`}
                    onChange={e => setBudgetMin(e.target.value.replace('LKR ', ''))}
                  />
                  <span className="text-gray-400">—</span>
                  <input
                    className="w-full text-[10px] border-gray-300 rounded p-1 text-center outline-none"
                    type="text"
                    value={`LKR ${budgetMax}`}
                    onChange={e => setBudgetMax(e.target.value.replace('LKR ', ''))}
                  />
                </div>
                <div className="mt-4 px-2">
                  <input className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer" type="range" style={{ accentColor: '#345b79' }} />
                </div>
              </div>

              <button className="w-full py-3 text-white text-xs font-bold rounded-lg flex items-center justify-center transition-colors" style={{ backgroundColor: '#345b79' }}>
                Re-run AI Analysis
              </button>
            </div>

            {/* AI Market Insight Card */}
            <div className="p-6 rounded-xl text-white shadow-lg overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #345b79 0%, #1d1d1d 100%)' }}>
              <div className="relative z-10">
                <div className="flex items-center text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#d59b86' }}>
                  AI Market Insight
                </div>
                <p className="text-sm leading-relaxed mb-6" style={{ color: '#e6e0d4' }}>
                  Property values in Colombo 7 have increased 12% this quarter. Your preferred budget aligns with 94 available listings.
                </p>
                <button className="w-full py-2 bg-white/10 border border-white/20 text-xs font-semibold rounded-md hover:bg-white/20 transition flex items-center justify-center">
                  Best time to buy: Now 
                </button>
              </div>
              <div className="absolute -bottom-8 -right-8 opacity-10 w-32 h-32 rounded-full" style={{ backgroundColor: '#fff' }}></div>
            </div>
          </aside>

          {/* ── Main Recommended List ── */}
          <section className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-gray-900">Top Recommended Properties</h2>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="text-xs font-bold text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded shadow-sm outline-none cursor-pointer"
                >
                  <option>Best Match</option>
                  <option>Price: Low to High</option>
                  <option>Latest</option>
                </select>
            </div>

            <div className="space-y-6">
              {recommendedCards.map((card, idx) => (
                <div
                  key={card.id}
                  onClick={() => navigate(`/land/detail/${card.id}`)}
                  className="bg-white rounded-xl overflow-hidden border border-gray-200 flex flex-col md:flex-row shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="w-full md:w-80 h-64 md:h-auto relative overflow-hidden flex-shrink-0">
                    <img alt={card.name} className="w-full h-full object-cover object-top" src={card.img} />
                    <div className="absolute top-3 left-3 flex space-x-2">
                      <span className="bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase" style={{ backgroundColor: '#be5d3f' }}>For Sale</span>
                      <span className="text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase flex items-center" style={{ backgroundColor: '#345b79' }}>
                        AI Pick
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-black/50 text-white text-[10px] px-2 py-0.5 rounded font-bold backdrop-blur-sm">#{idx + 1}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <div className="text-xl font-bold" style={{ color: '#be5d3f' }}>{card.price}</div>
                        <div className="text-right">
                          <div className="text-2xl font-bold" style={{ color: '#345b79' }}>{card.match}%</div>
                          <div className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Match</div>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{card.name}</h3>
                      <div className="flex items-center text-xs text-gray-500 mb-4">
                        <span className="mr-1">📍</span> {card.location}
                      </div>
                      
                      <div className="flex space-x-4 text-xs text-gray-700 font-medium mb-6">
                        <span className="flex items-center">⬛ {card.perches}</span>
                        <span className="flex items-center">⤢ {card.sqft}</span>
                      </div>

                      {/* AI Reasoning box */}
                      <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: '#345b79' }}></div>
                        <div className="flex items-start">
                          <div className="mr-2 mt-0.5" style={{ color: '#345b79' }}>✦</div>
                          <div>
                            <div className="text-[10px] font-bold uppercase mb-1" style={{ color: '#345b79' }}>Why AI Recommends This</div>
                            <p className="text-[10px] leading-relaxed text-gray-600 mb-2">
                              {card.reasons.join(' ')}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {card.badges.map(b => (
                                <span key={b} className="text-[8px] font-bold uppercase px-1.5 py-0.5 bg-white border border-gray-200 text-gray-500 rounded">{b}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-4" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => toggleSave(card.id)}
                        className="flex-1 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded hover:bg-gray-50 flex items-center justify-center gap-1"
                      >
                        {savedCards.includes(card.id) ? '❤️ Saved' : '🤍 Save'}
                      </button>
                      <button
                        onClick={() => navigate(`/land/detail/${card.id}`)}
                        className="flex-1 py-2 text-xs font-bold text-white rounded transition-colors"
                        style={{ backgroundColor: '#345b79' }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-center pt-8">
                <button className="px-8 py-3 border border-gray-300 rounded-full text-xs font-bold text-gray-600 hover:bg-white hover:shadow-md transition">
                  + Load More Properties
                </button>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}
```

---

## 4. AIRecommendations.tsx
```tsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router'

// ─── Data ─────────────────────────────────────────────────────────────────────
const matchStats = [
  { label: 'Budget Match', sub: 'Within range', pct: 96, iconColor: '#345b79', iconBg: '#eff6ff' },
  { label: 'Location Match', sub: 'Colombo & Kandy', pct: 94, iconColor: '#be5d3f', iconBg: '#fff7f5' },
  { label: 'Type Match', sub: 'Villa, House', pct: 88, iconColor: '#495d38', iconBg: '#f0fdf4' },
  { label: 'Lifestyle Match', sub: 'Schools nearby', pct: 82, iconColor: '#928d64', iconBg: '#fefce8' },
]

const recommendedCards = [
  {
    id: 2,
    rank: '#1 AI Top Pick',
    rankBg: '#be5d3f',
    rankColor: '#fff',
    price: 'LKR 28,000,000',
    name: 'Prime Scenic Land, Kandy',
    location: 'Kandy, Central Province',
    perches: '32 Perches',
    type: 'Residential',
    match: 96,
    matchColor: '#495d38',
    matchBorder: '#16a34a',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0_yreVOeA98FTvakxVXWV7D49hRgIkIMM-3BHaOKcltqHmdDX8FOvPYo6jnFt0dR27cBQrxM5XIK-wbSJNOjOkNVoQqD53yb1HEgxqInZD9jyo5pqO8VoSCMc-1oSW-LCRxjlOwHJA7b22YTErEb7QBSiVN7JBCpWjRM0kb-xIV7Ypw6_kpbrA_gRlU8APLmSIo_MN4zujhg_W15CNKMSIE8rqKYG0AWM4w9OvHOjuKR_ksDjMvGvv9Lkkg8CKill5cnNN8SAJ7Z-',
    aiCardBg: '#fff7f5',
    aiBorder: '#fed7aa',
    aiTitleColor: '#be5d3f',
    reasons: ['Matches your investment goals', 'High appreciation area', 'Scenic location preference matched', 'Future infrastructure nearby'],
  },
  {
    id: 7,
    rank: '#2 AI Recommended',
    rankBg: '#e6e0d4',
    rankColor: '#be5d3f',
    price: 'LKR 54,000,000',
    name: 'Beach Access Land, Negombo',
    location: 'Negombo, Western Province',
    perches: '48 Perches',
    type: 'Tourism / Holiday',
    match: 91,
    matchColor: '#345b79',
    matchBorder: '#ccb7a3',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLfPfYILuGATdsTpc_hxdG3Uosjl-6j0M0K3gJx0gtcHt4wU-QaZ_fnRNcDSBhix-HYlvH-i7ovDHhph9Cp-4tGDD0-aGwXFCOZFMm5JBKTNAmea3HbxFCaYPzt-ckHYxJq4CaMRKMSS_BfV5un8raD4fQms93AUMRpj33_8Fg5wUCT8P1kCLVo2xpa4GfqeKNTyBSBwa_gUsMREVxlLowVh63uGE5fJVAU_QHz_aYIw_5lGQKJJP_AHd8ZDuirIoSaCdZp_cchUPq',
    aiCardBg: '#f8f8f8',
    aiBorder: '#e5e7eb',
    aiTitleColor: '#1d1d1d',
    reasons: ['Beach area preference matched', 'Strong tourism investment return', 'Within your selected budget range', 'Near major transport links'],
  },
]

const browseCards = [
  {
    id: 3,
    price: 'LKR 45,000,000',
    name: 'Scenic Land, Nuwara Eliya',
    location: 'Nuwara Eliya, CP',
    perches: '60 Perches',
    type: 'Residential',
    statusLabel: 'For Sale',
    statusBg: '#345b79',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8uZGeUO9M78J2KKv9gSYxMKjb_r2w7gdCMCIdhEHswOpN_NJ24Dd5SgEsgqqjXI-8EMnyvVCTvUtkg1k3D-HqVetrvD2U_KGWAnNmgcwnaYqELurGAtmeqt0NUHdycvx-Mo8zYcnQqTZcaG55iyFWvr_nOGuXvRpRhGq9c-fEtkRuWZbG7rLM7aKaOJXLNs1DcSUt--sysvhZZCgVATMtEOOacnsXGjmn4_RzmWWHGjcmOtbLpLC-C7bn9s2GniJqtdt-MvW0ievc',
  },
  {
    id: 4,
    price: 'LKR 62,000,000',
    name: 'Coastal Plot, Galle',
    location: 'Galle, Southern Province',
    perches: '35 Perches',
    type: 'Tourism',
    statusLabel: 'Premium',
    statusBg: '#be5d3f',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2XZvsEFP3vlBX3wfzZWxKWkcE4RYJ0eP8_Whb_qS8-0OkVBBGAbB5VJFwEu5FbETDfWA87ICnGNZ9r_VmiNTlv3eM1oyBPkZpWBWKRecVdloW5g0pysXXj4k8tyE_Go1Lw-iZFPrchT0Qo0LoOAdyhJ4M1Nto9BdXlzH27rIPQmCRHmWLB22zWDWRh4KsTZZbNDFJPdTxhLv3diOhQ3oAd2J-__V_vCSvg7U6jjenmgJtDW63E5kfbpFLuzYpYUYHyL0ijaNJiNYp',
  },
  {
    id: 5,
    price: 'LKR 8,500,000',
    name: 'Agricultural Land, Kurunegala',
    location: 'Kurunegala, NW Province',
    perches: '2 Acres',
    type: 'Agricultural',
    statusLabel: 'For Sale',
    statusBg: '#345b79',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2FL7orOhukkiKHnMZlFzj2whYvnswQgNoC9FzihSwv8-mGBQhlkfZz3AIajvSqaltLYprGVq-cu8fftl0FgQszWtKbugoLIzHF6oc7FuWEqbCJ62d7Mr0tqUzVUq0bdXqR4HU9Q9UHURci9-OaImJ6ztjcRnyN3TyEKG7z4qYkVrEgHFic_VUukQ6jCNa5zliAab8_QS93uQew7nuFHZvLUQNH8R5DM4xTbeF5QtscD4PiTu5wMBydOD8Lm5AiVjIYSQg-5Doekoe',
  },
]

export default function AIRecommendations() {
  const navigate = useNavigate()

  // ── Preference Assistant State ──────────────────────────────────────────────
  const [selectedPurpose, setSelectedPurpose] = useState('Investment')
  const [selectedFamily, setSelectedFamily] = useState('3-5')
  const [selectedEnvironment, setSelectedEnvironment] = useState('Scenic Area')
  const [selectedFuturePlan, setSelectedFuturePlan] = useState('Long-Term Investment')
  const [activeLocations, setActiveLocations] = useState(['Colombo', 'Kandy'])
  const [checkedTypes, setCheckedTypes] = useState(['Villa', 'House'])
  const [savedCards, setSavedCards] = useState<number[]>([])
  const [bookmarked, setBookmarked] = useState<number[]>([])
  const [sortBy, setSortBy] = useState('Best Match')
  const [searchText, setSearchText] = useState('')
  const [budgetMin, setBudgetMin] = useState('5M')
  const [budgetMax, setBudgetMax] = useState('150M')

  const toggleLocation = (loc: string) => {
    setActiveLocations(prev =>
      prev.includes(loc) ? prev.filter(l => l !== loc) : [...prev, loc]
    )
  }

  const toggleType = (type: string) => {
    setCheckedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  const handleViewAllMatches = () => {
    navigate('/land/ai-recommendations/list')
  }

  return (
    <div style={{ backgroundColor: '#e6e0d4', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Hero Section ── */}
      <section className="pt-[60px] pb-16 px-6 text-white" style={{ backgroundColor: '#345b79' }}>
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider"
            style={{ backgroundColor: 'rgba(190,93,63,0.80)' }}
          >
            <span>✦ AI-Powered Intelligence</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Find Your Perfect Land with AI</h1>
          <p className="text-slate-200 text-lg max-w-2xl mx-auto">
            Search thousands of lands and receive personalized recommendations based on your lifestyle and goals.
          </p>

          {/* Search Bar */}
          <div
            className="rounded-xl shadow-2xl p-2 flex flex-col md:flex-row items-center gap-2 mt-8"
            style={{ backgroundColor: '#fff', color: '#1d1d1d' }}
          >
            <div className="flex-1 w-full flex items-center px-4 gap-3 border-r border-slate-100">
              <span className="text-gray-400 text-sm">📍</span>
              <input
                id="ai-search-input"
                className="w-full text-sm py-4 outline-none bg-transparent"
                placeholder="Search by city, district or land name..."
                type="text"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && undefined}
              />
            </div>
            <div className="flex-1 w-full flex items-center px-4 gap-3 border-r border-slate-100">
              <span className="text-[10px] font-bold uppercase w-20" style={{ color: '#928d64' }}>Land Type</span>
              <select
                className="w-full text-sm py-4 font-medium outline-none bg-transparent"
              >
                <option>All Types</option>
                <option>Residential</option>
                <option>Agricultural</option>
              </select>
            </div>
            <div className="flex-1 w-full flex items-center px-4 gap-3">
              <span className="text-[10px] font-bold uppercase w-20" style={{ color: '#928d64' }}>Budget</span>
              <select
                className="w-full text-sm py-4 font-medium outline-none bg-transparent"
              >
                <option>Any Budget</option>
                <option>LKR 10M - 50M</option>
                <option>LKR 50M+</option>
              </select>
            </div>
            <button
              id="hero-search-btn"
              onClick={() => undefined}
              className="text-white px-8 py-4 rounded-lg font-bold flex items-center gap-2 hover:opacity-90 w-full md:w-auto justify-center transition-opacity"
              style={{ backgroundColor: '#be5d3f' }}
            >
              🔍 Search
            </button>
          </div>

          {/* Stats */}
          <div className="pt-4 flex justify-center items-center gap-12 text-slate-300 text-sm">
            <div><span className="text-white font-bold">24,000+</span> Properties Listed</div>
            <div><span className="text-white font-bold">98%</span> AI Match Accuracy</div>
            <div><span className="text-white font-bold">340+</span> Verified Builders</div>
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* ── Breadcrumb ── */}
        <nav className="flex text-xs mb-8" style={{ color: '#928d64' }}>
          <ol className="flex items-center gap-2">
            <li><Link to="/" className="hover:underline" style={{ color: '#928d64' }}>Home</Link></li>
            <li>›</li>
            <li className="font-semibold" style={{ color: '#345b79' }}>AI Recommendations</li>
          </ol>
        </nav>

        {/* ── Header + Overall Stats ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end mb-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#be5d3f' }}>
              ✦ AI-Powered Intelligence
            </div>
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#1d1d1d' }}>Your AI Land Matches</h1>
            <p className="max-w-2xl" style={{ color: '#928d64' }}>
              Personalized recommendations based on your preferences, budget and lifestyle — updated in real-time.
            </p>
          </div>
          {/* Stats Summary */}
          <div
            className="flex items-center justify-between p-4 rounded-xl border border-gray-200"
            style={{ backgroundColor: 'rgba(255,255,255,0.50)' }}
          >
            {[
              { val: '98%', label: 'Top Match Score' },
              { val: '24', label: 'Properties Found' },
              { val: '< 2 min', label: 'Analysis Time' },
            ].map((s, i) => (
              <div key={s.label} className={`text-center px-4 ${i < 2 ? 'border-r border-gray-300' : ''}`}>
                <div className="text-2xl font-bold" style={{ color: '#1d1d1d' }}>{s.val}</div>
                <div className="text-[10px] uppercase font-bold tracking-tighter" style={{ color: '#928d64' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Match Category Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {matchStats.map(stat => (
            <div
              key={stat.label}
              className="bg-white p-5 rounded-xl border border-gray-100"
              style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-lg" style={{ backgroundColor: stat.iconBg, color: stat.iconColor }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div className="text-2xl font-bold" style={{ color: '#1d1d1d' }}>{stat.pct}%</div>
              </div>
              <div className="text-sm font-bold mb-1" style={{ color: '#1d1d1d' }}>{stat.label}</div>
              <div className="text-xs mb-3" style={{ color: '#928d64' }}>{stat.sub}</div>
              <div className="h-1 rounded-full" style={{ backgroundColor: '#e5e7eb' }}>
                <div className="h-full rounded-full" style={{ width: `${stat.pct}%`, backgroundColor: '#345b79' }} />
              </div>
            </div>
          ))}
        </div>

        {/* ── Three-Column Layout ── */}
        <div className="grid grid-cols-12 gap-8">

          {/* ── LEFT SIDEBAR ── */}
          <aside className="col-span-12 lg:col-span-3 space-y-6">
            {/* Filters Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold" style={{ color: '#1d1d1d' }}>Property Filters</h3>
                <button
                  id="filter-edit-btn"
                  onClick={() => undefined}
                  className="text-xs font-semibold"
                  style={{ color: '#345b79' }}
                >
                  Edit
                </button>
              </div>

              {/* Location */}
              <div className="mb-6">
                <label className="block text-[10px] uppercase font-bold mb-3 tracking-wide" style={{ color: '#928d64' }}>
                  📍 Preferred Locations
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Colombo', 'Kandy', 'Galle', 'Negombo'].map(loc => (
                    <button
                      key={loc}
                      id={`loc-${loc.toLowerCase()}`}
                      onClick={() => toggleLocation(loc)}
                      className="px-3 py-1 rounded-full text-xs transition-all"
                      style={activeLocations.includes(loc)
                        ? { backgroundColor: '#345b79', color: '#fff' }
                        : { backgroundColor: '#e6e0d4', color: '#928d64', border: '1px solid #ccb7a3' }
                      }
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Type */}
              <div className="mb-6">
                <label className="block text-[10px] uppercase font-bold mb-3 tracking-wide" style={{ color: '#928d64' }}>
                  🏠 Property Type
                </label>
                <div className="space-y-2">
                  {['Villa', 'House', 'Apartment', 'Land'].map(type => (
                    <label key={type} className="flex items-center text-xs font-medium cursor-pointer gap-2">
                      <input
                        type="checkbox"
                        checked={checkedTypes.includes(type)}
                        onChange={() => toggleType(type)}
                        style={{ accentColor: '#345b79' }}
                      />
                      <span style={{ color: checkedTypes.includes(type) ? '#1d1d1d' : '#928d64' }}>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Budget Range */}
              <div className="mb-8">
                <label className="block text-[10px] uppercase font-bold mb-3 tracking-wide" style={{ color: '#928d64' }}>
                  💰 Budget Range
                </label>
                <div className="flex items-center gap-2">
                  <input
                    className="w-full text-[10px] border border-gray-200 rounded p-1.5 text-center outline-none"
                    type="text"
                    value={`LKR ${budgetMin}`}
                    onChange={e => setBudgetMin(e.target.value)}
                    style={{ color: '#1d1d1d' }}
                  />
                  <span style={{ color: '#928d64' }}>—</span>
                  <input
                    className="w-full text-[10px] border border-gray-200 rounded p-1.5 text-center outline-none"
                    type="text"
                    value={`LKR ${budgetMax}`}
                    onChange={e => setBudgetMax(e.target.value)}
                    style={{ color: '#1d1d1d' }}
                  />
                </div>
                <div className="mt-4 px-2">
                  <input
                    className="w-full h-1 rounded-lg cursor-pointer"
                    style={{ accentColor: '#345b79' }}
                    type="range"
                    onClick={() => undefined}
                  />
                </div>
              </div>

              {/* Re-run AI */}
              <button
                id="rerun-ai-btn"
                onClick={() => undefined}
                className="w-full py-3 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#345b79' }}
              >
                ♻ Re-run AI Analysis
              </button>
            </div>

            {/* AI Market Insight */}
            <div
              className="p-6 rounded-xl text-white shadow-lg overflow-hidden relative"
              style={{ background: 'linear-gradient(135deg, #345b79 0%, #1d1d1d 100%)' }}
            >
              <div className="relative z-10">
                <div className="flex items-center text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#d59b86' }}>
                  📊 AI Market Insight
                </div>
                <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.80)' }}>
                  Property values in Colombo 7 have increased 12% this quarter. Your preferred budget aligns with 94 available listings.
                </p>
                <button
                  id="best-time-btn"
                  onClick={() => undefined}
                  className="w-full py-2 text-xs font-semibold rounded-md flex items-center justify-center gap-2 hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.20)' }}
                >
                  Best time to buy: Now →
                </button>
              </div>
              <div
                className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-10"
                style={{ backgroundColor: '#fff' }}
              />
            </div>
          </aside>

          {/* ── CENTER CONTENT ── */}
          <section className="col-span-12 lg:col-span-6 space-y-8">

            {/* AI Smart Preference Assistant */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(190,93,63,0.10)' }}
                  >
                    <span className="text-xl" style={{ color: '#be5d3f' }}>🤖</span>
                  </div>
                  <div>
                    <h2 className="font-bold text-lg" style={{ color: '#1d1d1d' }}>AI Smart Preference Assistant</h2>
                    <p className="text-xs" style={{ color: '#928d64' }}>Tell us about your needs and we will recommend the most suitable properties.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  AI Active
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                {/* Purpose */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase" style={{ color: '#928d64' }}>Purpose</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Build Home', 'Investment', 'Agriculture', 'Commercial Project'].map(p => (
                      <button
                        key={p}
                        id={`purpose-${p.replace(/\s+/g, '-').toLowerCase()}`}
                        onClick={() => { setSelectedPurpose(p) }}
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                        style={selectedPurpose === p
                          ? { backgroundColor: '#be5d3f', color: '#fff' }
                          : { border: '1px solid #e5e7eb', color: '#1d1d1d', backgroundColor: '#fff' }
                        }
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Family Size */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase" style={{ color: '#928d64' }}>Family Size</h4>
                  <div className="flex gap-2">
                    {['1-2', '3-5', '5+'].map(f => (
                      <button
                        key={f}
                        id={`family-${f}`}
                        onClick={() => { setSelectedFamily(f) }}
                        className="flex-1 py-2 rounded-lg text-sm font-medium transition-all"
                        style={selectedFamily === f
                          ? { backgroundColor: '#1d1d1d', color: '#fff' }
                          : { border: '1px solid #e5e7eb', color: '#1d1d1d', backgroundColor: '#fff' }
                        }
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Environment */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase" style={{ color: '#928d64' }}>Environment</h4>
                  <div className="flex flex-wrap gap-2">
                    {['City Area', 'Quiet Area', 'Scenic Area', 'Beach Area'].map(env => (
                      <button
                        key={env}
                        id={`env-${env.replace(/\s+/g, '-').toLowerCase()}`}
                        onClick={() => { setSelectedEnvironment(env) }}
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                        style={selectedEnvironment === env
                          ? { backgroundColor: '#be5d3f', color: '#fff' }
                          : { border: '1px solid #e5e7eb', color: '#1d1d1d', backgroundColor: '#fff' }
                        }
                      >
                        {env}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Future Plan */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase" style={{ color: '#928d64' }}>Future Plan</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Build Immediately', 'Build Within 2 Years', 'Long-Term Investment'].map(plan => (
                      <button
                        key={plan}
                        id={`plan-${plan.replace(/\s+/g, '-').toLowerCase()}`}
                        onClick={() => { setSelectedFuturePlan(plan) }}
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-all w-full"
                        style={selectedFuturePlan === plan
                          ? { backgroundColor: '#1d1d1d', color: '#fff' }
                          : { border: '1px solid #e5e7eb', color: '#1d1d1d', backgroundColor: '#fff' }
                        }
                      >
                        {plan}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                <p className="text-[10px] flex items-center gap-1" style={{ color: '#928d64' }}>
                  ℹ Based on 340+ properties across Sri Lanka
                </p>
                <button
                  id="generate-recs-btn"
                  onClick={() => navigate('/land/ai-recommendations/list')}
                  className="text-white px-8 py-3 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#be5d3f' }}
                >
                  Generate Smart Recommendations
                </button>
              </div>
            </div>

            {/* Recommended For You */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: '#1d1d1d' }}>Recommended For You</h2>
                  <p className="text-sm" style={{ color: '#928d64' }}>Ranked by AI compatibility score based on your preferences</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span style={{ color: '#928d64' }}>Sort:</span>
                  <select
                    className="border border-gray-200 rounded-md py-1 text-sm font-semibold outline-none"
                    style={{ color: '#1d1d1d' }}
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                  >
                    <option>Best Match</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                {recommendedCards.map(card => (
                  <article
                    key={card.id}
                    id={`rec-card-${card.id}`}
                    onClick={() => navigate(`/land/detail/${card.id}`)}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row relative group cursor-pointer"
                    style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                  >
                    {/* Rank Badge */}
                    <div
                      className="absolute top-4 left-4 z-10 text-[10px] font-bold px-3 py-1 rounded-full uppercase"
                      style={{ backgroundColor: card.rankBg, color: card.rankColor, border: card.id === 7 ? '1px solid rgba(190,93,63,0.20)' : 'none' }}
                    >
                      {card.rank}
                    </div>

                    {/* Image */}
                    <div className="w-full md:w-2/5 relative h-64 md:h-auto overflow-hidden flex-shrink-0">
                      <img
                        alt={card.name}
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                        src={card.img}
                      />
                      <div className="absolute bottom-4 left-4">
                        <span className="text-white text-[10px] font-bold px-3 py-1 rounded" style={{ backgroundColor: '#345b79' }}>
                          {card.type}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="font-bold text-2xl" style={{ color: '#be5d3f' }}>{card.price}</div>
                          <h3 className="text-xl font-bold leading-tight" style={{ color: '#1d1d1d' }}>{card.name}</h3>
                          <div className="flex items-center gap-4 text-xs" style={{ color: '#928d64' }}>
                            <span>📍 {card.location}</span>
                            <span>⬛ {card.perches}</span>
                          </div>
                        </div>
                        {/* Match Circle */}
                        <div
                          className="w-14 h-14 rounded-full border-4 flex flex-col items-center justify-center text-center flex-shrink-0"
                          style={{ borderColor: card.matchBorder }}
                        >
                          <span className="text-lg font-black leading-none" style={{ color: card.matchColor }}>{card.match}%</span>
                          <span className="text-[8px] font-bold uppercase" style={{ color: '#928d64' }}>Match</span>
                        </div>
                      </div>

                      {/* AI Reasoning */}
                      <div
                        className="rounded-lg p-4 border"
                        style={{ backgroundColor: card.aiCardBg, borderColor: card.aiBorder }}
                      >
                        <div className="flex items-center gap-2 mb-2" style={{ color: card.aiTitleColor }}>
                          <span className="text-[10px]">✦</span>
                          <h4 className="text-[10px] font-bold uppercase tracking-wide">Why AI Recommended This</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                          {card.reasons.map((r, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-xs" style={{ color: '#1d1d1d' }}>
                              <span className="text-green-500 text-[10px]">✓</span>
                              {r}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 pt-2" onClick={e => e.stopPropagation()}>
                        <button
                          id={`view-details-btn-${card.id}`}
                          onClick={() => navigate(`/land/detail/${card.id}`)}
                          className="flex-1 py-3 rounded-lg font-bold text-sm text-white hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: '#345b79' }}
                        >
                          View Details
                        </button>
                        <button
                          id={`bookmark-btn-${card.id}`}
                          onClick={() => {
                            setBookmarked(prev => prev.includes(card.id) ? prev.filter(i => i !== card.id) : [...prev, card.id])
                          }}
                          className="w-12 h-12 border border-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-50 transition-colors"
                          style={{ color: bookmarked.includes(card.id) ? '#be5d3f' : '#928d64' }}
                        >
                          {bookmarked.includes(card.id) ? '🔖' : '📄'}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}

                {/* Load More */}
                <div className="flex justify-center pt-4">
                  <button
                    id="load-more-btn"
                    onClick={() => undefined}
                    className="px-8 py-3 rounded-full text-xs font-bold hover:bg-white hover:shadow-md transition-all"
                    style={{ border: '1px solid #ccb7a3', color: '#928d64' }}
                  >
                    + Load More Properties
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ── RIGHT SIDEBAR ── */}
          <aside className="col-span-12 lg:col-span-3 space-y-6">
            {/* AI Land Insights */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <span style={{ color: '#345b79' }}>📊</span>
                <h3 className="font-bold" style={{ color: '#1d1d1d' }}>AI LAND INSIGHTS</h3>
              </div>

              {/* Popular Locations */}
              <div className="mb-6">
                <div className="text-xs font-bold uppercase mb-4 flex items-center gap-2" style={{ color: '#928d64' }}>
                  ⭐ Popular Locations
                </div>
                <div className="space-y-4">
                  {[
                    { name: 'Malabe', parcels: '143 parcels', roi: '+18% ROI' },
                    { name: 'Battaramulla', parcels: '98 parcels', roi: '+14% ROI' },
                    { name: 'Negombo', parcels: '77 parcels', roi: '+10% ROI' },
                  ].map(loc => (
                    <div key={loc.name} className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold" style={{ color: '#1d1d1d' }}>{loc.name}</div>
                        <div className="text-[10px]" style={{ color: '#928d64' }}>{loc.parcels}</div>
                      </div>
                      <div
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ color: '#495d38', backgroundColor: '#f0fdf4' }}
                      >
                        {loc.roi}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="border-gray-100 mb-6" />

              {/* Fast Growing Areas */}
              <div className="mb-6">
                <div className="text-xs font-bold uppercase mb-4 flex items-center gap-2" style={{ color: '#928d64' }}>
                  ⚡ Fast Growing Areas
                </div>
                <div className="space-y-3">
                  {[
                    { area: 'Rajagiriya', pct: '+24%' },
                    { area: 'Kaduwela', pct: '+19%' },
                    { area: 'Wattala', pct: '+13%' },
                  ].map(a => (
                    <div key={a.area} className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: '#1d1d1d' }}>{a.area}</span>
                      <span className="text-xs font-bold" style={{ color: '#be5d3f' }}>↑ {a.pct}</span>
                    </div>
                  ))}
                </div>

                {/* Mini Bar Chart */}
                <div className="flex items-end gap-1.5 h-16 mt-6">
                  {[
                    { h: 25, active: false }, { h: 37, active: false }, { h: 75, active: true },
                    { h: 50, active: true }, { h: 87, active: true }, { h: 62, active: false },
                    { h: 100, active: true },
                  ].map((b, i) => (
                    <div
                      key={i}
                      className="w-2 rounded-t"
                      style={{
                        height: `${b.h}%`,
                        backgroundColor: b.active ? '#be5d3f' : '#e6e0d4',
                      }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[8px] font-bold mt-2 uppercase tracking-widest" style={{ color: '#928d64' }}>
                  <span>Jan</span><span>Apr</span><span>Jul</span><span>Oct</span>
                </div>
              </div>

              <hr className="border-gray-100 mb-6" />

              {/* Best Investment Zones */}
              <div>
                <div className="text-xs font-bold uppercase mb-4 flex items-center gap-2" style={{ color: '#928d64' }}>
                  🏆 Best Investment Zones
                </div>
                <div className="space-y-3">
                  {[
                    { zone: 'Colombo Outskirts', roi: '17.4% ROI Predicted', badge: 'Top Pick', badgeBg: '#be5d3f' },
                    { zone: 'Galle Coastal Belt', roi: '13.2% ROI Predicted', badge: 'Growing', badgeBg: '#345b79' },
                  ].map(z => (
                    <div key={z.zone} className="p-3 rounded-lg border border-slate-100" style={{ backgroundColor: '#f8f8f8' }}>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-bold" style={{ color: '#1d1d1d' }}>{z.zone}</span>
                        <span className="text-[8px] text-white px-2 py-0.5 rounded font-black uppercase" style={{ backgroundColor: z.badgeBg }}>{z.badge}</span>
                      </div>
                      <div className="text-[10px] font-bold" style={{ color: '#495d38' }}>{z.roi}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Land Price Trend */}
            <div className="text-white rounded-xl p-6 shadow-sm relative overflow-hidden" style={{ backgroundColor: '#1d1d1d' }}>
              <div
                className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-5"
                style={{ backgroundColor: '#fff' }}
              />
              <div
                className="text-xs font-bold uppercase tracking-widest mb-6 pb-4 flex items-center gap-2"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.10)', color: '#d59b86' }}
              >
                📈 Land Price Trend — Sri Lanka
              </div>
              <div className="flex items-end gap-2 h-24 mb-4">
                {[33, 50, 66, 83, 100].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm"
                    style={{ height: `${h}%`, backgroundColor: `rgba(255,255,255,${(i + 1) * 0.2})` }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-[10px] font-bold mb-6" style={{ color: '#928d64' }}>
                <span>Jan 2024</span><span>Jan 2025</span>
              </div>
              <div className="rounded-lg p-3 flex items-center gap-3 mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.10)' }}>
                <span className="text-green-400">↑</span>
                <div>
                  <div className="text-xs font-bold text-white">Land prices up 19% YoY</div>
                  <div className="text-[10px]" style={{ color: '#928d64' }}>across Sri Lanka</div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase" style={{ color: '#928d64' }}>AI Price Prediction</div>
                <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.70)' }}>
                  Malabe & Rajagiriya expected to appreciate 22-28% by 2026 based on infrastructure trends.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* ── Browse All Lands ── */}
        <section className="mt-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: '#1d1d1d' }}>Browse All Lands</h2>
              <p className="text-sm" style={{ color: '#928d64' }}>Showing 240 properties across Sri Lanka</p>
            </div>
            <button
              id="sort-browse-btn"
              onClick={() => undefined}
              className="flex items-center gap-2 text-sm font-semibold border border-slate-200 px-4 py-2 rounded-lg bg-white hover:bg-gray-50 transition-colors"
              style={{ color: '#1d1d1d' }}
            >
              ↕ Sort: <span style={{ color: '#1d1d1d', fontWeight: 700 }}>Newest</span> ▾
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {browseCards.map(card => (
              <div
                key={card.id}
                id={`browse-card-${card.id}`}
                className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm group cursor-pointer"
                onClick={() => navigate(`/land/detail/${card.id}`)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    alt={card.name}
                    className="w-full h-full object-cover transition group-hover:scale-105"
                    src={card.img}
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="text-white text-[8px] font-black px-2 py-0.5 rounded uppercase" style={{ backgroundColor: card.statusBg }}>
                      {card.statusLabel}
                    </span>
                    <span className="bg-white text-[8px] font-black px-2 py-0.5 rounded uppercase shadow-sm" style={{ color: '#928d64' }}>
                      {card.type}
                    </span>
                  </div>
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      setSavedCards(prev => prev.includes(card.id) ? prev.filter(i => i !== card.id) : [...prev, card.id])
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.20)',
                      backdropFilter: 'blur(4px)',
                      color: savedCards.includes(card.id) ? '#be5d3f' : '#fff',
                    }}
                  >
                    {savedCards.includes(card.id) ? '♥' : '♡'}
                  </button>
                </div>
                <div className="p-5 space-y-4">
                  <div className="font-bold" style={{ color: '#be5d3f' }}>{card.price}</div>
                  <div>
                    <h4 className="font-bold" style={{ color: '#1d1d1d' }}>{card.name}</h4>
                    <p className="text-xs flex items-center gap-1 mt-1" style={{ color: '#928d64' }}>
                      📍 {card.location}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold pt-4 border-t border-slate-50" style={{ color: '#928d64' }}>
                    <span>⬛ {card.perches}</span>
                    <span>🏠 {card.type}</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      id={`browse-view-btn-${card.id}`}
                      className="flex-1 text-white py-2 rounded font-bold text-xs hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: '#1d1d1d' }}
                      onClick={e => { e.stopPropagation(); navigate(`/land/detail/${card.id}`) }}
                    >
                      View
                    </button>
                    <button
                      className="w-10 rounded flex items-center justify-center hover:bg-slate-100 transition-colors"
                      style={{ backgroundColor: '#f8f8f8', color: '#928d64' }}
                      onClick={e => {
                        e.stopPropagation()
                      }}
                    >
                      🔖
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Bottom CTA Banner ── */}
        <section
          className="mt-20 rounded-3xl p-10 md:p-16 text-white flex flex-col md:flex-row items-center justify-between relative overflow-hidden"
          style={{ backgroundColor: '#1d1d1d' }}
        >
          {/* Decorative blur */}
          <div
            className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full blur-3xl"
            style={{ backgroundColor: '#be5d3f', opacity: 0.10 }}
          />
          <div className="max-w-xl space-y-6 relative z-10">
            <span
              className="text-[10px] font-black uppercase px-4 py-1.5 rounded-full border"
              style={{
                backgroundColor: 'rgba(190,93,63,0.20)',
                color: '#d59b86',
                borderColor: 'rgba(190,93,63,0.30)',
              }}
            >
              More AI Results Available
            </span>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              20 More Land Parcels Match Your Preferences
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: '#928d64' }}>
              Unlock more personalised AI-ranked land recommendations based on your unique goals and lifestyle preferences.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-10 md:mt-0 w-full md:w-auto relative z-10">
            <button
              id="view-all-ai-matches-btn"
              onClick={handleViewAllMatches}
              className="px-10 py-4 rounded-xl font-bold text-sm text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#be5d3f' }}
            >
              View All AI Matches
            </button>
            <button
              id="refine-preferences-btn"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-10 py-4 border rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
              style={{ borderColor: '#928d64' }}
            >
              Refine Preferences →
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
```
