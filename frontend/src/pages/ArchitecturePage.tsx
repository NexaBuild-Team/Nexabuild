// src/pages/ArchitecturePage.tsx
// Route: /architecture
// Hero landing page for the Architecture Module — search + filter pills
import { useState } from 'react'
import { useNavigate } from 'react-router'


const quickFilters = ['Colombo', 'Kandy', 'Galle', 'Negombo', 'Residential', 'Commercial']

const stats = [
  { value: '500+', label: 'Verified Architects' },
  { value: '2,400+', label: 'Design Projects' },
  { value: '26', label: 'Districts Covered' },
  { value: '98%', label: 'Client Satisfaction' },
]

function ArchitecturePage() {
  const navigate = useNavigate()
  const [searchName, setSearchName] = useState('')
  const [searchCompany, setSearchCompany] = useState('')
  const [searchCity, setSearchCity] = useState('')
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  const handleSearch = () => {
    navigate('/architects')
  }

  const handleFilterClick = (filter: string) => {
    setActiveFilter((prev) => (prev === filter ? null : filter))
    setSearchCity(filter === activeFilter ? '' : filter)
    navigate('/architects')
  }

  return (
    <>
      {/* ── Hero Section ────────────────────────────────────── */}
      <section
        className="nb-gradient-hero relative overflow-hidden pt-24"
        style={{ minHeight: '520px' }}
      >
        {/* Decorative background circles */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{ background: '#6b879c', transform: 'translate(30%, -30%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10"
          style={{ background: '#be5d3f', transform: 'translate(-30%, 30%)' }}
        />

        <div className="max-w-4xl mx-auto px-6 pt-16 pb-20 flex flex-col items-center text-center relative z-10">
          {/* AI Badge */}
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold tracking-widest uppercase mb-8"
            style={{ background: 'rgba(107,135,156,0.25)', color: '#d59b86', border: '1px solid rgba(107,135,156,0.4)' }}
          >
            <span>⚡</span>
            <span>AI-Powered Architecture Discovery</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
            Find the Right Architect<br />
            <span style={{ color: '#d59b86' }}>for Your Dream Home</span>
          </h1>
          <p className="text-lg max-w-2xl mb-12" style={{ color: '#ccb7a3' }}>
            Browse Sri Lanka's leading architecture firms and discover award-winning residential and
            commercial designs tailored to your lifestyle.
          </p>

          {/* ── Search Bar ──────────────────────────────────── */}
          <div
            className="w-full max-w-3xl rounded-2xl p-4 flex flex-col md:flex-row items-center gap-3"
            style={{ background: '#fff', boxShadow: '0 24px 60px rgba(52,91,121,0.22)' }}
          >
            {/* Field: Architect / Firm */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <svg className="w-4 h-4 shrink-0" style={{ color: '#6b879c' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                id="arch-search-name"
                type="text"
                placeholder="Architect Name or Firm"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="nb-input border-0 p-0 focus:ring-0 text-sm"
                style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
              />
            </div>

            <div className="w-px h-8 hidden md:block" style={{ background: '#ccb7a3' }} />

            {/* Field: Company */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <svg className="w-4 h-4 shrink-0" style={{ color: '#6b879c' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              </svg>
              <input
                id="arch-search-company"
                type="text"
                placeholder="Company"
                value={searchCompany}
                onChange={(e) => setSearchCompany(e.target.value)}
                className="nb-input border-0 p-0 focus:ring-0 text-sm"
                style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
              />
            </div>

            <div className="w-px h-8 hidden md:block" style={{ background: '#ccb7a3' }} />

            {/* Field: City / District */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <svg className="w-4 h-4 shrink-0" style={{ color: '#6b879c' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <input
                id="arch-search-city"
                type="text"
                placeholder="City or District"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="nb-input border-0 p-0 focus:ring-0 text-sm"
                style={{ border: 'none', outline: 'none', boxShadow: 'none' }}
              />
            </div>

            <button
              id="arch-search-btn"
              onClick={handleSearch}
              className="nb-btn-primary flex items-center gap-2 shrink-0 w-full md:w-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              Search
            </button>
          </div>

          {/* ── Quick Filter Pills ───────────────────────────── */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {quickFilters.map((filter) => (
              <button
                key={filter}
                id={`filter-pill-${filter.toLowerCase()}`}
                onClick={() => handleFilterClick(filter)}
                className={`nb-pill ${activeFilter === filter ? 'active' : ''}`}
                style={
                  activeFilter === filter
                    ? { background: '#345b79', borderColor: '#345b79', color: '#fff' }
                    : { color: '#ccb7a3', borderColor: 'rgba(204,183,163,0.4)', background: 'rgba(255,255,255,0.10)' }
                }
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Strip ─────────────────────────────────────── */}
      <section style={{ background: '#fff', borderBottom: '1px solid #ccb7a3' }}>
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center">
              <span className="text-3xl font-bold" style={{ color: '#345b79' }}>{stat.value}</span>
              <span className="text-sm mt-1" style={{ color: '#928d64' }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why NexaBuild Architecture ───────────────────────── */}
      <section className="py-16 px-6" style={{ background: '#e6e0d4' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#be5d3f' }}>Why Choose Us</span>
            <h2 className="text-3xl font-bold mt-2" style={{ color: '#1d1d1d' }}>
              The Smarter Way to Find Your Architect
            </h2>
            <p className="mt-3 text-base max-w-xl mx-auto" style={{ color: '#928d64' }}>
              Our AI-powered platform matches your style, budget, and location preferences to the perfect firm.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🤖', title: 'AI-Powered Matching', desc: 'Our algorithm analyses your requirements and recommends the best-suited architects in seconds.' },
              { icon: '✅', title: 'Verified Professionals', desc: "Every firm is background-checked and verified with Sri Lanka's Institute of Architects (SLIA)." },
              { icon: '💬', title: 'Direct Communication', desc: 'Chat, email, or book consultations directly through the platform — no middlemen.' },
            ].map((feature) => (
              <div
                key={feature.title}
                className="nb-card-hover nb-card-shadow rounded-2xl p-8"
                style={{ background: '#fff', border: '1px solid #ccb7a3' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5"
                  style={{ background: 'rgba(52,91,121,0.10)' }}
                >
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2" style={{ color: '#1d1d1d' }}>{feature.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#928d64' }}>{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="browse-architects-btn"
              onClick={() => navigate('/architects')}
              className="nb-btn-primary px-8 py-3 text-base"
            >
              Browse Architecture Firms
            </button>
            <button
              id="browse-designs-btn"
              onClick={() => navigate('/designs')}
              className="nb-btn-outline px-8 py-3 text-base"
            >
              Explore House Designs
            </button>
          </div>
        </div>
      </section>

      
    </>
  )
}

export default ArchitecturePage
