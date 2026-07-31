import { useState } from 'react';

// ─── 1. Comprehensive Backend Interfaces ───────────────────────────────────

export interface KPIMetricItem {
  name: string;
  value: string;
  change: string;
  isPositive: boolean;
  sub: string;
  color: string;
}

export interface SparklineMetricItem {
  name: string;
  value: string;
  change: string;
  isPositive: boolean;
  points?: string;
  bars?: number[];
}

export interface TopDistrictRecord {
  rank: number;
  name: string;
  views: string;
  listings: number;
  growth: string;
}

export interface SearchedLocationItem {
  name: string;
  count: string;
  percentage: number;
}

export interface DistributionPieSegment {
  name: string;
  value: string;
  color: string;
  strokeDash: string;
  strokeOffset: string;
}

export interface AIRecommendationMetrics {
  accuracyPercent?: string;
  precisionPercent?: string;
  recallPercent?: string;
  f1ScorePercent?: string;
}

export interface AdminAnalyticsPageData {
  dateRange?: string;
  mainMetrics?: KPIMetricItem[];
  sparklines?: SparklineMetricItem[];
  months?: string[];
  propertyGrowthData?: number[];
  landGrowthData?: number[];
  topDistricts?: TopDistrictRecord[];
  searchedLocations?: SearchedLocationItem[];
  aiAccuracy?: AIRecommendationMetrics;
  propertyTypesDistribution?: DistributionPieSegment[];
  landCategoriesDistribution?: DistributionPieSegment[];
  userBreakdownDistribution?: DistributionPieSegment[];
}

export interface AdminAnalyticsProps {
  data?: AdminAnalyticsPageData | null;
  isLoading?: boolean;
  error?: string | null;
  onExportReport?: () => void;
  onViewAllSearched?: () => void;
}

// ─── Mock Fallback Data ─────────────────────────────────────────────────────

const defaultMainMetrics: KPIMetricItem[] = [
  { name: 'Monthly Active Users', value: '24,810', change: '+14.2%', isPositive: true, sub: 'vs last month', color: 'bg-emerald-50 text-emerald-700' },
  { name: 'Active Listings', value: '3,482', change: '+9.7%', isPositive: true, sub: 'properties & land', color: 'bg-emerald-50 text-emerald-700' },
  { name: 'Saved Listings', value: '18,640', change: '+31.4%', isPositive: true, sub: 'total saves this month', color: 'bg-emerald-50 text-emerald-700' },
  { name: 'Total Views', value: '412K', change: '-2.1%', isPositive: false, sub: 'page impressions', color: 'bg-red-50 text-red-700' }
];

const defaultSparklines: SparklineMetricItem[] = [
  { name: 'Avg. Property Price', value: 'LKR 1.24M', change: '+8.3%', isPositive: true, points: '10,45 35,30 60,40 85,20 110,35 135,15 160,25' },
  { name: 'Avg. Land Price/sqft', value: 'LKR 420', change: '+5.1%', isPositive: true, points: '10,40 35,45 60,30 85,35 110,20 135,25 160,15' },
  { name: 'Days on Market', value: '34 days', change: '-12.0%', isPositive: false, bars: [19, 28, 21, 38, 26, 14] },
  { name: 'Saved Listings', value: '18,640', change: '+31%', isPositive: true, points: '10,45 35,35 60,42 85,25 110,30 135,15 160,20' }
];

const defaultMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const defaultPropertyGrowth = [64, 96, 85, 117, 128, 139, 149, 160, 171, 181, 192, 203];
const defaultLandGrowth = [42, 74, 107, 85, 96, 117, 128, 139, 149, 160, 171, 181];

const defaultTopDistricts: TopDistrictRecord[] = [
  { rank: 1, name: 'Colombo 03', views: '48.2K views', listings: 342, growth: '+18%' },
  { rank: 2, name: 'Colombo 07', views: '39.7K views', listings: 278, growth: '+12%' },
  { rank: 3, name: 'East Legon', views: '31.4K views', listings: 215, growth: '+9%' },
  { rank: 4, name: 'Kandy Central', views: '24.1K views', listings: 189, growth: '-3%' },
  { rank: 5, name: 'Galle Fort', views: '19.8K views', listings: 164, growth: '+7%' },
  { rank: 6, name: 'Negombo Coastal', views: '11.2K views', listings: 98, growth: '-1%' }
];

