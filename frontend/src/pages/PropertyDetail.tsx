import { useState, lazy, Suspense, useEffect } from 'react'
import { Link, useParams, useNavigate, useLocation } from 'react-router'

import { fetchAllProperties, fetchPropertyById, type MappedProperty } from '../services/propertyService'

const PropertyLocationMap = lazy(() => import('../components/PropertyLocationMap'))

// ─── Color Palette ─────────────────────────────────────────────────────────────
// Primary Brick Accent : #be5d3f  |  Primary Blue  : #345b79
// Primary BG           : #e6e0d4  |  Secondary BG  : #ccb7a3
// Secondary Blue       : #6b879c  |  Light Accent  : #d59b86
// Olive Accent         : #928d64  |  Dark Text     : #1d1d1d
// Green Accent         : #495d38

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

function SimilarPropertyCard({ property, fromAI }: { property: MappedProperty; fromAI: boolean }) {
  const [fav, setFav] = useState(false)

  return (
    <Link to={`/property-detail/${property.id}`} state={{ fromAI }} className="block no-underline">
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-44">
        <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
        <span
          className="absolute top-3 left-3 text-white text-[10px] font-bold px-2.5 py-1 rounded tracking-widest uppercase"
          style={{ backgroundColor: property.badgeColor }}
        >
          {property.badge}
        </span>
        <button
          onClick={(e) => { e.preventDefault(); setFav(!fav) }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        >
          <HeartIcon filled={fav} />
        </button>
      </div>
      <div className="p-4">
        <p className="text-[#be5d3f] font-bold text-sm mb-1">{property.price}</p>
        <h3 className="font-semibold text-[#1d1d1d] text-sm mb-1">{property.title}</h3>
        <div className="flex items-center gap-1 text-[#928d64] text-xs mb-3">
          <MapPinIcon cls="w-3 h-3" />
          <span>{property.location}</span>
        </div>
        <div className="flex items-center gap-3 text-[#6b879c] text-xs border-t border-[#e6e0d4] pt-3">
          <span>{property.beds} Beds</span>
          <span>{property.baths} Baths</span>
          <span>{property.area}</span>
        </div>
      </div>
    </div>
    </Link>
  )
}

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  
  // fromAI is true only when navigated from an AI-powered page (PropertyListingAI / PropertyAIrecommended)
  const locState = location.state as { fromAI?: boolean; aiScore?: number; aiReason?: string } | null
  const fromAI = locState?.fromAI ?? false
  const passedAiScore = locState?.aiScore
  const passedAiReason = locState?.aiReason
  
  const [property,   setProperty]   = useState<MappedProperty | null>(null)
  const [similar,    setSimilar]    = useState<MappedProperty[]>([])
  const [isLoading,  setIsLoading]  = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [saved,      setSaved]      = useState(false)
  const [agentSaved, setAgentSaved] = useState(false)

  useEffect(() => {
    if (!id) return
    setIsLoading(true)
    fetchPropertyById(id)
      .then(async (p) => {
        setProperty(p)
        setFetchError(null)

        // ── Track page views with a 3-second throttle to prevent Strict Mode double-counts ──
        const lastViewKey = `nexabuild_property_last_view_${id}`
        const now = Date.now()
        const lastViewTime = parseInt(sessionStorage.getItem(lastViewKey) || '0', 10)
        
        if (now - lastViewTime > 3000) {
          sessionStorage.setItem(lastViewKey, String(now))
          const viewKey = `nexabuild_property_views_${id}`
          const prev = parseInt(localStorage.getItem(viewKey) || '0', 10)
          localStorage.setItem(viewKey, String(prev + 1))
        }

        // fetch similar: all properties excluding this one, limit 3
        const all = await fetchAllProperties()
        setSimilar(all.filter((x) => x.id !== p.id).slice(0, 3))
      })
      .catch(() => setFetchError('Property not found or backend is unreachable.'))
      .finally(() => setIsLoading(false))
  }, [id])

  // ── Loading state ──
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#e6e0d4] flex items-center justify-center" style={{ fontFamily: "'Inter', 'Outfit', sans-serif" }}>
        <div className="text-center">
          <svg className="w-10 h-10 animate-spin mx-auto mb-4 text-[#345b79]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm font-semibold text-[#928d64]">Loading property…</p>
        </div>
      </div>
    )
  }

  // ── Error / not found state ──
  if (fetchError || !property) {
    return (
      <div className="min-h-screen bg-[#e6e0d4] flex items-center justify-center" style={{ fontFamily: "'Inter', 'Outfit', sans-serif" }}>
        <div className="bg-white rounded-2xl shadow p-12 text-center max-w-sm">
          <p className="font-bold text-[#1d1d1d] mb-2">Property not found</p>
          <p className="text-xs text-[#928d64] mb-6">{fetchError}</p>
          <button onClick={() => navigate('/property-listing')} className="text-sm font-bold px-6 py-2.5 rounded-xl text-white" style={{ backgroundColor: '#345b79' }}>
            Back to Listings
          </button>
        </div>
      </div>
    )
  }

  const galleryMain  = property.gallery[0]
  const galleryMid   = property.gallery[1] ?? property.gallery[0]
  const gallerySmall = property.gallery[2] ?? property.gallery[0]
  const galleryExtra = property.gallery[3]

  return (
    <>
    

      <div className="min-h-screen bg-[#e6e0d4]" style={{ fontFamily: "'Inter', 'Outfit', sans-serif" }}>

        {/* ── Breadcrumbs & Gallery ── */}
        <section className="pt-[76px] pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <nav className="flex items-center gap-2 text-xs text-[#928d64] mb-5 pt-1">
              <Link to="/" className="hover:text-[#345b79] transition-colors">Home</Link>
              <span>&gt;</span>
              <Link to="/property-ai-recommended" className="hover:text-[#345b79] transition-colors">AI Recommendations</Link>
              <span>&gt;</span>
              <span className="text-[#345b79] font-medium">{property.title}</span>
            </nav>

            {/* Image Gallery — single col mobile, 3-col on md+ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:h-[360px] mb-8">
              <div className="relative rounded-2xl overflow-hidden h-48 sm:h-56 md:h-full min-h-0">
                <img
                  src={galleryMain.src}
                  alt={galleryMain.alt}
                  className="w-full h-full object-cover"
                />
                <span
                  className="absolute top-4 left-4 text-white text-[10px] font-bold px-3 py-1 rounded tracking-widest uppercase"
                  style={{ backgroundColor: property.badgeColor }}
                >
                  {property.badge}
                </span>
                <span className="absolute top-4 right-4 flex items-center gap-1 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  1 / 12
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-1 md:grid-rows-2 gap-3 h-32 sm:h-44 md:h-full min-h-0">
                <div className="rounded-2xl overflow-hidden h-full min-h-0">
                  <img src={galleryMid.src} alt={galleryMid.alt} className="w-full h-full object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden h-full min-h-0">
                  <img src={gallerySmall.src} alt={gallerySmall.alt} className="w-full h-full object-cover" />
                </div>
              </div>

              {galleryExtra && (
                <div className="relative rounded-2xl overflow-hidden h-48 sm:h-56 md:h-full min-h-0">
                  <img
                    src={galleryExtra.src}
                    alt={galleryExtra.alt}
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
                      {property.title}
                    </h1>
                    <div className="flex items-center gap-1.5 text-sm text-[#928d64]">
                      <MapPinIcon />
                      <span>{property.address}</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right flex-shrink-0">
                    <p className="text-2xl font-extrabold text-[#be5d3f]">{property.price}</p>
                    <p className="text-[10px] font-bold text-[#928d64] uppercase tracking-widest mt-0.5">Negotiable</p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                  {[
                    { icon: 'bed', label: `${property.beds} Bedrooms` },
                    { icon: 'bath', label: `${property.baths} Bathrooms` },
                    { icon: 'area', label: property.area },
                    { icon: 'car', label: `${property.parking} Cars` },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[#345b79]" style={{ backgroundColor: '#e6e0d4' }}>
                        {stat.icon === 'bed' && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12V7a1 1 0 011-1h1m0 0V4a1 1 0 011-1h10a1 1 0 011 1v2m0 0h1a1 1 0 011 1v5M3 12v5m18-5v5M3 12h18M3 17h18" />
                          </svg>
                        )}
                        {stat.icon === 'bath' && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 17v1a3 3 0 006 0v-1H3zm0 0h18M21 17V9a2 2 0 00-2-2h-1V5a2 2 0 00-2-2H8a2 2 0 00-2 2v2H5a2 2 0 00-2 2v8" />
                          </svg>
                        )}
                        {stat.icon === 'area' && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                        )}
                        {stat.icon === 'car' && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                          </svg>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-[#1d1d1d]">{stat.label}</span>
                    </div>
                  ))}
                </div>

                {/* About */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                  <h2 className="text-lg font-bold text-[#1d1d1d] mb-4">About This Property</h2>
                  <p className="text-sm text-[#928d64] leading-relaxed mb-3">
                    {property.description[0]}
                  </p>
                  <p className="text-sm text-[#928d64] leading-relaxed mb-6">
                    {passedAiReason ? passedAiReason : property.description[1]}
                  </p>

                  <h3 className="text-sm font-bold text-[#1d1d1d] mb-3">Key Features</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {property.keyFeatures.map((feature) => (
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
                      { title: 'Schools', color: '#345b79', items: property.nearbyFacilities.schools },
                      { title: 'Hospitals', color: '#be5d3f', items: property.nearbyFacilities.hospitals },
                      { title: 'Supermarkets', color: '#495d38', items: property.nearbyFacilities.supermarkets },
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
                          {group.items.map((item) => (
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
                      <PropertyLocationMap center={property.mapCenter} />
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
                    className="w-full flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-xl border-2 transition-all hover:bg-[#be5d3f]/5"
                    style={{ color: '#be5d3f', borderColor: '#be5d3f' }}
                  >
                    <HeartIcon filled={saved} />
                    Save Land
                  </button>
                  <button
                    className="w-full flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-xl transition-all hover:opacity-90"
                    style={{ backgroundColor: '#ccb7a3', color: '#1d1d1d' }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share This Land
                  </button>
                </div>

                {/* AI Match Score — only shown when arrived from an AI page */}
                {fromAI && (
                  <div className="rounded-2xl shadow-sm p-6 text-center" style={{ backgroundColor: '#345b79' }}>
                    <MatchScoreRing score={passedAiScore ?? property.matchScore} />
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

                  <button
                    className="w-full text-sm font-bold py-3 rounded-xl text-white mb-2 transition-all hover:opacity-90"
                    style={{ backgroundColor: '#345b79' }}
                  >
                    Contact Agent
                  </button>
                  <button
                    onClick={() => setAgentSaved(!agentSaved)}
                    className="w-full flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-xl border-2 transition-all hover:bg-[#be5d3f]/5"
                    style={{ color: '#be5d3f', borderColor: '#be5d3f' }}
                  >
                    <HeartIcon filled={agentSaved} />
                    Save Property
                  </button>

                  {fromAI && (
                    <div
                      className="mt-4 text-center text-xs font-bold text-white py-2 rounded-lg"
                      style={{ backgroundColor: '#345b79' }}
                    >
                      AI Match Score {passedAiScore ?? property.matchScore}%
                    </div>
                  )}
                </div>

                {/* Property Details */}
                <div className="bg-white rounded-2xl shadow-sm p-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#928d64] mb-4">Property Details</p>
                  <ul className="space-y-0">
                    {property.details.map((detail, i) => (
                      <li
                        key={detail.label}
                        className={`flex items-center justify-between py-3 text-xs ${i < property.details.length - 1 ? 'border-b border-[#e6e0d4]' : ''}`}
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

        {/* ── Similar Properties ── */}
        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <h2 className="text-xl font-extrabold text-[#1d1d1d]">Similar Properties</h2>
              <Link
                to="/property-listing"
                className="flex items-center gap-1 text-sm font-semibold text-[#345b79] hover:gap-2 transition-all"
              >
                View All Properties
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similar.map((property) => (
                <SimilarPropertyCard key={property.id} property={property} fromAI={fromAI} />
              ))}
            </div>
          </div>
        </section>
      </div>


    </>
  )
}
