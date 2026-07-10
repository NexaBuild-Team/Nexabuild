import { useState } from 'react'
import { Link, useLocation } from 'react-router'

// ─── Color Palette ─────────────────────────────────────────────────────────────
// Primary Blue         : #345b79
// Primary Brick Accent : #be5d3f
// Dark Navy (mobile)   : #2d4f69

interface NavLink {
  label: string
  href: string
}

const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Property Search', href: '/property-listing' },
  { label: 'Land Search', href: '#' },
  { label: 'Architecture Companies', href: '#' },
  { label: 'Construction Companies', href: '#' },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/'
    return location.pathname.startsWith(href)
  }

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 text-white"
      style={{ backgroundColor: '#345b79' }}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[60px]">

          {/* ── Logo ── */}
          <Link
            to="/"
            className="flex items-center gap-2.5 flex-shrink-0 no-underline"
            aria-label="NexaBuild home"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#be5d3f' }}
            >
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-white">NexaBuild</span>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <div className="hidden lg:flex items-center gap-0.5" role="menubar">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                role="menuitem"
                className="px-3 py-2 text-[13px] font-medium rounded-lg transition-all duration-150 whitespace-nowrap"
                style={
                  isActive(link.href)
                    ? { color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.15)' }
                    : { color: 'rgba(255,255,255,0.80)' }
                }
                onMouseEnter={(e) => {
                  if (!isActive(link.href)) {
                    ;(e.currentTarget as HTMLAnchorElement).style.color = '#ffffff'
                    ;(e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'rgba(255,255,255,0.10)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.href)) {
                    ;(e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.80)'
                    ;(e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent'
                  }
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ── Desktop: Login + Register ── */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            <button
              id="nav-login-btn"
              className="text-sm font-medium text-white/80 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-150 border border-white/50 hover:border-white"
            >
              Login
            </button>
            <button
              id="nav-register-btn"
              className="text-sm font-semibold text-white px-5 py-2 rounded-lg transition-all duration-150 hover:opacity-90 shadow"
              style={{ backgroundColor: '#be5d3f' }}
            >
              Register
            </button>
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            id="nav-mobile-menu-btn"
            className="lg:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* ── Mobile Dropdown ── */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden px-4 pb-5 pt-2 space-y-1 border-t border-white/15"
          style={{ backgroundColor: '#2d4f69' }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 text-sm font-medium rounded-lg transition-colors"
              style={
                isActive(link.href)
                  ? { color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.12)' }
                  : { color: 'rgba(255,255,255,0.80)' }
              }
            >
              {link.label}
            </Link>
          ))}

          <div className="flex gap-3 pt-3 border-t border-white/15 mt-2">
            <button
              id="nav-mobile-login-btn"
              className="flex-1 py-2.5 text-sm font-medium text-white border border-white/50 rounded-lg hover:bg-white/10 hover:border-white transition-colors"
            >
              Login
            </button>
            <button
              id="nav-mobile-register-btn"
              className="flex-1 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors hover:opacity-90"
              style={{ backgroundColor: '#be5d3f' }}
            >
              Register
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
