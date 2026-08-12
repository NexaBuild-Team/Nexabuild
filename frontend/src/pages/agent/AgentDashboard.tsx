import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { BuyerHeaderBar } from '../../components/buyer/BuyerHeaderBar';
import { fetchAgentDashboard, updateListingStatusApi, deleteListingApi } from '../../services/agentApi';
import type { AgentDashboardData as ApiAgentData } from '../../services/agentApi';
import { getAllLands, deleteLand } from '../../services/landApi';
import { fetchAllProperties } from '../../services/propertyService';

// ─── 1. Comprehensive Interfaces ───────────────────────────────────────────

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

// Recharts Dataset for Performance
const propertyPerformanceData = [
  { month: 'JAN', views: 420 },
  { month: 'FEB', views: 680 },
  { month: 'MAR', views: 520 },
  { month: 'APR', views: 890 },
  { month: 'MAY', views: 760 },
  { month: 'JUN', views: 940 },
  { month: 'JUL', views: 1120 },
];

const landPerformanceData = [
  { month: 'JAN', views: 280 },
  { month: 'FEB', views: 420 },
  { month: 'MAR', views: 390 },
  { month: 'APR', views: 610 },
  { month: 'MAY', views: 580 },
  { month: 'JUN', views: 890 },
  { month: 'JUL', views: 780 },
];

const monthlyViewsData = [
  { month: 'JAN', views: 310 },
  { month: 'FEB', views: 480 },
  { month: 'MAR', views: 410 },
  { month: 'APR', views: 680 },
  { month: 'MAY', views: 640 },
  { month: 'JUN', views: 890 },
  { month: 'JUL', views: 1020 },
];

// ─── Component Implementation ───────────────────────────────────────────────

