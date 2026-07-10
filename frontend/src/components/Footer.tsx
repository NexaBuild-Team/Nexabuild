import { Link } from 'react-router'

// ─── Color Palette ─────────────────────────────────────────────────────────────
// Dark Background      : #1d1d1d
// Brick Accent         : #be5d3f
// Primary Blue         : #345b79
// Olive Accent         : #928d64
// Light Accent         : #d59b86

interface FooterLink {
  label: string
  href: string
}

const propertyLinks: FooterLink[] = [
  { label: 'Buy Property', href: '#' },
  { label: 'Rent Property', href: '#' },
  { label: 'Land for Sale', href: '#' },
  { label: 'Commercial', href: '#' },
  { label: 'New Projects', href: '#' },
]

const serviceLinks: FooterLink[] = [
  { label: 'Architecture Designs', href: '#' },
  { label: 'Construction Companies', href: '#' },
  { label: 'AI Matching', href: '#' },
  { label: 'Property Valuation', href: '#' },
  { label: 'Legal Guidance', href: '#' },
]

const legalLinks: FooterLink[] = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Use', href: '#' },
  { label: 'Cookie Policy', href: '#' },
]

const socialIcons = [
  {
    label: 'Facebook',
    d: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z',
  },
  {
    label: 'Instagram',
    d: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M7.5 21h9a4.5 4.5 0 004.5-4.5v-9A4.5 4.5 0 0016.5 3h-9A4.5 4.5 0 003 7.5v9A4.5 4.5 0 007.5 21z',
  },
  {
    label: 'LinkedIn',
    d: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z',
  },
]

export default function Footer() {
  return (
    <footer
      className="pt-14 pb-8"
      style={{ backgroundColor: '#1d1d1d' }}
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* ── Brand Column ── */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-4 no-underline" aria-label="NexaBuild home">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#be5d3f' }}
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">NexaBuild</span>
            </Link>

            <p className="text-sm leading-relaxed mb-5" style={{ color: '#928d64' }}>
              Sri Lanka's AI-powered property and construction platform. Connecting buyers, architects, and builders.
            </p>

            {/* Social Icons */}
            <div className="flex gap-2" aria-label="Social media links">
              {socialIcons.map((icon) => (
                <a
                  key={icon.label}
                  href="#"
                  aria-label={icon.label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: '#345b79' }}
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={icon.d} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* ── Properties Column ── */}
          <div>
            <h4
              className="font-bold text-xs uppercase tracking-widest mb-4"
              style={{ color: '#d59b86' }}
            >
              Properties
            </h4>
            <ul className="space-y-2.5">
              {propertyLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm hover:opacity-80 transition-opacity"
                    style={{ color: '#928d64' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Services Column ── */}
          <div>
            <h4
              className="font-bold text-xs uppercase tracking-widest mb-4"
              style={{ color: '#d59b86' }}
            >
              Services
            </h4>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm hover:opacity-80 transition-opacity"
                    style={{ color: '#928d64' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact Column ── */}
          <div>
            <h4
              className="font-bold text-xs uppercase tracking-widest mb-4"
              style={{ color: '#d59b86' }}
            >
              Contact Us
            </h4>
            <ul className="space-y-3">

              {/* Address */}
              <li className="flex items-start gap-2">
                <svg
                  className="w-4 h-4 flex-shrink-0 mt-0.5"
                  style={{ color: '#928d64' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-sm" style={{ color: '#928d64' }}>
                  42 Galle Road, Colombo 03, Sri Lanka
                </span>
              </li>

              {/* Phone */}
              <li className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: '#928d64' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a
                  href="tel:+94112345678"
                  className="text-sm hover:opacity-80 transition-opacity"
                  style={{ color: '#928d64' }}
                >
                  +94 11 234 5678
                </a>
              </li>

              {/* Email */}
              <li className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: '#928d64' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:hello@nexabuild.lk"
                  className="text-sm hover:opacity-80 transition-opacity"
                  style={{ color: '#928d64' }}
                >
                  hello@nexabuild.lk
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div
          className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(146,141,100,0.2)' }}
        >
          <p className="text-xs" style={{ color: '#928d64' }}>
            © {new Date().getFullYear()} NEXABUILD (PVT) LTD. ALL RIGHTS RESERVED.
          </p>

          <nav className="flex gap-5" aria-label="Legal links">
            {legalLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs hover:opacity-80 transition-opacity uppercase tracking-wide"
                style={{ color: '#928d64' }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

      </div>
    </footer>
  )
}
