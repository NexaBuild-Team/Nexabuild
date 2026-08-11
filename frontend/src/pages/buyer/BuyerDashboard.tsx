import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { BuyerHeaderBar } from '../../components/buyer/BuyerHeaderBar';
import { fetchBuyerDashboard, toggleSavePropertyApi, toggleSaveLandApi } from '../../services/buyerApi';
import type { BuyerDashboardData as ApiDashboardData } from '../../services/buyerApi';

// ─── Interfaces ─────────────────────────────────────────────────────────────

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

  const [apiData, setApiData] = useState<ApiDashboardData | null>(null);
  const [fetching, setFetching] = useState(!data);

  const [localSavedProps, setLocalSavedProps] = useState<Record<string | number, boolean>>({});
  const [localSavedLands, setLocalSavedLands] = useState<Record<string | number, boolean>>({});
  const [localSearches, setLocalSearches] = useState<SearchItem[]>([]);

  useEffect(() => {
    if (!data) {
      setFetching(true);
      fetchBuyerDashboard()
        .then((res) => {
          setApiData(res);
          setFetching(false);
        })
        .catch((err) => {
          console.error("Dashboard fetch error:", err);
          setFetching(false);
        });
    }
  }, [data]);

  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (apiData?.user?.firstName || data?.userName || "Valued Member");
  const aiInsightText = apiData?.aiInsightText || data?.aiInsightText || "Today's AI Insight: Property demand in Colombo 5–7 and Homagama land plots expected to rise 8–12% this quarter.";

  // Normalize Property Picks from API or props (NO DUMMY FALLBACKS)
  const rawProps: any[] | undefined = apiData?.properties || data?.propertyPicks;
  const properties: PropertyItem[] = rawProps
    ? rawProps.map((p: any) => ({
        id: p.id,
        title: p.title,
        location: p.location,
        price: typeof p.price === 'number' ? (p.price >= 1000000 ? `LKR ${(p.price / 1000000).toFixed(1)}M` : `LKR ${p.price.toLocaleString()}`) : String(p.price || 'LKR 0'),
        match: p.matchScore ? `${p.matchScore}%` : '95%',
        beds: p.bedrooms || p.beds || 3,
        baths: p.bathrooms || p.baths || 2,
        sqft: p.area ? `${p.area} sqft` : (p.sqft || '2,100 sqft'),
        image: (p.images && p.images.length > 0) ? p.images[0] : (p.image || '/hero_property.png'),
        isAiPick: true,
        isSaved: p.isSaved || false,
      }))
    : [];

  // Normalize Land Picks from API or props (NO DUMMY FALLBACKS)
  const rawLands: any[] | undefined = apiData?.lands || data?.landPicks;
  const lands: LandItem[] = rawLands
    ? rawLands.map((l: any) => ({
        id: l.id,
        title: l.name || l.title || 'Prime Land Plot',
        location: l.location,
        price: typeof l.price === 'number' ? (l.price >= 1000000 ? `LKR ${(l.price / 1000000).toFixed(1)}M` : `LKR ${l.price.toLocaleString()}`) : String(l.price || 'LKR 0'),
        match: l.matchScore ? `${l.matchScore}%` : '92%',
        size: l.perches ? `${l.perches} Perches` : (l.size || '15 Perches'),
        potential: l.landType || l.potential || 'High Growth',
        image: (l.images && l.images.length > 0) ? l.images[0] : (l.image || '/property_card_1.png'),
        isSaved: l.isSaved || false,
      }))
    : [];

  const notifications = apiData?.notifications || [];
  const savedPropertiesPreview = apiData?.savedPropertiesPreview || [];
  const savedLandsPreview = apiData?.savedLandsPreview || [];
  const hotspots = apiData?.hotspots || [];

  const handleTogglePropSave = async (id: string | number) => {
    if (onToggleSaveProperty) {
      onToggleSaveProperty(id);
    } else {
      try {
        await toggleSavePropertyApi(String(id));
        setLocalSavedProps((prev) => ({ ...prev, [id]: !prev[id] }));
      } catch {
        setLocalSavedProps((prev) => ({ ...prev, [id]: !prev[id] }));
      }
    }
  };

  const handleToggleLandSave = async (id: string | number) => {
    if (onToggleSaveLand) {
      onToggleSaveLand(id);
    } else {
      try {
        await toggleSaveLandApi(String(id));
        setLocalSavedLands((prev) => ({ ...prev, [id]: !prev[id] }));
      } catch {
        setLocalSavedLands((prev) => ({ ...prev, [id]: !prev[id] }));
      }
    }
  };

  const handleClearAllSearches = () => {
    if (onClearSearches) {
      onClearSearches();
    } else {
      setLocalSearches([]);
    }
  };

  const recentlyViewed: RecentlyViewedItem[] = data?.recentlyViewed ?? [];

  // ─── Skeleton Loading State ─────────────────────────────────────────────
  if (isLoading || fetching) {
    return (
      <div className="w-full font-normal text-[#111827] flex flex-col xl:flex-row items-start min-h-screen animate-pulse">
        <div className="flex-1 min-w-0 space-y-8 w-full p-4 sm:p-6 lg:p-8 xl:mr-[340px]">
          <div className="h-16 bg-gray-200 rounded-2xl w-full" />
          <div className="h-48 bg-gray-200 rounded-3xl w-full" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl" />
            ))}
          </div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded-lg w-1/4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-72 bg-gray-200 rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
        <aside className="w-full xl:w-[340px] shrink-0 p-6 space-y-6 hidden xl:block">
          <div className="h-40 bg-gray-200 rounded-2xl" />
          <div className="h-40 bg-gray-200 rounded-2xl" />
          <div className="h-40 bg-gray-200 rounded-2xl" />
        </aside>
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
            { label: 'Saved Properties', val: apiData?.kpis?.savedPropertiesCount ?? data?.kpis?.savedPropertiesCount ?? properties.filter(p => p.isSaved).length, change: 'In your wishlist', icon: '/svg/bookmark.svg', bg: 'bg-[#345b79]/10 text-[#345b79]' },
            { label: 'Saved Lands', val: apiData?.kpis?.savedLandsCount ?? data?.kpis?.savedLandsCount ?? lands.filter(l => l.isSaved).length, change: 'In your wishlist', icon: '/svg/location.svg', bg: 'bg-[#be5d3f]/10 text-[#be5d3f]' },
            { label: 'AI Matches', val: apiData?.kpis?.aiMatchesCount ?? data?.kpis?.aiMatchesCount ?? (properties.length + lands.length), change: 'Updated live', icon: '/svg/sparks-icon.svg', bg: 'bg-[#2563eb]/10 text-[#2563eb]' },
            { label: 'Recent Searches', val: apiData?.kpis?.recentSearchesCount ?? data?.kpis?.recentSearchesCount ?? localSearches.length, change: 'Last 30 days', icon: '/svg/clock.svg', bg: 'bg-gray-100 text-gray-500' }
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

                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => onPropertyClick && onPropertyClick(p.id)}
                          className="flex-1 bg-[#345b79] text-white text-xs font-bold py-3 rounded-2xl hover:bg-[#345b79]/90 shadow-sm transition-colors text-center cursor-pointer"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleTogglePropSave(p.id)}
                          className={`p-3 border rounded-2xl flex items-center justify-center transition-colors cursor-pointer ${
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
                    <div className="h-[160px] w-full overflow-hidden relative">
                      <img src={l.image} alt={l.title} className="size-full object-cover group-hover:scale-105 transition-all duration-300" />
                      
                      <span className="absolute top-4 right-4 bg-white/95 backdrop-blur-md border border-[#345b79]/20 text-[#345b79] text-xs font-extrabold px-3 py-1 rounded-full shadow-sm">
                        {l.match} Match
                      </span>
                    </div>

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

                      <div className="flex items-center gap-2.5 pt-2">
                        <button 
                          onClick={() => onLandClick && onLandClick(l.id)}
                          className="flex-1 bg-[#be5d3f] text-white text-xs font-bold py-2.5 rounded-xl hover:bg-[#be5d3f]/90 shadow-sm transition-colors text-center cursor-pointer"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleToggleLandSave(l.id)}
                          className={`p-2.5 border rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
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
                <button onClick={handleClearAllSearches} className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
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
                  No recent search history recorded.
                </div>
              )}
            </div>
          </div>

          {/* Recently Viewed panel */}
          <div className="bg-white rounded-[24px] p-6 border border-[#ccb7a3]/20 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-[#111827]">Recently Viewed</h3>
              <Link to="/dashboard/buyer/recently-viewed" className="text-xs font-bold text-[#345b79] hover:underline">View all</Link>
            </div>
            
            <div className="space-y-3">
              {recentlyViewed.length === 0 ? (
                <div className="py-8 text-center text-gray-400 font-semibold text-xs">
                  No recently viewed items recorded.
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
                    <button className="bg-[#345b79]/10 hover:bg-[#345b79]/20 text-[#345b79] text-xs font-extrabold px-4 py-2 rounded-xl transition-colors cursor-pointer">
                      View
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Right Side Sidebar (Dynamic Real Database Content) */}
      <aside className="w-full xl:w-[340px] xl:fixed xl:top-0 xl:bottom-0 xl:right-0 xl:z-30 shrink-0 bg-white border-l border-gray-200/80 p-6 space-y-8 h-screen overflow-y-auto">
        
        {/* Section 1: Recent Notifications */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#111827]">Recent Notifications</h3>
            <span className="size-5 rounded-full bg-[#345b79] text-white text-[10px] font-extrabold flex items-center justify-center">
              {notifications.length}
            </span>
          </div>

          <div className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-xs font-semibold text-gray-400 py-2">No notifications found.</p>
            ) : (
              notifications.map((n: any) => (
                <div key={n.id} className="flex items-start gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="size-9 rounded-2xl bg-blue-50 text-[#345b79] flex items-center justify-center shrink-0 mt-0.5">
                    <img src="/svg/sparks-icon.svg" className="size-4" alt="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#111827]">{n.title || 'Notification'}</h4>
                    <p className="text-[11px] text-gray-500 font-medium leading-snug mt-0.5">
                      {n.message}
                    </p>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mt-1">
                      {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'JUST NOW'}
                    </span>
                  </div>
                </div>
              ))
            )}
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

          {savedPropertiesPreview.length === 0 ? (
            <p className="text-xs font-semibold text-gray-400 py-2">No saved properties yet.</p>
          ) : (
            savedPropertiesPreview.map((sp: any) => (
              <div key={sp.id} className="flex items-center gap-3 p-3 bg-[#f8f9fa] border border-gray-100 rounded-2xl">
                <img src={sp.images?.[0] || '/hero_property.png'} alt={sp.title} className="size-14 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-[#111827] truncate">{sp.title}</h4>
                  <span className="text-xs font-extrabold text-[#345b79] block mt-0.5">
                    {typeof sp.price === 'number' ? (sp.price >= 1000000 ? `LKR ${(sp.price / 1000000).toFixed(1)}M` : `LKR ${sp.price.toLocaleString()}`) : sp.price}
                  </span>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-gray-500 mt-1">
                    <span className="flex items-center gap-1"><img src="/svg/bedroom-icon.svg" className="size-3.5 opacity-70" alt="" /> {sp.bedrooms || 3}</span>
                    <span className="flex items-center gap-1"><img src="/svg/bathroom-icon.svg" className="size-3.5 opacity-70" alt="" /> {sp.bathrooms || 2}</span>
                  </div>
                </div>
                <button onClick={() => handleTogglePropSave(sp.id)} className="text-[#be5d3f] p-1.5 hover:scale-110 transition-transform cursor-pointer">
                  <img src="/svg/heart.svg" className="size-4" alt="" />
                </button>
              </div>
            ))
          )}
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

          {savedLandsPreview.length === 0 ? (
            <p className="text-xs font-semibold text-gray-400 py-2">No saved lands yet.</p>
          ) : (
            savedLandsPreview.map((sl: any) => (
              <div key={sl.id} className="flex items-center gap-3 p-3 bg-[#f8f9fa] border border-gray-100 rounded-2xl">
                <img src={sl.images?.[0] || '/property_card_1.png'} alt={sl.name} className="size-14 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-[#111827] truncate">{sl.name}</h4>
                  <span className="text-xs font-extrabold text-[#345b79] block mt-0.5">
                    {typeof sl.price === 'number' ? (sl.price >= 1000000 ? `LKR ${(sl.price / 1000000).toFixed(1)}M` : `LKR ${sl.price.toLocaleString()}`) : sl.price}
                  </span>
                  <div className="flex items-center gap-3 text-[10px] font-bold text-gray-500 mt-1">
                    <span className="flex items-center gap-1"><img src="/svg/perch-icon.svg" className="size-3.5 opacity-70" alt="" /> {sl.perches} Perches</span>
                  </div>
                </div>
                <button onClick={() => handleToggleLandSave(sl.id)} className="text-[#be5d3f] p-1.5 hover:scale-110 transition-transform cursor-pointer">
                  <img src="/svg/bookmark.svg" className="size-4" alt="" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Section 4: Investment Hotspots */}
        <div className="space-y-4 pt-2">
          <h3 className="text-base font-extrabold text-[#111827]">Investment Hotspots</h3>

          <div className="space-y-3">
            {hotspots.length === 0 ? (
              <p className="text-xs font-semibold text-gray-400 py-2">No hotspot analytics available.</p>
            ) : (
              hotspots.map((hs: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3.5 bg-[#f8f9fa] border border-gray-100 rounded-2xl">
                  <div className="flex items-center gap-2.5">
                    <span className={`size-3 rounded-full shrink-0 ${hs.category === 'PROPERTY' ? 'bg-[#345b79]' : 'bg-[#be5d3f]'}`} />
                    <span className="text-xs font-bold text-[#111827]">{hs.district}</span>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase ${
                      hs.category === 'PROPERTY' ? 'bg-blue-100 text-[#345b79]' : 'bg-orange-100 text-[#be5d3f]'
                    }`}>
                      {hs.category}
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-[#111827]">{hs.growth}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </aside>
    </div>
  );
}
