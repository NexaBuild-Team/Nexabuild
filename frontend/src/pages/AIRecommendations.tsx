import { useState, useEffect, useMemo } from 'react'
import { useNavigate, Link } from 'react-router'
import { getAllLands } from '../services/landApi'
import type { Land } from '../types/land'

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const SparklesIcon = ({ cls = 'w-3.5 h-3.5' }: { cls?: string }) => (
  <svg className={cls} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
  </svg>
)
const FilterIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
)

// ─── Static UI data ───────────────────────────────────────────────────────────
const matchStats = [
  { label: 'Budget Match', sub: 'Within range', pct: 96, iconColor: '#345b79', iconBg: '#eff6ff' },
  { label: 'Location Match', sub: 'Colombo & Kandy', pct: 94, iconColor: '#be5d3f', iconBg: '#fff7f5' },
  { label: 'Type Match', sub: 'Villa, House', pct: 88, iconColor: '#495d38', iconBg: '#f0fdf4' },
  { label: 'Lifestyle Match', sub: 'Schools nearby', pct: 82, iconColor: '#928d64', iconBg: '#fefce8' },
]

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

function getLandSizeCategory(land: Land): string {
  const perches = land.perches
  if (perches < 10) return '< 10 Perches'
  if (perches <= 20) return '10–20 Perches'
  if (perches <= 50) return '20–50 Perches'
  return '50+ Perches'
}

const SRI_LANKA_DISTRICTS = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 
  'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara', 
  'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar', 
  'Matale', 'Matara', 'Moneragala', 'Mullaitivu', 'Nuwara Eliya', 
  'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
]

