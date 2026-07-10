import { useState } from 'react'
import { useNavigate } from 'react-router'

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
      <section
        className="pt-[60px] pb-24 px-6 text-center text-white relative overflow-hidden"
        style={{ backgroundColor: '#345b79' }}
      >
        <div className="max-w-4xl mx-auto">
          {/* AI Badge */}
          <span
            className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-widest mb-6"
            style={{ backgroundColor: 'rgba(190,93,63,0.20)', border: '1px solid rgba(190,93,63,0.30)', color: '#d59b86' }}
          >
            ✦ AI-Powered Intelligence
          </span>

          <h1 className="text-4xl md:text-6xl font-bold mb-6">Find Your Perfect Land with AI</h1>
          <p className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto mb-12">
            Search thousands of lands and receive personalized recommendations based on your lifestyle and goals.
          </p>

          {/* Search Bar */}
          <div
            className="max-w-5xl mx-auto rounded-2xl p-4 shadow-2xl flex flex-col md:flex-row items-center gap-4"
            style={{ backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', color: '#1d1d1d' }}
          >
            <div className="flex-1 w-full relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">📍</span>
              <input
                id="land-search-input"
                className="w-full pl-10 pr-4 py-4 bg-transparent text-sm outline-none"
                placeholder="Search by city, district or land name..."
                type="text"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && undefined}
              />
            </div>
            <div className="w-px h-10 bg-gray-200 hidden md:block" />
            <div className="flex-1 w-full">
              <select
                id="land-type-select"
                className="w-full py-4 bg-transparent text-sm cursor-pointer outline-none"
                style={{ color: '#1d1d1d' }}
              >
                <option>Land Type</option>
                <option>Residential</option>
                <option>Commercial</option>
                <option>Agricultural</option>
              </select>
            </div>
            <div className="w-px h-10 bg-gray-200 hidden md:block" />
            <div className="flex-1 w-full">
              <select
                id="land-budget-select"
                className="w-full py-4 bg-transparent text-sm cursor-pointer outline-none"
                style={{ color: '#1d1d1d' }}
              >
                <option>Budget</option>
                <option>LKR 5M - 10M</option>
                <option>LKR 10M - 50M</option>
                <option>Above LKR 50M</option>
              </select>
            </div>
            <button
              id="land-search-btn"
              className="text-white px-10 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 w-full md:w-auto transition-opacity"
              style={{ backgroundColor: '#be5d3f' }}
            >
              🔍 Search
            </button>
          </div>

          {/* Stats */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 md:gap-16 text-sm text-gray-100">
            <div><span className="font-bold text-lg block">24,000+</span> Properties Listed</div>
            <div><span className="font-bold text-lg block">98%</span> AI Match Accuracy</div>
            <div><span className="font-bold text-lg block">340+</span> Verified Builders</div>
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <main className="max-w-7xl mx-auto py-12 px-6 flex flex-col lg:flex-row gap-8">

        {/* ── Sidebar Filters ── */}
        <aside className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg" style={{ color: '#1d1d1d' }}>Land Filters</h2>
              <button id="clear-all-btn" onClick={handleClearAll} className="text-xs font-semibold" style={{ color: '#be5d3f' }}>Clear All</button>
            </div>

            {/* Location */}
            <div className="mb-8">
              <label className="block text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#928d64' }}>Location</label>
              <input
                id="filter-district-input"
                className="w-full border border-gray-200 rounded-lg text-sm mb-3 px-3 py-2 outline-none"
                placeholder="Select District..."
                type="text"
              />
              <div className="flex flex-wrap gap-2">
                {['Colombo', 'Kandy', 'Galle'].map(loc => (
                  <button
                    key={loc}
                    id={`loc-chip-${loc.toLowerCase()}`}
                    onClick={() => setActiveLocation(loc)}
                    className="px-3 py-1 rounded text-xs font-medium transition-all"
                    style={activeLocation === loc
                      ? { backgroundColor: '#be5d3f', color: '#fff' }
                      : { backgroundColor: '#e6e0d4', color: '#1d1d1d' }
                    }
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Land Type */}
            <div className="mb-8">
              <label className="block text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#928d64' }}>Land Type</label>
              <div className="space-y-3">
                {[
                  { label: 'All Types', val: 'all' },
                  { label: 'Residential', val: 'residential' },
                  { label: 'Commercial', val: 'commercial' },
                  { label: 'Agricultural', val: 'agricultural' },
                  { label: 'Industrial', val: 'industrial' },
                ].map(item => (
                  <label key={item.val} className="flex items-center gap-3 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="land_type"
                      checked={selectedType === item.val}
                      onChange={() => setSelectedType(item.val)}
                      style={{ accentColor: '#be5d3f' }}
                    />
                    <span style={{ color: '#1d1d1d' }}>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-8">
              <label className="block text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#928d64' }}>Price Range</label>
              <div className="text-sm font-semibold mb-2" style={{ color: '#be5d3f' }}>LKR 5M — LKR 150M</div>
              <input className="w-full" style={{ accentColor: '#be5d3f' }} type="range" />
            </div>

            {/* Land Size */}
            <div className="mb-8">
              <label className="block text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#928d64' }}>Land Size</label>
              <div className="grid grid-cols-2 gap-2">
                {['Any', '< 10P', '10–20P', '> 1 Acre'].map(size => (
                  <button
                    key={size}
                    id={`size-btn-${size.replace(/[^a-z0-9]/gi,'')}`}
                    onClick={() => setActiveSize(size)}
                    className="py-2 rounded text-xs font-medium transition-all"
                    style={activeSize === size
                      ? { backgroundColor: '#345b79', color: '#fff' }
                      : { backgroundColor: '#fff', border: '1px solid #e5e7eb', color: '#4b5563' }
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
              className="w-full text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 mb-3 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#be5d3f' }}
            >
              ✦ AI Smart Recommend
            </button>

            {/* Apply Filters */}
            <button
              id="apply-filters-btn"
              className="w-full text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#345b79' }}
            >
              ⚙ Apply Filters
            </button>
          </div>
        </aside>

        {/* ── Property Listings Grid ── */}
        <div className="flex-1">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: '#1d1d1d' }}>
              <span style={{ color: '#be5d3f' }}>📍</span> 184 land parcels found
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
                    📍 {parcel.location}
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
      </main>

      {/* ── Map View Section ── */}
      <section className="max-w-7xl mx-auto py-12 px-6 border-t border-gray-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-1 mb-2" style={{ color: '#be5d3f' }}>
              📍 Map View
            </span>
            <h2 className="text-3xl font-bold" style={{ color: '#1d1d1d' }}>Explore Properties on Map</h2>
          </div>
          <button
            id="open-fullmap-btn"
            className="text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 text-sm hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#345b79' }}
          >
            🗺 Open Full Map
          </button>
        </div>

        {/* Map */}
        <div
          className="relative rounded-3xl overflow-hidden shadow-lg"
          style={{ border: '8px solid rgba(255,255,255,0.50)', aspectRatio: '21/9' }}
        >
          <img
            alt="Property Map"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsCiKg5-1Vxtuz-EppWV9X3PW7Uz-Z5UL_9siv7X4dXTqRXBLnGv6Kd1SurgoJqm_1Nq6VVDvhFYG_vqUN3f22FQ75iJIJ7-wt8I6ilkskC1O9mJ0uber1hsm9zhCx3JGWUJaHgFA_sbBcoIMgrQR12LA4ELD49qiW2sFaMLtOwmfy6jfyDXF1hXu1Ysszu2VqBeL6oZQ5Jxtav9tHXe4nhv7blfrIfnY7VV4wlGOCHuD7MHmRJmwHS31F_0pW49fUYSabA-1pLRo"
          />

          {/* Map Markers */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-1/4 left-1/3 text-white text-[10px] font-bold px-2 py-1 rounded-full border-2 border-white shadow-lg pointer-events-auto cursor-pointer"
              style={{ backgroundColor: '#be5d3f' }}
            >
              LKR 45M
            </div>
            <div
              className="absolute bottom-1/3 left-1/4 text-white text-[10px] font-bold px-2 py-1 rounded-full border-2 border-white shadow-lg pointer-events-auto cursor-pointer"
              style={{ backgroundColor: '#345b79' }}
            >
              LKR 18M
            </div>
            <div
              className="absolute top-1/2 right-1/4 text-white text-[10px] font-bold px-2 py-1 rounded-full border-2 border-white shadow-lg pointer-events-auto cursor-pointer"
              style={{ backgroundColor: '#345b79' }}
            >
              LKR 55M
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-2">
            <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center font-bold" style={{ color: '#1d1d1d' }}>+</button>
            <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center font-bold" style={{ color: '#1d1d1d' }}>-</button>
          </div>

          {/* Legend */}
          <div
            className="absolute bottom-6 left-6 p-4 rounded-xl flex items-center gap-6 text-xs font-bold shadow-md"
            style={{ backgroundColor: 'rgba(255,255,255,0.90)', backdropFilter: 'blur(4px)' }}
          >
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: '#be5d3f' }} />
              <span style={{ color: '#1d1d1d' }}>Selected</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: '#345b79' }} />
              <span style={{ color: '#1d1d1d' }}>Available</span>
            </span>
          </div>
        </div>
      </section>

    </div>
  )
}
