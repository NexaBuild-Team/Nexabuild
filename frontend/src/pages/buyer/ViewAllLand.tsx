import { useState, useEffect } from 'react';
import { getAllLands } from '../../services/landApi';
import { toggleSaveLandApi } from '../../services/buyerApi';

// ─── 1. Comprehensive Backend Interfaces ───────────────────────────────────

export interface DetailedLandPlot {
  id: string | number;
  title: string;
  locationDistrict: string;
  subLocation: string;
  priceAmount: string;
  pricePerPerch: string;
  matchScore: string;
  potentialLevel: 'HIGH POTENTIAL' | 'MEDIUM POTENTIAL' | 'LOW POTENTIAL';
  sizePerches: string;
  roadAccess: string;
  zoningType: 'RESIDENTIAL' | 'MIXED USE' | 'COMMERCIAL' | 'AGRICULTURAL';
  imageUrl: string;
  isSaved?: boolean;
}

export interface ViewAllLandHeroStats {
  totalMatchesCount?: number;
  topMatchPercentage?: string;
  newTodayCount?: number;
}

export interface ViewAllLandPageData {
  heroStats?: ViewAllLandHeroStats;
  landPlots?: DetailedLandPlot[];
  districts?: string[];
}

export interface ViewAllLandProps {
  data?: ViewAllLandPageData | null;
  isLoading?: boolean;
  error?: string | null;
  onLandClick?: (id: string | number) => void;
  onToggleSaveLand?: (id: string | number) => void;
  onFilterDistrictChange?: (district: string) => void;
  onLoadMore?: () => void;
}

const defaultDistricts = ['All', 'Colombo', 'Gampaha', 'Kandy', 'Galle', 'Kalutara'];

// ─── Component Implementation ───────────────────────────────────────────────

