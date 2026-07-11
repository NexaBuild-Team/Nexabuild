import { useState } from 'react'
import { Link, useNavigate } from 'react-router'

import { recommendedProperties, type RecommendedProperty } from '../data/recommendedProperties'

const matchMetrics = [
  { label: 'Budget Match', value: 96, detail: 'Within range', icon: 'wallet' },
  { label: 'Location Match', value: 94, detail: 'Colombo & Kandy', icon: 'map' },
  { label: 'Type Match', value: 88, detail: 'Villa, House', icon: 'house' },
  { label: 'Lifestyle Match', value: 82, detail: 'Schools nearby', icon: 'star' },
]

const preferredLocations = ['Colombo', 'Kandy', 'Galle', 'Negombo', 'Jaffna']
const propertyTypes = ['Villa', 'House', 'Apartment', 'Land']

// ─── Color Palette ─────────────────────────────────────────────────────────────

// ─── Icons ────────────────────────────────────────────────────────────────────
const SparklesIcon = ({ cls = 'w-3.5 h-3.5' }: { cls?: string }) => (
  <svg className={cls} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
  </svg>
)

const MetricIcon = ({ type }: { type: string }) => {
  const cls = 'w-5 h-5'
  if (type === 'wallet') return (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
    </svg>
  )
  if (type === 'map') return (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
  )
  if (type === 'house') return (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  )
  return (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
    </svg>
  )
}

const MapPinIcon = ({ cls = 'w-4 h-4' }: { cls?: string }) => (
  <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg className="w-5 h-5" fill={filled ? '#be5d3f' : 'none'} stroke={filled ? '#be5d3f' : 'currentColor'} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
)

const RefreshIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
)

const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

const ChartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  </svg>
)

// ─── Match Score Ring ─────────────────────────────────────────────────────────
function MatchScoreRing({ score }: { score: number }) {
  const circumference = 163.36
  const dash = (score / 100) * circumference

  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="26" fill="none" stroke="#e6e0d4" strokeWidth="5" />
        <circle
          cx="32" cy="32" r="26" fill="none"
          stroke="#345b79" strokeWidth="5"
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-extrabold text-[#345b79] leading-none">{score}</span>
        <span className="text-[8px] font-semibold text-[#928d64] uppercase tracking-wide">Match</span>
      </div>
    </div>
  )
}

