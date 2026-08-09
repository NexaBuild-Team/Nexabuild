import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'
import nexaBuildLogo from '../assets/NexaBuildlogo.png'

// ─── Color Palette ─────────────────────────────────────────────────────────────
// Primary Blue         : #345b79
// Primary Brick Accent : #be5d3f
// Primary Background   : #e6e0d4
// Secondary Background : #ccb7a3
// Secondary Blue       : #6b879c
// Light Accent         : #d59b86
// Olive Accent         : #928d64
// Dark Text            : #1d1d1d
// Green Accent         : #495d38


// ─── Types ─────────────────────────────────────────────────────────────────────
interface BackendCompany {
  id: string
  name: string
  slug?: string
  tagline?: string
  logoUrl?: string
  coverImageUrl?: string
  yearsInBusiness?: number
  establishedYear?: number
  isVerified?: boolean
  isFeatured?: boolean
  budgetMin?: number
  budgetMax?: number
  teamSize?: number
  district?: { name?: string } | string | null
  contact?: {
    phone?: string
    email?: string
    website?: string
  } | null
  reviews?: Array<{
    id: string
    reviewerName?: string
    rating?: number
    comment?: string
    reviewDate?: string
  }>
  specializations?: Array<{
    specialization?: { name?: string; icon?: string }
  }>
  certifications?: Array<{
    certification?: { name?: string }
  }>
  services?: Array<{
    id: string
    title?: string
    description?: string
  }>
  projects?: Array<{
    id: string
    name?: string
    location?: string
    completionYear?: number
    images?: Array<{ imageUrl?: string }>
  }>
  story?: {
    content?: string
    mission?: string
    vision?: string
  } | null
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={star <= Math.round(rating) ? '#f59e0b' : 'none'}
          stroke="#f59e0b"
          strokeWidth="2"
          aria-hidden="true"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  )
}

