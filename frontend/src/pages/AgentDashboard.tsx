import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

// ─── Local Saved Image & SVG Asset Constants ─────────────────────────────────
const imgPalmVillaThumb = "/hero_property.png";
const imgPalmVillaMain = "/hero_property.png";
const imgSkyApt = "/property_card_1.png";
const imgTownhouse = "/property_card_2.png";
const imgCommercialPlot = "/property_card_3.png";
const imgResidentialPlot = "/property_card_4.png";
const imgIndustrialZone = "/property_card_1.png";

const imgContainer = "/svg/email.svg"; // Notification Bell / Alert icon
const imgContainer1 = "/svg/home.svg"; // Total Properties Icon
const imgContainer2 = "/svg/land-plot-icon.svg"; // Total Lands Icon
const imgContainer3 = "/svg/eye.svg"; // Views Icon
const imgContainer4 = "/svg/bookmark.svg"; // Heart / Saved
const imgContainer5 = "/svg/email.svg"; // Message / Enquiries
const imgContainer6 = "/svg/eye.svg"; // Activity views eye
const imgContainer7 = "/svg/heart.svg"; // Activity heart
const imgContainer8 = "/svg/email.svg"; // Activity chat bubble
const imgIcon1 = "/svg/eye.svg"; // Views metadata
const imgIcon2 = "/svg/heart.svg"; // Saved metadata
const imgContainer14 = "/svg/eye.svg"; // Action view
const imgContainer15 = "/svg/sparks-settings-icon.svg"; // Action edit
const imgContainer16 = "/svg/clock.svg"; // Action delete / remove
const imgContainer17 = "/svg/eye.svg"; // Sub summary property views
const imgContainer18 = "/svg/eye.svg"; // Sub summary land views
const imgSidebarLogo = "/src/assets/logo.png";

const imgSvg = "/svg/home.svg";
const imgSvg1 = "/svg/home.svg";
const imgSvg2 = "/svg/land-plot-icon.svg";
const imgSvg6 = "/svg/high-potential-icon.svg";
const imgSvg8 = "/svg/agent.svg";
const imgSvg9 = "/svg/sparks-settings-icon.svg";
const imgSvg10 = "/svg/sign-in.svg";

interface DashboardListing {
  id: number;
  title: string;
  type: 'PROPERTY' | 'LAND';
  status: 'Active' | 'Pending' | 'Inactive';
  views: number;
  saved: number;
  image: string;
}

const initialListings: DashboardListing[] = [
  {
    id: 1,
    title: "Palm Villa, Jumeirah",
    type: "PROPERTY",
    status: "Active",
    views: 3240,
    saved: 182,
    image: imgPalmVillaThumb
  },
  {
    id: 2,
    title: "Sky Apt, Downtown Dubai",
    type: "PROPERTY",
    status: "Active",
    views: 2180,
    saved: 97,
    image: imgSkyApt
  },
  {
    id: 3,
    title: "Townhouse, Arabian Ranches",
    type: "PROPERTY",
    status: "Pending",
    views: 1540,
    saved: 64,
    image: imgTownhouse
  },
  {
    id: 4,
    title: "Commercial Plot #A-09, Expo City",
    type: "LAND",
    status: "Active",
    views: 1870,
    saved: 53,
    image: imgCommercialPlot
  },
  {
    id: 5,
    title: "Residential Plot, JVC Phase 3",
    type: "LAND",
    status: "Active",
    views: 1290,
    saved: 41,
    image: imgResidentialPlot
  },
  {
    id: 6,
    title: "Industrial Zone Plot, DIP",
    type: "LAND",
    status: "Inactive",
    views: 620,
    saved: 18,
    image: imgIndustrialZone
  }
];

