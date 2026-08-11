import { useState, useEffect, lazy, Suspense } from 'react'
import { useParams, useNavigate, Link, useLocation } from 'react-router'
import { getLandById, getAllLands } from '../services/landApi'
import type { Land } from '../types/land'

const PropertyLocationMap = lazy(() => import('../components/PropertyLocationMap'))

// ─── Icons ────────────────────────────────────────────────────────────────────
const MapPinIcon = ({ cls = 'w-4 h-4' }: { cls?: string }) => (
  <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg className="w-4 h-4" fill={filled ? '#be5d3f' : 'none'} stroke={filled ? '#be5d3f' : 'currentColor'} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
)

const StarRating = () => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <svg key={star} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
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

const getNearbyFacilities = (location: string) => {
  const loc = location.toLowerCase()
  if (loc.includes('malabe')) {
    return {
      schools: [
        { name: 'Horizon College International', distance: '1.2 km' },
        { name: 'SLIIT Malabe Campus', distance: '2.5 km' },
        { name: 'Malabe Boys School', distance: '1.8 km' }
      ],
      hospitals: [
        { name: 'Neville Fernando Teaching Hospital', distance: '2.1 km' },
        { name: 'Dr. Neville Fernando Hospital', distance: '2.3 km' },
        { name: 'Malabe Medical Center', distance: '1.0 km' }
      ],
      supermarkets: [
        { name: 'Keells Super - Malabe', distance: '0.8 km' },
        { name: 'Cargills Food City', distance: '1.1 km' },
        { name: 'Arpico Supercentre', distance: '1.5 km' }
      ]
    }
  }
  if (loc.includes('colombo')) {
    return {
      schools: [
        { name: 'Royal College Colombo', distance: '1.5 km' },
        { name: 'Visakha Vidyalaya', distance: '2.0 km' },
        { name: 'St. Peter\'s College', distance: '2.8 km' }
      ],
      hospitals: [
        { name: 'National Hospital of Sri Lanka', distance: '1.0 km' },
        { name: 'Lanka Hospitals', distance: '3.2 km' },
        { name: 'Asiri Surgical Hospital', distance: '3.5 km' }
      ],
      supermarkets: [
        { name: 'Cargills Food City - Majestic City', distance: '2.2 km' },
        { name: 'Keells Super - Union Place', distance: '1.4 km' },
        { name: 'Arpico Supercentre - Hyde Park', distance: '1.2 km' }
      ]
    }
  }
  if (loc.includes('kandy')) {
    return {
      schools: [
        { name: 'Trinity College Kandy', distance: '0.9 km' },
        { name: 'Kingswood College', distance: '2.4 km' },
        { name: 'Hillwood College', distance: '1.2 km' }
      ],
      hospitals: [
        { name: 'General Hospital Kandy', distance: '1.5 km' },
        { name: 'Lakeside Adventist Hospital', distance: '2.1 km' },
        { name: 'Asiri Hospital Kandy', distance: '2.8 km' }
      ],
      supermarkets: [
        { name: 'Keells Super - Kandy City Centre', distance: '0.5 km' },
        { name: 'Cargills Food City - Peradeniya', distance: '2.5 km' },
        { name: 'Arpico Daily - Kandy', distance: '1.0 km' }
      ]
    }
  }
  return {
    schools: [
      { name: 'District National School', distance: '2.5 km' },
      { name: 'Primary College', distance: '3.0 km' },
      { name: 'International School', distance: '4.2 km' }
    ],
    hospitals: [
      { name: 'District Base Hospital', distance: '3.1 km' },
      { name: 'General Clinic', distance: '1.5 km' },
      { name: 'Medicare Center', distance: '2.0 km' }
    ],
    supermarkets: [
      { name: 'Cargills Food City', distance: '1.2 km' },
      { name: 'Keells Super', distance: '2.0 km' },
      { name: 'Local Market Complex', distance: '0.8 km' }
    ]
  }
}

