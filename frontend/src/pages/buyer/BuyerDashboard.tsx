import { useState } from 'react';

// Mock Data matching Figma Node 9:342
const initialPropertyPicks = [
  {
    id: 1,
    title: 'Modern Villa',
    location: 'Colombo 7, Western Province',
    price: 'LKR 28.5M',
    match: '98%',
    beds: 4,
    baths: 3,
    sqft: '3,200',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    isAiPick: true,
    isSaved: false
  }
];

const initialLandPicks = [
  {
    id: 4,
    title: 'Prime Plot',
    location: 'Nugegoda, Colombo',
    price: 'LKR 8.5M',
    match: '96%',
    size: '20 Perches',
    potential: 'HIGH POTENTIAL',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
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
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    isSaved: false
  }
];

const initialRecentSearches = [
  { id: 1, title: '4BHK Villa Colombo 7', desc: 'LKR 20M—35M • 4+ Beds', time: '2 hr ago' },
  { id: 2, title: 'Land 20+ Perches Homagama', desc: 'LKR 5M—12M • Road Access', time: '1 day ago' }
];

const initialRecentlyViewed = [
  { id: 1, title: 'Luxury Villa', location: 'Colombo 7', price: 'LKR 32M', image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=300&q=80' },
  { id: 2, title: 'Land Plot', location: 'Homagama', price: 'LKR 9.2M', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=300&q=80' }
];

const initialNotifications = [
  { id: 1, title: 'New AI Match Found', text: '3 new properties match your 98% criteria in Colombo 5.', time: '2 MIN AGO', type: 'match' },
  { id: 2, title: 'Price Drop Alert', text: 'Property in Nugegoda dropped by LKR 1.2M.', time: '1 HR AGO', type: 'price' }
];

const investmentHotspots = [
  { id: 1, location: 'Colombo 7', type: 'PROPERTY', growth: '+12%', color: 'bg-[#345b79]' },
  { id: 2, location: 'Homagama', type: 'LAND', growth: '+18%', color: 'bg-[#be5d3f]' },
  { id: 3, location: 'Nugegoda', type: 'PROPERTY', growth: '+8%', color: 'bg-[#928d64]' }
];

export default function BuyerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [properties, setProperties] = useState(initialPropertyPicks);
  const [lands, setLands] = useState(initialLandPicks);
  const [searches, setSearches] = useState(initialRecentSearches);
  const [searchQuery, setSearchQuery] = useState('');

  const togglePropertySave = (id: number) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, isSaved: !p.isSaved } : p));
  };

  const toggleLandSave = (id: number) => {
    setLands(prev => prev.map(l => l.id === id ? { ...l, isSaved: !l.isSaved } : l));
  };

  const clearSearches = () => {
    setSearches([]);
  };

  return (
    <div className="p-[24px] lg:p-[40px] space-y-[32px] w-full">
          
          {/* A. Hero banner Section */}
          <div className="bg-[#2a4d69] rounded-[24px] p-[24px] md:p-[40px] text-white flex flex-col justify-center min-h-[200px] relative overflow-hidden shadow-md">
            <div className="absolute right-[5%] top-1/2 -translate-y-1/2 size-[120px] rounded-full bg-white/5 flex items-center justify-center pointer-events-none">
              <svg className="size-[48px] text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="space-y-[8px] max-w-[80%]">
              <span className="text-[14px] text-white/70 font-semibold tracking-wider">Good morning</span>
              <h2 className="text-[32px] md:text-[40px] font-extrabold tracking-tight leading-none">Welcome back, Kasun</h2>
              
              {/* Glassmorphic AI pill */}
              <div className="mt-[20px] inline-flex items-center gap-[12px] bg-white/10 backdrop-blur-md border border-white/15 px-[20px] py-[12px] rounded-[16px] text-[13px] font-semibold leading-relaxed">
                <svg className="size-[18px] shrink-0 text-[#d59b86]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>Today's AI Insight: Property prices in Colombo 5—7 expected to rise 8—12% this quarter.</span>
              </div>
            </div>
          </div>

          {/* B. KPI Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[16px] lg:gap-[24px]">
            {[
              { label: 'Saved Properties', val: 12, change: '+2 this week', isGreen: true, bg: 'bg-[#345b79]/5 text-[#345b79]' },
              { label: 'Saved Lands', val: 7, change: '+1 this week', isGreen: true, bg: 'bg-[#be5d3f]/5 text-[#be5d3f]' },
              { label: 'AI Matches', val: 38, change: 'Updated today', isGreen: false, bg: 'bg-[#2563eb]/5 text-[#2563eb]' },
              { label: 'Recent Searches', val: 24, change: 'Last 30 days', isGreen: false, bg: 'bg-gray-100 text-gray-500' }
            ].map((kpi, idx) => (
              <div key={idx} className="bg-white rounded-[20px] p-[20px] lg:p-[24px] border border-[#ccb7a3]/10 shadow-sm flex flex-col items-center text-center">
                <div className={`p-[12px] rounded-[16px] flex items-center justify-center size-[48px] ${kpi.bg} mb-[12px]`}>
                  {idx === 0 && <svg className="size-[20px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
                  {idx === 1 && <svg className="size-[20px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>}
                  {idx === 2 && <svg className="size-[20px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9A5 5 0 1112.07 15.24" /></svg>}
                  {idx === 3 && <svg className="size-[20px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
                </div>
                <span className="text-[10px] lg:text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-[6px]">{kpi.label}</span>
                <h4 className="text-[28px] lg:text-[32px] font-extrabold text-[#111827] leading-none mb-[6px]">{kpi.val}</h4>
                <span className="text-[10px] lg:text-[11px] font-semibold text-gray-500">{kpi.change}</span>
              </div>
            ))}
          </div>

          {/* C. AI Property Recommendations */}
          <div className="space-y-[20px]">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-[22px] lg:text-[26px] font-extrabold text-[#111827]">AI Property Recommendations</h3>
                <p className="text-[13px] text-gray-500 font-semibold">Curated by AI based on your preferences and search history</p>
              </div>
              <a href="#" className="flex items-center gap-[6px] text-[13px] font-bold text-[#345b79] hover:underline">
                <span>View all</span>
                <svg className="size-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
              {properties.map((p) => (
                <div key={p.id} className="bg-white rounded-[24px] overflow-hidden border border-[#ccb7a3]/20 shadow-sm flex flex-col group hover:shadow-md transition-all">
                  {/* Card Image Cover */}
                  <div className="h-[200px] w-full overflow-hidden relative">
                    <img src={p.image} alt={p.title} className="size-full object-cover group-hover:scale-105 transition-all duration-300" />
                    
                    {/* Tags */}
                    {p.isAiPick && (
                      <span className="absolute top-[16px] left-[16px] bg-[#be5d3f] text-white text-[9px] font-extrabold tracking-widest px-[10px] py-[4px] rounded-full shadow-sm">
                        AI PICK
                      </span>
                    )}
                    <span className="absolute top-[16px] right-[16px] bg-white/95 backdrop-blur-md border border-[#345b79]/20 text-[#345b79] text-[11px] font-extrabold px-[12px] py-[4px] rounded-full shadow-sm">
                      {p.match} Match
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-[24px] flex-1 flex flex-col justify-between space-y-[16px]">
                    <div>
                      <div className="flex justify-between items-start mb-[4px]">
                        <h4 className="text-[18px] font-bold text-[#111827] leading-tight">{p.title}</h4>
                        <span className="text-[16px] font-extrabold text-[#345b79]">{p.price}</span>
                      </div>
                      <p className="text-[12px] text-gray-500 font-semibold flex items-center gap-[4px]">
                        <svg className="size-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {p.location}
                      </p>
                    </div>

                    {/* Specs border divider */}
                    <div className="border-t border-b border-gray-100 py-[12px] flex items-center justify-around text-center text-[10px] font-bold text-gray-700">
                      <div>
                        <span className="block text-[13px] text-[#111827]">{p.beds}</span>
                        <span className="text-gray-400">BEDS</span>
                      </div>
                      <div className="w-[1px] h-[24px] bg-gray-100" />
                      <div>
                        <span className="block text-[13px] text-[#111827]">{p.baths}</span>
                        <span className="text-gray-400">BATHS</span>
                      </div>
                      <div className="w-[1px] h-[24px] bg-gray-100" />
                      <div>
                        <span className="block text-[13px] text-[#111827]">{p.sqft}</span>
                        <span className="text-gray-400">SQFT</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-[12px]">
                      <button className="flex-1 bg-[#345b79] text-white text-[13px] font-bold py-[12px] rounded-[16px] hover:bg-[#345b79]/90 shadow-sm transition-colors text-center">
                        View Details
                      </button>
                      <button
                        onClick={() => togglePropertySave(p.id)}
                        className={`p-[12px] border rounded-[16px] flex items-center justify-center transition-colors ${
                          p.isSaved
                            ? 'bg-[#be5d3f]/10 border-[#be5d3f]/40 text-[#be5d3f]'
                            : 'border-gray-200 hover:bg-gray-50 text-gray-400'
                        }`}
                      >
                        <svg className="size-[20px]" fill={p.isSaved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* D. AI Land Recommendations */}
          <div className="space-y-[20px]">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-[22px] lg:text-[26px] font-extrabold text-[#111827]">AI Land Recommendations</h3>
                <p className="text-[13px] text-gray-500 font-semibold">High-potential land plots matched to your investment profile</p>
              </div>
              <a href="#" className="flex items-center gap-[6px] text-[13px] font-bold text-[#345b79] hover:underline">
                <span>View all</span>
                <svg className="size-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
              {lands.map((l) => (
                <div key={l.id} className="bg-white rounded-[24px] overflow-hidden border border-[#ccb7a3]/20 shadow-sm flex flex-col group hover:shadow-md transition-all">
                  {/* Card Image */}
                  <div className="h-[160px] w-full overflow-hidden relative">
                    <img src={l.image} alt={l.title} className="size-full object-cover group-hover:scale-105 transition-all duration-300" />
                    
                    <span className="absolute top-[16px] right-[16px] bg-white/95 backdrop-blur-md border border-[#345b79]/20 text-[#345b79] text-[11px] font-extrabold px-[12px] py-[4px] rounded-full shadow-sm">
                      {l.match} Match
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-[20px] flex-1 flex flex-col justify-between space-y-[16px]">
                    <div>
                      <div className="flex justify-between items-start mb-[4px]">
                        <h4 className="text-[16px] font-bold text-[#111827] leading-tight">{l.title}</h4>
                        <span className="text-[16px] font-extrabold text-[#345b79]">{l.price}</span>
                      </div>
                      <div className="space-y-[4px]">
                        <p className="text-[11px] text-gray-500 font-semibold flex items-center gap-[4px] uppercase tracking-wider">
                          <span className="size-[6px] rounded-full bg-gray-400" />
                          {l.location}
                        </p>
                        <p className="text-[11px] text-gray-500 font-semibold flex items-center gap-[4px] uppercase tracking-wider">
                          <span className="size-[6px] rounded-full bg-gray-400" />
                          {l.size}
                        </p>
                        <p className="text-[10px] text-orange-600 font-bold tracking-widest flex items-center gap-[4px] uppercase">
                          <span className="size-[6px] rounded-full bg-[#be5d3f]" />
                          {l.potential}
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-[10px] pt-[8px]">
                      <button className="flex-1 bg-[#be5d3f] text-white text-[12px] font-bold py-[10px] rounded-[14px] hover:bg-[#be5d3f]/90 shadow-sm transition-colors text-center">
                        View Details
                      </button>
                      <button
                        onClick={() => toggleLandSave(l.id)}
                        className={`p-[10px] border rounded-[14px] flex items-center justify-center transition-colors ${
                          l.isSaved
                            ? 'bg-[#be5d3f]/10 border-[#be5d3f]/40 text-[#be5d3f]'
                            : 'border-gray-200 hover:bg-gray-50 text-gray-400'
                        }`}
                      >
                        <svg className="size-[18px]" fill={l.isSaved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* E. Recent Searches & Recently Viewed (Bottom Rows) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
            
            {/* Recent Searches panel */}
            <div className="bg-white rounded-[24px] p-[24px] border border-[#ccb7a3]/20 shadow-sm space-y-[20px]">
              <div className="flex items-center justify-between">
                <h3 className="text-[18px] font-extrabold text-[#111827]">Recent Searches</h3>
                {searches.length > 0 && (
                  <button onClick={clearSearches} className="text-[12px] font-bold text-gray-400 hover:text-red-500 transition-colors">
                    Clear all
                  </button>
                )}
              </div>
              
              <div className="space-y-[12px]">
                {searches.length > 0 ? (
                  searches.map((s) => (
                    <div key={s.id} className="flex items-center justify-between p-[16px] bg-[#f8f9fa] border border-gray-100 rounded-[16px]">
                      <div className="flex items-center gap-[16px]">
                        <div className="bg-[#ccb7a3]/20 p-[10px] rounded-[12px] flex items-center justify-center">
                          <svg className="size-[16px] text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <div className="leading-tight">
                          <h4 className="text-[14px] font-bold text-[#111827]">{s.title}</h4>
                          <span className="text-[11px] text-gray-500 font-semibold">{s.desc}</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold tracking-tight text-right">{s.time}</span>
                    </div>
                  ))
                ) : (
                  <div className="py-[32px] text-center text-gray-400 font-semibold text-[13px]">
                    No recent searches.
                  </div>
                )}
              </div>
            </div>

            {/* Recently Viewed panel */}
            <div className="bg-white rounded-[24px] p-[24px] border border-[#ccb7a3]/20 shadow-sm space-y-[20px]">
              <div className="flex items-center justify-between">
                <h3 className="text-[18px] font-extrabold text-[#111827]">Recently Viewed</h3>
                <a href="#" className="text-[12px] font-bold text-[#345b79] hover:underline">View all</a>
              </div>
              
              <div className="space-y-[12px]">
                {initialRecentlyViewed.map((view) => (
                  <div key={view.id} className="flex items-center justify-between p-[12px] bg-[#f8f9fa] border border-gray-100 rounded-[16px]">
                    <div className="flex items-center gap-[16px]">
                      <img src={view.image} alt={view.title} className="size-[48px] rounded-[12px] object-cover shrink-0" />
                      <div className="leading-tight">
                        <h4 className="text-[14px] font-bold text-[#111827]">{view.title}, {view.location}</h4>
                        <span className="text-[12px] text-[#345b79] font-extrabold">{view.price}</span>
                      </div>
                    </div>
                    <button className="bg-[#345b79]/10 hover:bg-[#345b79]/20 text-[#345b79] text-[11px] font-extrabold px-[16px] py-[8px] rounded-[10px] transition-colors">
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
    </div>
  );
}
