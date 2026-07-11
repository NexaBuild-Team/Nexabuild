import { useState } from 'react';

// Figma Metric Row 1: KPI Summary
const mainMetrics = [
  { name: 'Monthly Active Users', value: '24,810', change: '+14.2%', isPositive: true, sub: 'vs last month', color: 'bg-[#928d64]/10 text-[#928d64]' },
  { name: 'Active Listings', value: '3,482', change: '+9.7%', isPositive: true, sub: 'properties & land', color: 'bg-[#928d64]/10 text-[#928d64]' },
  { name: 'Saved Listings', value: '18,640', change: '+31.4%', isPositive: true, sub: 'total saves this month', color: 'bg-[#928d64]/10 text-[#928d64]' },
  { name: 'Total Views', value: '412K', change: '-2.1%', isPositive: false, sub: 'page impressions', color: 'bg-[#be5d3f]/10 text-[#be5d3f]' }
];

// Figma Metric Row 2: Sparkline Summaries
const sparklines = [
  {
    name: 'Avg. Property Price',
    value: '$1.24M',
    change: '+8.3%',
    isPositive: true,
    points: '10,45 35,30 60,40 85,20 110,35 135,15 160,25'
  },
  {
    name: 'Avg. Land Price/sqft',
    value: '$420',
    change: '+5.1%',
    isPositive: true,
    points: '10,40 35,45 60,30 85,35 110,20 135,25 160,15'
  },
  {
    name: 'Days on Market',
    value: '34 days',
    change: '-12.0%',
    isPositive: false,
    bars: [19, 28, 21, 38, 26, 14]
  },
  {
    name: 'Saved Listings',
    value: '18,640',
    change: '+31%',
    isPositive: true,
    points: '10,45 35,35 60,42 85,25 110,30 135,15 160,20'
  }
];

// Property & Land Growth data
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const propertyGrowthData = [64, 96, 85, 117, 128, 139, 149, 160, 171, 181, 192, 203];
const landGrowthData = [42, 74, 107, 85, 96, 117, 128, 139, 149, 160, 171, 181];

// Top Districts table
const topDistricts = [
  { rank: 1, name: 'Downtown Core', views: '48.2K views', listings: 342, growth: '+18%' },
  { rank: 2, name: 'Coastal Heights', views: '39.7K views', listings: 278, growth: '+12%' },
  { rank: 3, name: 'Financial District', views: '31.4K views', listings: 215, growth: '+9%' },
  { rank: 4, name: 'Peri-Urban East', views: '24.1K views', listings: 189, growth: '-3%' },
  { rank: 5, name: 'Central Market', views: '19.8K views', listings: 164, growth: '+7%' },
  { rank: 6, name: 'Industrial Zone B', views: '11.2K views', listings: 98, growth: '-1%' }
];

// Most Searched Locations progress bars
const searchedLocations = [
  { name: 'Coastal Heights', count: '14.8K', percentage: 85 },
  { name: 'Downtown Core', count: '12.3K', percentage: 72 },
  { name: 'Financial District', count: '9.9K', percentage: 58 },
  { name: 'Green Valley', count: '7.6K', percentage: 45 },
  { name: 'Peri-Urban East', count: '5.2K', percentage: 30 },
  { name: 'North Ridge', count: '3.9K', percentage: 22 }
];

// Distribution Breakdowns
const propertyTypesDistribution = [
  { name: 'Residential', value: '48%', color: '#345b79', strokeDash: '48 100', strokeOffset: '0' },
  { name: 'Commercial', value: '27%', color: '#be5d3f', strokeDash: '27 100', strokeOffset: '-48' },
  { name: 'Industrial', value: '13%', color: '#928d64', strokeDash: '13 100', strokeOffset: '-75' },
  { name: 'Land', value: '12%', color: '#6b879c', strokeDash: '12 100', strokeOffset: '-88' }
];

const landCategoriesDistribution = [
  { name: 'Agricultural', value: '35%', color: '#928d64', strokeDash: '35 100', strokeOffset: '0' },
  { name: 'Residential Plot', value: '30%', color: '#345b79', strokeDash: '30 100', strokeOffset: '-35' },
  { name: 'Commercial Plot', value: '22%', color: '#be5d3f', strokeDash: '22 100', strokeOffset: '-65' },
  { name: 'Mixed-Use', value: '13%', color: '#6b879c', strokeDash: '13 100', strokeOffset: '-87' }
];