const defaultSearchedLocations: SearchedLocationItem[] = [
  { name: 'Colombo 03', count: '14.8K', percentage: 85 },
  { name: 'Colombo 07', count: '12.3K', percentage: 72 },
  { name: 'Galle Beachfront', count: '9.9K', percentage: 58 },
  { name: 'Kandy Hills', count: '7.6K', percentage: 45 },
  { name: 'Negombo', count: '5.2K', percentage: 30 },
  { name: 'Ja-Ela', count: '3.9K', percentage: 22 }
];

const defaultPropertyTypesDist: DistributionPieSegment[] = [
  { name: 'Residential', value: '48%', color: '#345b79', strokeDash: '48 100', strokeOffset: '0' },
  { name: 'Commercial', value: '27%', color: '#be5d3f', strokeDash: '27 100', strokeOffset: '-48' },
  { name: 'Industrial', value: '13%', color: '#928d64', strokeDash: '13 100', strokeOffset: '-75' },
  { name: 'Land', value: '12%', color: '#6b879c', strokeDash: '12 100', strokeOffset: '-88' }
];

const defaultLandCategoriesDist: DistributionPieSegment[] = [
  { name: 'Agricultural', value: '35%', color: '#928d64', strokeDash: '35 100', strokeOffset: '0' },
  { name: 'Residential Plot', value: '30%', color: '#345b79', strokeDash: '30 100', strokeOffset: '-35' },
  { name: 'Commercial Plot', value: '22%', color: '#be5d3f', strokeDash: '22 100', strokeOffset: '-65' },
  { name: 'Mixed-Use', value: '13%', color: '#6b879c', strokeDash: '13 100', strokeOffset: '-87' }
];

const defaultUserBreakdownDist: DistributionPieSegment[] = [
  { name: 'Buyers', value: '52%', color: '#345b79', strokeDash: '52 100', strokeOffset: '0' },
  { name: 'Contractors', value: '21%', color: '#be5d3f', strokeDash: '21 100', strokeOffset: '-52' },
  { name: 'Architects', value: '18%', color: '#928d64', strokeDash: '18 100', strokeOffset: '-73' },
  { name: 'Agents', value: '9%', color: '#6b879c', strokeDash: '9 100', strokeOffset: '-91' }
];

// ─── Component Implementation ───────────────────────────────────────────────

