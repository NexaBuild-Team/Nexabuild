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