function SimilarLandCard({ land, navigate }: { land: Land; navigate: any }) {
  const [fav, setFav] = useState(false)

  return (
    <div
      onClick={() => navigate(`/land/detail/${land.id}`)}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
    >
      <div className="relative h-44">
        {land.images[0] ? (
          <img src={land.images[0]} alt={land.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#e6e0d4]">
            <span className="text-xs text-[#928d64]">No image</span>
          </div>
        )}
        <span
          className="absolute top-3 left-3 text-white text-[10px] font-bold px-2.5 py-1 rounded tracking-widest uppercase"
          style={{ backgroundColor: '#be5d3f' }}
        >
          {land.status}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); setFav(!fav) }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        >
          <HeartIcon filled={fav} />
        </button>
      </div>
      <div className="p-4">
        <p className="text-[#be5d3f] font-bold text-sm mb-1">LKR {land.price.toLocaleString()}</p>
        <h3 className="font-semibold text-[#1d1d1d] text-sm mb-1 truncate">{land.name}</h3>
        <div className="flex items-center gap-1 text-[#928d64] text-xs mb-3">
          <MapPinIcon cls="w-3 h-3" />
          <span className="truncate">{land.location}</span>
        </div>
        <div className="flex items-center gap-3 text-[#6b879c] text-xs border-t border-[#e6e0d4] pt-3 flex-wrap">
          <span>⬛ {land.perches} perches</span>
          {land.sqft && <span>⤢ {land.sqft} sqft</span>}
          <span>🛣 {getRoadAccessWidth(land)} Road</span>
        </div>
      </div>
    </div>
  )
}

