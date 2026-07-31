import React, { useState } from 'react';

// ─── 1. Comprehensive Backend Interfaces ───────────────────────────────────

export interface SavedLandPlotItem {
  id: string | number;
  title: string;
  locationDistrict: string;
  subLocation?: string;
  sizePerches: number;
  priceAmount: number; // In LKR Millions (e.g., 8.5)
  pricePerPerchText: string;
  matchScore: number;
  potentialLevel: 'HIGH POTENTIAL' | 'MEDIUM POTENTIAL' | 'LOW POTENTIAL';
  tags: string[];
  imageUrl: string;
  isSaved?: boolean;
}

export interface SavedLandMetrics {
  savedCount?: number;
  addedThisWeekCount?: number;
  totalPerches?: number;
  avgPriceMillions?: string | number;
}

export interface SavedLandPageData {
  metrics?: SavedLandMetrics;
  landPlots?: SavedLandPlotItem[];
}

export interface SavedLandProps {
  data?: SavedLandPageData | null;
  isLoading?: boolean;
  error?: string | null;
  onLandClick?: (id: string | number) => void;
  onToggleSaveLand?: (id: string | number) => void;
  onFilterChange?: (filterPill: string) => void;
}

// ─── Helper Icon Selector ───────────────────────────────────────────────────

const getRoadTagIcon = (tag: string) => {
  const normalized = tag.toLowerCase();
  if (normalized.includes('main road')) return '/svg/main-road-icon.svg';
  if (normalized.includes('side road')) return '/svg/side-road-icon.svg';
  if (normalized.includes('beach road') || normalized.includes('beachfront')) return '/svg/beach-road-icon.svg';
  if (normalized.includes('corner') || normalized.includes('dual access')) return '/svg/corner-dual-access-icon.svg';
  return '/svg/side-road-icon.svg';
};

// ─── Mock Fallback Data ─────────────────────────────────────────────────────

const defaultSavedLands: SavedLandPlotItem[] = [
  {
    id: 1,
    title: 'Prime Plot, Nugegoda',
    locationDistrict: 'Colombo',
    subLocation: 'Nugegoda',
    sizePerches: 20,
    priceAmount: 8.5,
    pricePerPerchText: 'LKR 425K/perch',
    matchScore: 96,
    potentialLevel: 'HIGH POTENTIAL',
    tags: ['Main Road', 'Residential'],
    imageUrl: '/hero_property.png',
    isSaved: true
  },
  {
    id: 2,
    title: 'Residential Land, Homagama',
    locationDistrict: 'Colombo',
    subLocation: 'Homagama',
    sizePerches: 30,
    priceAmount: 5.2,
    pricePerPerchText: 'LKR 173K/perch',
    matchScore: 89,
    potentialLevel: 'HIGH POTENTIAL',
    tags: ['Side Road', 'Residential'],
    imageUrl: '/property_card_4.png',
    isSaved: true
  },
  {
    id: 3,
    title: 'Corner Plot, Kaduwela',
    locationDistrict: 'Colombo',
    subLocation: 'Kaduwela',
    sizePerches: 40,
    priceAmount: 12.8,
    pricePerPerchText: 'LKR 320K/perch',
    matchScore: 84,
    potentialLevel: 'MEDIUM POTENTIAL',
    tags: ['Corner Dual Access', 'Mixed Use'],
    imageUrl: '/property_card_1.png',
    isSaved: true
  },
  {
    id: 4,
    title: 'Beachfront Land, Moratuwa',
    locationDistrict: 'Colombo',
    subLocation: 'Moratuwa',
    sizePerches: 35,
    priceAmount: 22.0,
    pricePerPerchText: 'LKR 629K/perch',
    matchScore: 81,
    potentialLevel: 'HIGH POTENTIAL',
    tags: ['Beach Road', 'Mixed Use'],
    imageUrl: '/property_card_2.png',
    isSaved: true
  },
  {
    id: 5,
    title: 'Flat Land, Malabe',
    locationDistrict: 'Colombo',
    subLocation: 'Malabe',
    sizePerches: 25,
    priceAmount: 9.2,
    pricePerPerchText: 'LKR 368K/perch',
    matchScore: 75,
    potentialLevel: 'HIGH POTENTIAL',
    tags: ['Main Road', 'Residential'],
    imageUrl: '/property_card_3.png',
    isSaved: true
  },
  {
    id: 6,
    title: 'Urban Plot, Kelaniya',
    locationDistrict: 'Gampaha',
    subLocation: 'Kelaniya',
    sizePerches: 22,
    priceAmount: 7.5,
    pricePerPerchText: 'LKR 341K/perch',
    matchScore: 70,
    potentialLevel: 'MEDIUM POTENTIAL',
    tags: ['Main Road', 'Residential'],
    imageUrl: '/property_card_4.png',
    isSaved: true
  }
];

