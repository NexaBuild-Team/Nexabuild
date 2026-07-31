import React, { useState } from 'react';

// ─── 1. Comprehensive Backend Interfaces ───────────────────────────────────

export interface AgentDashboardListingItem {
  id: string | number;
  title: string;
  type: 'PROPERTY' | 'LAND';
  status: 'Active' | 'Pending' | 'Inactive';
  views: number;
  saved: number;
  imageUrl: string;
}

export interface AgentDashboardNotification {
  id: string | number;
  message: string;
  timeAgo: string;
  type: 'enquiry' | 'views' | 'saved';
}

export interface AgentDashboardActivity {
  id: string | number;
  description: string;
  timeAgo: string;
  type: 'views' | 'saved' | 'enquiry';
}

export interface AgentDashboardLocationMetric {
  locationName: string;
  percentage: number;
}

export interface AgentDashboardSummaryMetrics {
  totalPropertiesCount?: number;
  propertiesGrowthPercent?: string;
  totalLandsCount?: number;
  landsGrowthPercent?: string;
  totalViewsCount?: string | number;
  viewsGrowthPercent?: string;
  savedByUsersCount?: number;
  savedGrowthPercent?: string;
  totalEnquiriesCount?: number;
  enquiriesGrowthPercent?: string;
  propertyViewsSubSummary?: string | number;
  landViewsSubSummary?: string | number;
}

export interface AgentDashboardPageData {
  metrics?: AgentDashboardSummaryMetrics;
  listings?: AgentDashboardListingItem[];
  notifications?: AgentDashboardNotification[];
  activities?: AgentDashboardActivity[];
  topLocations?: AgentDashboardLocationMetric[];
}

export interface AgentDashboardProps {
  data?: AgentDashboardPageData | null;
  isLoading?: boolean;
  error?: string | null;
  onViewListing?: (id: string | number, type: 'PROPERTY' | 'LAND') => void;
  onToggleStatus?: (id: string | number) => void;
  onDeleteListing?: (id: string | number) => void;
}

// ─── Mock Fallback Data ─────────────────────────────────────────────────────

const defaultListings: AgentDashboardListingItem[] = [
  {
    id: 1,
    title: 'Palm Villa, Jumeirah',
    type: 'PROPERTY',
    status: 'Active',
    views: 3240,
    saved: 182,
    imageUrl: '/hero_property.png'
  },
  {
    id: 2,
    title: 'Sky Apt, Downtown Dubai',
    type: 'PROPERTY',
    status: 'Active',
    views: 2180,
    saved: 97,
    imageUrl: '/property_card_1.png'
  },
  {
    id: 3,
    title: 'Townhouse, Arabian Ranches',
    type: 'PROPERTY',
    status: 'Pending',
    views: 1540,
    saved: 64,
    imageUrl: '/property_card_2.png'
  },
  {
    id: 4,
    title: 'Commercial Plot #A-09, Expo City',
    type: 'LAND',
    status: 'Active',
    views: 1870,
    saved: 53,
    imageUrl: '/property_card_3.png'
  },
  {
    id: 5,
    title: 'Residential Plot, JVC Phase 3',
    type: 'LAND',
    status: 'Active',
    views: 1290,
    saved: 41,
    imageUrl: '/property_card_4.png'
  },
  {
    id: 6,
    title: 'Industrial Zone Plot, DIP',
    type: 'LAND',
    status: 'Inactive',
    views: 620,
    saved: 18,
    imageUrl: '/property_card_1.png'
  }
];

const defaultNotifications: AgentDashboardNotification[] = [
  { id: 1, message: 'New enquiry on Palm Villa', timeAgo: '5m ago', type: 'enquiry' },
  { id: 2, message: '42 new views on plot #A-09', timeAgo: '1h ago', type: 'views' },
  { id: 3, message: 'Villa saved by 3 buyers', timeAgo: '2h ago', type: 'saved' }
];

const defaultActivities: AgentDashboardActivity[] = [
  { id: 1, description: 'Palm Villa viewed 24 times today', timeAgo: '2h ago', type: 'views' },
  { id: 2, description: 'Plot #A-09 saved by 5 buyers', timeAgo: '4h ago', type: 'saved' },
  { id: 3, description: 'Enquiry from Sara M. on Sky Apt', timeAgo: '6h ago', type: 'enquiry' }
];