export default function AIRecommendations() {
  const navigate = useNavigate()

  const [allLands, setAllLands] = useState<Land[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ── Preference Assistant State (Persisted in localStorage) ──────────────────
  const [selectedPurpose, setSelectedPurpose] = useState(() => {
    return localStorage.getItem('nexabuild_land_pref_purpose') || 'Build Home'
  })
  const [selectedLandSize, setSelectedLandSize] = useState(() => {
    return localStorage.getItem('nexabuild_land_pref_size') || '10–20 Perches'
  })
  const [selectedEnvironment, setSelectedEnvironment] = useState(() => {
    return localStorage.getItem('nexabuild_land_pref_env') || 'Scenic / Hill Country'
  })
  const [selectedPlan, setSelectedPlan] = useState(() => {
    return localStorage.getItem('nexabuild_land_pref_plan') || 'Build / Develop Immediately'
  })

  // ── Applied Preference States (used inside scoredLands calculations) ──────────
  const [appliedPurpose, setAppliedPurpose] = useState(selectedPurpose)
  const [appliedLandSize, setAppliedLandSize] = useState(selectedLandSize)
  const [appliedEnvironment, setAppliedEnvironment] = useState(selectedEnvironment)
  const [appliedPlan, setAppliedPlan] = useState(selectedPlan)

  const [activeLocations, setActiveLocations] = useState<string[]>([])
  const [checkedTypes, setCheckedTypes] = useState(['Residential', 'Commercial', 'Agricultural', 'Tourism'])
  const [activeRoadAccessFilters, setActiveRoadAccessFilters] = useState<string[]>(['< 12 Feet', '12–15 Feet', '15–20 Feet', '20+ Feet'])
  const [activeLocation, setActiveLocation] = useState(() => {
    return localStorage.getItem('nexabuild_land_filter_location') || 'Any'
  })
  const [appliedLocation, setAppliedLocation] = useState(activeLocation)
  const [selectedType, setSelectedType] = useState(() => {
    return localStorage.getItem('nexabuild_land_filter_type') || 'all'
  })
  const [appliedType, setAppliedType] = useState(selectedType)
  const [priceMax, setPriceMax] = useState(() => {
    const saved = localStorage.getItem('nexabuild_land_filter_pricemax')
    return saved ? Number(saved) : 150
  })
  const [appliedPriceMax, setAppliedPriceMax] = useState(priceMax)
  const [activeRoadAccess, setActiveRoadAccess] = useState(() => {
    return localStorage.getItem('nexabuild_land_pref_road_access') || 'Any'
  })
  const [appliedRoadAccess, setAppliedRoadAccess] = useState(activeRoadAccess)
  const [savedCards, setSavedCards] = useState<string[]>([])
  const [bookmarked, setBookmarked] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('Best Match')
  const [searchText, setSearchText] = useState('')
  const [budgetMin, setBudgetMin] = useState('5M')
  const [budgetMax, setBudgetMax] = useState('150M')

  const locationCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    const POPULAR_AREAS = ['Malabe', 'Battaramulla', 'Kaduwela', 'Negombo', 'Colombo', 'Kandy', 'Galle', 'Kurunegala']

    allLands.forEach(l => {
      const locLower = l.location.toLowerCase()
      const matched = POPULAR_AREAS.find(a => locLower.includes(a.toLowerCase()))
      const key = matched || l.location.split(',')[0].trim()
      counts[key] = (counts[key] || 0) + 1
    })
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
  }, [allLands])

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    allLands.forEach(l => {
      const type = l.landType.charAt(0).toUpperCase() + l.landType.slice(1).toLowerCase() + ' Land'
      counts[type] = (counts[type] || 0) + 1
    })
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }, [allLands])

  const sizeCatCounts = useMemo(() => {
    const counts: Record<string, number> = {
      '< 10 Perches': 0,
      '10–20 Perches': 0,
      '20–50 Perches': 0,
      '50+ Perches': 0
    }
    allLands.forEach(l => {
      const cat = getLandSizeCategory(l)
      if (counts[cat] !== undefined) {
        counts[cat]++
      }
    })
    return Object.entries(counts).map(([name, count]) => ({ name, count }))
  }, [allLands])

  const [searchLocation, setSearchLocation] = useState(() => {
    return localStorage.getItem('nexabuild_land_filter_location') || 'Any'
  })
  const [searchType, setSearchType] = useState(() => {
    return localStorage.getItem('nexabuild_land_filter_type') || 'all'
  })
  const [searchBudget, setSearchBudget] = useState(() => {
    const savedPriceMax = localStorage.getItem('nexabuild_land_filter_pricemax')
    if (savedPriceMax === '10') return 'Under LKR 10M'
    if (savedPriceMax === '30') return 'LKR 10M - 30M'
    if (savedPriceMax === '60') return 'LKR 30M - 60M'
    if (savedPriceMax === '100') return 'LKR 60M - 100M'
    if (savedPriceMax === '150') return 'LKR 100M - 150M'
    return 'Any Budget'
  })

  const handleHeroSearch = () => {
    setActiveLocation(searchLocation)
    setAppliedLocation(searchLocation)
    setSelectedType(searchType)
    setAppliedType(searchType)
    
    let maxVal = 150
    if (searchBudget === 'Under LKR 10M') maxVal = 10
    else if (searchBudget === 'LKR 10M - 30M') maxVal = 30
    else if (searchBudget === 'LKR 30M - 60M') maxVal = 60
    else if (searchBudget === 'LKR 60M - 100M') maxVal = 100
    else if (searchBudget === 'LKR 100M - 150M') maxVal = 150
    
    setPriceMax(maxVal)
    setAppliedPriceMax(maxVal)
    localStorage.setItem('nexabuild_land_filter_pricemax', String(maxVal))
    localStorage.setItem('nexabuild_land_filter_location', searchLocation)
    localStorage.setItem('nexabuild_land_filter_type', searchType)
    setSearchText('')

    const target = document.getElementById('recommended-section')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleClearAll = () => {
    setSelectedType('all')
    setAppliedType('all')
    setActiveLocation('Any')
    setAppliedLocation('Any')
    setActiveRoadAccess('Any')
    setAppliedRoadAccess('Any')
    setPriceMax(150)
    setAppliedPriceMax(150)
    setSearchText('')
    setActiveLocations([])
    setCenterFilterApplied(false)
  }

  const [centerFilterApplied, setCenterFilterApplied] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisStep, setAnalysisStep] = useState(0)

  // ── Property-page AI pattern: hasGenerated + isGenerating ────────────────
  const [hasGenerated, setHasGenerated] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleSidebarAISmartRecommend = () => {
    setAppliedLocation(activeLocation)
    setAppliedType(selectedType)
    setAppliedPriceMax(priceMax)
    setAppliedRoadAccess(activeRoadAccess)

    localStorage.setItem('nexabuild_land_filter_location', activeLocation)
    localStorage.setItem('nexabuild_land_filter_type', selectedType)
    localStorage.setItem('nexabuild_land_filter_pricemax', String(priceMax))
    localStorage.setItem('nexabuild_land_pref_road_access', activeRoadAccess)

    setHasGenerated(true)
  }

  const handleGenerateRecommendations = async () => {
    // Persist all preferences
    localStorage.setItem('nexabuild_land_pref_purpose', selectedPurpose)
    localStorage.setItem('nexabuild_land_pref_size', selectedLandSize)
    localStorage.setItem('nexabuild_land_pref_env', selectedEnvironment)
    localStorage.setItem('nexabuild_land_pref_plan', selectedPlan)
    localStorage.setItem('nexabuild_land_filter_location', activeLocation)
    localStorage.setItem('nexabuild_land_filter_type', selectedType)
    localStorage.setItem('nexabuild_land_filter_pricemax', String(priceMax))
    localStorage.setItem('nexabuild_land_pref_road_access', activeRoadAccess)

    setIsGenerating(true)

    // 1.3s delay matching PropertyListingAI pattern
    await new Promise(resolve => setTimeout(resolve, 1300))

    // Apply preference states instantly after delay
    setAppliedPurpose(selectedPurpose)
    setAppliedLandSize(selectedLandSize)
    setAppliedEnvironment(selectedEnvironment)
    setAppliedPlan(selectedPlan)

    setHasGenerated(true)
    setCenterFilterApplied(true)
    setIsGenerating(false)

    const target = document.getElementById('recommended-section')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    getAllLands()
      .then(data => {
        setAllLands(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load land listings. Please try again later.')
        setLoading(false)
      })
  }, [])

  const changePurpose = (val: string) => {
    setSelectedPurpose(val)
  }

  const changeLandSize = (val: string) => {
    setSelectedLandSize(val)
  }

  const changeEnvironment = (val: string) => {
    setSelectedEnvironment(val)
  }

  const changePlan = (val: string) => {
    setSelectedPlan(val)
  }

  const toggleLocation = (loc: string) => {
    setActiveLocations(prev =>
      prev.includes(loc) ? prev.filter(l => l !== loc) : [...prev, loc]
    )
  }

  const toggleType = (type: string) => {
    setCheckedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  const toggleRoadAccessFilter = (val: string) => {
    setActiveRoadAccessFilters(prev =>
      prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
    )
  }

  // ── Dynamic AI Scoring Engine (mirrors PropertyListingAI.tsx pattern) ────────
  const scoreWithAI = (land: Land): { score: number; rawScore: number } => {
    let score = 99 // Start with perfect match
    const loc = land.location.toLowerCase()
    const desc = (land.description || '').toLowerCase()
    const type = land.landType.toLowerCase()
    const roadWidth = getRoadAccessWidth(land)

    // Stage 1: Left Sidebar Penalties
    if (appliedLocation && appliedLocation !== 'Any') {
      if (!loc.includes(appliedLocation.toLowerCase())) {
        score -= 15
      }
    }
    if (appliedType && appliedType !== 'all') {
      if (type !== appliedType.toLowerCase()) {
        score -= 15
      }
    }
    if (appliedRoadAccess && appliedRoadAccess !== 'Any') {
      if (roadWidth !== appliedRoadAccess) {
        score -= 15
      }
    }
    if (appliedPriceMax) {
      if (land.price > appliedPriceMax * 1000000) {
        score -= 15
      }
    }

    // Stage 2: Center Questionnaire Penalties (Only if centerFilterApplied is true)
    if (centerFilterApplied) {
      // Purpose matching (10 points penalty)
      if (appliedPurpose) {
        let isMatch = false
        if (land.purpose && land.purpose === appliedPurpose) {
          isMatch = true
        } else {
          if (appliedPurpose === 'Build Home' && type === 'residential') isMatch = true
          else if (appliedPurpose === 'Investment' && (type === 'tourism' || type === 'commercial')) isMatch = true
          else if (appliedPurpose === 'Agriculture' && type === 'agricultural') isMatch = true
          else if (appliedPurpose === 'Commercial Project' && type === 'commercial') isMatch = true
        }
        if (!isMatch) score -= 10
      }

      // Environment matching (10 points penalty)
      if (appliedEnvironment) {
        let isMatch = false
        if (land.environment && land.environment === appliedEnvironment) {
          isMatch = true
        } else {
          if (appliedEnvironment === 'City / Urban Area' && (loc.includes('colombo') || loc.includes('suburb'))) isMatch = true
          else if (appliedEnvironment === 'Scenic / Hill Country' && (loc.includes('kandy') || desc.includes('scenic'))) isMatch = true
          else if (appliedEnvironment === 'Coastal / Beachfront' && (loc.includes('galle') || loc.includes('negombo') || desc.includes('beach'))) isMatch = true
          else if (appliedEnvironment === 'Countryside / Rural' && (loc.includes('kurunegala') || desc.includes('quiet') || desc.includes('serene'))) isMatch = true
        }
        if (!isMatch) score -= 10
      }

      // Land size matching (10 points penalty)
      const sizeCat = getLandSizeCategory(land)
      if (appliedLandSize !== sizeCat) {
        score -= 10
      }

      // Plan matching (10 points penalty)
      if (appliedPlan) {
        let isMatch = false
        if (land.developmentPlan && land.developmentPlan === appliedPlan) {
          isMatch = true
        } else {
          if (appliedPlan === 'Build / Develop Immediately' && land.status.toLowerCase() === 'for sale') isMatch = true
          else if (appliedPlan === 'Hold for Appreciation' && land.status.toLowerCase() === 'premium') isMatch = true
          else if (appliedPlan === 'Agricultural Cultivation' && type === 'agricultural') isMatch = true
        }
        if (!isMatch) score -= 10
      }
    }

    return {
      score: Math.min(Math.max(score, 55), 99),
      rawScore: score
    }
  }

  // ── Dynamic reason generator (mirrors PropertyListingAI reasonWithAI) ────────
  const reasonWithAI = (land: Land): string => {
    const reasons: string[] = []
    const loc = land.location.toLowerCase()
    const desc = (land.description || '').toLowerCase()
    const type = land.landType.toLowerCase()

    if (appliedPurpose) {
      if (land.purpose && land.purpose === appliedPurpose) {
        reasons.push(`Ideal for ${appliedPurpose}`)
      } else {
        if (appliedPurpose === 'Build Home' && type === 'residential') reasons.push('Ideal residential plot for home building')
        if (appliedPurpose === 'Investment' && (type === 'tourism' || type === 'commercial')) reasons.push('Strong investment-grade land asset')
        if (appliedPurpose === 'Agriculture' && type === 'agricultural') reasons.push('Ready for cultivation')
        if (appliedPurpose === 'Commercial Project' && type === 'commercial') reasons.push('Prime commercial development land')
      }
    }

    if (appliedEnvironment) {
      if (land.environment && land.environment === appliedEnvironment) {
        reasons.push(`${appliedEnvironment} environment`)
      } else {
        if (appliedEnvironment === 'City / Urban Area' && loc.includes('colombo')) reasons.push('Urban Colombo location')
        if (appliedEnvironment === 'Scenic / Hill Country' && (loc.includes('kandy') || desc.includes('scenic'))) reasons.push('Scenic hill country setting')
        if (appliedEnvironment === 'Coastal / Beachfront' && (loc.includes('galle') || loc.includes('negombo'))) reasons.push('Coastal / beachfront access')
      }
    }

    if (appliedLandSize === getLandSizeCategory(land)) {
      reasons.push(`${getLandSizeCategory(land)} matches size preference`)
    }

    if (appliedPlan) {
      if (land.developmentPlan && land.developmentPlan === appliedPlan) {
        reasons.push(`Perfect for ${appliedPlan}`)
      } else {
        if (appliedPlan === 'Build / Develop Immediately' && land.status.toLowerCase() === 'for sale') reasons.push('Available for immediate development')
        if (appliedPlan === 'Hold for Appreciation' && land.status.toLowerCase() === 'premium') reasons.push('Premium appreciation potential')
      }
    }

    if (reasons.length === 0) return `${land.landType} land in ${land.location.split(',')[0].trim()} · ${land.perches} perches`
    return reasons.join(' · ')
  }

  // ── Scored lands — re-scores when hasGenerated changes (PropertyListingAI pattern) ──
  const scoredLands = useMemo(() => {
    let pool = [...allLands]

    // Location
    if (appliedLocation && appliedLocation !== 'Any') {
      pool = pool.filter(l => l.location.toLowerCase().includes(appliedLocation.toLowerCase()))
    } else if (activeLocations.length > 0) {
      pool = pool.filter(l =>
        activeLocations.some(loc => l.location.toLowerCase().includes(loc.toLowerCase()))
      )
    }

    // Type
    if (appliedType && appliedType !== 'all') {
      pool = pool.filter(l => l.landType.toLowerCase() === appliedType.toLowerCase())
    } else if (checkedTypes.length > 0) {
      pool = pool.filter(l =>
        checkedTypes.some(t => {
          const typeMap: Record<string, string> = {
            'Residential': 'residential',
            'Commercial': 'commercial',
            'Agricultural': 'agricultural',
            'Tourism': 'tourism',
            'Industrial': 'industrial'
          }
          return l.landType.toLowerCase() === (typeMap[t] || t.toLowerCase())
        })
      )
    }

    // Road Access
    if (appliedRoadAccess && appliedRoadAccess !== 'Any') {
      pool = pool.filter(l => getRoadAccessWidth(l) === appliedRoadAccess)
    } else if (activeRoadAccessFilters.length > 0) {
      pool = pool.filter(l => activeRoadAccessFilters.includes(getRoadAccessWidth(l)))
    }

    // Price Max
    if (appliedPriceMax) {
      pool = pool.filter(l => l.price <= appliedPriceMax * 1000000)
    }

    return pool.map(land => {
      // Base detailed match breakdown (always computed for chip display)
      const purposeMatch = { matched: false, text: '' }
      if (appliedPurpose === 'Build Home') {
        const m = (land.purpose === 'Build Home') || land.landType.toLowerCase() === 'residential'
        purposeMatch.matched = m; purposeMatch.text = m ? 'Build Home (Residential Land)' : `Build Home (Land is ${land.landType})`
      } else if (appliedPurpose === 'Investment') {
        const m = (land.purpose === 'Investment') || land.landType.toLowerCase() === 'tourism' || land.landType.toLowerCase() === 'residential'
        purposeMatch.matched = m; purposeMatch.text = m ? `Investment (${land.landType} Land)` : `Investment (Land is ${land.landType})`
      } else if (appliedPurpose === 'Agriculture') {
        const m = (land.purpose === 'Agriculture') || land.landType.toLowerCase() === 'agricultural'
        purposeMatch.matched = m; purposeMatch.text = m ? 'Agriculture (Agricultural Land)' : `Agriculture (Land is ${land.landType})`
      } else if (appliedPurpose === 'Commercial Project') {
        const m = (land.purpose === 'Commercial Project') || land.landType.toLowerCase() === 'commercial'
        purposeMatch.matched = m; purposeMatch.text = m ? 'Commercial Project (Commercial Land)' : `Commercial Project (Land is ${land.landType})`
      }

      const actualWidth = getRoadAccessWidth(land)
      const actualSize = getLandSizeCategory(land)
      const landSizeMatch = {
        matched: actualSize === appliedLandSize,
        text: actualSize === appliedLandSize ? `${actualSize} (Matches preference)` : `${actualSize} (Pref: ${appliedLandSize})`
      }

      const loc = land.location.toLowerCase()
      const desc = (land.description || '').toLowerCase()
      const envMatch = { matched: false, text: '' }
      if (appliedEnvironment === 'City / Urban Area') {
        const m = (land.environment === 'City / Urban Area') || loc.includes('colombo') || loc.includes('suburb')
        envMatch.matched = m; envMatch.text = m ? 'City / Urban Area' : `City / Urban Area (Land is in ${land.location.split(',')[0].trim()})`
      } else if (appliedEnvironment === 'Scenic / Hill Country') {
        const m = (land.environment === 'Scenic / Hill Country') || loc.includes('kandy') || desc.includes('mountain') || desc.includes('scenic')
        envMatch.matched = m; envMatch.text = m ? 'Scenic / Hill Country' : `Scenic / Hill Country (Land is in ${land.location.split(',')[0].trim()})`
      } else if (appliedEnvironment === 'Coastal / Beachfront') {
        const m = (land.environment === 'Coastal / Beachfront') || loc.includes('galle') || loc.includes('negombo') || desc.includes('beach') || desc.includes('ocean')
        envMatch.matched = m; envMatch.text = m ? `Coastal / Beachfront` : `Coastal / Beachfront (Land is in ${land.location.split(',')[0].trim()})`
      } else if (appliedEnvironment === 'Countryside / Rural') {
        const m = (land.environment === 'Countryside / Rural') || loc.includes('kurunegala') || desc.includes('quiet') || desc.includes('serene')
        envMatch.matched = m; envMatch.text = m ? `Countryside / Rural` : `Countryside / Rural (Land is in ${land.location.split(',')[0].trim()})`
      }

      const planMatch = { matched: false, text: '' }
      if (appliedPlan === 'Build / Develop Immediately') {
        const m = (land.developmentPlan === 'Build / Develop Immediately') || land.status.toLowerCase() === 'for sale'
        planMatch.matched = m; planMatch.text = m ? 'Develop Immediately' : `Develop Immediately (Status: ${land.status})`
      } else if (appliedPlan === 'Hold for Appreciation') {
        const m = (land.developmentPlan === 'Hold for Appreciation') || land.status.toLowerCase() === 'premium' || land.status.toLowerCase() === 'for sale'
        planMatch.matched = m; planMatch.text = m ? `Hold for Appreciation` : `Hold for Appreciation (Status: ${land.status})`
      } else if (appliedPlan === 'Agricultural Cultivation') {
        const m = (land.developmentPlan === 'Agricultural Cultivation') || land.landType.toLowerCase() === 'agricultural'
        planMatch.matched = m; planMatch.text = m ? 'Agricultural Cultivation' : `Agricultural Cultivation (Type: ${land.landType})`
      }

      // Use dynamic scoreWithAI directly for both stages
      const aiRes = scoreWithAI(land)

      // Dynamic reason text mirrors PropertyListingAI reasonWithAI pattern
      const aiReason = hasGenerated ? reasonWithAI(land) : undefined

      return {
        ...land,
        matchScore: aiRes.score,
        rawScore: aiRes.rawScore,
        aiReason,
        aiDetails: { purposeMatch, landSizeMatch, envMatch, planMatch }
      }
    }).sort((a, b) => {
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore
      }
      return (b.rawScore || 0) - (a.rawScore || 0)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allLands, appliedPurpose, appliedLandSize, appliedEnvironment, appliedPlan, appliedLocation, activeLocations, appliedType, checkedTypes, appliedRoadAccess, activeRoadAccessFilters, appliedPriceMax, hasGenerated, centerFilterApplied])


  const [visibleRecommendations, setVisibleRecommendations] = useState(2)

  const [randomBrowseLands, setRandomBrowseLands] = useState<any[]>([])

  useEffect(() => {
    if (allLands.length > 0 && randomBrowseLands.length === 0) {
      const arr = [...allLands]
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]
      }
      setRandomBrowseLands(arr.slice(0, 3))
    }
  }, [allLands, randomBrowseLands])

  const browseLands = useMemo(() => {
    let filtered = [...randomBrowseLands]

    // Search query
    if (searchText.trim() !== '') {
      const q = searchText.toLowerCase()
      filtered = filtered.filter(l =>
        l.name.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q) ||
        (l.description || '').toLowerCase().includes(q)
      )
    }

    // Sort
    if (sortBy === 'Price: Low to High') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'Price: High to Low') {
      filtered.sort((a, b) => b.price - a.price)
    } else {
      // Best Match
      filtered.sort((a, b) => {
        if (b.matchScore !== a.matchScore) {
          return b.matchScore - a.matchScore
        }
        return (b.rawScore || 0) - (a.rawScore || 0)
      })
    }

    return filtered
  }, [randomBrowseLands, searchText, sortBy])

  const recommendedLands = useMemo(() => {
    return scoredLands.slice(0, visibleRecommendations)
  }, [scoredLands, visibleRecommendations])

  return (
    <div style={{ backgroundColor: '#e6e0d4', fontFamily: 'Inter, sans-serif' }}>

      {/* ── Hero Section ── */}
      <section className="pt-[60px] pb-16 px-6 text-white" style={{ backgroundColor: '#345b79' }}>
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider"
            style={{ backgroundColor: 'rgba(190,93,63,0.80)' }}
          >
            <span>✦ AI-Powered Intelligence</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Find Your Perfect Land with AI</h1>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-3 flex flex-col sm:flex-row gap-3 items-stretch mt-8">
            {/* Location Dropdown */}
            <div className="flex-1 flex items-center gap-2.5 border rounded-xl px-3 py-2.5" style={{ borderColor: '#e6e0d4' }}>
              <svg className="w-4 h-4 flex-shrink-0 text-[#ccb7a3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <select
                id="ai-search-location"
                value={searchLocation}
                onChange={e => setSearchLocation(e.target.value)}
                className="w-full text-sm font-medium bg-transparent outline-none cursor-pointer appearance-none pr-6"
                style={{ color: '#928d64' }}
              >
                <option value="Any">All Districts</option>
                {SRI_LANKA_DISTRICTS.map(dist => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
              <svg className="w-4 h-4 text-[#ccb7a3] pointer-events-none -ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Land Type Dropdown */}
            <div className="relative flex-shrink-0">
              <div className="flex items-center gap-1.5 border rounded-xl px-3 py-2.5" style={{ borderColor: '#e6e0d4' }}>
                <svg className="w-4 h-4 text-[#ccb7a3] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-13.5 18v-2.25z" />
                </svg>
                <select
                  id="ai-search-type"
                  value={searchType}
                  onChange={e => setSearchType(e.target.value)}
                  className="text-sm font-medium bg-transparent outline-none cursor-pointer appearance-none pr-6"
                  style={{ color: '#928d64' }}
                >
                  <option value="all">All Types</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="agricultural">Agricultural</option>
                  <option value="industrial">Industrial</option>
                </select>
                <svg className="w-4 h-4 text-[#ccb7a3] pointer-events-none -ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Budget Dropdown */}
            <div className="relative flex-shrink-0">
              <div className="flex items-center gap-1.5 border rounded-xl px-3 py-2.5" style={{ borderColor: '#e6e0d4' }}>
                <svg className="w-4 h-4 text-[#ccb7a3] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <select
                  id="ai-search-budget"
                  value={searchBudget}
                  onChange={e => setSearchBudget(e.target.value)}
                  className="text-sm font-medium bg-transparent outline-none cursor-pointer appearance-none pr-6"
                  style={{ color: '#928d64' }}
                >
                  <option value="Any Budget">Any Budget</option>
                  <option value="Under LKR 10M">Under LKR 10M</option>
                  <option value="LKR 10M - 30M">LKR 10M - 30M</option>
                  <option value="LKR 30M - 60M">LKR 30M - 60M</option>
                  <option value="LKR 60M - 100M">LKR 60M - 100M</option>
                  <option value="LKR 100M - 150M">LKR 100M - 150M</option>
                </select>
                <svg className="w-4 h-4 text-[#ccb7a3] pointer-events-none -ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Search Button */}
            <button
              id="hero-search-btn"
              onClick={handleHeroSearch}
              className="flex items-center justify-center gap-2 text-white font-bold px-6 py-2.5 rounded-xl transition-all duration-200 hover:opacity-90 shadow whitespace-nowrap flex-shrink-0 active:scale-95 cursor-pointer w-full sm:w-auto"
              style={{ backgroundColor: '#be5d3f' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>
          </div>

          {/* Stats */}
          <div className="pt-4 flex justify-center items-center gap-12 text-slate-300 text-sm">
            <div><span className="text-white font-bold">24,000+</span> Properties Listed</div>
            <div><span className="text-white font-bold">98%</span> AI Match Accuracy</div>
            <div><span className="text-white font-bold">340+</span> Verified Builders</div>
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* ── Breadcrumb ── */}
        <nav className="flex text-xs mb-8" style={{ color: '#928d64' }}>
          <ol className="flex items-center gap-2">
            <li><Link to="/" className="hover:underline" style={{ color: '#928d64' }}>Home</Link></li>
            <li>›</li>
            <li className="font-semibold" style={{ color: '#345b79' }}>AI Recommendations</li>
          </ol>
        </nav>



        {/* ── Three-Column Layout ── */}
        <div className="grid grid-cols-12 gap-8">

          {/* ── LEFT SIDEBAR ── */}
          <aside className="col-span-12 lg:col-span-3 space-y-6">
            {/* Filters Card */}
            <div className="bg-white rounded-2xl shadow p-4 border border-slate-100">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-sm" style={{ color: '#1d1d1d' }}>Land Filters</h2>
                <button
                  id="clear-all-btn"
                  onClick={handleClearAll}
                  className="text-[10px] font-semibold hover:opacity-80 transition-opacity"
                  style={{ color: '#be5d3f' }}
                >
                  Clear All
                </button>
              </div>

              {/* Location */}
              <div className="mb-4">
                <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#928d64' }}>Location</h3>
                <select
                  id="filter-district-input"
                  value={activeLocation === 'Any' ? '' : activeLocation}
                  onChange={(e) => setActiveLocation(e.target.value || 'Any')}
                  className="w-full border rounded-lg px-2 py-1.5 text-[10px] outline-none mb-2"
                  style={{ borderColor: '#e6e0d4', color: '#1d1d1d', backgroundColor: '#f9f7f4' }}
                >
                  <option value="">All Districts</option>
                  {SRI_LANKA_DISTRICTS.map(dist => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>

                {/* Location pill chips */}
                <div className="flex flex-wrap gap-1.5">
                  {['Colombo', 'Kandy', 'Galle'].map(loc => (
                    <button
                      key={loc}
                      id={`loc-chip-${loc.toLowerCase()}`}
                      onClick={() => setActiveLocation(loc)}
                      className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full transition-all duration-150 cursor-pointer"
                      style={
                        activeLocation === loc
                          ? { backgroundColor: '#345b79', color: '#fff' }
                          : { backgroundColor: '#e6e0d4', color: '#928d64' }
                      }
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t my-3" style={{ borderColor: '#e6e0d4' }} />

              {/* Land Type */}
              <div className="mb-4">
                <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#928d64' }}>Land Type</h3>
                <div className="space-y-1.5">
                  {[
                    { label: 'All Types', val: 'all' },
                    { label: 'Residential', val: 'residential' },
                    { label: 'Commercial', val: 'commercial' },
                    { label: 'Agricultural', val: 'agricultural' },
                    { label: 'Industrial', val: 'industrial' },
                  ].map(item => (
                    <label key={item.val} className="flex items-center gap-2 cursor-pointer group">
                      <div
                        className="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                        style={
                          selectedType === item.val
                            ? { borderColor: '#345b79', backgroundColor: '#345b79' }
                            : { borderColor: '#ccb7a3' }
                        }
                        onClick={() => setSelectedType(item.val)}
                      >
                        {selectedType === item.val && (
                          <div className="w-1 h-1 rounded-full bg-white" />
                        )}
                      </div>
                      <span
                        className="text-[11px] font-medium"
                        style={{ color: '#1d1d1d' }}
                        onClick={() => setSelectedType(item.val)}
                      >
                        {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t my-3" style={{ borderColor: '#e6e0d4' }} />

              {/* Price Range */}
              <div className="mb-4">
                <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#928d64' }}>Budget Range</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold" style={{ color: '#345b79' }}>LKR 5M</span>
                  <span className="text-[10px] font-semibold" style={{ color: '#345b79' }}>LKR 150M</span>
                </div>
                <div className="relative h-5 flex items-center">
                  <div className="absolute w-full h-1.5 rounded-full" style={{ backgroundColor: '#e6e0d4' }} />
                  <div
                    className="absolute h-1.5 rounded-full pointer-events-none"
                    style={{ left: '0%', right: '0%', backgroundColor: '#345b79' }}
                  />
                  <input
                    id="ll-slider-price"
                    type="range"
                    min={5} max={150} step={5} value={priceMax}
                    onChange={e => setPriceMax(Number(e.target.value))}
                    className="absolute w-full h-1.5 appearance-none bg-transparent cursor-pointer"
                    style={{ accentColor: '#345b79' }}
                  />
                </div>
                <p className="text-[9px] mt-1.5 flex justify-between" style={{ color: '#ccb7a3' }}>
                  <span>Up to LKR {priceMax}M</span>
                  <span>drag to filter</span>
                </p>
              </div>

              {/* Divider */}
              <div className="border-t my-3" style={{ borderColor: '#e6e0d4' }} />

              {/* Road Access Width */}
              <div className="mb-4">
                <h3 className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#928d64' }}>Road Access</h3>
                <div className="flex gap-1.5 flex-wrap">
                  {['Any', '< 12 Feet', '12–15 Feet', '15–20 Feet', '20+ Feet'].map(width => (
                    <button
                      key={width}
                      id={`road-access-btn-${width.replace(/[^a-z0-9]/gi, '')}`}
                      onClick={() => setActiveRoadAccess(width)}
                      className="px-2.5 h-7 rounded-lg text-[10px] font-semibold transition-all duration-150 cursor-pointer"
                      style={
                        activeRoadAccess === width
                          ? { backgroundColor: '#345b79', color: '#fff' }
                          : { backgroundColor: '#e6e0d4', color: '#928d64' }
                      }
                    >
                      {width}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Smart Recommend */}
              <button
                id="ai-smart-recommend-btn"
                onClick={handleSidebarAISmartRecommend}
                className="w-full flex items-center justify-center gap-1.5 text-white text-[11px] font-bold py-2.5 rounded-xl mb-2 transition-all hover:opacity-90 shadow cursor-pointer active:scale-95"
                style={{ background: 'linear-gradient(135deg, #345b79, #6b879c)' }}
              >
                <SparklesIcon />
                AI Smart Recommend
              </button>

              {/* Apply Filters */}
              <button
                id="apply-filters-btn"
                onClick={() => {
                  setAppliedLocation(activeLocation)
                  setAppliedType(selectedType)
                  setAppliedPriceMax(priceMax)
                  setAppliedRoadAccess(activeRoadAccess)
                }}
                className="w-full flex items-center justify-center gap-1.5 text-[11px] font-bold py-2.5 rounded-xl transition-all hover:opacity-90 border cursor-pointer active:scale-95"
                style={{ color: '#345b79', borderColor: '#345b79', backgroundColor: 'transparent' }}
              >
                <FilterIcon />
                Apply Filters
              </button>
            </div>
          </aside>

          {/* ── CENTER CONTENT ── */}
          <section className="col-span-12 lg:col-span-6 space-y-8">
            <div className="bg-white rounded-2xl shadow overflow-hidden border border-slate-100">
              <div
                className="px-5 py-3.5 flex items-center justify-between"
                style={{ background: 'linear-gradient(90deg, #345b79 0%, #6b879c 100%)' }}
              >
                <div className="flex items-center gap-2">
                  <SparklesIcon cls="w-4 h-4 text-[#d59b86]" />
                  <div>
                    <p className="text-white font-bold text-sm">AI Smart Preference Assistant</p>
                    <p className="text-[10px]" style={{ color: 'rgba(230,224,212,0.70)' }}>
                      Tell us about your ideal land parcel to get better recommendations
                    </p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(73,93,56,0.35)', color: '#a8c87a' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Active
                </span>
              </div>

              {/* Interactive Q&A body */}
              <div className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  {/* Land Size */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: '#928d64' }}>
                      <span className="text-sm leading-none">📐</span>
                      Land Size
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {['< 10 Perches', '10–20 Perches', '20–50 Perches', '50+ Perches'].map(size => {
                        const active = selectedLandSize === size
                        return (
                          <button
                            key={size}
                            id={`land-size-${size.replace(/[^a-z0-9]/gi, '').toLowerCase()}`}
                            onClick={() => { changeLandSize(size) }}
                            className="text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all duration-150 active:scale-95 cursor-pointer"
                            style={
                              active
                                ? { backgroundColor: '#345b79', color: '#fff', borderColor: '#345b79' }
                                : { backgroundColor: '#f5f3f0', color: '#928d64', borderColor: '#e6e0d4' }
                            }
                          >
                            {active && '✓ '}{size}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Purpose */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: '#928d64' }}>
                      <span className="text-sm leading-none">🎯</span>
                      Purpose
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {['Build Home', 'Investment', 'Agriculture', 'Commercial Project'].map(p => {
                        const active = selectedPurpose === p
                        return (
                          <button
                            key={p}
                            id={`purpose-${p.replace(/\s+/g, '-').toLowerCase()}`}
                            onClick={() => { changePurpose(p) }}
                            className="text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all duration-150 active:scale-95 cursor-pointer"
                            style={
                              active
                                ? { backgroundColor: '#345b79', color: '#fff', borderColor: '#345b79' }
                                : { backgroundColor: '#f5f3f0', color: '#928d64', borderColor: '#e6e0d4' }
                            }
                          >
                            {active && '✓ '}{p}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Environment */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: '#928d64' }}>
                      <span className="text-sm leading-none">🌿</span>
                      Environment
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {['City / Urban Area', 'Scenic / Hill Country', 'Coastal / Beachfront', 'Countryside / Rural'].map(env => {
                        const active = selectedEnvironment === env
                        return (
                          <button
                            key={env}
                            id={`env-${env.replace(/\s+/g, '-').toLowerCase()}`}
                            onClick={() => { changeEnvironment(env) }}
                            className="text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all duration-150 active:scale-95 cursor-pointer"
                            style={
                              active
                                ? { backgroundColor: '#345b79', color: '#fff', borderColor: '#345b79' }
                                : { backgroundColor: '#f5f3f0', color: '#928d64', borderColor: '#e6e0d4' }
                            }
                          >
                            {active && '✓ '}{env}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Future Plan */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: '#928d64' }}>
                      <span className="text-sm leading-none">📅</span>
                      Development Plan
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {['Build / Develop Immediately', 'Hold for Appreciation', 'Agricultural Cultivation'].map(plan => {
                        const active = selectedPlan === plan
                        return (
                          <button
                            key={plan}
                            id={`plan-${plan.replace(/\s+/g, '-').toLowerCase()}`}
                            onClick={() => { changePlan(plan) }}
                            className="text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all duration-150 active:scale-95 cursor-pointer"
                            style={
                              active
                                ? { backgroundColor: '#345b79', color: '#fff', borderColor: '#345b79' }
                                : { backgroundColor: '#f5f3f0', color: '#928d64', borderColor: '#e6e0d4' }
                            }
                          >
                            {active && '✓ '}{plan}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-[#e6e0d4] flex items-center justify-between flex-wrap gap-3">
                  <div>
                    {hasGenerated ? (
                      <p className="text-[10px] font-semibold flex items-center gap-1" style={{ color: '#495d38' }}>
                        <span>✓</span>
                        AI matched land recommendations to your preferences
                      </p>
                    ) : (
                      <p className="text-[10px]" style={{ color: '#ccb7a3' }}>
                        Select your preferences above to get AI recommendations
                      </p>
                    )}
                  </div>

                  <button
                    id="generate-recs-btn"
                    onClick={handleGenerateRecommendations}
                    disabled={isGenerating}
                    className="flex items-center gap-2 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow cursor-pointer active:scale-95 disabled:opacity-75 disabled:cursor-not-allowed"
                    style={{
                      background: 'linear-gradient(135deg, #be5d3f, #d59b86)',
                    }}
                  >
                    {isGenerating ? (
                      <>
                        {/* Spinner */}
                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Analysing preferences…
                      </>
                    ) : (
                      <>
                        <SparklesIcon />
                        {hasGenerated ? 'Re-run AI Analysis' : 'Generate Smart Recommendations'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Applied Filters Banner — mirrors PropertyListingAI URL-param chips */}
            {(appliedLocation !== 'Any' || appliedType !== 'all' || appliedRoadAccess !== 'Any' || appliedPriceMax < 150) && (
              <div className="bg-white border rounded-2xl px-5 py-3 mb-6 flex flex-wrap items-center gap-2" style={{ borderColor: '#e6e0d4' }}>
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: '#345b79' }}>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                  </svg>
                  AI Filters Applied:
                </span>
                {appliedLocation && appliedLocation !== 'Any' && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(52,91,121,0.10)', color: '#345b79' }}>
                    📍 {appliedLocation}
                    <button onClick={() => { setActiveLocation('Any'); setAppliedLocation('Any'); }} className="ml-0.5 opacity-60 hover:opacity-100 cursor-pointer">
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </span>
                )}
                {appliedType && appliedType !== 'all' && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(52,91,121,0.10)', color: '#345b79' }}>
                    🏞 {appliedType.charAt(0).toUpperCase() + appliedType.slice(1)}
                    <button onClick={() => { setSelectedType('all'); setAppliedType('all'); }} className="ml-0.5 opacity-60 hover:opacity-100 cursor-pointer">
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </span>
                )}
                {appliedRoadAccess && appliedRoadAccess !== 'Any' && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(52,91,121,0.10)', color: '#345b79' }}>
                    🛣 Road: {appliedRoadAccess}
                    <button onClick={() => { setActiveRoadAccess('Any'); setAppliedRoadAccess('Any'); }} className="ml-0.5 opacity-60 hover:opacity-100 cursor-pointer">
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </span>
                )}
                {appliedPriceMax < 150 && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: 'rgba(52,91,121,0.10)', color: '#345b79' }}>
                    💰 Max LKR {appliedPriceMax}M
                    <button onClick={() => { setPriceMax(150); setAppliedPriceMax(150); }} className="ml-0.5 opacity-60 hover:opacity-100 cursor-pointer">
                      <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </span>
                )}
                <span className="ml-auto text-[10px] font-semibold" style={{ color: '#928d64' }}>
                  {browseLands.length} result{browseLands.length !== 1 ? 's' : ''} found
                </span>
              </div>
            )}

            {/* Recommended For You */}
            <div id="recommended-section">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: '#1d1d1d' }}>Recommended For You</h2>
                  <p className="text-sm" style={{ color: '#928d64' }}>Ranked by AI compatibility score based on your preferences</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span style={{ color: '#928d64' }}>Sort:</span>
                  <select
                    className="border border-gray-200 rounded-md py-1 text-sm font-semibold outline-none"
                    style={{ color: '#1d1d1d' }}
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                  >
                    <option>Best Match</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                </div>
              </div>

              {loading && (
                <div className="space-y-6">
                  {[1, 2].map(n => (
                    <div key={n} className="bg-white rounded-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row animate-pulse" style={{ height: '200px' }}>
                      <div className="w-full md:w-2/5 bg-gray-200 flex-shrink-0" />
                      <div className="flex-1 p-6 space-y-4">
                        <div className="h-5 bg-gray-200 rounded w-1/2" />
                        <div className="h-5 bg-gray-200 rounded w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <div className="text-center py-8">
                  <p className="text-sm font-semibold" style={{ color: '#be5d3f' }}>{error}</p>
                </div>
              )}

              {analyzing && (
                <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center space-y-6 shadow-sm mb-6 animate-pulse">
                  <div className="text-4xl animate-bounce">🤖</div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">NexaBuild AI Engine Active</h3>
                    <p className="text-xs text-slate-400 mt-1">Analyzing matching lands across Sri Lanka...</p>
                  </div>
                  <div className="max-w-xs mx-auto space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                      <span>
                        {analysisStep === 1
                          ? '🔍 Searching database...'
                          : analysisStep === 2
                            ? '📐 Matching perches...'
                            : analysisStep === 3
                              ? '🌳 Analyzing environment...'
                              : '📈 Generating compatibility scores...'}
                      </span>
                      <span className="font-extrabold text-[#be5d3f]">{analysisStep * 25}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className="h-full bg-orange-600 rounded-full transition-all duration-300"
                        style={{ width: `${analysisStep * 25}%`, backgroundColor: '#be5d3f' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {!loading && !error && !analyzing && recommendedLands.length === 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center space-y-4 shadow-sm">
                  <div className="text-4xl">🔍</div>
                  <h3 className="font-bold text-lg text-slate-800">No Matching Properties Found</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    No land parcels match all of your selected filters strictly. Try adjusting your Location, Land Type, or Road Access Width.
                  </p>
                  <button
                    onClick={handleClearAll}
                    className="px-5 py-2 text-xs font-bold rounded-lg text-white transition-opacity hover:opacity-90 cursor-pointer"
                    style={{ backgroundColor: '#be5d3f' }}
                  >
                    Reset All Filters
                  </button>
                </div>
              )}

              {!loading && !error && !analyzing && recommendedLands.length > 0 && (
                <div className="space-y-6">
                  {recommendedLands.map((land, idx) => (
                    <article
                      key={land.id}
                      id={`rec-card-${land.id}`}
                      onClick={() => navigate(`/land/detail/${land.id}`, { state: { fromRecommendations: true, matchScore: land.matchScore } })}
                      className="bg-white rounded-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row relative group cursor-pointer"
                      style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
                    >
                      {/* Rank Badge */}
                      <div
                        className="absolute top-4 left-4 z-10 text-[10px] font-bold px-3 py-1 rounded-full uppercase"
                        style={{ backgroundColor: idx === 0 ? '#be5d3f' : '#e6e0d4', color: idx === 0 ? '#fff' : '#be5d3f' }}
                      >
                        #{idx + 1} AI {idx === 0 ? 'Top Pick' : 'Recommended'}
                      </div>

                      {/* Image */}
                      <div className="w-full md:w-2/5 relative h-64 md:h-auto overflow-hidden flex-shrink-0">
                        {land.images[0] ? (
                          <img
                            alt={land.name}
                            className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                            src={land.images[0]}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#e6e0d4' }}>
                            <span className="text-xs" style={{ color: '#928d64' }}>No image</span>
                          </div>
                        )}
                        <div className="absolute bottom-4 left-4">
                          <span className="text-white text-[10px] font-bold px-3 py-1 rounded" style={{ backgroundColor: '#345b79' }}>
                            {land.landType}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6 space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="font-bold text-2xl" style={{ color: '#be5d3f' }}>LKR {land.price.toLocaleString()}</div>
                            <h3 className="text-xl font-bold leading-tight" style={{ color: '#1d1d1d' }}>{land.name}</h3>
                            <div className="flex items-center gap-4 text-xs" style={{ color: '#928d64' }}>
                              <span>📍 {land.location}</span>
                              <span>⬛ {land.perches} perches</span>
                              <span>🛣 {getRoadAccessWidth(land)} Road</span>
                            </div>
                          </div>
                          {/* Match Circle */}
                          <div
                            className="w-16 h-16 rounded-full border-4 flex flex-col items-center justify-center text-center flex-shrink-0 shadow-sm"
                            style={{
                              borderColor: idx === 0 ? '#16a34a' : '#345b79',
                              backgroundColor: '#ffffff'
                            }}
                          >
                            <span className="text-base font-extrabold leading-none" style={{ color: idx === 0 ? '#16a34a' : '#345b79' }}>
                              {land.matchScore}%
                            </span>
                            <span className="text-[8px] font-bold uppercase tracking-wider mt-0.5" style={{ color: '#94a3b8' }}>
                              Match
                            </span>
                          </div>
                        </div>

                        {/* Description snippet */}
                        {land.description && (
                          <div
                            className="rounded-lg p-4 border"
                            style={{ backgroundColor: idx === 0 ? '#fff7f5' : '#f8f8f8', borderColor: idx === 0 ? '#fed7aa' : '#e5e7eb' }}
                          >
                            <div className="flex items-center gap-2 mb-2" style={{ color: idx === 0 ? '#be5d3f' : '#1d1d1d' }}>
                              <span className="text-[10px]">✦</span>
                              <h4 className="text-[10px] font-bold uppercase tracking-wide">About This Land</h4>
                            </div>
                            <p className="text-[10px] leading-relaxed text-gray-600 line-clamp-2">{land.description}</p>
                          </div>
                        )}

                        {/* AI Suggestions Match breakdown */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {[
                            {
                              label: 'Environment',
                              matched: centerFilterApplied ? land.aiDetails.envMatch.matched : false,
                              text: centerFilterApplied ? land.aiDetails.envMatch.text : (land.environment || 'Not specified')
                            },
                            {
                              label: 'Land Size',
                              matched: centerFilterApplied ? land.aiDetails.landSizeMatch.matched : false,
                              text: centerFilterApplied ? land.aiDetails.landSizeMatch.text : getLandSizeCategory(land)
                            },
                            {
                              label: 'Purpose',
                              matched: centerFilterApplied ? land.aiDetails.purposeMatch.matched : false,
                              text: centerFilterApplied ? land.aiDetails.purposeMatch.text : (land.purpose || 'Not specified')
                            },
                            {
                              label: 'Plan',
                              matched: centerFilterApplied ? land.aiDetails.planMatch.matched : false,
                              text: centerFilterApplied ? land.aiDetails.planMatch.text : (land.developmentPlan || 'Not specified')
                            },
                          ].map((item, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-colors"
                              style={
                                item.matched
                                  ? { backgroundColor: '#f0fdf4', color: '#16a34a', borderColor: '#bbf7d0' }
                                  : { backgroundColor: '#f9fafb', color: '#6b7280', borderColor: '#e5e7eb' }
                              }
                            >
                              <span>{item.matched ? '✓' : '○'}</span>
                              <span>{item.label}: {item.text}</span>
                            </span>
                          ))}
                        </div>

                        {/* Why AI Recommended — mirrors PropertyListingAI 'Why Recommended' */}
                        {centerFilterApplied && hasGenerated && land.aiReason && (
                          <div className="rounded-lg px-3 py-2.5 mt-1" style={{ backgroundColor: 'rgba(52,91,121,0.06)', border: '1px solid rgba(52,91,121,0.15)' }}>
                            <p className="text-[10px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1" style={{ color: '#345b79' }}>
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                              </svg>
                              Why AI Recommended
                            </p>
                            <p className="text-[10px] leading-relaxed" style={{ color: '#928d64' }}>{land.aiReason}</p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-2" onClick={e => e.stopPropagation()}>
                          <button
                            id={`view-details-btn-${land.id}`}
                            onClick={() => navigate(`/land/detail/${land.id}`, { state: { fromRecommendations: true, matchScore: land.matchScore } })}
                            className="flex-1 py-3 rounded-lg font-bold text-sm text-white hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: '#345b79' }}
                          >
                            View Details
                          </button>
                          <button
                            id={`bookmark-btn-${land.id}`}
                            onClick={() => {
                              setBookmarked(prev => prev.includes(land.id) ? prev.filter(i => i !== land.id) : [...prev, land.id])
                            }}
                            className="w-12 h-12 border border-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-50 transition-colors"
                            style={{ color: bookmarked.includes(land.id) ? '#be5d3f' : '#928d64' }}
                          >
                            {bookmarked.includes(land.id) ? '🔖' : '📄'}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}

                  {recommendedLands.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-sm font-semibold" style={{ color: '#928d64' }}>No AI-scored land listings available yet.</p>
                    </div>
                  )}

                  {/* Load More */}
                  {visibleRecommendations < scoredLands.length && (
                    <div className="flex justify-center pt-4">
                      <button
                        id="load-more-btn"
                        onClick={() => setVisibleRecommendations(prev => prev + 2)}
                        className="px-8 py-3 rounded-full text-xs font-bold hover:bg-white hover:shadow-md transition-all cursor-pointer"
                        style={{ border: '1px solid #ccb7a3', color: '#928d64' }}
                      >
                        + Load More Properties
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* ── RIGHT SIDEBAR ── */}
          <aside className="col-span-12 lg:col-span-3 space-y-6">
            {/* Platform Activity Overview */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <span style={{ color: '#345b79' }}>📊</span>
                <h3 className="font-bold uppercase text-[11px] tracking-wider" style={{ color: '#1d1d1d' }}>Platform Activity Overview</h3>
              </div>

              {/* Popular Locations */}
              <div className="mb-6">
                <div className="text-xs font-bold uppercase mb-4 flex items-center gap-2" style={{ color: '#928d64' }}>
                  ⭐ Popular Locations
                </div>
                <div className="space-y-4">
                  {locationCounts.map(loc => (
                    <div key={loc.name} className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold" style={{ color: '#1d1d1d' }}>{loc.name}</div>
                        <div className="text-[10px]" style={{ color: '#928d64' }}>Active listings in district</div>
                      </div>
                      <div
                        className="text-[10px] font-bold px-3 py-1 rounded-full text-slate-800"
                        style={{ backgroundColor: '#e6e0d4' }}
                      >
                        {loc.count} listings
                      </div>
                    </div>
                  ))}
                  {locationCounts.length === 0 && (
                    <p className="text-xs text-[#928d64]">No listings data available</p>
                  )}
                </div>
              </div>

              <hr className="border-gray-100 mb-6" />

              {/* Listings by Category */}
              <div>
                <div className="text-xs font-bold uppercase mb-4 flex items-center gap-2" style={{ color: '#928d64' }}>
                  📂 Listings by Category
                </div>
                <div className="space-y-3">
                  {typeCounts.map(tc => (
                    <div key={tc.name} className="flex justify-between items-center text-xs">
                      <span className="text-[#1d1d1d] font-semibold">{tc.name}</span>
                      <span className="font-bold text-[#be5d3f]">{tc.count} parcels</span>
                    </div>
                  ))}
                  {typeCounts.length === 0 && (
                    <p className="text-xs text-[#928d64]">No category data available</p>
                  )}
                </div>
              </div>
            </div>

            {/* Land Size Distribution */}
            <div className="text-white rounded-xl p-6 shadow-sm relative overflow-hidden" style={{ backgroundColor: '#1d1d1d' }}>
              <div
                className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-5"
                style={{ backgroundColor: '#fff' }}
              />
              <div
                className="text-xs font-bold uppercase tracking-widest mb-6 pb-4 flex items-center gap-2"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.10)', color: '#d59b86' }}
              >
                📐 Land Size Distribution
              </div>
              <div className="space-y-4">
                {sizeCatCounts.map(item => {
                  const maxCount = Math.max(...sizeCatCounts.map(c => c.count)) || 1
                  const pct = (item.count / maxCount) * 100
                  return (
                    <div key={item.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>{item.name}</span>
                        <span style={{ color: '#d59b86' }}>{item.count} listings</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-[#be5d3f] rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </aside>
        </div>

        {/* ── Browse All Lands ── */}
        <section className="mt-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: '#1d1d1d' }}>Browse All Lands</h2>
              <p className="text-sm" style={{ color: '#928d64' }}>
                {loading ? 'Loading...' : `Showing ${browseLands.length} land parcels`}
              </p>
            </div>
            <button
              id="sort-browse-btn"
              className="flex items-center gap-2 text-sm font-semibold border border-slate-200 px-4 py-2 rounded-lg bg-white hover:bg-gray-50 transition-colors"
              style={{ color: '#1d1d1d' }}
            >
              ↕ Sort: <span style={{ color: '#1d1d1d', fontWeight: 700 }}>Newest</span> ▾
            </button>
          </div>

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {browseLands.map(land => (
                <article
                  key={land.id}
                  id={`browse-card-${land.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => navigate(`/land/detail/${land.id}`, { state: { fromRecommendations: true, matchScore: land.matchScore } })}
                >
                  <div className="relative h-48 overflow-hidden">
                    {land.images[0] ? (
                      <img
                        alt={land.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        src={land.images[0]}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#e6e0d4' }}>
                        <span className="text-sm" style={{ color: '#928d64' }}>No image</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span
                        className="text-white text-[10px] font-bold px-2 py-1 rounded"
                        style={{ backgroundColor: '#be5d3f' }}
                      >
                        {land.status}
                      </span>
                      <span
                        className="bg-white text-[10px] font-bold px-2 py-1 rounded shadow-sm"
                        style={{ color: '#928d64' }}
                      >
                        {land.landType}
                      </span>
                    </div>
                    {/* Save Button */}
                    <button
                      className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white transition-all"
                      style={{ backgroundColor: 'rgba(255,255,255,0.20)', backdropFilter: 'blur(4px)' }}
                      onClick={e => {
                        e.stopPropagation()
                        setSavedCards(prev => prev.includes(land.id) ? prev.filter(i => i !== land.id) : [...prev, land.id])
                      }}
                      aria-label="Save property"
                    >
                      {savedCards.includes(land.id) ? '♥' : '♡'}
                    </button>
                  </div>
                  <div className="p-5">
                    <div className="font-bold text-lg mb-1" style={{ color: '#be5d3f' }}>
                      LKR {land.price.toLocaleString()}
                    </div>
                    <h3 className="font-bold mb-1" style={{ color: '#1d1d1d' }}>{land.name}</h3>
                    <p className="text-xs mb-4 flex items-center gap-1" style={{ color: '#928d64' }}>
                      {land.location}
                    </p>
                    <div className="flex items-center gap-4 text-xs pt-4 border-t border-gray-100 flex-wrap" style={{ color: '#6b879c' }}>
                      <span className="flex items-center gap-1">⬛ {land.perches} perches</span>
                      {land.sqft && <span className="flex items-center gap-1">⤢ {land.sqft} sqft</span>}
                      <span className="flex items-center gap-1">🛣 {getRoadAccessWidth(land)} Road</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
