import React, { useState, useEffect } from 'react';
import { BuyerHeaderBar } from '../../components/buyer/BuyerHeaderBar';
import { fetchRecentlyViewed } from '../../services/buyerApi';

// ─── 1. Comprehensive Backend Interfaces ───────────────────────────────────

export interface ViewedHistoryItem {
  id: string | number;
  title: string;
  location: string;
  price: string;
  type: 'PROPERTY' | 'LAND';
  viewedTimeAgo: string;
  imageUrl: string;
  beds?: number | string;
  baths?: number | string;
  sqft?: string;
  perches?: string;
  roadAccessOrOrientation?: string;
  isSaved?: boolean;
}

export interface RecentlyViewedMetrics {
  totalViewsCount?: number;
  propertiesViewedCount?: number;
  landPlotsViewedCount?: number;
  activityPeriodText?: string;
}

export interface RecentlyViewedPageData {
  metrics?: RecentlyViewedMetrics;
  historyItems?: ViewedHistoryItem[];
}

export interface RecentlyViewedProps {
  data?: RecentlyViewedPageData | null;
  isLoading?: boolean;
  error?: string | null;
  onItemClick?: (id: string | number) => void;
  onToggleSaveItem?: (id: string | number) => void;
  onFilterChange?: (filterType: string) => void;
}

// ─── Mock Fallback Data ─────────────────────────────────────────────────────

const defaultHistoryItems: ViewedHistoryItem[] = [
  {
    id: 1,
    title: 'Luxury Villa, Colombo 7',
    location: 'Colombo 7, Western Province',
    price: 'LKR 32M',
    type: 'PROPERTY',
    viewedTimeAgo: 'Viewed 2 hours ago',
    imageUrl: '/property_card_1.png',
    beds: 4,
    baths: 3,
    sqft: '4,200',
    isSaved: true
  },
  {
    id: 2,
    title: 'Land Plot, Homagama',
    location: 'Homagama, Western Province',
    price: 'LKR 9.2M',
    type: 'LAND',
    viewedTimeAgo: 'Viewed 4 hours ago',
    imageUrl: '/hero_property.png',
    perches: '12.5 PERCHES',
    roadAccessOrOrientation: 'NORTH FACING',
    isSaved: false
  },
  {
    id: 3,
    title: 'Modern Apartment, Nugegoda',
    location: 'Nugegoda, Colombo District',
    price: 'LKR 18.5M',
    type: 'PROPERTY',
    viewedTimeAgo: 'Viewed Yesterday',
    imageUrl: '/property_card_2.png',
    beds: 3,
    baths: 2,
    sqft: '2,200',
    isSaved: false
  },
  {
    id: 4,
    title: 'Penthouse, Rajagiriya',
    location: 'Rajagiriya, Western Province',
    price: 'LKR 35M',
    type: 'PROPERTY',
    viewedTimeAgo: 'Viewed Yesterday',
    imageUrl: '/property_card_3.png',
    beds: 4,
    baths: 4,
    sqft: '4,100',
    isSaved: false
  },
  {
    id: 5,
    title: 'Corner Plot, Kaduwela',
    location: 'Kaduwela, Western Province',
    price: 'LKR 12.8M',
    type: 'LAND',
    viewedTimeAgo: 'Viewed 2 days ago',
    imageUrl: '/property_card_4.png',
    perches: '15 PERCHES',
    roadAccessOrOrientation: 'CORNER LOT',
    isSaved: true
  },
  {
    id: 6,
    title: 'Garden Home, Kottawa',
    location: 'Kottawa, Colombo District',
    price: 'LKR 24.5M',
    type: 'PROPERTY',
    viewedTimeAgo: 'Viewed 2 days ago',
    imageUrl: '/property_card_1.png',
    beds: 3,
    baths: 3,
    sqft: '2,900',
    isSaved: false
  }
];

// ─── Component Implementation ───────────────────────────────────────────────

