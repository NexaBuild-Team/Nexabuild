// src/pages/DesignsPage.tsx
// Route: /designs
// Architect Profile View — Silva & Associates Architecture

import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router'
import api from '../services/api'
import { houseDesigns as fallbackHouseDesigns } from '../services/architectureMockData'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Custom high-precision SVG pin icon builder
const customMarkerIcon = new L.DivIcon({
  html: `<div class="flex items-center justify-center">
          <svg class="w-8 h-8 text-[#be5d3f] drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
         </div>`,
  className: 'custom-pin-container',
  popupAnchor: [0, -10]
});



// ─── Static data ──────────────────────────────────────────────────────────────

// firm is fetched from the API inside the component (see useEffect below)

const stats = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 22V12m0 0C12 6 7 3 2 3c0 5 3 9 10 9z" />
        <path d="M12 12c0-6 5-9 10-9 0 5-3 9-10 9z" />
      </svg>
    ),
    value: '18+',
    label: 'Years Experience',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    value: '143',
    label: 'Projects Completed',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    value: '14+',
    label: 'Awards Won',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    value: '98%',
    label: 'Client Satisfaction',
  },
]

const services = [
  {
    icon: '🏠',
    title: 'Residential Design',
    desc: 'Custom home designs tailored to your lifestyle, from modern urban homes to tropical retreat residences throughout Sri Lanka.',
  },
  {
    icon: '🏖️',
    title: 'Luxury Villas',
    desc: 'High-end villa architecture with premium finishes, panoramic layouts, and resort-style amenities for discerning clients.',
  },
  {
    icon: '🏢',
    title: 'Commercial Buildings',
    desc: 'Corporate offices, retail complexes, and hospitality developments built to the highest international design standards.',
  },
  {
    icon: '🛋️',
    title: 'Interior Design',
    desc: 'Seamless interior design services that extend the architectural vision into every space, surface, and material detail.',
  },
  {
    icon: '🌿',
    title: 'Landscape Design',
    desc: 'Biophilic outdoor environments, courtyard gardens, and sustainable landscape masterplanning for tropical climates.',
  },
  {
    icon: '🔨',
    title: 'Renovation',
    desc: 'Breathing new life into existing structures through thoughtful architectural transformation and sensitive heritage adaptation.',
  },
]

// latestProjects is now populated from the API inside the component

const testimonials = [
  {
    id: 1,
    rating: 5,
    text: 'Silva & Associates exceeded every expectation. Their attention to detail and commitment to our vision produced a home that is truly extraordinary. The process was seamless from concept to completion.',
    author: 'Chaminda Senanayake',
    role: 'Homeowner · Colombo',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=80&h=80&fit=crop&crop=face',
  },
  {
    id: 2,
    rating: 5,
    text: "Working with Arjun Silva's team was a transformative experience. They brought creativity, professionalism, and precision to every phase of our commercial development in Kandy.",
    author: 'Ravi Wickramasinghe',
    role: 'Developer · Kandy',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
  },
  {
    id: 3,
    rating: 5,
    text: 'From the first consultation to the final walkthrough, Silva & Associates delivered a level of service that set the benchmark. Our villa is beyond anything we had ever imagined.',
    author: 'Priya Jayasuriya',
    role: 'Homeowner · Galle',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=face',
  },
]

const teamMembers = [
  {
    id: 1,
    name: 'Arjun Silva',
    title: 'Principal Architect',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: 2,
    name: 'Priya Mendis',
    title: 'Creative Director',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: 3,
    name: 'Rohan Fernando',
    title: 'Senior Architect',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: 4,
    name: 'Nisha Perera',
    title: 'Project Manager',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
  },
]