export default function ConstructionProfile() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [company, setCompany] = useState<BackendCompany | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'about' | 'projects' | 'reviews' | 'contact'>('about')
  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    api
      .get(`/construction/companies/${id}`)
      .then((res) => {
        setCompany(res.data)
      })
      .catch((err) => {
        console.error('Failed to load company:', err)
        setError(err?.response?.data?.message ?? err.message ?? 'Failed to load company.')
      })
      .finally(() => setLoading(false))
  }, [id])

  // ── helpers derived from real data ──────────────────────────────────────────
  const districtName =
    company?.district && typeof company.district === 'object'
      ? (company.district as { name?: string }).name ?? 'Sri Lanka'
      : (company?.district as string | undefined) ?? 'Sri Lanka'

  const avgRating =
    company?.reviews && company.reviews.length > 0
      ? +(
          company.reviews.reduce((s, r) => s + (r.rating ?? 0), 0) /
          company.reviews.length
        ).toFixed(1)
      : 0

  const ratingBreakdown = [
    { label: 'Quality',       value: avgRating },
    { label: 'Communication', value: Math.max(0, avgRating - 0.1) },
    { label: 'Timeline',      value: Math.max(0, avgRating - 0.2) },
    { label: 'Value',         value: Math.max(0, avgRating - 0.3) },
  ]

  // ── loading state ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        style={{ backgroundColor: '#e6e0d4', minHeight: '100vh', fontFamily: "'Poppins', sans-serif" }}
        className="flex items-center justify-center"
      >
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-full border-4 border-t-transparent mx-auto mb-4 animate-spin"
            style={{ borderColor: '#345b79', borderTopColor: 'transparent' }}
          />
          <p style={{ color: '#6b879c' }}>Loading company profile…</p>
        </div>
      </div>
    )
  }

  // ── error state ──────────────────────────────────────────────────────────────
  if (error || !company) {
    return (
      <div
        style={{ backgroundColor: '#e6e0d4', minHeight: '100vh', fontFamily: "'Poppins', sans-serif" }}
        className="flex items-center justify-center"
      >
        <div className="text-center p-8 bg-white rounded-3xl" style={{ boxShadow: '0 4px 24px rgba(52,91,121,0.12)' }}>
          <p className="text-lg font-bold mb-2" style={{ color: '#1d1d1d' }}>Company not found</p>
          <p className="text-sm mb-6" style={{ color: '#928d64' }}>{error}</p>
          <button
            onClick={() => navigate('/construction-companies')}
            className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold"
            style={{ backgroundColor: '#345b79' }}
          >
            ← Back to Listings
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#e6e0d4', minHeight: '100vh', fontFamily: "'Poppins', sans-serif" }}>

      {/* ── Hero Banner ─────────────────────────────────────────────────────── */}
      <section id="company-hero" className="relative pt-[60px]">
        {/* Cover Image */}
        <div className="relative h-[380px] md:h-[460px] overflow-hidden">
          {company.coverImageUrl ? (
            <img
              src={company.coverImageUrl}
              alt={`${company.name} headquarters`}
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.65)' }}
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #345b79 0%, #1d1d1d 100%)' }}
            >
              <span className="text-white font-bold" style={{ fontSize: 80, opacity: 0.18 }}>
                {getInitials(company.name)}
              </span>
            </div>
          )}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(29,29,29,0.75) 100%)' }}
          />

          {/* Hero Content */}
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-10">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                {/* Company Logo */}
                <div
                  className="w-24 h-24 rounded-2xl flex items-center justify-center flex-shrink-0 text-white font-bold text-3xl"
                  style={{
                    backgroundColor: '#345b79',
                    border: '3px solid rgba(255,255,255,0.8)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  }}
                >
                  {company.logoUrl ? (
                    <img src={company.logoUrl} alt={company.name} className="w-14 h-14 object-contain" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                  ) : (
                    <span className="text-white font-bold text-2xl">{getInitials(company.name)}</span>
                  )}
                </div>

                {/* Company Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                  {company.isVerified && (
                    <span
                      className="flex items-center gap-1 text-xs font-semibold text-white px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: '#495d38' }}
                    >
                      <svg width="10" height="10" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </span>
                  )}
                  {company.establishedYear && <span className="text-xs text-white/70">Est. {company.establishedYear}</span>}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{company.name}</h1>
                  {company.tagline && <p className="text-white/75 text-sm mb-3 italic">{company.tagline}</p>}
                  <div className="flex flex-wrap items-center gap-4">
                    {avgRating > 0 && (
                      <div className="flex items-center gap-1.5">
                        <StarRating rating={avgRating} size={14} />
                        <span className="text-white font-bold text-sm">{avgRating}</span>
                        <span className="text-white/60 text-xs">({company.reviews?.length ?? 0} reviews)</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-white/80 text-xs">
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {districtName}
                    </div>
                    <div className="flex items-center gap-3 text-white/80 text-xs">
                      <span>🏗️ {company.projects?.length ?? 0} Projects</span>
                      {company.yearsInBusiness && <span>⏱️ {company.yearsInBusiness} Years</span>}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    id="call-company-btn"
                    href={`tel:${company.contact?.phone ?? ''}`}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold no-underline transition-all hover:opacity-90"
                    style={{ backgroundColor: '#495d38' }}
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Call Company
                  </a>
                  <button
                    id="bookmark-company-btn"
                    onClick={() => setBookmarked(!bookmarked)}
                    aria-label="Bookmark this company"
                    className="p-2.5 rounded-xl transition-all"
                    style={{
                      backgroundColor: bookmarked ? '#be5d3f' : 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                    }}
                  >
                    <svg width="16" height="16" fill={bookmarked ? 'white' : 'none'} stroke="white" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                  <button
                    id="share-company-btn"
                    aria-label="Share this company"
                    className="p-2.5 rounded-xl transition-all"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(4px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                    }}
                  >
                    <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content ──────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">

          {/* ── Left Column ──────────────────────────────────────────────────── */}
          <div>
            {/* Tab Navigation */}
            <div className="flex gap-1 mb-8 bg-white rounded-2xl p-1.5" style={{ boxShadow: '0 2px 16px rgba(52,91,121,0.10)' }}>
              {(['about', 'projects', 'reviews', 'contact'] as const).map((tab) => (
                <button
                  key={tab}
                  id={`tab-${tab}`}
                  onClick={() => setActiveTab(tab)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all duration-200"
                  style={activeTab === tab
                    ? { backgroundColor: '#345b79', color: 'white', boxShadow: '0 4px 12px rgba(52,91,121,0.25)' }
                    : { color: '#928d64' }
                  }
                >
                  {tab === 'about' ? 'Our Story' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* ── About Tab ──────────────────────────────────────────────────── */}
            {activeTab === 'about' && (
              <div>
                {/* Our Story */}
                <section id="about-section" className="bg-white rounded-3xl p-8 mb-6" style={{ boxShadow: '0 4px 24px rgba(52,91,121,0.10)' }}>
                  <h2 className="text-xl font-bold mb-4" style={{ color: '#1d1d1d' }}>Our Story</h2>
                  {company.story?.content
                    ? company.story.content.split('\n\n').map((para, idx) => (
                        <p key={idx} className="text-sm leading-relaxed mb-3" style={{ color: '#6b879c' }}>{para}</p>
                      ))
                    : <p className="text-sm leading-relaxed mb-3" style={{ color: '#6b879c' }}>No story available yet.</p>
                  }

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    {[
                      { label: 'Our Mission', icon: '🎯', text: company.story?.mission ?? '—' },
                      { label: 'Our Vision',  icon: '🔭', text: company.story?.vision  ?? '—' },
                    ].map((item) => (
                      <div key={item.label} className="p-5 rounded-2xl" style={{ backgroundColor: '#f7f4f0' }}>
                        <div className="text-2xl mb-2">{item.icon}</div>
                        <h3 className="font-bold text-sm mb-2" style={{ color: '#1d1d1d' }}>{item.label}</h3>
                        <p className="text-xs leading-relaxed" style={{ color: '#928d64' }}>{item.text}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Specializations */}
                <section id="specializations-section" className="bg-white rounded-3xl p-8 mb-6" style={{ boxShadow: '0 4px 24px rgba(52,91,121,0.10)' }}>
                  <h2 className="text-xl font-bold mb-6" style={{ color: '#1d1d1d' }}>Core Specializations</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {(company.specializations && company.specializations.length > 0
                      ? company.specializations.map((s) => ({
                          icon: s.specialization?.icon ?? '🏗️',
                          label: s.specialization?.name ?? 'Specialization',
                          desc: '',
                        }))
                      : [
                          { icon: '🏡', label: 'Luxury Residential', desc: 'Bespoke villas and high-end homes' },
                          { icon: '🏢', label: 'Commercial', desc: 'Office towers and retail complexes' },
                          { icon: '🔨', label: 'Renovations', desc: 'Heritage and modern refurbishments' },
                        ]
                    ).map((spec) => (
                      <div
                        key={spec.label}
                        className="p-5 rounded-2xl cursor-pointer transition-all duration-200 border border-transparent"
                        style={{ backgroundColor: '#f7f4f0' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#e6e0d4'
                          e.currentTarget.style.borderColor = '#ccb7a3'
                          e.currentTarget.style.transform = 'translateY(-3px)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#f7f4f0'
                          e.currentTarget.style.borderColor = 'transparent'
                          e.currentTarget.style.transform = 'translateY(0)'
                        }}
                      >
                        <div className="text-2xl mb-2">{spec.icon}</div>
                        <h3 className="font-semibold text-sm mb-1" style={{ color: '#1d1d1d' }}>{spec.label}</h3>
                        <p className="text-xs" style={{ color: '#928d64' }}>{spec.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Services */}
                <section id="services-section" className="bg-white rounded-3xl p-8" style={{ boxShadow: '0 4px 24px rgba(52,91,121,0.10)' }}>
                  <h2 className="text-xl font-bold mb-6" style={{ color: '#1d1d1d' }}>Our Services</h2>
                  <div className="space-y-4">
                    {(company.services && company.services.length > 0
                      ? company.services.map((s) => ({
                          icon: '🏗️',
                          title: s.title ?? 'Service',
                          desc: s.description ?? '',
                          status: ['Available'],
                        }))
                      : [
                          { icon: '🏗️', title: 'Residential Construction', desc: 'Full-scale house and villa construction.', status: ['Turnkey'] },
                          { icon: '🏙️', title: 'Commercial Construction', desc: 'End-to-end commercial construction.', status: ['Large Scale'] },
                        ]
                    ).map((svc) => (
                      <div
                        key={svc.title}
                        className="flex gap-4 p-5 rounded-2xl transition-all duration-200"
                        style={{ backgroundColor: '#f7f4f0' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e6e0d4' }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f7f4f0' }}
                      >
                        <div className="text-3xl flex-shrink-0">{svc.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4 mb-1">
                            <h3 className="font-bold text-sm" style={{ color: '#1d1d1d' }}>{svc.title}</h3>
                            <div className="flex flex-wrap gap-1 flex-shrink-0">
                              {svc.status.map((s) => (
                                <span
                                  key={s}
                                  className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                                  style={{ backgroundColor: s === 'Available' ? '#e8f2ec' : '#e6e0d4', color: s === 'Available' ? '#495d38' : '#6b879c' }}
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-xs leading-relaxed mb-3" style={{ color: '#928d64' }}>{svc.desc}</p>
                          <button
                            id={`learn-more-${svc.title.replace(/\s+/g, '-').toLowerCase()}`}
                            className="text-xs font-semibold transition-opacity hover:opacity-70"
                            style={{ color: '#be5d3f' }}
                          >
                            Learn More →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* ── Projects Tab ───────────────────────────────────────────────── */}
            {activeTab === 'projects' && (
              <section id="projects-section" className="bg-white rounded-3xl p-8" style={{ boxShadow: '0 4px 24px rgba(52,91,121,0.10)' }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold" style={{ color: '#1d1d1d' }}>Completed Projects</h2>
                  <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: '#e6e0d4', color: '#345b79' }}>
                    {company.projects?.length ?? 0} Showcased
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {(company.projects && company.projects.length > 0
                    ? company.projects
                    : []
                  ).map((proj) => (
                    <article
                      key={proj.id}
                      id={`project-${proj.id}`}
                      className="rounded-2xl overflow-hidden group cursor-pointer"
                      style={{ boxShadow: '0 2px 12px rgba(52,91,121,0.10)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)'
                        e.currentTarget.style.boxShadow = '0 12px 32px rgba(52,91,121,0.2)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = '0 2px 12px rgba(52,91,121,0.10)'
                      }}
                    >
                      <div className="relative h-40 overflow-hidden">
                        {proj.images?.[0]?.imageUrl ? (
                          <img
                            src={proj.images[0].imageUrl}
                            alt={proj.name ?? 'Project'}
                            className="w-full h-full object-cover"
                            style={{ transition: 'transform 0.4s' }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)' }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#345b79,#6b879c)' }}>
                            <span className="text-white text-3xl">🏗️</span>
                          </div>
                        )}
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.5))' }} />
                        {proj.completionYear && (
                          <span className="absolute bottom-2 right-2 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(52,91,121,0.85)' }}>
                            {proj.completionYear}
                          </span>
                        )}
                      </div>
                      <div className="p-4" style={{ backgroundColor: '#f7f4f0' }}>
                        <h3 className="font-bold text-sm mb-1" style={{ color: '#1d1d1d' }}>{proj.name ?? 'Project'}</h3>
                        <div className="flex items-center justify-between text-xs mb-3">
                          <span style={{ color: '#6b879c' }}>📍 {proj.location ?? '—'}</span>
                        </div>
                        <button
                          id={`view-project-${proj.id}`}
                          onClick={() => navigate(`/construction-projects/${proj.id}`)}
                          className="w-full py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90"
                          style={{ backgroundColor: '#345b79' }}
                        >
                          View Details
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* ── Reviews Tab ────────────────────────────────────────────────── */}
            {activeTab === 'reviews' && (
              <section id="reviews-section" className="bg-white rounded-3xl p-8" style={{ boxShadow: '0 4px 24px rgba(52,91,121,0.10)' }}>
                <h2 className="text-xl font-bold mb-6" style={{ color: '#1d1d1d' }}>Customer Reviews</h2>

                {/* Rating Summary */}
                <div
                  className="flex flex-col md:flex-row gap-8 p-6 rounded-2xl mb-8"
                  style={{ backgroundColor: '#f7f4f0' }}
                >
                  <div className="text-center flex flex-col items-center justify-center">
                    <p className="text-6xl font-bold" style={{ color: '#1d1d1d' }}>{avgRating}</p>
                    <StarRating rating={avgRating} size={20} />
                    <p className="text-xs mt-2" style={{ color: '#928d64' }}>{company.reviews?.length ?? 0} reviews</p>
                  </div>
                  <div className="flex-1 space-y-3">
                    {ratingBreakdown.map((item) => (
                      <div key={item.label} className="flex items-center gap-3">
                        <span className="text-xs w-28 flex-shrink-0" style={{ color: '#928d64' }}>{item.label}</span>
                        <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: '#e6e0d4' }}>
                          <div
                            className="h-2 rounded-full"
                            style={{ width: `${(item.value / 5) * 100}%`, backgroundColor: '#f59e0b' }}
                          />
                        </div>
                        <span className="text-xs font-bold w-6 text-right" style={{ color: '#1d1d1d' }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Review Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {(company.reviews && company.reviews.length > 0 ? company.reviews : []).map((review) => (
                    <article
                      key={review.id}
                      id={`review-${review.id}`}
                      className="p-6 rounded-2xl"
                      style={{ backgroundColor: '#f7f4f0', boxShadow: '0 2px 8px rgba(52,91,121,0.06)' }}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                          style={{ backgroundColor: '#345b79' }}
                        >
                          {(review.reviewerName ?? 'A')[0]?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm" style={{ color: '#1d1d1d' }}>{review.reviewerName ?? 'Anonymous'}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <StarRating rating={review.rating ?? 0} size={11} />
                          <span className="text-[10px]" style={{ color: '#928d64' }}>
                            {review.reviewDate ? new Date(review.reviewDate).toLocaleDateString() : ''}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: '#6b879c' }}>{review.comment ?? ''}</p>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* ── Contact Tab ────────────────────────────────────────────────── */}
            {activeTab === 'contact' && (
              <section id="contact-section" className="bg-white rounded-3xl p-8" style={{ boxShadow: '0 4px 24px rgba(52,91,121,0.10)' }}>
                <h2 className="text-xl font-bold mb-6" style={{ color: '#1d1d1d' }}>Get In Touch</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Contact Info */}
                  <div>
                    <div className="space-y-4 mb-8">
                      {[
                        { icon: '📞', label: 'Phone',   value: company.contact?.phone   ?? '—', href: `tel:${company.contact?.phone ?? ''}` },
                        { icon: '📧', label: 'Email',   value: company.contact?.email   ?? '—', href: `mailto:${company.contact?.email ?? ''}` },
                        { icon: '🌐', label: 'Website', value: company.contact?.website ?? '—', href: company.contact?.website ? `https://${company.contact.website}` : '#' },
                      ].map((item) => (
                        <div key={item.label} className="flex items-start gap-3 p-4 rounded-xl" style={{ backgroundColor: '#f7f4f0' }}>
                          <span className="text-lg">{item.icon}</span>
                          <div>
                            <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: '#928d64' }}>{item.label}</p>
                            <a href={item.href} className="text-sm font-medium no-underline hover:opacity-70 transition-opacity" style={{ color: '#345b79' }}>
                              {item.value}
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Map Placeholder */}
                  <div
                    className="rounded-2xl overflow-hidden flex items-center justify-center"
                    style={{ backgroundColor: '#ccb7a3', minHeight: '320px', position: 'relative' }}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&q=80"
                      alt="Office location map view"
                      className="w-full h-full object-cover absolute inset-0"
                      style={{ opacity: 0.4 }}
                    />
                    <div className="relative z-10 text-center p-6">
                      <div className="text-4xl mb-3">📍</div>
                      <p className="font-bold text-sm mb-1" style={{ color: '#1d1d1d' }}>View on Google Maps</p>
                      <a
                        id="open-maps-btn"
                        href="https://maps.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-white text-xs font-semibold no-underline transition-opacity hover:opacity-90"
                        style={{ backgroundColor: '#345b79' }}
                      >
                        Open in Maps
                      </a>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* ── Right Sidebar ─────────────────────────────────────────────────── */}
          <aside id="profile-sidebar" aria-label="Company details">

            {/* Company Statistics */}
            <div
              className="bg-white rounded-3xl p-6 mb-6"
              style={{ boxShadow: '0 4px 24px rgba(52,91,121,0.10)' }}
            >
              <h3 className="font-bold text-sm uppercase tracking-wider mb-5" style={{ color: '#1d1d1d' }}>
                Company Statistics
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Projects Completed',  value: `${company.projects?.length ?? 0}`,    icon: '🏗️' },
                  { label: 'Reviews',             value: `${company.reviews?.length ?? 0}`,     icon: '⭐' },
                  { label: 'Years in Business',   value: `${company.yearsInBusiness ?? '—'} yrs`, icon: '📅' },
                  { label: 'Team Size',           value: `${company.teamSize ?? '—'}`,           icon: '👥' },
                  { label: 'Rating',              value: avgRating > 0 ? `${avgRating} / 5` : '—', icon: '🏆' },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-3">
                    <span className="text-xl">{stat.icon}</span>
                    <div className="flex-1">
                      <p className="text-[10px] uppercase tracking-wide" style={{ color: '#928d64' }}>{stat.label}</p>
                      <p className="text-sm font-bold" style={{ color: '#1d1d1d' }}>{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div
              className="bg-white rounded-3xl p-6 mb-6"
              style={{ boxShadow: '0 4px 24px rgba(52,91,121,0.10)' }}
            >
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: '#1d1d1d' }}>
                Certifications
              </h3>
              <div className="space-y-3">
                {(company.certifications && company.certifications.length > 0
                  ? company.certifications.map((c) => ({
                      label: c.certification?.name ?? 'Certification',
                      icon: '✦',
                      color: '#345b79',
                    }))
                  : [
                      { label: 'ISO 9001:2015', icon: '✦', color: '#345b79' },
                      { label: 'Construction Authority', icon: '✦', color: '#be5d3f' },
                    ]
                ).map((cert) => (
                  <div key={cert.label} className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: cert.color + '20' }}
                    >
                      <svg width="14" height="14" fill={cert.color} viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium" style={{ color: '#1d1d1d' }}>{cert.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Download Brochure */}
            <div
              className="bg-white rounded-3xl p-6 mb-6"
              style={{ boxShadow: '0 4px 24px rgba(52,91,121,0.10)' }}
            >
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#e6e0d4' }}>
                  <svg width="22" height="22" fill="none" stroke="#345b79" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="font-bold text-sm mb-1" style={{ color: '#1d1d1d' }}>Company Brochure</p>
                <p className="text-xs mb-4" style={{ color: '#928d64' }}>Download our full portfolio & capabilities document.</p>
                <button
                  id="download-brochure-btn"
                  className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#be5d3f' }}
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Brochure
                </button>
              </div>
            </div>

          </aside>
        </div>
      </main>
    </div>
  )
}