// ─── Property Card ────────────────────────────────────────────────────────────
function PropertyCard({ property }: { property: RecommendedProperty }) {
  const [fav, setFav] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col lg:flex-row">
      <div className="relative lg:w-[42%] flex-shrink-0 h-56 lg:h-auto lg:min-h-[280px]">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <span
          className="absolute top-4 left-4 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wider uppercase"
          style={{ backgroundColor: property.badgeColor }}
        >
          {property.badge}
        </span>
      </div>

      <div className="flex-1 p-6 flex flex-col">
        <div className="flex items-start justify-between gap-4 mb-2">
          <p className="text-xl font-extrabold text-[#1d1d1d]">{property.price}</p>
          <MatchScoreRing score={property.matchScore} />
        </div>

        <h3 className="text-lg font-bold text-[#1d1d1d] mb-1">{property.title}</h3>
        <div className="flex items-center gap-1.5 text-[#928d64] text-sm mb-4">
          <MapPinIcon cls="w-4 h-4 flex-shrink-0" />
          <span>{property.location}</span>
        </div>

        <div className="flex items-center gap-5 text-sm text-[#6b879c] mb-5 pb-4 border-b border-[#e6e0d4]">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12V7a1 1 0 011-1h1m0 0V4a1 1 0 011-1h10a1 1 0 011 1v2m0 0h1a1 1 0 011 1v5M3 12v5m18-5v5M3 12h18M3 17h18" />
            </svg>
            {property.beds} Beds
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 17v1a3 3 0 006 0v-1H3zm0 0h18M21 17V9a2 2 0 00-2-2h-1V5a2 2 0 00-2-2H8a2 2 0 00-2 2v2H5a2 2 0 00-2 2v8" />
            </svg>
            {property.baths} Baths
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            {property.area}
          </span>
        </div>

        <div className="rounded-xl p-4 mb-5" style={{ backgroundColor: '#ccb7a3' }}>
          <p className="text-[10px] font-bold text-[#345b79] uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <SparklesIcon cls="w-3 h-3" />
            Why AI Recommends This
          </p>
          <p className="text-xs text-[#1d1d1d] leading-relaxed mb-3">{property.reason}</p>
          <div className="flex flex-wrap gap-2">
            {property.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/60 text-[#345b79]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-auto">
          <button
            onClick={() => navigate(`/property-detail/${property.id}`)}
            className="flex-1 text-sm font-bold py-3 rounded-xl text-white transition-all hover:opacity-90"
            style={{ backgroundColor: '#345b79' }}
          >
            View Details
          </button>
          <button
            onClick={() => setFav(!fav)}
            className="w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all hover:bg-[#e6e0d4]"
            style={{ borderColor: '#ccb7a3', color: '#345b79' }}
          >
            <HeartIcon filled={fav} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PropertyAIrecommended() {
  const [selectedLocations, setSelectedLocations] = useState(['Colombo', 'Kandy'])
  const [selectedTypes, setSelectedTypes] = useState(['Villa', 'House'])
  const [budgetMin, setBudgetMin] = useState(20)
  const [budgetMax, setBudgetMax] = useState(100)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const toggleLocation = (loc: string) => {
    setSelectedLocations((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
    )
  }

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  const handleRerunAnalysis = async () => {
    setIsAnalyzing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsAnalyzing(false)
  }

  return (
    <>
    

      <div className="min-h-screen bg-[#e6e0d4]" style={{ fontFamily: "'Inter', 'Outfit', sans-serif" }}>

      {/* ── Hero / Header Section ── */}
      <section className="pt-[76px] pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-[#928d64] mb-6 pt-1">
            <Link to="/" className="hover:text-[#345b79] transition-colors">Home</Link>
            <span>&gt;</span>
            <span className="text-[#345b79] font-medium">AI Recommendations</span>
          </nav>

          {/* Title Row */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <SparklesIcon cls="w-4 h-4 text-[#be5d3f]" />
                <span className="text-[11px] font-bold text-[#be5d3f] uppercase tracking-widest">
                  AI-Powered Intelligence
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1d1d1d] tracking-tight mb-3">
                Your AI Property Matches
              </h1>
              <p className="text-sm text-[#928d64] leading-relaxed max-w-xl">
                Based on your preferences, our AI has analyzed thousands of properties to find your perfect matches. Each recommendation is scored on budget, location, type, and lifestyle fit.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 sm:flex sm:flex-shrink-0 gap-3">
              {[
                { value: '98%', label: 'Top Match Score' },
                { value: '24', label: 'Properties Found' },
                { value: '< 2 min', label: 'Analysis Time' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-xl px-3 sm:px-5 py-3 sm:py-4 text-center shadow-sm"
                >
                  <p className="text-lg sm:text-xl font-extrabold text-[#345b79]">{stat.value}</p>
                  <p className="text-[10px] text-[#928d64] mt-0.5 leading-tight">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Match Metrics Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {matchMetrics.map((metric) => (
              <div key={metric.label} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-[#345b79]"
                    style={{ backgroundColor: '#e6e0d4' }}
                  >
                    <MetricIcon type={metric.icon} />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-[#1d1d1d] leading-none">{metric.value}%</p>
                    <p className="text-xs font-semibold text-[#1d1d1d] mt-0.5">{metric.label}</p>
                  </div>
                </div>
                <p className="text-[11px] text-[#928d64] mb-2">{metric.detail}</p>
                <div className="h-1.5 rounded-full bg-[#e6e0d4]">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${metric.value}%`, backgroundColor: '#345b79' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Two-Column Layout ── */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6">

            {/* ── Left Sidebar ── */}
            <aside className="lg:w-[280px] flex-shrink-0 space-y-5">

              {/* Property Filters */}
              <div className="bg-white rounded-2xl shadow-md p-5">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-[#1d1d1d]">Property Filters</h2>
                  <button className="text-xs font-semibold text-[#be5d3f] hover:opacity-80 transition-opacity">
                    Edit
                  </button>
                </div>

                {/* Preferred Locations */}
                <div className="mb-5">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#928d64] mb-2.5">
                    Preferred Locations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {preferredLocations.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => toggleLocation(loc)}
                        className="text-xs font-medium px-3 py-1.5 rounded-full transition-all"
                        style={
                          selectedLocations.includes(loc)
                            ? { backgroundColor: '#345b79', color: '#fff' }
                            : { backgroundColor: '#e6e0d4', color: '#928d64' }
                        }
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#e6e0d4] my-4" />

                {/* Property Type */}
                <div className="mb-5">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#928d64] mb-2.5">
                    Property Type
                  </h3>
                  <div className="space-y-2.5">
                    {propertyTypes.map((type) => (
                      <label key={type} className="flex items-center gap-2.5 cursor-pointer">
                        <div
                          className="w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                          style={
                            selectedTypes.includes(type)
                              ? { borderColor: '#345b79', backgroundColor: '#345b79' }
                              : { borderColor: '#ccb7a3' }
                          }
                          onClick={() => toggleType(type)}
                        >
                          {selectedTypes.includes(type) && (
                            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm text-[#1d1d1d]">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#e6e0d4] my-4" />

                {/* Budget Range */}
                <div className="mb-6">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#928d64] mb-2.5">
                    Budget Range
                  </h3>
                  <div className="flex items-center justify-between text-xs font-semibold text-[#1d1d1d] mb-3">
                    <span>LKR {budgetMin}M</span>
                    <span>LKR {budgetMax}M</span>
                  </div>
                  <div className="relative h-2 rounded-full bg-[#e6e0d4]">
                    <div
                      className="absolute h-full rounded-full bg-[#345b79]"
                      style={{
                        left: `${((budgetMin - 10) / 190) * 100}%`,
                        right: `${100 - ((budgetMax - 10) / 190) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex gap-3 mt-3">
                    <input
                      type="range"
                      min={10}
                      max={200}
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(Math.min(Number(e.target.value), budgetMax - 5))}
                      className="w-full accent-[#345b79]"
                    />
                    <input
                      type="range"
                      min={10}
                      max={200}
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(Math.max(Number(e.target.value), budgetMin + 5))}
                      className="w-full accent-[#345b79]"
                    />
                  </div>
                </div>

                <button
                  onClick={handleRerunAnalysis}
                  disabled={isAnalyzing}
                  className="w-full flex items-center justify-center gap-2 text-white text-sm font-bold py-3 rounded-xl transition-all hover:opacity-90 shadow"
                  style={{ backgroundColor: '#345b79', opacity: isAnalyzing ? 0.8 : 1 }}
                >
                  {isAnalyzing ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Analysing…
                    </>
                  ) : (
                    <>
                      <RefreshIcon />
                      Re-run AI Analysis
                    </>
                  )}
                </button>
              </div>

              {/* AI Market Insight */}
              <div
                className="rounded-2xl p-5 shadow-md"
                style={{ backgroundColor: '#345b79' }}
              >
                <div className="flex items-center gap-2 mb-3 text-white">
                  <ChartIcon />
                  <p className="text-xs font-bold uppercase tracking-widest text-white">
                    AI Market Insight
                  </p>
                </div>
                <p className="text-xs text-white/80 leading-relaxed mb-4">
                  Property values in Colombo 7 have increased 12% over the past year. Your budget range aligns well with current market conditions in your preferred areas.
                </p>
                <button className="text-xs font-bold text-[#d59b86] flex items-center gap-1 hover:gap-2 transition-all">
                  Best time to buy: Now
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </aside>

            {/* ── Right Main Content ── */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-[#1d1d1d]">Top Recommended Properties</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#928d64]">Sort:</span>
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-[#1d1d1d] bg-white border rounded-lg px-3 py-2 shadow-sm" style={{ borderColor: '#ccb7a3' }}>
                    Best Match
                    <ChevronDownIcon />
                  </button>
                </div>
              </div>

              <div className="space-y-5">
                {recommendedProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  className="flex items-center gap-2 text-sm font-bold px-8 py-3 rounded-xl border-2 transition-all hover:bg-[#345b79] hover:text-white"
                  style={{ color: '#345b79', borderColor: '#345b79' }}
                >
                  Load More Properties
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>


    </>
  )
}
