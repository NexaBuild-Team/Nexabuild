// src/pages/DesignDetailPage.tsx
// Route: /designs/:id
// Full design detail view — Villa Lumina and all related content
import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router'


import { designDetail } from '../services/architectureMockData'

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="w-4 h-4" viewBox="0 0 20 20" fill={i < rating ? '#928d64' : '#ccb7a3'}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function DesignDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const [openPhase, setOpenPhase] = useState<string | null>('Off-Site Interiors')

  const design = designDetail
  if (!design || (id && id !== design.id && id !== 'villa-lumina')) {
    return (
      <>
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-6xl mb-4">🏚️</p>
            <h1 className="text-2xl font-bold mb-2" style={{ color: '#1d1d1d' }}>Design Not Found</h1>
            <p className="mb-6" style={{ color: '#928d64' }}>This design doesn't exist or has been removed.</p>
            <button onClick={() => navigate('/designs')} className="nb-btn-primary px-8 py-3">
              Browse All Designs
            </button>
          </div>
        </main>
      </>
    )
  }

  const statusColors: Record<string, { bg: string; text: string }> = {
    Completed: { bg: '#d4edda', text: '#495d38' },
    'In Progress': { bg: '#fff3cd', text: '#928d64' },
    Planning: { bg: '#d1ecf1', text: '#345b79' },
  }
  const statusStyle = statusColors[design.status] ?? { bg: '#e6e0d4', text: '#928d64' }

  return (
    <>
      

      {/* ── Hero Image ──────────────────────────────────────── */}
      <section className="relative h-80 md:h-96 overflow-hidden pt-32">
        <img
          src={design.heroImage}
          alt={design.title}
          className="w-full h-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(29,29,29,0.88) 0%, rgba(29,29,29,0.3) 60%, transparent 100%)' }} />

        {/* Breadcrumb */}
        <div className="absolute top-32 left-0 right-0 px-6">
          <div className="max-w-7xl mx-auto">
            <nav className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {design.breadcrumb.map((crumb, i) => (
                <span key={crumb} className="flex items-center gap-2">
                  {i > 0 && <span>/</span>}
                  <span style={{ color: i === design.breadcrumb.length - 1 ? '#d59b86' : 'inherit' }}>
                    {crumb}
                  </span>
                </span>
              ))}
            </nav>
          </div>
        </div>

        {/* Title + actions */}
        <div className="absolute bottom-6 left-0 right-0 px-6">
          <div className="max-w-7xl mx-auto flex items-end justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background: statusStyle.bg, color: statusStyle.text }}
                >
                  {design.status}
                </span>
                <span className="text-white text-sm opacity-80">{design.location}</span>
                <span className="text-white text-sm opacity-80">· {design.year}</span>
              </div>
              <h1 className="text-4xl font-bold text-white">{design.title}</h1>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.75)' }}>
                by {design.architectName} · {design.architectFirm}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Save button — brick when saved */}
              <button
                id="save-detail-btn"
                onClick={() => setSaved((s) => !s)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: saved ? '#be5d3f' : 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  backdropFilter: 'blur(6px)',
                  border: '1.5px solid rgba(255,255,255,0.3)',
                }}
              >
                <svg className="w-4 h-4" fill={saved ? '#fff' : 'none'} stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {saved ? 'Saved' : 'Save'}
              </button>
              <button
                id="share-detail-btn"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', backdropFilter: 'blur(6px)', border: '1.5px solid rgba(255,255,255,0.3)' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                Share
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Page Body ────────────────────────────────────────── */}
      <main className="flex-1 py-10 px-6" style={{ background: '#e6e0d4' }}>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start">

          {/* ── Left Column ──────────────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-10">

            {/* Project Overview */}
            <section>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#be5d3f' }}>Overview</span>
              <h2 className="text-2xl font-bold mt-1 mb-4" style={{ color: '#1d1d1d' }}>Project Overview</h2>
              <div className="rounded-2xl p-6 nb-card-shadow" style={{ background: '#fff', border: '1px solid #ccb7a3' }}>
                {design.overview.split('\n\n').map((para, i) => (
                  <p key={i} className="text-sm leading-relaxed mb-3 last:mb-0" style={{ color: '#928d64' }}>
                    {para.trim()}
                  </p>
                ))}
              </div>
            </section>

            {/* Project Gallery */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#be5d3f' }}>Gallery</span>
                  <h2 className="text-2xl font-bold mt-1" style={{ color: '#1d1d1d' }}>Project Gallery</h2>
                </div>
                <button id="view-all-photos-btn" className="nb-btn-outline text-sm py-2 px-5">View All Photos</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {design.gallery.map((img, i) => (
                  <div key={i} className={`overflow-hidden rounded-xl ${i === 0 ? 'col-span-2 row-span-2' : ''} h-40`}>
                    <img
                      src={img}
                      alt={`${design.title} gallery ${i + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* 3D Visualization */}
            <section>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#be5d3f' }}>Virtual Tour</span>
              <h2 className="text-2xl font-bold mt-1 mb-4" style={{ color: '#1d1d1d' }}>3D Visualization</h2>
              <div className="relative rounded-2xl overflow-hidden h-64 md:h-80">
                <img
                  src={design.threeDVisualization}
                  alt="3D Visualization"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(29,29,29,0.50)' }}>
                  {/* Play button — blue primary */}
                  <button
                    id="view-3d-btn"
                    className="flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-semibold text-white transition-all hover:scale-105"
                    style={{ background: '#345b79', boxShadow: '0 8px 30px rgba(52,91,121,0.50)' }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                    View 3D Visualization
                  </button>
                </div>
              </div>
            </section>

            {/* Architectural Floor Plans */}
            <section>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#be5d3f' }}>Plans</span>
              <h2 className="text-2xl font-bold mt-1 mb-4" style={{ color: '#1d1d1d' }}>Architectural Floor Plans</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {design.floorPlans.map((plan, i) => (
                  <div
                    key={i}
                    className="rounded-2xl overflow-hidden nb-card-shadow"
                    style={{ background: '#fff', border: '1px solid #ccb7a3' }}
                  >
                    <img
                      src={plan.image}
                      alt={plan.label}
                      className="w-full h-44 object-cover object-center"
                      loading="lazy"
                    />
                    <p className="px-4 py-3 text-sm font-medium text-center" style={{ color: '#1d1d1d' }}>
                      {plan.label}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Project Features */}
            <section>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#be5d3f' }}>Amenities</span>
              <h2 className="text-2xl font-bold mt-1 mb-4" style={{ color: '#1d1d1d' }}>Project Features</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {design.features.map((feat) => (
                  <div
                    key={feat.label}
                    className="nb-card-hover nb-card-shadow rounded-xl p-4 flex flex-col items-center text-center gap-2"
                    style={{ background: '#fff', border: '1px solid #ccb7a3' }}
                  >
                    <span className="text-2xl">{feat.icon}</span>
                    <span className="text-xs font-medium" style={{ color: '#345b79' }}>{feat.label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Construction Progress */}
            <section>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#be5d3f' }}>Timeline</span>
              <h2 className="text-2xl font-bold mt-1 mb-4" style={{ color: '#1d1d1d' }}>Construction Progress</h2>
              <div className="rounded-2xl overflow-hidden nb-card-shadow" style={{ background: '#fff', border: '1px solid #ccb7a3' }}>
                {design.constructionProgress.map((phase, idx) => {
                  const isOpen = openPhase === phase.phase
                  const dotColor = phase.status === 'done' ? '#495d38' : phase.status === 'active' ? '#be5d3f' : '#ccb7a3'
                  return (
                    <div
                      key={phase.phase}
                      className="border-b last:border-b-0"
                      style={{ borderColor: '#e6e0d4' }}
                    >
                      <button
                        id={`progress-phase-${idx}`}
                        onClick={() => setOpenPhase(isOpen ? null : phase.phase)}
                        className="w-full flex items-center justify-between px-6 py-4 text-left transition-colors"
                        style={{ background: isOpen ? '#f8f5f0' : 'transparent' }}
                        onMouseEnter={(e) => { if (!isOpen) (e.currentTarget as HTMLButtonElement).style.background = '#f8f5f0' }}
                        onMouseLeave={(e) => { if (!isOpen) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ background: dotColor, boxShadow: `0 0 0 3px ${dotColor}33` }}
                          />
                          <span className="font-medium text-sm" style={{ color: '#1d1d1d' }}>{phase.phase}</span>
                          <span
                            className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                            style={{
                              background: phase.status === 'done' ? 'rgba(73,93,56,0.12)' : phase.status === 'active' ? 'rgba(190,93,63,0.12)' : '#e6e0d4',
                              color: phase.status === 'done' ? '#495d38' : phase.status === 'active' ? '#be5d3f' : '#928d64',
                            }}
                          >
                            {phase.status === 'done' ? '✓ Complete' : phase.status === 'active' ? '⏳ In Progress' : 'Pending'}
                          </span>
                        </div>
                        <svg
                          className="w-4 h-4 transition-transform duration-200"
                          style={{ color: '#6b879c', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                          fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                        >
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-5 pt-1">
                          <p className="text-sm leading-relaxed pl-7" style={{ color: '#928d64' }}>{phase.detail}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Client Review */}
            <section>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#be5d3f' }}>Testimonial</span>
              <h2 className="text-2xl font-bold mt-1 mb-4" style={{ color: '#1d1d1d' }}>What Our Client Says</h2>
              <div
                className="rounded-2xl p-8 nb-card-shadow"
                style={{ background: '#fff', border: '1px solid #ccb7a3' }}
              >
                <StarRow rating={design.review.rating} />
                <blockquote className="mt-4 text-sm leading-relaxed italic" style={{ color: '#928d64' }}>
                  "{design.review.text}"
                </blockquote>
                <div className="flex items-center gap-4 mt-6 pt-5 border-t" style={{ borderColor: '#e6e0d4' }}>
                  <img
                    src={design.review.avatar}
                    alt={design.review.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#1d1d1d' }}>{design.review.author}</p>
                    <p className="text-xs" style={{ color: '#6b879c' }}>Homeowner · {design.review.date}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Related Projects */}
            <section className="pb-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#be5d3f' }}>Explore More</span>
                  <h2 className="text-2xl font-bold mt-1" style={{ color: '#1d1d1d' }}>Related Projects</h2>
                </div>
                <Link to="/designs" className="text-sm font-medium hover:underline" style={{ color: '#345b79' }}>
                  View All →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {design.relatedProjects.map((proj) => (
                  <Link
                    key={proj.id}
                    to={`/designs/${proj.id}`}
                    id={`related-${proj.id}`}
                    className="nb-card-hover nb-card-shadow rounded-2xl overflow-hidden block"
                    style={{ background: '#fff', border: '1px solid #ccb7a3' }}
                  >
                    <div className="h-44 overflow-hidden">
                      <img
                        src={proj.image}
                        alt={proj.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{ background: '#e6e0d4', color: '#345b79' }}
                      >
                        {proj.style}
                      </span>
                      <h3 className="font-semibold text-sm mt-2 mb-1" style={{ color: '#1d1d1d' }}>{proj.title}</h3>
                      <p className="font-bold text-base" style={{ color: '#be5d3f' }}>
                        ${proj.price.toLocaleString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

          </div>

          {/* ── Sticky Right Sidebar (Pricing + CTA) ─────────── */}
          <aside className="w-full lg:w-80 shrink-0 sticky top-24">
            <div className="rounded-2xl overflow-hidden nb-card-shadow" style={{ border: '1px solid #ccb7a3' }}>
              {/* Price header — Blue dark */}
              <div className="p-6 pb-4" style={{ background: '#345b79' }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#6b879c' }}>Starting Price</p>
                <p className="text-4xl font-bold text-white">
                  ${design.price.toLocaleString()}
                </p>
                <p className="text-sm mt-1" style={{ color: '#ccb7a3' }}>Price Negotiable</p>
              </div>

              {/* Stats grid */}
              <div className="p-6" style={{ background: '#fff' }}>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { icon: '🛏️', label: 'Bedrooms', value: design.bedrooms },
                    { icon: '🚿', label: 'Bathrooms', value: design.bathrooms },
                    { icon: '📐', label: 'Sq. Footage', value: `${design.sqft.toLocaleString()} ft²` },
                    { icon: '🚗', label: 'Garage', value: `${design.garage} Car` },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl p-3 text-center"
                      style={{ background: '#e6e0d4', border: '1px solid #ccb7a3' }}
                    >
                      <p className="text-xl mb-1">{stat.icon}</p>
                      <p className="font-bold text-sm" style={{ color: '#1d1d1d' }}>{stat.value}</p>
                      <p className="text-xs" style={{ color: '#6b879c' }}>{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Architect info */}
                <div
                  className="flex items-center gap-3 p-3 rounded-xl mb-6"
                  style={{ background: '#e6e0d4', border: '1px solid #ccb7a3' }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                    style={{ background: '#345b79' }}
                  >
                    {design.architectName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: '#1d1d1d' }}>{design.architectName}</p>
                    <p className="text-xs truncate" style={{ color: '#928d64' }}>{design.architectFirm}</p>
                  </div>
                </div>

                {/* Primary CTA — Blue */}
                <button
                  id="request-consultation-btn"
                  className="nb-btn-primary w-full py-3 text-sm mb-3 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.4 2 2 0 0 1 3.6 2.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  Request Consultation
                </button>
                {/* Secondary CTA — Brick outline */}
                <button
                  id="download-brochure-btn"
                  className="nb-btn-outline w-full py-3 text-sm flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Download Brochure
                </button>

                {/* Contact buttons */}
                <div className="flex gap-2 mt-3">
                  <button
                    id="contact-whatsapp-btn"
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    style={{ background: 'rgba(73,93,56,0.12)', color: '#495d38' }}
                  >
                    💬 WhatsApp
                  </button>
                  <button
                    id="contact-email-btn"
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    style={{ background: 'rgba(52,91,121,0.12)', color: '#345b79' }}
                  >
                    ✉️ Email
                  </button>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </main>

      
    </>
  )
}

export default DesignDetailPage
