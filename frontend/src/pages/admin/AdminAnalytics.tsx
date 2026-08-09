import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { adminApi } from '../../services/adminApi';
import type { AdminAnalyticsData } from '../../services/adminApi';

export interface AdminAnalyticsProps {
  data?: AdminAnalyticsData | null;
  isLoading?: boolean;
  error?: string | null;
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const defaultPropertyLandGrowth = months.map((m) => ({
  month: m,
  properties: 0,
  land: 0,
}));

const defaultUserRegistrations = months.map((m) => ({
  month: m,
  users: 0,
}));

const sparklineData = [
  { val: 10 }, { val: 15 }, { val: 13 }, { val: 20 }, { val: 18 }, { val: 25 }, { val: 30 }
];

const sparkbarData = [
  { val: 20 }, { val: 35 }, { val: 25 }, { val: 40 }, { val: 30 }, { val: 50 }
];

// Colors for Donut Charts
const PROPERTY_TYPE_COLORS = ['#194360', '#be5d3f', '#928d64', '#345b79'];
const LAND_CATEGORY_COLORS = ['#495d38', '#194360', '#be5d3f', '#928d64'];
const USER_ROLE_COLORS = ['#194360', '#be5d3f', '#928d64', '#345b79'];

export default function AdminAnalytics({
  data: propsData = null,
  isLoading: propsLoading = false,
  error: propsError = null,
}: AdminAnalyticsProps) {
  const [analyticsData, setAnalyticsData] = useState<AdminAnalyticsData | null>(propsData);
  const [loading, setLoading] = useState<boolean>(!propsData && propsLoading);
  const [error, setError] = useState<string | null>(propsError);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getAnalyticsData();
      setAnalyticsData(res);
    } catch (err: any) {
      console.error('Failed to fetch analytics data:', err);
      setError('Failed to load system analytics data from backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!propsData) {
      fetchAnalytics();
    }
  }, [propsData]);

  const overview = analyticsData?.overviewMetrics || {
    totalTrafficCount: 0,
    avgSessionDuration: '0m 0s',
    conversionRatePercent: '0%',
    aiMatchesCount: 0,
  };

  const propertyBreakdown = analyticsData?.propertyTypeBreakdown || [
    { type: 'Residential', count: 0, percentage: 0 },
    { type: 'Commercial', count: 0, percentage: 0 },
    { type: 'Industrial', count: 0, percentage: 0 },
    { type: 'Land', count: 0, percentage: 0 },
  ];

  const landCategories = [
    { name: 'Agricultural', percentage: 0 },
    { name: 'Residential Plot', percentage: 0 },
    { name: 'Commercial Plot', percentage: 0 },
    { name: 'Mixed-Use', percentage: 0 },
  ];

  const userBreakdown = [
    { name: 'Buyers', percentage: 0 },
    { name: 'Architects', percentage: 0 },
    { name: 'Contractors', percentage: 0 },
    { name: 'Agents', percentage: 0 },
  ];

  const topDistricts = [
    { rank: 1, name: 'Colombo Central', views: '0 views', listings: 0, growth: '0%' },
    { rank: 2, name: 'Kandy City', views: '0 views', listings: 0, growth: '0%' },
    { rank: 3, name: 'Galle Fort', views: '0 views', listings: 0, growth: '0%' },
    { rank: 4, name: 'Negombo Coastal', views: '0 views', listings: 0, growth: '0%' },
    { rank: 5, name: 'Nuwara Eliya', views: '0 views', listings: 0, growth: '0%' },
  ];

  const searchedLocations = [
    { name: 'Colombo 03', count: '0' },
    { name: 'Kandy Town', count: '0' },
    { name: 'Galle Coastal', count: '0' },
    { name: 'Mount Lavinia', count: '0' },
    { name: 'Battaramulla', count: '0' },
  ];

  // Skeleton Loading State
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#e6e0d4]/40 p-6 lg:p-8 animate-pulse space-y-6 max-w-[1400px] mx-auto">
        <div className="h-16 bg-gray-200 rounded-2xl w-full" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-2xl" />
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded-2xl w-full" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#e6e0d4]/40 p-4 sm:p-6 lg:p-8 space-y-6 text-[#1d1d1d]">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-bold mb-1">
            <span>Admin</span>
            <span>›</span>
            <span className="text-[#345b79]">Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1d1d1d]">Analytics Dashboard</h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
            Platform-wide insights, market trends & AI performance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select className="bg-white border border-gray-200/80 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-700 focus:outline-none cursor-pointer shadow-sm">
            <option>Dec 1 - Dec 31, 2024</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>Year to Date</option>
          </select>

          <button
            type="button"
            onClick={() => {
              alert('Exporting analytics report...');
            }}
            className="bg-[#194360] hover:bg-[#123249] text-white text-xs font-extrabold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <svg className="size-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="w-full bg-red-50 border border-red-200 text-red-700 text-xs p-4 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <svg className="size-5 text-red-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold">{error}</span>
          </div>
          <button onClick={fetchAnalytics} className="text-xs bg-red-100 px-3 py-1.5 rounded-lg hover:bg-red-200 font-bold cursor-pointer">
            Retry
          </button>
        </div>
      )}

      {/* ROW 1: 4 PRIMARY METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {[
          { label: 'Monthly Active Users', val: overview.totalTrafficCount, sub: 'vs last month', change: '0%', isPositive: true, icon: 'users' },
          { label: 'Active Listings', val: overview.aiMatchesCount, sub: 'properties & land', change: '0%', isPositive: true, icon: 'folder' },
          { label: 'Saved Listings', val: '0', sub: 'total saves this month', change: '0%', isPositive: true, icon: 'bookmark' },
          { label: 'Total Views', val: overview.totalTrafficCount, sub: 'page impressions', change: '0%', isPositive: false, icon: 'eye' }
        ].map((card, idx) => (
          <div key={idx} className="bg-white rounded-[20px] p-5 border border-gray-200/60 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="size-9 rounded-xl bg-[#345b79]/10 text-[#345b79] flex items-center justify-center shrink-0">
                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {card.icon === 'users' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />}
                  {card.icon === 'folder' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />}
                  {card.icon === 'bookmark' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />}
                  {card.icon === 'eye' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />}
                </svg>
              </div>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${card.isPositive ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                {card.change}
              </span>
            </div>
            <div>
              <h3 className="text-2xl lg:text-3xl font-black text-[#1d1d1d] tracking-tight">{card.val}</h3>
              <span className="text-[11px] font-bold text-gray-700 block mt-0.5">{card.label}</span>
              <span className="text-[9px] text-gray-400 font-semibold">{card.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ROW 2: 4 TREND MINI-CHART CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        
        {/* Avg Property Price */}
        <div className="bg-white rounded-[20px] p-4 border border-gray-200/60 shadow-sm flex flex-col justify-between h-28">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-500 uppercase">Avg. Property Price</span>
            <span className="text-[10px] font-extrabold text-emerald-600">+0%</span>
          </div>
          <div className="flex items-end justify-between">
            <h4 className="text-lg font-black text-[#1d1d1d]">LKR 0</h4>
            <div className="h-8 w-20">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData}>
                  <Area type="monotone" dataKey="val" stroke="#345b79" fill="#345b79" fillOpacity={0.15} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Avg Land Price */}
        <div className="bg-white rounded-[20px] p-4 border border-gray-200/60 shadow-sm flex flex-col justify-between h-28">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-500 uppercase">Avg. Land Price/Perch</span>
            <span className="text-[10px] font-extrabold text-emerald-600">+0%</span>
          </div>
          <div className="flex items-end justify-between">
            <h4 className="text-lg font-black text-[#1d1d1d]">LKR 0</h4>
            <div className="h-8 w-20">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData}>
                  <Area type="monotone" dataKey="val" stroke="#be5d3f" fill="#be5d3f" fillOpacity={0.15} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Days on Market */}
        <div className="bg-white rounded-[20px] p-4 border border-gray-200/60 shadow-sm flex flex-col justify-between h-28">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-500 uppercase">Days on Market</span>
            <span className="text-[10px] font-extrabold text-emerald-600">0%</span>
          </div>
          <div className="flex items-end justify-between">
            <h4 className="text-lg font-black text-[#1d1d1d]">0 days</h4>
            <div className="h-8 w-20">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sparkbarData}>
                  <Bar dataKey="val" fill="#d1d5db" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Saved Listings */}
        <div className="bg-white rounded-[20px] p-4 border border-gray-200/60 shadow-sm flex flex-col justify-between h-28">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-500 uppercase">Saved Listings</span>
            <span className="text-[10px] font-extrabold text-emerald-600">+0%</span>
          </div>
          <div className="flex items-end justify-between">
            <h4 className="text-lg font-black text-[#1d1d1d]">0</h4>
            <div className="h-8 w-20">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData}>
                  <Area type="monotone" dataKey="val" stroke="#495d38" fill="#495d38" fillOpacity={0.15} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

      {/* ROW 3: 2 MAIN GROWTH CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Property & Land Growth BarChart */}
        <div className="lg:col-span-8 bg-white rounded-[24px] p-6 border border-gray-200/60 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-[#1d1d1d]">Property & Land Growth</h3>
              <p className="text-xs text-gray-400 font-medium">Monthly listings added — 2024</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-[#194360]" /> Properties</span>
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-[#ff906e]" /> Land</span>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={defaultPropertyLandGrowth}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                <Bar dataKey="properties" fill="#194360" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="land" fill="#ff906e" radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Registrations AreaChart */}
        <div className="lg:col-span-4 bg-white rounded-[24px] p-6 border border-gray-200/60 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-[#1d1d1d]">User Registrations</h3>
              <p className="text-xs text-gray-400 font-medium">New sign-ups per month — 2024</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-[#1d1d1d] block">0</span>
              <span className="text-[10px] font-extrabold text-emerald-600">+0%</span>
            </div>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={defaultUserRegistrations}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#9ca3af', fontWeight: 'bold' }} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                <Area type="monotone" dataKey="users" stroke="#194360" fill="#194360" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* ROW 4: TOP DISTRICTS, MOST SEARCHED LOCATIONS & AI ACCURACY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Top Districts Table */}
        <div className="lg:col-span-5 bg-white rounded-[24px] p-6 border border-gray-200/60 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-[#1d1d1d]">Top Districts</h3>
            <p className="text-xs text-gray-400 font-medium">By listing activity & views</p>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                  <th className="pb-2">#</th>
                  <th className="pb-2">DISTRICT</th>
                  <th className="pb-2 text-center">LISTINGS</th>
                  <th className="pb-2 text-right">GROWTH</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {topDistricts.map((d) => (
                  <tr key={d.rank} className="hover:bg-gray-50/50">
                    <td className="py-3 font-bold text-gray-400">{d.rank}</td>
                    <td className="py-3">
                      <span className="font-extrabold text-[#1d1d1d] block">{d.name}</span>
                      <span className="text-[9px] text-gray-400 font-semibold">{d.views}</span>
                    </td>
                    <td className="py-3 text-center font-bold text-gray-700">{d.listings}</td>
                    <td className="py-3 text-right font-extrabold text-emerald-600">{d.growth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Most Searched Locations */}
        <div className="lg:col-span-3 bg-white rounded-[24px] p-6 border border-gray-200/60 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[#1d1d1d]">Most Searched Locations</h3>
            <span className="text-xs font-bold text-[#194360] cursor-pointer hover:underline">View All →</span>
          </div>

          <div className="space-y-3 flex-1">
            {searchedLocations.map((loc, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#1d1d1d]">{loc.name}</span>
                  <span className="text-gray-400">{loc.count}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#194360] h-full rounded-full" style={{ width: '0%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendation Accuracy Donut Gauge */}
        <div className="lg:col-span-4 bg-white rounded-[24px] p-6 border border-gray-200/60 shadow-sm flex flex-col justify-between space-y-4 text-center">
          <div>
            <h3 className="text-base font-extrabold text-[#1d1d1d]">AI Recommendation Accuracy</h3>
            <p className="text-xs text-gray-400 font-medium">Based on user engagement & conversions</p>
          </div>

          <div className="relative size-44 mx-auto flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[{ name: 'Accuracy', value: 100 }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  startAngle={180}
                  endAngle={0}
                  dataKey="value"
                >
                  <Cell fill="#194360" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-6">
              <span className="text-2xl font-black text-[#1d1d1d]">0%</span>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">ACCURACY</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-3">
            <div>
              <span className="text-sm font-extrabold text-[#1d1d1d] block">0%</span>
              <span className="text-[9px] font-bold text-gray-400">Precision</span>
            </div>
            <div>
              <span className="text-sm font-extrabold text-[#1d1d1d] block">0%</span>
              <span className="text-[9px] font-bold text-gray-400">Recall</span>
            </div>
            <div>
              <span className="text-sm font-extrabold text-[#1d1d1d] block">0%</span>
              <span className="text-[9px] font-bold text-gray-400">F1 Score</span>
            </div>
          </div>
        </div>

      </div>

      {/* ROW 5: 3 CATEGORY DISTRIBUTION DONUT CHARTS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-stretch">
        
        {/* Property Types Donut Chart */}
        <div className="bg-white rounded-[24px] p-6 border border-gray-200/60 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-[#1d1d1d]">Property Types</h3>
            <p className="text-xs text-gray-400 font-medium">Distribution across all listings</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="size-28 shrink-0 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={propertyBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={45}
                    dataKey="count"
                  >
                    {propertyBreakdown.map((_, idx) => (
                      <Cell key={idx} fill={PROPERTY_TYPE_COLORS[idx % PROPERTY_TYPE_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <span className="absolute text-xs font-black text-[#1d1d1d]">0</span>
            </div>

            <div className="space-y-1.5 text-xs font-bold flex-1">
              {propertyBreakdown.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-gray-600">
                    <span className="size-2 rounded-full" style={{ backgroundColor: PROPERTY_TYPE_COLORS[idx % PROPERTY_TYPE_COLORS.length] }} />
                    {item.type}
                  </span>
                  <span className="text-[#1d1d1d] font-extrabold">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Land Categories Donut Chart */}
        <div className="bg-white rounded-[24px] p-6 border border-gray-200/60 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-[#1d1d1d]">Land Categories</h3>
            <p className="text-xs text-gray-400 font-medium">Classification of land listings</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="size-28 shrink-0 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={landCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={45}
                    dataKey="percentage"
                  >
                    {landCategories.map((_, idx) => (
                      <Cell key={idx} fill={LAND_CATEGORY_COLORS[idx % LAND_CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <span className="absolute text-xs font-black text-[#1d1d1d]">0</span>
            </div>

            <div className="space-y-1.5 text-xs font-bold flex-1">
              {landCategories.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-gray-600">
                    <span className="size-2 rounded-full" style={{ backgroundColor: LAND_CATEGORY_COLORS[idx % LAND_CATEGORY_COLORS.length] }} />
                    {item.name}
                  </span>
                  <span className="text-[#1d1d1d] font-extrabold">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Breakdown Donut Chart */}
        <div className="bg-white rounded-[24px] p-6 border border-gray-200/60 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-[#1d1d1d]">User Breakdown</h3>
            <p className="text-xs text-gray-400 font-medium">By platform role</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="size-28 shrink-0 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={45}
                    dataKey="percentage"
                  >
                    {userBreakdown.map((_, idx) => (
                      <Cell key={idx} fill={USER_ROLE_COLORS[idx % USER_ROLE_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <span className="absolute text-xs font-black text-[#1d1d1d]">0</span>
            </div>

            <div className="space-y-1.5 text-xs font-bold flex-1">
              {userBreakdown.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-gray-600">
                    <span className="size-2 rounded-full" style={{ backgroundColor: USER_ROLE_COLORS[idx % USER_ROLE_COLORS.length] }} />
                    {item.name}
                  </span>
                  <span className="text-[#1d1d1d] font-extrabold">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
