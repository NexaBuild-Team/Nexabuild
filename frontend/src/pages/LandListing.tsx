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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
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