export default function LandDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const showScore = location.state?.fromRecommendations === true

  const [land, setLand] = useState<Land | null>(null)
  const displayedScore = location.state?.matchScore !== undefined ? location.state.matchScore : (land?.matchScore ?? null)
  const [similarLands, setSimilarLands] = useState<Land[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [saved, setSaved] = useState(false)
  const [agentSaved, setAgentSaved] = useState(false)
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
        // ── Track page views with a 3-second throttle to prevent Strict Mode double-counts ──
        const lastViewKey = `nexabuild_land_last_view_${id}`
        const now = Date.now()
        const lastViewTime = parseInt(sessionStorage.getItem(lastViewKey) || '0', 10)

        if (now - lastViewTime > 3000) {
          sessionStorage.setItem(lastViewKey, String(now))
          const viewKey = `nexabuild_land_views_${id}`
          const prev = parseInt(localStorage.getItem(viewKey) || '0', 10)
          localStorage.setItem(viewKey, String(prev + 1))
        }
        return getAllLands()
      })
      .then(all => {
        setSimilarLands(all.filter(l => l.id !== id).slice(0, 3))
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

  const galleryMain = land.images[0]
  const galleryMid = land.images[1] ?? land.images[0]
  const gallerySmall = land.images[2] ?? land.images[0]
  const galleryExtra = land.images[3]
  const rawFacilities = land.nearbyFacilities as any;
  const facilities = (rawFacilities && typeof rawFacilities === 'object')
    ? {
      schools: Array.isArray(rawFacilities.schools) ? rawFacilities.schools : [],
      hospitals: Array.isArray(rawFacilities.hospitals) ? rawFacilities.hospitals : [],
      supermarkets: Array.isArray(rawFacilities.supermarkets) ? rawFacilities.supermarkets : [],
    }
    : getNearbyFacilities(land.location)

  return (
    <>
      <div className="min-h-screen bg-[#e6e0d4]" style={{ fontFamily: "'Inter', 'Outfit', sans-serif" }}>

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

        {/* ── Breadcrumbs & Gallery ── */}
        <section className="pt-[76px] pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <nav className="flex items-center gap-2 text-xs text-[#928d64] mb-5 pt-1">
              <Link to="/" className="hover:text-[#345b79] transition-colors">Home</Link>
              <span>&gt;</span>
              <Link to="/land" className="hover:text-[#345b79] transition-colors">Land Listings</Link>
              <span>&gt;</span>
              <span className="text-[#345b79] font-medium">{land.name}</span>
            </nav>

            {/* Image Gallery — single col mobile, 3-col on md+ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:h-[360px] mb-8">
              <div className="relative rounded-2xl overflow-hidden h-48 sm:h-56 md:h-full min-h-0 cursor-pointer group" onClick={() => { setActiveImageIndex(0); setIsGalleryModalOpen(true) }}>
                {galleryMain ? (
                  <img
                    src={galleryMain}
                    alt={land.name}
                    className="w-full h-full object-cover animate-fade-in"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#ccb7a3]">
                    <span className="text-sm font-semibold text-white">No image available</span>
                  </div>
                )}
                <span
                  className="absolute top-4 left-4 text-white text-[10px] font-bold px-3 py-1 rounded tracking-widest uppercase"
                  style={{ backgroundColor: '#be5d3f' }}
                >
                  {land.status}
                </span>
                <span className="absolute top-4 right-4 flex items-center gap-1 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  1 / {land.images.length || 1}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-1 md:grid-rows-2 gap-3 h-32 sm:h-44 md:h-full min-h-0">
                <div className="rounded-2xl overflow-hidden h-full min-h-0 cursor-pointer" onClick={() => { setActiveImageIndex(1); setIsGalleryModalOpen(true) }}>
                  <img src={galleryMid} alt="Secondary view" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden h-full min-h-0 cursor-pointer" onClick={() => { setActiveImageIndex(2); setIsGalleryModalOpen(true) }}>
                  <img src={gallerySmall} alt="Third view" className="w-full h-full object-cover" />
                </div>
              </div>

              {galleryExtra && (
                <div className="relative rounded-2xl overflow-hidden h-48 sm:h-56 md:h-full min-h-0 cursor-pointer group" onClick={() => { setActiveImageIndex(3); setIsGalleryModalOpen(true) }}>
                  <img
                    src={galleryExtra}
                    alt="Extra view"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Main Content + Sidebar ── */}
        <section className="pb-12 pt-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">

              {/* ── Left Column ── */}
              <div className="flex-1 min-w-0">

                {/* Title & Price */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#1d1d1d] tracking-tight mb-2">
                      {land.name}
                    </h1>
                    <div className="flex items-center gap-1.5 text-sm text-[#928d64]">
                      <MapPinIcon />
                      <span>{land.location}</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right flex-shrink-0">
                    <p className="text-2xl font-extrabold text-[#be5d3f]">LKR {land.price.toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-[#928d64] uppercase tracking-widest mt-0.5">Negotiable</p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                  {[
                    { icon: 'perches', label: `${land.perches} Perches` },
                    ...(land.sqft ? [{ icon: 'area', label: `${land.sqft} Sqft` }] : []),
                    { icon: 'type', label: land.landType },
                    { icon: 'road', label: `${getRoadAccessWidth(land)} Road` },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[#345b79]" style={{ backgroundColor: '#e6e0d4' }}>
                        {stat.icon === 'perches' && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                        )}
                        {stat.icon === 'area' && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                        )}
                        {stat.icon === 'type' && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 01.553-.894L9 2l6 3 5.447-2.724A1 1 0 0121 3.176v10.764a1 1 0 01-.553.894L15 18l-6 2z" />
                          </svg>
                        )}
                        {stat.icon === 'road' && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 9h4m-4 4h4m-4-8h4M12 5v14a2 2 0 01-2 2H8a2 2 0 01-2-2V5a2 2 0 012-2h2a2 2 0 012 2z" />
                          </svg>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-[#1d1d1d]">{stat.label}</span>
                    </div>
                  ))}
                </div>

                {/* About */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                  <h2 className="text-lg font-bold text-[#1d1d1d] mb-4">About This Land</h2>
                  <div className="space-y-4 text-slate-600 leading-relaxed text-sm">
                    {(land.description || '').split('\n\n').map((para, i) => (
                      <p key={i} className="text-sm text-[#928d64] leading-relaxed mb-3">{para}</p>
                    ))}
                  </div>

                  <h3 className="text-sm font-bold text-[#1d1d1d] mt-6 mb-3">Key Features</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      `Ideal for: ${land.purpose || 'Development / Investment'}`,
                      `Environment: ${land.environment || 'Scenic Outlook'}`,
                      `Development Plan: ${land.developmentPlan || 'Build Immediately'}`,
                      `Access Road Width: ${getRoadAccessWidth(land)}`,
                    ].map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#be5d3f' }} />
                        <span className="text-sm text-[#1d1d1d]">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nearby Facilities */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                  <h2 className="text-lg font-bold text-[#1d1d1d] mb-5">Nearby Facilities</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { title: 'Schools', color: '#345b79', items: facilities.schools },
                      { title: 'Hospitals', color: '#be5d3f', items: facilities.hospitals },
                      { title: 'Supermarkets', color: '#495d38', items: facilities.supermarkets },
                    ].map((group) => (
                      <div key={group.title}>
                        <div className="flex items-center gap-2 mb-3">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                            style={{ backgroundColor: group.color }}
                          >
                            {group.title[0]}
                          </div>
                          <h3 className="text-sm font-bold text-[#1d1d1d]">{group.title}</h3>
                        </div>
                        <ul className="space-y-2">
                          {group.items.map((item: { name: string; distance?: string }) => (
                            <li key={item.name} className="flex items-center justify-between text-xs">
                              <span className="text-[#1d1d1d]">{item.name}</span>
                              <span className="text-[#928d64] font-medium">{item.distance}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location Map */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-[#1d1d1d]">Location Map</h2>
                    <button className="text-xs font-semibold text-[#345b79] hover:opacity-80 transition-opacity">
                      Open Full Map
                    </button>
                  </div>
                  <div className="rounded-xl overflow-hidden h-64 bg-[#e6e0d4]">
                    <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-sm text-[#928d64]">Loading map…</div>}>
                      <PropertyLocationMap center={mapCenter} />
                    </Suspense>
                  </div>
                </div>
              </div>

              {/* ── Right Sidebar ── */}
              <aside className="lg:w-[320px] flex-shrink-0 space-y-5">

                {/* Action Buttons */}
                <div className="bg-white rounded-2xl shadow-sm p-5 space-y-3">
                  <button
                    onClick={() => setSaved(!saved)}
                    className="w-full flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-xl border-2 transition-all hover:bg-[#be5d3f]/5 cursor-pointer"
                    style={{ color: '#be5d3f', borderColor: '#be5d3f' }}
                  >
                    <HeartIcon filled={saved} />
                    Save Land
                  </button>
                  <button
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

                {/* AI Match Score */}
                {displayedScore !== null && showScore && (
                  <div className="rounded-2xl shadow-sm p-6 text-center" style={{ backgroundColor: '#345b79' }}>
                    <MatchScoreRing score={displayedScore} />
                    <p className="text-white font-bold text-sm mt-3">AI Match Score</p>
                    <p className="text-xs mt-1" style={{ color: 'rgba(230,224,212,0.75)' }}>Based on your preferences</p>
                  </div>
                )}

                {/* Agent Card */}
                <div className="bg-white rounded-2xl shadow-sm p-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#928d64] mb-4">Listed by Agent</p>

                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #be5d3f, #345b79)' }}
                    >
                      SP
                    </div>
                    <div>
                      <p className="font-bold text-[#1d1d1d] text-sm">Saman Perera</p>
                      <p className="text-xs text-[#928d64]">Senior Property Consultant</p>
                      <StarRating />
                    </div>
                  </div>

                  <ul className="space-y-2.5 mb-5 text-xs text-[#928d64]">
                    <li className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      +94 77 123 4567
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      saman@nexabuild.lk
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      NexaBuild Realty
                    </li>
                  </ul>

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
                      <button type="submit" className="w-full mt-2 py-2 rounded-lg text-xs font-bold text-white hover:opacity-90 cursor-pointer" style={{ backgroundColor: '#be5d3f' }}>
                        Send Message
                      </button>
                    </form>
                  )}

                  <button
                    onClick={() => setShowContact(!showContact)}
                    className="w-full text-sm font-bold py-3 rounded-xl text-white mb-2 transition-all hover:opacity-90 cursor-pointer"
                    style={{ backgroundColor: '#345b79' }}
                  >
                    {showContact ? 'Cancel' : 'Contact Agent'}
                  </button>
                  <button
                    onClick={() => setAgentSaved(!agentSaved)}
                    className="w-full flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-xl border-2 transition-all hover:bg-[#be5d3f]/5 cursor-pointer"
                    style={{ color: '#be5d3f', borderColor: '#be5d3f' }}
                  >
                    <HeartIcon filled={agentSaved} />
                    Save Property
                  </button>

                  {displayedScore !== null && showScore && (
                    <div
                      className="mt-4 text-center text-xs font-bold text-white py-2 rounded-lg"
                      style={{ backgroundColor: '#345b79' }}
                    >
                      AI Match Score {displayedScore}%
                    </div>
                  )}
                </div>

                {/* Land Details Fact list */}
                <div className="bg-white rounded-2xl shadow-sm p-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#928d64] mb-4">Land Details</p>
                  <ul className="space-y-0">
                    {[
                      { label: 'Land Type', value: land.landType },
                      { label: 'Status', value: land.status },
                      { label: 'District', value: land.location.split(',')[0].trim() },
                      { label: 'Perches', value: String(land.perches) },
                      { label: 'Road Access', value: getRoadAccessWidth(land) },
                      ...(land.sqft ? [{ label: 'Sqft', value: String(land.sqft) }] : []),
                      ...(displayedScore !== null && showScore ? [{ label: 'AI Match', value: `${displayedScore}%` }] : []),
                    ].map((detail, i, arr) => (
                      <li
                        key={detail.label}
                        className={`flex items-center justify-between py-3 text-xs ${i < arr.length - 1 ? 'border-b border-[#e6e0d4]' : ''}`}
                      >
                        <span className="text-[#928d64]">{detail.label}</span>
                        <span className="font-semibold text-[#1d1d1d]">{detail.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* ── Similar Lands ── */}
        {similarLands.length > 0 && (
          <section className="pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <h2 className="text-xl font-extrabold text-[#1d1d1d]">Similar Lands</h2>
                <Link
                  to="/land"
                  className="flex items-center gap-1 text-sm font-semibold text-[#345b79] hover:gap-2 transition-all"
                >
                  View All Land Listings
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {similarLands.map((sLand) => (
                  <SimilarLandCard key={sLand.id} land={sLand} navigate={navigate} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  )
}
