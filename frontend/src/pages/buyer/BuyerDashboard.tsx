import React, { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { BuyerHeaderBar } from '../../components/buyer/BuyerHeaderBar';

// ─── 1. Comprehensive Backend Interfaces ───────────────────────────────────

export interface PropertyItem {
  id: string | number;
  title: string;
  location: string;
  price: string;
  match: string;
  beds?: number | string;
  baths?: number | string;
  sqft?: string;
  image: string;
  isAiPick?: boolean;
  isSaved?: boolean;
}

export interface LandItem {
  id: string | number;
  title: string;
  location: string;
  price: string;
  match: string;
  size: string;
  potential?: string;
  image: string;
  isSaved?: boolean;
}

export interface SearchItem {
  id: string | number;
  title: string;
  desc: string;
  time: string;
}

export interface RecentlyViewedItem {
  id: string | number;
  title: string;
  location: string;
  price: string;
  image: string;
}

export interface BuyerDashboardData {
  userName?: string;
  aiInsightText?: string;
  kpis?: {
    savedPropertiesCount?: number;
    savedLandsCount?: number;
    aiMatchesCount?: number;
    recentSearchesCount?: number;
  };
  propertyPicks?: PropertyItem[];
  landPicks?: LandItem[];
  recentSearches?: SearchItem[];
  recentlyViewed?: RecentlyViewedItem[];
}

export interface BuyerDashboardProps {
  data?: BuyerDashboardData | null;
  isLoading?: boolean;
  error?: string | null;
  onPropertyClick?: (id: string | number) => void;
  onLandClick?: (id: string | number) => void;
  onToggleSaveProperty?: (id: string | number) => void;
  onToggleSaveLand?: (id: string | number) => void;
  onClearSearches?: () => void;
}

// ─── Mock Fallback Data ─────────────────────────────────────────────────────

const defaultProperties: PropertyItem[] = [
  {
    id: 1,
    title: 'Modern Villa',
    location: 'Colombo 7, Western Province',
    price: 'LKR 28.5M',
    match: '98%',
    beds: 4,
    baths: 3,
    sqft: '3,200',
    image: '/property_card_1.png',
    isAiPick: true,
    isSaved: true
  },
  {
    id: 2,
    title: 'Contemporary Residence',
    location: 'Nugegoda, Colombo District',
    price: 'LKR 24.5M',
    match: '95%',
    beds: 3,
    baths: 2,
    sqft: '2,400',
    image: '/property_card_2.png',
    isAiPick: true,
    isSaved: false
  },
  {
    id: 3,
    title: 'Luxury Penthouse',
    location: 'Rajagiriya, Western Province',
    price: 'LKR 35M',
    match: '91%',
    beds: 4,
    baths: 4,
    sqft: '4,100',
    image: '/property_card_3.png',
    isAiPick: true,
    isSaved: false
  }
];

const defaultLands: LandItem[] = [
  {
    id: 4,
    title: 'Prime Plot',
    location: 'Nugegoda, Colombo',
    price: 'LKR 8.5M',
    match: '96%',
    size: '20 Perches',
    potential: 'HIGH POTENTIAL',
    image: '/hero_property.png',
    isSaved: true
  },
  {
    id: 5,
    title: 'Residential Land',
    location: 'Homagama, Colombo',
    price: 'LKR 5.2M',
    match: '89%',
    size: '30 Perches',
    potential: 'HIGH POTENTIAL',
    image: '/property_card_4.png',
    isSaved: false
  },
  {
    id: 6,
    title: 'Corner Plot',
    location: 'Kaduwela, Colombo',
    price: 'LKR 12.8M',
    match: '84%',
    size: '40 Perches',
    potential: 'MEDIUM POTENTIAL',
    image: '/property_card_1.png',
    isSaved: false
  }
];

const defaultRecentSearches: SearchItem[] = [
  { id: 1, title: '4BHK Villa Colombo 7', desc: 'LKR 20M—35M • 4+ Beds', time: '2 hr ago' },
  { id: 2, title: 'Land 20+ Perches Homagama', desc: 'LKR 5M—12M • Road Access', time: '1 day ago' }
];

const defaultRecentlyViewed: RecentlyViewedItem[] = [
  { id: 1, title: 'Luxury Villa', location: 'Colombo 7', price: 'LKR 32M', image: '/property_card_1.png' },
  { id: 2, title: 'Land Plot', location: 'Homagama', price: 'LKR 9.2M', image: '/hero_property.png' }
];

// ─── Component Implementation ───────────────────────────────────────────────

export default function BuyerDashboard({
  data = null,
  isLoading = false,
  error = null,
  onPropertyClick,
  onLandClick,
  onToggleSaveProperty,
  onToggleSaveLand,
  onClearSearches
}: BuyerDashboardProps) {
  const { user } = useAuth();
  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}` : (data?.userName || "Valued Member");
  const aiInsightText = data?.aiInsightText || "Today's AI Insight: Property prices in Colombo 5—7 expected to rise 8—12% this quarter.";
  
  const properties = data?.propertyPicks !== undefined ? data.propertyPicks : defaultProperties;
  const lands = data?.landPicks !== undefined ? data.landPicks : defaultLands;
  const searches = data?.recentSearches !== undefined ? data.recentSearches : defaultRecentSearches;
  const recentlyViewed = data?.recentlyViewed !== undefined ? data.recentlyViewed : defaultRecentlyViewed;

  // Local state fallbacks for toggling if external handlers are not supplied
  const [localSavedProps, setLocalSavedProps] = useState<Record<string | number, boolean>>({});
  const [localSavedLands, setLocalSavedLands] = useState<Record<string | number, boolean>>({});
  const [localSearches, setLocalSearches] = useState<SearchItem[]>(searches);

  const handleTogglePropSave = (id: string | number) => {
    if (onToggleSaveProperty) {
      onToggleSaveProperty(id);
    } else {
      setLocalSavedProps(prev => ({ ...prev, [id]: !prev[id] }));
    }
  };

  const handleToggleLandSave = (id: string | number) => {
    if (onToggleSaveLand) {
      onToggleSaveLand(id);
    } else {
      setLocalSavedLands(prev => ({ ...prev, [id]: !prev[id] }));
    }
  };

  const handleClearAllSearches = () => {
    if (onClearSearches) {
      onClearSearches();
    } else {
      setLocalSearches([]);
    }
  };

  // ─── 2. Skeleton Loading State ─────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="p-6 lg:p-10 space-y-8 w-full max-w-[1400px] mx-auto animate-pulse">
        {/* Banner Skeleton */}
        <div className="h-48 bg-gray-200 rounded-3xl w-full" />
        {/* KPI Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded-2xl" />
          ))}
        </div>
        {/* Cards Skeleton */}
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded-lg w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-72 bg-gray-200 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full font-normal text-[#111827] flex flex-col xl:flex-row items-start min-h-screen">
      
      {/* Left Main Content Column (Middle scrolling area) */}
      <div className="flex-1 min-w-0 space-y-8 w-full p-4 sm:p-6 lg:p-8 xl:mr-[340px]">
        
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

        {/* Top Navigation Header Bar */}
        <BuyerHeaderBar />

          {/* A. Hero Banner Section */}
          <div className="bg-[#2a4d69] rounded-[24px] p-6 sm:p-8 lg:p-10 text-white flex flex-col justify-center min-h-[200px] relative overflow-hidden shadow-md">
            <div className="absolute right-[5%] top-1/2 -translate-y-1/2 size-[120px] rounded-full bg-white/5 flex items-center justify-center pointer-events-none">
              <img src="/svg/sparks-icon.svg" alt="" className="size-[48px] opacity-20 filter invert" />
            </div>
            <div className="space-y-2 max-w-[90%] sm:max-w-[80%]">
              <span className="text-xs sm:text-sm text-white/70 font-semibold tracking-wider">Good morning</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-none">
                Welcome back, {userName}
              </h2>
              
              {/* Glassmorphic AI pill */}
              <div className="mt-4 inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold leading-relaxed">
                <img src="/svg/sparks-icon.svg" alt="AI Insight" className="size-4 shrink-0 filter invert" />
                <span>{aiInsightText}</span>
              </div>
            </div>
          </div>

          {/* B. KPI Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { label: 'Saved Properties', val: data?.kpis?.savedPropertiesCount ?? properties.filter(p => p.isSaved).length, change: '+2 this week', icon: '/svg/bookmark.svg', bg: 'bg-[#345b79]/10 text-[#345b79]' },
              { label: 'Saved Lands', val: data?.kpis?.savedLandsCount ?? lands.filter(l => l.isSaved).length, change: '+1 this week', icon: '/svg/location.svg', bg: 'bg-[#be5d3f]/10 text-[#be5d3f]' },
              { label: 'AI Matches', val: data?.kpis?.aiMatchesCount ?? 38, change: 'Updated today', icon: '/svg/sparks-icon.svg', bg: 'bg-[#2563eb]/10 text-[#2563eb]' },
              { label: 'Recent Searches', val: data?.kpis?.recentSearchesCount ?? (localSearches.length || searches.length), change: 'Last 30 days', icon: '/svg/clock.svg', bg: 'bg-gray-100 text-gray-500' }
            ].map((kpi, idx) => (
              <div key={idx} className="bg-white rounded-[20px] p-5 lg:p-6 border border-[#ccb7a3]/20 shadow-sm flex flex-col items-center text-center">
                <div className={`p-3 rounded-2xl flex items-center justify-center size-12 ${kpi.bg} mb-3`}>
                  <img src={kpi.icon} alt="" className="size-5" />
                </div>
                <span className="text-[10px] lg:text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1.5">{kpi.label}</span>
                <h4 className="text-2xl lg:text-3xl font-extrabold text-[#111827] leading-none mb-1.5">{kpi.val}</h4>
                <span className="text-[10px] lg:text-xs font-semibold text-gray-500">{kpi.change}</span>
              </div>
            ))}
          </div>

          {/* C. AI Property Recommendations */}
          <div className="space-y-5">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-xl lg:text-2xl font-extrabold text-[#111827]">AI Property Recommendations</h3>
                <p className="text-xs sm:text-sm text-gray-500 font-semibold">Curated by AI based on your preferences and search history</p>
              </div>
              <Link to="/property-listing" className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#345b79] hover:underline">
                <span>View all</span>
                <img src="/svg/arrowRight.svg" alt="" className="size-3.5" />
              </Link>
            </div>

            {properties.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-gray-400 font-semibold text-sm border border-gray-100">
                No property recommendations available at the moment.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((p) => {
                  const isSaved = localSavedProps[p.id] !== undefined ? localSavedProps[p.id] : p.isSaved;
                  return (
                    <div key={p.id} className="bg-white rounded-[24px] overflow-hidden border border-[#ccb7a3]/20 shadow-sm flex flex-col group hover:shadow-md transition-all">
                      {/* Card Image Cover */}
                      <div className="h-[200px] w-full overflow-hidden relative">
                        <img src={p.image} alt={p.title} className="size-full object-cover group-hover:scale-105 transition-all duration-300" />
                        
                        {/* Tags */}
                        {p.isAiPick && (
                          <span className="absolute top-4 left-4 bg-[#be5d3f] text-white text-[9px] font-extrabold tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                            AI PICK
                          </span>
                        )}
                        <span className="absolute top-4 right-4 bg-white/95 backdrop-blur-md border border-[#345b79]/20 text-[#345b79] text-xs font-extrabold px-3 py-1 rounded-full shadow-sm">
                          {p.match} Match
                        </span>
                      </div>

                      {/* Card Body */}
                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="text-base font-bold text-[#111827] leading-tight">{p.title}</h4>
                            <span className="text-base font-extrabold text-[#345b79]">{p.price}</span>
                          </div>
                          <p className="text-xs text-gray-500 font-semibold flex items-center gap-1">
                            <img src="/svg/location.svg" alt="" className="size-3.5" />
                            {p.location}
                          </p>
                        </div>

                        {/* Specs divider */}
                        <div className="border-t border-b border-gray-100 py-3 flex items-center justify-around text-center text-[10px] font-bold text-gray-700">
                          <div>
                            <span className="block text-xs text-[#111827]">{p.beds || 'N/A'}</span>
                            <span className="text-gray-400">BEDS</span>
                          </div>
                          <div className="w-px h-6 bg-gray-100" />
                          <div>
                            <span className="block text-xs text-[#111827]">{p.baths || 'N/A'}</span>
                            <span className="text-gray-400">BATHS</span>
                          </div>
                          <div className="w-px h-6 bg-gray-100" />
                          <div>
                            <span className="block text-xs text-[#111827]">{p.sqft || 'N/A'}</span>
                            <span className="text-gray-400">SQFT</span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => onPropertyClick && onPropertyClick(p.id)}
                            className="flex-1 bg-[#345b79] text-white text-xs font-bold py-3 rounded-2xl hover:bg-[#345b79]/90 shadow-sm transition-colors text-center"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleTogglePropSave(p.id)}
                            className={`p-3 border rounded-2xl flex items-center justify-center transition-colors ${
                              isSaved
                                ? 'bg-[#be5d3f]/10 border-[#be5d3f]/40 text-[#be5d3f]'
                                : 'border-gray-200 hover:bg-gray-50 text-gray-400'
                            }`}
                          >
                            <img src="/svg/bookmark.svg" alt="Bookmark" className={`size-5 ${isSaved ? 'filter drop-shadow' : 'opacity-60'}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* D. AI Land Recommendations */}
          <div className="space-y-5">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-xl lg:text-2xl font-extrabold text-[#111827]">AI Land Recommendations</h3>
                <p className="text-xs sm:text-sm text-gray-500 font-semibold">High-potential land plots matched to your investment profile</p>
              </div>
              <Link to="/land" className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#345b79] hover:underline">
                <span>View all</span>
                <img src="/svg/arrowRight.svg" alt="" className="size-3.5" />
              </Link>
            </div>

            {lands.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-gray-400 font-semibold text-sm border border-gray-100">
                No land plot recommendations found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lands.map((l) => {
                  const isSaved = localSavedLands[l.id] !== undefined ? localSavedLands[l.id] : l.isSaved;
                  return (
                    <div key={l.id} className="bg-white rounded-[24px] overflow-hidden border border-[#ccb7a3]/20 shadow-sm flex flex-col group hover:shadow-md transition-all">
                      {/* Card Image */}
                      <div className="h-[160px] w-full overflow-hidden relative">
                        <img src={l.image} alt={l.title} className="size-full object-cover group-hover:scale-105 transition-all duration-300" />
                        
                        <span className="absolute top-4 right-4 bg-white/95 backdrop-blur-md border border-[#345b79]/20 text-[#345b79] text-xs font-extrabold px-3 py-1 rounded-full shadow-sm">
                          {l.match} Match
                        </span>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="text-base font-bold text-[#111827] leading-tight">{l.title}</h4>
                            <span className="text-base font-extrabold text-[#345b79]">{l.price}</span>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[11px] text-gray-500 font-semibold flex items-center gap-1.5 uppercase tracking-wider">
                              <span className="size-1.5 rounded-full bg-gray-400" />
                              {l.location}
                            </p>
                            <p className="text-[11px] text-gray-500 font-semibold flex items-center gap-1.5 uppercase tracking-wider">
                              <span className="size-1.5 rounded-full bg-gray-400" />
                              {l.size}
                            </p>
                            {l.potential && (
                              <p className="text-[10px] text-[#be5d3f] font-bold tracking-widest flex items-center gap-1.5 uppercase">
                                <span className="size-1.5 rounded-full bg-[#be5d3f]" />
                                {l.potential}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2.5 pt-2">
                          <button 
                            onClick={() => onLandClick && onLandClick(l.id)}
                            className="flex-1 bg-[#be5d3f] text-white text-xs font-bold py-2.5 rounded-xl hover:bg-[#be5d3f]/90 shadow-sm transition-colors text-center"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleToggleLandSave(l.id)}
                            className={`p-2.5 border rounded-xl flex items-center justify-center transition-colors ${
                              isSaved
                                ? 'bg-[#be5d3f]/10 border-[#be5d3f]/40 text-[#be5d3f]'
                                : 'border-gray-200 hover:bg-gray-50 text-gray-400'
                            }`}
                          >
                            <img src="/svg/bookmark.svg" alt="Bookmark" className={`size-4 ${isSaved ? 'filter drop-shadow' : 'opacity-60'}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* E. Recent Searches & Recently Viewed */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Searches panel */}
            <div className="bg-white rounded-[24px] p-6 border border-[#ccb7a3]/20 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-[#111827]">Recent Searches</h3>
                {localSearches.length > 0 && (
                  <button onClick={handleClearAllSearches} className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors">
                    Clear all
                  </button>
                )}
              </div>
              
              <div className="space-y-3">
                {localSearches.length > 0 ? (
                  localSearches.map((s) => (
                    <div key={s.id} className="flex items-center justify-between p-4 bg-[#f8f9fa] border border-gray-100 rounded-2xl">
                      <div className="flex items-center gap-3.5">
                        <div className="bg-[#ccb7a3]/20 p-2.5 rounded-xl flex items-center justify-center">
                          <img src="/svg/search.svg" alt="Search" className="size-4" />
                        </div>
                        <div className="leading-tight">
                          <h4 className="text-sm font-bold text-[#111827]">{s.title}</h4>
                          <span className="text-xs text-gray-500 font-semibold">{s.desc}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold tracking-tight text-right">{s.time}</span>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-gray-400 font-semibold text-xs">
                    No recent search history available.
                  </div>
                )}
              </div>
            </div>

            {/* Recently Viewed panel */}
            <div className="bg-white rounded-[24px] p-6 border border-[#ccb7a3]/20 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-[#111827]">Recently Viewed</h3>
                <a href="#" className="text-xs font-bold text-[#345b79] hover:underline">View all</a>
              </div>
              
              <div className="space-y-3">
                {recentlyViewed.length === 0 ? (
                  <div className="py-8 text-center text-gray-400 font-semibold text-xs">
                    No recently viewed items.
                  </div>
                ) : (
                  recentlyViewed.map((view) => (
                    <div key={view.id} className="flex items-center justify-between p-3 bg-[#f8f9fa] border border-gray-100 rounded-2xl">
                      <div className="flex items-center gap-3.5">
                        <img src={view.image} alt={view.title} className="size-12 rounded-xl object-cover shrink-0" />
                        <div className="leading-tight">
                          <h4 className="text-sm font-bold text-[#111827]">{view.title}, {view.location}</h4>
                          <span className="text-xs text-[#345b79] font-extrabold">{view.price}</span>
                        </div>
                      </div>
                      <button className="bg-[#345b79]/10 hover:bg-[#345b79]/20 text-[#345b79] text-xs font-extrabold px-4 py-2 rounded-xl transition-colors">
                        View
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right Side Sidebar (Fixed Panel Pinned to Right Viewport) */}
        <aside className="w-full xl:w-[340px] xl:fixed xl:top-0 xl:bottom-0 xl:right-0 xl:z-30 shrink-0 bg-white border-l border-gray-200/80 p-6 space-y-8 h-screen overflow-y-auto">
          
          {/* Section 1: Recent Notifications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#111827]">Recent Notifications</h3>
              <button className="text-[11px] font-extrabold text-[#345b79] uppercase tracking-wider hover:underline">
                VIEW ALL
              </button>
            </div>

            <div className="space-y-4">
              {/* Item 1 */}
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-2xl bg-blue-50 text-[#345b79] flex items-center justify-center shrink-0 mt-0.5">
                  <img src="/svg/sparks-icon.svg" className="size-4" alt="" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-[#111827]">New AI Match Found</h4>
                  <p className="text-[11px] text-gray-500 font-medium leading-snug mt-0.5">
                    3 new properties match your 98% criteria in Colombo 5.
                  </p>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mt-1.5">
                    5 MIN AGO
                  </span>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-2xl bg-orange-50 text-[#be5d3f] flex items-center justify-center shrink-0 mt-0.5">
                  <img src="/svg/down-trend.svg" className="size-4" alt="" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-[#111827]">Price Drop Alert</h4>
                  <p className="text-[11px] text-gray-500 font-medium leading-snug mt-0.5">
                    Property in Nugegoda dropped by LKR 1.2M.
                  </p>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mt-1.5">
                    1 HR AGO
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Saved Properties */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/svg/heart.svg" className="size-4" alt="" />
                <h3 className="text-base font-extrabold text-[#111827]">Saved Properties</h3>
              </div>
              <Link to="/dashboard/buyer/saved-properties" className="text-[11px] font-extrabold text-[#345b79] uppercase tracking-wider hover:underline">
                VIEW ALL
              </Link>
            </div>

            <div className="flex items-center gap-3 p-3 bg-[#f8f9fa] border border-gray-100 rounded-2xl">
              <img src="/hero_property.png" alt="Villa, Colombo 7" className="size-14 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-[#111827] truncate">Villa, Colombo 7</h4>
                <span className="text-xs font-extrabold text-[#345b79] block mt-0.5">LKR 28.5M</span>
                <div className="flex items-center gap-3 text-[10px] font-bold text-gray-500 mt-1">
                  <span className="flex items-center gap-1"><img src="/svg/bedroom-icon.svg" className="size-3.5 opacity-70" alt="" /> 4</span>
                  <span className="flex items-center gap-1"><img src="/svg/bathroom-icon.svg" className="size-3.5 opacity-70" alt="" /> 3</span>
                </div>
              </div>
              <button className="text-[#be5d3f] p-1.5 hover:scale-110 transition-transform">
                <img src="/svg/heart.svg" className="size-4" alt="" />
              </button>
            </div>
          </div>

          {/* Section 3: Saved Lands */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/svg/land-plot-icon.svg" className="size-4" alt="" />
                <h3 className="text-base font-extrabold text-[#111827]">Saved Lands</h3>
              </div>
              <Link to="/dashboard/buyer/saved-lands" className="text-[11px] font-extrabold text-[#345b79] uppercase tracking-wider hover:underline">
                VIEW ALL
              </Link>
            </div>

            <div className="flex items-center gap-3 p-3 bg-[#f8f9fa] border border-gray-100 rounded-2xl">
              <img src="/property_card_1.png" alt="Plot, Nugegoda" className="size-14 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-[#111827] truncate">Plot, Nugegoda</h4>
                <span className="text-xs font-extrabold text-[#345b79] block mt-0.5">LKR 8.5M</span>
                <div className="flex items-center gap-3 text-[10px] font-bold text-gray-500 mt-1">
                  <span className="flex items-center gap-1"><img src="/svg/perch-icon.svg" className="size-3.5 opacity-70" alt="" /> 20 Perches</span>
                  <span className="flex items-center gap-1"><img src="/svg/location-pin-icon.svg" className="size-3.5 opacity-70" alt="" /> Colombo</span>
                </div>
              </div>
              <button className="text-[#be5d3f] p-1.5 hover:scale-110 transition-transform">
                <img src="/svg/bookmark.svg" className="size-4" alt="" />
              </button>
            </div>
          </div>

          {/* Section 4: Investment Hotspots */}
          <div className="space-y-4 pt-2">
            <h3 className="text-base font-extrabold text-[#111827]">Investment Hotspots</h3>

            <div className="space-y-3">
              {/* Hotspot 1 */}
              <div className="flex items-center justify-between p-3.5 bg-[#f8f9fa] border border-gray-100 rounded-2xl">
                <div className="flex items-center gap-2.5">
                  <span className="size-3 rounded-full bg-[#345b79] shrink-0" />
                  <span className="text-xs font-bold text-[#111827]">Colombo 7</span>
                  <span className="text-[9px] font-extrabold bg-blue-100 text-[#345b79] px-2 py-0.5 rounded-md uppercase">
                    PROPERTY
                  </span>
                </div>
                <span className="text-xs font-extrabold text-[#111827]">+12%</span>
              </div>

              {/* Hotspot 2 */}
              <div className="flex items-center justify-between p-3.5 bg-[#f8f9fa] border border-gray-100 rounded-2xl">
                <div className="flex items-center gap-2.5">
                  <span className="size-3 rounded-full bg-[#be5d3f] shrink-0" />
                  <span className="text-xs font-bold text-[#111827]">Homagama</span>
                  <span className="text-[9px] font-extrabold bg-orange-100 text-[#be5d3f] px-2 py-0.5 rounded-md uppercase">
                    LAND
                  </span>
                </div>
                <span className="text-xs font-extrabold text-[#111827]">+18%</span>
              </div>

              {/* Hotspot 3 */}
              <div className="flex items-center justify-between p-3.5 bg-[#f8f9fa] border border-gray-100 rounded-2xl">
                <div className="flex items-center gap-2.5">
                  <span className="size-3 rounded-full bg-[#73511d] shrink-0" />
                  <span className="text-xs font-bold text-[#111827]">Nugegoda</span>
                  <span className="text-[9px] font-extrabold bg-[#73511d]/10 text-[#73511d] px-2 py-0.5 rounded-md uppercase">
                    PROPERTY
                  </span>
                </div>
                <span className="text-xs font-extrabold text-[#111827]">+8%</span>
              </div>
            </div>
          </div>

        </aside>
    </div>
  );
}
