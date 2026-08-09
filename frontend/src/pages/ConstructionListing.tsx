import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface BackendCompany {
  id: string | number
  name: string
  slug?: string

  // Backend returns tagline (not description)
  tagline?: string
  description?: string

  logoUrl?: string
  coverImageUrl?: string   // backend field name
  coverUrl?: string        // fallback alias

  // district can be a nested object or a string
  district?: { name?: string } | string
  location?: string

  rating?: number
  averageRating?: number

  reviews?: number
  reviewCount?: number

  projects?: number
  projectCount?: number

  // backend sends yearsInBusiness, not yearsOfExperience
  yearsInBusiness?: number
  experience?: number
  yearsOfExperience?: number

  startingPrice?: string | number
  startingPriceLkr?: number
  budgetMin?: number

  // backend sends isFeatured / isVerified (not featured / verified)
  isFeatured?: boolean
  featured?: boolean
  isVerified?: boolean
  verified?: boolean

  tags?: string[]
  specializations?: Array<{ specialization?: { name?: string } } | string>
}

interface Company {
  id: string | number
  name: string
  slug: string
  description: string
  logoUrl: string
  coverBg: string
  location: string
  rating: number
  reviews: number
  projects: number
  experience: number
  startingPrice: string
  tags: string[]
  featured: boolean
  verified: boolean
  initials: string
  color: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const districts = [
  'All Districts',
  'Colombo',
  'Gampaha',
  'Kalutara',
  'Kandy',
  'Matale',
  'Nuwara Eliya',
  'Galle',
  'Matara',
  'Hambantota',
  'Jaffna',
  'Kilinochchi',
  'Mannar',
  'Vavuniya',
  'Mullaitivu',
  'Batticaloa',
  'Ampara',
  'Trincomalee',
  'Kurunegala',
  'Puttalam',
  'Anuradhapura',
  'Polonnaruwa',
  'Badulla',
  'Moneragala',
  'Ratnapura',
  'Kegalle',
]

const budgets = [
  'Any Budget',
  'Under LKR 5M',
  'LKR 5M – 15M',
  'LKR 15M – 30M',
  'LKR 30M – 50M',
  'LKR 50M – 100M',
  'Above LKR 100M',
]

const topBuilders = [
  {
    rank: 1,
    name: 'Heritage Construction',
    projects: 712,
  },
  {
    rank: 2,
    name: 'CMI Construction',
    projects: 498,
  },
  {
    rank: 3,
    name: 'Avant Engineering',
    projects: 341,
  },
]

const locationOptions = [
  'Colombo',
  'Gampaha',
  'Kandy',
  'Galle',
  'Matara',
]

const experienceOptions = [
  '1 – 5 Years',
  '5 – 10 Years',
  '10 – 20 Years',
  '20+ Years',
]

const specializationOptions = [
  'Residential',
  'Commercial',
  'Luxury Villas',
  'Interior Design',
  'Sustainable Design',
]

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
}

function getColor(index: number): string {
  const colors = [
    '#345b79',
    '#be5d3f',
    '#6b879c',
    '#928d64',
    '#495d38',
  ]

  return colors[index % colors.length]
}

function formatStartingPrice(value: unknown): string {
  if (typeof value === 'number') {
    return `LKR ${value}M`
  }

  if (typeof value === 'string' && value.trim()) {
    return value
  }

  return 'Contact'
}

function parseBudgetValue(priceString: string): number {
  const numeric = Number(
    priceString.replace(/[^0-9.]/g, ''),
  )

  return Number.isNaN(numeric) ? 0 : numeric
}

// ─────────────────────────────────────────────────────────────────────────────
// Convert backend company → frontend company
// ─────────────────────────────────────────────────────────────────────────────