// ─── Stars sub-component ──────────────────────────────────────────────────────

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className="w-4 h-4" viewBox="0 0 20 20" fill={s <= count ? '#f59e0b' : '#e6e0d4'}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DesignsPage() {
  const { id, companyId } = useParams()
  const targetCompanyId = companyId || id || 'silva-associates'

  // Live firm profile
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [firm, setFirm]                   = useState<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [latestProjects, setLatestProjects] = useState<any[]>([])
  const [loading, setLoading]             = useState(true)

  useEffect(() => {
    let isMounted = true;
    setLoading(true)

    const fetchFirmData = async () => {
      try {
        // 1. Fetch company data
        const resCompany = await api.get(`/architecture/${targetCompanyId}`)
        const companyData = resCompany.data
        if (!isMounted) return
        setFirm(companyData)

        // 2. Fetch all designs
        const resDesigns = await api.get('/architecture/designs')
        const allDesigns: any[] = resDesigns.data ?? []

        let projects = (companyData?.houseDesigns && companyData.houseDesigns.length > 0)
          ? companyData.houseDesigns
          : allDesigns.filter((d: any) => d.companyId === targetCompanyId || d.company?.id === targetCompanyId || d.companyId === companyData?.id)

        if (!projects || projects.length === 0) {
          projects = allDesigns.length > 0 ? allDesigns : fallbackHouseDesigns
        }

        const mapped = projects.map((d: any) => ({
          id: d.id,
          title: d.title || 'Villa Lumina',
          style: d.style || 'Modern',
          priceLkr: d.priceLkr || d.price || 2400000,
          price: d.priceLkr || d.price || 2400000,
          locationLabel: d.locationLabel || d.location || 'Colombo 05',
          location: d.locationLabel || d.location || 'Colombo 05',
          imageUrl: d.imageUrl || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop',
        }))

        if (isMounted) setLatestProjects(mapped)
      } catch (err) {
        console.error('Failed to load firm profile:', err)
        try {
          const resAll = await api.get('/architecture/designs')
          const dbDesigns = resAll.data ?? []
          const list = dbDesigns.length > 0 ? dbDesigns : fallbackHouseDesigns
          if (isMounted) {
            setLatestProjects(list.map((d: any) => ({
              id: d.id,
              title: d.title || 'Villa Lumina',
              style: d.style || 'Modern',
              priceLkr: d.priceLkr || d.price || 2400000,
              price: d.priceLkr || d.price || 2400000,
              locationLabel: d.locationLabel || d.location || 'Colombo 05',
              location: d.locationLabel || d.location || 'Colombo 05',
              imageUrl: d.imageUrl || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop',
            })))
          }
        } catch {
          if (isMounted) {
            setLatestProjects(fallbackHouseDesigns.map((d: any) => ({
              id: d.id,
              title: d.title,
              style: d.style,
              priceLkr: d.price,
              price: d.price,
              locationLabel: d.location,
              location: d.location,
              imageUrl: d.imageUrl,
            })))
          }
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchFirmData()

    return () => { isMounted = false }
  }, [targetCompanyId])

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf7f4] flex flex-col font-sans text-[#1d1d1d]">
        {/* Soft Slate Blue Hero Banner Skeleton */}
        <div className="w-full bg-[#345b79] pt-28 pb-16 px-6 animate-pulse">
          <div className="max-w-7xl mx-auto space-y-5">
            <div className="w-36 h-4 bg-white/20 rounded-full" />
            <div className="w-1/2 h-10 bg-white/25 rounded-xl" />
            <div className="flex gap-3 pt-2">
              <div className="w-44 h-11 bg-white/20 rounded-xl" />
              <div className="w-28 h-11 bg-white/10 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Warm Beige Stats Bar Skeleton */}
        <div className="bg-[#e6e0d4] py-5 px-6 border-b border-[#ccb7a3]">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#345b79]/15 rounded-xl shrink-0" />
                <div className="space-y-2">
                  <div className="w-16 h-5 bg-[#d5cbb8] rounded-md" />
                  <div className="w-24 h-3 bg-[#d5cbb8]/70 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Area Skeleton */}
        <div className="max-w-7xl mx-auto px-6 py-14 w-full flex-1 space-y-12 animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <div className="w-28 h-4 bg-[#e6e0d4] rounded-full" />
              <div className="w-2/3 h-8 bg-[#e6e0d4] rounded-lg" />
              <div className="w-full h-24 bg-[#e6e0d4]/70 rounded-xl" />
              <div className="flex gap-2 pt-2">
                {[1, 2, 3].map(t => (
                  <div key={t} className="w-20 h-7 bg-[#e6e0d4] rounded-full" />
                ))}
              </div>
            </div>
            <div className="h-72 bg-[#e6e0d4] rounded-2xl" />
          </div>
        </div>
      </main>
    )
  }

  const displayProjects = (latestProjects && latestProjects.length > 0)
    ? latestProjects
    : fallbackHouseDesigns.slice(0, 3).map((d: any) => ({
        id: d.id,
        title: d.title,
        style: d.style,
        priceLkr: d.price,
        price: d.price,
        locationLabel: d.location,
        location: d.location,
        imageUrl: d.imageUrl,
      }))

  const featuredProject = displayProjects[0] || {
    id: 'villa-lumina',
    title: 'Villa Lumina',
    style: 'Modern',
    priceLkr: 2400000,
    price: 2400000,
    locationLabel: 'Colombo 05',
    location: 'Colombo 05',
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&h=600&fit=crop',
  }

  const rawSide = displayProjects.slice(1)
  const sideProjects = rawSide.length >= 2 ? rawSide.slice(0, 2) : [
    {
      id: 'green-haven',
      title: 'Green Haven Residence',
      style: 'Sustainable',
      priceLkr: 1200000,
      price: 1200000,
      locationLabel: 'Kandy',
      location: 'Kandy',
      imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=600&h=400&fit=crop',
    },
    {
      id: 'ocean-breeze',
      title: 'Ocean Breeze Villa',
      style: 'Luxury',
      priceLkr: 3800000,
      price: 3800000,
      locationLabel: 'Negombo',
      location: 'Negombo',
      imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop',
    },
  ]

  const dynamicStats = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M12 22V12m0 0C12 6 7 3 2 3c0 5 3 9 10 9z" />
          <path d="M12 12c0-6 5-9 10-9 0 5-3 9-10 9z" />
        </svg>
      ),
      value: firm?.yearsExperience ? `${firm.yearsExperience}+` : '18+',
      label: 'Years Experience',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      value: firm?.projectCount ? `${firm.projectCount}` : '143',
      label: 'Projects Completed',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
      ),
      value: firm?.awardsWon ? `${firm.awardsWon}+` : '14+',
      label: 'Awards Won',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      value: firm?.clientSatisfactionPct ? `${firm.clientSatisfactionPct}%` : '98%',
      label: 'Client Satisfaction',
    },
  ]

  const displayServices = (firm?.services && firm.services.length > 0)
    ? firm.services.map((s: any) => ({
        icon: s.icon || '🏠',
        title: s.title,
        desc: s.description || s.desc || '',
      }))
    : services

  const displayTestimonials = (firm?.testimonials && firm.testimonials.length > 0)
    ? firm.testimonials.map((t: any, i: number) => ({
        id: t.id || i,
        rating: t.rating || 5,
        text: t.text,
        author: t.author,
        role: t.role || `${firm?.city || 'Sri Lanka'}`,
        avatar: t.avatarUrl || t.avatar || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=80&h=80&fit=crop&crop=face',
      }))
    : testimonials

  const displayTeam = (firm?.teamMembers && firm.teamMembers.length > 0)
    ? firm.teamMembers.map((m: any, i: number) => ({
        id: m.id || i,
        name: m.name,
        title: m.title,
        photo: m.photoUrl || m.photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
      }))
    : teamMembers

  const specializationTags = (firm?.specializations && firm.specializations.length > 0)
    ? firm.specializations.map((s: any) => typeof s === 'string' ? s : s.label)
    : ['Modern', 'Tropical', 'Luxury', 'Sustainable', 'Award-Winning']

  return (
    <>
      {/* ═════════════════════════════════════════════════════════════
          1. HERO — full-width cover image + overlay + title + CTAs
      ═════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ minHeight: '380px' }}>
        {/* Cover photo (absolute, behind everything) */}
        <img
          src={firm?.coverImageUrl || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&h=700&fit=crop"}
          alt={firm?.name ?? "Silva & Associates Architecture"}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(20,20,20,0.92) 0%, rgba(20,20,20,0.55) 55%, rgba(20,20,20,0.30) 100%)',
          }}
        />

        {/* Content — sits on top of overlay */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-14">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs mb-5" style={{ color: 'rgba(255,255,255,0.60)' }}>
            <Link to="/" className="hover:opacity-80">Home</Link>
            <span>/</span>
            <Link to="/architecture" className="hover:opacity-80">Architecture</Link>
            <span>/</span>
            <span style={{ color: '#d59b86' }}>{firm?.name ?? 'Silva & Associates Architecture'}</span>
          </nav>

          {/* Firm name */}
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-7" style={{ maxWidth: '600px' }}>
            {firm?.name ?? 'Silva & Associates Architecture'}
          </h1>

          {/* Action buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              id="request-consultation-hero-btn"
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: '#be5d3f' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.4 2 2 0 0 1 3.6 2.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Request Consultation
            </button>
            <button
              id="share-profile-btn"
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:bg-white/20"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.35)' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              Share
            </button>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          2. STATS BAR — white strip with 4 key metrics
      ═════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#e6e0d4', borderBottom: '1px solid #ccb7a3' }}>
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x" style={{ borderColor: '#e6e0d4' }}>
            {dynamicStats.map((stat, i) => (
              <div key={i} className="flex items-center gap-4 px-6 first:pl-0 last:border-r-0">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(52,91,121,0.09)', color: '#345b79' }}
                >
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold leading-none" style={{ color: '#1d1d1d' }}>{stat.value}</p>
                  <p className="text-xs mt-1" style={{ color: '#928d64' }}>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          3. ABOUT — two-column: text left, office photo right
      ═════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-6" style={{ background: '#faf7f4' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Left: bio */}
          <div>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#be5d3f' }}>
              About the Firm
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-5" style={{ color: '#1d1d1d' }}>
              About {firm?.name ?? 'Silva & Associates'}
            </h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#928d64' }}>
              {firm?.description ?? "Founded in 2006, Silva & Associates Architecture is one of Sri Lanka's most celebrated contemporary practices."}
            </p>
            <div className="flex flex-wrap gap-2">
              {specializationTags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background: '#e6e0d4', color: '#345b79' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right: office photo */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ height: '360px', boxShadow: '0 8px 40px rgba(52,91,121,0.12)' }}
          >
            <img
              src={firm?.coverImageUrl || firm?.avatarUrl || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&h=700&fit=crop"}
              alt={`${firm?.name ?? 'Architecture Firm'} office`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          4. OUR SERVICES — 3 × 2 card grid
      ═════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-6" style={{ background: '#e6e0d4' }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#be5d3f' }}>
              Our Services
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mt-2" style={{ color: '#1d1d1d' }}>
              Our Services
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayServices.map((svc: any, i: number) => (
              <div
                key={i}
                className="rounded-2xl p-6 transition-shadow hover:shadow-md"
                style={{ background: '#faf7f4', border: '1px solid #e6e0d4' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                  style={{ background: 'rgba(52,91,121,0.09)' }}
                >
                  {svc.icon}
                </div>
                <h3 className="font-semibold text-base mb-2" style={{ color: '#1d1d1d' }}>{svc.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#928d64' }}>{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          5. LATEST PROJECTS — featured large + 2 stacked side cards
      ═════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-6" style={{ background: '#faf7f4' }}>
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#be5d3f' }}>
                Latest Projects
              </span>
              <h2 className="text-2xl md:text-3xl font-bold mt-2" style={{ color: '#1d1d1d' }}>
                Latest Projects
              </h2>
            </div>
            <Link
              to="/architecture"
              className="text-sm font-semibold flex items-center gap-1 hover:underline"
              style={{ color: '#345b79' }}
            >
              View All Projects <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Project mosaic */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-[440px]">
            {/* Featured card — left 2 columns */}
            {featuredProject && (
              <Link
                to={`/designs/${featuredProject.id}`}
                id={`project-featured-${featuredProject.id}`}
                className="lg:col-span-2 relative rounded-2xl overflow-hidden group block"
                style={{ boxShadow: '0 4px 24px rgba(52,91,121,0.12)' }}
              >
                <img
                  src={featuredProject.imageUrl.replace('w=600', 'w=900')}
                  alt={featuredProject.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(29,29,29,0.88) 0%, rgba(29,29,29,0.10) 60%, transparent 100%)',
                  }}
                />
                <div className="absolute bottom-0 left-0 p-7">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2"
                    style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', backdropFilter: 'blur(6px)' }}
                  >
                    {featuredProject.style}
                  </span>
                  <h3 className="text-xl font-bold text-white leading-snug">{featuredProject.title}</h3>
                  <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.72)' }}>
                    {featuredProject.locationLabel ?? featuredProject.location} &nbsp;·&nbsp; LKR {(featuredProject.priceLkr ?? featuredProject.price ?? 0).toLocaleString()}
                  </p>

                </div>

                {/* 🎯 FIGMA MATCHED STYLE — Solid white rounded button container block */}
                <span 
                  className="absolute bottom-6 right-6 px-5 py-2.5 bg-white text-[#2d4a63] rounded-xl text-xs font-bold font-sans tracking-wide shadow-md select-none transition-transform duration-200 group-hover:scale-105"
                >
                  View Details
                </span>


              </Link>
            )}

            {/* Two stacked side cards — right 1 column */}
            <div className="flex flex-col gap-4 h-full">
              {sideProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/designs/${project.id}`}
                  id={`project-side-${project.id}`}
                  className="relative rounded-2xl overflow-hidden group block flex-1"
                  style={{ boxShadow: '0 4px 24px rgba(52,91,121,0.10)' }}
                >
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(29,29,29,0.85) 0%, transparent 65%)' }}
                  />
                  <div className="absolute bottom-0 left-0 p-5">
                    <span
                      className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold mb-1"
                      style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', backdropFilter: 'blur(4px)' }}
                    >
                      {project.style}
                    </span>
                    <h3 className="text-sm font-bold text-white leading-snug">{project.title}</h3>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.72)' }}>
                      LKR {(project.priceLkr ?? project.price ?? 0).toLocaleString()}
                    </p>

                    {/* 🧭 SIDE CARDS ANCHOR: Easily drop your placeholder "View Details" button elements directly below this comment block line later */}
                  <div className="mt-3 pt-2 border-t border-white/20 text-[10px] font-bold opacity-60 flex items-center justify-between">
                    <span>View Project Details</span>
                    <span>→</span>
                  </div>

                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          6. TESTIMONIALS — 3 equal-width review cards
      ═════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-6" style={{ background: '#e6e0d4' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#be5d3f' }}>
              Like Us
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mt-2" style={{ color: '#1d1d1d' }}>
              What Our Clients Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayTestimonials.map((t: any) => (
              <div
                key={t.id}
                className="rounded-2xl p-6 flex flex-col"
                style={{
                  background: '#faf7f4',
                  border: '1px solid #e6e0d4',
                  boxShadow: '0 2px 16px rgba(52,91,121,0.06)',
                }}
              >
                <Stars count={t.rating} />
                <blockquote
                  className="mt-4 text-sm leading-relaxed flex-1 italic"
                  style={{ color: '#928d64' }}
                >
                  "{t.text}"
                </blockquote>
                <div
                  className="flex items-center gap-3 mt-5 pt-5"
                  style={{ borderTop: '1px solid #e6e0d4' }}
                >
                  <img
                    src={t.avatar}
                    alt={t.author}
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                  <div>
                    <p className="font-semibold text-sm" style={{ color: '#1d1d1d' }}>{t.author}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#6b879c' }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          7. MEET OUR TEAM — 4 member portrait cards
      ═════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-6" style={{ background: '#e6e0d4' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#be5d3f' }}>
              Discover More
            </span>
            <h2 className="text-2xl md:text-3xl font-bold mt-2" style={{ color: '#1d1d1d' }}>
              Meet Our Team
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {displayTeam.map((member: any) => (
              <div
                key={member.id}
                className="rounded-2xl overflow-hidden text-center"
                style={{
                  background: '#fff',
                  border: '1px solid #e6e0d4',
                  boxShadow: '0 2px 16px rgba(52,91,121,0.06)',
                }}
              >
                <div className="h-52 overflow-hidden">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="px-4 py-4">
                  <p className="font-semibold text-sm" style={{ color: '#1d1d1d' }}>{member.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#928d64' }}>{member.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════
          8. CONTACT — left: details + map  |  right: form
      ═════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-6" style={{ background: '#e6e0d4' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* ── Left: Contact details + map ── */}
          <div>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#be5d3f' }}>
              Reach Out
            </span>
            <h2 className="text-2xl font-bold mt-2 mb-7" style={{ color: '#1d1d1d' }}>Contact Us</h2>

            <ul className="space-y-5 mb-7">
              {/* Address */}
              <li className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: 'rgba(52,91,121,0.09)', color: '#345b79' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#6b879c' }}>Address</p>
                  <p className="text-sm" style={{ color: '#1d1d1d' }}>
                    {firm?.address || (firm?.locationLabel ? `${firm.locationLabel}, ${firm.city || ''}, ${firm.country || 'Sri Lanka'}` : '42 Galle Road, Colombo 03, Sri Lanka')}
                  </p>
                </div>
              </li>

              {/* Phone */}
              <li className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: 'rgba(52,91,121,0.09)', color: '#345b79' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.4 2 2 0 0 1 3.6 2.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#6b879c' }}>Phone</p>
                  <a href={`tel:${firm?.phone || '+94112345678'}`} className="text-sm hover:underline" style={{ color: '#1d1d1d' }}>
                    {firm?.phone || '+94 11 234 5678'}
                  </a>
                </div>
              </li>

              {/* Email */}
              <li className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: 'rgba(52,91,121,0.09)', color: '#345b79' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#6b879c' }}>Email</p>
                  <a href={`mailto:${firm?.email || 'info@firm.lk'}`} className="text-sm hover:underline" style={{ color: '#1d1d1d' }}>
                    {firm?.email || 'info@silvaassociates.lk'}
                  </a>
                </div>
              </li>
            </ul>

            
            

          </div>

                    {/* ── Right: Edge-to-Edge Premium Live Location Map ── */}
          <div 
            className="w-full h-full min-h-[420px] rounded-2xl overflow-hidden relative shadow-sm border border-gray-200"
            style={{ boxShadow: '0 4px 20px rgba(52,91,121,0.05)' }}
          >
            {/* 📍 Floating Location Badge (Cleanly layered right on top of map canvas layout tracks) */}
            <div className="absolute top-4 left-4 z-[400] bg-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md border border-gray-100 text-gray-800 flex items-center gap-1.5 pointer-events-none">
              <span className="text-sm">📍</span> Office Location — Colombo 03
            </div>

            {/* Live Interactive Map Core */}
            <div className="w-full h-full absolute inset-0 z-10">
              <MapContainer 
                center={[6.9271, 79.8612]} 
                zoom={14} 
                scrollWheelZoom={false}
                className="w-full h-full"
                attributionControl={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[6.9271, 79.8612]} icon={customMarkerIcon}>
                  <Popup>
                    Silva & Associates Architecture <br /> Colombo 03, Sri Lanka.
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
          

        </div>
      </section>
    </>
  )
}
