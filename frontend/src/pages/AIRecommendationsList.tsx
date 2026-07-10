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
