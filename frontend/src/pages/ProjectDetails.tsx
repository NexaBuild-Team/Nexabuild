import { useState } from 'react'
import { Link, useParams } from 'react-router'
import nexaBuildLogo from '../assets/NexaBuildlogo.png'

// ─── Color Palette ─────────────────────────────────────────────────────────────
// Primary Blue    : #345b79   Brick Accent : #be5d3f   Background : #e6e0d4
// Secondary Bg    : #ccb7a3   Sec Blue     : #6b879c   Light Acc  : #d59b86
// Olive Accent    : #928d64   Dark Text    : #1d1d1d   Green Acc  : #495d38

// ─── Project Data ──────────────────────────────────────────────────────────────
const allProjects: Record<string, ProjectData> = {
  '1': {
    id: '1',
    name: 'Palm Heights Private Estate',
    subtitle: 'Luxury Residential Villa · Completed 2023',
    tags: ['Featured', 'Luxury Villa'],
    location: 'Koswatta, Battaramulla, Western Province',
    client: 'Mr. & Mrs. Dharmasiri',
    year: 2023,
    duration: '18 Months',
    area: '8,400 Sqft',
    rooms: '7 Bedrooms',
    type: 'Luxury Villa',
    budgetPerSqft: 'LKR 4,800',
    totalBudget: 'LKR 320M',
    status: 'Completed',
    mainImage: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=90',
    gallery: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&q=80',
    ],
    overview: `Palm Heights Private Estate is a landmark luxury residential project nestled in the serene environs of Koswatta, Battaramulla. Designed to harmonize with the natural landscape, the estate features sweeping tropical gardens, an infinity-edge swimming pool, and panoramic views of the Diyawanna Oya wetlands.\n\nThe project was conceived with a vision of blending contemporary Sri Lankan architecture with high-end resort-style living. Every element — from the imported Italian marble flooring to the custom-crafted timber ceilings — was meticulously curated to deliver an unparalleled living experience.\n\nAvant Construction Group managed the full lifecycle of this project, from geotechnical surveys and structural engineering through to bespoke interior fit-out, landscape design, and smart home integration.`,
    features: [
      { icon: '🏊', label: 'Private Infinity Pool' },
      { icon: '🌿', label: 'Landscaped Gardens' },
      { icon: '🚗', label: 'Zub-Zero Basement' },
      { icon: '🎬', label: 'Private Home Theatre' },
      { icon: '🧘', label: 'Spa & Wellness Bay' },
      { icon: '🔐', label: 'Smart Home System' },
      { icon: '☀️', label: 'Solar Energy Array' },
      { icon: '🏋️', label: 'Private Gymnasium' },
    ],
    materials: [
      { label: 'MARBLE & STONE', detail: 'Italian Calacatta Marble (Floors)', color: '#ccb7a3' },
      { label: 'STRUCTURAL STEEL', detail: 'Grade 60 High-Yield Rebar', color: '#6b879c' },
      { label: 'FACADE MATERIAL', detail: 'Burnished Fair-Face Concrete', color: '#928d64' },
      { label: 'TIMBER WORKS', detail: 'Teak & Mahogany Custom Millwork', color: '#be5d3f' },
      { label: 'ROOF SYSTEM', detail: 'Zinc Standing-Seam Roof', color: '#345b79' },
      { label: 'GLASS & GLAZING', detail: 'Pilkington Low-E Double Glazing', color: '#495d38' },
    ],
    timeline: [
      { phase: 'Site Clearance & Surveying', duration: 'Jan 2022 – Feb 2022', status: 'done' },
      { phase: 'Foundation & Basement', duration: 'Mar 2022 – Jun 2022', status: 'done' },
      { phase: 'Structural Frame', duration: 'Jul 2022 – Nov 2022', status: 'done' },
      { phase: 'Facade & Roofing', duration: 'Dec 2022 – Mar 2023', status: 'done' },
      { phase: 'Interior Fit-Out', duration: 'Apr 2023 – Sep 2023', status: 'done' },
      { phase: 'Landscape & Handover', duration: 'Oct 2023 – Dec 2023', status: 'done' },
    ],
    beforeImg: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
    afterImg: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80',
    testimonial: {
      text: "Avant Construction Group exceeded every expectation we had. They transformed our vision into the most extraordinary home we could have imagined. The level of detail, the quality of craftsmanship, and the professionalism of the team was simply world-class. We wouldn't trust anyone else with a project of this magnitude.",
      name: 'Rohana Wickramasinghe',
      role: 'Client · Palm Heights Private Estate, Battaramulla',
      avatar: 'R',
    },
    stats: { area: '8,400 Sqft', rooms: '7 Beds', floors: '3 Floors', budget: 'LKR 320M' },
  },
  '2': {
    id: '2',
    name: 'Sante Palace Hotel',
    subtitle: 'Boutique Luxury Hotel · Completed 2022',
    tags: ['Hospitality', 'Luxury'],
    location: 'Kandy, Central Province',
    client: 'Sante Leisure Holdings (Pvt) Ltd',
    year: 2022,
    duration: '26 Months',
    area: '42,000 Sqft',
    rooms: '64 Suites',
    type: 'Hospitality',
    budgetPerSqft: 'LKR 20,000',
    totalBudget: 'LKR 850M',
    status: 'Completed',
    mainImage: 'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=1200&q=90',
    gallery: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80',
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400&q=80',
    ],
    overview: `Sante Palace Hotel is a 64-suite boutique luxury hotel perched above the scenic hillsides of Kandy, offering breath-taking views of the Kandy Lake and the surrounding mountain ranges. The architectural design draws inspiration from traditional Kandyan palace architecture while incorporating contemporary luxury hospitality standards.\n\nThe project included full structural construction, MEP engineering, interior design and fit-out, landscaping, and the installation of a world-class spa, rooftop infinity pool, and fine dining facilities. The hotel has since become one of Kandy's most sought-after luxury destinations.`,
    features: [
      { icon: '🏊', label: 'Rooftop Infinity Pool' },
      { icon: '🍽️', label: 'Fine Dining Restaurant' },
      { icon: '💆', label: 'Ayurveda Spa & Wellness' },
      { icon: '🎭', label: 'Events & Banquet Hall' },
      { icon: '🌿', label: 'Heritage Gardens' },
      { icon: '🚁', label: 'Helipad Access' },
      { icon: '🔐', label: 'Premium Security' },
      { icon: '🌅', label: 'Panoramic View Decks' },
    ],
    materials: [
      { label: 'LOCAL STONE', detail: 'Dumbara Blue Granite (Facade)', color: '#345b79' },
      { label: 'TIMBER WORKS', detail: 'Teak Heritage Panel Systems', color: '#be5d3f' },
      { label: 'ROOF SYSTEM', detail: 'Traditional Kandyan Clay Tiles', color: '#928d64' },
      { label: 'GLASS & GLAZING', detail: 'Structural Frameless Glass', color: '#6b879c' },
      { label: 'MARBLE & STONE', detail: 'Polished Marble Interiors', color: '#ccb7a3' },
      { label: 'MEP SYSTEMS', detail: 'Bosch & Carrier HVAC Systems', color: '#495d38' },
    ],
    timeline: [
      { phase: 'Design & Approvals', duration: 'Jan 2020 – Apr 2020', status: 'done' },
      { phase: 'Site Preparation', duration: 'May 2020 – Jul 2020', status: 'done' },
      { phase: 'Structural Construction', duration: 'Aug 2020 – Mar 2021', status: 'done' },
      { phase: 'Interior Fit-Out', duration: 'Apr 2021 – Oct 2021', status: 'done' },
      { phase: 'MEP & Smart Systems', duration: 'Nov 2021 – Feb 2022', status: 'done' },
      { phase: 'Soft Opening & Handover', duration: 'Mar 2022 – Apr 2022', status: 'done' },
    ],
    beforeImg: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
    afterImg: 'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=600&q=80',
    testimonial: {
      text: 'Avant delivered Sante Palace Hotel on schedule and to a standard that has genuinely impressed every guest and industry critic. Their project management was outstanding, their craftsmanship was impeccable, and their team was a true pleasure to work with throughout the entire journey.',
      name: 'Dilshan Samaraweera',
      role: 'CEO · Sante Leisure Holdings (Pvt) Ltd',
      avatar: 'D',
    },
    stats: { area: '42,000 Sqft', rooms: '64 Suites', floors: '7 Floors', budget: 'LKR 850M' },
  },
  '3': {
    id: '3',
    name: 'Urbana Business Park',
    subtitle: 'Grade-A Commercial Complex · Completed 2023',
    tags: ['Commercial', 'Mixed-Use'],
    location: 'Colombo 07, Western Province',
    client: 'Urbana Properties (Pvt) Ltd',
    year: 2023,
    duration: '36 Months',
    area: '220,000 Sqft',
    rooms: '12 Office Floors',
    type: 'Commercial',
    budgetPerSqft: 'LKR 5,400',
    totalBudget: 'LKR 1.2B',
    status: 'Completed',
    mainImage: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=90',
    gallery: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80',
    ],
    overview: `Urbana Business Park is a landmark Grade-A commercial development in the heart of Colombo 07, comprising over 220,000 sq ft of premium office space, retail podium, and a dedicated conference centre. The 22-storey tower has rapidly become one of the most iconic additions to the Colombo skyline.\n\nThe project featured highly complex structural engineering, including deep basement excavation in a dense urban environment, advanced curtain wall facade systems, and state-of-the-art building management systems (BMS). Avant's teams worked around the clock to deliver this landmark development on schedule.`,
    features: [
      { icon: '🏢', label: '22-Storey Tower' },
      { icon: '🚗', label: '3-Level Car Park' },
      { icon: '🎯', label: 'Conference Centre' },
      { icon: '🏋️', label: 'Corporate Gym' },
      { icon: '🍽️', label: 'Food Court & Café' },
      { icon: '🔐', label: 'BMS Smart Building' },
      { icon: '⚡', label: 'Solar Rooftop Array' },
      { icon: '♿', label: 'Full Accessibility' },
    ],
    materials: [
      { label: 'STRUCTURAL SYSTEM', detail: 'Post-Tensioned Concrete Slabs', color: '#345b79' },
      { label: 'FACADE', detail: 'Spider Glass Curtain Wall', color: '#6b879c' },
      { label: 'CLADDING', detail: 'Aluminium Composite Panels', color: '#928d64' },
      { label: 'INTERIORS', detail: 'Raised Access Flooring System', color: '#be5d3f' },
      { label: 'MEP SYSTEMS', detail: 'Daikin VRF HVAC + Honeywell BMS', color: '#495d38' },
      { label: 'LIFTS', detail: 'KONE MRL High-Speed Elevators', color: '#ccb7a3' },
    ],
    timeline: [
      { phase: 'Geotechnical Survey & Design', duration: 'Jan 2020 – Apr 2020', status: 'done' },
      { phase: 'Deep Basement Excavation', duration: 'May 2020 – Oct 2020', status: 'done' },
      { phase: 'Superstructure (Floors 1–10)', duration: 'Nov 2020 – Jun 2021', status: 'done' },
      { phase: 'Superstructure (Floors 11–22)', duration: 'Jul 2021 – Jan 2022', status: 'done' },
      { phase: 'Facade & MEP Installation', duration: 'Feb 2022 – Oct 2022', status: 'done' },
      { phase: 'Fit-Out & Handover', duration: 'Nov 2022 – Mar 2023', status: 'done' },
    ],
    beforeImg: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
    afterImg: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80',
    testimonial: {
      text: 'Building a Grade-A tower in central Colombo presented enormous logistical challenges. Avant Construction Group navigated every one of them with exceptional competence and professionalism. The result is a building that has exceeded our expectations and the expectations of our tenants.',
      name: 'Priyanka Gamage',
      role: 'Managing Director · Urbana Properties (Pvt) Ltd',
      avatar: 'P',
    },
    stats: { area: '220,000 Sqft', rooms: '12 Floors', floors: '22 Floors', budget: 'LKR 1.2B' },
  },
}

