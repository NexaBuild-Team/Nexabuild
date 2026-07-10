// src/pages/DesignsPage.tsx
// Route: /designs
// House design gallery with live search, style filter dropdown, and save/favorite toggle
import { useState, useMemo } from 'react'
import { Link } from 'react-router'


import { houseDesigns, type HouseDesign } from '../services/architectureMockData'

const STYLE_OPTIONS = ['All Styles', 'Modern', 'Minimalist', 'Luxury', 'Sustainable', 'Colonial']
const LOCATION_PILLS = ['All', 'Colombo', 'Kandy', 'Galle', 'Negombo', 'Coastal']

function DesignCard({
  design,
  onToggleSave,
}: {
  design: HouseDesign
  onToggleSave: (id: string) => void
}) {
  return (
    <article
      className="nb-card-hover nb-card-shadow rounded-2xl overflow-hidden group"
      style={{ background: '#fff', border: '1px solid #ccb7a3' }}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={design.imageUrl}
          alt={design.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Style badge */}
        <span
          className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold"
          style={{ background: 'rgba(29,29,29,0.72)', color: '#fff', backdropFilter: 'blur(4px)' }}
        >
          {design.style}
        </span>

        {/* Save / Heart button — brick when saved, white when not */}
        <button
          id={`save-design-${design.id}`}
          onClick={() => onToggleSave(design.id)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            background: design.saved ? '#be5d3f' : 'rgba(255,255,255,0.88)',
            backdropFilter: 'blur(4px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
          title={design.saved ? 'Remove from saved' : 'Save design'}
          aria-label={design.saved ? `Remove ${design.title} from saved` : `Save ${design.title}`}
        >
          <svg
            className="w-4 h-4"
            fill={design.saved ? '#fff' : 'none'}
            stroke={design.saved ? '#fff' : '#be5d3f'}
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* Details */}
      <div className="p-5">
        <Link to={`/designs/${design.id}`} className="hover:underline">
          <h3 className="font-semibold text-base mb-1" style={{ color: '#1d1d1d' }}>
            {design.title}
          </h3>
        </Link>

        <p className="text-xs mb-3" style={{ color: '#928d64' }}>
          by {design.architectName} · {design.architectFirm}
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-3 text-xs mb-4" style={{ color: '#6b879c' }}>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            {design.bedrooms} Beds
          </span>
          <span>·</span>
          <span>{design.bathrooms} Baths</span>
          <span>·</span>
          <span>{design.sqft.toLocaleString()} sqft</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            {design.location}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {design.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded-full text-xs"
              style={{ background: '#e6e0d4', color: '#345b79' }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: '#e6e0d4' }}>
          <div>
            <p className="text-xs" style={{ color: '#6b879c' }}>Starting from</p>
            {/* Price in brick accent */}
            <p className="font-bold text-lg" style={{ color: '#be5d3f' }}>
              ${design.price.toLocaleString()}
            </p>
          </div>
          {/* Primary CTA — blue */}
          <Link
            to={`/designs/${design.id}`}
            id={`view-design-${design.id}`}
            className="nb-btn-primary text-sm py-2 px-5"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  )
}

function DesignsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [styleFilter, setStyleFilter] = useState('All Styles')
  const [locationPill, setLocationPill] = useState('All')
  const [savedDesigns, setSavedDesigns] = useState<Record<string, boolean>>(
    () => Object.fromEntries(houseDesigns.map((d) => [d.id, d.saved]))
  )

  const handleToggleSave = (id: string) => {
    setSavedDesigns((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // Live filtering
  const filteredDesigns = useMemo(() => {
    return houseDesigns
      .map((d) => ({ ...d, saved: savedDesigns[d.id] ?? d.saved }))
      .filter((design) => {
        const q = searchQuery.toLowerCase()
        const matchesSearch =
          !q ||
          design.title.toLowerCase().includes(q) ||
          design.architectName.toLowerCase().includes(q) ||
          design.architectFirm.toLowerCase().includes(q) ||
          design.location.toLowerCase().includes(q)

        const matchesStyle = styleFilter === 'All Styles' || design.style === styleFilter
        const matchesLocation =
          locationPill === 'All' ||
          design.location.toLowerCase().includes(locationPill.toLowerCase()) ||
          design.tags.some((t) => t.toLowerCase().includes(locationPill.toLowerCase()))

        return matchesSearch && matchesStyle && matchesLocation
      })
  }, [searchQuery, styleFilter, locationPill, savedDesigns])

  const savedCount = Object.values(savedDesigns).filter(Boolean).length

  return (
    <>
      {/* ── Sub-Banner ───────────────────────────────────────── */}
      <section className="nb-gradient-hero py-14 px-6 pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-5">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#d59b86' }}>Architecture Module</span>
              <h1 className="text-3xl font-bold text-white mt-1">House Design Gallery</h1>
              <p className="mt-2" style={{ color: '#ccb7a3' }}>Browse award-winning Sri Lankan residential designs.</p>
            </div>
            {savedCount > 0 && (
              <div
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold"
                style={{ background: 'rgba(190,93,63,0.20)', color: '#d59b86', border: '1px solid rgba(190,93,63,0.40)' }}
              >
                ❤️ {savedCount} Saved Design{savedCount > 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* ── Search + Filter Bar ─────────────────────────── */}
          <div
            className="flex flex-col md:flex-row items-center gap-3 rounded-2xl p-4"
            style={{ background: '#fff', boxShadow: '0 20px 50px rgba(52,91,121,0.22)' }}
          >
            {/* Search input */}
            <div className="relative flex-1 w-full">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: '#6b879c' }}
                fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                id="designs-search-input"
                type="text"
                placeholder="Search by design name, architect, or location…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="nb-input pl-10 text-sm"
              />
            </div>

            {/* Style filter dropdown */}
            <select
              id="designs-style-filter"
              value={styleFilter}
              onChange={(e) => setStyleFilter(e.target.value)}
              className="nb-input w-full md:w-48 text-sm"
              style={{ color: '#1d1d1d' }}
            >
              {STYLE_OPTIONS.map((s) => <option key={s}>{s}</option>)}
            </select>

            <button
              id="designs-search-btn"
              className="nb-btn-primary w-full md:w-auto flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              Search
            </button>
          </div>

          {/* Location pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {LOCATION_PILLS.map((pill) => (
              <button
                key={pill}
                id={`loc-pill-${pill.toLowerCase()}`}
                onClick={() => setLocationPill((prev) => (prev === pill ? 'All' : pill))}
                className="nb-pill"
                style={
                  locationPill === pill
                    ? { background: '#345b79', borderColor: '#345b79', color: '#fff' }
                    : { color: '#ccb7a3', borderColor: 'rgba(204,183,163,0.40)', background: 'rgba(255,255,255,0.10)' }
                }
              >
                {pill}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery Grid ─────────────────────────────────────── */}
      <main className="flex-1 py-12 px-6" style={{ background: '#e6e0d4' }}>
        <div className="max-w-7xl mx-auto">
          {/* Results info bar */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold" style={{ color: '#1d1d1d' }}>
                {filteredDesigns.length > 0
                  ? `${filteredDesigns.length} Design${filteredDesigns.length > 1 ? 's' : ''} Found`
                  : 'No Designs Found'}
              </h2>
              {searchQuery && (
                <p className="text-sm mt-0.5" style={{ color: '#6b879c' }}>
                  Results for "<span style={{ color: '#345b79' }}>{searchQuery}</span>"
                </p>
              )}
            </div>
            {(searchQuery || styleFilter !== 'All Styles' || locationPill !== 'All') && (
              <button
                id="clear-design-filters"
                onClick={() => { setSearchQuery(''); setStyleFilter('All Styles'); setLocationPill('All') }}
                className="text-sm font-medium hover:underline"
                style={{ color: '#be5d3f' }}
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Grid */}
          {filteredDesigns.length === 0 ? (
            <div
              className="rounded-2xl p-20 text-center nb-card-shadow"
              style={{ background: '#fff', border: '1px solid #ccb7a3' }}
            >
              <p className="text-5xl mb-4">🏠</p>
              <p className="font-semibold text-lg" style={{ color: '#1d1d1d' }}>No designs match your criteria</p>
              <p className="text-sm mt-2" style={{ color: '#6b879c' }}>Try different keywords or clear the filters</p>
              <button
                onClick={() => { setSearchQuery(''); setStyleFilter('All Styles'); setLocationPill('All') }}
                className="nb-btn-primary mt-5 px-8 py-2.5"
              >
                Show All Designs
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDesigns.map((design) => (
                <DesignCard
                  key={design.id}
                  design={design}
                  onToggleSave={handleToggleSave}
                />
              ))}
            </div>
          )}

          {/* Saved designs summary */}
          {savedCount > 0 && (
            <div
              className="mt-12 rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4"
              style={{ background: 'rgba(190,93,63,0.10)', border: '1px solid rgba(190,93,63,0.30)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ background: '#be5d3f' }}
                >
                  ❤️
                </div>
                <div>
                  <p className="font-semibold" style={{ color: '#1d1d1d' }}>
                    {savedCount} Design{savedCount > 1 ? 's' : ''} Saved to Your Collection
                  </p>
                  <p className="text-sm" style={{ color: '#928d64' }}>Share your shortlist or request a quote from architects.</p>
                </div>
              </div>
              {/* Brick secondary CTA */}
              <button
                id="view-saved-btn"
                className="px-6 py-2.5 text-sm font-semibold rounded-lg text-white transition-all hover:opacity-90"
                style={{ background: '#be5d3f' }}
              >
                View Saved Designs
              </button>
            </div>
          )}
        </div>
      </main>

      
    </>
  )
}

export default DesignsPage