export default function AgentDashboard({
  data = null,
  isLoading = false,
  error = null,
  onViewListing,
  onToggleStatus,
  onDeleteListing,
}: AgentDashboardProps) {
  const navigate = useNavigate();
  const [apiData, setApiData] = useState<ApiAgentData | null>(null);
  const [fetching, setFetching] = useState(!data);

  // Fetched land listings from the land API
  const [fetchedLands, setFetchedLands] = useState<AgentDashboardListingItem[]>([]);
  // Fetched property listings from the property API
  const [fetchedProperties, setFetchedProperties] = useState<AgentDashboardListingItem[]>([]);

  // Tab filter: 'all' | 'property' | 'land'
  const [activeTab, setActiveTab] = useState<'all' | 'property' | 'land'>('all');

  useEffect(() => {
    if (!data) {
      fetchAgentDashboard()
        .then((res) => {
          setApiData(res);
          setFetching(false);
        })
        .catch((err) => {
          console.error('Failed to load agent dashboard data:', err);
          setFetching(false);
        });
    }
  }, [data]);

  // Fetch all lands and map to listing items
  useEffect(() => {
    getAllLands()
      .then((lands) => {
        const mapped: AgentDashboardListingItem[] = lands.map((l) => ({
          id: l.id,
          title: l.name,
          type: 'LAND',
          status: (l.status === 'active' || l.status === 'Active' ? 'Active' : l.status === 'Pending Review' || l.status === 'Pending' ? 'Pending' : 'Inactive') as 'Active' | 'Pending' | 'Inactive',
          // Read view count tracked by LandDetail on each page visit
          views: parseInt(localStorage.getItem(`nexabuild_land_views_${l.id}`) || '0', 10),
          saved: 0,
          imageUrl: l.images?.[0] || '/property_card_1.png',
        }));
        setFetchedLands(mapped);
      })
      .catch((err) => console.error('Failed to load lands for dashboard:', err));
  }, []);

  // Fetch all properties and map to listing items
  useEffect(() => {
    fetchAllProperties()
      .then((props) => {
        const mapped: AgentDashboardListingItem[] = props.map((p) => ({
          id: p.id,
          title: p.title,
          type: 'PROPERTY',
          status: 'Active' as const,
          // Read view count tracked by PropertyDetail on each page visit
          views: parseInt(localStorage.getItem(`nexabuild_property_views_${p.id}`) || '0', 10),
          saved: 0,
          imageUrl: p.image || '/property_card_1.png',
        }));
        setFetchedProperties(mapped);
      })
      .catch((err) => console.error('Failed to load properties for dashboard:', err));
  }, []);

  const [localListings, setLocalListings] = useState<AgentDashboardListingItem[]>([]);

  // Merge: all fetched properties + all fetched lands
  // fetchedProperties covers all real DB properties
  // fetchedLands covers all real DB lands
  const allListings: AgentDashboardListingItem[] = [
    ...fetchedProperties,
    ...fetchedLands,
  ];

  const totalPropertiesViews = fetchedProperties.reduce((sum, p) => sum + p.views, 0);
  const totalLandsViews = fetchedLands.reduce((sum, l) => sum + l.views, 0);
  const totalViews = totalPropertiesViews + totalLandsViews;

  const dynamicMostViewedListing = allListings.length > 0 
    ? [...allListings].sort((a, b) => b.views - a.views)[0] 
    : null;

  const listings: AgentDashboardListingItem[] =
    activeTab === 'property'
      ? allListings.filter((l) => l.type === 'PROPERTY')
      : activeTab === 'land'
      ? allListings.filter((l) => l.type === 'LAND')
      : allListings;

  const notifications = apiData?.notifications ?? (data?.notifications !== undefined ? data.notifications : []);
  const activities = apiData?.activities ?? (data?.activities !== undefined ? data.activities : []);
  const topLocations = apiData?.topLocations ?? (data?.topLocations !== undefined ? data.topLocations : []);
  const metrics = apiData?.metrics ?? data?.metrics;

  const handleDelete = async (id: string | number) => {
    if (onDeleteListing) {
      onDeleteListing(id);
    } else {
      const item = allListings.find((l) => l.id === id);
      if (!window.confirm(`Delete "${item?.title}"? This cannot be undone.`)) return;
      try {
        if (item?.type === 'LAND') {
          await deleteLand(String(id));
          setFetchedLands((prev) => prev.filter((l) => l.id !== id));
        } else {
          // PROPERTY: use deleteListingApi
          await deleteListingApi(String(id), 'PROPERTY');
          setFetchedProperties((prev) => prev.filter((l) => l.id !== id));
        }
      } catch {
        // Optimistically remove from UI on error too
        if (item?.type === 'LAND') {
          setFetchedLands((prev) => prev.filter((l) => l.id !== id));
        } else {
          setFetchedProperties((prev) => prev.filter((l) => l.id !== id));
        }
      }
    }
  };

  const handleStatusChange = async (id: string | number) => {
    if (onToggleStatus) {
      onToggleStatus(id);
    } else {
      const item = allListings.find((l) => l.id === id);
      const nextStatus = item?.status === 'Active' ? 'Pending' : item?.status === 'Pending' ? 'Inactive' : 'Active';
      try {
        await updateListingStatusApi(String(id), item?.type || 'PROPERTY', nextStatus);
        if (item?.type === 'LAND') {
          setFetchedLands((prev) => prev.map((l) => l.id === id ? { ...l, status: nextStatus as any } : l));
        } else {
          setFetchedProperties((prev) => prev.map((l) => l.id === id ? { ...l, status: nextStatus as any } : l));
        }
      } catch {
        if (item?.type === 'LAND') {
          setFetchedLands((prev) => prev.map((l) => l.id === id ? { ...l, status: nextStatus as any } : l));
        } else {
          setFetchedProperties((prev) => prev.map((l) => l.id === id ? { ...l, status: nextStatus as any } : l));
        }
      }
    }
  };

  // ─── Skeleton Loading State ─────────────────────────────────────────────
  if (isLoading || fetching) {
    return (
      <div className="p-6 lg:p-8 space-y-8 w-full max-w-[1400px] mx-auto animate-pulse">
        <div className="h-12 bg-gray-200 rounded-2xl w-1/3" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-72 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full font-normal text-[#111827] flex flex-col xl:flex-row items-start min-h-screen">
      
      {/* Main Agent Scrolling Content Area */}
      <div className="flex-1 min-w-0 space-y-8 w-full p-4 sm:p-6 lg:p-8">
        
        {/* Top Header Bar */}
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

        {/* Header Title */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">Agent Dashboard</h1>
          <p className="text-xs sm:text-sm text-gray-500 font-semibold">Manage your properties, lands, and performance metrics</p>
        </div>

        {/* A. 4 Top KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Properties', val: metrics?.totalPropertiesCount ?? 0, change: metrics?.propertiesGrowthPercent ?? '0%', icon: '/svg/home.svg', bg: 'bg-blue-50 text-[#345b79]' },
            { label: 'Total Lands', val: metrics?.totalLandsCount ?? 0, change: metrics?.landsGrowthPercent ?? '0%', icon: '/svg/land-plot-icon.svg', bg: 'bg-orange-50 text-[#be5d3f]' },
            { label: 'Total Views', val: totalViews, change: metrics?.viewsGrowthPercent ?? '0%', icon: '/svg/eye.svg', bg: 'bg-indigo-50 text-indigo-600' },
            { label: 'Saved by Users', val: metrics?.savedByUsersCount ?? 0, change: metrics?.savedGrowthPercent ?? '0%', icon: '/svg/heart.svg', bg: 'bg-rose-50 text-rose-600' },
          ].map((kpi, idx) => (
            <div key={idx} className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <div className={`size-10 rounded-xl ${kpi.bg} flex items-center justify-center shrink-0`}>
                  <img src={kpi.icon} alt="" className="size-5 opacity-80" />
                </div>
                <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {kpi.change}
                </span>
              </div>
              <div>
                <h3 className="text-2xl lg:text-3xl font-extrabold text-[#111827] leading-none mb-1">{kpi.val}</h3>
                <span className="text-[11px] font-bold text-gray-400">{kpi.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* B. Performance Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Property Performance BarChart (Recharts) */}
          <div className="lg:col-span-4 bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-extrabold text-[#111827]">Property Performance</h3>
                <p className="text-[11px] text-gray-400 font-semibold">Views over 7 months</p>
              </div>
              <span className="size-3 rounded-full bg-[#345b79]" />
            </div>
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={apiData?.propertyPerformance ?? propertyPerformanceData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }} />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: 12, fontSize: 11, fontWeight: 'bold' }} />
                  <Bar dataKey="views" fill="#345b79" radius={[6, 6, 0, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Land Performance BarChart (Recharts) */}
          <div className="lg:col-span-4 bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-extrabold text-[#111827]">Land Performance</h3>
                <p className="text-[11px] text-gray-400 font-semibold">Views over 7 months</p>
              </div>
              <span className="size-3 rounded-full bg-[#be5d3f]" />
            </div>
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={apiData?.landPerformance ?? landPerformanceData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }} />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: 12, fontSize: 11, fontWeight: 'bold' }} />
                  <Bar dataKey="views" fill="#be5d3f" radius={[6, 6, 0, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Views (Recharts) & Buyer Interest */}
          <div className="lg:col-span-4 bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#111827]">Monthly Views</h3>
                <p className="text-[11px] text-gray-400 font-semibold">Total visits over 7 months</p>
              </div>
              <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">+34%</span>
            </div>
            
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={apiData?.monthlyViews ?? monthlyViewsData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }} />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: 12, fontSize: 11, fontWeight: 'bold' }} />
                  <Bar dataKey="views" fill="#345b79" radius={[6, 6, 0, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-amber-50/60 border border-amber-200/60 p-3 rounded-xl flex items-center justify-between">
              <span className="text-xs font-bold text-[#111827]">Buyer Interest Matches</span>
              <span className="text-xs font-extrabold text-[#be5d3f]">+34% this month</span>
            </div>
          </div>

        </div>

        {/* C. Featured Card, Activity & Insights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Featured Listing Card */}
          {(() => {
            const featuredItem = dynamicMostViewedListing ? {
              title: dynamicMostViewedListing.title,
              location: dynamicMostViewedListing.type === 'PROPERTY' ? 'Prime Property' : 'Prime Land',
              details: dynamicMostViewedListing.type === 'PROPERTY' ? 'Active Listing' : 'Land Plot',
              views: dynamicMostViewedListing.views,
              saved: dynamicMostViewedListing.saved,
              imageUrl: dynamicMostViewedListing.imageUrl,
              id: dynamicMostViewedListing.id,
              type: dynamicMostViewedListing.type,
            } : ((apiData as any)?.mostViewedListing || (listings.length > 0 ? {
              title: listings[0].title,
              location: listings[0].type === 'PROPERTY' ? 'Prime Property' : 'Prime Land',
              details: listings[0].type === 'PROPERTY' ? 'Active Listing' : 'Land Plot',
              views: listings[0].views || 1850,
              saved: listings[0].saved || 142,
              imageUrl: listings[0].imageUrl || '/hero_property.png',
              id: listings[0].id,
              type: listings[0].type,
            } : null));

            return featuredItem ? (
              <div className="lg:col-span-5 bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm flex flex-col justify-between">
                <div className="h-[180px] w-full overflow-hidden relative">
                  <img src={featuredItem.imageUrl} alt={featuredItem.title} className="size-full object-cover" />
                  <span className="absolute top-4 left-4 bg-amber-500 text-white text-[9px] font-extrabold tracking-widest px-2.5 py-1 rounded-full shadow-sm uppercase">
                    MOST VIEWED
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-[#111827]">{featuredItem.title}</h3>
                    <p className="text-xs text-gray-500 font-semibold mt-0.5">{featuredItem.location || featuredItem.details}</p>
                    <div className="flex items-center gap-4 text-xs font-bold text-gray-500 mt-2">
                      <span className="flex items-center gap-1.5"><img src="/svg/eye.svg" alt="" className="size-3.5 opacity-70" /> {Number(featuredItem.views).toLocaleString()} views</span>
                      <span className="flex items-center gap-1.5"><img src="/svg/heart.svg" alt="" className="size-3.5 opacity-70" /> {Number(featuredItem.saved).toLocaleString()} saved</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button 
                      onClick={() => {
                        if (featuredItem.type === 'LAND') {
                          navigate(`/land/detail/${featuredItem.id}`);
                        } else {
                          navigate(`/property-listing/${featuredItem.id}`);
                        }
                      }}
                      className="flex-1 bg-[#345b79] text-white text-xs font-extrabold py-2.5 rounded-xl text-center hover:bg-[#2a4a63] transition-colors cursor-pointer"
                    >
                      View Listing
                    </button>
                    <button 
                      onClick={() => {
                        if (featuredItem.type === 'LAND') {
                          navigate(`/dashboard/agent/add-land`);
                        } else {
                          navigate(`/dashboard/agent/add-property`);
                        }
                      }}
                      className="flex-1 bg-gray-100 text-[#111827] text-xs font-extrabold py-2.5 rounded-xl border border-gray-200 hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="lg:col-span-5 bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex items-center justify-center text-gray-400 text-xs font-bold">
                No featured listing available.
              </div>
            );
          })()}

          {/* Recent Activity */}
          <div className="lg:col-span-4 bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
            <h3 className="text-base font-extrabold text-[#111827]">Recent Activity</h3>
            <div className="space-y-4 flex-1">
              {activities.map((act) => (
                <div key={act.id} className="flex items-start gap-3">
                  <div className="size-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                    <img src={act.type === 'views' ? '/svg/eye.svg' : act.type === 'saved' ? '/svg/heart.svg' : '/svg/email.svg'} alt="" className="size-4 opacity-70" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#111827] leading-snug">{act.description}</p>
                    <span className="text-[9px] font-bold text-gray-400 block mt-0.5 uppercase">{act.timeAgo}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Locations */}
          <div className="lg:col-span-3 bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
            <h3 className="text-base font-extrabold text-[#111827]">Top Locations</h3>
            <div className="space-y-3.5 flex-1">
              {topLocations.map((loc, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-[#111827]">
                    <span>{loc.locationName}</span>
                    <span className="text-gray-500">{loc.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#345b79] h-full rounded-full" style={{ width: `${loc.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>



        {/* E. Bottom Views Summaries */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-blue-50 text-[#345b79] flex items-center justify-center">
                <img src="/svg/home.svg" alt="" className="size-6 opacity-80" />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Property Views</span>
                <h4 className="text-2xl font-extrabold text-[#111827]">{totalPropertiesViews}</h4>
              </div>
            </div>
            <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">{totalPropertiesViews ? '+15% this month' : '0%'}</span>
          </div>

          <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-orange-50 text-[#be5d3f] flex items-center justify-center">
                <img src="/svg/land-plot-icon.svg" alt="" className="size-6 opacity-80" />
              </div>
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Land Views</span>
                <h4 className="text-2xl font-extrabold text-[#111827]">{totalLandsViews}</h4>
              </div>
            </div>
            <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">{totalLandsViews ? '+9% this month' : '0%'}</span>
          </div>
        </div>

        {/* F. Latest Listings Table */}
        <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-lg font-extrabold text-[#111827]">Latest Listings</h3>
              <p className="text-[11px] text-gray-400 font-semibold mt-0.5">
                {allListings.length} total · {allListings.filter(l => l.type === 'PROPERTY').length} properties · {allListings.filter(l => l.type === 'LAND').length} lands
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Tab filter */}
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                {(['all', 'property', 'land'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-[10px] font-extrabold px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                      activeTab === tab
                        ? 'bg-white text-[#345b79] shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab === 'all' ? 'All' : tab === 'property' ? 'Properties' : 'Lands'}
                  </button>
                ))}
              </div>
              {/* Add New buttons */}
              <Link
                to="/dashboard/agent/add-property"
                className="text-[10px] font-extrabold text-white bg-[#345b79] hover:bg-[#2a4a63] px-3 py-1.5 rounded-xl transition-colors"
              >
                + Add Property
              </Link>
              <Link
                to="/dashboard/agent/add-land"
                className="text-[10px] font-extrabold text-white bg-[#be5d3f] hover:bg-[#a64e33] px-3 py-1.5 rounded-xl transition-colors"
              >
                + Add Land
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                  <th className="pb-3 px-3">THUMB</th>
                  <th className="pb-3 px-3">TITLE</th>
                  <th className="pb-3 px-3">STATUS</th>
                  <th className="pb-3 px-3">VIEWS</th>
                  <th className="pb-3 px-3">SAVED</th>
                  <th className="pb-3 px-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {listings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400 font-semibold text-xs">
                      {activeTab === 'land'
                        ? 'No land listings found. Click <strong>+ Add Land</strong> to create one.'
                        : activeTab === 'property'
                        ? 'No property listings found.'
                        : 'No listings found yet.'}
                    </td>
                  </tr>
                ) : (
                  listings.map((item) => (
                    <tr key={`${item.type}-${item.id}`} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-3">
                        <img src={item.imageUrl} alt={item.title} className="size-12 rounded-xl object-cover" />
                      </td>
                      <td className="py-3 px-3">
                        <h4 className="font-bold text-[#111827]">{item.title}</h4>
                        <span
                          className={`text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase block mt-0.5 w-max ${
                            item.type === 'LAND'
                              ? 'bg-orange-50 text-[#be5d3f]'
                              : 'bg-blue-50 text-[#345b79]'
                          }`}
                        >
                          {item.type === 'LAND' ? '🌱 Land' : '🏠 Property'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => handleStatusChange(item.id)}
                          className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full cursor-pointer transition-transform hover:scale-105 ${
                            item.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-700'
                              : item.status === 'Pending'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {item.status}
                        </button>
                      </td>
                      <td className="py-3 px-3 font-bold text-[#111827]">{item.views.toLocaleString()}</td>
                      <td className="py-3 px-3 font-bold text-[#111827]">{item.saved}</td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* View */}
                          <button
                            onClick={() => {
                              if (onViewListing) {
                                onViewListing(item.id, item.type);
                              } else if (item.type === 'LAND') {
                                navigate(`/land/detail/${item.id}`);
                              } else {
                                navigate(`/property-listing/${item.id}`);
                              }
                            }}
                            className="size-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                            title="View Listing"
                          >
                            <img src="/svg/eye.svg" alt="View" className="size-4 opacity-70" />
                          </button>
                          {/* Edit */}
                          <button
                            onClick={() => {
                              if (item.type === 'LAND') {
                                navigate(`/dashboard/agent/add-land`);
                              } else {
                                navigate(`/dashboard/agent/add-property`);
                              }
                            }}
                            className="size-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                            title="Edit Listing"
                          >
                            <svg className="size-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="size-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors"
                            title="Delete Listing"
                          >
                            <svg className="size-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
