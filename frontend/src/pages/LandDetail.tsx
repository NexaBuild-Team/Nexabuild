import { useState, useEffect, lazy, Suspense } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { getLandById, getAllLands } from '../services/landApi'
import type { Land } from '../types/land'

const PropertyLocationMap = lazy(() => import('../components/PropertyLocationMap'))

// ─── Icons ────────────────────────────────────────────────────────────────────
const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg className="w-4 h-4" fill={filled ? '#be5d3f' : 'none'} stroke={filled ? '#be5d3f' : 'currentColor'} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
)

function MatchScoreRing({ score }: { score: number }) {
  const circumference = 163.36
  const dash = (score / 100) * circumference

  return (
    <div className="relative w-20 h-20 mx-auto">
      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="5" />
        <circle
          cx="32" cy="32" r="26" fill="none"
          stroke="#ffffff" strokeWidth="5"
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xl font-extrabold text-white">
        {score}%
      </span>
    </div>
  )
}

function getRoadAccessWidth(land: Land): string {
  const desc = (land.description || '').toLowerCase()
  const name = land.name.toLowerCase()
  
  if (desc.includes('40ft') || desc.includes('40-foot') || name.includes('malabe')) return '20+ Feet'
  if (desc.includes('30ft') || desc.includes('30-foot') || desc.includes('container') || name.includes('kaduwela') || name.includes('negombo')) return '20+ Feet'
  if (desc.includes('20ft') || desc.includes('20-foot') || name.includes('colombo') || name.includes('galle')) return '20+ Feet'
  if (desc.includes('15ft') || desc.includes('15-foot') || name.includes('battaramulla') || name.includes('kurunegala')) return '15–20 Feet'
  if (desc.includes('12ft') || desc.includes('12-foot') || name.includes('kandy')) return '12–15 Feet'
  
  return '< 12 Feet'
}

