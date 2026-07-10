// src/pages/ArchitectsPage.tsx
// Route: /architects
// Architect firm listing with sidebar filters + firm cards grid + pagination
import { useState } from 'react'
import { useNavigate } from 'react-router'


import { architectFirms } from '../services/architectureMockData'

const LOCATIONS = ['Colombo', 'Kandy', 'Galle', 'Negombo', 'Jaffna']
const SPECIALIZATIONS = ['Residential', 'Commercial', 'Interior Design', 'Sustainable Design']
const EXPERIENCE_OPTIONS = ['1 – 5 Years', '5 – 10 Years', '10 – 20 Years', '20+ Years']

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className="w-3.5 h-3.5"
          viewBox="0 0 20 20"
          fill={star <= Math.round(rating) ? '#928d64' : '#ccb7a3'}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function FirmCard({ firm }: { firm: typeof architectFirms[0] }) {
  const navigate = useNavigate()
  return (
    <article
      className="nb-card-hover nb-card-shadow rounded-2xl overflow-hidden"
      style={{ background: '#fff', border: '1px solid #ccb7a3' }}
    >
      {/* Cover image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={firm.coverImage}
          alt={firm.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* Avatar */}
        <img
          src={firm.avatar}
          alt={`${firm.name} principal`}
          className="absolute bottom-3 left-4 w-12 h-12 rounded-full object-cover border-2 border-white"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}
        />
      </div>

      <div className="p-5">
        {/* Name + Rating */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-base leading-snug" style={{ color: '#1d1d1d' }}>
            {firm.name}
          </h3>
          <div
            className="flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold"
            style={{ background: 'rgba(52,91,121,0.10)', color: '#345b79' }}
          >
            <span>⭐</span>
            <span>{firm.rating}</span>
            <span style={{ color: '#ccb7a3' }}>({firm.reviewCount})</span>
          </div>
        </div>

        {/* Location */}
        <p className="text-xs flex items-center gap-1 mb-3" style={{ color: '#928d64' }}>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          {firm.location}, {firm.country}
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-4 py-3 border-y mb-3" style={{ borderColor: '#e6e0d4' }}>
          <div className="text-center">
            <p className="font-bold text-sm" style={{ color: '#1d1d1d' }}>{firm.experience}+ yrs</p>
            <p className="text-xs" style={{ color: '#6b879c' }}>Experience</p>
          </div>
          <div className="w-px h-8" style={{ background: '#e6e0d4' }} />
          <div className="text-center">
            <p className="font-bold text-sm" style={{ color: '#1d1d1d' }}>{firm.projectCount}</p>
            <p className="text-xs" style={{ color: '#6b879c' }}>Projects</p>
          </div>
          <div className="w-px h-8" style={{ background: '#e6e0d4' }} />
          <div className="text-center flex-1">
            <StarRating rating={firm.rating} />
            <p className="text-xs mt-0.5" style={{ color: '#6b879c' }}>Rating</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs leading-relaxed line-clamp-2 mb-4" style={{ color: '#928d64' }}>
          {firm.description}
        </p>

        {/* Specialization tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {firm.specializations.map((spec) => (
            <span
              key={spec}
              className="px-2.5 py-1 rounded-full text-xs font-medium"
              style={{ background: '#e6e0d4', color: '#345b79' }}
            >
              {spec}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Primary — Blue */}
          <button
            id={`view-profile-${firm.id}`}
            onClick={() => navigate(`/architects/${firm.id}`)}
            className="nb-btn-primary flex-1 text-sm py-2.5"
          >
            View Profile
          </button>
          {/* Email icon — subtle */}
          <a
            href={`mailto:${firm.email}`}
            className="w-10 h-10 rounded-lg flex items-center justify-center border transition-all"
            style={{ border: '1.5px solid #ccb7a3', color: '#6b879c' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#345b79' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#ccb7a3' }}
            title="Send Email"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
            </svg>
          </a>
          {/* Bookmark icon — secondary brick accent on active */}
          <button
            className="w-10 h-10 rounded-lg flex items-center justify-center border transition-all"
            style={{ border: '1.5px solid #ccb7a3', color: '#6b879c' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#be5d3f'; (e.currentTarget as HTMLButtonElement).style.color = '#be5d3f' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#ccb7a3'; (e.currentTarget as HTMLButtonElement).style.color = '#6b879c' }}
            title="Save Firm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
        </div>
      </div>
    </article>
  )
}

function ArchitectsPage() {
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null)
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([])
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState('Top Rated')
  const [currentPage, setCurrentPage] = useState(1)

  const toggleLocation = (loc: string) =>
    setSelectedLocations((prev) => prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc])

  const toggleSpec = (spec: string) =>
    setSelectedSpecs((prev) => prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec])

  const clearAll = () => {
    setSelectedLocations([])
    setSelectedExperience(null)
    setSelectedSpecs([])
    setMinRating(0)
  }

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

  return (
    <>
      {/* ── Hero Sub-Banner ─────────────────────────────────── */}
      <section className="nb-gradient-hero py-12 px-6 pt-24">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#d59b86' }}>Architecture Module</span>
          <h1 className="text-3xl font-bold text-white mt-1">Architecture Companies</h1>
          <p className="mt-2" style={{ color: '#ccb7a3' }}>Discover Sri Lanka's top-rated architecture firms and studios.</p>
          <div className="flex flex-wrap gap-2 mt-5">
            {['Browse Architects', 'Browse Designs'].map((label, i) => (
              <span
                key={label}
                className="px-4 py-1.5 rounded-full text-xs font-semibold border"
                style={{
                  borderColor: 'rgba(255,255,255,0.2)',
                  color: i === 0 ? '#fff' : '#ccb7a3',
                  background: i === 0 ? 'rgba(52,91,121,0.55)' : 'rgba(255,255,255,0.05)',
                  cursor: 'default',
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Content ─────────────────────────────────────── */}
      <main className="flex-1 py-10 px-6" style={{ background: '#e6e0d4' }}>
        <div className="max-w-7xl mx-auto flex gap-8 items-start">

          {/* ── Sidebar Filters ─────────────────────────────── */}
          <aside
            className="hidden lg:block w-64 shrink-0 rounded-2xl p-6 sticky top-24 nb-card-shadow"
            style={{ background: '#fff', border: '1px solid #ccb7a3' }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-sm" style={{ color: '#1d1d1d' }}>Filters</h2>
              <button
                id="clear-all-filters"
                onClick={clearAll}
                className="text-xs font-medium transition-colors hover:underline"
                style={{ color: '#be5d3f' }}
              >
                Clear All
              </button>
            </div>

            {/* Location */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6b879c' }}>Location</h3>
              {LOCATIONS.map((loc) => (
                <label key={loc} className="flex items-center gap-2 py-1.5 cursor-pointer">
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
            <div className="mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6b879c' }}>Years of Experience</h3>
              {EXPERIENCE_OPTIONS.map((opt) => (
                <label key={opt} className="flex items-center gap-2 py-1.5 cursor-pointer">
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
            <div className="mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6b879c' }}>Specialization</h3>
              {SPECIALIZATIONS.map((spec) => (
                <label key={spec} className="flex items-center gap-2 py-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    id={`filter-spec-${spec.replace(' ', '-').toLowerCase()}`}
                    checked={selectedSpecs.includes(spec)}
                    onChange={() => toggleSpec(spec)}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: '#345b79' }}
                  />
                  <span className="text-sm" style={{ color: '#1d1d1d' }}>{spec}</span>
                </label>
              ))}
            </div>

            {/* Minimum Rating */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6b879c' }}>Minimum Rating</h3>
              <div className="flex gap-1">
                {[4, 4.5, 5].map((r) => (
                  <button
                    key={r}
                    id={`rating-filter-${r}`}
                    onClick={() => setMinRating((prev) => (prev === r ? 0 : r))}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all"
                    style={{
                      borderColor: minRating === r ? '#345b79' : '#ccb7a3',
                      background: minRating === r ? 'rgba(52,91,121,0.10)' : '#fff',
                      color: minRating === r ? '#345b79' : '#928d64',
                    }}
                  >
                    {r}⭐+
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Firm Grid ────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Sort bar */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold" style={{ color: '#1d1d1d' }}>
                Architecture Companies
                <span className="ml-2 text-sm font-normal" style={{ color: '#6b879c' }}>
                  ({filtered.length} results)
                </span>
              </h2>
              <div className="flex items-center gap-2">
                <label htmlFor="sort-select" className="text-sm" style={{ color: '#928d64' }}>Sort:</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border rounded-lg px-3 py-2 font-medium"
                  style={{ borderColor: '#ccb7a3', color: '#1d1d1d', background: '#fff', outline: 'none' }}
                >
                  <option>Top Rated</option>
                  <option>Most Projects</option>
                  <option>Most Experienced</option>
                </select>
              </div>
            </div>

            {/* Cards */}
            {filtered.length === 0 ? (
              <div className="rounded-2xl p-16 text-center nb-card-shadow" style={{ background: '#fff', border: '1px solid #ccb7a3' }}>
                <p className="text-4xl mb-3">🔍</p>
                <p className="font-semibold" style={{ color: '#1d1d1d' }}>No firms match your filters</p>
                <p className="text-sm mt-1" style={{ color: '#6b879c' }}>Try adjusting your criteria</p>
                <button onClick={clearAll} className="nb-btn-primary mt-4 px-6 py-2 text-sm">Clear Filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((firm) => <FirmCard key={firm.id} firm={firm} />)}
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                id="page-prev"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 rounded-lg border flex items-center justify-center text-sm disabled:opacity-40 transition-colors"
                style={{ borderColor: '#ccb7a3', color: '#6b879c' }}
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
                    borderColor: currentPage === page ? '#345b79' : '#ccb7a3',
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
                style={{ borderColor: '#ccb7a3', color: '#1d1d1d' }}
              >
                26
              </button>
              <button
                id="page-next"
                onClick={() => setCurrentPage((p) => p + 1)}
                className="w-9 h-9 rounded-lg border flex items-center justify-center text-sm transition-colors"
                style={{ borderColor: '#ccb7a3', color: '#6b879c' }}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </main>

      
    </>
  )
}

export default ArchitectsPage