function mapBackendCompany(
  company: BackendCompany,
  index: number,
): Company {
  // district can be a nested object { name: 'Colombo' } or a plain string
  const districtName =
    typeof company.district === 'object' && company.district !== null
      ? (company.district as { name?: string }).name ?? ''
      : (company.district as string | undefined) ?? ''

  const location =
    company.location ||
    districtName ||
    'Sri Lanka'

  const description =
    company.description ||
    company.tagline ||
    'Trusted construction company providing quality construction services.'

  const rating = Number(
    company.rating ??
      company.averageRating ??
      0,
  )

  const reviews = Number(
    company.reviews ??
      company.reviewCount ??
      0,
  )

  const projects = Number(
    company.projects ??
      company.projectCount ??
      0,
  )

  // backend sends yearsInBusiness — prefer that over legacy fields
  const experience = Number(
    company.yearsInBusiness ??
      company.experience ??
      company.yearsOfExperience ??
      0,
  )

  // specializations is an array of join-table rows: [{ specialization: { name } }]
  const tags: string[] = Array.isArray(company.tags)
    ? company.tags.map(String)
    : Array.isArray(company.specializations)
      ? company.specializations
          .map((s) => {
            if (typeof s === 'string') return s
            if (typeof s === 'object' && s !== null) {
              const inner = (s as { specialization?: { name?: string } }).specialization
              return inner?.name ?? ''
            }
            return ''
          })
          .filter(Boolean)
      : []

  // budget: prefer explicit startingPrice, then budgetMin from DB
  const startingPrice = formatStartingPrice(
    company.startingPrice ??
      company.startingPriceLkr ??
      company.budgetMin,
  )

  return {
    id: company.id,

    name: company.name,

    slug:
      company.slug ??
      String(company.id),

    description,

    logoUrl:
      company.logoUrl ?? '',

    coverBg:
      company.coverImageUrl ??
      company.coverUrl ??
      company.logoUrl ??
      '',

    location,

    rating:
      Number.isFinite(rating) ? rating : 0,

    reviews:
      Number.isFinite(reviews) ? reviews : 0,

    projects:
      Number.isFinite(projects) ? projects : 0,

    experience:
      Number.isFinite(experience) ? experience : 0,

    startingPrice,

    tags,

    // backend uses isFeatured / isVerified
    featured:
      company.isFeatured ?? company.featured ?? false,

    verified:
      company.isVerified ?? company.verified ?? true,

    initials:
      getInitials(company.name),

    color:
      getColor(index),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Get Construction Companies From Backend
// ─────────────────────────────────────────────────────────────────────────────

async function getConstructionCompanies(): Promise<Company[]> {
  console.log(
    'Fetching construction companies from backend...',
  )

  const response =
    await api.get(
      '/construction/companies',
    )

  /*
    Backend can return either:

    [
      {...},
      {...}
    ]

    OR

    {
      data: [
        {...},
        {...}
      ]
    }
  */

  const result = response.data

  const rawCompanies: BackendCompany[] =
    Array.isArray(result)
      ? result
      : Array.isArray(result?.data)
        ? result.data
        : []

  return rawCompanies.map(
    (
      company: BackendCompany,
      index: number,
    ) =>
      mapBackendCompany(
        company,
        index,
      ),
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Star Rating
// ─────────────────────────────────────────────────────────────────────────────

function StarRating({
  rating,
  size = 12,
}: {
  rating: number
  size?: number
}) {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map(
        (star) => (
          <svg
            key={star}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={
              star <= Math.round(rating)
                ? '#f59e0b'
                : 'none'
            }
            stroke="#f59e0b"
            strokeWidth="2"
            aria-hidden="true"
          >
            <polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
            />
          </svg>
        ),
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Company Card
// ─────────────────────────────────────────────────────────────────────────────

function CompanyCard({
  company,
  isBookmarked,
  onToggleBookmark,
  onEmail,
  onViewProfile,
}: {
  company: Company
  isBookmarked: boolean
  onToggleBookmark: (
    companyId: string | number,
  ) => void
  onEmail: (company: Company) => void
  onViewProfile: () => void
}) {
  return (
    <article
      id={`company-card-${company.id}`}
      className="group bg-white rounded-3xl overflow-hidden cursor-pointer"
      style={{
        boxShadow:
          '0 2px 16px rgba(52,91,121,0.10)',
        transition:
          'transform 0.25s ease, box-shadow 0.25s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform =
          'translateY(-6px)'

        e.currentTarget.style.boxShadow =
          '0 16px 48px rgba(52,91,121,0.18)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform =
          'translateY(0)'

        e.currentTarget.style.boxShadow =
          '0 2px 16px rgba(52,91,121,0.10)'
      }}
    >
      {/* Cover Image */}

      <div className="relative h-44 overflow-hidden">
        {company.coverBg ? (
          <img
            src={company.coverBg}
            alt={`${company.name} project`}
            className="w-full h-full object-cover"
            style={{
              transition:
                'transform 0.4s ease',
            }}
            onError={(e) => {
              e.currentTarget.style.display =
                'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                'scale(1.08)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                'scale(1)'
            }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background:
                'linear-gradient(135deg, #345b79, #6b879c)',
            }}
          >
            <span className="text-white text-4xl font-bold">
              {company.initials}
            </span>
          </div>
        )}

        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.45))',
          }}
        />

        {company.featured && (
          <span
            className="absolute top-3 left-3 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider"
            style={{
              backgroundColor:
                '#be5d3f',
            }}
          >
            Featured
          </span>
        )}

        {company.verified && (
          <span
            className="absolute top-3 right-3 flex items-center gap-1 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full"
            style={{
              backgroundColor:
                'rgba(73,93,56,0.95)',
            }}
          >
            ✓ Verified
          </span>
        )}
      </div>

      {/* Body */}

      <div className="p-4">
        {/* Logo + Name */}

        <div className="flex items-start gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-base -mt-8 relative z-10 shadow-lg"
            style={{
              backgroundColor:
                company.color,
              border:
                '2px solid white',
            }}
          >
            {company.initials}
          </div>

          <div className="flex-1 min-w-0">
            <h3
              className="font-semibold text-sm leading-tight truncate"
              style={{
                color: '#1d1d1d',
              }}
            >
              {company.name}
            </h3>

            <div className="flex items-center gap-1.5 mt-0.5">
              <StarRating
                rating={
                  company.rating
                }
                size={10}
              />

              <span
                className="text-xs font-semibold"
                style={{
                  color: '#f59e0b',
                }}
              >
                {company.rating.toFixed(
                  1,
                )}
              </span>

              <span
                className="text-xs"
                style={{
                  color: '#928d64',
                }}
              >
                ({company.reviews})
              </span>
            </div>
          </div>
        </div>

        {/* Location */}

        <div className="flex items-center gap-1 mb-2">
          <svg
            width="12"
            height="12"
            fill="none"
            stroke="#6b879c"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>

          <span
            className="text-xs"
            style={{
              color: '#6b879c',
            }}
          >
            {company.location}
          </span>
        </div>

        {/* Description */}

        <p
          className="text-xs leading-relaxed mb-3 line-clamp-2"
          style={{
            color: '#928d64',
          }}
        >
          {company.description}
        </p>

        {/* Stats */}

        <div
          className="grid grid-cols-3 gap-2 mb-3 py-3 rounded-xl"
          style={{
            backgroundColor:
              '#f7f4f0',
          }}
        >
          <div className="text-center">
            <p
              className="text-sm font-bold"
              style={{
                color: '#1d1d1d',
              }}
            >
              {company.projects}
            </p>

            <p
              className="text-[9px] uppercase tracking-wide"
              style={{
                color: '#928d64',
              }}
            >
              Projects
            </p>
          </div>

          <div
            className="text-center"
            style={{
              borderLeft:
                '1px solid #e6e0d4',
              borderRight:
                '1px solid #e6e0d4',
            }}
          >
            <p
              className="text-sm font-bold"
              style={{
                color: '#1d1d1d',
              }}
            >
              {company.experience} yrs
            </p>

            <p
              className="text-[9px] uppercase tracking-wide"
              style={{
                color: '#928d64',
              }}
            >
              Experience
            </p>
          </div>

          <div className="text-center">
            <p
              className="text-sm font-bold"
              style={{
                color: '#1d1d1d',
              }}
            >
              {company.startingPrice}
            </p>

            <p
              className="text-[9px] uppercase tracking-wide"
              style={{
                color: '#928d64',
              }}
            >
              Starting
            </p>
          </div>
        </div>

        {/* Tags */}

        {company.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {company.tags.map(
              (tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor:
                      '#e6e0d4',
                    color: '#345b79',
                  }}
                >
                  {tag}
                </span>
              ),
            )}
          </div>
        )}

        {/* Actions */}

        <div className="flex items-center gap-2">
          <button
            id={`view-profile-${company.id}`}
            onClick={onViewProfile}
            className="flex-1 text-center text-xs font-semibold py-2 rounded-xl text-white transition-all duration-150 hover:opacity-90"
            style={{
              backgroundColor:
                '#345b79',
            }}
          >
            View Profile
          </button>

          <button
            id={`bookmark-${company.id}`}
            aria-label={`Bookmark ${company.name}`}
            onClick={() =>
              onToggleBookmark(
                company.id,
              )
            }
            className="p-2 rounded-xl transition-colors hover:bg-gray-100"
            style={{
              border:
                '1px solid #e6e0d4',
            }}
          >
            <svg
              width="14"
              height="14"
              fill={
                isBookmarked
                  ? '#be5d3f'
                  : 'none'
              }
              stroke={
                isBookmarked
                  ? '#be5d3f'
                  : '#6b879c'
              }
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </button>

          <button
            id={`email-${company.id}`}
            aria-label={`Email ${company.name}`}
            onClick={() =>
              onEmail(company)
            }
            className="p-2 rounded-xl transition-colors hover:bg-gray-100"
            style={{
              border:
                '1px solid #e6e0d4',
            }}
          >
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="#6b879c"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>
      </div>
    </article>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Default Filters
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_FILTERS = {
  search: '',
  district: 'All Districts',
  budget: 'Any Budget',
  budgetSlider: 100,
  minRating: 0,
  locations: [] as string[],
  experience: '',
  specialization: '',
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Construction Page
// ─────────────────────────────────────────────────────────────────────────────

export default function ConstructionListing() {
  const navigate = useNavigate()

  // ───────────────────────────────────────────────────────────────────────────
  // Backend Data
  // ───────────────────────────────────────────────────────────────────────────

  const [companies, setCompanies] =
    useState<Company[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  // ───────────────────────────────────────────────────────────────────────────
  // Filters
  // ───────────────────────────────────────────────────────────────────────────

  const [filters, setFilters] =
    useState(DEFAULT_FILTERS)

  const {
    search,
    district,
    budget,
    budgetSlider,
    minRating,
    locations,
    experience,
    specialization,
  } = filters

  const [appliedFilters, setAppliedFilters] =
    useState(DEFAULT_FILTERS)

  const [sort, setSort] =
    useState('Top Rated')

  const [currentPage, setCurrentPage] =
    useState(1)

  const [
    bookmarkedCompanies,
    setBookmarkedCompanies,
  ] = useState<
    Array<string | number>
  >([])

  // ───────────────────────────────────────────────────────────────────────────
  // Fetch Companies
  // ───────────────────────────────────────────────────────────────────────────

  const loadCompanies = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log(
        'Fetching construction companies...',
      )

      const data =
        await getConstructionCompanies()

      console.log(
        'Construction companies received:',
        data,
      )

      setCompanies(data)
    } catch (err) {
      console.error(
        'Construction API error:',
        err,
      )

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load construction companies.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCompanies()
  }, [])

  // ───────────────────────────────────────────────────────────────────────────
  // Filters
  // ───────────────────────────────────────────────────────────────────────────

  const toggleLocation = (
    loc: string,
  ) => {
    setFilters((prev) => ({
      ...prev,

      locations:
        prev.locations.includes(loc)
          ? prev.locations.filter(
              (item) =>
                item !== loc,
            )
          : [
              ...prev.locations,
              loc,
            ],
    }))
  }

  const clearFilters = () => {
    setFilters({
      ...DEFAULT_FILTERS,
      locations: [],
    })

    setAppliedFilters({
      ...DEFAULT_FILTERS,
      locations: [],
    })

    setCurrentPage(1)
  }

  const applyFilters = () => {
    setAppliedFilters({
      ...filters,
      locations: [
        ...filters.locations,
      ],
    })

    setCurrentPage(1)
  }

  const searchCompanies = () => {
    setAppliedFilters({
      ...filters,
      locations: [
        ...filters.locations,
      ],
    })

    setCurrentPage(1)
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Bookmark
  // ───────────────────────────────────────────────────────────────────────────

  const toggleBookmark = (
    companyId: string | number,
  ) => {
    setBookmarkedCompanies(
      (prev) =>
        prev.includes(companyId)
          ? prev.filter(
              (id) =>
                id !== companyId,
            )
          : [
              ...prev,
              companyId,
            ],
    )
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Email
  // ───────────────────────────────────────────────────────────────────────────

  const emailCompany = (
    company: Company,
  ) => {
    const safeName =
      company.name
        .toLowerCase()
        .replace(
          /[^a-z0-9]+/g,
          '',
        )

    const toEmail =
      `info@${safeName}.com`

    const subject =
      encodeURIComponent(
        `Inquiry about ${company.name}`,
      )

    const body =
      encodeURIComponent(
        `Hello ${company.name},\n\nI would like to learn more about your construction services.`,
      )

    const gmailUrl =
      `https://mail.google.com/mail/?view=cm&fs=1&to=${toEmail}&su=${subject}&body=${body}`

    window.open(
      gmailUrl,
      '_blank',
      'noopener,noreferrer',
    )
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Budget
  // ───────────────────────────────────────────────────────────────────────────

  const budgetRange = (
    budgetLabel: string,
  ) => {
    switch (budgetLabel) {
      case 'Under LKR 5M':
        return {
          min: 0,
          max: 5,
        }

      case 'LKR 5M – 15M':
        return {
          min: 5,
          max: 15,
        }

      case 'LKR 15M – 30M':
        return {
          min: 15,
          max: 30,
        }

      case 'LKR 30M – 50M':
        return {
          min: 30,
          max: 50,
        }

      case 'LKR 50M – 100M':
        return {
          min: 50,
          max: 100,
        }

      case 'Above LKR 100M':
        return {
          min: 100,
          max: Number.MAX_SAFE_INTEGER,
        }

      default:
        return null
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Experience
  // ───────────────────────────────────────────────────────────────────────────

  const experienceRange = (
    experienceLabel: string,
  ) => {
    if (
      experienceLabel ===
      '1 – 5 Years'
    ) {
      return {
        min: 1,
        max: 5,
      }
    }

    if (
      experienceLabel ===
      '5 – 10 Years'
    ) {
      return {
        min: 5,
        max: 10,
      }
    }

    if (
      experienceLabel ===
      '10 – 20 Years'
    ) {
      return {
        min: 10,
        max: 20,
      }
    }

    if (
      experienceLabel ===
      '20+ Years'
    ) {
      return {
        min: 20,
        max: Number.MAX_SAFE_INTEGER,
      }
    }

    return null
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Filter Companies
  // ───────────────────────────────────────────────────────────────────────────

  const filteredCompanies =
    useMemo(() => {
      const range =
        budgetRange(
          appliedFilters.budget,
        )

      const expRange =
        experienceRange(
          appliedFilters.experience,
        )

      return companies
        .filter((company) => {
          // Search

          if (
            appliedFilters.search &&
            !company.name
              .toLowerCase()
              .includes(
                appliedFilters.search.toLowerCase(),
              ) &&
            !company.description
              .toLowerCase()
              .includes(
                appliedFilters.search.toLowerCase(),
              )
          ) {
            return false
          }

          // District

          if (
            appliedFilters.district !==
              'All Districts' &&
            company.location
              .toLowerCase() !==
              appliedFilters.district.toLowerCase()
          ) {
            return false
          }

          // Budget dropdown

          const value =
            parseBudgetValue(
              company.startingPrice,
            )

          if (range) {
            if (
              value < range.min ||
              value > range.max
            ) {
              return false
            }
          }

          // Budget slider

          if (
            appliedFilters.budgetSlider <
              100 &&
            value >
              appliedFilters.budgetSlider
          ) {
            return false
          }

          // Location checkboxes

          if (
            appliedFilters.locations
              .length > 0 &&
            !appliedFilters.locations.some(
              (location) =>
                location.toLowerCase() ===
                company.location.toLowerCase(),
            )
          ) {
            return false
          }

          // Experience

          if (expRange) {
            if (
              company.experience <
                expRange.min ||
              company.experience >
                expRange.max
            ) {
              return false
            }
          }

          // Specialization

          if (
            appliedFilters.specialization &&
            !company.tags.some(
              (tag) =>
                tag.toLowerCase() ===
                appliedFilters.specialization.toLowerCase(),
            )
          ) {
            return false
          }

          // Rating

          if (
            appliedFilters.minRating >
              0 &&
            company.rating <
              appliedFilters.minRating
          ) {
            return false
          }

          return true
        })
        .sort((a, b) => {
          if (
            sort === 'Top Rated'
          ) {
            return (
              b.rating - a.rating
            )
          }

          if (
            sort ===
            'Most Projects'
          ) {
            return (
              b.projects -
              a.projects
            )
          }

          if (
            sort ===
            'Price: Low to High'
          ) {
            return (
              parseBudgetValue(
                a.startingPrice,
              ) -
              parseBudgetValue(
                b.startingPrice,
              )
            )
          }

          if (
            sort === 'Newest'
          ) {
            return String(
              b.id,
            ).localeCompare(
              String(a.id),
            )
          }

          return 0
        })
    }, [
      companies,
      appliedFilters,
      sort,
    ])

  // ───────────────────────────────────────────────────────────────────────────
  // Pagination
  // ───────────────────────────────────────────────────────────────────────────

  const pageSize = 6

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredCompanies.length /
        pageSize,
    ),
  )

  const pagedCompanies =
    useMemo(() => {
      const start =
        (currentPage - 1) *
        pageSize

      return filteredCompanies.slice(
        start,
        start + pageSize,
      )
    }, [
      filteredCompanies,
      currentPage,
    ])

  // ───────────────────────────────────────────────────────────────────────────
  // Render
  // ───────────────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        backgroundColor:
          '#e6e0d4',
        minHeight: '100vh',
        fontFamily:
          "'Poppins', sans-serif",
      }}
    >
      {/* HERO */}

      <section
        id="hero"
        className="relative pt-28 pb-16 px-4"
        style={{
          background:
            'linear-gradient(135deg, #1d3a4f 0%, #345b79 50%, #4a7a9b 100%)',
          overflow: 'hidden',
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize:
              '60px 60px',
          }}
        />

        <div className="relative max-w-5xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-white/25 backdrop-blur-sm"
            style={{
              backgroundColor:
                'rgba(255,255,255,0.12)',
            }}
          >
            <span className="text-white text-xs font-medium">
              {companies.length > 0
                ? `${companies.length} Verified Construction Companies`
                : 'Verified Construction Companies'}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Find Trusted
            <br />

            <span
              style={{
                color: '#d59b86',
              }}
            >
              Construction Companies
            </span>
          </h1>

          <p className="text-white/75 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Compare verified
            construction companies,
            explore completed
            projects and request
            quotations powered by AI.
          </p>

          {/* Search */}

          <div
            className="rounded-2xl p-3 max-w-3xl mx-auto"
            style={{
              backgroundColor:
                'white',
              boxShadow:
                '0 20px 60px rgba(0,0,0,0.25)',
            }}
          >
            <div className="flex flex-col md:flex-row gap-2">
              {/* Company Name */}

              <div
                className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{
                  backgroundColor:
                    '#f7f4f0',
                }}
              >
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="#6b879c"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="8"
                  />

                  <path
                    strokeLinecap="round"
                    d="M21 21l-4.35-4.35"
                  />
                </svg>

                <input
                  id="search-company-name"
                  type="text"
                  placeholder="Search Company Name"
                  value={search}
                  onChange={(e) =>
                    setFilters(
                      (prev) => ({
                        ...prev,
                        search:
                          e.target.value,
                      }),
                    )
                  }
                  className="bg-transparent w-full text-sm outline-none"
                  style={{
                    color: '#1d1d1d',
                  }}
                />
              </div>

              {/* District */}

              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl md:w-44"
                style={{
                  backgroundColor:
                    '#f7f4f0',
                }}
              >
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="#6b879c"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>

                <select
                  id="search-district"
                  value={district}
                  onChange={(e) =>
                    setFilters(
                      (prev) => ({
                        ...prev,
                        district:
                          e.target.value,
                      }),
                    )
                  }
                  className="bg-transparent text-sm outline-none w-full"
                  style={{
                    color:
                      '#1d1d1d',
                  }}
                >
                  {districts.map(
                    (d) => (
                      <option
                        key={d}
                        value={d}
                      >
                        {d}
                      </option>
                    ),
                  )}
                </select>
              </div>

              {/* Budget */}

              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl md:w-44"
                style={{
                  backgroundColor:
                    '#f7f4f0',
                }}
              >
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="#6b879c"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                  />

                  <path d="M12 7v10M15 9.5c0-1.1-1.34-2-3-2s-3 .9-3 2 1.34 2 3 2 3 .9 3 2-1.34 2-3 2-3-.9-3-2" />
                </svg>

                <select
                  id="search-budget"
                  value={budget}
                  onChange={(e) =>
                    setFilters(
                      (prev) => ({
                        ...prev,
                        budget:
                          e.target.value,
                      }),
                    )
                  }
                  className="bg-transparent text-sm outline-none w-full"
                  style={{
                    color:
                      '#1d1d1d',
                  }}
                >
                  {budgets.map(
                    (b) => (
                      <option
                        key={b}
                        value={b}
                      >
                        {b}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <button
                id="hero-search-btn"
                onClick={
                  searchCompanies
                }
                className="flex items-center justify-center gap-2 px-7 py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-all duration-150 hover:shadow-lg"
                style={{
                  backgroundColor:
                    '#be5d3f',
                  minWidth: '120px',
                }}
              >
                Search
              </button>
            </div>
          </div>

          {/* Stats */}

          <div className="flex flex-wrap justify-center gap-10 mt-10">
            {[
              {
                value: `${companies.length}+`,
                label:
                  'Verified Builders',
              },
              {
                value: '15,000+',
                label:
                  'Completed Projects',
              },
              {
                value: '98%',
                label:
                  'Customer Satisfaction',
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center"
              >
                <p className="text-3xl font-bold text-white">
                  {stat.value}
                </p>

                <p
                  className="text-xs uppercase tracking-widest mt-1"
                  style={{
                    color:
                      '#d59b86',
                  }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_260px] gap-7">
          {/* LEFT FILTERS */}

          <aside
            id="filters-sidebar"
            aria-label="Filters"
          >
            <div
              className="bg-white rounded-3xl p-6 sticky top-20"
              style={{
                boxShadow:
                  '0 4px 24px rgba(52,91,121,0.10)',
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="font-bold text-sm uppercase tracking-widest"
                  style={{
                    color:
                      '#1d1d1d',
                  }}
                >
                  Filters
                </h2>

                <button
                  onClick={
                    clearFilters
                  }
                  className="text-xs font-medium"
                  style={{
                    color:
                      '#be5d3f',
                  }}
                >
                  Clear All
                </button>
              </div>

              {/* Location */}

              <div className="mb-6">
                <h3
                  className="text-xs font-semibold uppercase tracking-wider mb-3"
                  style={{
                    color:
                      '#6b879c',
                  }}
                >
                  Location
                </h3>

                <div className="space-y-2">
                  {locationOptions.map(
                    (loc) => (
                      <label
                        key={loc}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={locations.includes(
                            loc,
                          )}
                          onChange={() =>
                            toggleLocation(
                              loc,
                            )
                          }
                          style={{
                            accentColor:
                              '#345b79',
                          }}
                        />

                        <span
                          className="text-sm"
                          style={{
                            color:
                              '#1d1d1d',
                          }}
                        >
                          {loc}
                        </span>
                      </label>
                    ),
                  )}
                </div>
              </div>

              <div
                className="my-4"
                style={{
                  borderTop:
                    '1px solid #e6e0d4',
                }}
              />

              {/* Experience */}

              <div className="mb-6">
                <h3
                  className="text-xs font-semibold uppercase tracking-wider mb-3"
                  style={{
                    color:
                      '#6b879c',
                  }}
                >
                  Years of Experience
                </h3>

                <div className="space-y-2">
                  {experienceOptions.map(
                    (opt) => (
                      <label
                        key={opt}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="experience"
                          checked={
                            experience ===
                            opt
                          }
                          onChange={() =>
                            setFilters(
                              (
                                prev,
                              ) => ({
                                ...prev,
                                experience:
                                  opt,
                              }),
                            )
                          }
                        />

                        <span
                          className="text-sm"
                          style={{
                            color:
                              '#1d1d1d',
                          }}
                        >
                          {opt}
                        </span>
                      </label>
                    ),
                  )}
                </div>
              </div>

              <div
                className="my-4"
                style={{
                  borderTop:
                    '1px solid #e6e0d4',
                }}
              />

              {/* Specialization */}

              <div className="mb-6">
                <h3
                  className="text-xs font-semibold uppercase tracking-wider mb-3"
                  style={{
                    color:
                      '#6b879c',
                  }}
                >
                  Specialization
                </h3>

                <div className="space-y-2">
                  {specializationOptions.map(
                    (opt) => (
                      <label
                        key={opt}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="specialization"
                          checked={
                            specialization ===
                            opt
                          }
                          onChange={() =>
                            setFilters(
                              (
                                prev,
                              ) => ({
                                ...prev,
                                specialization:
                                  opt,
                              }),
                            )
                          }
                        />

                        <span
                          className="text-sm"
                          style={{
                            color:
                              '#1d1d1d',
                          }}
                        >
                          {opt}
                        </span>
                      </label>
                    ),
                  )}
                </div>
              </div>

              <div
                className="my-4"
                style={{
                  borderTop:
                    '1px solid #e6e0d4',
                }}
              />

              {/* Budget Slider */}

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{
                      color:
                        '#6b879c',
                    }}
                  >
                    Budget Range
                  </h3>

                  <span
                    className="text-xs font-bold"
                    style={{
                      color:
                        '#345b79',
                    }}
                  >
                    LKR {budgetSlider}M
                  </span>
                </div>

                <input
                  id="budget-slider"
                  type="range"
                  min={1}
                  max={100}
                  value={budgetSlider}
                  onChange={(e) =>
                    setFilters(
                      (prev) => ({
                        ...prev,
                        budgetSlider:
                          Number(
                            e.target
                              .value,
                          ),
                      }),
                    )
                  }
                  className="w-full"
                  style={{
                    accentColor:
                      '#345b79',
                  }}
                />
              </div>

              <div
                className="my-4"
                style={{
                  borderTop:
                    '1px solid #e6e0d4',
                }}
              />

              {/* Rating */}

              <div className="mb-6">
                <h3
                  className="text-xs font-semibold uppercase tracking-wider mb-3"
                  style={{
                    color:
                      '#6b879c',
                  }}
                >
                  Minimum Rating
                </h3>

                <div className="flex items-center gap-2">
                  {[4, 4.5, 5].map(
                    (r) => (
                      <button
                        key={r}
                        onClick={() =>
                          setFilters(
                            (
                              prev,
                            ) => ({
                              ...prev,
                              minRating:
                                r,
                            }),
                          )
                        }
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium"
                        style={
                          minRating ===
                          r
                            ? {
                                backgroundColor:
                                  '#345b79',
                                color:
                                  'white',
                              }
                            : {
                                backgroundColor:
                                  '#e6e0d4',
                                color:
                                  '#345b79',
                              }
                        }
                      >
                        ⭐ {r}+
                      </button>
                    ),
                  )}
                </div>
              </div>

              <button
                onClick={
                  applyFilters
                }
                className="w-full py-3 rounded-xl text-sm font-semibold text-white"
                style={{
                  backgroundColor:
                    '#345b79',
                }}
              >
                Apply Filters
              </button>
            </div>
          </aside>

          {/* CENTER */}

          <section aria-label="Construction companies listing">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2
                  className="text-lg font-bold"
                  style={{
                    color:
                      '#1d1d1d',
                  }}
                >
                  Construction Companies
                </h2>

                <p
                  className="text-sm mt-0.5"
                  style={{
                    color:
                      '#928d64',
                  }}
                >
                  {loading
                    ? 'Loading companies...'
                    : `Showing ${pagedCompanies.length} of ${filteredCompanies.length} matching companies`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label
                  className="text-xs"
                  style={{
                    color:
                      '#928d64',
                  }}
                >
                  Sort by:
                </label>

                <select
                  value={sort}
                  onChange={(e) =>
                    setSort(
                      e.target.value,
                    )
                  }
                  className="text-sm rounded-lg px-3 py-1.5 outline-none"
                  style={{
                    backgroundColor:
                      'white',
                    color:
                      '#1d1d1d',
                    border:
                      '1px solid #e6e0d4',
                  }}
                >
                  <option>
                    Top Rated
                  </option>

                  <option>
                    Most Projects
                  </option>

                  <option>
                    Price: Low to High
                  </option>

                  <option>
                    Newest
                  </option>
                </select>
              </div>
            </div>

            {/* Loading */}

            {loading && (
              <div className="bg-white rounded-3xl p-10 text-center">
                <p
                  className="text-sm"
                  style={{
                    color:
                      '#345b79',
                  }}
                >
                  Loading construction
                  companies...
                </p>
              </div>
            )}

            {/* Error */}

            {!loading &&
              error && (
                <div className="bg-white rounded-3xl p-10 text-center">
                  <p className="text-red-600 font-semibold mb-2">
                    Unable to load
                    construction
                    companies.
                  </p>

                  <p className="text-sm text-gray-500 mb-4">
                    {error}
                  </p>

                  <button
                    onClick={
                      loadCompanies
                    }
                    className="px-5 py-2 rounded-xl text-white text-sm"
                    style={{
                      backgroundColor:
                        '#345b79',
                    }}
                  >
                    Retry
                  </button>
                </div>
              )}

            {/* No data */}

            {!loading &&
              !error &&
              filteredCompanies.length ===
                0 && (
                <div className="bg-white rounded-3xl p-10 text-center">
                  <p
                    className="font-semibold"
                    style={{
                      color:
                        '#1d1d1d',
                    }}
                  >
                    No construction
                    companies found.
                  </p>

                  <p
                    className="text-sm mt-2"
                    style={{
                      color:
                        '#928d64',
                    }}
                  >
                    Try changing your
                    filters.
                  </p>
                </div>
              )}

            {/* Cards */}

            {!loading &&
              !error &&
              pagedCompanies.length >
                0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                  {pagedCompanies.map(
                    (company) => (
                      <CompanyCard
                        key={
                          company.id
                        }
                        company={
                          company
                        }
                        isBookmarked={bookmarkedCompanies.includes(
                          company.id,
                        )}
                        onToggleBookmark={
                          toggleBookmark
                        }
                        onEmail={
                          emailCompany
                        }
                        onViewProfile={() =>
                          navigate(
                            `/construction-companies/${company.id}`,
                          )
                        }
                      />
                    ),
                  )}
                </div>
              )}

            {/* Pagination */}

            {!loading &&
              !error &&
              filteredCompanies.length >
                0 && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    className="w-9 h-9 rounded-xl"
                    style={{
                      backgroundColor:
                        'white',
                      border:
                        '1px solid #e6e0d4',
                    }}
                    disabled={
                      currentPage ===
                      1
                    }
                    onClick={() =>
                      setCurrentPage(
                        Math.max(
                          1,
                          currentPage -
                            1,
                        ),
                      )
                    }
                  >
                    ‹
                  </button>

                  {Array.from(
                    {
                      length:
                        totalPages,
                    },
                    (_, i) =>
                      i + 1,
                  ).map(
                    (page) => (
                      <button
                        key={page}
                        className="w-9 h-9 rounded-xl text-sm font-medium"
                        onClick={() =>
                          setCurrentPage(
                            page,
                          )
                        }
                        style={
                          currentPage ===
                          page
                            ? {
                                backgroundColor:
                                  '#345b79',
                                color:
                                  'white',
                              }
                            : {
                                backgroundColor:
                                  'white',
                                color:
                                  '#1d1d1d',
                                border:
                                  '1px solid #e6e0d4',
                              }
                        }
                      >
                        {page}
                      </button>
                    ),
                  )}

                  <button
                    className="w-9 h-9 rounded-xl"
                    style={{
                      backgroundColor:
                        'white',
                      border:
                        '1px solid #e6e0d4',
                    }}
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    onClick={() =>
                      setCurrentPage(
                        Math.min(
                          totalPages,
                          currentPage +
                            1,
                        ),
                      )
                    }
                  >
                    ›
                  </button>
                </div>
              )}
          </section>

          {/* RIGHT SIDEBAR */}

          <aside
            id="market-insights-sidebar"
            aria-label="Market insights"
          >
            {/* Market Insights */}

            <div
              className="bg-white rounded-3xl p-6 mb-6"
              style={{
                boxShadow:
                  '0 4px 24px rgba(52,91,121,0.10)',
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor:
                      '#345b79',
                  }}
                >
                  <span className="text-white">
                    📊
                  </span>
                </div>

                <h3
                  className="font-bold text-sm"
                  style={{
                    color:
                      '#1d1d1d',
                  }}
                >
                  Market Insights
                </h3>
              </div>

              <p
                className="text-[10px] uppercase tracking-widest mb-1"
                style={{
                  color:
                    '#928d64',
                }}
              >
                Avg. Construction Cost /
                Sqft
              </p>

              <div className="flex items-baseline gap-2 mb-1">
                <span
                  className="text-2xl font-bold"
                  style={{
                    color:
                      '#345b79',
                  }}
                >
                  LKR 4,200
                </span>
              </div>

              <p
                className="text-[10px] mb-4"
                style={{
                  color:
                    '#495d38',
                }}
              >
                +8.2% from last year
              </p>

              <div className="space-y-3">
                {[
                  {
                    label:
                      'Residential',
                    value:
                      'LKR 3.8K',
                    color:
                      '#345b79',
                    pct: 70,
                  },
                  {
                    label:
                      'Commercial',
                    value:
                      'LKR 5.2K',
                    color:
                      '#be5d3f',
                    pct: 85,
                  },
                  {
                    label:
                      'Industrial',
                    value:
                      'LKR 2.9K',
                    color:
                      '#928d64',
                    pct: 55,
                  },
                  {
                    label:
                      'Luxury',
                    value:
                      'LKR 8.5K',
                    color:
                      '#d59b86',
                    pct: 95,
                  },
                ].map(
                  (item) => (
                    <div
                      key={
                        item.label
                      }
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span
                          className="text-xs"
                          style={{
                            color:
                              '#928d64',
                          }}
                        >
                          {
                            item.label
                          }
                        </span>

                        <span
                          className="text-xs font-semibold"
                          style={{
                            color:
                              '#1d1d1d',
                          }}
                        >
                          {
                            item.value
                          }
                        </span>
                      </div>

                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          backgroundColor:
                            '#e6e0d4',
                        }}
                      >
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: `${item.pct}%`,
                            backgroundColor:
                              item.color,
                          }}
                        />
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Top Builders */}

            <div
              className="bg-white rounded-3xl p-6"
              style={{
                boxShadow:
                  '0 4px 24px rgba(52,91,121,0.10)',
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor:
                      '#be5d3f',
                  }}
                >
                  <span className="text-white">
                    ★
                  </span>
                </div>

                <h3
                  className="font-bold text-sm"
                  style={{
                    color:
                      '#1d1d1d',
                  }}
                >
                  Top Residential
                  Builders
                </h3>
              </div>

              <div className="space-y-3">
                {topBuilders.map(
                  (builder) => (
                    <div
                      key={
                        builder.rank
                      }
                      className="flex items-center gap-3"
                    >
                      <span
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{
                          backgroundColor:
                            builder.rank ===
                            1
                              ? '#be5d3f'
                              : builder.rank ===
                                  2
                                ? '#6b879c'
                                : '#928d64',
                        }}
                      >
                        {
                          builder.rank
                        }
                      </span>

                      <div className="flex-1 min-w-0">
                        <p
                          className="text-xs font-medium truncate"
                          style={{
                            color:
                              '#1d1d1d',
                          }}
                        >
                          {
                            builder.name
                          }
                        </p>

                        <p
                          className="text-[10px]"
                          style={{
                            color:
                              '#928d64',
                          }}
                        >
                          {
                            builder.projects
                          }{' '}
                          projects
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>

              <Link
                to="/construction-companies"
                className="mt-5 block text-center text-xs font-semibold py-2.5 rounded-xl no-underline"
                style={{
                  backgroundColor:
                    '#e6e0d4',
                  color:
                    '#345b79',
                }}
              >
                View All Rankings
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}