export default function AgentDashboard() {
  const navigate = useNavigate();
  const [listings, setListings] = useState<DashboardListing[]>(initialListings);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Toggle status
  const toggleStatus = (id: number) => {
    setListings(prev =>
      prev.map(l => {
        if (l.id === id) {
          const nextStatusMap: Record<'Active' | 'Pending' | 'Inactive', 'Active' | 'Pending' | 'Inactive'> = {
            Active: "Pending",
            Pending: "Inactive",
            Inactive: "Active"
          };
          return { ...l, status: nextStatusMap[l.status] };
        }
        return l;
      })
    );
  };

  // Mock Delete Listing
  const deleteListing = (id: number) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      setListings(prev => prev.filter(l => l.id !== id));
    }
  };

  return (
    <div 
      className="min-h-screen w-full relative flex flex-row items-start font-normal text-[#1a1c1e]"
      style={{ backgroundImage: "linear-gradient(90deg, rgb(230, 224, 212) 0%, rgb(230, 224, 212) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }}
    >
      
      {/* ─── 1. Left Sidebar Navigation ─────────────────────────────────────── */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-[256px] bg-[#345b79] flex flex-col justify-between pt-[76px] pb-[24px] px-[16px] transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand header */}
        <div className="absolute top-[11px] left-0 right-0 px-[32px] flex items-center gap-[12px]">
          <div className="bg-white/20 flex items-center justify-center rounded-[12px] size-[40px]">
            <img alt="NexaBuild Logo" className="size-[20px] object-contain" src={imgSidebarLogo} />
          </div>
          <span className="text-[24px] font-extrabold text-white tracking-[-0.6px] leading-[32px]">
            NexaBuild
          </span>
        </div>

        {/* Sidebar Nav */}
        <div className="flex-1 flex flex-col justify-between overflow-y-auto mt-[20px]">
          <nav className="flex flex-col gap-[4px]">
            <Link 
              to="/agent-dashboard" 
              className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[8px] bg-[#52748c] text-white font-normal text-[14px]"
            >
              <img alt="Dashboard" className="size-[20px]" src={imgSvg} />
              <span className="leading-[20px]">Dashboard</span>
            </Link>
            <Link 
              to="/view-all-properties" 
              className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[8px] text-white/70 hover:bg-white/5 hover:text-white transition-all font-normal text-[14px]"
            >
              <img alt="Properties" className="size-[20px] filter brightness-200" src={imgSvg1} />
              <span className="leading-[20px]">Properties</span>
            </Link>
            <Link 
              to="/view-all-land" 
              className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[8px] text-white/70 hover:bg-white/5 hover:text-white transition-all font-normal text-[14px]"
            >
              <img alt="Lands" className="size-[20px] filter brightness-200" src={imgSvg2} />
              <span className="leading-[20px]">Lands</span>
            </Link>

            {/* Quick Actions Header */}
            <div className="px-[16px] pt-[20px] pb-[8px] text-[11px] font-bold tracking-[1px] uppercase text-white/40">
              Quick Actions
            </div>
            <Link 
              to="/add-property" 
              className="flex items-center gap-[12px] px-[16px] py-[10px] rounded-[8px] text-white/70 hover:bg-white/5 hover:text-white transition-all font-normal text-[13px]"
            >
              <span className="text-[16px] font-bold text-white/60">+</span>
              <span className="leading-[20px]">Add Property</span>
            </Link>
            <Link 
              to="/land" 
              className="flex items-center gap-[12px] px-[16px] py-[10px] rounded-[8px] text-white/70 hover:bg-white/5 hover:text-white transition-all font-normal text-[13px]"
            >
              <span className="text-[16px] font-bold text-white/60">+</span>
              <span className="leading-[20px]">Add Land</span>
            </Link>

            {/* Analysis Header */}
            <div className="px-[16px] pt-[20px] pb-[8px] text-[11px] font-bold tracking-[1px] uppercase text-white/40">
              Analysis
            </div>
            <Link 
              to="/admin/analytics" 
              className="flex items-center gap-[12px] px-[16px] py-[10px] rounded-[8px] text-white/70 hover:bg-white/5 hover:text-white transition-all font-normal text-[13px]"
            >
              <img alt="Analytics" className="size-[18px] filter brightness-200" src={imgSvg6} />
              <span className="leading-[20px]">Analytics</span>
            </Link>
            <Link 
              to="#" 
              className="flex items-center gap-[12px] px-[16px] py-[10px] rounded-[8px] text-white/70 hover:bg-white/5 hover:text-white transition-all font-normal text-[13px]"
            >
              <img alt="Profile" className="size-[18px] filter brightness-200" src={imgSvg8} />
              <span className="leading-[20px]">Profile</span>
            </Link>
          </nav>

          <nav className="flex flex-col gap-[4px] border-t border-white/10 pt-[20px]">
            <Link 
              to="#" 
              className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[8px] text-white/70 hover:bg-white/5 hover:text-white transition-all font-normal text-[14px]"
            >
              <img alt="Settings" className="size-[20px] filter brightness-200" src={imgSvg9} />
              <span className="leading-[20px]">Settings</span>
            </Link>
            <Link 
              to="/auth/login" 
              className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[8px] text-white/70 hover:bg-white/5 hover:text-white transition-all font-normal text-[14px]"
            >
              <img alt="Logout" className="size-[20px] filter brightness-200" src={imgSvg10} />
              <span className="leading-[20px]">Logout</span>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/45 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── 2. Main Content Area ───────────────────────────────────────────── */}
      <main className="flex-1 lg:pl-[256px] min-w-0 flex flex-col">
        
        {/* Sticky Top Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-[#e5e7eb] px-[24px] lg:px-[32px] py-[16px] flex items-center justify-between sticky top-0 z-30 shadow-sm gap-[16px]">
          <div className="flex flex-col gap-[2px]">
            <div className="flex items-center gap-[12px]">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-[6px] border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none"
                aria-label="Open menu drawer"
              >
                <svg className="size-[20px] text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h2 className="text-[20px] font-bold text-[#1a1c1e] tracking-tight leading-[28px]">
                Agent Dashboard
              </h2>
            </div>
            <p className="text-[12px] text-[#42474d] hidden sm:block">
              Manage your properties, lands, and performance metrics
            </p>
          </div>

          {/* Right Bell alerts action */}
          <div className="relative cursor-pointer p-[8px] bg-gray-100 hover:bg-gray-200 rounded-full transition-colors flex items-center justify-center size-[40px]">
            <img alt="Notifications" className="size-[20px]" src={imgContainer} />
            <div className="absolute bg-[#be5d3f] border-2 border-white rounded-full size-[12px] top-[4px] right-[4px] shadow" />
          </div>
        </header>

        {/* Content Body Layout */}
        <div className="p-[24px] lg:p-[32px] flex flex-col gap-[32px] w-full max-w-[1400px] mx-auto">
          
          {/* Top Metrics Row */}
          <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-[20px] w-full">
            {/* Card 1: Total Properties */}
            <div className="bg-white rounded-[16px] p-[24px] shadow-sm flex flex-col gap-[12px] hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between w-full">
                <div className="bg-[#194360]/10 flex items-center justify-center rounded-[12px] size-[48px]">
                  <img alt="Properties" className="h-[18px] w-[20px]" src={imgContainer1} />
                </div>
                <div className="bg-[#f0fdf4] rounded-[8px] px-[8px] py-[4px] text-[#16a34a] text-[12px] font-bold whitespace-nowrap">
                  +6%
                </div>
              </div>
              <div>
                <p className="text-[30px] font-bold text-[#1a1c1e] leading-[36px]">48</p>
                <p className="text-[14px] text-[#42474d] leading-[20px] mt-[4px]">Total Properties</p>
              </div>
            </div>

            {/* Card 2: Total Lands */}
            <div className="bg-white rounded-[16px] p-[24px] shadow-sm flex flex-col gap-[12px] hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between w-full">
                <div className="bg-[#be5d3f]/10 flex items-center justify-center rounded-[12px] size-[48px]">
                  <img alt="Lands" className="size-[18px]" src={imgContainer2} />
                </div>
                <div className="bg-[#f0fdf4] rounded-[8px] px-[8px] py-[4px] text-[#16a34a] text-[12px] font-bold whitespace-nowrap">
                  +3%
                </div>
              </div>
              <div>
                <p className="text-[30px] font-bold text-[#1a1c1e] leading-[36px]">23</p>
                <p className="text-[14px] text-[#42474d] leading-[20px] mt-[4px]">Total Lands</p>
              </div>
            </div>

            {/* Card 3: Total Views */}
            <div className="bg-white rounded-[16px] p-[24px] shadow-sm flex flex-col gap-[12px] hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between w-full">
                <div className="bg-[#a4cbee]/10 flex items-center justify-center rounded-[12px] size-[48px]">
                  <img alt="Views" className="h-[15px] w-[22px]" src={imgContainer3} />
                </div>
                <div className="bg-[#f0fdf4] rounded-[8px] px-[8px] py-[4px] text-[#16a34a] text-[12px] font-bold whitespace-nowrap">
                  +18%
                </div>
              </div>
              <div>
                <p className="text-[30px] font-bold text-[#1a1c1e] leading-[36px]">14.2K</p>
                <p className="text-[14px] text-[#42474d] leading-[20px] mt-[4px]">Total Views</p>
              </div>
            </div>

            {/* Card 4: Saved by Users */}
            <div className="bg-white rounded-[16px] p-[24px] shadow-sm flex flex-col gap-[12px] hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between w-full">
                <div className="bg-[#928d64]/10 flex items-center justify-center rounded-[12px] size-[48px]">
                  <img alt="Saved icon" className="h-[18px] w-[20px]" src={imgContainer4} />
                </div>
                <div className="bg-[#f0fdf4] rounded-[8px] px-[8px] py-[4px] text-[#16a34a] text-[12px] font-bold whitespace-nowrap">
                  +9%
                </div>
              </div>
              <div>
                <p className="text-[30px] font-bold text-[#1a1c1e] leading-[36px]">892</p>
                <p className="text-[14px] text-[#42474d] leading-[20px] mt-[4px]">Saved by Users</p>
              </div>
            </div>

            {/* Card 5: Total Enquiries */}
            <div className="bg-white rounded-[16px] p-[24px] shadow-sm flex flex-col gap-[12px] hover:shadow-md transition-shadow col-span-2 md:col-span-1">
              <div className="flex items-center justify-between w-full">
                <div className="bg-[#73511d]/10 flex items-center justify-center rounded-[12px] size-[48px]">
                  <img alt="Enquiries icon" className="size-[20px]" src={imgContainer5} />
                </div>
                <div className="bg-[#f0fdf4] rounded-[8px] px-[8px] py-[4px] text-[#16a34a] text-[12px] font-bold whitespace-nowrap">
                  +22%
                </div>
              </div>
              <div>
                <p className="text-[30px] font-bold text-[#1a1c1e] leading-[36px]">317</p>
                <p className="text-[14px] text-[#42474d] leading-[20px] mt-[4px]">Total Enquiries</p>
              </div>
            </div>
          </section>

          {/* Charts & Side Panels segment */}
          <section className="grid grid-cols-1 xl:grid-cols-12 gap-[24px] w-full">
            
            {/* Left: Charts column */}
            <div className="xl:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-[24px]">
              
              {/* Chart card 1: Property Performance */}
              <div className="bg-white rounded-[16px] p-[24px] shadow-sm flex flex-col gap-[20px]">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[18px] font-bold text-[#1a1c1e]">Property Performance</h3>
                    <p className="text-[12px] text-[#42474d] mt-[2px]">Views & enquiries over 7 months</p>
                  </div>
                  <div className="bg-[#345b79] rounded-full size-[12px]" />
                </div>

                {/* Mock bar chart container */}
                <div className="flex items-end justify-between h-[180px] px-[8px] pt-[16px] border-b border-gray-100">
                  <div className="flex flex-col items-center gap-[8px] w-[26px]">
                    <div className="bg-[#345b79]/20 h-[72px] w-full rounded-t-[4px] hover:bg-[#345b79]/45 transition-colors" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Jan</span>
                  </div>
                  <div className="flex flex-col items-center gap-[8px] w-[26px]">
                    <div className="bg-[#345b79]/40 h-[104px] w-full rounded-t-[4px] hover:bg-[#345b79]/45 transition-colors" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Feb</span>
                  </div>
                  <div className="flex flex-col items-center gap-[8px] w-[26px]">
                    <div className="bg-[#345b79]/30 h-[88px] w-full rounded-t-[4px] hover:bg-[#345b79]/45 transition-colors" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Mar</span>
                  </div>
                  <div className="flex flex-col items-center gap-[8px] w-[26px]">
                    <div className="bg-[#345b79]/70 h-[136px] w-full rounded-t-[4px] hover:bg-[#345b79]/45 transition-colors" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Apr</span>
                  </div>
                  <div className="flex flex-col items-center gap-[8px] w-[26px]">
                    <div className="bg-[#345b79]/60 h-[120px] w-full rounded-t-[4px] hover:bg-[#345b79]/45 transition-colors" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase">May</span>
                  </div>
                  <div className="flex flex-col items-center gap-[8px] w-[26px]">
                    <div className="bg-[#345b79]/80 h-[156px] w-full rounded-t-[4px] hover:bg-[#345b79]/45 transition-colors" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Jun</span>
                  </div>
                  <div className="flex flex-col items-center gap-[8px] w-[26px]">
                    <div className="bg-[#345b79] h-[142px] w-full rounded-t-[4px] hover:bg-[#345b79]/90 transition-colors" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Jul</span>
                  </div>
                </div>
              </div>

              {/* Chart card 2: Land Performance */}
              <div className="bg-white rounded-[16px] p-[24px] shadow-sm flex flex-col gap-[20px]">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[18px] font-bold text-[#1a1c1e]">Land Performance</h3>
                    <p className="text-[12px] text-[#42474d] mt-[2px]">Views & enquiries over 7 months</p>
                  </div>
                  <div className="bg-[#be5d3f] rounded-full size-[12px]" />
                </div>

                {/* Mock bar chart container */}
                <div className="flex items-end justify-between h-[180px] px-[8px] pt-[16px] border-b border-gray-100">
                  <div className="flex flex-col items-center gap-[8px] w-[26px]">
                    <div className="bg-[#be5d3f]/20 h-[48px] w-full rounded-t-[4px] hover:bg-[#be5d3f]/45 transition-colors" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Jan</span>
                  </div>
                  <div className="flex flex-col items-center gap-[8px] w-[26px]">
                    <div className="bg-[#be5d3f]/40 h-[80px] w-full rounded-t-[4px] hover:bg-[#be5d3f]/45 transition-colors" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Feb</span>
                  </div>
                  <div className="flex flex-col items-center gap-[8px] w-[26px]">
                    <div className="bg-[#be5d3f]/30 h-[72px] w-full rounded-t-[4px] hover:bg-[#be5d3f]/45 transition-colors" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Mar</span>
                  </div>
                  <div className="flex flex-col items-center gap-[8px] w-[26px]">
                    <div className="bg-[#be5d3f]/60 h-[112px] w-full rounded-t-[4px] hover:bg-[#be5d3f]/45 transition-colors" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Apr</span>
                  </div>
                  <div className="flex flex-col items-center gap-[8px] w-[26px]">
                    <div className="bg-[#be5d3f]/50 h-[96px] w-full rounded-t-[4px] hover:bg-[#be5d3f]/45 transition-colors" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase">May</span>
                  </div>
                  <div className="flex flex-col items-center gap-[8px] w-[26px]">
                    <div className="bg-[#be5d3f]/80 h-[144px] w-full rounded-t-[4px] hover:bg-[#be5d3f]/45 transition-colors" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Jun</span>
                  </div>
                  <div className="flex flex-col items-center gap-[8px] w-[26px]">
                    <div className="bg-[#be5d3f] h-[128px] w-full rounded-t-[4px] hover:bg-[#be5d3f]/90 transition-colors" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Jul</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right: Side Info Panel column */}
            <div className="xl:col-span-3 flex flex-col gap-[24px]">
              
              {/* Notifications Card */}
              <div className="bg-white rounded-[16px] p-[24px] shadow-sm flex flex-col gap-[16px]">
                <div className="flex justify-between items-center w-full">
                  <h4 className="text-[16px] font-bold text-[#1a1c1e]">Notifications</h4>
                  <div className="bg-[#be5d3f] text-white rounded-full size-[20px] flex items-center justify-center text-[10px] font-bold">
                    4
                  </div>
                </div>

                <div className="flex flex-col gap-[16px]">
                  {/* Item 1 */}
                  <div className="flex items-start gap-[12px] text-[13px]">
                    <div className="bg-[#194360]/10 rounded-full p-[8px] flex items-center justify-center shrink-0">
                      <img alt="" className="h-[11.2px] w-[16.5px]" src={imgContainer6} />
                    </div>
                    <div>
                      <p className="text-gray-800 leading-tight">
                        New enquiry on <span className="font-bold text-[#194360]">Palm Villa</span>
                      </p>
                      <span className="text-[10px] text-gray-400 mt-[2px] block">5m ago</span>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-start gap-[12px] text-[13px]">
                    <div className="bg-[#be5d3f]/10 rounded-full p-[8px] flex items-center justify-center shrink-0">
                      <img alt="" className="size-[15px]" src={imgContainer7} />
                    </div>
                    <div>
                      <p className="text-gray-800 leading-tight">
                        <span className="font-bold text-[#be5d3f]">42 new views</span> on plot #A-09
                      </p>
                      <span className="text-[10px] text-gray-400 mt-[2px] block">1h ago</span>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="flex items-start gap-[12px] text-[13px]">
                    <div className="bg-[#928d64]/10 rounded-full p-[8px] flex items-center justify-center shrink-0">
                      <img alt="" className="size-[15px]" src={imgContainer8} />
                    </div>
                    <div>
                      <p className="text-gray-800 leading-tight">
                        Villa saved by <span className="font-bold text-[#928d64]">3 buyers</span>
                      </p>
                      <span className="text-[10px] text-gray-400 mt-[2px] block">2h ago</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Market Insight */}
              <div className="bg-[#194360] text-white rounded-[16px] p-[24px] shadow-sm flex flex-col gap-[12px]">
                <h4 className="text-[14px] font-bold uppercase tracking-[1px] opacity-75">Property Market Insight</h4>
                <p className="text-[14px] leading-[22px]">
                  Dubai residential prices up 8.2% this quarter. High demand in JVC and Al Barsha.
                </p>
                <div className="bg-white/15 rounded-full px-[12px] py-[6px] text-[11px] font-bold text-center self-start select-none">
                  Trending: Apartment Sales
                </div>
              </div>

              {/* Land Market Insight */}
              <div className="bg-[#be5d3f] text-white rounded-[16px] p-[24px] shadow-sm flex flex-col gap-[12px]">
                <h4 className="text-[14px] font-bold uppercase tracking-[1px] opacity-75">Land Market Insight</h4>
                <p className="text-[14px] leading-[22px]">
                  Commercial plots near Expo City seeing 14% appreciation. Strong investor activity.
                </p>
                <div className="bg-white/15 rounded-full px-[12px] py-[6px] text-[11px] font-bold text-center self-start select-none">
                  Hot Zone: Dubai South
                </div>
              </div>

            </div>

          </section>

          {/* Highlights middle row */}
          <section className="grid grid-cols-1 xl:grid-cols-12 gap-[24px] w-full">
            
            {/* Col 1: Featured Listing card */}
            <div className="xl:col-span-5 bg-white rounded-[16px] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group">
              <div className="h-[220px] relative overflow-hidden bg-gray-100">
                <img alt="Palm Villa Jumeirah" className="size-full object-cover group-hover:scale-102 transition-transform duration-300" src={imgPalmVillaMain} />
                <div className="absolute top-[16px] left-[16px] bg-[#be5d3f] rounded-[4px] px-[8px] py-[4px] shadow-sm">
                  <span className="text-white text-[10px] font-bold tracking-[0.5px] uppercase">
                    MOST VIEWED
                  </span>
                </div>
              </div>

              <div className="p-[24px] flex-grow flex flex-col justify-between gap-[16px]">
                <div>
                  <h3 className="text-[20px] font-bold text-[#1a1c1e]">Palm Villa, Jumeirah</h3>
                  <p className="text-[13px] text-[#42474d] mt-[4px]">5 Bed • 6 Bath • 7,200 sqft</p>
                  
                  {/* Views & Saves stats metadata */}
                  <div className="flex gap-[16px] items-center text-[12px] text-gray-500 mt-[12px]">
                    <div className="flex items-center gap-[4px]">
                      <img alt="" className="size-[14px] opacity-60" src={imgIcon1} />
                      <span>3,240 views</span>
                    </div>
                    <div className="flex items-center gap-[4px]">
                      <img alt="" className="size-[14px] opacity-60" src={imgIcon2} />
                      <span>182 saved</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-[12px]">
                  <button 
                    onClick={() => navigate('/property-listing')}
                    className="flex-1 bg-[#194360] hover:bg-[#194360]/95 text-white text-[14px] font-bold py-[10px] rounded-[8px] transition-colors text-center cursor-pointer"
                  >
                    View Listing
                  </button>
                  <button 
                    onClick={() => toggleStatus(1)}
                    className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 text-[#1a1c1e] text-[14px] font-bold py-[10px] rounded-[8px] transition-colors text-center cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>

            {/* Col 2: Recent Activity list */}
            <div className="xl:col-span-4 bg-white rounded-[16px] p-[24px] shadow-sm flex flex-col gap-[20px]">
              <h3 className="text-[16px] font-bold text-[#1a1c1e]">Recent Activity</h3>
              
              <div className="flex flex-col gap-[20px] justify-between flex-grow">
                {/* Item 1 */}
                <div className="flex items-start gap-[16px]">
                  <div className="bg-[#194360]/10 rounded-full p-[8px] flex items-center justify-center shrink-0">
                    <img alt="" className="h-[11.2px] w-[16.5px]" src={imgContainer6} />
                  </div>
                  <div>
                    <p className="text-[14px] leading-[20px] text-gray-800">
                      <span className="font-bold text-[#1a1c1e]">Palm Villa</span> viewed <span className="font-bold text-[#194360]">24 times</span> today
                    </p>
                    <span className="text-[10px] text-gray-400 block mt-[2px]">2h ago</span>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex items-start gap-[16px]">
                  <div className="bg-[#be5d3f]/10 rounded-full p-[8px] flex items-center justify-center shrink-0">
                    <img alt="" className="size-[15px]" src={imgContainer7} />
                  </div>
                  <div>
                    <p className="text-[14px] leading-[20px] text-gray-800">
                      <span className="font-bold text-[#1a1c1e]">Plot #A-09</span> saved by <span className="font-bold text-[#be5d3f]">5 buyers</span>
                    </p>
                    <span className="text-[10px] text-gray-400 block mt-[2px]">4h ago</span>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="flex items-start gap-[16px]">
                  <div className="bg-[#928d64]/10 rounded-full p-[8px] flex items-center justify-center shrink-0">
                    <img alt="" className="size-[15px]" src={imgContainer8} />
                  </div>
                  <div>
                    <p className="text-[14px] leading-[20px] text-gray-800">
                      Enquiry from <span className="font-bold text-[#1a1c1e]">Sara M.</span> on Sky Apt
                    </p>
                    <span className="text-[10px] text-gray-400 block mt-[2px]">6h ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Col 3: Top Locations progress bars list */}
            <div className="xl:col-span-3 bg-white rounded-[16px] p-[24px] shadow-sm flex flex-col gap-[20px]">
              <h3 className="text-[16px] font-bold text-[#1a1c1e]">Top Locations</h3>
              
              <div className="flex flex-col gap-[18px] justify-between flex-grow">
                {/* Location 1: Jumeirah */}
                <div className="space-y-[6px]">
                  <div className="flex justify-between items-center text-[12px]">
                    <span className="font-medium text-[#1a1c1e]">Jumeirah</span>
                    <span className="font-bold text-[#42474d]">84%</span>
                  </div>
                  <div className="bg-gray-100 h-[8px] rounded-full overflow-hidden">
                    <div className="bg-[#194360] h-full rounded-full" style={{ width: '84%' }} />
                  </div>
                </div>

                {/* Location 2: Downtown Dubai */}
                <div className="space-y-[6px]">
                  <div className="flex justify-between items-center text-[12px]">
                    <span className="font-medium text-[#1a1c1e]">Downtown Dubai</span>
                    <span className="font-bold text-[#42474d]">71%</span>
                  </div>
                  <div className="bg-gray-100 h-[8px] rounded-full overflow-hidden">
                    <div className="bg-[#194360] h-full rounded-full" style={{ width: '71%' }} />
                  </div>
                </div>

                {/* Location 3: Expo City */}
                <div className="space-y-[6px]">
                  <div className="flex justify-between items-center text-[12px]">
                    <span className="font-medium text-[#1a1c1e]">Expo City</span>
                    <span className="font-bold text-[#42474d]">63%</span>
                  </div>
                  <div className="bg-gray-100 h-[8px] rounded-full overflow-hidden">
                    <div className="bg-[#194360] h-full rounded-full" style={{ width: '63%' }} />
                  </div>
                </div>

                {/* Location 4: JVC */}
                <div className="space-y-[6px]">
                  <div className="flex justify-between items-center text-[12px]">
                    <span className="font-medium text-[#1a1c1e]">JVC</span>
                    <span className="font-bold text-[#42474d]">55%</span>
                  </div>
                  <div className="bg-gray-100 h-[8px] rounded-full overflow-hidden">
                    <div className="bg-[#194360] h-full rounded-full" style={{ width: '55%' }} />
                  </div>
                </div>
              </div>
            </div>

          </section>

          {/* Sub-summaries Row (views overview details) */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-[20px] w-full">
            {/* Card 1: Property Views */}
            <div className="bg-white rounded-[16px] p-[32px] shadow-sm flex items-center gap-[24px]">
              <div className="bg-[#194360]/10 flex items-center justify-center rounded-[16px] size-[64px]">
                <img alt="" className="h-[22.5px] w-[25px]" src={imgContainer17} />
              </div>
              <div className="space-y-[2px]">
                <p className="text-[14px] text-[#42474d]">Property Views</p>
                <h3 className="text-[30px] font-bold text-[#1a1c1e] leading-[36px]">9,840</h3>
                <p className="text-[12px] font-bold text-[#16a34a]">+15% this month</p>
              </div>
            </div>

            {/* Card 2: Land Views */}
            <div className="bg-white rounded-[16px] p-[32px] shadow-sm flex items-center gap-[24px]">
              <div className="bg-[#be5d3f]/10 flex items-center justify-center rounded-[16px] size-[64px]">
                <img alt="" className="h-[15px] w-[27.5px]" src={imgContainer18} />
              </div>
              <div className="space-y-[2px]">
                <p className="text-[14px] text-[#42474d]">Land Views</p>
                <h3 className="text-[30px] font-bold text-[#1a1c1e] leading-[36px]">4,370</h3>
                <p className="text-[12px] font-bold text-[#16a34a]">+9% this month</p>
              </div>
            </div>
          </section>

          {/* Latest Listings Table */}
          <section className="bg-white rounded-[16px] p-[24px] shadow-sm flex flex-col gap-[20px] w-full">
            <div className="flex justify-between items-center w-full">
              <h3 className="text-[18px] font-bold text-[#1a1c1e]">Latest Listings</h3>
              <Link to="/view-all-properties" className="text-[14px] font-semibold text-[#194360] hover:underline">
                View All
              </Link>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full text-[14px] border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-[#eeedf0] text-[#42474d] text-[12px] font-bold uppercase tracking-wider text-left">
                    <th className="pb-[12px] pl-[12px] w-[100px]">Thumb</th>
                    <th className="pb-[12px] pl-[12px]">Title</th>
                    <th className="pb-[12px] pl-[12px]">Status</th>
                    <th className="pb-[12px] pl-[12px]">Views</th>
                    <th className="pb-[12px] pl-[12px]">Saved</th>
                    <th className="pb-[12px] pl-[12px] text-center w-[160px]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map(listing => (
                    <tr key={listing.id} className="border-b border-[#eeedf0]/50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-[16px] pl-[12px]">
                        <div className="h-[40px] w-[64px] rounded-[8px] overflow-hidden bg-gray-100">
                          <img alt={listing.title} className="size-full object-cover" src={listing.image} />
                        </div>
                      </td>
                      <td className="py-[16px] pl-[12px] font-bold text-gray-800">
                        <div>
                          <p>{listing.title}</p>
                          <span className={`inline-block mt-[4px] px-[8px] py-px rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            listing.type === 'PROPERTY' 
                              ? "bg-[#194360]/10 text-[#194360]" 
                              : "bg-[#be5d3f]/10 text-[#be5d3f]"
                          }`}>
                            {listing.type}
                          </span>
                        </div>
                      </td>
                      <td className="py-[16px] pl-[12px]">
                        <span 
                          onClick={() => toggleStatus(listing.id)}
                          className={`inline-block px-[12px] py-[3px] rounded-full text-[10px] font-bold select-none cursor-pointer ${
                            listing.status === 'Active' 
                              ? "bg-[#dcfce7] text-[#15803d]" 
                              : listing.status === 'Pending'
                              ? "bg-[#fef3c7] text-[#b45309]"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {listing.status}
                        </span>
                      </td>
                      <td className="py-[16px] pl-[12px] font-medium text-gray-500">
                        {listing.views.toLocaleString()}
                      </td>
                      <td className="py-[16px] pl-[12px] font-medium text-gray-500">
                        {listing.saved}
                      </td>
                      <td className="py-[16px] pl-[12px]">
                        <div className="flex items-center justify-center gap-[12px]">
                          <button 
                            onClick={() => navigate(listing.type === 'PROPERTY' ? `/property-detail/${listing.id}` : `/land/detail/${listing.id}`)}
                            className="p-[8px] rounded-[8px] bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                            title="View details"
                          >
                            <img alt="View" className="h-[11px] w-[16.5px]" src={imgContainer14} />
                          </button>
                          <button 
                            onClick={() => toggleStatus(listing.id)}
                            className="p-[8px] rounded-[8px] bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                            title="Quick Edit status"
                          >
                            <img alt="Edit" className="size-[13px]" src={imgContainer15} />
                          </button>
                          <button 
                            onClick={() => deleteListing(listing.id)}
                            className="p-[8px] rounded-[8px] bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                            title="Delete listing"
                          >
                            <img alt="Delete" className="h-[13.5px] w-[12px] filter hue-rotate-320" src={imgContainer16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