// Fallback for IDs 4-6
const fallbackProject = allProjects['1']

type TimelineItem = { phase: string; duration: string; status: string }
type MaterialItem = { label: string; detail: string; color: string }
type FeatureItem = { icon: string; label: string }
type GalleryImg = string

interface ProjectData {
  id: string; name: string; subtitle: string; tags: string[]; location: string
  client: string; year: number; duration: string; area: string; rooms: string
  type: string; budgetPerSqft: string; totalBudget: string; status: string
  mainImage: string; gallery: GalleryImg[]; overview: string
  features: FeatureItem[]; materials: MaterialItem[]; timeline: TimelineItem[]
  beforeImg: string; afterImg: string
  testimonial: { text: string; name: string; role: string; avatar: string }
  stats: { area: string; rooms: string; floors: string; budget: string }
}

const relatedProjects = [
  { id: '4', name: 'Nirantara Villas', location: 'Galle', type: 'LKR 245M', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80' },
  { id: '5', name: 'Promenade Residences', location: 'Negombo', type: 'LKR 180M', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80' },
  { id: '6', name: 'Millennium Office Complex', location: 'Colombo 01', type: 'LKR 2.1B', img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80' },
]

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ProjectDetails() {
  const { projectId } = useParams<{ projectId: string }>()
  const project: ProjectData = (projectId && allProjects[projectId]) ? allProjects[projectId] : fallbackProject

  const [activeImg, setActiveImg] = useState(0)
  const allImages = [project.mainImage, ...project.gallery]

  return (
    <div style={{ backgroundColor: '#e6e0d4', minHeight: '100vh', fontFamily: "'Poppins', sans-serif" }}>

      {/* ── HERO IMAGE GALLERY ─────────────────────────────────────────────── */}
      <section id="project-hero" className="pt-[60px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-4 text-xs" aria-label="Breadcrumb">
            <Link to="/" className="no-underline hover:opacity-70 transition-opacity" style={{ color: '#6b879c' }}>Home</Link>
            <span style={{ color: '#ccb7a3' }}>›</span>
            <Link to="/construction-companies" className="no-underline hover:opacity-70 transition-opacity" style={{ color: '#6b879c' }}>Construction Companies</Link>
            <span style={{ color: '#ccb7a3' }}>›</span>
            <Link to="/construction-companies/1" className="no-underline hover:opacity-70 transition-opacity" style={{ color: '#6b879c' }}>Avant Construction Group</Link>
            <span style={{ color: '#ccb7a3' }}>›</span>
            <span style={{ color: '#1d1d1d' }} className="font-medium truncate max-w-[200px]">{project.name}</span>
          </nav>

          {/* Tags */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {project.tags.map((tag) => (
              <span key={tag} className="text-xs font-semibold px-3 py-1 rounded-full text-white"
                style={{ backgroundColor: tag === 'Featured' ? '#be5d3f' : '#345b79' }}>
                {tag}
              </span>
            ))}
            <span className="text-xs font-semibold px-3 py-1 rounded-full text-white flex items-center gap-1"
              style={{ backgroundColor: '#495d38' }}>
              <svg width="10" height="10" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Verified
            </span>
          </div>

          {/* Main Gallery Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-3 mb-2">
            {/* Main Large Image */}
            <div className="relative rounded-2xl overflow-hidden" style={{ height: '420px' }}>
              <img
                src={allImages[activeImg]}
                alt={project.name}
                className="w-full h-full object-cover"
                style={{ transition: 'opacity 0.3s ease' }}
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.4))' }} />
              <div className="absolute bottom-4 left-4 flex gap-1">
                {allImages.map((_, i) => (
                  <button key={i} onClick={() => setActiveImg(i)} aria-label={`View image ${i + 1}`}
                    className="w-2 h-2 rounded-full transition-all duration-200"
                    style={{ backgroundColor: i === activeImg ? 'white' : 'rgba(255,255,255,0.5)' }} />
                ))}
              </div>
              <button
                id="view-all-photos-btn"
                className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-semibold backdrop-blur-sm"
                style={{ backgroundColor: 'rgba(29,29,29,0.7)', border: '1px solid rgba(255,255,255,0.25)' }}
              >
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                View All Photos
              </button>
            </div>

            {/* Thumbnail Stack */}
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible">
              {project.gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i + 1)}
                  className="flex-shrink-0 rounded-xl overflow-hidden transition-all duration-200"
                  style={{
                    width: '100px', height: '90px', minWidth: '100px',
                    border: activeImg === i + 1 ? '2px solid #be5d3f' : '2px solid transparent',
                    opacity: activeImg === i + 1 ? 1 : 0.8,
                  }}
                  aria-label={`Thumbnail ${i + 1}`}
                >
                  <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">

          {/* ── LEFT COLUMN ─────────────────────────────────────────────────── */}
          <div>

            {/* Project Title & Actions */}
            <div className="bg-white rounded-3xl p-7 mb-6" style={{ boxShadow: '0 4px 24px rgba(52,91,121,0.10)' }}>
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#1d1d1d' }}>{project.name}</h1>
                  <p className="text-sm font-medium mb-2" style={{ color: '#6b879c' }}>{project.subtitle}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <span className="flex items-center gap-1" style={{ color: '#928d64' }}>
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {project.location}
                    </span>
                    <span style={{ color: '#928d64' }}>·</span>
                    <span style={{ color: '#928d64' }}>Client: <strong style={{ color: '#1d1d1d' }}>{project.client}</strong></span>
                    <span style={{ color: '#928d64' }}>·</span>
                    <span className="px-2 py-0.5 rounded-full font-semibold text-white text-[10px]" style={{ backgroundColor: '#495d38' }}>
                      ✓ {project.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button id="enquire-project-btn"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
                    style={{ backgroundColor: '#be5d3f' }}>
                    Enquire About Project
                  </button>
                  <button id="share-project-btn" aria-label="Share project"
                    className="p-2.5 rounded-xl transition-all hover:opacity-80"
                    style={{ backgroundColor: '#e6e0d4' }}>
                    <svg width="16" height="16" fill="none" stroke="#345b79" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Quick Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Total Area', value: project.stats.area, icon: '📐' },
                  { label: 'Rooms / Floors', value: project.stats.rooms, icon: '🏠' },
                  { label: 'Project Type', value: project.type, icon: '🏗️' },
                  { label: 'Budget / Sqft', value: project.budgetPerSqft, icon: '💰' },
                ].map((s) => (
                  <div key={s.label} className="p-3 rounded-2xl text-center" style={{ backgroundColor: '#f7f4f0' }}>
                    <div className="text-xl mb-1">{s.icon}</div>
                    <p className="text-sm font-bold mb-0.5" style={{ color: '#1d1d1d' }}>{s.value}</p>
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: '#928d64' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Overview */}
            <section id="project-overview" className="bg-white rounded-3xl p-7 mb-6" style={{ boxShadow: '0 4px 24px rgba(52,91,121,0.10)' }}>
              <h2 className="text-lg font-bold mb-4" style={{ color: '#1d1d1d' }}>Project Overview</h2>
              {project.overview.split('\n\n').map((para, i) => (
                <p key={i} className="text-sm leading-relaxed mb-3" style={{ color: '#6b879c' }}>{para}</p>
              ))}
            </section>

            {/* Project Features */}
            <section id="project-features" className="bg-white rounded-3xl p-7 mb-6" style={{ boxShadow: '0 4px 24px rgba(52,91,121,0.10)' }}>
              <h2 className="text-lg font-bold mb-5" style={{ color: '#1d1d1d' }}>Project Features</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {project.features.map((feat) => (
                  <div key={feat.label}
                    className="p-4 rounded-2xl text-center cursor-default transition-all duration-200 border border-transparent"
                    style={{ backgroundColor: '#f7f4f0' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#e6e0d4'
                      e.currentTarget.style.borderColor = '#ccb7a3'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f7f4f0'
                      e.currentTarget.style.borderColor = 'transparent'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <div className="text-2xl mb-2">{feat.icon}</div>
                    <p className="text-xs font-medium leading-tight" style={{ color: '#1d1d1d' }}>{feat.label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Materials Used */}
            <section id="materials-section" className="bg-white rounded-3xl p-7 mb-6" style={{ boxShadow: '0 4px 24px rgba(52,91,121,0.10)' }}>
              <h2 className="text-lg font-bold mb-5" style={{ color: '#1d1d1d' }}>Materials Used</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {project.materials.map((mat) => (
                  <div key={mat.label} className="flex items-center gap-3 p-4 rounded-2xl"
                    style={{ backgroundColor: '#f7f4f0' }}>
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: mat.color }} />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: '#928d64' }}>{mat.label}</p>
                      <p className="text-xs font-medium leading-tight" style={{ color: '#1d1d1d' }}>{mat.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Construction Timeline */}
            <section id="timeline-section" className="bg-white rounded-3xl p-7 mb-6" style={{ boxShadow: '0 4px 24px rgba(52,91,121,0.10)' }}>
              <h2 className="text-lg font-bold mb-5" style={{ color: '#1d1d1d' }}>Construction Timeline</h2>
              <div className="space-y-3">
                {project.timeline.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl"
                    style={{ backgroundColor: '#f7f4f0' }}>
                    <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: item.status === 'done' ? '#495d38' : item.status === 'active' ? '#be5d3f' : '#ccb7a3' }}>
                      {item.status === 'done' ? (
                        <svg width="12" height="12" fill="white" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: '#1d1d1d' }}>{item.phase}</p>
                      <p className="text-xs" style={{ color: '#928d64' }}>{item.duration}</p>
                    </div>
                    <span
                      className="text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: item.status === 'done' ? '#e8f2ec' : item.status === 'active' ? '#fdf0ec' : '#e6e0d4',
                        color: item.status === 'done' ? '#495d38' : item.status === 'active' ? '#be5d3f' : '#928d64',
                      }}
                    >
                      {item.status === 'done' ? 'Done' : item.status === 'active' ? 'Active' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Before & After */}
            <section id="before-after-section" className="bg-white rounded-3xl p-7 mb-6" style={{ boxShadow: '0 4px 24px rgba(52,91,121,0.10)' }}>
              <h2 className="text-lg font-bold mb-5" style={{ color: '#1d1d1d' }}>Before &amp; After</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative rounded-2xl overflow-hidden" style={{ height: '200px' }}>
                  <img src={project.beforeImg} alt="Before construction" className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.3)' }} />
                  <span className="absolute top-3 left-3 text-white text-xs font-bold px-2.5 py-1 rounded-lg"
                    style={{ backgroundColor: 'rgba(29,29,29,0.75)' }}>
                    Before
                  </span>
                </div>
                <div className="relative rounded-2xl overflow-hidden" style={{ height: '200px' }}>
                  <img src={project.afterImg} alt="After construction" className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.15)' }} />
                  <span className="absolute top-3 left-3 text-white text-xs font-bold px-2.5 py-1 rounded-lg"
                    style={{ backgroundColor: 'rgba(73,93,56,0.85)' }}>
                    After
                  </span>
                </div>
              </div>
            </section>

            {/* Client Testimonial */}
            <section id="testimonial-section" className="rounded-3xl p-8 mb-6"
              style={{ background: 'linear-gradient(135deg, #1d3a4f 0%, #345b79 100%)', boxShadow: '0 8px 40px rgba(52,91,121,0.25)' }}>
              <div className="flex items-start gap-2 mb-5">
                <svg width="32" height="32" fill="#d59b86" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="text-white/90 text-base leading-relaxed italic mb-6">
                "{project.testimonial.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
                  style={{ backgroundColor: '#be5d3f' }}>
                  {project.testimonial.avatar}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{project.testimonial.name}</p>
                  <p className="text-white/60 text-xs">{project.testimonial.role}</p>
                </div>
              </div>
            </section>

            {/* Related Projects */}
            <section id="related-projects">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold" style={{ color: '#1d1d1d' }}>Related Projects</h2>
                <Link to="/construction-companies/1" id="view-all-projects-btn"
                  className="text-xs font-semibold no-underline hover:opacity-70 transition-opacity"
                  style={{ color: '#be5d3f' }}>
                  View All →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedProjects.map((rel) => (
                  <Link key={rel.id} to={`/construction-companies/1/projects/${rel.id}`}
                    id={`related-project-${rel.id}`}
                    className="no-underline group rounded-2xl overflow-hidden bg-white block"
                    style={{ boxShadow: '0 2px 12px rgba(52,91,121,0.10)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)'
                      e.currentTarget.style.boxShadow = '0 12px 32px rgba(52,91,121,0.18)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 2px 12px rgba(52,91,121,0.10)'
                    }}
                  >
                    <div className="relative h-36 overflow-hidden">
                      <img src={rel.img} alt={rel.name}
                        className="w-full h-full object-cover"
                        style={{ transition: 'transform 0.4s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
                      />
                    </div>
                    <div className="p-4">
                      <p className="font-bold text-sm mb-0.5" style={{ color: '#1d1d1d' }}>{rel.name}</p>
                      <p className="text-xs mb-1" style={{ color: '#6b879c' }}>📍 {rel.location}</p>
                      <p className="text-xs font-semibold" style={{ color: '#be5d3f' }}>{rel.type}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* CTA Banner */}
            <div className="mt-8 rounded-3xl p-7 flex flex-col md:flex-row items-center justify-between gap-5"
              style={{ background: 'linear-gradient(135deg, #be5d3f 0%, #a04d33 100%)', boxShadow: '0 8px 32px rgba(190,93,63,0.30)' }}>
              <div>
                <p className="text-white font-bold text-lg mb-1">Interested in a Similar Project?</p>
                <p className="text-white/80 text-sm">Talk to our team and get a custom quotation tailored to your requirements.</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button id="cta-request-quote-btn"
                  className="px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)' }}>
                  Request Quote
                </button>
                <button id="cta-call-btn"
                  className="px-6 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90"
                  style={{ backgroundColor: 'white', color: '#be5d3f' }}>
                  Call Us Now
                </button>
              </div>
            </div>

          </div>

          {/* ── RIGHT SIDEBAR ────────────────────────────────────────────────── */}
          <aside id="project-sidebar" aria-label="Project details" className="lg:sticky lg:top-20 self-start">

            {/* Project Facts */}
            <div className="bg-white rounded-3xl p-6 mb-5" style={{ boxShadow: '0 4px 24px rgba(52,91,121,0.10)' }}>
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: '#1d1d1d' }}>
                Project Facts
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Total Budget', value: project.totalBudget, highlight: true },
                  { label: 'Total Area', value: project.area },
                  { label: 'Project Type', value: project.type },
                  { label: 'Completion Year', value: String(project.year) },
                  { label: 'Duration', value: project.duration },
                  { label: 'Client', value: project.client },
                  { label: 'Location', value: project.location },
                  { label: 'Status', value: project.status },
                ].map((f) => (
                  <div key={f.label} className="flex items-start justify-between gap-2 py-2"
                    style={{ borderBottom: '1px solid #f0ebe3' }}>
                    <span className="text-xs" style={{ color: '#928d64' }}>{f.label}</span>
                    <span className="text-xs font-semibold text-right"
                      style={{ color: f.highlight ? '#be5d3f' : '#1d1d1d' }}>
                      {f.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Similar Projects Stats */}
            <div className="bg-white rounded-3xl p-6 mb-5" style={{ boxShadow: '0 4px 24px rgba(52,91,121,0.10)' }}>
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: '#1d1d1d' }}>
                Build Statistics
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Workers Deployed', value: '280+', icon: '👷' },
                  { label: 'Concrete Used', value: '4,200 m³', icon: '🏗️' },
                  { label: 'Steel Used', value: '320 MT', icon: '⚙️' },
                  { label: 'Inspections', value: '48 Done', icon: '✅' },
                ].map((s) => (
                  <div key={s.label} className="p-3 rounded-2xl text-center" style={{ backgroundColor: '#f7f4f0' }}>
                    <div className="text-lg mb-1">{s.icon}</div>
                    <p className="text-sm font-bold" style={{ color: '#1d1d1d' }}>{s.value}</p>
                    <p className="text-[10px] leading-tight" style={{ color: '#928d64' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Back to Company */}
            <Link
              to="/construction-companies/1"
              id="back-to-company-btn"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-semibold no-underline transition-all hover:opacity-90 mb-4"
              style={{ backgroundColor: '#345b79', color: 'white', boxShadow: '0 4px 16px rgba(52,91,121,0.25)' }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Company Profile
            </Link>

            {/* NexaBuild CTA */}
            <div className="rounded-3xl p-6 text-center"
              style={{ background: 'linear-gradient(135deg, #345b79 0%, #1d3a4f 100%)', boxShadow: '0 8px 32px rgba(52,91,121,0.30)' }}>
              <img src={nexaBuildLogo} alt="NexaBuild" className="h-8 w-auto object-contain mx-auto mb-3" />
              <p className="text-white text-sm font-semibold mb-1">AI-Powered Matching</p>
              <p className="text-white/70 text-xs mb-4">Find similar projects and get custom quotations instantly.</p>
              <button id="sidebar-ai-quote-btn"
                className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: '#be5d3f' }}>
                Get AI Quote
              </button>
            </div>

          </aside>
        </div>
      </main>
    </div>
  )
}