// ─── Component Implementation ───────────────────────────────────────────────

export default function SavedLand({
  data = null,
  isLoading = false,
  error = null,
  onLandClick,
  onToggleSaveLand,
  onFilterChange
}: SavedLandProps) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Recently Saved');
  const [isGridView, setIsGridView] = useState(true);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [savedStateMap, setSavedStateMap] = useState<Record<string | number, boolean>>({});

  const landPlots = data?.landPlots !== undefined ? data.landPlots : defaultSavedLands;

  const handleToggleBookmark = (id: string | number) => {
    if (onToggleSaveLand) {
      onToggleSaveLand(id);
    } else {
      setSavedStateMap(prev => ({ ...prev, [id]: prev[id] !== undefined ? !prev[id] : false }));
    }
  };

  const handleFilterSelect = (pill: string) => {
    setActiveFilter(pill);
    if (onFilterChange) onFilterChange(pill);
  };

  // Filter & Sort Calculations
  const filteredLands = landPlots
    .filter(land => {
      const isSavedCurrently = savedStateMap[land.id] !== undefined ? savedStateMap[land.id] : land.isSaved;
      if (isSavedCurrently === false) return false;

      if (activeFilter === 'All') return true;
      if (activeFilter === 'Colombo') return land.locationDistrict === 'Colombo';
      if (activeFilter === 'Gampaha') return land.locationDistrict === 'Gampaha';
      if (activeFilter === 'High Potential') return land.potentialLevel === 'HIGH POTENTIAL';
      if (activeFilter === 'Medium Potential') return land.potentialLevel === 'MEDIUM POTENTIAL';
      if (activeFilter === 'Residential') return land.tags.includes('Residential');
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'Price: Low to High') return a.priceAmount - b.priceAmount;
      if (sortBy === 'Price: High to Low') return b.priceAmount - a.priceAmount;
      if (sortBy === 'Match Percentage') return b.matchScore - a.matchScore;
      return 0;
    });

  // Dynamic Metrics Calculation
  const activeSavedCount = data?.metrics?.savedCount ?? landPlots.filter(l => (savedStateMap[l.id] !== undefined ? savedStateMap[l.id] : l.isSaved)).length;
  const addedThisWeek = data?.metrics?.addedThisWeekCount ?? 1;
  const totalPerches = data?.metrics?.totalPerches ?? landPlots.reduce((acc, curr) => acc + curr.sizePerches, 0);
  const avgPrice = data?.metrics?.avgPriceMillions ?? (
    activeSavedCount > 0 
      ? (landPlots.reduce((acc, curr) => acc + curr.priceAmount, 0) / activeSavedCount).toFixed(1)
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
    <div className="w-full flex flex-col gap-6 sm:gap-8 p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto font-normal text-[#111827]">
      
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
          { label: 'Saved Lands', val: activeSavedCount, icon: '/svg/bookmark.svg' },
          { label: 'Added This Week', val: `+${addedThisWeek}`, icon: '/svg/sparks-icon.svg' },
          { label: 'Total Perches', val: totalPerches, icon: '/svg/perch-icon.svg' },
          { label: 'Avg. Price', val: `LKR ${avgPrice}M`, icon: '/svg/home.svg' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-gray-50 p-3.5 rounded-xl flex items-center justify-center shrink-0">
              <img alt={stat.label} className="size-6 opacity-80" src={stat.icon} />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-[#111827] leading-none mb-1">{stat.val}</p>
              <p className="text-xs text-[#6b7280] font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pt-2">
        <div>
          <nav className="flex items-center gap-2 text-xs font-semibold text-[#6b7280] tracking-wider uppercase mb-1">
            <a href="/buyer-dashboard" className="hover:text-[#be5d3f] transition-colors">DASHBOARD</a>
            <span>/</span>
            <span className="text-[#111827] font-bold">SAVED LANDS</span>
          </nav>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">Saved Lands</h1>
            <div className="bg-[#be5d3f]/10 px-3.5 py-1 rounded-full flex items-center gap-2">
              <img alt="Bookmark Tag" className="size-4" src="/svg/bookmark.svg" />
              <span className="text-xs font-bold text-[#be5d3f]">{activeSavedCount} Saved</span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-[#6b7280] mt-1">
            Land plots you bookmarked — compare, track, and plan your investment
          </p>
        </div>
      </div>

      {/* Filtering Pills & Sorting Control Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white/40 p-2 rounded-2xl border border-gray-200/50">
        
        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {['All', 'Colombo', 'Gampaha', 'High Potential', 'Medium Potential', 'Residential'].map((pill) => (
            <button
              key={pill}
              onClick={() => handleFilterSelect(pill)}
              className={`px-4 py-2 text-xs font-bold rounded-full transition-all border whitespace-nowrap ${
                activeFilter === pill
                  ? 'bg-[#345b79] text-white border-[#345b79] shadow-sm'
                  : 'bg-white text-[#1f2937] border-gray-200 hover:bg-gray-50'
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
              className="bg-white border border-gray-200 rounded-xl px-4 py-2 flex items-center gap-2 shadow-sm text-xs font-bold text-[#1f2937] hover:bg-gray-50"
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
          <div className="bg-white border border-gray-200 rounded-xl p-1 shadow-sm flex items-center">
            <button
              onClick={() => setIsGridView(true)}
              className={`p-1.5 rounded-lg transition-colors ${isGridView ? 'bg-[#345b79] text-white' : 'text-gray-400 hover:bg-gray-100'}`}
              aria-label="Grid view"
            >
              <img alt="Grid" className={`size-4 ${isGridView ? 'filter brightness-200' : ''}`} src="/svg/grid-view-icon.svg" />
            </button>
            <button
              onClick={() => setIsGridView(false)}
              className={`p-1.5 rounded-lg transition-colors ${!isGridView ? 'bg-[#345b79] text-white' : 'text-gray-400 hover:bg-gray-100'}`}
              aria-label="List view"
            >
              <img alt="List" className={`size-4 ${!isGridView ? 'filter brightness-200' : ''}`} src="/svg/list-view-icon.svg" />
            </button>
          </div>
        </div>

      </div>

      {/* Land Plot Items Grid / List */}
      {filteredLands.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center w-full shadow-sm text-gray-400 font-semibold text-sm">
          No saved land plots match the selected filter.
        </div>
      ) : isGridView ? (
        /* Grid Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
          {filteredLands.map((land) => {
            const isBookmarked = savedStateMap[land.id] !== undefined ? savedStateMap[land.id] : land.isSaved;

            return (
              <div 
                key={land.id}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
              >
                {/* Media Container */}
                <div className="h-[220px] w-full relative overflow-hidden bg-gray-100">
                  <img 
                    alt={land.title} 
                    className="size-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    src={land.imageUrl} 
                  />
                  
                  {/* Match Overlay Badge */}
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1.5 text-white text-[10px] font-extrabold shadow-sm">
                    <span className={`rounded-full size-2 ${land.matchScore >= 90 ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    <span>{land.matchScore}% Match</span>
                  </div>

                  {/* Potential Tag */}
                  <div className={`absolute bottom-4 left-4 ${
                    land.potentialLevel === 'HIGH POTENTIAL' ? 'bg-[#16a34a]' : 'bg-amber-600'
                  } text-white px-3 py-1 rounded-lg text-[9px] font-extrabold tracking-wider uppercase shadow-md`}>
                    {land.potentialLevel}
                  </div>

                  {/* Bookmark Button */}
                  <button 
                    onClick={() => handleToggleBookmark(land.id)}
                    className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-xl shadow-sm transition-colors"
                  >
                    <img 
                      alt="Bookmark" 
                      className={`size-4 ${isBookmarked ? 'filter drop-shadow' : 'opacity-60'}`} 
                      src="/svg/bookmark.svg" 
                    />
                  </button>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="text-base font-bold text-[#111827] leading-snug">{land.title}</h3>
                      <div className="text-right shrink-0">
                        <span className="block text-base font-extrabold text-[#be5d3f]">LKR {land.priceAmount}M</span>
                        <span className="block text-[10px] text-[#9ca3af]">{land.pricePerPerchText}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-[#6b7280] py-2 border-t border-b border-gray-100">
                      <div className="flex items-center gap-1.5">
                        <img alt="" className="size-3.5 opacity-75" src="/svg/location-pin-icon.svg" />
                        <span>{land.locationDistrict}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <img alt="" className="size-3.5 opacity-75" src="/svg/perch-icon.svg" />
                        <span>{land.sizePerches} Perches</span>
                      </div>
                    </div>
                  </div>

                  {/* Tag Badges */}
                  <div className="flex gap-2 flex-wrap items-center">
                    {land.tags.map((tag, idx) => (
                      <span 
                        key={idx}
                        className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-gray-100 text-gray-600 flex items-center gap-1"
                      >
                        {tag.toLowerCase().includes('road') && <img alt="" className="size-3 opacity-75" src={getRoadTagIcon(tag)} />}
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Details Button */}
                  <button 
                    onClick={() => onLandClick && onLandClick(land.id)}
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
          {filteredLands.map((land) => {
            const isBookmarked = savedStateMap[land.id] !== undefined ? savedStateMap[land.id] : land.isSaved;

            return (
              <div 
                key={land.id}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row w-full group"
              >
                <div className="w-full md:w-[260px] h-[180px] md:h-auto relative overflow-hidden bg-gray-100 shrink-0">
                  <img alt={land.title} className="size-full object-cover group-hover:scale-105 transition-transform duration-300" src={land.imageUrl} />
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1.5 text-white text-[10px] font-extrabold shadow-sm">
                    <span className={`rounded-full size-2 ${land.matchScore >= 90 ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    <span>{land.matchScore}% Match</span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-[#111827]">{land.title}</h3>
                      <div className="flex items-center gap-4 text-xs text-[#6b7280] mt-1">
                        <span className="flex items-center gap-1"><img alt="" className="size-3.5" src="/svg/location-pin-icon.svg" />{land.locationDistrict}</span>
                        <span className="flex items-center gap-1"><img alt="" className="size-3.5" src="/svg/perch-icon.svg" />{land.sizePerches} Perches</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="block text-base font-extrabold text-[#be5d3f]">LKR {land.priceAmount}M</span>
                      <span className="block text-[10px] text-[#9ca3af]">{land.pricePerPerchText}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-2">
                    <div className="flex gap-2 flex-wrap items-center">
                      {land.tags.map((tag, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-gray-100 text-gray-600">{tag}</span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleToggleBookmark(land.id)}
                        className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <img alt="Bookmark" className={`size-4 ${isBookmarked ? 'filter drop-shadow' : 'opacity-60'}`} src="/svg/bookmark.svg" />
                      </button>
                      <button 
                        onClick={() => onLandClick && onLandClick(land.id)}
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
