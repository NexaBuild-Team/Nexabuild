import React, { useState } from 'react';

// ─── 1. Comprehensive Backend Interfaces ───────────────────────────────────

export interface SavedPropertyItem {
  id: string | number;
  title: string;
  locationDistrict: string;
  address: string;
  neighborhood: string;
  priceAmount: number; // In LKR Millions (e.g., 28.5)
  matchScore: number;
  beds: number;
  baths: number;
  sqft: number;
  imageUrl: string;
  badgeTag?: string; // e.g. 'New Listing', 'For Sale', 'Premium Listing'
  aiInsightText: string;
  isSaved?: boolean;
}

export interface SavedPropertyMetrics {
  totalSavedCount?: number;
  newAdditionsCount?: number;
  priceDropsCount?: number;
  avgValuationMillions?: string | number;
}

export interface SavedPropertyPageData {
  metrics?: SavedPropertyMetrics;
  properties?: SavedPropertyItem[];
}

export interface SavedPropertiesProps {
  data?: SavedPropertyPageData | null;
  isLoading?: boolean;
  error?: string | null;
  onPropertyClick?: (id: string | number) => void;
  onToggleSaveProperty?: (id: string | number) => void;
  onFilterChange?: (filterPill: string) => void;
}

// ─── Mock Fallback Data ─────────────────────────────────────────────────────

const defaultSavedProperties: SavedPropertyItem[] = [
  {
    id: 1,
    title: 'Modern Villa, Colombo 7',
    locationDistrict: 'Colombo',
    address: "Gregory's Road, Colombo 07",
    neighborhood: 'Colombo 7',
    priceAmount: 28.5,
    matchScore: 98,
    beds: 4,
    baths: 3,
    sqft: 3200,
    imageUrl: '/property_card_1.png',
    badgeTag: 'New Listing',
    aiInsightText: 'Matches your preference for high-ceiling architectural layouts and proximity to prime commercial hubs.',
    isSaved: true
  },
  {
    id: 2,
    title: 'Luxury Penthouse, Rajagiriya',
    locationDistrict: 'Colombo',
    address: 'Buthgamuwa Road, Rajagiriya',
    neighborhood: 'Rajagiriya',
    priceAmount: 35.0,
    matchScore: 91,
    beds: 3,
    baths: 3,
    sqft: 2850,
    imageUrl: '/property_card_2.png',
    badgeTag: 'For Sale',
    aiInsightText: 'Optimal sunset alignment and high-value rental potential based on local market trends.',
    isSaved: true
  },
  {
    id: 3,
    title: 'Apartment, Nugegoda',
    locationDistrict: 'Colombo',
    address: 'Nawala Road, Nugegoda',
    neighborhood: 'Nugegoda',
    priceAmount: 18.5,
    matchScore: 85,
    beds: 2,
    baths: 2,
    sqft: 1400,
    imageUrl: '/property_card_3.png',
    aiInsightText: 'Highly rated for school district proximity and recent infrastructural developments in the area.',
    isSaved: true
  },
  {
    id: 4,
    title: 'Beachfront Villa, Mount Lavinia',
    locationDistrict: 'Colombo',
    address: 'Hotel Road, Mount Lavinia',
    neighborhood: 'Mount Lavinia',
    priceAmount: 42.0,
    matchScore: 80,
    beds: 5,
    baths: 4,
    sqft: 4500,
    imageUrl: '/hero_property.png',
    badgeTag: 'Premium Listing',
    aiInsightText: 'Significant appreciation predicted due to upcoming coastal luxury developments.',
    isSaved: true
  },
  {
    id: 5,
    title: 'Architect Villa, Battaramulla',
    locationDistrict: 'Colombo',
    address: 'Koswatta, Battaramulla',
    neighborhood: 'Battaramulla',
    priceAmount: 29.0,
    matchScore: 78,
    beds: 4,
    baths: 3,
    sqft: 3100,
    imageUrl: '/property_card_4.png',
    aiInsightText: 'Matches your preference for minimalist concrete aesthetics and eco-friendly design.',
    isSaved: true
  },
  {
    id: 6,
    title: 'Garden Home, Kottawa',
    locationDistrict: 'Colombo',
    address: 'Pannipitiya Road, Kottawa',
    neighborhood: 'Kottawa',
    priceAmount: 24.5,
    matchScore: 74,
    beds: 4,
    baths: 2,
    sqft: 2200,
    imageUrl: '/property_card_1.png',
    aiInsightText: 'Strong focus on outdoor living space and family-oriented neighborhood scores.',
    isSaved: true
  }
];

