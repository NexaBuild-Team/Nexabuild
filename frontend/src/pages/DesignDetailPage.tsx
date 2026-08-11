// src/pages/DesignDetailPage.tsx
// Route: /designs/:id
// Full design detail view — Villa Lumina
import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router'
import api from '../services/api'
import { houseDesigns, designDetail as mockDesignDetail } from '../services/architectureMockData'

// ─── Star rating row ──────────────────────────────────────────────────────────
function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="w-4 h-4" viewBox="0 0 20 20" fill={i < rating ? '#f59e0b' : '#e6e0d4'}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
function DesignDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const [openPhase, setOpenPhase] = useState<string | null>('Off-Site Interiors')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [design, setDesign]   = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) { setNotFound(true); setLoading(false); return }
    setLoading(true)

    const fetchDesign = async () => {
      let loadedDesign: any = null

      try {
        const res = await api.get(`/architecture/designs/${id}`)
        const data = res.data
        if (data && data.title) {
          const detail = data.detail ?? {}
          loadedDesign = {
            id:                   data.id,
            title:                data.title,
            breadcrumb:           (detail.breadcrumb && detail.breadcrumb.length > 0) ? detail.breadcrumb : ['Home', 'Architecture', data.company?.name ?? 'Architecture', data.title],
            architectName:        detail.architectName ?? data.architectName ?? 'Arjun Silva',
            architectFirm:        detail.architectFirm ?? data.company?.name ?? 'Silva & Associates Architecture',
            location:             detail.locationLabel ?? data.locationLabel ?? 'Colombo 05',
            year:                 detail.completionYear ?? '2024',
            status:               detail.status ?? 'Completed',
            heroImage:            detail.heroImageUrl ?? data.imageUrl ?? 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&h=700&fit=crop',
            price:                detail.priceLkr ?? data.priceLkr ?? 2400000,
            bedrooms:             detail.bedrooms ?? data.bedrooms ?? 4,
            bathrooms:            detail.bathrooms ?? data.bathrooms ?? 3,
            sqft:                 detail.sqftArea ?? data.sqftArea ?? 3500,
            garage:               detail.garageSpaces ?? 2,
            overview:             detail.overview || `${data.title} is a masterfully crafted architectural creation located in ${detail.locationLabel ?? data.locationLabel ?? 'Sri Lanka'}. Designed by ${detail.architectName ?? data.architectName ?? 'the architecture team'}, this property harmonizes structural elegance with tropical environmental design.`,
            gallery:              (detail.gallery && detail.gallery.length > 0)
              ? detail.gallery.map((g: any) => g.url ?? g)
              : [
                  data.imageUrl ?? 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&h=600&fit=crop',
                  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&h=600&fit=crop',
                  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&h=600&fit=crop',
                  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&h=600&fit=crop',
                ],
            threeDVisualization:  detail.threeDVisualizationUrl ?? 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=600&fit=crop',
            floorPlans:           (detail.floorPlans && detail.floorPlans.length > 0)
              ? detail.floorPlans.map((p: any) => ({ label: p.label, image: p.imageUrl ?? p.image ?? '' }))
              : [
                  { label: 'Ground Floor Plan', image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&h=600&fit=crop' },
                  { label: 'First Floor Plan', image: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=600&h=400&fit=crop' },
                ],
            features:             (detail.features && detail.features.length > 0) ? detail.features : [
              { icon: '🏠', label: 'Custom Finishes' },
              { icon: '🌿', label: 'Landscaped Garden' },
              { icon: '⚡', label: 'Solar Energy System' },
              { icon: '🔒', label: 'Smart Home Automation' },
            ],
            constructionProgress: (detail.constructionProgress && detail.constructionProgress.length > 0)
              ? detail.constructionProgress.map((ph: any) => ({
                  phase:  ph.phase,
                  detail: ph.detail,
                  status: (ph.status ?? '').toLowerCase(),
                }))
              : [
                  { phase: 'Design & Planning', detail: 'Concept drawings, structural engineering, and municipal approvals completed.', status: 'completed' },
                  { phase: 'Foundation & Structure', detail: 'Excavation, reinforced concrete piling, and superstructure assembly.', status: 'completed' },
                  { phase: 'Civil & Core', detail: 'Brickwork, roof waterproofing, and primary utility conduit installation.', status: 'completed' },
                  { phase: 'MEP & Interiors', detail: 'Electrical, plumbing, flooring, and bespoke cabinetry installation.', status: 'in-progress' },
                ],
            review: detail.review ? {
              author: detail.review.author,
              avatar: detail.review.avatarUrl ?? detail.review.avatar ?? '',
              rating: detail.review.rating,
              text:   detail.review.text,
              date:   detail.review.reviewDate ?? detail.review.date ?? '',
            } : {
              author: 'Chaminda Senanayake',
              avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=80&h=80&fit=crop&crop=face',
              rating: 5,
              text: 'An exceptional architectural project. Every detail was planned with precision and elegance.',
              date: 'January 2024',
            },
            relatedProjects: (detail.relatedProjects && detail.relatedProjects.length > 0)
              ? detail.relatedProjects.map((r: any) => ({
                  id:    r.targetDesignId ?? r.id,
                  title: r.title,
                  image: r.imageUrl ?? r.image ?? '',
                  style: r.style,
                  price: r.priceLkr ?? r.price ?? 0,
                }))
              : [],
          }
        }
      } catch (err) {
        console.warn('API design query failed, attempting mock resolution:', err)
      }

      if (!loadedDesign) {
        if (id === 'villa-lumina') {
          loadedDesign = mockDesignDetail
        } else {
          const mockMatch = houseDesigns.find((h: any) => h.id === id)
          if (mockMatch) {
            loadedDesign = {
              id:                   mockMatch.id,
              title:                mockMatch.title,
              breadcrumb:           ['Home', 'Architecture Designs', mockMatch.title],
              architectName:        mockMatch.architectName || 'Arjun Silva',
              architectFirm:        mockMatch.architectFirm || 'Silva & Associates Architecture',
              location:             mockMatch.location ? `${mockMatch.location}, Sri Lanka` : 'Colombo 05, Sri Lanka',
              year:                 2024,
              status:               'Completed',
              heroImage:            mockMatch.imageUrl || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1400&h=600&fit=crop',
              price:                mockMatch.price || 2400000,
              bedrooms:             mockMatch.bedrooms || 4,
              bathrooms:            mockMatch.bathrooms || 3,
              sqft:                 mockMatch.sqft || 3500,
              garage:               2,
              overview:             `${mockMatch.title} is a landmark ${mockMatch.style?.toLowerCase() || 'contemporary'} residence designed by ${mockMatch.architectName || 'our leading architects'} of ${mockMatch.architectFirm || 'our practice'}. Located in ${mockMatch.location || 'Sri Lanka'}, the property harmonizes luxury finishes, natural ventilation, and tropical garden landscapes.`,
              gallery:              [
                mockMatch.imageUrl || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
                'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
                'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=400&h=300&fit=crop',
              ],
              threeDVisualization:  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=500&fit=crop',
              floorPlans:           [
                { label: 'Ground Floor Plan', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop' },
                { label: 'Upper Floor Plan', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&sat=-100' },
              ],
              features:             [
                { icon: '🌿', label: 'Tropical Garden' },
                { icon: '🏊', label: 'Private Pool' },
                { icon: '⚡', label: 'Solar Energy System' },
                { icon: '🚗', label: '2-Car Garage' },
                { icon: '🔒', label: 'Smart Home Security' },
                { icon: '🌬️', label: 'Natural Ventilation' },
              ],
              constructionProgress: [
                { phase: 'Design & Planning', detail: 'Architectural drawings, structural engineering, and municipal permits approved.', status: 'done' },
                { phase: 'Foundation & Structure', detail: 'Reinforced concrete foundation and superstructure completed.', status: 'done' },
                { phase: 'Shell & Core', detail: 'Masonry walls, roof structure, and external glazing completed.', status: 'done' },
                { phase: 'Interiors & Finishes', detail: 'Custom joinery and interior finishes in progress.', status: 'active' },
              ],
              review: {
                author: 'Chaminda Senanayake',
                avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=80&h=80&fit=crop&crop=face',
                rating: 5,
                text: `Working with ${mockMatch.architectName} was a fantastic experience. They delivered ${mockMatch.title} beyond our expectations.`,
                date: 'March 2025',
              },
              relatedProjects: houseDesigns.filter((h: any) => h.id !== id).slice(0, 3).map((r: any) => ({
                id: r.id,
                title: r.title,
                image: r.imageUrl,
                style: r.style,
                price: r.price,
              })),
            }
          }
        }
      }

      if (loadedDesign) {
        setDesign(loadedDesign)
      } else {
        setNotFound(true)
      }
      setLoading(false)
    }

    fetchDesign()
  }, [id])

  // Loading guard - soft architectural skeleton
  if (loading) return (
    <main className="min-h-screen bg-[#faf7f4] font-sans flex flex-col">
      {/* Skeleton Hero Header */}
      <div className="w-full bg-[#345b79] pt-24 pb-12 px-6 animate-pulse">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="w-40 h-4 bg-white/20 rounded-full" />
          <div className="w-2/3 h-10 bg-white/25 rounded-xl" />
          <div className="w-1/3 h-5 bg-white/15 rounded-md" />
        </div>
      </div>

      {/* Skeleton Key Specs Strip */}
      <div className="bg-[#e6e0d4] py-5 px-6 border-b border-[#ccb7a3]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-4 animate-pulse">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#345b79]/15 rounded-xl shrink-0" />
              <div className="space-y-1.5">
                <div className="w-14 h-4 bg-[#d5cbb8] rounded-md" />
                <div className="w-20 h-3 bg-[#d5cbb8]/70 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area Skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-12 w-full space-y-10 animate-pulse">
        {/* Hero Banner Image Skeleton */}
        <div className="w-full h-[380px] bg-[#e6e0d4] rounded-2xl" />

        {/* Overview & Specs Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            <div className="w-32 h-5 bg-[#e6e0d4] rounded-md" />
            <div className="w-full h-32 bg-[#e6e0d4]/70 rounded-xl" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-20 bg-[#e6e0d4] rounded-xl" />
              ))}
            </div>
          </div>
          <div className="h-72 bg-[#e6e0d4] rounded-2xl" />
        </div>
      </div>
    </main>
  )

  // 404 guard
  if (notFound || !design) {
    return (
      <>
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-6xl mb-4">🏙️</p>
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
    Completed:     { bg: '#d4edda', text: '#495d38' },
    'In Progress': { bg: '#fff3cd', text: '#928d64' },
    Planning:      { bg: '#d1ecf1', text: '#345b79' },
  }
  const statusStyle = statusColors[design.status] ?? { bg: '#e6e0d4', text: '#928d64' }

  return (
    <>
      {/* ══════════════════════════════════════════════════════════
          HERO — full-width cover image with overlay
      ══════════════════════════════════════════════════════════ */}
      <section className="relative h-80 md:h-96 overflow-hidden pt-32">
        <img
          src={design.heroImage}
          alt={design.title}
          className="w-full h-full object-cover"
        />
        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(29,29,29,0.88) 0%, rgba(29,29,29,0.30) 60%, transparent 100%)' }}
        />

        {/* Breadcrumb */}
        <div className="absolute top-32 left-0 right-0 px-6">
          <div className="max-w-7xl mx-auto">
            <nav className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.70)' }}>
              {design.breadcrumb.map((crumb: string, i: number) => (
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

        {/* Title + Save / Share */}
        <div className="absolute bottom-6 left-0 right-0 px-6">
          <div className="max-w-7xl mx-auto flex items-end justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{design.title}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background: statusStyle.bg, color: statusStyle.text }}
                >
                  {design.status}
                </span>
                <span className="text-sm opacity-80 text-white">{design.location}</span>
                <span className="text-sm opacity-80 text-white">· {design.year}</span>
              </div>
              <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.72)' }}>
                by {design.architectName} · {design.architectFirm}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Save */}
              <button
                id="save-detail-btn"
                onClick={() => setSaved((s) => !s)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: saved ? '#be5d3f' : 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  backdropFilter: 'blur(6px)',
                  border: '1.5px solid rgba(255,255,255,0.30)',
                }}
              >
                <svg className="w-4 h-4" fill={saved ? '#fff' : 'none'} stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {saved ? 'Saved' : 'Save'}
              </button>
              {/* Share */}
              <button
                id="share-detail-btn"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', backdropFilter: 'blur(6px)', border: '1.5px solid rgba(255,255,255,0.30)' }}
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

      {/* ══════════════════════════════════════════════════════════
          PAGE BODY — two-column layout (left sections | right sidebar)
      ══════════════════════════════════════════════════════════ */}
      <main className="flex-1 py-10 px-6" style={{ background: '#e6e0d4' }}>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start">

          {/* ════════════════════════════════════════════════════
              LEFT COLUMN — all page sections stacked vertically
          ════════════════════════════════════════════════════ */}
          <div className="flex-1 min-w-0 space-y-10">

            {/* ── 1. Project Overview ────────────────────────── */}
            <section>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#be5d3f' }}>Overview</span>
              <h2 className="text-2xl font-bold mt-1 mb-4" style={{ color: '#1d1d1d' }}>Project Overview</h2>
              <div className="rounded-2xl p-6" style={{ background: '#fff', border: '1px solid #ccb7a3', boxShadow: '0 4px 20px rgba(52,91,121,0.07)' }}>
                {design.overview.split('\n\n').map((para: string, i: number) => (
                  <p key={i} className="text-sm leading-relaxed mb-3 last:mb-0" style={{ color: '#928d64' }}>
                    {para.trim()}
                  </p>
                ))}
                {/* Spec row */}
                <div className="grid grid-cols-3 gap-6 mt-6 pt-5" style={{ borderTop: '1px solid #e6e0d4' }}>
                  {[
                    { label: 'DESIGN STYLE', value: 'Modern Minimalist' },
                    { label: 'STRUCTURE',    value: 'Reinforced Concrete' },
                    { label: 'INTERIOR',     value: 'Custom Designed' },
                  ].map((spec) => (
                    <div key={spec.label}>
                      <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#928d64' }}>{spec.label}</p>
                      <p className="font-semibold text-sm" style={{ color: '#1d1d1d' }}>{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── 2. Project Gallery — 5-photo mosaic ────────── */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#be5d3f' }}>Gallery</span>
                  <h2 className="text-2xl font-bold mt-1" style={{ color: '#1d1d1d' }}>Project Gallery</h2>
                </div>
                <button
                  id="view-all-photos-btn"
                  className="text-sm font-semibold px-4 py-2 rounded-lg border transition-colors"
                  style={{ borderColor: '#ccb7a3', color: '#345b79', background: '#fff' }}
                >
                  View All ({design.gallery.length})
                </button>
              </div>
              {/* Mosaic: 1 large left + 2×2 right */}
              <div className="grid gap-3" style={{ gridTemplateColumns: '3fr 2fr', height: '400px' }}>
                <div className="rounded-2xl overflow-hidden cursor-pointer">
                  <img
                    src={design.gallery[0]}
                    alt={`${design.title} — photo 1`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {design.gallery.slice(1, 5).map((img: string, i: number) => (
                    <div key={i} className="rounded-xl overflow-hidden cursor-pointer">
                      <img
                        src={img}
                        alt={`${design.title} — photo ${i + 2}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── 3. 3D Visualization ──────────────────────────── */}
            <section>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#be5d3f' }}>Virtual Tour</span>
              <h2 className="text-2xl font-bold mt-1 mb-4" style={{ color: '#1d1d1d' }}>3D Visualization</h2>
              <div className="relative rounded-2xl overflow-hidden" style={{ height: '320px' }}>
                <img src={design.threeDVisualization} alt="3D Visualization" className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'rgba(29,29,29,0.45)' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    id="view-3d-btn"
                    className="flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95"
                    style={{ background: '#345b79', boxShadow: '0 8px 32px rgba(52,91,121,0.55)' }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                    View 3D Visualization
                  </button>
                </div>
              </div>
            </section>

            {/* ── 4. Architectural Floor Plans ─────────────────── */}
            <section>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#be5d3f' }}>Plans</span>
              <h2 className="text-2xl font-bold mt-1 mb-4" style={{ color: '#1d1d1d' }}>Architectural Floor Plans</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {design.floorPlans.map((plan: any, i: number) => (
                  <div
                    key={i}
                    className="rounded-2xl overflow-hidden"
                    style={{ background: '#fff', border: '1px solid #ccb7a3', boxShadow: '0 4px 20px rgba(52,91,121,0.07)' }}
                  >
                    <div className="h-44 overflow-hidden">
                      <img
                        src={plan.image}
                        alt={plan.label}
                        className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                    <p className="px-4 py-3 text-sm font-semibold text-center" style={{ color: '#1d1d1d' }}>
                      {plan.label}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* ── 5. Project Features ──────────────────────────── */}
            <section>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#be5d3f' }}>Amenities</span>
              <h2 className="text-2xl font-bold mt-1 mb-4" style={{ color: '#1d1d1d' }}>Project Features</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {design.features.map((feat: any) => (
                  <div
                    key={feat.label}
                    className="rounded-xl p-4 flex flex-col items-center text-center gap-2 transition-shadow hover:shadow-md"
                    style={{ background: '#fff', border: '1px solid #ccb7a3', boxShadow: '0 2px 12px rgba(52,91,121,0.06)' }}
                  >
                    <span className="text-2xl">{feat.icon}</span>
                    <span className="text-xs font-semibold leading-tight" style={{ color: '#345b79' }}>{feat.label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* ── 6. Construction Progress — accordion timeline ── */}
            <section>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#be5d3f' }}>Timeline</span>
              <h2 className="text-2xl font-bold mt-1 mb-4" style={{ color: '#1d1d1d' }}>Construction Progress</h2>
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: '#fff', border: '1px solid #ccb7a3', boxShadow: '0 4px 20px rgba(52,91,121,0.07)' }}
              >
                {design.constructionProgress.map((phase: any, idx: number) => {
                  const isOpen     = openPhase === phase.phase
                  const dotColor   = phase.status === 'done' ? '#495d38' : phase.status === 'active' ? '#be5d3f' : '#ccb7a3'
                  const badgeBg    = phase.status === 'done' ? 'rgba(73,93,56,0.12)' : phase.status === 'active' ? 'rgba(190,93,63,0.12)' : '#e6e0d4'
                  const badgeText  = phase.status === 'done' ? '#495d38' : phase.status === 'active' ? '#be5d3f' : '#928d64'
                  const badgeLabel = phase.status === 'done' ? '✓ Complete' : phase.status === 'active' ? '⏳ In Progress' : 'Pending'
                  return (
                    <div key={phase.phase} className="border-b last:border-b-0" style={{ borderColor: '#e6e0d4' }}>
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
                            className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                            style={{ background: badgeBg, color: badgeText }}
                          >
                            {badgeLabel}
                          </span>
                        </div>
                        <svg
                          className="w-4 h-4 shrink-0 transition-transform duration-200"
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

            {/* ── 7. Client Review ─────────────────────────────── */}
            {design.review && (
            <section>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#be5d3f' }}>Testimonial</span>
              <h2 className="text-2xl font-bold mt-1 mb-4" style={{ color: '#1d1d1d' }}>What Our Client Says</h2>
              <div
                className="rounded-2xl p-8"
                style={{ background: '#fff', border: '1px solid #ccb7a3', boxShadow: '0 4px 20px rgba(52,91,121,0.07)' }}
              >
                <StarRow rating={design.review.rating} />
                <blockquote className="mt-4 text-sm leading-relaxed italic" style={{ color: '#928d64' }}>
                  "{design.review.text}"
                </blockquote>
                <div className="flex items-center gap-4 mt-6 pt-5 border-t" style={{ borderColor: '#e6e0d4' }}>
                  <img
                    src={design.review.avatar}
                    alt={design.review.author}
                    className="w-12 h-12 rounded-full object-cover shrink-0"
                  />
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#1d1d1d' }}>{design.review.author}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#6b879c' }}>Homeowner · {design.review.date}</p>
                  </div>
                </div>
              </div>
            </section>
            )}

            {/* ── 8. Related Projects ──────────────────────────── */}
            <section className="pb-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#be5d3f' }}>Explore More</span>
                  <h2 className="text-2xl font-bold mt-1" style={{ color: '#1d1d1d' }}>Related Projects</h2>
                </div>
                <Link to="/designs" className="text-sm font-semibold hover:underline" style={{ color: '#345b79' }}>
                  View All →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {design.relatedProjects.map((proj: any) => (
                  <Link
                    key={proj.id}
                    to={`/designs/${proj.id}`}
                    id={`related-${proj.id}`}
                    className="rounded-2xl overflow-hidden block transition-shadow hover:shadow-lg"
                    style={{ background: '#fff', border: '1px solid #ccb7a3', boxShadow: '0 2px 16px rgba(52,91,121,0.07)' }}
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
                        className="px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{ background: '#e6e0d4', color: '#345b79' }}
                      >
                        {proj.style}
                      </span>
                      <h3 className="font-semibold text-sm mt-2 mb-1" style={{ color: '#1d1d1d' }}>{proj.title}</h3>
                      <p className="font-bold text-base" style={{ color: '#be5d3f' }}>
                        LKR {proj.price.toLocaleString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

          </div>{/* ── end LEFT COLUMN ── */}

                   {/* ── STICKY RIGHT SIDEBAR — Pricing + CTAs ───────────── */}
          <aside className="w-full lg:w-80 shrink-0 lg:sticky lg:top-24 flex flex-col gap-6">
            
            {/* 🟦 CARD 1: BLUE STEEL BUDGET CARD */}
            <div className="w-full rounded-[28px] p-6 text-white font-sans shadow-lg select-none" style={{ backgroundColor: '#345b79', boxShadow: '0 4px 24px rgba(52,91,121,0.12)' }}>
              <div className="mb-4">
                <p className="text-[10px] font-extrabold uppercase tracking-widest opacity-60 mb-0.5">Estimated Budget</p>
                <h2 className="text-4xl font-extrabold tracking-tight mb-0.5">LKR {design.price.toLocaleString()}</h2>
                <p className="text-xs font-medium opacity-70">Negotiable · Financing Available</p>
              </div>

              {/* 6 Specification Parameters Grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-6">
                <div className="flex items-center gap-3 py-1">
                  <div className="w-9 h-9 shrink-0 flex items-center justify-center rounded-xl bg-white/10 text-white"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg></div>
                  <div className="text-left leading-tight"><p className="text-[9px] font-bold uppercase tracking-wider opacity-50">Bedrooms</p><p className="text-sm font-extrabold mt-0.5">{design.bedrooms}</p></div>
                </div>
                <div className="flex items-center gap-3 py-1">
                  <div className="w-9 h-9 shrink-0 flex items-center justify-center rounded-xl bg-white/10 text-white"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2" /><line x1="3" y1="10" x2="21" y2="10" /><path d="M8 14h.01M16 14h.01" /></svg></div>
                  <div className="text-left leading-tight"><p className="text-[9px] font-bold uppercase tracking-wider opacity-50">Bathrooms</p><p className="text-sm font-extrabold mt-0.5">{design.bathrooms}</p></div>
                </div>
                <div className="flex items-center gap-3 py-1">
                  <div className="w-9 h-9 shrink-0 flex items-center justify-center rounded-xl bg-white/10 text-white"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="12" y1="3" x2="12" y2="21" /></svg></div>
                  <div className="text-left leading-tight"><p className="text-[9px] font-bold uppercase tracking-wider opacity-50">Floors</p><p className="text-sm font-extrabold mt-0.5">2</p></div>
                </div>
                <div className="flex items-center gap-3 py-1">
                  <div className="w-9 h-9 shrink-0 flex items-center justify-center rounded-xl bg-white/10 text-white"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M21 3l-6.5 18-3.5-8-8-3.5z" /><line x1="11" y1="13" x2="21" y2="3" /></svg></div>
                  <div className="text-left leading-tight"><p className="text-[9px] font-bold uppercase tracking-wider opacity-50">Land Size</p><p className="text-sm font-extrabold mt-0.5">850 m²</p></div>
                </div>
                <div className="flex items-center gap-3 py-1">
                  <div className="w-9 h-9 shrink-0 flex items-center justify-center rounded-xl bg-white/10 text-white"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" /></svg></div>
                  <div className="text-left leading-tight"><p className="text-[9px] font-bold uppercase tracking-wider opacity-50">House Area</p><p className="text-sm font-extrabold mt-0.5">420 m²</p></div>
                </div>
                <div className="flex items-center gap-3 py-1">
                  <div className="w-9 h-9 shrink-0 flex items-center justify-center rounded-xl bg-white/10 text-white"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg></div>
                  <div className="text-left leading-tight"><p className="text-[9px] font-bold uppercase tracking-wider opacity-50">Completion</p><p className="text-sm font-extrabold mt-0.5">Mar 2024</p></div>
                </div>
              </div>

              <button id="contact-architect-btn" className="w-full py-3.5 bg-white text-[#345b79] rounded-2xl font-bold text-sm tracking-wide transition-all hover:bg-white/95 shadow-md flex items-center justify-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                Contact Architect
              </button>
            </div>

            {/* ⬜ CARD 2: WHITE STUDIO PROFILE CARD */}
            <div className="w-full bg-white p-5 rounded-[22px] border border-[#e6e0d4] shadow-sm select-none">
              {/* Cover Image Header Banner restored perfectly */}
              <div className="relative h-24 bg-[#1a2332] rounded-xl overflow-hidden mb-4">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=640&h=240&fit=crop&auto=format"
                  alt="Silva & Associates Architecture Cover"
                  className="w-full h-full object-cover opacity-60 filter grayscale contrast-125"
                />
                <span className="absolute top-2 right-2 bg-[#be5d3f] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                  ✓ Verified Studio
                </span>
              </div>
              
              {/* Profile identity info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm bg-[#345b79]">S</div>
                <div className="text-left">
                  <h4 className="font-extrabold text-sm text-[#1d1d1d]">{design.architectFirm}</h4>
                  <p className="text-[11px] font-medium text-[#928d64]">{design.location}</p>
                </div>
              </div>

              {/* 3 Metrics Block row */}
              <div className="grid grid-cols-3 gap-2 text-center p-2.5 rounded-xl mb-4 border bg-[#faf7f4] border-[#e6e0d4]">
                <div><p className="font-extrabold text-sm text-[#1d1d1d]">48</p><p className="text-[9px] font-bold uppercase tracking-wide text-[#6b879c]">Projects</p></div>
                <div><p className="font-extrabold text-sm text-[#1d1d1d]">4.9</p><p className="text-[9px] font-bold uppercase tracking-wide text-[#6b879c]">Rating</p></div>
                <div><p className="font-extrabold text-sm text-[#1d1d1d]">12yr</p><p className="text-[9px] font-bold uppercase tracking-wide text-[#6b879c]">Exp.</p></div>
              </div>

              {/* Call to Actions button footer row */}
              <div className="flex gap-2">
                <button id="firm-contact-btn" className="flex-1 py-2 text-white text-xs font-bold rounded-lg bg-[#345b79] transition-all hover:opacity-90">Contact</button>
                <button id="firm-portfolio-btn" className="flex-1 py-2 text-xs font-bold rounded-lg border bg-white border-[#ccb7a3] text-[#345b79] transition-all hover:bg-gray-50">View Portfolio</button>
              </div>
            </div>

          </aside>
        </div>
      </main>
    </>
  );
}

export default DesignDetailPage;