export default function LandDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [land, setLand] = useState<Land | null>(null)
  const [similarLands, setSimilarLands] = useState<Land[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [saved, setSaved] = useState(false)
  const [showContact, setShowContact] = useState(false)
  const [contactMessage, setContactMessage] = useState('')
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    if (!id) return

    setLoading(true)
    setError(null)

    getLandById(id)
      .then(data => {
        setLand(data)
        // fetch a few similar lands (all lands minus this one, max 4)
        return getAllLands()
      })
      .then(all => {
        setSimilarLands(all.filter(l => l.id !== id).slice(0, 4))
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load this land listing. Please go back and try again.')
        setLoading(false)
      })
  }, [id])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    setContactMessage('')
    setShowContact(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#e6e0d4' }}>
        <p className="text-sm font-semibold animate-pulse" style={{ color: '#928d64' }}>Loading land details…</p>
      </div>
    )
  }

  if (error || !land) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: '#e6e0d4' }}>
        <p className="text-sm font-semibold" style={{ color: '#be5d3f' }}>
          {error ?? 'Land listing not found.'}
        </p>
        <button onClick={() => navigate('/land')} className="text-sm font-bold px-4 py-2 rounded-lg text-white" style={{ backgroundColor: '#345b79' }}>
          Back to Listings
        </button>
      </div>
    )
  }

  const mapCenter: [number, number] = (land.latitude !== null && land.longitude !== null)
    ? [land.latitude, land.longitude]
    : [6.9271, 79.8612] // default: Colombo

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#e6e0d4', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Navbar Spacer */}
      <div className="h-[80px]" />

      {/* Gallery Slideshow Modal */}
      {isGalleryModalOpen && land.images.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col justify-between p-6">
          <div className="flex justify-between items-center text-white">
            <span className="text-sm font-semibold">Photo Gallery ({activeImageIndex + 1}/{land.images.length})</span>
            <button onClick={() => setIsGalleryModalOpen(false)} className="text-2xl font-bold cursor-pointer hover:opacity-75">✕</button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <img src={land.images[activeImageIndex]} alt="Detailed plot view" className="max-w-full max-h-[75vh] object-contain rounded-lg" />
          </div>
          <div className="flex justify-center gap-2 pb-4 overflow-x-auto">
            {land.images.map((imgUrl, i) => (
              <button
                key={i}
                onClick={() => setActiveImageIndex(i)}
                className="w-16 h-12 rounded border-2 overflow-hidden flex-shrink-0 transition-all"
                style={{ borderColor: activeImageIndex === i ? '#be5d3f' : 'transparent' }}
              >
                <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Main Container ── */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* ── Image Gallery ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8 rounded-2xl overflow-hidden h-[300px] md:h-[500px]">
          <div className="md:col-span-2 relative cursor-pointer group" onClick={() => { setActiveImageIndex(0); setIsGalleryModalOpen(true) }}>
            {land.images[0] ? (
              <img alt="Main property view" className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300" src={land.images[0]} />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#ccb7a3' }}>
                <span className="text-sm font-semibold" style={{ color: '#fff' }}>No image available</span>
              </div>
            )}
          </div>
          {land.images[1] && (
            <div className="relative h-full hidden md:block cursor-pointer group" onClick={() => { setActiveImageIndex(1); setIsGalleryModalOpen(true) }}>
              <img alt="Secondary view" className="w-full h-full object-cover brightness-75 group-hover:scale-[1.01] transition-transform duration-300" src={land.images[1]} />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <button className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2 text-slate-900 font-medium shadow-lg hover:bg-white transition-all cursor-pointer pointer-events-auto">
                  📷 +{land.images.length} Photos
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ── Split Layout: Left Content & Right Sidebar ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ── LEFT CONTENT AREA ── */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Property Summary Header */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 text-slate-500 text-sm mb-2 font-medium">
                    <span>📍</span> {land.location.toUpperCase()}
                  </div>
                  <h1 className="text-3xl font-bold mb-4" style={{ color: '#1d1d1d' }}>{land.name}</h1>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded text-xs font-semibold">{land.landType}</span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded text-xs font-semibold">{land.status}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-2xl font-bold text-slate-900">
                    <span className="text-sm font-semibold mr-1" style={{ color: '#be5d3f' }}>LKR</span>
                    {land.price.toLocaleString()}
                  </div>
                  <span className="inline-block mt-2 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded">Negotiable</span>
                </div>
              </div>

              {/* Key Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-100">
                {[
                  { label: 'Land Size', val: `${land.perches} perches`, icon: '📐' },
                  ...(land.sqft ? [{ label: 'Total Area', val: `${land.sqft} sqft`, icon: '⬛' }] : []),
                  { label: 'Land Type', val: land.landType, icon: '🗺️' },
                ].map(stat => (
                  <div key={stat.label} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 text-lg">
                      {stat.icon}
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">{stat.label}</p>
                      <p className="text-sm font-bold text-slate-800">{stat.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* About This Land */}
            {land.description && (
              <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-4">About This Land</h2>
                <div className="space-y-4 text-slate-600 leading-relaxed text-sm">
                  {land.description.split('\n\n').map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </section>
            )}

            {/* Location Map */}
            <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">Location Map</h2>
                <button className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                  🗺️ Open Full Map
                </button>
              </div>

              {/* land type label */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider text-white"
                  style={{ backgroundColor: '#345b79' }}
                >
                  {land.landType}
                </span>
                <span className="text-xs text-slate-400 font-medium">{land.location}</span>
              </div>

              {/* Live Leaflet map */}
              <div className="w-full rounded-xl overflow-hidden border border-slate-200" style={{ height: '320px' }}>
                {(land.latitude !== null && land.longitude !== null) ? (
                  <Suspense
                    fallback={
                      <div
                        className="w-full h-full flex items-center justify-center text-sm font-semibold"
                        style={{ backgroundColor: '#e6e0d4', color: '#928d64' }}
                      >
                        Loading map…
                      </div>
                    }
                  >
                    <PropertyLocationMap center={mapCenter} />
                  </Suspense>
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#e6e0d4' }}>
                    <p className="text-sm font-semibold" style={{ color: '#928d64' }}>Location coordinates not available</p>
                  </div>
                )}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#345b79' }} />
                  <span className="text-[11px] font-medium text-slate-500">Land Location</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-3 h-3" fill="none" stroke="#928d64" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-[11px] font-medium text-slate-500">Exact pin on parcel</span>
                </div>
              </div>
            </section>
          </div>

          {/* ── SIDEBAR ── */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-sm p-5 space-y-3">
              <button
                id="save-land-btn"
                onClick={() => setSaved(!saved)}
                className="w-full flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-xl border-2 transition-all hover:bg-[#be5d3f]/5 cursor-pointer"
                style={{ color: '#be5d3f', borderColor: '#be5d3f' }}
              >
                <HeartIcon filled={saved} />
                Save Land
              </button>
              <button
                id="share-land-btn"
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                className="w-full flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-xl transition-all hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: '#ccb7a3', color: '#1d1d1d' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share This Land
              </button>
            </div>

            {/* AI Match Score — only show if non-null */}
            {land.matchScore !== null && (
              <div className="rounded-2xl shadow-sm p-6 text-center" style={{ backgroundColor: '#345b79' }}>
                <MatchScoreRing score={land.matchScore} />
                <p className="text-white font-bold text-sm mt-3">AI Match Score</p>
                <p className="text-xs mt-1" style={{ color: 'rgba(230,224,212,0.75)' }}>Based on your preferences</p>
              </div>
            )}

            {/* Quick Facts List */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-bold uppercase mb-4 tracking-wider" style={{ color: '#928d64' }}>Land Details</p>
              <div className="space-y-3">
                {[
                  { label: 'Land Type', val: land.landType },
                  { label: 'Status', val: land.status },
                  { label: 'District', val: land.location.split(',')[0].trim() },
                  { label: 'Perches', val: String(land.perches) },
                  { label: 'Road Access', val: getRoadAccessWidth(land) },
                  ...(land.sqft ? [{ label: 'Sqft', val: String(land.sqft) }] : []),
                  ...(land.matchScore !== null ? [{ label: 'AI Match', val: `${land.matchScore}%` }] : []),
                ].map(fact => (
                  <div key={fact.label} className="flex justify-between text-xs py-2 border-b border-slate-100 last:border-0">
                    <span className="text-slate-500 font-medium">{fact.label}</span>
                    <span className="font-bold text-slate-800">{fact.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Panel */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-bold uppercase mb-4 tracking-wider" style={{ color: '#928d64' }}>Enquire About This Land</p>

              {showContact && (
                <form onSubmit={handleSendMessage} className="mb-4 p-3 rounded-xl border border-gray-200" style={{ backgroundColor: '#e6e0d4' }}>
                  <p className="text-[11px] mb-2 font-medium" style={{ color: '#1d1d1d' }}>Send an enquiry:</p>
                  <textarea
                    rows={3}
                    className="w-full text-xs bg-white border border-gray-300 rounded p-2 outline-none resize-none text-slate-800"
                    placeholder="I'm interested in this land..."
                    value={contactMessage}
                    onChange={e => setContactMessage(e.target.value)}
                  />
                  <button type="submit" className="w-full mt-2 py-2 rounded-lg text-xs font-bold text-white hover:opacity-90" style={{ backgroundColor: '#be5d3f' }}>
                    Send Message
                  </button>
                </form>
              )}

              <button
                id="contact-agent-btn"
                onClick={() => setShowContact(!showContact)}
                className="w-full text-sm font-bold py-3 rounded-xl text-white transition-all hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: '#345b79' }}
              >
                {showContact ? 'Cancel' : 'Send Enquiry'}
              </button>
            </div>

          </aside>
        </div>

        {/* ── Similar Land Parcels ── */}
        {similarLands.length > 0 && (
          <section className="mt-16">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Similar Land Parcels</h2>
                <p className="text-sm text-slate-500">Other land listings you may be interested in</p>
              </div>
              <Link to="/land" className="text-sm font-bold flex items-center gap-1 hover:opacity-85" style={{ color: '#345b79' }}>
                View All Land Listings →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarLands.map(s => (
                <div
                  key={s.id}
                  onClick={() => navigate(`/land/detail/${s.id}`)}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group cursor-pointer"
                >
                  <div className="relative h-48">
                    {s.images[0] ? (
                      <img alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={s.images[0]} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#e6e0d4' }}>
                        <span className="text-xs" style={{ color: '#928d64' }}>No image</span>
                      </div>
                    )}
                    <span className="absolute top-3 left-3 text-white text-[10px] font-bold px-2 py-1 rounded" style={{ backgroundColor: '#be5d3f' }}>{s.status}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-slate-900 truncate">{s.name}</h3>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-3">
                      <span>📍</span> {s.location}
                    </div>
                    <div className="text-xl font-bold text-slate-900 mb-4">LKR {s.price.toLocaleString()}</div>
                    <div className="flex justify-between text-[10px] text-slate-500 mb-4 font-semibold">
                      <span>{s.perches} perches</span>
                      {s.sqft && <span>{s.sqft} sqft</span>}
                    </div>
                    <div className="pt-4 border-t border-slate-100">
                      <button
                        id={`view-details-btn-${s.id}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/land/detail/${s.id}`)
                        }}
                        className="w-full py-2 text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all cursor-pointer"
                        style={{ backgroundColor: '#345b79' }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  )
}
