import React, { useState } from 'react';

// ─── 1. Comprehensive Backend Interfaces ───────────────────────────────────

export interface AdminKPICardData {
  name: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  icon: string;
  color: string;
}

export interface GovernanceListingItem {
  id: string;
  title: string;
  type: 'Property' | 'Land';
  owner: string;
  district: string;
  price: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface AdminUserRegistrationItem {
  name: string;
  email: string;
  role: string;
  district: string;
  date: string;
  status: 'Active' | 'Pending';
}

export interface AdminListingCardItem {
  id: string;
  title: string;
  location: string;
  price: string;
  type: string;
  status: string;
  imageUrl?: string;
}

export interface PopularDistrictItem {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface AdminActivityItem {
  text: string;
  time: string;
  type: 'user' | 'listing' | 'system' | 'company';
}

export interface AdminNotificationItem {
  text: string;
  type: 'warning' | 'info' | 'critical';
}

export interface AdminAIAnalyticsData {
  recommendationsToday?: number | string;
  avgMatchScore?: string;
  convertedToViews?: number | string;
  leadsGenerated?: number | string;
}

export interface AdminDashboardPageData {
  kpiStats?: AdminKPICardData[];
  userGrowthBars?: number[];
  propertyGrowthBars?: number[];
  landGrowthBars?: number[];
  aiAnalytics?: AdminAIAnalyticsData;
  governanceListings?: GovernanceListingItem[];
  recentRegistrations?: AdminUserRegistrationItem[];
  latestProperties?: AdminListingCardItem[];
  latestLands?: AdminListingCardItem[];
  popularDistricts?: PopularDistrictItem[];
  activities?: AdminActivityItem[];
  notifications?: AdminNotificationItem[];
}

export interface AdminDashboardProps {
  data?: AdminDashboardPageData | null;
  isLoading?: boolean;
  error?: string | null;
  onApproveGovernance?: (id: string) => void;
  onRejectGovernance?: (id: string) => void;
  onViewAllUsers?: () => void;
  onViewAllProperties?: () => void;
}

// ─── Mock Fallback Data ─────────────────────────────────────────────────────

const defaultKpis: AdminKPICardData[] = [
  { name: 'Total Users', value: '12,480', change: '+8.2%', isPositive: true, icon: '/svg/agent.svg', color: 'bg-[#345b79]/10 text-[#345b79]' },
  { name: 'Total Properties', value: '4,852', change: '+5.4%', isPositive: true, icon: '/svg/home.svg', color: 'bg-[#495d38]/10 text-[#495d38]' },
  { name: 'Total Lands', value: '2,316', change: '+3.1%', isPositive: true, icon: '/svg/land-plot-icon.svg', color: 'bg-[#be5d3f]/10 text-[#be5d3f]' },
  { name: 'Total Companies', value: '348', change: '+2.8%', isPositive: true, icon: '/svg/construction.svg', color: 'bg-[#6b879c]/10 text-[#6b879c]' }
];

const defaultUserBars = [38, 48, 43, 57, 72, 62, 76, 91];
const defaultPropertyBars = [28, 33, 38, 52, 48, 62, 81, 86];
const defaultLandBars = [19, 28, 24, 43, 38, 57, 72, 81];

const defaultGovernanceListings: GovernanceListingItem[] = [
  { id: 'G1', title: '3-Bed Apartment', type: 'Property', owner: 'Kofi Acheampong', district: 'Spintex', price: 'LKR 680K', status: 'Pending' },
  { id: 'G2', title: 'Industrial Plot 4A', type: 'Land', owner: 'BuildRight Ltd.', district: 'Tema', price: 'LKR 320K', status: 'Pending' }
];

const defaultRegistrations: AdminUserRegistrationItem[] = [
  { name: 'Amara Diallo', email: 'amara.diallo@email.com', role: 'Property Buyer', district: 'Accra Central', date: 'Dec 12, 2024', status: 'Active' },
  { name: 'James Osei', email: 'james.osei@email.com', role: 'Architect', district: 'East Legon', date: 'Dec 11, 2024', status: 'Pending' },
  { name: 'Priya Sharma', email: 'priya.sharma@email.com', role: 'Land Buyer', district: 'Airport Res.', date: 'Dec 11, 2024', status: 'Active' }
];

const defaultProperties: AdminListingCardItem[] = [
  { id: '1', title: '4-Bed Luxury Villa', location: 'East Legon, Accra', price: 'LKR 2.4M', type: 'SALE', status: 'Pending', imageUrl: '/property_card_1.png' },
  { id: '2', title: 'Commercial Office', location: 'Airport City, Accra', price: 'LKR 850K', type: 'RENT', status: 'Active', imageUrl: '/property_card_2.png' }
];

const defaultLands: AdminListingCardItem[] = [
  { id: '3', title: 'Residential Plot 12', location: 'Adenta, Accra • 500 sqm', price: 'LKR 85K', type: 'LAND', status: 'Active', imageUrl: '/property_card_3.png' },
  { id: '4', title: 'Commercial Land B4', location: 'Tema Industrial • 2000 sqm', price: 'LKR 420K', type: 'LAND', status: 'Pending', imageUrl: '/property_card_4.png' }
];

const defaultDistricts: PopularDistrictItem[] = [
  { name: 'East Legon', count: 284, percentage: 85, color: 'bg-[#345b79]' },
  { name: 'Airport City', count: 218, percentage: 70, color: 'bg-[#be5d3f]' },
  { name: 'Labone', count: 195, percentage: 60, color: 'bg-[#928d64]' },
  { name: 'Tema', count: 162, percentage: 50, color: 'bg-[#345b79]' }
];

const defaultActivities: AdminActivityItem[] = [
  { text: 'Amara Diallo registered as Property Buyer', time: '10 mins ago', type: 'user' },
  { text: 'James Harrington added Skyline Residences listing', time: '1 hour ago', type: 'listing' },
  { text: 'System backup completed successfully', time: '2 hours ago', type: 'system' },
  { text: 'New verification request from ArchTech Ltd', time: '4 hours ago', type: 'company' }
];

const defaultNotifications: AdminNotificationItem[] = [
  { text: '3 pending agent verifications require review', type: 'warning' },
  { text: 'API usage limits reached 85% of monthly quota', type: 'info' },
  { text: 'Server response time spike detected in Region East', type: 'critical' }
];

// ─── Component Implementation ───────────────────────────────────────────────

export default function AdminDashboard({
  data = null,
  isLoading = false,
  error = null,
  onApproveGovernance,
  onRejectGovernance,
  onViewAllUsers,
  onViewAllProperties
}: AdminDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [governanceState, setGovernanceState] = useState<GovernanceListingItem[]>([]);

  const kpis = data?.kpiStats || defaultKpis;
  const userGrowthBars = data?.userGrowthBars || defaultUserBars;
  const propertyGrowthBars = data?.propertyGrowthBars || defaultPropertyBars;
  const landGrowthBars = data?.landGrowthBars || defaultLandBars;
  const governanceListings = data?.governanceListings !== undefined 
    ? data.governanceListings 
    : (governanceState.length > 0 ? governanceState : defaultGovernanceListings);
  const registrations = data?.recentRegistrations || defaultRegistrations;
  const latestProperties = data?.latestProperties || defaultProperties;
  const latestLands = data?.latestLands || defaultLands;
  const popularDistricts = data?.popularDistricts || defaultDistricts;
  const activities = data?.activities || defaultActivities;
  const notifications = data?.notifications || defaultNotifications;

  const handleApprove = (id: string) => {
    if (onApproveGovernance) {
      onApproveGovernance(id);
    } else {
      setGovernanceState(prev => {
        const source = prev.length > 0 ? prev : defaultGovernanceListings;
        return source.map(item => item.id === id ? { ...item, status: 'Approved' } : item);
      });
    }
  };

  const handleReject = (id: string) => {
    if (onRejectGovernance) {
      onRejectGovernance(id);
    } else {
      setGovernanceState(prev => {
        const source = prev.length > 0 ? prev : defaultGovernanceListings;
        return source.map(item => item.id === id ? { ...item, status: 'Rejected' } : item);
      });
    }
  };

  // ─── 2. Skeleton Loading State ─────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col gap-6 p-6 lg:p-8 animate-pulse max-w-[1400px] mx-auto">
        <div className="h-16 bg-gray-200 rounded-2xl w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-36 bg-gray-200 rounded-2xl" />
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded-2xl w-full" />
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col lg:flex-row overflow-hidden bg-gradient-to-r from-[#e6e0d4] to-[#fcf9f8]">
      
      {/* Mobile Drawer Trigger Header */}
      <header className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <svg className="size-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-[#1b1b1b]">Admin Dashboard</h1>
        </div>
      </header>

      {/* Main Content Scroll Container */}
      <main className="flex-1 h-full overflow-y-auto p-6 lg:p-8 space-y-8 max-w-[1400px]">
        
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

        {/* TOP ROW KPI METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {kpis.map((kpi) => (
            <div key={kpi.name} className="bg-white border border-[#ccb7a3]/20 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-44 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${kpi.color}`}>
                  <img src={kpi.icon} alt="" className="size-5" />
                </div>
                <div className="bg-emerald-50 px-2 py-1 rounded text-emerald-700 text-xs font-bold flex items-center gap-1">
                  <span>↑</span>
                  <span>{kpi.change}</span>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-[#1b1b1b]">{kpi.value}</h3>
              </div>
              <div className="mt-3">
                <span className="text-xs font-semibold text-[#72787e] tracking-wider uppercase">{kpi.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* TREND GROWTH CHARTS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* User Growth Chart */}
          <div className="bg-white border border-[#ccb7a3]/20 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-64">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-[#72787e] tracking-wider uppercase block">User Growth</span>
                <h4 className="text-xl font-bold text-[#1b1b1b] mt-1">12,480 <span className="text-emerald-600 text-xs font-normal pl-1">↑ 8.2%</span></h4>
              </div>
              <span className="text-xs font-semibold text-[#72787e] text-right">Last 12 mo</span>
            </div>
            <div className="flex items-end justify-between h-24 px-2 mt-4">
              {userGrowthBars.map((val, idx) => (
                <div
                  key={idx}
                  className={`w-3 rounded-t transition-all ${idx === userGrowthBars.length - 1 ? 'bg-[#345b79]' : 'bg-[#345b79]/20'}`}
                  style={{ height: `${val}%` }}
                />
              ))}
            </div>
          </div>

          {/* Property Growth Chart */}
          <div className="bg-white border border-[#ccb7a3]/20 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-64">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-[#72787e] tracking-wider uppercase block">Property Growth</span>
                <h4 className="text-xl font-bold text-[#1b1b1b] mt-1">4,852 <span className="text-emerald-600 text-xs font-normal pl-1">↑ 5.4%</span></h4>
              </div>
              <span className="text-xs font-semibold text-[#72787e] text-right">Last 12 mo</span>
            </div>
            <div className="flex items-end justify-between h-24 px-2 mt-4">
              {propertyGrowthBars.map((val, idx) => (
                <div
                  key={idx}
                  className={`w-3 rounded-t transition-all ${idx === propertyGrowthBars.length - 1 ? 'bg-[#be5d3f]' : 'bg-[#be5d3f]/20'}`}
                  style={{ height: `${val}%` }}
                />
              ))}
            </div>
          </div>

          {/* Land Growth Chart */}
          <div className="bg-white border border-[#ccb7a3]/20 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-64">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-[#72787e] tracking-wider uppercase block">Land Growth</span>
                <h4 className="text-xl font-bold text-[#1b1b1b] mt-1">2,316 <span className="text-emerald-600 text-xs font-normal pl-1">↑ 3.1%</span></h4>
              </div>
              <span className="text-xs font-semibold text-[#72787e] text-right">Last 12 mo</span>
            </div>
            <div className="flex items-end justify-between h-24 px-2 mt-4">
              {landGrowthBars.map((val, idx) => (
                <div
                  key={idx}
                  className={`w-3 rounded-t transition-all ${idx === landGrowthBars.length - 1 ? 'bg-[#928d64]' : 'bg-[#928d64]/20'}`}
                  style={{ height: `${val}%` }}
                />
              ))}
            </div>
          </div>

        </div>

        {/* AI RECOMMENDATION ANALYTICS */}
        <div className="bg-[#194360] border border-[#ccb7a3]/20 rounded-2xl p-6 lg:p-8 shadow-sm text-white relative overflow-hidden flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h3 className="text-2xl font-bold tracking-tight">AI Recommendation Analytics</h3>
            <p className="text-xs text-white/80 font-normal">Powered by NexaAI Engine • Real-time matching and verification</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col gap-1">
              <img src="/svg/sparks-icon.svg" alt="" className="size-5 filter invert" />
              <h4 className="text-3xl font-bold">{data?.aiAnalytics?.recommendationsToday ?? '1,842'}</h4>
              <span className="text-[10px] font-bold text-white/70 tracking-wider uppercase">RECOMMENDATIONS TODAY</span>
            </div>
            <div className="flex flex-col gap-1">
              <img src="/svg/checkMark.svg" alt="" className="size-5 filter invert" />
              <h4 className="text-3xl font-bold">{data?.aiAnalytics?.avgMatchScore ?? '87.4%'}</h4>
              <span className="text-[10px] font-bold text-white/70 tracking-wider uppercase">AVG. MATCH SCORE</span>
            </div>
            <div className="flex flex-col gap-1">
              <img src="/svg/eye.svg" alt="" className="size-5 filter invert" />
              <h4 className="text-3xl font-bold">{data?.aiAnalytics?.convertedToViews ?? '643'}</h4>
              <span className="text-[10px] font-bold text-white/70 tracking-wider uppercase">CONVERTED TO VIEWS</span>
            </div>
            <div className="flex flex-col gap-1">
              <img src="/svg/email.svg" alt="" className="size-5 filter invert" />
              <h4 className="text-3xl font-bold">{data?.aiAnalytics?.leadsGenerated ?? '127'}</h4>
              <span className="text-[10px] font-bold text-white/70 tracking-wider uppercase">LEADS GENERATED</span>
            </div>
          </div>
        </div>

        {/* GOVERNANCE PENDING LISTINGS */}
        <div className="bg-white border border-[#ccb7a3]/20 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#1b1b1b]">Pending Listings Governance</h3>
            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded text-xs font-bold">
              {governanceListings.filter(i => i.status === 'Pending').length} Awaiting Review
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">LISTING</th>
                  <th className="pb-3">TYPE</th>
                  <th className="pb-3">OWNER</th>
                  <th className="pb-3">DISTRICT</th>
                  <th className="pb-3">PRICE</th>
                  <th className="pb-3 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {governanceListings.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 font-bold text-[#1b1b1b]">{item.title}</td>
                    <td className="py-4"><span className="bg-gray-100 px-2 py-0.5 rounded font-bold">{item.type}</span></td>
                    <td className="py-4 text-gray-600">{item.owner}</td>
                    <td className="py-4 text-gray-600">{item.district}</td>
                    <td className="py-4 font-bold">{item.price}</td>
                    <td className="py-4 text-right">
                      {item.status === 'Pending' ? (
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => handleReject(item.id)} className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1 rounded font-bold">
                            Reject
                          </button>
                          <button onClick={() => handleApprove(item.id)} className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1 rounded font-bold">
                            Approve
                          </button>
                        </div>
                      ) : (
                        <span className={`font-bold uppercase ${item.status === 'Approved' ? 'text-emerald-600' : 'text-red-600'}`}>
                          {item.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RECENT REGISTRATIONS TABLE */}
        <div className="bg-white border border-[#ccb7a3]/20 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#1b1b1b]">Recent Registrations</h3>
            <button onClick={onViewAllUsers} className="text-xs font-bold text-[#345b79] hover:underline">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">USER</th>
                  <th className="py-3 px-4">ROLE</th>
                  <th className="py-3 px-4">DISTRICT</th>
                  <th className="py-3 px-4">DATE</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {registrations.map((user) => (
                  <tr key={user.email} className="hover:bg-gray-50/30">
                    <td className="py-3.5 px-4 font-bold text-[#1b1b1b]">
                      <div>{user.name}</div>
                      <div className="text-[10px] text-gray-400 font-normal">{user.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 font-bold">{user.role}</td>
                    <td className="py-3.5 px-4 text-gray-600 font-medium">{user.district}</td>
                    <td className="py-3.5 px-4 text-gray-400">{user.date}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        user.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button className="text-xs font-bold text-[#345b79] hover:underline">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Right Column Notifications & Health Panel */}
      <aside className={`w-full lg:w-80 shrink-0 border-l border-[#ccb7a3]/30 bg-white p-6 space-y-8 overflow-y-auto ${
        sidebarOpen ? 'block' : 'hidden lg:block'
      }`}>
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#1b1b1b]">Notifications</h3>
          <div className="space-y-3">
            {notifications.map((n, idx) => (
              <div key={idx} className="p-3 rounded-xl text-xs font-semibold bg-gray-50 border border-gray-100 flex gap-2 items-start">
                <img src="/svg/info.svg" alt="" className="size-4 shrink-0 mt-0.5" />
                <span>{n.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#1b1b1b]">Recent Activities</h3>
          <div className="space-y-3 text-xs">
            {activities.map((act, idx) => (
              <div key={idx} className="flex flex-col border-b border-gray-50 pb-2">
                <p className="font-semibold text-gray-800">{act.text}</p>
                <span className="text-[10px] text-gray-400">{act.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#1b1b1b]">System Health</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold text-gray-600 mb-1"><span>Server CPU</span><span>34%</span></div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="bg-emerald-600 h-full" style={{ width: '34%' }} /></div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold text-gray-600 mb-1"><span>RAM Usage</span><span>56%</span></div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="bg-amber-600 h-full" style={{ width: '56%' }} /></div>
            </div>
          </div>
        </div>
      </aside>

    </div>
  );
}