const userBreakdownDistribution = [
  { name: 'Buyers', value: '52%', color: '#345b79', strokeDash: '52 100', strokeOffset: '0' },
  { name: 'Contractors', value: '21%', color: '#be5d3f', strokeDash: '21 100', strokeOffset: '-52' },
  { name: 'Architects', value: '18%', color: '#928d64', strokeDash: '18 100', strokeOffset: '-73' },
  { name: 'Agents', value: '9%', color: '#6b879c', strokeDash: '9 100', strokeOffset: '-91' }
];

export default function AdminAnalytics() {
  const [dateRange] = useState('Dec 1 - Dec 31, 2024');

  return (
    <div className="h-full overflow-y-auto p-[20px] md:p-[32px] space-y-[32px] bg-[#e6e0d4]">
      
      {/* Page Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[16px]">
        <div>
          <h3 className="text-[28px] font-extrabold text-[#345b79]">Analytics Dashboard</h3>
          <p className="text-[14px] text-gray-500 font-medium">Platform-wide insights, market trends & AI performance.</p>
        </div>
        
        {/* Date Filter & Export CTAs */}
        <div className="flex items-center gap-[12px] self-start sm:self-auto">
          <div className="bg-[#ccb7a3]/30 border border-[#ccb7a3]/40 rounded-[8px] px-[16px] py-[10px] text-[13px] font-bold text-gray-700 flex items-center gap-[8px]">
            <svg className="size-[16px] text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{dateRange}</span>
          </div>

          <button className="flex items-center gap-[8px] rounded-[8px] bg-[#345b79] px-[20px] py-[10px] text-[13px] font-bold text-white hover:bg-[#345b79]/90 shadow-sm transition-colors">
            <svg className="size-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Report
          </button>
        </div>
      </div>

      {/* Metric Row 1: KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px]">
        {mainMetrics.map((m) => (
          <div key={m.name} className="bg-white border border-[#ccb7a3]/20 rounded-[12px] p-[24px] shadow-sm flex flex-col justify-between h-[160px]">
            <div className="flex items-start justify-between">
              <span className="text-[12px] font-bold text-[#6b879c] tracking-wider uppercase leading-tight w-[70%]">{m.name}</span>
              <span className={`inline-flex items-center gap-[4px] rounded-full px-[8px] py-[2px] text-[10px] font-bold ${m.color}`}>
                {m.change}
              </span>
            </div>
            <div className="mt-auto leading-tight">
              <h4 className="text-[32px] font-extrabold text-[#1d1d1d]">{m.value}</h4>
              <span className="text-[11px] text-gray-400 font-bold">{m.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Metric Row 2: Sparkline Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px]">
        {sparklines.map((s) => (
          <div key={s.name} className="bg-white border border-[#ccb7a3]/20 rounded-[12px] p-[24px] shadow-sm flex flex-col justify-between h-[180px]">
            <div>
              <div className="flex justify-between items-start">
                <span className="text-[12px] font-bold text-[#6b879c] uppercase tracking-wider">{s.name}</span>
                <span className={`text-[12px] font-bold ${s.isPositive ? 'text-[#495d38]' : 'text-[#be5d3f]'}`}>
                  {s.change}
                </span>
              </div>
              <h4 className="text-[24px] font-extrabold text-[#1d1d1d] mt-[4px]">{s.value}</h4>
            </div>

            {/* Sparkline Graph Visualizer */}
            <div className="h-[48px] w-full mt-[12px]">
              {s.bars ? (
                <div className="flex items-end justify-between size-full px-[4px]">
                  {s.bars.map((barVal, barIdx) => (
                    <div
                      key={barIdx}
                      className="w-[12%] bg-[#ccb7a3]/30 rounded-t-[2px] transition-all hover:bg-[#345b79]/60"
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[32px]">
        
        {/* Property & Land Growth Bar Chart */}
        <div className="bg-white border border-[#ccb7a3]/20 rounded-[12px] p-[24px] shadow-sm lg:col-span-8 flex flex-col justify-between min-h-[380px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[16px] mb-[20px]">
            <div>
              <h3 className="text-[16px] font-extrabold text-[#1d1d1d]">Property & Land Growth</h3>
              <p className="text-[12px] text-gray-500 font-semibold">Monthly listings added — 2024</p>
            </div>
            <div className="flex items-center gap-[16px] text-[12px] font-bold">
              <div className="flex items-center gap-[6px]">
                <span className="size-[10px] rounded-full bg-[#345b79]" />
                <span className="text-gray-700">Properties</span>
              </div>
              <div className="flex items-center gap-[6px]">
                <span className="size-[10px] rounded-full bg-[#ffdbd1]" />
                <span className="text-gray-700">Land</span>
              </div>
            </div>
          </div>

          {/* SVG Bar Chart columns */}
          <div className="flex-1 flex items-end justify-between h-[200px] border-b border-gray-100 pb-[8px] px-[8px]">
            {months.map((mName, mIdx) => (
              <div key={mName} className="flex flex-col items-center gap-[8px] flex-1">
                <div className="flex gap-[4px] items-end justify-center h-[160px] w-full">
                  <div
                    className="w-[12px] bg-[#345b79] rounded-t-[2px] transition-all hover:opacity-90"
                    style={{ height: `${(propertyGrowthData[mIdx] / 240) * 100}%` }}
                    title={`Properties: ${propertyGrowthData[mIdx]}`}
                  />
                  <div
                    className="w-[12px] bg-[#ffdbd1] rounded-t-[2px] transition-all hover:opacity-90"
                    style={{ height: `${(landGrowthData[mIdx] / 240) * 100}%` }}
                    title={`Land: ${landGrowthData[mIdx]}`}
                  />
                </div>
                <span className="text-[11px] font-bold text-gray-400 uppercase">{mName}</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Registrations Sparkline Area Chart */}
        <div className="bg-white border border-[#ccb7a3]/20 rounded-[12px] p-[24px] shadow-sm lg:col-span-4 flex flex-col justify-between min-h-[380px]">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-[16px] font-extrabold text-[#1d1d1d]">User Registrations</h3>
              <p className="text-[12px] text-gray-500 font-semibold">New sign-ups per month — 2024</p>
            </div>
            <div className="text-right">
              <h4 className="text-[16px] font-bold text-[#1d1d1d]">1,340</h4>
              <span className="text-[12px] font-bold text-[#345b79]">+23%</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-end mt-[20px] h-[180px]">
            <svg className="w-full h-[150px]" viewBox="0 0 200 100" preserveAspectRatio="none">
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
            <div className="flex justify-between mt-[12px] border-t border-gray-100 pt-[8px] text-[9px] font-bold text-gray-400 uppercase">
              <span>Jan</span>
              <span>Jun</span>
              <span>Dec</span>
            </div>
          </div>
        </div>

      </div>

      {/* Row 4: Tables, Locations, and Gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[32px]">
        
        {/* Top Districts Table */}
        <div className="bg-white border border-[#ccb7a3]/20 rounded-[12px] p-[24px] shadow-sm lg:col-span-5 flex flex-col justify-between">
          <div>
            <h3 className="text-[16px] font-extrabold text-[#1d1d1d] mb-[4px]">Top Districts</h3>
            <p className="text-[12px] text-gray-400 font-semibold mb-[20px]">By listing activity & views</p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[13px]">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] font-bold text-[#6b879c] uppercase tracking-wider">
                    <th className="pb-[12px]">#</th>
                    <th className="pb-[12px]">DISTRICT</th>
                    <th className="pb-[12px] text-right">LISTINGS</th>
                    <th className="pb-[12px] text-right">GROWTH</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-[13px]">
                  {topDistricts.map((item) => (
                    <tr key={item.rank} className="hover:bg-gray-50/50">
                      <td className="py-[12px] text-gray-400 font-semibold">{item.rank}</td>
                      <td className="py-[12px]">
                        <div className="font-bold text-[#1d1d1d]">{item.name}</div>
                        <div className="text-[10px] text-gray-400 font-normal">{item.views}</div>
                      </td>
                      <td className="py-[12px] text-right font-semibold text-gray-700">{item.listings}</td>
                      <td className={`py-[12px] text-right font-bold ${
                        item.growth.startsWith('+') ? 'text-[#495d38]' : 'text-[#be5d3f]'
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
        <div className="bg-white border border-[#ccb7a3]/20 rounded-[12px] p-[24px] shadow-sm lg:col-span-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-[20px]">
              <h3 className="text-[16px] font-extrabold text-[#1d1d1d]">Most Searched</h3>
              <button className="text-[12px] font-bold text-[#345b79] hover:underline">View All</button>
            </div>
            
            <div className="space-y-[16px]">
              {searchedLocations.map((loc) => (
                <div key={loc.name} className="space-y-[4px]">
                  <div className="flex items-center justify-between text-[13px] font-bold text-[#1d1d1d]">
                    <span>{loc.name}</span>
                    <span className="text-gray-400 font-normal">{loc.count}</span>
                  </div>
                  <div className="h-[8px] w-full rounded-full bg-[#f0eded] overflow-hidden">
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
        <div className="bg-white border border-[#ccb7a3]/20 rounded-[12px] p-[24px] shadow-sm lg:col-span-4 flex flex-col justify-between">
          <div>
            <h3 className="text-[16px] font-extrabold text-[#1d1d1d] mb-[4px]">AI Recommendation Accuracy</h3>
            <p className="text-[12px] text-gray-400 font-semibold mb-[20px]">Based on user engagement & conversions</p>
          </div>

          <div className="flex flex-col items-center justify-center py-[20px] relative">
            {/* Visual Arc Gauge drawing with SVG */}
            <div className="relative size-[160px]">
              <svg className="size-full" viewBox="0 0 100 50">
                {/* Background arc */}
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="#f0eded"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* Primary blue active arc representing 94.7% accuracy */}
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
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-[16px] leading-none">
                <span className="text-[24px] font-extrabold text-[#1d1d1d]">94.7%</span>
                <span className="text-[9px] text-gray-400 font-bold uppercase mt-[6px] tracking-wider">ACCURACY</span>
              </div>
            </div>

            {/* Gauge sub-metrics row */}
            <div className="grid grid-cols-3 gap-[16px] w-full text-center mt-[24px] pt-[16px] border-t border-gray-50">
              <div>
                <span className="block text-[14px] font-bold text-[#1d1d1d]">96.1%</span>
                <span className="text-[10px] text-gray-400 font-semibold">Precision</span>
              </div>
              <div>
                <span className="block text-[14px] font-bold text-[#be5d3f]">93.4%</span>
                <span className="text-[10px] text-gray-400 font-semibold">Recall</span>
              </div>
              <div>
                <span className="block text-[14px] font-bold text-[#928d64]">94.7%</span>
                <span className="text-[10px] text-gray-400 font-semibold">F1 Score</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Row 5: Distribution Breakdowns (Pie/Donut Panels) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
        
        {/* Property Types Donut Card */}
        <div className="bg-white border border-[#ccb7a3]/20 rounded-[12px] p-[24px] shadow-sm flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 className="text-[16px] font-extrabold text-[#1d1d1d] mb-[4px]">Property Types</h3>
            <p className="text-[12px] text-gray-500 font-semibold mb-[20px]">Distribution across all listings</p>
          </div>

          <div className="flex items-center gap-[24px]">
            {/* Donut graphic */}
            <div className="relative size-[100px] shrink-0">
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
                <span className="text-[18px] font-extrabold text-[#1d1d1d]">100</span>
                <span className="text-[8px] text-gray-400 font-bold uppercase mt-[2px]">TOTAL</span>
              </div>
            </div>

            {/* Labels checklist */}
            <div className="flex-1 space-y-[8px]">
              {propertyTypesDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-[6px] font-semibold text-gray-700">
                    <span className="size-[8px] rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-bold text-[#1d1d1d]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Land Categories Donut Card */}
        <div className="bg-white border border-[#ccb7a3]/20 rounded-[12px] p-[24px] shadow-sm flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 className="text-[16px] font-extrabold text-[#1d1d1d] mb-[4px]">Land Categories</h3>
            <p className="text-[12px] text-gray-500 font-semibold mb-[20px]">Classification of land listings</p>
          </div>

          <div className="flex items-center gap-[24px]">
            {/* Donut graphic */}
            <div className="relative size-[100px] shrink-0">
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
                <span className="text-[18px] font-extrabold text-[#1d1d1d]">100</span>
                <span className="text-[8px] text-gray-400 font-bold uppercase mt-[2px]">TOTAL</span>
              </div>
            </div>

            {/* Labels checklist */}
            <div className="flex-1 space-y-[8px]">
              {landCategoriesDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-[6px] font-semibold text-gray-700">
                    <span className="size-[8px] rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-bold text-[#1d1d1d]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Breakdown Donut Card */}
        <div className="bg-white border border-[#ccb7a3]/20 rounded-[12px] p-[24px] shadow-sm flex flex-col justify-between min-h-[300px]">
          <div>
            <h3 className="text-[16px] font-extrabold text-[#1d1d1d] mb-[4px]">User Breakdown</h3>
            <p className="text-[12px] text-gray-500 font-semibold mb-[20px]">By platform role</p>
          </div>

          <div className="flex items-center gap-[24px]">
            {/* Donut graphic */}
            <div className="relative size-[100px] shrink-0">
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
                <span className="text-[18px] font-extrabold text-[#1d1d1d]">100</span>
                <span className="text-[8px] text-gray-400 font-bold uppercase mt-[2px]">TOTAL</span>
              </div>
            </div>

            {/* Labels checklist */}
            <div className="flex-1 space-y-[8px]">
              {userBreakdownDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-[6px] font-semibold text-gray-700">
                    <span className="size-[8px] rounded-full" style={{ backgroundColor: item.color }} />
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
  );
}