export default function AdminAnalytics({
  data = null,
  isLoading = false,
  error = null,
  onExportReport,
  onViewAllSearched
}: AdminAnalyticsProps) {
  const dateRange = data?.dateRange || 'Dec 1 - Dec 31, 2026';
  const mainMetrics = data?.mainMetrics || defaultMainMetrics;
  const sparklines = data?.sparklines || defaultSparklines;
  const months = data?.months || defaultMonths;
  const propertyGrowthData = data?.propertyGrowthData || defaultPropertyGrowth;
  const landGrowthData = data?.landGrowthData || defaultLandGrowth;
  const topDistricts = data?.topDistricts || defaultTopDistricts;
  const searchedLocations = data?.searchedLocations || defaultSearchedLocations;
  const aiAccuracy = data?.aiAccuracy;
  const propertyTypesDistribution = data?.propertyTypesDistribution || defaultPropertyTypesDist;
  const landCategoriesDistribution = data?.landCategoriesDistribution || defaultLandCategoriesDist;
  const userBreakdownDistribution = data?.userBreakdownDistribution || defaultUserBreakdownDist;

  // ─── 2. Skeleton Loading State ─────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col gap-6 p-6 lg:p-8 animate-pulse max-w-[1400px] mx-auto">
        <div className="h-16 bg-gray-200 rounded-2xl w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded-2xl" />
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded-2xl w-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start p-6 lg:p-8 space-y-8 bg-gradient-to-r from-[#e6e0d4] to-[#fcf9f8]">
      <div className="w-full max-w-[1400px] mx-auto space-y-8">
        
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

        {/* Page Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-[#194360] tracking-tight">Analytics Dashboard</h1>
            <p className="text-xs text-gray-500 font-medium mt-1">Platform-wide insights, market trends & AI performance.</p>
          </div>
          
          {/* Date Filter & Export CTAs */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-700 flex items-center gap-2 shadow-sm">
              <img src="/svg/clock.svg" alt="" className="size-4" />
              <span>{dateRange}</span>
            </div>

            <button 
              onClick={() => onExportReport ? onExportReport() : alert('Exporting Analytics Report...')}
              className="flex items-center gap-2 rounded-xl bg-[#194360] hover:bg-[#194360]/90 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-colors cursor-pointer"
            >
              <img src="/svg/bookmark.svg" alt="" className="size-4 filter invert" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Metric Row 1: KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {mainMetrics.map((m) => (
            <div key={m.name} className="bg-white border border-[#ccb7a3]/20 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-40">
              <div className="flex items-start justify-between">
                <span className="text-xs font-bold text-[#6b879c] tracking-wider uppercase leading-tight w-3/4">{m.name}</span>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${m.color}`}>
                  {m.change}
                </span>
              </div>
              <div className="mt-auto leading-tight">
                <h4 className="text-3xl font-extrabold text-[#1d1d1d]">{m.value}</h4>
                <span className="text-[11px] text-gray-400 font-bold">{m.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Metric Row 2: Sparkline Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {sparklines.map((s) => (
            <div key={s.name} className="bg-white border border-[#ccb7a3]/20 rounded-2xl p-6 shadow-sm flex flex-col justify-between h-44">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-[#6b879c] uppercase tracking-wider">{s.name}</span>
                  <span className={`text-xs font-bold ${s.isPositive ? 'text-emerald-700' : 'text-red-600'}`}>
                    {s.change}
                  </span>
                </div>
                <h4 className="text-2xl font-extrabold text-[#1d1d1d] mt-1">{s.value}</h4>
              </div>

              {/* Sparkline Graph Visualizer */}
              <div className="h-12 w-full mt-3">
                {s.bars ? (
                  <div className="flex items-end justify-between size-full px-1">
                    {s.bars.map((barVal, barIdx) => (
                      <div
                        key={barIdx}
                        className="w-[12%] bg-[#345b79]/20 rounded-t transition-all hover:bg-[#345b79]"
                        style={{ height: `${barVal * 2.2}%` }}
                      />
                    ))}
                  </div>
                ) : (
                  <svg className="w-full h-full" viewBox="0 0 160 50" preserveAspectRatio="none">
                    <polyline
                      fill="none"
                      stroke={s.isPositive ? '#345b79' : '#be5d3f'}
                      strokeWidth="2.5"
                      points={s.points}
                    />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Row 3: Growth Charts and Line Graph widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
          
          {/* Property & Land Growth Bar Chart */}
          <div className="bg-white border border-[#ccb7a3]/20 rounded-2xl p-6 lg:p-8 shadow-sm lg:col-span-8 flex flex-col justify-between min-h-[380px]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div>
                <h3 className="text-base font-extrabold text-[#1d1d1d]">Property & Land Growth</h3>
                <p className="text-xs text-gray-500 font-semibold">Monthly listings added — 2026</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold">
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-[#345b79]" />
                  <span className="text-gray-700">Properties</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-[#ffdbd1]" />
                  <span className="text-gray-700">Land</span>
                </div>
              </div>
            </div>

            {/* SVG Bar Chart columns */}
            <div className="flex-1 flex items-end justify-between h-48 border-b border-gray-100 pb-2 px-2">
              {months.map((mName, mIdx) => (
                <div key={mName} className="flex flex-col items-center gap-2 flex-1">
                  <div className="flex gap-1 items-end justify-center h-40 w-full">
                    <div
                      className="w-3 bg-[#345b79] rounded-t transition-all hover:opacity-90"
                      style={{ height: `${((propertyGrowthData[mIdx] || 0) / 240) * 100}%` }}
                      title={`Properties: ${propertyGrowthData[mIdx] || 0}`}
                    />
                    <div
                      className="w-3 bg-[#ffdbd1] rounded-t transition-all hover:opacity-90"
                      style={{ height: `${((landGrowthData[mIdx] || 0) / 240) * 100}%` }}
                      title={`Land: ${landGrowthData[mIdx] || 0}`}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">{mName}</span>
                </div>
              ))}
            </div>
          </div>

          {/* User Registrations Sparkline Area Chart */}
          <div className="bg-white border border-[#ccb7a3]/20 rounded-2xl p-6 lg:p-8 shadow-sm lg:col-span-4 flex flex-col justify-between min-h-[380px]">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#1d1d1d]">User Registrations</h3>
                <p className="text-xs text-gray-500 font-semibold">New sign-ups per month — 2026</p>
              </div>
              <div className="text-right">
                <h4 className="text-base font-bold text-[#1d1d1d]">1,340</h4>
                <span className="text-xs font-bold text-[#345b79]">+23%</span>
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-end mt-5 h-44">
              <svg className="w-full h-36" viewBox="0 0 200 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gradient-signups" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#345b79" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#345b79" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,80 Q30,65 60,75 T120,40 T180,30 T200,20 L200,100 L0,100 Z"
                  fill="url(#gradient-signups)"
                />
                <path
                  d="M0,80 Q30,65 60,75 T120,40 T180,30 T200,20"
                  fill="none"
                  stroke="#345b79"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
              <div className="flex justify-between mt-3 border-t border-gray-100 pt-2 text-[9px] font-bold text-gray-400 uppercase">
                <span>Jan</span>
                <span>Jun</span>
                <span>Dec</span>
              </div>
            </div>
          </div>

        </div>

        {/* Row 4: Tables, Locations, and Gauges */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
          
          {/* Top Districts Table */}
          <div className="bg-white border border-[#ccb7a3]/20 rounded-2xl p-6 shadow-sm lg:col-span-5 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-extrabold text-[#1d1d1d] mb-1">Top Districts</h3>
              <p className="text-xs text-gray-400 font-semibold mb-5">By listing activity & views</p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-100 text-[10px] font-bold text-[#6b879c] uppercase tracking-wider">
                      <th className="pb-3">#</th>
                      <th className="pb-3">DISTRICT</th>
                      <th className="pb-3 text-right">LISTINGS</th>
                      <th className="pb-3 text-right">GROWTH</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {topDistricts.map((item) => (
                      <tr key={item.rank} className="hover:bg-gray-50/50">
                        <td className="py-3 text-gray-400 font-semibold">{item.rank}</td>
                        <td className="py-3">
                          <div className="font-bold text-[#1d1d1d]">{item.name}</div>
                          <div className="text-[10px] text-gray-400 font-normal">{item.views}</div>
                        </td>
                        <td className="py-3 text-right font-semibold text-gray-700">{item.listings}</td>
                        <td className={`py-3 text-right font-bold ${
                          item.growth.startsWith('+') ? 'text-emerald-700' : 'text-red-600'
                        }`}>
                          {item.growth}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Most Searched Locations Progress bars */}
          <div className="bg-white border border-[#ccb7a3]/20 rounded-2xl p-6 shadow-sm lg:col-span-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-extrabold text-[#1d1d1d]">Most Searched</h3>
                <button onClick={onViewAllSearched} className="text-xs font-bold text-[#345b79] hover:underline cursor-pointer">View All</button>
              </div>
              
              <div className="space-y-4">
                {searchedLocations.map((loc) => (
                  <div key={loc.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-[#1d1d1d]">
                      <span>{loc.name}</span>
                      <span className="text-gray-400 font-normal">{loc.count}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#345b79] transition-all duration-500"
                        style={{ width: `${loc.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Recommendation Accuracy semi-circle gauge */}
          <div className="bg-white border border-[#ccb7a3]/20 rounded-2xl p-6 shadow-sm lg:col-span-4 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-extrabold text-[#1d1d1d] mb-1">AI Recommendation Accuracy</h3>
              <p className="text-xs text-gray-400 font-semibold mb-5">Based on user engagement & conversions</p>
            </div>

            <div className="flex flex-col items-center justify-center py-4 relative">
              <div className="relative size-40">
                <svg className="size-full" viewBox="0 0 100 50">
                  <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="#f0eded"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="#345b79"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="125"
                    strokeDashoffset="6" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-4 leading-none">
                  <span className="text-2xl font-extrabold text-[#1d1d1d]">{aiAccuracy?.accuracyPercent ?? '94.7%'}</span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase mt-1 tracking-wider">ACCURACY</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 w-full text-center mt-6 pt-4 border-t border-gray-50">
                <div>
                  <span className="block text-xs font-bold text-[#1d1d1d]">{aiAccuracy?.precisionPercent ?? '96.1%'}</span>
                  <span className="text-[10px] text-gray-400 font-semibold">Precision</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-amber-700">{aiAccuracy?.recallPercent ?? '93.4%'}</span>
                  <span className="text-[10px] text-gray-400 font-semibold">Recall</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-emerald-700">{aiAccuracy?.f1ScorePercent ?? '94.7%'}</span>
                  <span className="text-[10px] text-gray-400 font-semibold">F1 Score</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Row 5: Distribution Breakdowns (Pie/Donut Panels) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          
          {/* Property Types Donut Card */}
          <div className="bg-white border border-[#ccb7a3]/20 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[280px]">
            <div>
              <h3 className="text-base font-extrabold text-[#1d1d1d] mb-1">Property Types</h3>
              <p className="text-xs text-gray-500 font-semibold mb-5">Distribution across all listings</p>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative size-24 shrink-0">
                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f0eded" strokeWidth="6" />
                  {propertyTypesDistribution.map((item, idx) => (
                    <circle
                      key={idx}
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke={item.color}
                      strokeWidth="6"
                      strokeDasharray={item.strokeDash}
                      strokeDashoffset={item.strokeOffset}
                    />
                  ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                  <span className="text-base font-extrabold text-[#1d1d1d]">100</span>
                  <span className="text-[8px] text-gray-400 font-bold uppercase mt-1">TOTAL</span>
                </div>
              </div>

              <div className="flex-1 space-y-2">
                {propertyTypesDistribution.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-gray-700">
                      <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-bold text-[#1d1d1d]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Land Categories Donut Card */}
          <div className="bg-white border border-[#ccb7a3]/20 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[280px]">
            <div>
              <h3 className="text-base font-extrabold text-[#1d1d1d] mb-1">Land Categories</h3>
              <p className="text-xs text-gray-500 font-semibold mb-5">Classification of land listings</p>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative size-24 shrink-0">
                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f0eded" strokeWidth="6" />
                  {landCategoriesDistribution.map((item, idx) => (
                    <circle
                      key={idx}
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke={item.color}
                      strokeWidth="6"
                      strokeDasharray={item.strokeDash}
                      strokeDashoffset={item.strokeOffset}
                    />
                  ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                  <span className="text-base font-extrabold text-[#1d1d1d]">100</span>
                  <span className="text-[8px] text-gray-400 font-bold uppercase mt-1">TOTAL</span>
                </div>
              </div>

              <div className="flex-1 space-y-2">
                {landCategoriesDistribution.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-gray-700">
                      <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-bold text-[#1d1d1d]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* User Breakdown Donut Card */}
          <div className="bg-white border border-[#ccb7a3]/20 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[280px]">
            <div>
              <h3 className="text-base font-extrabold text-[#1d1d1d] mb-1">User Breakdown</h3>
              <p className="text-xs text-gray-500 font-semibold mb-5">By platform role</p>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative size-24 shrink-0">
                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f0eded" strokeWidth="6" />
                  {userBreakdownDistribution.map((item, idx) => (
                    <circle
                      key={idx}
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="none"
                      stroke={item.color}
                      strokeWidth="6"
                      strokeDasharray={item.strokeDash}
                      strokeDashoffset={item.strokeOffset}
                    />
                  ))}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                  <span className="text-base font-extrabold text-[#1d1d1d]">100</span>
                  <span className="text-[8px] text-gray-400 font-bold uppercase mt-1">TOTAL</span>
                </div>
              </div>

              <div className="flex-1 space-y-2">
                {userBreakdownDistribution.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-gray-700">
                      <span className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-bold text-[#1d1d1d]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
