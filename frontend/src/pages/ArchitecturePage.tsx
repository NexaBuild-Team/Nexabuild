// src/pages/ArchitecturePage.tsx
// Route: /architecture
// Full blueprint layout: Hero search + Architecture Firms listing
import { useState } from 'react'
import type { ReactElement } from 'react'
import { useNavigate } from 'react-router'
import { architectFirms } from '../services/architectureMockData'

// ─── Constants ────────────────────────────────────────────────────────────────

const QUICK_FILTERS = ['Colombo', 'Kandy', 'Galle', 'Negombo', 'Residential', 'Commercial']
const LOCATIONS     = ['Colombo', 'Kandy', 'Galle', 'Negombo', 'Jaffna']
const EXPERIENCE_OPTIONS = ['1 – 5 Years', '5 – 10 Years', '10 – 20 Years', '20+ Years']
const SPECIALIZATIONS = ['Residential', 'Commercial', 'Interior Design', 'Sustainable Design']

const SPEC_ICONS: Record<string, ReactElement> = {
  'Residential': (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  'Commercial': (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  ),
  'Interior Design': (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  ),
  'Sustainable Design': (
    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M12 22V12m0 0C12 6 7 3 2 3c0 5 3 9 10 9z" /><path d="M12 12c0-6 5-9 10-9-0 5-3 9-10 9z" />
    </svg>
  ),
}



// ─── Firm Card ─────────────────────────────────────────────────────────────────

function FirmCard({ firm }: { firm: typeof architectFirms[0] }) {
  const navigate = useNavigate()
  return (
    <article
      className="flex flex-col h-full bg-white rounded-2xl overflow-hidden transition-shadow hover:shadow-lg"
      style={{ border: '1px solid #e6e0d4', boxShadow: '0 2px 16px rgba(52,91,121,0.07)' }}
    >
      {/* Cover image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={firm.coverImage}
          alt={firm.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Avatar overlaid on image bottom */}
        <img
          src={firm.avatar}
          alt={`${firm.name} principal`}
          className="absolute bottom-3 left-4 w-12 h-12 rounded-full object-cover border-2 border-white"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}
        />
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Name + Rating badge */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-base leading-snug" style={{ color: '#1d1d1d' }}>
            {firm.name}
          </h3>
          <div
            className="flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap"
            style={{ background: 'rgba(52,91,121,0.10)', color: '#345b79' }}
          >
            <span>⭐</span>
            <span>{firm.rating}</span>
            <span style={{ color: '#ccb7a3' }}>({firm.reviewCount})</span>
          </div>
        </div>

        {/* Location */}
        <p className="text-xs flex items-center gap-1 mb-3" style={{ color: '#928d64' }}>
          <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
          </svg>
          {firm.location}, {firm.country}
        </p>

        {/* Stats row */}
        <div className="flex items-stretch gap-0 py-3 border-y mb-3" style={{ borderColor: '#e6e0d4' }}>
          <div className="flex-1 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: '#6b879c' }}>Experience</p>
            <p className="font-bold text-sm" style={{ color: '#1d1d1d' }}>{firm.experience}+ yrs</p>
          </div>
          <div className="w-px" style={{ background: '#e6e0d4' }} />
          <div className="flex-1 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: '#6b879c' }}>Projects</p>
            <p className="font-bold text-sm" style={{ color: '#1d1d1d' }}>{firm.projectCount}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm opacity-80 h-[60px] line-clamp-3 mb-4" style={{ color: '#928d64' }}>
          {firm.description}
        </p>

        {/* Specialization tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {firm.specializations.map((spec) => (
            <span
              key={spec}
              className="h-auto px-3 py-1 rounded-full text-xs font-medium leading-none"
              style={{ background: '#f0ede8', color: '#345b79' }}
            >
              {spec}
            </span>
          ))}
        </div>

        {/* Action row */}
        <div className="flex items-center gap-2 mt-auto">
          <button
            id={`view-profile-${firm.id}`}
            onClick={() => navigate('/designs')}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: '#345b79' }}
          >
            View Profile
          </button>
          <a
            href={`mailto:${firm.email}`}
            className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-[#345b79] transition-all hover:bg-gray-50"
            title="Send Email"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </a>
          <button
            className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-[#345b79] transition-all hover:bg-gray-50"
            title="Save Firm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

function ArchitecturePage() {
  // Hero search state
  const [searchName, setSearchName]       = useState('')
  const [searchCompany, setSearchCompany] = useState('')
  const [searchCity, setSearchCity]       = useState('')
  const [activeFilter, setActiveFilter]   = useState<string | null>(null)

  // Sidebar filter state
  const [selectedLocations, setSelectedLocations]   = useState<string[]>([])
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null)
  const [selectedSpecs, setSelectedSpecs]           = useState<string[]>([])
  const [minRating, setMinRating]                   = useState(0)
  const [sortBy, setSortBy]                         = useState('Top Rated')
  const [currentPage, setCurrentPage]               = useState(1)

  const toggleLocation = (loc: string) =>
    setSelectedLocations((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc]
    )

  const toggleSpec = (spec: string) =>
    setSelectedSpecs((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    )

  const clearAll = () => {
    setSelectedLocations([])
    setSelectedExperience(null)
    setSelectedSpecs([])
    setMinRating(0)
  }

  const scrollToFirms = () =>
    document.getElementById('firms-section')?.scrollIntoView({ behavior: 'smooth' })

  const handleFilterClick = (filter: string) => {
    setActiveFilter((prev) => (prev === filter ? null : filter))
    setSearchCity(filter === activeFilter ? '' : filter)
    scrollToFirms()
  }

  // Apply sidebar filters
  const filtered = architectFirms.filter((firm) => {
    if (selectedLocations.length > 0 && !selectedLocations.includes(firm.city)) return false
    if (selectedSpecs.length > 0 && !selectedSpecs.some((s) => firm.specializations.includes(s))) return false
    if (minRating > 0 && firm.rating < minRating) return false
    if (selectedExperience) {
      const ranges: Record<string, [number, number]> = {
        '1 – 5 Years': [1, 5], '5 – 10 Years': [5, 10],
        '10 – 20 Years': [10, 20], '20+ Years': [20, 999],
      }
      const [min, max] = ranges[selectedExperience]
      if (firm.experience < min || firm.experience > max) return false
    }
    return true
  })

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'Most Projects')    return b.projectCount - a.projectCount
    if (sortBy === 'Most Experienced') return b.experience - a.experience
    return b.rating - a.rating // Top Rated default
  })

  return (
    <>
      {/* ════════════════════════════════════════════════════════
          HERO SECTION — solid #345b79 matching navbar exactly
      ════════════════════════════════════════════════════════ */}
      <section
        className="nb-gradient-hero relative overflow-hidden pt-24"
        style={{ minHeight: '520px', background: '#345b79' }}
      >


        <div className="max-w-4xl mx-auto px-6 pt-16 pb-20 flex flex-col items-center text-center relative z-10">

          {/* ── AI badge ── */}
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold tracking-widest uppercase mb-8"
            style={{
              background: 'rgba(190,93,63,0.20)',
              color: '#d59b86',
              border: '1px solid rgba(190,93,63,0.40)',
            }}
          >
            <span>⚡</span>
            <span>AI-Powered Intelligence</span>
          </div>

          {/* ── Headline ── */}
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
            Find the Right Architect<br />
            <span style={{ color: '#d59b86' }}>for Your Dream Home</span>
          </h1>
          <p className="text-base md:text-lg max-w-2xl mb-12" style={{ color: '#ccb7a3' }}>
            Browse Sri Lanka's leading architecture firms and discover award-winning residential and
            commercial designs tailored to your lifestyle.
          </p>

          {/* ── Search Bar ── */}
          <div
            className="w-full max-w-3xl rounded-2xl p-4 flex flex-col md:flex-row items-center gap-3"
            style={{ background: '#fff', boxShadow: '0 24px 60px rgba(52,91,121,0.22)' }}
          >
            {/* Architect / Firm */}
            <div className="flex items-center gap-2 flex-1 min-w-0 px-1">
              <svg className="w-4 h-4 shrink-0" style={{ color: '#6b879c' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                id="arch-search-name"
                type="text"
                placeholder="Architect Name or Firm"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="flex-1 text-sm outline-none bg-transparent"
                style={{ color: '#1d1d1d' }}
              />
            </div>

            <div className="w-px h-8 hidden md:block shrink-0" style={{ background: '#e6e0d4' }} />

            {/* Company */}
            <div className="flex items-center gap-2 flex-1 min-w-0 px-1">
              <svg className="w-4 h-4 shrink-0" style={{ color: '#6b879c' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              </svg>
              <input
                id="arch-search-company"
                type="text"
                placeholder="Company"
                value={searchCompany}
                onChange={(e) => setSearchCompany(e.target.value)}
                className="flex-1 text-sm outline-none bg-transparent"
                style={{ color: '#1d1d1d' }}
              />
            </div>

            <div className="w-px h-8 hidden md:block shrink-0" style={{ background: '#e6e0d4' }} />

            {/* City / District */}
            <div className="flex items-center gap-2 flex-1 min-w-0 px-1">
              <svg className="w-4 h-4 shrink-0" style={{ color: '#6b879c' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              <input
                id="arch-search-city"
                type="text"
                placeholder="City or District"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="flex-1 text-sm outline-none bg-transparent"
                style={{ color: '#1d1d1d' }}
              />
            </div>

            {/* Search button — brick orange per blueprint */}
            <button
              id="arch-search-btn"
              onClick={scrollToFirms}
              className="flex items-center justify-center gap-2 shrink-0 w-full md:w-auto px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: '#be5d3f' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              Search
            </button>
          </div>

          {/* ── Quick Filter Pills ── */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {QUICK_FILTERS.map((filter) => (
              <button
                key={filter}
                id={`filter-pill-${filter.toLowerCase()}`}
                onClick={() => handleFilterClick(filter)}
                className="px-5 py-2 rounded-full text-sm font-medium border transition-all"
                style={
                  activeFilter === filter
                    ? { background: 'rgba(52,91,121,0.55)', borderColor: '#345b79', color: '#fff' }
                    : { color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.30)', background: 'rgba(255,255,255,0.08)' }
                }
              >
                {filter}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          ARCHITECTURE FIRMS SECTION — cream background
      ════════════════════════════════════════════════════════ */}
      <section
        id="firms-section"
        className="py-12 px-6"
        style={{ background: '#e6e0d4' }}
      >
        <div className="max-w-7xl mx-auto flex gap-8 items-start">

          {/* ── Left Sidebar ──────────────────────────────────── */}
          <aside
            className="hidden lg:flex flex-col w-64 shrink-0 rounded-2xl p-6 sticky top-24"
            style={{ background: '#fff', border: '1px solid #e6e0d4', boxShadow: '0 2px 16px rgba(52,91,121,0.07)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-bold text-sm" style={{ color: '#1d1d1d' }}>Filters</h2>
              <button
                id="clear-all-filters"
                onClick={clearAll}
                className="text-xs font-semibold transition-colors hover:underline"
                style={{ color: '#be5d3f' }}
              >
                Clear All
              </button>
            </div>
            <p className="text-xs mb-5" style={{ color: '#928d64' }}>Refine your search</p>

            {/* Location */}
            <div className="mb-5 pb-5" style={{ borderBottom: '1px solid #f0ede8' }}>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#6b879c' }}>Location</h3>
              {LOCATIONS.map((loc) => (
                <label key={loc} className="flex items-center gap-2.5 py-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    id={`filter-loc-${loc}`}
                    checked={selectedLocations.includes(loc)}
                    onChange={() => toggleLocation(loc)}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: '#345b79' }}
                  />
                  <span className="text-sm" style={{ color: '#1d1d1d' }}>{loc}</span>
                </label>
              ))}
            </div>

            {/* Years of Experience */}
            <div className="mb-5 pb-5" style={{ borderBottom: '1px solid #f0ede8' }}>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#6b879c' }}>Years of Experience</h3>
              {EXPERIENCE_OPTIONS.map((opt) => (
                <label key={opt} className="flex items-center gap-2.5 py-1.5 cursor-pointer select-none">
                  <input
                    type="radio"
                    id={`exp-${opt}`}
                    name="experience"
                    checked={selectedExperience === opt}
                    onChange={() => setSelectedExperience(opt)}
                    className="w-4 h-4"
                    style={{ accentColor: '#345b79' }}
                  />
                  <span className="text-sm" style={{ color: '#1d1d1d' }}>{opt}</span>
                </label>
              ))}
            </div>

            {/* Specialization */}
            <div className="mb-5 pb-5" style={{ borderBottom: '1px solid #f0ede8' }}>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#6b879c' }}>Specialization</h3>
              {SPECIALIZATIONS.map((spec) => (
                <label key={spec} className="flex items-center gap-2.5 py-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    id={`filter-spec-${spec.replace(/ /g, '-').toLowerCase()}`}
                    checked={selectedSpecs.includes(spec)}
                    onChange={() => toggleSpec(spec)}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: '#345b79' }}
                  />
                  <span className="flex items-center gap-1.5 text-sm" style={{ color: '#1d1d1d' }}>
                    <span style={{ color: '#6b879c' }}>{SPEC_ICONS[spec]}</span>
                    {spec}
                  </span>
                </label>
              ))}
            </div>

            {/* Budget Range */}
            <div className="mb-5 pb-5" style={{ borderBottom: '1px solid #f0ede8' }}>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#6b879c' }}>Budget Range</h3>
              <div className="flex items-center justify-between text-xs mb-2" style={{ color: '#928d64' }}>
                <span className="px-2 py-0.5 rounded" style={{ background: '#f0ede8' }}>LKR 500K</span>
                <span className="px-2 py-0.5 rounded" style={{ background: '#f0ede8' }}>LKR 5M</span>
              </div>
              <input
                id="budget-range-slider"
                type="range"
                min={500000}
                max={5000000}
                step={100000}
                defaultValue={5000000}
                className="nb-range-slider w-full cursor-pointer"
              />
            </div>

            {/* Minimum Rating */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#6b879c' }}>Minimum Rating</h3>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setMinRating(star)}
                    className="text-lg transition-transform hover:scale-110"
                    title={`${star} Stars`}
                  >
                    {star <= minRating ? '⭐' : '☆'}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Right: Firm Grid ───────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Listing header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: '#1d1d1d' }}>
                Architecture Firms
              </h2>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" style={{ color: '#928d64' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="14" y2="12" /><line x1="4" y1="18" x2="10" y2="18" />
                </svg>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border rounded-lg px-3 py-2 font-medium"
                  style={{ borderColor: '#e6e0d4', color: '#1d1d1d', background: '#fff', outline: 'none' }}
                >
                  <option>Top Rated</option>
                  <option>Most Projects</option>
                  <option>Most Experienced</option>
                </select>
              </div>
            </div>

            {/* Cards grid or empty state */}
            {sorted.length === 0 ? (
              <div
                className="rounded-2xl p-16 text-center"
                style={{ background: '#fff', border: '1px solid #e6e0d4' }}
              >
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-semibold" style={{ color: '#1d1d1d' }}>No firms match your filters</p>
                <p className="text-sm mt-1" style={{ color: '#6b879c' }}>Try adjusting your criteria</p>
                <button
                  onClick={clearAll}
                  className="mt-4 px-6 py-2 rounded-xl text-sm font-semibold text-white"
                  style={{ background: '#345b79' }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sorted.map((firm) => (
                  <FirmCard key={firm.id} firm={firm} />
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                id="page-prev"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 rounded-lg border flex items-center justify-center text-sm disabled:opacity-40 transition-colors"
                style={{ borderColor: '#e6e0d4', color: '#6b879c', background: '#fff' }}
              >
                ‹
              </button>
              {[1, 2, 3, 4].map((page) => (
                <button
                  key={page}
                  id={`page-${page}`}
                  onClick={() => setCurrentPage(page)}
                  className="w-9 h-9 rounded-lg border text-sm font-medium transition-all"
                  style={{
                    borderColor: currentPage === page ? '#345b79' : '#e6e0d4',
                    background: currentPage === page ? '#345b79' : '#fff',
                    color: currentPage === page ? '#fff' : '#1d1d1d',
                  }}
                >
                  {page}
                </button>
              ))}
              <span className="text-sm px-1" style={{ color: '#ccb7a3' }}>…</span>
              <button
                className="w-9 h-9 rounded-lg border text-sm font-medium"
                style={{ borderColor: '#e6e0d4', color: '#1d1d1d', background: '#fff' }}
              >
                26
              </button>
              <button
                id="page-next"
                onClick={() => setCurrentPage((p) => p + 1)}
                className="w-9 h-9 rounded-lg border flex items-center justify-center text-sm transition-colors"
                style={{ borderColor: '#e6e0d4', color: '#6b879c', background: '#fff' }}
              >
                ›
              </button>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}

export default ArchitecturePage