export default function ViewAllLand({
  data = null,
  isLoading = false,
  error = null,
  onLandClick,
  onToggleSaveLand,
  onFilterDistrictChange,
  onLoadMore
}: ViewAllLandProps) {
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [sortBy, setSortBy] = useState('Best Match');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [savedStatusMap, setSavedStatusMap] = useState<Record<string | number, boolean>>({});

  const [apiLands, setApiLands] = useState<DetailedLandPlot[] | null>(null);
  const [fetching, setFetching] = useState(!data);

  useEffect(() => {
    if (!data) {
      setFetching(true);
      getAllLands()
        .then((res) => {
          const mapped: DetailedLandPlot[] = res.map((l: any) => ({
            id: l.id,
            title: l.name || l.title || 'Prime Land Plot',
            locationDistrict: l.location || 'Colombo',
            subLocation: l.location || 'Homagama',
            priceAmount: typeof l.price === 'number' ? (l.price >= 1000000 ? `LKR ${(l.price / 1000000).toFixed(1)}M` : `LKR ${l.price.toLocaleString()}`) : String(l.price || 'LKR 0'),
            pricePerPerch: `LKR ${((l.price || 0) / (l.perches || 1) / 100000).toFixed(2)} Lakhs/perch`,
            matchScore: `${l.matchScore || 92}%`,
            potentialLevel: 'HIGH POTENTIAL',
            sizePerches: `${l.perches || 15} Perches`,
            roadAccess: l.landType ? `${l.landType} Road` : 'Main Road',
            zoningType: 'RESIDENTIAL',
            imageUrl: (l.images && l.images.length > 0) ? l.images[0] : '/property_card_1.png',
            isSaved: l.isSaved || false,
          }));
          setApiLands(mapped);
          setFetching(false);
        })
        .catch((err) => {
          console.error('Failed to fetch lands:', err);
          setFetching(false);
        });
    }
  }, [data]);

  const landPlots = apiLands !== null ? apiLands : (data?.landPlots !== undefined ? data.landPlots : []);
  const districts = data?.districts || defaultDistricts;

  const totalMatches = data?.heroStats?.totalMatchesCount ?? landPlots.length;
  const topMatch = data?.heroStats?.topMatchPercentage ?? (landPlots.length > 0 ? '96%' : '0%');
  const newToday = data?.heroStats?.newTodayCount ?? (landPlots.length > 0 ? 2 : 0);

  const handleDistrictSelect = (district: string) => {
    setSelectedDistrict(district);
    if (onFilterDistrictChange) onFilterDistrictChange(district);
  };

  const handleToggleBookmark = async (id: string | number) => {
    if (onToggleSaveLand) {
      onToggleSaveLand(id);
    } else {
      try {
        await toggleSaveLandApi(String(id));
        setSavedStatusMap(prev => ({ ...prev, [id]: !prev[id] }));
      } catch {
        setSavedStatusMap(prev => ({ ...prev, [id]: !prev[id] }));
      }
    }
  };

  // Filter plots by selected district
  const filteredPlots = landPlots.filter(plot => 
    selectedDistrict === 'All' ? true : plot.locationDistrict.toLowerCase().includes(selectedDistrict.toLowerCase())
  );

  // ─── 2. Skeleton Loading State ─────────────────────────────────────────────
  if (isLoading || fetching) {
    return (
      <div className="w-full flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto animate-pulse font-normal text-[#1e293b]">
        <div className="h-32 bg-gray-200 rounded-2xl w-full" />
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
    <div className="w-full flex flex-col gap-6 sm:gap-8 p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto font-normal text-[#1e293b]">
      
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

      {/* AI Recommendation Hero Card */}
      <div className="bg-[#be5d3f] flex flex-col md:flex-row items-start md:items-center justify-between p-6 sm:p-8 rounded-2xl text-white shadow-lg relative overflow-hidden gap-6">
        <div className="flex gap-4 sm:gap-5 items-center">
          <div className="bg-white/20 flex items-center justify-center rounded-2xl size-14 sm:size-16 shrink-0">
            <img alt="AI Sparks" className="size-8 filter invert" src="/svg/sparks-icon.svg" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">AI Land Recommendations</h2>
            <p className="text-xs sm:text-sm text-white/80 mt-1 max-w-xl">
              High-potential land plots matched to your investment profile and location preferences.
            </p>
          </div>
        </div>

        {/* Hero Metrics Badge Group */}
        <div className="flex items-center gap-6 sm:gap-8 self-end md:self-auto border-t md:border-t-0 md:border-l border-white/20 pt-4 md:pt-0 md:pl-8">
          <div className="text-center">
            <span className="block text-2xl sm:text-3xl font-extrabold text-white leading-none">{totalMatches}</span>
            <span className="text-[10px] text-white/70 tracking-wider uppercase font-semibold">TOTAL MATCHES</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl sm:text-3xl font-extrabold text-white leading-none">{topMatch}</span>
            <span className="text-[10px] text-white/70 tracking-wider uppercase font-semibold">TOP MATCH</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl sm:text-3xl font-extrabold text-white leading-none">{newToday}</span>
            <span className="text-[10px] text-white/70 tracking-wider uppercase font-semibold">NEW TODAY</span>
          </div>
        </div>
      </div>

      {/* Breadcrumbs & Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-xs font-semibold text-[#64748b] tracking-wider uppercase mb-1">
            <a href="/buyer-dashboard" className="hover:text-[#be5d3f] transition-colors">DASHBOARD</a>
            <span>/</span>
            <span className="text-[#1e293b] font-bold">ALL LAND PLOTS</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] tracking-tight">All Land Plots</h1>
          <p className="text-xs sm:text-sm text-[#475569] mt-1">
            {filteredPlots.length} AI-matched land plots based on your investment profile — updated daily
          </p>
        </div>

        <div className="bg-[#f0eadd] border border-[#cbd5e1]/50 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-[#be5d3f] uppercase tracking-wider shadow-sm">
          <img alt="Land Plot" className="size-3.5" src="/svg/land-plot-icon.svg" />
          <span>{filteredPlots.length} LAND PLOTS FOUND</span>
        </div>
      </div>

      {/* Filter Bar & Sorting Dropdown */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/50 p-2 rounded-2xl border border-gray-200/50">
        
        {/* District Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {districts.map((dist) => (
            <button
              key={dist}
              onClick={() => handleDistrictSelect(dist)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border whitespace-nowrap cursor-pointer ${
                selectedDistrict === dist
                  ? 'bg-white text-[#1e293b] border-gray-300 shadow-sm'
                  : 'bg-white/40 text-[#475569] border-transparent hover:bg-white/80'
              }`}
            >
              {dist}
            </button>
          ))}
        </div>

        {/* Sort Menu */}
        <div className="relative self-end sm:self-auto">
          <button
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            className="bg-white border border-[#e2e8f0] flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-[#334155] hover:bg-gray-50 shadow-sm transition-all cursor-pointer"
          >
            <img alt="Filter" className="size-3.5" src="/svg/filter-icon.svg" />
            <span>Sort: {sortBy}</span>
            <img alt="Chevron" className={`size-2.5 transition-transform ${isSortDropdownOpen ? 'rotate-180' : ''}`} src="/svg/dropdown2.svg" />
          </button>

          {isSortDropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1 text-xs font-semibold">
              {['Best Match', 'Price: Low to High', 'Price: High to Low', 'Newest Added'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setSortBy(opt);
                    setIsSortDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 cursor-pointer ${sortBy === opt ? 'font-bold text-[#be5d3f]' : 'text-gray-700'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Land Property Grid */}
      {filteredPlots.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-gray-400 font-semibold text-sm border border-gray-200">
          No land plots match the selected district filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlots.map((plot) => {
            const isBookmarked = savedStatusMap[plot.id] !== undefined ? savedStatusMap[plot.id] : plot.isSaved;

            return (
              <div 
                key={plot.id} 
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
              >
                {/* Image & Overlay Badges */}
                <div className="h-[220px] w-full relative overflow-hidden bg-gray-100">
                  <img 
                    src={plot.imageUrl} 
                    alt={plot.title} 
                    className="size-full object-cover group-hover:scale-105 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                  {/* AI Match Badge */}
                  <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                    <img src="/svg/sparks-icon.svg" alt="" className="size-3.5 filter invert" />
                    <span className="text-[10px] font-extrabold text-white tracking-wider uppercase">{plot.matchScore} MATCH</span>
                  </div>

                  {/* High Potential Badge */}
                  <div className={`absolute bottom-4 left-4 ${
                    plot.potentialLevel === 'HIGH POTENTIAL' ? 'bg-[#4a7c59]' : 'bg-[#d97706]'
                  } text-white px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-md`}>
                    <img src="/svg/high-potential-icon.svg" alt="" className="size-3 filter invert" />
                    <span className="text-[9px] font-extrabold tracking-wider uppercase">{plot.potentialLevel}</span>
                  </div>

                  {/* Bookmark Button */}
                  <button 
                    onClick={() => handleToggleBookmark(plot.id)}
                    className="absolute top-4 right-4 bg-white/90 hover:bg-white backdrop-blur-sm p-2 rounded-xl shadow-sm transition-colors cursor-pointer"
                  >
                    <img 
                      src="/svg/bookmark.svg" 
                      alt="Bookmark" 
                      className={`size-4 ${isBookmarked ? 'filter drop-shadow' : 'opacity-60'}`} 
                    />
                  </button>
                </div>

                {/* Card Info Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-base font-bold text-[#0f172a] leading-snug">{plot.title}</h4>
                      <div className="text-right">
                        <span className="block text-base font-extrabold text-[#be5d3f] leading-none">{plot.priceAmount}</span>
                        <span className="text-[10px] font-medium text-[#94a3b8]">{plot.pricePerPerch}</span>
                      </div>
                    </div>

                    {/* Metadata Subgrid */}
                    <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-gray-100 text-xs text-[#64748b]">
                      <div className="flex items-center gap-2">
                        <img src="/svg/location-pin-icon.svg" alt="" className="size-3.5 shrink-0" />
                        <span>{plot.locationDistrict}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <img src="/svg/perch-icon.svg" alt="" className="size-3.5 shrink-0" />
                        <span>{plot.sizePerches}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <img src="/svg/main-road-icon.svg" alt="" className="size-3.5 shrink-0" />
                        <span>{plot.roadAccess}</span>
                      </div>
                      <div>
                        <span className="bg-blue-50 text-blue-700 text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                          {plot.zoningType}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* View Action Button */}
                  <button 
                    onClick={() => onLandClick && onLandClick(plot.id)}
                    className="w-full bg-[#be5d3f] hover:bg-[#be5d3f]/90 text-white font-bold text-xs py-3 rounded-xl shadow-sm transition-colors text-center cursor-pointer"
                  >
                    View Details
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Pagination / Load More */}
      <div className="flex items-center justify-center pt-4 pb-8">
        <button 
          onClick={() => onLoadMore && onLoadMore()}
          className="bg-white border border-[#cbd5e1] hover:bg-gray-50 flex items-center gap-2 px-8 py-3 rounded-full text-xs font-bold text-[#334155] shadow-sm transition-all cursor-pointer"
        >
          <span>Load More Land Plots</span>
          <img src="/svg/dropdown2.svg" alt="" className="size-3" />
        </button>
      </div>

    </div>
  );
}