export default function RecentlyViewed({
  data = null,
  isLoading = false,
  error = null,
  onItemClick,
  onToggleSaveItem,
  onFilterChange
}: RecentlyViewedProps) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Most Recent');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [savedStatusMap, setSavedStatusMap] = useState<Record<string | number, boolean>>({});

  const [apiItems, setApiItems] = useState<ViewedHistoryItem[] | null>(null);

  useEffect(() => {
    if (!data) {
      fetchRecentlyViewed()
        .then((res) => {
          if (res && Array.isArray(res) && res.length > 0) {
            setApiItems(res);
          }
        })
        .catch((err) => {
          console.error('Failed to fetch recently viewed items:', err);
        });
    }
  }, [data]);

  const historyItems = apiItems !== null ? apiItems : (data?.historyItems !== undefined ? data.historyItems : defaultHistoryItems);

  const totalViews = data?.metrics?.totalViewsCount ?? historyItems.length;
  const propertiesCount = data?.metrics?.propertiesViewedCount ?? historyItems.filter(i => i.type === 'PROPERTY').length;
  const landsCount = data?.metrics?.landPlotsViewedCount ?? historyItems.filter(i => i.type === 'LAND').length;
  const activityPeriod = data?.metrics?.activityPeriodText ?? '5 days';

  const handleFilterSelect = (filterName: string) => {
    setActiveFilter(filterName);
    if (onFilterChange) onFilterChange(filterName);
  };

  const handleBookmarkToggle = (id: string | number) => {
    if (onToggleSaveItem) {
      onToggleSaveItem(id);
    } else {
      setSavedStatusMap(prev => ({ ...prev, [id]: !prev[id] }));
    }
  };

  // Filter items based on selected pill
  const filteredItems = historyItems.filter(item => {
    if (activeFilter === 'Properties') return item.type === 'PROPERTY';
    if (activeFilter === 'Land Plots') return item.type === 'LAND';
    return true;
  });

  // ─── 2. Skeleton Loading State ─────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-6 p-4 sm:p-6 lg:p-10 max-w-[1400px] mx-auto animate-pulse">
        <div className="h-16 bg-gray-200 rounded-2xl w-1/3" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-gray-200 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-96 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 sm:gap-8 p-4 sm:p-6 lg:p-10 max-w-[1400px] mx-auto font-normal text-[#194360]">
      <BuyerHeaderBar />
      
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

      {/* Top Header & Badge Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-xs font-semibold text-[#42474d] tracking-wider uppercase mb-1">
            <a href="/buyer-dashboard" className="hover:text-[#be5d3f] transition-colors">DASHBOARD</a>
            <img src="/svg/arrowRight.svg" alt="" className="size-2.5 opacity-60" />
            <span className="text-[#194360] font-bold">RECENTLY VIEWED</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#194360] tracking-tight">Recently Viewed</h1>
          <p className="text-xs sm:text-sm text-[#42474d] mt-1">
            Your full browsing history — properties and lands you have explored
          </p>
        </div>

        <div className="bg-[#be5d3f]/10 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-[#be5d3f]">
          <img src="/svg/eye.svg" alt="Eye" className="size-4" />
          <span>{totalViews} Items Viewed</span>
        </div>
      </div>

      {/* KPI Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: 'TOTAL VIEWS', val: totalViews, icon: '/svg/eye.svg', bg: 'bg-[#345b79]/10' },
          { label: 'PROPERTIES VIEWED', val: propertiesCount, icon: '/svg/home.svg', bg: 'bg-[#be5d3f]/10' },
          { label: 'LAND PLOTS VIEWED', val: landsCount, icon: '/svg/land-plot-icon.svg', bg: 'bg-[#928d64]/10' },
          { label: 'ACTIVITY PERIOD', val: activityPeriod, icon: '/svg/clock.svg', bg: 'bg-[#194360]/10' }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 border border-gray-200/60 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-xl flex items-center justify-center size-12 shrink-0 ${kpi.bg}`}>
              <img src={kpi.icon} alt="" className="size-5" />
            </div>
            <div>
              <span className="block text-xl sm:text-2xl font-bold text-[#194360] leading-none mb-1">{kpi.val}</span>
              <span className="text-[10px] font-bold text-[#42474d] uppercase tracking-wider block">{kpi.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Pills Bar & Controls */}
      <div className="bg-[#f6f3f2] p-2 sm:p-3 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {['All', 'Properties', 'Land Plots', 'This Week', 'Last Week'].map((filterName) => (
            <button
              key={filterName}
              onClick={() => handleFilterSelect(filterName)}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all border whitespace-nowrap ${
                activeFilter === filterName
                  ? 'bg-[#194360] text-white border-[#194360] shadow-sm'
                  : 'bg-white text-[#42474d] border-gray-200 hover:bg-gray-100'
              }`}
            >
              {filterName}
            </button>
          ))}
        </div>

        {/* Sort Controls */}
        <div className="relative self-end sm:self-auto flex items-center gap-3">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-xs font-semibold text-[#42474d] flex items-center gap-2 shadow-sm hover:bg-gray-50"
          >
            <img src="/svg/filter-icon.svg" alt="" className="size-3.5" />
            <span>{sortBy}</span>
            <img src="/svg/dropdown2.svg" alt="" className={`size-2.5 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSortOpen && (
            <div className="absolute right-0 top-11 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1 text-xs">
              {['Most Recent', 'Oldest First', 'Price High to Low'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setSortBy(opt);
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${sortBy === opt ? 'font-bold text-[#be5d3f]' : 'text-gray-700'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recently Viewed History Grid */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-gray-400 font-semibold text-sm border border-gray-200">
          No recently viewed items matching the selected filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isBookmarked = savedStatusMap[item.id] !== undefined ? savedStatusMap[item.id] : item.isSaved;

            return (
              <div key={item.id} className="bg-white border border-gray-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group">
                {/* Image Cover */}
                <div className="h-[220px] w-full relative overflow-hidden bg-gray-100">
                  <img src={item.imageUrl} alt={item.title} className="size-full object-cover group-hover:scale-105 transition-all duration-300" />
                  
                  {/* Category Type Tag */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase text-white shadow-sm flex items-center gap-1.5 ${
                      item.type === 'PROPERTY' ? 'bg-[#194360]' : 'bg-[#be5d3f]'
                    }`}>
                      <img src={item.type === 'PROPERTY' ? '/svg/home.svg' : '/svg/land-plot-icon.svg'} alt="" className="size-3 filter invert" />
                      {item.type}
                    </span>
                  </div>

                  {/* Viewed Time Tag */}
                  <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm text-xs font-semibold text-[#1b1b1b]">
                    <img src="/svg/clock.svg" alt="" className="size-3" />
                    <span>{item.viewedTimeAgo}</span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-base font-bold text-[#194360] leading-snug">{item.title}</h4>
                        <p className="text-xs text-[#42474d] flex items-center gap-1 mt-1">
                          <img src="/svg/location-pin-icon.svg" alt="" className="size-3 shrink-0" />
                          {item.location}
                        </p>
                      </div>
                      <span className="text-base font-extrabold text-[#194360] shrink-0">{item.price}</span>
                    </div>

                    {/* Specifications Subgrid */}
                    <div className="border-t border-b border-gray-100 py-3 flex items-center justify-around text-center text-xs font-bold text-[#42474d]">
                      {item.type === 'PROPERTY' ? (
                        <>
                          <div>
                            <span className="block text-xs text-[#194360]">{item.beds}</span>
                            <span className="text-[10px] text-gray-400 uppercase">BEDS</span>
                          </div>
                          <div className="w-px h-6 bg-gray-100" />
                          <div>
                            <span className="block text-xs text-[#194360]">{item.baths}</span>
                            <span className="text-[10px] text-gray-400 uppercase">BATHS</span>
                          </div>
                          <div className="w-px h-6 bg-gray-100" />
                          <div>
                            <span className="block text-xs text-[#194360]">{item.sqft}</span>
                            <span className="text-[10px] text-gray-400 uppercase">SQFT</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <span className="block text-xs text-[#194360]">{item.perches || 'N/A'}</span>
                            <span className="text-[10px] text-gray-400 uppercase">AREA</span>
                          </div>
                          <div className="w-px h-6 bg-gray-100" />
                          <div>
                            <span className="block text-xs text-[#194360]">{item.roadAccessOrOrientation || 'N/A'}</span>
                            <span className="text-[10px] text-gray-400 uppercase">ACCESS</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => onItemClick && onItemClick(item.id)}
                      className={`flex-1 text-white text-xs font-bold py-3 rounded-xl transition-colors text-center shadow-sm ${
                        item.type === 'PROPERTY' ? 'bg-[#345b79] hover:bg-[#345b79]/90' : 'bg-[#be5d3f] hover:bg-[#be5d3f]/90'
                      }`}
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleBookmarkToggle(item.id)}
                      className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center justify-center transition-colors"
                    >
                      <img src="/svg/bookmark.svg" alt="Bookmark" className={`size-4 ${isBookmarked ? 'filter drop-shadow' : 'opacity-60'}`} />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Pagination / Load More */}
      <div className="flex items-center justify-center pt-4 pb-12">
        <button className="bg-white border border-gray-200 hover:bg-gray-50 flex items-center gap-2 px-8 py-3 rounded-full text-xs font-bold text-[#194360] shadow-sm transition-all">
          <span>Load More History</span>
          <img src="/svg/dropdown2.svg" alt="" className="size-3" />
        </button>
      </div>

    </div>
  );
}