// ─── Component Implementation ───────────────────────────────────────────────

export default function SavedProperties({
  data = null,
  isLoading = false,
  error = null,
  onPropertyClick,
  onToggleSaveProperty,
  onFilterChange
}: SavedPropertiesProps) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Recently Saved');
  const [isGridView, setIsGridView] = useState(true);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [savedStateMap, setSavedStateMap] = useState<Record<string | number, boolean>>({});

  const properties = data?.properties !== undefined ? data.properties : defaultSavedProperties;

  const handleToggleBookmark = (id: string | number) => {
    if (onToggleSaveProperty) {
      onToggleSaveProperty(id);
    } else {
      setSavedStateMap(prev => ({ ...prev, [id]: prev[id] !== undefined ? !prev[id] : false }));
    }
  };

  const handleFilterSelect = (pill: string) => {
    setActiveFilter(pill);
    if (onFilterChange) onFilterChange(pill);
  };

  // Filter & Sort Calculations
  const filteredProperties = properties
    .filter(prop => {
      const isSavedCurrently = savedStateMap[prop.id] !== undefined ? savedStateMap[prop.id] : prop.isSaved;
      if (isSavedCurrently === false) return false;

      if (activeFilter === 'All') return true;
      if (activeFilter === 'Colombo') return prop.locationDistrict === 'Colombo' || prop.neighborhood === 'Colombo 7';
      if (activeFilter === 'Nugegoda') return prop.neighborhood === 'Nugegoda';
      if (activeFilter === 'Rajagiriya') return prop.neighborhood === 'Rajagiriya';
      if (activeFilter === 'Battaramulla') return prop.neighborhood === 'Battaramulla';
      if (activeFilter === 'Mount Lavinia') return prop.neighborhood === 'Mount Lavinia';
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'Price: Low to High') return a.priceAmount - b.priceAmount;
      if (sortBy === 'Price: High to Low') return b.priceAmount - a.priceAmount;
      if (sortBy === 'Match Percentage') return b.matchScore - a.matchScore;
      return 0;
    });

  // Dynamic Metrics Calculation
  const activeSavedCount = data?.metrics?.totalSavedCount ?? properties.filter(p => (savedStateMap[p.id] !== undefined ? savedStateMap[p.id] : p.isSaved)).length;
  const newAdditions = data?.metrics?.newAdditionsCount ?? 2;
  const priceDrops = data?.metrics?.priceDropsCount ?? 3;
  const avgValuation = data?.metrics?.avgValuationMillions ?? (
    activeSavedCount > 0 
      ? (properties.reduce((acc, curr) => acc + curr.priceAmount, 0) / activeSavedCount).toFixed(1)
      : '0'
  );

  // ─── 2. Skeleton Loading State ─────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-gray-200 rounded-2xl" />
          ))}
        </div>
        <div className="h-10 bg-gray-200 rounded-xl w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-96 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 sm:gap-8 p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto font-normal text-[#194360]">
      
      {/* Global Error Banner */}
      {error && (
        <div className="w-full bg-red-50 border border-red-200 text-red-700 text-xs p-4 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <img src="/svg/info.svg" alt="Error" className="size-5 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
          <button onClick={() => window.location.reload()} className="text-xs bg-red-100 px-3 py-1.5 rounded-lg hover:bg-red-200 font-bold">
            Retry
          </button>
        </div>
      )}

      {/* Summary Statistics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: 'Total Saved', val: `${activeSavedCount} Properties`, icon: '/svg/heart.svg' },
          { label: 'New Additions', val: `+${newAdditions} This Week`, icon: '/svg/sparks-icon.svg' },
          { label: 'Alerts', val: `${priceDrops} Price Drops`, icon: '/svg/down-trend.svg' },
          { label: 'Avg. Valuation', val: `LKR ${avgValuation}M`, icon: '/svg/price-tag.svg' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
              <p className="text-xs text-[#42474d] font-medium">{stat.label}</p>
              <p className="text-xl sm:text-2xl font-bold text-[#1b1b1b] leading-tight mt-1">{stat.val}</p>
            </div>
            <img alt={stat.label} className="size-9 shrink-0 opacity-85" src={stat.icon} />
          </div>
        ))}
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pt-2">
        <div>
          <nav className="flex items-center gap-2 text-xs font-semibold text-gray-500 tracking-wider uppercase mb-1">
            <a href="/buyer-dashboard" className="hover:text-[#be5d3f] transition-colors">DASHBOARD</a>
            <img alt="" className="size-2 opacity-60" src="/svg/arrowRight.svg" />
            <span className="text-[#194360] font-bold">SAVED PROPERTIES</span>
          </nav>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#194360] tracking-tight">Saved Properties</h1>
            <div className="bg-white border border-[#c2c7ce] px-4 py-1.5 rounded-xl shadow-sm flex items-center gap-2">
              <img alt="Saved ribbon" className="h-3 w-4" src="/svg/bookmark.svg" />
              <span className="text-xs font-bold text-[#194360]">{activeSavedCount} Saved</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[#42474d] mt-1">
            Properties you saved — track prices, compare, and schedule viewings
          </p>
        </div>
      </div>

      {/* Filtering Pills & Sorting Control Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white/40 p-2 rounded-2xl border border-gray-200/50">
        
        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {['All', 'Colombo', 'Nugegoda', 'Rajagiriya', 'Battaramulla', 'Mount Lavinia'].map((pill) => (
            <button
              key={pill}
              onClick={() => handleFilterSelect(pill)}
              className={`px-5 py-2 text-xs font-bold rounded-full transition-all border whitespace-nowrap ${
                activeFilter === pill
                  ? 'bg-[#194360] text-white border-[#194360] shadow-sm'
                  : 'bg-white text-[#42474d] border-[#c2c7ce] hover:bg-gray-50'
              }`}
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Sorting & Layout Grid View Toggle */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          {/* Dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              className="bg-white border border-[#c2c7ce] rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm text-xs font-bold text-[#1b1b1b] hover:bg-gray-50"
            >
              <img alt="Filter" className="size-3.5 opacity-75" src="/svg/filter-icon.svg" />
              <span>Sort: {sortBy}</span>
              <img alt="Chevron" className={`size-3 opacity-60 transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`} src="/svg/dropdown2.svg" />
            </button>

            {sortDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1 text-xs font-semibold">
                {['Recently Saved', 'Price: Low to High', 'Price: High to Low', 'Match Percentage'].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSortBy(option);
                      setSortDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${sortBy === option ? 'text-[#be5d3f] font-bold' : 'text-gray-700'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Grid / List View Buttons */}
          <div className="bg-white border border-[#c2c7ce] rounded-xl p-1 shadow-sm flex items-center">
            <button
              onClick={() => setIsGridView(true)}
              className={`p-1.5 rounded-lg transition-colors ${isGridView ? 'bg-[#345b79]/20 text-[#345b79]' : 'text-gray-400 hover:bg-gray-100'}`}
              aria-label="Grid view"
            >
              <img alt="Grid" className="size-4" src="/svg/grid-view-icon.svg" />
            </button>
            <button
              onClick={() => setIsGridView(false)}
              className={`p-1.5 rounded-lg transition-colors ${!isGridView ? 'bg-[#345b79]/20 text-[#345b79]' : 'text-gray-400 hover:bg-gray-100'}`}
              aria-label="List view"
            >
              <img alt="List" className="size-4" src="/svg/list-view-icon.svg" />
            </button>
          </div>
        </div>

      </div>

      {/* Property Items Grid / List */}
      {filteredProperties.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center w-full shadow-sm text-gray-400 font-semibold text-sm">
          No saved properties match the selected filter.
        </div>
      ) : isGridView ? (
        /* Grid Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
          {filteredProperties.map((prop) => {
            const isBookmarked = savedStateMap[prop.id] !== undefined ? savedStateMap[prop.id] : prop.isSaved;

            return (
              <div 
                key={prop.id}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
              >
                {/* Media Header */}
                <div className="h-[220px] w-full relative overflow-hidden bg-gray-100">
                  <img 
                    alt={prop.title} 
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    src={prop.imageUrl} 
                  />
                  
                  {/* Badges Overlay */}
                  <div className="absolute top-4 left-4 flex gap-2 items-center">
                    <span className="bg-emerald-600 rounded px-2 py-0.5 text-[9px] font-extrabold text-white uppercase shadow-sm">
                      SAVED
                    </span>
                    <span className="bg-[#194360]/90 backdrop-blur-md rounded px-2 py-0.5 text-[9px] font-extrabold text-white uppercase shadow-sm">
                      {prop.matchScore}% MATCH
                    </span>
                  </div>

                  {/* Bookmark Button */}
                  <button 
                    onClick={() => handleToggleBookmark(prop.id)}
                    className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-xl shadow-sm transition-colors"
                  >
                    <img 
                      alt="Bookmark" 
                      className={`size-4 ${isBookmarked ? 'filter drop-shadow' : 'opacity-60'}`} 
                      src="/svg/bookmark.svg" 
                    />
                  </button>

                  {/* Bottom-left Tag */}
                  {prop.badgeTag && (
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-[#194360] px-3 py-1 rounded-full text-[10px] font-bold shadow-sm">
                      {prop.badgeTag}
                    </div>
                  )}
                </div>

                {/* Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="text-base font-bold text-[#1b1b1b] leading-snug">{prop.title}</h3>
                      <div className="text-right shrink-0">
                        <span className="block text-base font-extrabold text-[#194360]">LKR {prop.priceAmount}M</span>
                      </div>
                    </div>

                    <div className="flex gap-1.5 items-start text-xs text-gray-500 py-1">
                      <img alt="" className="size-3.5 mt-0.5 opacity-75 shrink-0" src="/svg/location-pin-icon.svg" />
                      <span className="text-[#42474d]">{prop.address}</span>
                    </div>
                  </div>

                  {/* Specs Subgrid */}
                  <div className="border-t border-b border-gray-100 py-3 flex justify-around text-xs font-semibold text-[#42474d]">
                    <div className="flex items-center gap-1.5">
                      <img alt="" className="size-3.5" src="/svg/bedroom-icon.svg" />
                      <span>{prop.beds} Beds</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <img alt="" className="size-3.5" src="/svg/bathroom-icon.svg" />
                      <span>{prop.baths} Baths</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <img alt="" className="size-3.5" src="/svg/l-ruler-icon.svg" />
                      <span>{prop.sqft} sqft</span>
                    </div>
                  </div>

                  {/* AI INSIGHT Box */}
                  <div className="bg-[#194360]/5 border border-[#194360]/10 rounded-xl p-3 text-xs text-[#42474d]">
                    <div className="flex items-center gap-1.5 text-[#194360] font-bold text-[10px] uppercase tracking-wider mb-1">
                      <img alt="" className="size-3.5" src="/svg/sparks-icon.svg" />
                      <span>AI INSIGHT</span>
                    </div>
                    <p className="italic leading-relaxed">"{prop.aiInsightText}"</p>
                  </div>

                  {/* Details Button */}
                  <button 
                    onClick={() => onPropertyClick && onPropertyClick(prop.id)}
                    className="w-full bg-[#be5d3f] hover:bg-[#be5d3f]/90 text-white font-bold text-xs py-3 rounded-xl shadow-sm transition-colors text-center"
                  >
                    View Details
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* List Layout */
        <div className="flex flex-col gap-4 pb-8">
          {filteredProperties.map((prop) => {
            const isBookmarked = savedStateMap[prop.id] !== undefined ? savedStateMap[prop.id] : prop.isSaved;

            return (
              <div 
                key={prop.id}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row w-full group"
              >
                <div className="w-full md:w-[260px] h-[180px] md:h-auto relative overflow-hidden bg-gray-100 shrink-0">
                  <img alt={prop.title} className="size-full object-cover group-hover:scale-105 transition-transform duration-300" src={prop.imageUrl} />
                  <div className="absolute top-4 left-4 flex gap-2 items-center">
                    <span className="bg-emerald-600 rounded px-2 py-0.5 text-[9px] font-extrabold text-white uppercase shadow-sm">
                      SAVED
                    </span>
                    <span className="bg-[#194360]/90 backdrop-blur-md rounded px-2 py-0.5 text-[9px] font-extrabold text-white uppercase shadow-sm">
                      {prop.matchScore}% MATCH
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-[#1b1b1b]">{prop.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <img alt="" className="size-3.5" src="/svg/location-pin-icon.svg" />
                        <span>{prop.address}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="block text-base font-extrabold text-[#194360]">LKR {prop.priceAmount}M</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold text-[#42474d] py-1 border-t border-b border-gray-100">
                    <span>{prop.beds} Beds</span>
                    <span>•</span>
                    <span>{prop.baths} Baths</span>
                    <span>•</span>
                    <span>{prop.sqft} sqft</span>
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-2">
                    <div className="text-xs italic text-gray-600 max-w-lg line-clamp-1">
                      "{prop.aiInsightText}"
                    </div>

                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleToggleBookmark(prop.id)}
                        className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <img alt="Bookmark" className={`size-4 ${isBookmarked ? 'filter drop-shadow' : 'opacity-60'}`} src="/svg/bookmark.svg" />
                      </button>
                      <button 
                        onClick={() => onPropertyClick && onPropertyClick(prop.id)}
                        className="bg-[#be5d3f] hover:bg-[#be5d3f]/90 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-sm transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