const defaultLocations: AgentDashboardLocationMetric[] = [
  { locationName: 'Jumeirah', percentage: 84 },
  { locationName: 'Downtown Dubai', percentage: 71 },
  { locationName: 'Expo City', percentage: 63 },
  { locationName: 'JVC', percentage: 55 }
];

// ─── Component Implementation ───────────────────────────────────────────────

export default function AgentDashboard({
  data = null,
  isLoading = false,
  error = null,
  onViewListing,
  onToggleStatus,
  onDeleteListing
}: AgentDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [listingsState, setListingsState] = useState<AgentDashboardListingItem[]>([]);

  const listings = data?.listings !== undefined 
    ? data.listings 
    : (listingsState.length > 0 ? listingsState : defaultListings);

  const notifications = data?.notifications || defaultNotifications;
  const activities = data?.activities || defaultActivities;
  const topLocations = data?.topLocations || defaultLocations;

  const metrics = data?.metrics;

  const handleStatusToggle = (id: string | number) => {
    if (onToggleStatus) {
      onToggleStatus(id);
    } else {
      setListingsState(prev => {
        const source = prev.length > 0 ? prev : defaultListings;
        return source.map(item => {
          if (item.id === id) {
            const nextStatusMap: Record<'Active' | 'Pending' | 'Inactive', 'Active' | 'Pending' | 'Inactive'> = {
              Active: 'Pending',
              Pending: 'Inactive',
              Inactive: 'Active'
            };
            return { ...item, status: nextStatusMap[item.status] };
          }
          return item;
        });
      });
    }
  };

  const handleListingDelete = (id: string | number) => {
    if (onDeleteListing) {
      onDeleteListing(id);
    } else {
      if (window.confirm('Are you sure you want to delete this listing?')) {
        setListingsState(prev => {
          const source = prev.length > 0 ? prev : defaultListings;
          return source.filter(item => item.id !== id);
        });
      }
    }
  };

  // ─── 2. Skeleton Loading State ─────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col gap-6 p-6 lg:p-8 animate-pulse">
        <div className="h-16 bg-gray-200 rounded-2xl w-full" />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-28 bg-gray-200 rounded-2xl" />
          ))}
        </div>
        <div className="h-80 bg-gray-200 rounded-2xl w-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative flex flex-row items-start font-normal text-[#1a1c1e] bg-gradient-to-r from-[#e6e0d4] to-[#fcf9f8]">
      
      {/* Sidebar Drawer */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-[256px] bg-[#345b79] flex flex-col justify-between pt-[76px] pb-[24px] px-[16px] transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="absolute top-[11px] left-0 right-0 px-[32px] flex items-center gap-[12px]">
          <div className="bg-white/20 flex items-center justify-center rounded-[12px] size-[40px]">
            <img alt="NexaBuild Logo" className="size-[20px] object-contain" src="/src/assets/logo.png" />
          </div>
          <span className="text-[24px] font-extrabold text-white tracking-[-0.6px] leading-[32px]">
            NexaBuild
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-between overflow-y-auto mt-[20px]">
          <nav className="flex flex-col gap-[4px]">
            <a href="/agent-dashboard" className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[8px] bg-[#52748c] text-white font-normal text-[14px]">
              <img alt="Dashboard" className="size-[20px]" src="/svg/home.svg" />
              <span className="leading-[20px]">Dashboard</span>
            </a>
            <a href="/view-all-properties" className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[8px] text-white/70 hover:bg-white/5 hover:text-white transition-all font-normal text-[14px]">
              <img alt="Properties" className="size-[20px] filter brightness-200" src="/svg/home.svg" />
              <span className="leading-[20px]">Properties</span>
            </a>
            <a href="/view-all-land" className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[8px] text-white/70 hover:bg-white/5 hover:text-white transition-all font-normal text-[14px]">
              <img alt="Lands" className="size-[20px] filter brightness-200" src="/svg/land-plot-icon.svg" />
              <span className="leading-[20px]">Lands</span>
            </a>

            <div className="px-[16px] pt-[20px] pb-[8px] text-[11px] font-bold tracking-[1px] uppercase text-white/40">
              Quick Actions
            </div>
            <a href="/add-property" className="flex items-center gap-[12px] px-[16px] py-[10px] rounded-[8px] text-white/70 hover:bg-white/5 hover:text-white transition-all font-normal text-[13px]">
              <span className="text-[16px] font-bold text-white/60">+</span>
              <span className="leading-[20px]">Add Property</span>
            </a>
            <a href="/land" className="flex items-center gap-[12px] px-[16px] py-[10px] rounded-[8px] text-white/70 hover:bg-white/5 hover:text-white transition-all font-normal text-[13px]">
              <span className="text-[16px] font-bold text-white/60">+</span>
              <span className="leading-[20px]">Add Land</span>
            </a>
          </nav>
        </div>
      </aside>

      {/* Backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/45 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content Area */}
      <main className="flex-1 lg:pl-[256px] min-w-0 flex flex-col">
        
        {/* Sticky Top Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-[#e5e7eb] px-6 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm gap-4">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <svg className="size-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-xl font-bold text-[#1a1c1e] tracking-tight">Agent Dashboard</h1>
            </div>
            <p className="text-xs text-[#42474d] hidden sm:block">
              Manage your properties, lands, and performance metrics
            </p>
          </div>

          <div className="relative p-2 bg-gray-100 hover:bg-gray-200 rounded-full cursor-pointer transition-colors flex items-center justify-center size-10">
            <img alt="Notifications" className="size-5" src="/svg/email.svg" />
            <div className="absolute bg-[#be5d3f] border-2 border-white rounded-full size-3 top-1 right-1 shadow" />
          </div>
        </header>

        {/* Body Layout */}
        <div className="p-6 lg:p-8 flex flex-col gap-8 w-full max-w-[1400px] mx-auto">
          
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

          {/* Top Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5 w-full">
            {[
              { title: 'Total Properties', val: metrics?.totalPropertiesCount ?? 48, growth: metrics?.propertiesGrowthPercent ?? '+6%', icon: '/svg/home.svg', bg: 'bg-[#194360]/10' },
              { title: 'Total Lands', val: metrics?.totalLandsCount ?? 23, growth: metrics?.landsGrowthPercent ?? '+3%', icon: '/svg/land-plot-icon.svg', bg: 'bg-[#be5d3f]/10' },
              { title: 'Total Views', val: metrics?.totalViewsCount ?? '14.2K', growth: metrics?.viewsGrowthPercent ?? '+18%', icon: '/svg/eye.svg', bg: 'bg-[#345b79]/10' },
              { title: 'Saved by Users', val: metrics?.savedByUsersCount ?? 892, growth: metrics?.savedGrowthPercent ?? '+9%', icon: '/svg/bookmark.svg', bg: 'bg-[#928d64]/10' },
              { title: 'Total Enquiries', val: metrics?.totalEnquiriesCount ?? 317, growth: metrics?.enquiriesGrowthPercent ?? '+22%', icon: '/svg/email.svg', bg: 'bg-[#73511d]/10' }
            ].map((card, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between w-full">
                  <div className={`flex items-center justify-center rounded-xl size-12 ${card.bg}`}>
                    <img alt="" className="size-5" src={card.icon} />
                  </div>
                  <span className="bg-emerald-50 rounded-lg px-2 py-1 text-emerald-700 text-xs font-bold">{card.growth}</span>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-[#1a1c1e] leading-tight">{card.val}</p>
                  <p className="text-xs text-[#42474d] mt-1 font-medium">{card.title}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Charts & Notifications Section */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full">
            <div className="xl:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-[#1a1c1e]">Property Performance</h3>
                    <p className="text-xs text-[#42474d]">Views & enquiries over 7 months</p>
                  </div>
                  <div className="bg-[#345b79] rounded-full size-3" />
                </div>
                <div className="flex items-end justify-between h-44 px-2 pt-4 border-b border-gray-100">
                  {[72, 104, 88, 136, 120, 156, 142].map((h, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 w-6">
                      <div className="bg-[#345b79] opacity-80 w-full rounded-t hover:opacity-100 transition-opacity" style={{ height: `${h}px` }} />
                      <span className="text-[10px] text-gray-400 font-bold uppercase">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][i]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-[#1a1c1e]">Land Performance</h3>
                    <p className="text-xs text-[#42474d]">Views & enquiries over 7 months</p>
                  </div>
                  <div className="bg-[#be5d3f] rounded-full size-3" />
                </div>
                <div className="flex items-end justify-between h-44 px-2 pt-4 border-b border-gray-100">
                  {[48, 80, 72, 112, 96, 144, 128].map((h, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 w-6">
                      <div className="bg-[#be5d3f] opacity-80 w-full rounded-t hover:opacity-100 transition-opacity" style={{ height: `${h}px` }} />
                      <span className="text-[10px] text-gray-400 font-bold uppercase">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][i]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Side Info Panel */}
            <div className="xl:col-span-3 flex flex-col gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-center w-full">
                  <h4 className="text-sm font-bold text-[#1a1c1e]">Notifications</h4>
                  <span className="bg-[#be5d3f] text-white rounded-full size-5 flex items-center justify-center text-[10px] font-bold">
                    {notifications.length}
                  </span>
                </div>
                <div className="flex flex-col gap-4">
                  {notifications.map(n => (
                    <div key={n.id} className="flex items-start gap-3 text-xs">
                      <div className="bg-gray-100 p-2 rounded-full shrink-0">
                        <img src="/svg/email.svg" alt="" className="size-3.5" />
                      </div>
                      <div>
                        <p className="text-gray-800 font-medium leading-snug">{n.message}</p>
                        <span className="text-[10px] text-gray-400 mt-0.5 block">{n.timeAgo}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Latest Listings Table */}
          <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-5 w-full">
            <div className="flex justify-between items-center w-full">
              <h3 className="text-base font-bold text-[#1a1c1e]">Latest Listings</h3>
              <a href="/view-all-properties" className="text-xs font-bold text-[#194360] hover:underline">
                View All
              </a>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full text-xs border-collapse min-w-[650px]">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-left">
                    <th className="pb-3 pl-3 w-16">Thumb</th>
                    <th className="pb-3 pl-3">Title</th>
                    <th className="pb-3 pl-3">Status</th>
                    <th className="pb-3 pl-3">Views</th>
                    <th className="pb-3 pl-3">Saved</th>
                    <th className="pb-3 pl-3 text-center w-36">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map(item => (
                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 pl-3">
                        <div className="h-10 w-14 rounded-lg overflow-hidden bg-gray-100">
                          <img alt={item.title} className="size-full object-cover" src={item.imageUrl} />
                        </div>
                      </td>
                      <td className="py-3 pl-3 font-bold text-gray-800">
                        <div>
                          <p>{item.title}</p>
                          <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                            item.type === 'PROPERTY' ? 'bg-blue-50 text-blue-700' : 'bg-orange-50 text-orange-700'
                          }`}>
                            {item.type}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 pl-3">
                        <span 
                          onClick={() => handleStatusToggle(item.id)}
                          className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer select-none ${
                            item.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 pl-3 font-semibold text-gray-600">{item.views.toLocaleString()}</td>
                      <td className="py-3 pl-3 font-semibold text-gray-600">{item.saved}</td>
                      <td className="py-3 pl-3">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => onViewListing && onViewListing(item.id, item.type)}
                            className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors" 
                            title="View details"
                          >
                            <img alt="View" className="size-3.5" src="/svg/eye.svg" />
                          </button>
                          <button 
                            onClick={() => handleStatusToggle(item.id)}
                            className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors" 
                            title="Quick Edit"
                          >
                            <img alt="Edit" className="size-3.5" src="/svg/sparks-settings-icon.svg" />
                          </button>
                          <button 
                            onClick={() => handleListingDelete(item.id)}
                            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors" 
                            title="Delete listing"
                          >
                            <img alt="Delete" className="size-3.5 filter hue-rotate-320" src="/svg/clock.svg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
