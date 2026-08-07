import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import nexaBuildLogo from '../assets/NexaBuildlogo.png'
import { useAuth } from '../context/AuthContext'

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
  { label: 'Land Search', href: '/land' },
  { label: 'Architecture Companies', href: '/architecture' },
  { label: 'Construction Companies', href: '/construction-companies' },
]

const propertySearchRoutes = ['/property-listing', '/property-listing-ai', '/property-ai-recommended', '/property-detail']

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/'
    if (href === '/property-listing') {
      return propertySearchRoutes.some((route) => location.pathname.startsWith(route))
    }
    return location.pathname.startsWith(href)
  }

  const handleLogout = () => {
    logout()
    navigate('/auth/login')
  }

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 text-white"
      style={{ backgroundColor: '#345b79' }}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile: flex row; Desktop: 3-column grid */}
        <div className="flex items-center justify-between h-[68px] lg:grid lg:grid-cols-3">

          {/* ── Logo ── */}
          <Link
            to="/"
            className="flex items-center flex-shrink-0 no-underline lg:justify-self-start"
            aria-label="NexaBuild home"
          >
            <span className="inline-flex items-center bg-white rounded-lg px-2.5 py-1.5 shadow-sm">
              <img
                src={nexaBuildLogo}
                alt="NexaBuild"
                className="h-10 w-auto object-contain block"
              />
            </span>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <div className="hidden lg:flex items-center gap-0.5 justify-self-center" role="menubar">
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

          {/* ── Desktop: User Profile or Login + Register ── */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0 justify-self-end">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg border border-white/20 transition-all text-xs font-semibold"
                >
                  <div className="size-6 rounded-full bg-[#be5d3f] text-white flex items-center justify-center font-bold text-xs uppercase">
                    {user.firstName ? user.firstName[0] : user.email[0]}
                  </div>
                  <span className="max-w-[120px] truncate">{user.firstName || user.email}</span>
                  <span className="bg-[#be5d3f] text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                    {user.role}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-xs font-medium text-white/80 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-all border border-white/30"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  id="nav-login-btn"
                  className="text-sm font-medium text-white/80 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-150 border border-white/50 hover:border-white"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  id="nav-register-btn"
                  className="text-sm font-semibold text-white px-5 py-2 rounded-lg transition-all duration-150 hover:opacity-90 shadow inline-block text-center"
                  style={{ backgroundColor: '#be5d3f' }}
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            id="nav-mobile-menu-btn"
            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors flex-shrink-0"
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
            {isAuthenticated && user ? (
              <div className="w-full flex flex-col gap-2">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold text-white bg-[#be5d3f] rounded-lg"
                >
                  My Dashboard ({user.role})
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    handleLogout()
                  }}
                  className="w-full text-center py-2 text-sm font-medium text-white border border-white/30 rounded-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 text-sm font-medium text-white border border-white/50 rounded-lg hover:bg-white/10"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 text-sm font-semibold text-white rounded-lg hover:opacity-90"
                  style={{ backgroundColor: '#be5d3f' }}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
