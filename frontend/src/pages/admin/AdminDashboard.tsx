import { useState } from 'react';
import { useNavigate } from 'react-router';

// KPIs stats Samples
const kpis = [
  { name: 'Total Users', value: '12,480', change: '+8.2%', isPositive: true, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', color: 'bg-[#345b79]/10 text-[#345b79]' },
  { name: 'Total Properties', value: '4,852', change: '+5.4%', isPositive: true, icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', color: 'bg-[#495d38]/10 text-[#495d38]' },
  { name: 'Total Lands', value: '2,316', change: '+3.1%', isPositive: true, icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7', color: 'bg-[#be5d3f]/10 text-[#be5d3f]' },
  { name: 'Total Companies', value: '348', change: '+2.8%', isPositive: true, icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'bg-[#6b879c]/10 text-[#6b879c]' }
];

// Bar heights for the 3 Growth Metrics Cards
const userGrowthBars = [38, 48, 43, 57, 72, 62, 76, 91];
const propertyGrowthBars = [28, 33, 38, 52, 48, 62, 81, 86];
const landGrowthBars = [19, 28, 24, 43, 38, 57, 72, 81];

// Recent Registrations
const initialRegistrations = [
  { name: 'Amara Diallo', email: 'amara.diallo@email.com', role: 'Property Buyer', district: 'Accra Central', date: 'Dec 12, 2024', status: 'Active' },
  { name: 'James Osei', email: 'james.osei@email.com', role: 'Architect', district: 'East Legon', date: 'Dec 11, 2024', status: 'Pending' },
  { name: 'Priya Sharma', email: 'priya.sharma@email.com', role: 'Land Buyer', district: 'Airport Res.', date: 'Dec 11, 2024', status: 'Active' },
];

// Latest Listings
const latestProperties = [
  { id: '1', title: '4-Bed Luxury Villa', location: 'East Legon, Accra', price: 'GHS 2.4M', type: 'SALE', status: 'Pending' },
  { id: '2', title: 'Commercial Office', location: 'Airport City, Accra', price: 'GHS 850K', type: 'RENT', status: 'Active' },
];

const latestLands = [
  { id: '3', title: 'Residential Plot 12', location: 'Adenta, Accra • 500 sqm', price: 'GHS 85K', type: 'LAND', status: 'Active' },
  { id: '4', title: 'Commercial Land B4', location: 'Tema Industrial • 2000 sqm', price: 'GHS 420K', type: 'LAND', status: 'Pending' },
];

// Most Popular Districts Ceylon regions
const popularDistricts = [
  { name: 'East Legon', count: 284, percentage: 85, color: 'bg-[#345b79]' },
  { name: 'Airport City', count: 218, percentage: 70, color: 'bg-[#be5d3f]' },
  { name: 'Labone', count: 195, percentage: 60, color: 'bg-[#928d64]' },
  { name: 'Tema', count: 162, percentage: 50, color: 'bg-[#345b79]' }
];

// Governance Pending Table
const initialGovernanceListings = [
  { id: 'G1', title: '3-Bed Apartment', type: 'Property', owner: 'Kofi Acheampong', district: 'Spintex', price: 'GHS 680K', status: 'Pending' },
  { id: 'G2', title: 'Industrial Plot 4A', type: 'Land', owner: 'BuildRight Ltd.', district: 'Tema', price: 'GHS 320K', status: 'Pending' },
];

// Timeline activities
const activities = [
  { text: 'Amara Diallo registered as Property Buyer', time: '10 mins ago', type: 'user' },
  { text: 'James Harrington added Skyline Residences listing', time: '1 hour ago', type: 'listing' },
  { text: 'System backup completed successfully', time: '2 hours ago', type: 'system' },
  { text: 'New verification request from ArchTech Ltd', time: '4 hours ago', type: 'company' }
];

// Notifications
const notifications = [
  { text: '3 pending agent verifications require review', type: 'warning' },
  { text: 'API usage limits reached 85% of monthly quota', type: 'info' },
  { text: 'Server response time spike detected in Region East', type: 'critical' }
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [registrations] = useState(initialRegistrations);
  const [governanceListings, setGovernanceListings] = useState(initialGovernanceListings);

  const handleApproveGovernance = (id: string) => {
    setGovernanceListings(governanceListings.map(item => item.id === id ? { ...item, status: 'Approved' } : item));
  };

  const handleRejectGovernance = (id: string) => {
    setGovernanceListings(governanceListings.map(item => item.id === id ? { ...item, status: 'Rejected' } : item));
  };

  return (
    <div className="h-full w-full flex flex-col lg:flex-row overflow-hidden bg-[#e6e0d4]">
      
      {/* Middle/Left Column Content (Scrolls Independently) */}
      <div className="flex-1 h-full overflow-y-auto p-[20px] md:p-[32px] space-y-[32px]">
        
        {/* TOP ROW KPI METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[24px]">
          {kpis.map((kpi) => (
            <div key={kpi.name} className="bg-white border border-[#ccb7a3]/20 rounded-[24px] p-[24px] shadow-sm flex flex-col justify-between h-[176px] relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className={`size-[40px] rounded-[8px] flex items-center justify-center shrink-0 ${kpi.color}`}>
                  <svg className="size-[20px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={kpi.icon} />
                  </svg>
                </div>
                <div className="bg-[#495d38]/10 px-[8px] py-[4px] rounded-[4px] flex items-center gap-[4px] text-[#495d38] text-[12px] font-bold">
                  <span>↑</span>
                  <span>{kpi.change}</span>
                </div>
              </div>
              <div className="mt-[16px]">
                <h3 className="text-[24px] font-bold text-[#1b1b1b]">{kpi.value}</h3>
              </div>
              <div className="mt-[12px]">
                <span className="text-[12px] font-semibold text-[#72787e] tracking-[0.7px] uppercase">{kpi.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* TREND GROWTH CHARTS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
          
          {/* User Growth Chart */}
          <div className="bg-white border border-[#ccb7a3]/20 rounded-[24px] p-[24px] shadow-sm flex flex-col justify-between h-[256px]">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[12px] font-bold text-[#72787e] tracking-[0.6px] uppercase block">User</span>
                <span className="text-[12px] font-bold text-[#72787e] tracking-[0.6px] uppercase block">Growth</span>
                <h4 className="text-[20px] font-bold text-[#1b1b1b] mt-[4px]">12,480 <span className="text-[#495d38] text-[14px] font-normal pl-[4px]">↑ 8.2%</span></h4>
              </div>
              <span className="text-[12px] font-semibold text-[#72787e] text-right">Last 12<br/>months</span>
            </div>
            <div className="flex items-end justify-between h-[96px] px-[8px] mt-[16px]">
              {userGrowthBars.map((val, idx) => (
                <div
                  key={idx}
                  className={`w-[13px] rounded-t-[4px] transition-all ${
                    idx === userGrowthBars.length - 1 ? 'bg-[#345b79]' : 'bg-[#345b79]/20'
                  }`}
                  style={{ height: `${val}%` }}
                />
              ))}
            </div>
          </div>

          {/* Property Growth Chart */}
          <div className="bg-white border border-[#ccb7a3]/20 rounded-[24px] p-[24px] shadow-sm flex flex-col justify-between h-[256px]">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[12px] font-bold text-[#72787e] tracking-[0.6px] uppercase block">Property</span>
                <span className="text-[12px] font-bold text-[#72787e] tracking-[0.6px] uppercase block">Growth</span>
                <h4 className="text-[20px] font-bold text-[#1b1b1b] mt-[4px]">4,852 <span className="text-[#495d38] text-[14px] font-normal pl-[4px]">↑ 5.4%</span></h4>
              </div>
              <span className="text-[12px] font-semibold text-[#72787e] text-right">Last 12<br/>months</span>
            </div>
            <div className="flex items-end justify-between h-[96px] px-[8px] mt-[16px]">
              {propertyGrowthBars.map((val, idx) => (
                <div
                  key={idx}
                  className={`w-[13px] rounded-t-[4px] transition-all ${
                    idx === propertyGrowthBars.length - 1 ? 'bg-[#ff906e]' : 'bg-[#ff906e]/20'
                  }`}
                  style={{ height: `${val}%` }}
                />
              ))}
            </div>
          </div>

          {/* Land Growth Chart */}
          <div className="bg-white border border-[#ccb7a3]/20 rounded-[24px] p-[24px] shadow-sm flex flex-col justify-between h-[256px]">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[12px] font-bold text-[#72787e] tracking-[0.6px] uppercase block">Land</span>
                <span className="text-[12px] font-bold text-[#72787e] tracking-[0.6px] uppercase block">Growth</span>
                <h4 className="text-[20px] font-bold text-[#1b1b1b] mt-[4px]">2,316 <span className="text-[#495d38] text-[14px] font-normal pl-[4px]">↑ 3.1%</span></h4>
              </div>
              <span className="text-[12px] font-semibold text-[#72787e] text-right">Last 12<br/>months</span>
            </div>
            <div className="flex items-end justify-between h-[96px] px-[8px] mt-[16px]">
              {landGrowthBars.map((val, idx) => (
                <div
                  key={idx}
                  className={`w-[13px] rounded-t-[4px] transition-all ${
                    idx === landGrowthBars.length - 1 ? 'bg-[#b2ac81]' : 'bg-[#b2ac81]/20'
                  }`}
                  style={{ height: `${val}%` }}
                />
              ))}
            </div>
          </div>

        </div>

        {/* Section - AI RECOMMENDATION ANALYTICS */}
        <div className="bg-[#194360] border border-[#ccb7a3]/20 rounded-[24px] p-[32px] shadow-sm text-white relative overflow-hidden flex flex-col gap-[32px]">
          {/* Header Title Block */}
          <div className="flex flex-col gap-[8px]">
            <h3 className="text-[32px] font-bold tracking-[-0.32px]">AI Recommendation Analytics</h3>
            <p className="text-[16px] text-white/80 font-normal">Powered by NexaAI Engine • Real-time matching and verification</p>
          </div>

          {/* AI Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[24px]">
            <div className="flex flex-col gap-[8px]">
              <div className="size-[24px] text-white/85">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-[48px] font-bold tracking-[-0.96px] leading-[48px]">1,842</h4>
              <span className="text-[12px] font-semibold text-white/70 tracking-[1.2px] uppercase">RECOMMENDATIONS TODAY</span>
            </div>
            <div className="flex flex-col gap-[8px]">
              <div className="size-[24px] text-white/85">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-[48px] font-bold tracking-[-0.96px] leading-[48px]">87.4%</h4>
              <span className="text-[12px] font-semibold text-white/70 tracking-[1.2px] uppercase">AVG. MATCH SCORE</span>
            </div>
            <div className="flex flex-col gap-[8px]">
              <div className="size-[24px] text-white/85">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h4 className="text-[48px] font-bold tracking-[-0.96px] leading-[48px]">643</h4>
              <span className="text-[12px] font-semibold text-white/70 tracking-[1.2px] uppercase">CONVERTED TO VIEWS</span>
            </div>
            <div className="flex flex-col gap-[8px]">
              <div className="size-[24px] text-white/85">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h4 className="text-[48px] font-bold tracking-[-0.96px] leading-[48px]">127</h4>
              <span className="text-[12px] font-semibold text-white/70 tracking-[1.2px] uppercase">LEADS GENERATED</span>
            </div>
          </div>

          {/* AI Activity Chart Visual */}
          <div className="flex gap-[12px] h-[144px] items-end justify-center pt-[16px] px-[16px] w-full mt-[12px]">
            <div className="bg-white/10 h-[51.19px] rounded-t-[8px] w-full" />
            <div className="bg-white/10 h-[76.8px] rounded-t-[8px] w-full" />
            <div className="bg-white/10 h-[70.39px] rounded-t-[8px] w-full" />
            <div className="bg-white/10 h-[102.39px] rounded-t-[8px] w-full" />
            <div className="bg-white/10 h-[121.59px] rounded-t-[8px] w-full" />
            <div className="bg-white/20 h-[89.59px] rounded-t-[8px] w-full" />
            <div className="bg-white/10 h-[83.19px] rounded-t-[8px] w-full" />
            <div className="bg-white/10 h-[108.8px] rounded-t-[8px] w-full" />
            <div className="bg-white/10 h-[115.19px] rounded-t-[8px] w-full" />
            <div className="bg-white/10 h-[76.8px] rounded-t-[8px] w-full" />
            <div className="bg-white/10 h-[96px] rounded-t-[8px] w-full" />
            <div className="bg-white/40 h-full rounded-t-[8px] w-full" />
          </div>

          {/* AI Active Indicator Badge */}
          <div className="absolute right-[32px] top-[32px] backdrop-blur-[4px] bg-white/10 border border-white/20 flex gap-[8px] items-center px-[17px] py-[9px] rounded-[9999px]">
            <div className="bg-[#be5d3f] rounded-full size-[8px]" />
            <span className="text-[12px] font-bold text-white tracking-[0.6px]">AI Active</span>
          </div>
        </div>

        {/* Section - GOVERNANCE SECTION (Pending Listings) */}
        <div className="bg-white border border-[#ccb7a3]/20 rounded-[24px] p-[24px] shadow-sm flex flex-col gap-[24px]">
          <div className="flex items-center justify-between">
            <h3 className="text-[20px] font-bold text-[#1b1b1b]">Pending Listings</h3>
            <div className="bg-[#ffdbd1] px-[12px] py-[4px] rounded-[4px] text-[#9c4327] text-[12px] font-bold">
              4 Awaiting Review
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-[#ccb7a3]/10 text-[12px] font-bold tracking-[0.6px] text-[#72787e] uppercase">
                  <th className="pb-[12px]">LISTING</th>
                  <th className="pb-[12px]">TYPE</th>
                  <th className="pb-[12px]">OWNER</th>
                  <th className="pb-[12px]">DISTRICT</th>
                  <th className="pb-[12px]">PRICE</th>
                  <th className="pb-[12px] text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[14px]">
                {governanceListings.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="py-[16px] font-bold text-[#1b1b1b]">{item.title}</td>
                    <td className="py-[16px]">
                      <span className="inline-block bg-[#eae7e7] text-[#72787e] rounded-[4px] px-[8px] py-[2px] font-bold text-[13px]">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-[16px] font-medium text-gray-700">{item.owner}</td>
                    <td className="py-[16px] font-medium text-gray-700">{item.district}</td>
                    <td className="py-[16px] font-bold text-[#1b1b1b]">{item.price}</td>
                    <td className="py-[16px] text-right">
                      {item.status === 'Pending' ? (
                        <div className="flex gap-[8px] justify-end">
                          <button
                            onClick={() => handleRejectGovernance(item.id)}
                            className="bg-[rgba(186,26,26,0.1)] hover:bg-[rgba(186,26,26,0.2)] text-[#ba1a1a] rounded-[8px] px-[16px] py-[6px] text-[12px] font-bold tracking-[0.6px]"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleApproveGovernance(item.id)}
                            className="bg-[#495d38]/10 hover:bg-[#495d38]/20 text-[#495d38] rounded-[8px] px-[16px] py-[6px] text-[12px] font-bold tracking-[0.6px]"
                          >
                            Approve
                          </button>
                        </div>
                      ) : (
                        <span className={`text-[12px] font-bold uppercase tracking-[0.6px] ${
                          item.status === 'Approved' ? 'text-[#495d38]' : 'text-[#ba1a1a]'
                        }`}>
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

        {/* Section - RECENT REGISTRATIONS TABLE */}
        <div className="bg-white border border-[#ccb7a3]/20 rounded-[24px] p-[24px] shadow-sm flex flex-col gap-[24px]">
          <div className="flex items-center justify-between">
            <h3 className="text-[20px] font-bold text-[#1b1b1b]">Recent Registrations</h3>
            <button onClick={() => navigate('/admin/users')} className="text-[12px] font-bold text-[#345b79] hover:underline tracking-[0.6px]">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-[#f6f3f2] border-b border-[#ccb7a3]/10 text-[12px] font-bold tracking-[1.2px] text-[#72787e] uppercase">
                  <th className="py-[16px] px-[24px]">USER</th>
                  <th className="py-[16px] px-[24px]">ROLE</th>
                  <th className="py-[16px] px-[24px]">DISTRICT</th>
                  <th className="py-[16px] px-[24px]">DATE</th>
                  <th className="py-[16px] px-[24px]">STATUS</th>
                  <th className="py-[16px] px-[24px] text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-[13px]">
                {registrations.map((user) => (
                  <tr key={user.email} className="hover:bg-gray-50/30">
                    <td className="py-[16px] px-[24px] font-bold text-[#1b1b1b]">
                      <div>{user.name}</div>
                      <div className="text-[10px] text-gray-400 font-normal">{user.email}</div>
                    </td>
                    <td className="py-[16px] px-[24px] text-gray-600 font-bold">{user.role}</td>
                    <td className="py-[16px] px-[24px] text-gray-600 font-medium">{user.district}</td>
                    <td className="py-[16px] px-[24px] text-gray-500 font-semibold">{user.date}</td>
                    <td className="py-[16px] px-[24px]">
                      <span className={`inline-flex items-center gap-[4px] rounded-full px-[12px] py-[3px] text-[11px] font-bold ${
                        user.status === 'Active'
                          ? 'bg-[#495d38]/10 text-[#495d38]'
                          : 'bg-[#be5d3f]/10 text-[#be5d3f]'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-[16px] px-[24px] text-right">
                      <button className="text-[12px] font-bold text-[#345b79] hover:underline">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Grid row: LATEST PROPERTIES & LATEST LANDS */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-[32px]">
          
          {/* Latest Properties */}
          <div className="bg-white border border-[#ccb7a3]/20 rounded-[24px] p-[24px] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-[20px]">
                <h3 className="text-[16px] font-bold text-[#1b1b1b]">Latest Properties</h3>
                <button onClick={() => navigate('/admin/properties')} className="text-[12px] font-bold text-[#345b79] hover:underline">
                  View All
                </button>
              </div>

              <div className="space-y-[16px]">
                {latestProperties.map((prop) => (
                  <div key={prop.id} className="flex gap-[16px] items-start p-[12px] rounded-[8px] border border-gray-50 hover:border-[#ccb7a3]/20 hover:bg-[#ccb7a3]/10 transition-all">
                    <div className="size-[80px] rounded-[8px] bg-[#ccb7a3]/20 flex items-center justify-center shrink-0 text-gray-400 font-bold text-[10px]">
                      PROP IMAGE
                    </div>
                    <div className="flex-1 min-w-0 leading-tight">
                      <div className="flex items-start justify-between gap-[8px]">
                        <h4 className="text-[14px] font-bold text-[#1b1b1b] truncate">{prop.title}</h4>
                        <span className="text-[14px] font-bold text-[#345b79] shrink-0">{prop.price}</span>
                      </div>
                      <div className="flex items-center gap-[4px] text-[13px] text-gray-500 font-medium mt-[6px]">
                        <span>📍</span>
                        <span>{prop.location}</span>
                      </div>
                      <div className="flex items-center justify-between pt-[8px] mt-[8px] border-t border-gray-100/50">
                        <span className="inline-block bg-[#cbe6ff] text-[#345b79] text-[11px] font-bold rounded-[4px] px-[8px] py-[2px] uppercase">
                          {prop.type}
                        </span>
                        <span className={`text-[12px] font-bold ${
                          prop.status === 'Active' ? 'text-[#495d38]' : 'text-[#be5d3f]'
                        }`}>
                          {prop.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Latest Lands */}
          <div className="bg-white border border-[#ccb7a3]/20 rounded-[24px] p-[24px] shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-[20px]">
                <h3 className="text-[16px] font-bold text-[#1b1b1b]">Latest Lands</h3>
                <button onClick={() => navigate('/admin/properties')} className="text-[12px] font-bold text-[#345b79] hover:underline">
                  View All
                </button>
              </div>

              <div className="space-y-[16px]">
                {latestLands.map((land) => (
                  <div key={land.id} className="flex gap-[16px] items-start p-[12px] rounded-[8px] border border-gray-50 hover:border-[#ccb7a3]/20 hover:bg-[#ccb7a3]/10 transition-all">
                    <div className="size-[80px] rounded-[8px] bg-[#ccb7a3]/20 flex items-center justify-center shrink-0 text-gray-400 font-bold text-[10px]">
                      LAND IMAGE
                    </div>
                    <div className="flex-1 min-w-0 leading-tight">
                      <div className="flex items-start justify-between gap-[8px]">
                        <h4 className="text-[14px] font-bold text-[#1b1b1b] truncate">{land.title}</h4>
                        <span className="text-[14px] font-bold text-[#345b79] shrink-0">{land.price}</span>
                      </div>
                      <div className="flex items-center gap-[4px] text-[13px] text-gray-500 font-medium mt-[6px]">
                        <span>📍</span>
                        <span>{land.location}</span>
                      </div>
                      <div className="flex items-center justify-between pt-[8px] mt-[8px] border-t border-gray-100/50">
                        <span className="inline-block bg-[#ebe4b5] text-[#645f3a] text-[11px] font-bold rounded-[4px] px-[8px] py-[2px] uppercase">
                          {land.type}
                        </span>
                        <span className={`text-[12px] font-bold ${
                          land.status === 'Active' ? 'text-[#495d38]' : 'text-[#be5d3f]'
                        }`}>
                          {land.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Grid row: MOST POPULAR DISTRICTS & MARKET INSIGHTS */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-[32px]">
          
          {/* Most Popular Districts */}
          <div className="bg-white border border-[#ccb7a3]/20 rounded-[24px] p-[24px] shadow-sm">
            <div className="flex items-center justify-between mb-[24px]">
              <div>
                <h3 className="text-[16px] font-bold text-[#1b1b1b]">Most Popular Districts</h3>
                <span className="text-[12px] text-gray-400 font-semibold">By active listings</span>
              </div>
            </div>
            
            <div className="space-y-[20px]">
              {popularDistricts.map((district) => (
                <div key={district.name} className="space-y-[4px]">
                  <div className="flex items-center justify-between text-[14px] font-bold text-[#1b1b1b]">
                    <span>{district.name}</span>
                    <span className="text-[#72787e] font-normal">{district.count}</span>
                  </div>
                  <div className="h-[8px] w-full rounded-full bg-[#f0eded] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${district.color}`}
                      style={{ width: `${district.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Insights */}
          <div className="bg-white border border-[#ccb7a3]/20 rounded-[24px] p-[24px] shadow-sm">
            <div className="flex items-center justify-between mb-[24px]">
              <h3 className="text-[16px] font-bold text-[#1b1b1b]">Market Insights</h3>
              <span className="text-[12px] text-gray-400 font-semibold">Accra Metro Region</span>
            </div>

            <div className="grid grid-cols-2 gap-[16px]">
              <div className="bg-[#f0eded] rounded-[24px] p-[16px] flex flex-col justify-between h-[152px]">
                <div className="flex items-center justify-between">
                  <span className="text-[14px]">🏡</span>
                  <span className="text-[12px] font-bold text-[#495d38]">+4.2%</span>
                </div>
                <div className="mt-auto">
                  <span className="text-[11px] font-bold text-[#72787e] block uppercase">GHS</span>
                  <span className="text-[20px] font-bold text-[#1b1b1b] leading-tight block">1.35M</span>
                  <span className="text-[12px] font-semibold text-[#72787e] block mt-[4px]">Avg. Property Price</span>
                </div>
              </div>
              <div className="bg-[#f0eded] rounded-[24px] p-[16px] flex flex-col justify-between h-[152px]">
                <div className="flex items-center justify-between">
                  <span>🗺️</span>
                  <span className="text-[12px] font-bold text-[#495d38]">+6.8%</span>
                </div>
                <div className="mt-auto">
                  <span className="text-[11px] font-bold text-[#72787e] block uppercase">GHS</span>
                  <span className="text-[20px] font-bold text-[#1b1b1b] leading-tight block">2,450</span>
                  <span className="text-[12px] font-semibold text-[#72787e] block mt-[4px]">Avg. Land Price / sqm</span>
                </div>
              </div>
              <div className="bg-[#f0eded] rounded-[24px] p-[16px] flex flex-col justify-between h-[118px]">
                <div className="flex items-center justify-between">
                  <span>⏱️</span>
                  <span className="text-[12px] font-bold text-[#ba1a1a]">-3.1%</span>
                </div>
                <div className="mt-auto">
                  <span className="text-[20px] font-bold text-[#1b1b1b] leading-tight block">24 days</span>
                  <span className="text-[12px] font-semibold text-[#72787e] block mt-[4px]">Days on Market (avg)</span>
                </div>
              </div>
              <div className="bg-[#f0eded] rounded-[24px] p-[16px] flex flex-col justify-between h-[118px]">
                <div className="flex items-center justify-between">
                  <span>📈</span>
                  <span className="text-[12px] font-bold text-[#495d38]">+2.5%</span>
                </div>
                <div className="mt-auto">
                  <span className="text-[20px] font-bold text-[#1b1b1b] leading-tight block">78/100</span>
                  <span className="text-[12px] font-semibold text-[#72787e] block mt-[4px]">Agent Activity Score</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Quick Actions Row */}
        <div className="bg-white border border-[#ccb7a3]/20 rounded-[24px] p-[24px] shadow-sm">
          <h3 className="text-[16px] font-extrabold text-[#1d1d1d] mb-[16px]">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-[16px]">
            <button onClick={() => navigate('/admin/users')} className="flex flex-col items-center gap-[8px] rounded-[8px] bg-[#ccb7a3]/30 p-[16px] text-center hover:bg-[#ccb7a3]/50 transition-all border border-[#ccb7a3]/20">
              <svg className="size-[24px] text-[#345b79]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span className="text-[12px] font-bold text-gray-700 leading-tight">Add User</span>
            </button>
            <button onClick={() => navigate('/admin/properties')} className="flex flex-col items-center gap-[8px] rounded-[8px] bg-[#ccb7a3]/30 p-[16px] text-center hover:bg-[#ccb7a3]/50 transition-all border border-[#ccb7a3]/20">
              <svg className="size-[24px] text-[#345b79]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span className="text-[12px] font-bold text-gray-700 leading-tight">Review Listings</span>
            </button>
            <button onClick={() => navigate('/admin/analytics')} className="flex flex-col items-center gap-[8px] rounded-[8px] bg-[#ccb7a3]/30 p-[16px] text-center hover:bg-[#ccb7a3]/50 transition-all border border-[#ccb7a3]/20">
              <svg className="size-[24px] text-[#345b79]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-[12px] font-bold text-gray-700 leading-tight">View Analytics</span>
            </button>
            <button className="flex flex-col items-center gap-[8px] rounded-[8px] bg-[#ccb7a3]/30 p-[16px] text-center hover:bg-[#ccb7a3]/50 transition-all border border-[#ccb7a3]/20">
              <svg className="size-[24px] text-[#345b79]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              </svg>
              <span className="text-[12px] font-bold text-gray-700 leading-tight">Config Panel</span>
            </button>
          </div>
        </div>

      </div>

      {/* Right Column Sidebar (Scrolls Independently) */}
      <div className="hidden lg:block w-[320px] shrink-0 border-l border-[#ccb7a3]/30 bg-white h-full overflow-y-auto p-[24px] space-y-[32px] shadow-sm">
        
        {/* Notifications Panel */}
        <div className="bg-white rounded-[12px] space-y-[16px]">
          <h3 className="text-[16px] font-extrabold text-[#1d1d1d]">Notifications</h3>
          <div className="space-y-[12px]">
            {notifications.map((notif, idx) => (
              <div key={idx} className={`p-[12px] rounded-[8px] text-[12px] font-semibold leading-normal flex gap-[8px] items-start border ${
                notif.type === 'critical'
                  ? 'bg-[#be5d3f]/10 text-[#be5d3f] border-[#be5d3f]/20'
                  : notif.type === 'warning'
                  ? 'bg-[#be5d3f]/10 text-[#be5d3f] border-[#be5d3f]/20'
                  : 'bg-[#6b879c]/10 text-[#345b79] border-[#6b879c]/20'
              }`}>
                <span className="mt-[2px] font-bold">!</span>
                <span>{notif.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Timeline Log */}
        <div className="bg-white space-y-[20px]">
          <h3 className="text-[16px] font-extrabold text-[#1d1d1d]">Recent Activities</h3>
          <div className="relative pl-[20px] space-y-[24px] before:absolute before:left-[7px] before:top-[4px] before:bottom-[4px] before:w-[2px] before:bg-gray-150">
            {activities.map((act, idx) => (
              <div key={idx} className="relative leading-tight text-[13px]">
                <div className="absolute -left-[20px] top-[4px] size-[10px] rounded-full border-2 border-white bg-[#345b79]" />
                <p className="font-bold text-gray-700">{act.text}</p>
                <span className="text-[11px] text-gray-400 font-semibold">{act.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Health Statuses */}
        <div className="bg-white space-y-[20px]">
          <h3 className="text-[16px] font-extrabold text-[#1d1d1d]">System Health</h3>
          <div className="space-y-[16px]">
            <div className="space-y-[4px]">
              <div className="flex justify-between text-[12px] font-bold text-gray-600">
                <span>Server CPU</span>
                <span>34%</span>
              </div>
              <div className="h-[6px] w-full rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-[#495d38] rounded-full" style={{ width: '34%' }} />
              </div>
            </div>
            <div className="space-y-[4px]">
              <div className="flex justify-between text-[12px] font-bold text-gray-600">
                <span>RAM Usage</span>
                <span>56%</span>
              </div>
              <div className="h-[6px] w-full rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-[#be5d3f] rounded-full" style={{ width: '56%' }} />
              </div>
            </div>
            <div className="space-y-[4px]">
              <div className="flex justify-between text-[12px] font-bold text-gray-600">
                <span>API Response Rate</span>
                <span>99.8%</span>
              </div>
              <div className="h-[6px] w-full rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full bg-[#495d38] rounded-full" style={{ width: '99.8%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Storage Usage card */}
        <div className="bg-white space-y-[12px]">
          <h3 className="text-[16px] font-extrabold text-[#1d1d1d]">Storage Usage</h3>
          <div className="flex items-baseline gap-[4px]">
            <span className="text-[24px] font-extrabold text-[#1d1d1d]">78.4 GB</span>
            <span className="text-[12px] text-gray-500 font-bold">used of 100 GB</span>
          </div>
          <div className="h-[12px] w-full rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full bg-[#be5d3f] rounded-full" style={{ width: '78.4%' }} />
          </div>
          <span className="text-[11px] text-gray-400 font-bold block">Next billing cycle: July 28, 2026</span>
        </div>

      </div>

    </div>
  );
}
