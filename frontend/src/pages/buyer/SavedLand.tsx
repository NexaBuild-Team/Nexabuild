import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

// ─── Figma Image & SVG Asset Constants ───────────────────────────────────────
const imgKasunPerera = "http://localhost:3845/assets/1ea9e5d563ba530ba5b4b10e0f36837d1c6dcea5.png";
const imgBeachfrontLand = "http://localhost:3845/assets/a47ef9bb56b3356aa04cf0b4ae8465e638649271.png";
const imgUrbanPlotKelaniya = "http://localhost:3845/assets/2ed2447bf74ea29f3b40889948538e6a16365b9d.png";
const imgSvg = "http://localhost:3845/assets/f028177494de90f1e058719668a57e0f6346787b.svg";
const imgSvg1 = "http://localhost:3845/assets/8c5da6e1319f1bc9b0444b0a9e191ef71b29f78a.svg";
const imgSvg2 = "http://localhost:3845/assets/1022348fd69604ccbe29e20c150adf4c663abb2d.svg";
const imgSvg3 = "http://localhost:3845/assets/102161d6525debd5d3724da9007d85985811c34a.svg";
const imgSvg4 = "http://localhost:3845/assets/6d4a19538e0d221bec676f56d6ef1b21647f48a2.svg";
const imgSvg5 = "http://localhost:3845/assets/23cf91de90bed12ddc32f87d624391a19289544f.svg";
const imgSvg6 = "http://localhost:3845/assets/eb9b9d79ca02dda3d985edbb9e946e9f7cfc26f2.svg";
const imgSvg7 = "http://localhost:3845/assets/8fee21a47c02b6382dc84344fc3da54fdcf0a212.svg";
const imgSvg8 = "http://localhost:3845/assets/9d57572d1f456de9cc9272c71dfabc22d2df151d.svg";
const imgSvg9 = "http://localhost:3845/assets/1a3115996b43d0ddb980a85ab5b621335392b321.svg";
const imgSvg10 = "http://localhost:3845/assets/105ab0d45deea94af1c4d6339773f36e69abb3e6.svg";
const imgContainer = "http://localhost:3845/assets/5a3b9aec44099c259238e1e9a9ad53d32265a6b8.svg";
const imgSvg11 = "http://localhost:3845/assets/a73307a58fc456d0419becc191906179d4551957.svg";
const imgButtonSvg = "http://localhost:3845/assets/7a22bb9a441c332ef8f356b8ede94cba8829d0c4.svg";
const imgSvg12 = "http://localhost:3845/assets/434af1f37b6e7253d9b1c43bcf05372eddcfce0b.svg";
const imgSvg13 = "http://localhost:3845/assets/d1ea43f722fa1b109735998c908334a2be10da35.svg";
const imgSvg14 = "http://localhost:3845/assets/c62fd04dec1c304d94fc867eb1a68ea68d11695c.svg";
const imgSvg15 = "http://localhost:3845/assets/a985582b0a089ee9fe95a0d1a4dc3ce1384bbf53.svg";
const imgSvg16 = "http://localhost:3845/assets/1c38bf90b306800b96b2c3d2f114ccc7594775dd.svg";
const imgSvg17 = "http://localhost:3845/assets/e9d4b1e744f080dc510327a4b7a2a033421461ff.svg";
const imgImage = "http://localhost:3845/assets/6a98ae7e73edbee01d12e6e35671bc421030f0e5.svg";
const imgSvg18 = "http://localhost:3845/assets/ce5746b0b5be56c386a881edd14538653ed14142.svg";
const imgSvg19 = "http://localhost:3845/assets/1ce0fcd818d293793ab707abf2ba5542c47ffb91.svg";
const imgSvg20 = "http://localhost:3845/assets/22869099d64f76edc86b84fd87b603d53ff26c47.svg";
const imgSvg22 = "http://localhost:3845/assets/bddc922a179504d55d279dfb10148091a3e4c9e5.svg";
const imgSvg23 = "http://localhost:3845/assets/b9d776c2b14619ba09ec5d10f2bd94eaa30e3954.svg";

interface LandProperty {
  id: number;
  title: string;
  location: string;
  district: 'Colombo' | 'Gampaha' | 'Other';
  size: number;
  price: number; // in Millions LKR
  pricePerPerch: string;
  match: number;
  potential: 'HIGH POTENTIAL' | 'MEDIUM POTENTIAL';
  tags: string[];
  image: string;
  isSaved: boolean;
}

const initialLands: LandProperty[] = [
  {
    id: 1,
    title: "Prime Plot, Nugegoda",
    location: "Colombo",
    district: "Colombo",
    size: 20,
    price: 8.5,
    pricePerPerch: "LKR 425K/perch",
    match: 96,
    potential: "HIGH POTENTIAL",
    tags: ["Main Road", "Residential"],
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    isSaved: true
  },
  {
    id: 2,
    title: "Residential Land, Homagama",
    location: "Colombo",
    district: "Colombo",
    size: 30,
    price: 5.2,
    pricePerPerch: "LKR 173K/perch",
    match: 89,
    potential: "HIGH POTENTIAL",
    tags: ["Side Road", "Residential"],
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    isSaved: true
  },
  {
    id: 3,
    title: "Corner Plot, Kaduwela",
    location: "Colombo",
    district: "Colombo",
    size: 40,
    price: 12.8,
    pricePerPerch: "LKR 320K/perch",
    match: 84,
    potential: "MEDIUM POTENTIAL",
    tags: ["Corner Dual Access", "Mixed Use"],
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    isSaved: true
  },
  {
    id: 4,
    title: "Beachfront Land, Moratuwa",
    location: "Colombo",
    district: "Colombo",
    size: 35,
    price: 22.0,
    pricePerPerch: "LKR 629K/perch",
    match: 81,
    potential: "HIGH POTENTIAL",
    tags: ["Beach Road", "Mixed Use"],
    image: imgBeachfrontLand,
    isSaved: true
  },
  {
    id: 5,
    title: "Flat Land, Malabe",
    location: "Colombo",
    district: "Colombo",
    size: 25,
    price: 9.2,
    pricePerPerch: "LKR 368K/perch",
    match: 75,
    potential: "HIGH POTENTIAL",
    tags: ["Main Road", "Residential"],
    image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80",
    isSaved: true
  },
  {
    id: 6,
    title: "Urban Plot, Kelaniya",
    location: "Gampaha",
    district: "Gampaha",
    size: 22,
    price: 7.5,
    pricePerPerch: "LKR 341K/perch",
    match: 70,
    potential: "MEDIUM POTENTIAL",
    tags: ["Main Road", "Residential"],
    image: imgUrbanPlotKelaniya,
    isSaved: true
  }
];

export default function SavedLand() {
  const navigate = useNavigate();
  const [lands, setLands] = useState<LandProperty[]>(initialLands);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Recently Saved");
  const [isGridView, setIsGridView] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Toggle saved bookmark state
  const toggleBookmark = (id: number) => {
    setLands(prev =>
      prev.map(land =>
        land.id === id ? { ...land, isSaved: !land.isSaved } : land
      )
    );
  };

  // Filter & Sort Logic
  const filteredLands = lands
    .filter(land => {
      // Search matching
      const matchesSearch =
        land.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        land.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        land.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      // Pill filters matching
      if (activeFilter === "All") return true;
      if (activeFilter === "Colombo") return land.district === "Colombo";
      if (activeFilter === "Gampaha") return land.district === "Gampaha";
      if (activeFilter === "High Potential") return land.potential === "HIGH POTENTIAL";
      if (activeFilter === "Medium Potential") return land.potential === "MEDIUM POTENTIAL";
      if (activeFilter === "Residential") return land.tags.includes("Residential");

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "Price: Low to High") return a.price - b.price;
      if (sortBy === "Price: High to Low") return b.price - a.price;
      if (sortBy === "Match Percentage") return b.match - a.match;
      // Default: Recently Saved (just keeps original order in mockup)
      return 0;
    });

  // Calculate Stats
  const savedCount = lands.filter(l => l.isSaved).length;
  const totalPerches = lands.filter(l => l.isSaved).reduce((acc, curr) => acc + curr.size, 0);
  const avgPrice = savedCount > 0 
    ? (lands.filter(l => l.isSaved).reduce((acc, curr) => acc + curr.price, 0) / savedCount).toFixed(1)
    : "0";

  return (
    <div 
      className="min-h-screen w-full relative flex flex-row items-start font-normal text-on-surface"
      style={{ backgroundImage: "linear-gradient(90deg, rgb(230, 224, 212) 0%, rgb(230, 224, 212) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }}
    >
      
      {/* ─── 1. Left Sidebar ─────────────────────────────────────────────────── */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-[256px] bg-[#345b79] flex flex-col justify-between pt-[76px] pb-[24px] px-[16px] transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* NexaBuild Logo Header inside Sidebar */}
        <div className="absolute top-[11px] left-0 right-0 px-[32px] flex items-center gap-[12px]">
          <div className="bg-white/20 flex items-center justify-center rounded-[12px] size-[40px]">
            <img alt="NexaBuild Logo" className="size-[20px] object-contain" src={imgContainer} />
          </div>
          <span className="text-[24px] font-extrabold text-white tracking-[-0.6px] leading-[32px]">
            NexaBuild
          </span>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 flex flex-col gap-[4px] mt-[20px] overflow-y-auto">
          <Link 
            to="/buyer-dashboard" 
            className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[8px] text-white/70 hover:bg-white/5 hover:text-white transition-all font-normal text-[14px]"
          >
            <img alt="Dashboard" className="size-[20px] filter brightness-200" src={imgSvg} />
            <span className="leading-[20px]">Dashboard</span>
          </Link>
          <Link 
            to="/property-ai-recommended" 
            className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[8px] text-white/70 hover:bg-white/5 hover:text-white transition-all font-normal text-[14px]"
          >
            <img alt="AI Property Matches" className="size-[20px] filter brightness-200" src={imgSvg1} />
            <span className="leading-[20px] whitespace-normal">AI Property Recommendations</span>
          </Link>
          <Link 
            to="/land/ai-recommendations" 
            className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[8px] text-white/70 hover:bg-white/5 hover:text-white transition-all font-normal text-[14px]"
          >
            <img alt="AI Land Matches" className="size-[20px] filter brightness-200" src={imgSvg2} />
            <span className="leading-[20px]">AI Land Recommendations</span>
          </Link>
          <Link 
            to="/auth/test" 
            className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[8px] text-white/70 hover:bg-white/5 hover:text-white transition-all font-normal text-[14px]"
          >
            <img alt="Saved Properties" className="size-[20px] filter brightness-200" src={imgSvg3} />
            <span className="leading-[20px]">Saved Properties</span>
          </Link>
          <Link 
            to="/saved-lands" 
            className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[8px] bg-[#52748c] text-white transition-all font-normal text-[14px]"
          >
            <img alt="Saved Lands" className="size-[20px]" src={imgSvg4} />
            <span className="leading-[20px]">Saved Lands</span>
          </Link>
          <Link 
            to="/recently-viewed" 
            className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[8px] text-white/70 hover:bg-white/5 hover:text-white transition-all font-normal text-[14px]"
          >
            <img alt="Recently Viewed" className="size-[20px] filter brightness-200" src={imgSvg5} />
            <span className="leading-[20px]">Recently Viewed</span>
          </Link>
          <Link 
            to="/auth/test" 
            className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[8px] text-white/70 hover:bg-white/5 hover:text-white transition-all font-normal text-[14px]"
          >
            <img alt="Recent Searches" className="size-[20px] filter brightness-200" src={imgSvg6} />
            <span className="leading-[20px]">Recent Searches</span>
          </Link>
          <Link 
            to="#" 
            className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[8px] text-white/70 hover:bg-white/5 hover:text-white transition-all font-normal text-[14px]"
          >
            <img alt="Notifications" className="size-[20px] filter brightness-200" src={imgSvg7} />
            <span className="leading-[20px]">Notifications</span>
          </Link>
          <Link 
            to="#" 
            className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[8px] text-white/70 hover:bg-white/5 hover:text-white transition-all font-normal text-[14px]"
          >
            <img alt="My Profile" className="size-[20px] filter brightness-200" src={imgSvg8} />
            <span className="leading-[20px]">My Profile</span>
          </Link>
          <Link 
            to="#" 
            className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[8px] text-white/70 hover:bg-white/5 hover:text-white transition-all font-normal text-[14px]"
          >
            <img alt="Settings" className="size-[20px] filter brightness-200" src={imgSvg9} />
            <span className="leading-[20px]">Settings</span>
          </Link>
        </nav>

        {/* Sidebar Footer - Logout */}
        <div className="border-t border-white/10 pt-[25px] px-[8px]">
          <Link 
            to="/auth/login" 
            className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[8px] text-white/70 hover:bg-white/5 hover:text-white transition-all font-normal text-[14px]"
          >
            <img alt="Logout" className="size-[20px] filter brightness-200" src={imgSvg10} />
            <span className="leading-[20px]">Logout</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Drawer Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/45 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── 2. Main Content Area ───────────────────────────────────────────── */}
      <main className="flex-1 lg:pl-[256px] min-w-0 flex flex-col h-full min-h-screen">
        
        {/* Sticky Top Header */}
        <header className="bg-white border-b border-[#e5e7eb] px-[24px] lg:px-[32px] py-[16px] flex items-center justify-between sticky top-0 z-30 shadow-sm gap-[16px]">
          <div className="flex items-center gap-[16px] flex-1 max-w-[576px]">
            {/* Mobile menu trigger */}
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-[8px] border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none"
              aria-label="Open sidebar menu"
            >
              <svg className="size-[20px] text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Search Input Bar */}
            <div className="relative w-full">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search properties, lands, areas..."
                className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-[8px] py-[10px] pl-[44px] pr-[16px] text-[14px] text-gray-800 placeholder-gray-500 focus:outline-none focus:border-[#345b79]/60 focus:bg-white transition-all shadow-inner"
              />
              <div className="absolute left-[14px] top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                <img alt="Search" className="size-[20px] opacity-60" src={imgSvg11} />
              </div>
            </div>
          </div>

          {/* Right Top Header Actions */}
          <div className="flex items-center gap-[24px] shrink-0">
            {/* Notifications icon */}
            <div className="relative cursor-pointer p-[4px] hover:bg-gray-100 rounded-full transition-colors">
              <img alt="Notifications" className="size-[24px] filter invert-0" src={imgButtonSvg} />
              <div className="absolute bg-[#be5d3f] rounded-full size-[16px] -top-[4px] -right-[4px] flex items-center justify-center shadow">
                <span className="text-[10px] font-bold text-white leading-none">3</span>
              </div>
            </div>

            {/* Profile badge */}
            <div className="flex items-center gap-[12px] border-l border-gray-200 pl-[16px]">
              <div className="text-right hidden sm:block">
                <p className="text-[14px] font-semibold text-[#111827] leading-[17.5px]">Kasun Perera</p>
                <p className="text-[10px] text-[#6b7280] leading-[15px]">Property Buyer</p>
              </div>
              <div className="relative rounded-[9999px] overflow-hidden border border-[#e5e7eb] size-[40px]">
                <img alt="Kasun Perera" className="size-full object-cover" src={imgKasunPerera} />
              </div>
              <img alt="Dropdown arrow" className="size-[16px] opacity-60 cursor-pointer" src={imgSvg12} />
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-[24px] lg:p-[32px] flex flex-col gap-[24px] w-full max-w-[1400px] mx-auto">
          
          {/* Summary Statistics Row */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[24px] w-full">
            {/* Stat Card 1: Saved Lands */}
            <div className="bg-white border border-[#f3f4f6] rounded-[16px] p-[25px] flex items-center gap-[16px] shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-[#f9fafb] p-[16px] rounded-[12px] flex items-center justify-center shrink-0">
                <img alt="Bookmark" className="size-[24px]" src={imgSvg13} />
              </div>
              <div>
                <p className="text-[24px] font-bold text-[#1f2937] leading-[32px]">
                  {savedCount}
                </p>
                <p className="text-[12px] text-[#6b7280] leading-[16px]">Saved Lands</p>
              </div>
            </div>

            {/* Stat Card 2: Added This Week */}
            <div className="bg-white border border-[#f3f4f6] rounded-[16px] p-[25px] flex items-center gap-[16px] shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-[#f9fafb] p-[16px] rounded-[12px] flex items-center justify-center shrink-0">
                <img alt="Trend" className="size-[24px]" src={imgSvg14} />
              </div>
              <div>
                <p className="text-[24px] font-bold text-[#1f2937] leading-[32px]">
                  +1
                </p>
                <p className="text-[12px] text-[#6b7280] leading-[16px]">Added This Week</p>
              </div>
            </div>

            {/* Stat Card 3: Total Perches */}
            <div className="bg-white border border-[#f3f4f6] rounded-[16px] p-[25px] flex items-center gap-[16px] shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-[#f9fafb] p-[16px] rounded-[12px] flex items-center justify-center shrink-0">
                <img alt="Total Perches" className="size-[24px]" src={imgSvg15} />
              </div>
              <div>
                <p className="text-[24px] font-bold text-[#1f2937] leading-[32px]">
                  {totalPerches}
                </p>
                <p className="text-[12px] text-[#6b7280] leading-[16px]">Total Perches</p>
              </div>
            </div>

            {/* Stat Card 4: Avg Price */}
            <div className="bg-white border border-[#f3f4f6] rounded-[16px] p-[25px] flex items-center gap-[16px] shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-[#f9fafb] p-[16px] rounded-[12px] flex items-center justify-center shrink-0">
                <img alt="Avg Price" className="size-[24px]" src={imgSvg16} />
              </div>
              <div>
                <p className="text-[24px] font-bold text-[#1f2937] leading-[32px]">
                  LKR {avgPrice}M
                </p>
                <p className="text-[12px] text-[#6b7280] leading-[16px]">Avg. Price</p>
              </div>
            </div>
          </section>

          {/* Page Header & Filter Badges */}
          <section className="flex flex-col gap-[16px] pt-[8px] w-full">
            <div className="flex flex-wrap gap-[4px] items-center text-[12px] text-[#6b7280]">
              <Link to="/buyer-dashboard" className="hover:underline">Dashboard</Link>
              <span className="mx-1">&gt;</span>
              <span className="font-semibold text-[#374151]">Saved Lands</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[16px]">
              <div>
                <div className="flex items-center gap-[12px]">
                  <h2 className="text-[30px] font-bold text-[#111827] leading-[36px]">Saved Lands</h2>
                  <div className="bg-[#be5d3f]/10 px-[16px] py-[6px] rounded-full flex items-center gap-[8px]">
                    <img alt="Bookmark Tag" className="size-[16px]" src={imgSvg17} />
                    <span className="text-[14px] font-semibold text-[#be5d3f] whitespace-nowrap">
                      {savedCount} Saved
                    </span>
                  </div>
                </div>
                <p className="text-[14px] text-[#6b7280] leading-[20px] mt-[4px]">
                  Land plots you bookmarked — compare, track, and plan your investment
                </p>
              </div>
            </div>
          </section>

          {/* Filtering Pills and Sorting Control Header */}
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-[16px] w-full">
            
            {/* Filter pills */}
            <div className="flex gap-[12px] overflow-x-auto pb-[4px] scrollbar-none shrink-0">
              {["All", "Colombo", "Gampaha", "High Potential", "Medium Potential", "Residential"].map(pill => (
                <button
                  key={pill}
                  onClick={() => setActiveFilter(pill)}
                  className={`px-[21px] py-[9px] text-[12px] font-semibold rounded-full shadow-sm border transition-all duration-150 whitespace-nowrap cursor-pointer ${
                    activeFilter === pill
                      ? "bg-[#345b79] text-white border-[#345b79]"
                      : "bg-white text-[#1f2937] border-[#e5e7eb] hover:bg-gray-50"
                  }`}
                >
                  {pill}
                </button>
              ))}
            </div>

            {/* Sorting & Layout Grid Options */}
            <div className="flex items-center gap-[16px] self-end md:self-center shrink-0 relative">
              {/* Dropdown container */}
              <div className="relative">
                <button 
                  onClick={() => setSortDropdownOpen(prev => !prev)}
                  className="bg-white border border-[#e5e7eb] rounded-[8px] px-[16px] py-[9px] flex items-center gap-[12px] shadow-sm hover:bg-gray-50 text-[12px] font-semibold text-[#1f2937] transition-all cursor-pointer min-w-[150px]"
                >
                  <img alt="" className="size-[18px] opacity-75" src={imgImage} />
                  <span>{sortBy}</span>
                  <img alt="Chevron" className="size-[16px] opacity-60 ml-auto" src={imgSvg12} />
                </button>

                {sortDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setSortDropdownOpen(false)} />
                    <div className="absolute right-0 mt-[4px] w-full bg-white border border-gray-200 rounded-[8px] shadow-lg py-[4px] z-20 text-[12px] font-semibold text-[#1f2937]">
                      {["Recently Saved", "Price: Low to High", "Price: High to Low", "Match Percentage"].map(option => (
                        <button
                          key={option}
                          onClick={() => {
                            setSortBy(option);
                            setSortDropdownOpen(false);
                          }}
                          className={`w-full text-left px-[16px] py-[8px] hover:bg-gray-50 transition-colors ${
                            sortBy === option ? "text-[#be5d3f] bg-[#be5d3f]/5" : ""
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Layout view toggle buttons */}
              <div className="bg-white border border-[#e5e7eb] rounded-[8px] p-px shadow-sm flex items-center shrink-0">
                <button 
                  onClick={() => setIsGridView(true)}
                  className={`p-[8px] rounded-[6px] transition-colors cursor-pointer ${
                    isGridView ? "bg-[#345b79] text-white" : "text-[#345b79] hover:bg-gray-100"
                  }`}
                  aria-label="Grid view"
                >
                  <img alt="Grid" className={`size-[20px] ${isGridView ? "filter brightness-200" : ""}`} src={imgSvg} />
                </button>
                <button 
                  onClick={() => setIsGridView(false)}
                  className={`p-[8px] rounded-[6px] transition-colors cursor-pointer ${
                    !isGridView ? "bg-[#345b79] text-white" : "text-[#345b79] hover:bg-gray-100"
                  }`}
                  aria-label="List view"
                >
                  <img alt="List" className={`size-[20px] ${!isGridView ? "filter brightness-200" : ""}`} src={imgSvg18} />
                </button>
              </div>
            </div>

          </section>

          {/* Grid / List Content */}
          {filteredLands.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-[24px] p-[64px] text-center w-full shadow-sm">
              <svg className="size-[48px] text-gray-300 mx-auto mb-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="text-[18px] font-bold text-gray-800">No Saved Lands Found</h3>
              <p className="text-[14px] text-gray-500 mt-[8px]">
                Try adjusting your search queries or active filters
              </p>
            </div>
          ) : isGridView ? (
            // Grid Layout
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[32px] w-full pb-[40px]">
              {filteredLands.map(land => {
                // Determine Match color dot
                const dotColor = land.match >= 90 
                  ? "bg-[#4ade80]" 
                  : land.match >= 80 
                    ? "bg-[#facc15]" 
                    : "bg-[#f87171]";

                // Determine potential color class
                const potentialColor = land.potential === "HIGH POTENTIAL"
                  ? "bg-[#16a34a]/90"
                  : "bg-yellow-600/90";

                return (
                  <article 
                    key={land.id}
                    className="bg-white border border-[#f3f4f6] rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group relative"
                  >
                    {/* Card Header Media */}
                    <div className="h-[256px] relative w-full overflow-hidden bg-[#e5e7eb] shrink-0">
                      <img 
                        alt={land.title} 
                        className="size-full object-cover group-hover:scale-102 transition-transform duration-300" 
                        src={land.image} 
                      />
                      
                      {/* Match overlay badge */}
                      <div className="absolute top-[16px] left-[16px] backdrop-blur-[2px] bg-black/50 rounded-full px-[12px] py-[6px] flex items-center gap-[4px] text-white text-[10px] font-bold shadow-sm">
                        <span className={`rounded-full size-[8px] ${dotColor}`} />
                        <span>{land.match}% Match</span>
                      </div>

                      {/* Potential tag */}
                      <div className="absolute bottom-[16px] left-[16px] backdrop-blur-[2px] px-[12px] py-[4.5px] rounded-full shadow-sm text-white text-[10px] font-bold tracking-[0.5px] uppercase flex items-center justify-center shrink-0 z-10 select-none">
                        <span className={`absolute inset-0 rounded-full ${potentialColor} pointer-events-none`} />
                        <span className="relative z-10">{land.potential}</span>
                      </div>

                      {/* Bookmark icon toggle */}
                      <button 
                        onClick={() => toggleBookmark(land.id)}
                        className={`absolute top-[16px] right-[16px] rounded-full shadow-sm size-[32px] flex items-center justify-center transition-all cursor-pointer ${
                          land.isSaved 
                            ? "bg-[#be5d3f]/10 border border-[#be5d3f]/40 text-[#be5d3f]" 
                            : "bg-white/90 hover:bg-white text-gray-500 hover:text-red-500"
                        }`}
                        aria-label="Remove bookmark"
                      >
                        <img 
                          alt="Bookmark" 
                          className={`size-[16px] ${land.isSaved ? "filter sepia hue-rotate-[320deg] saturate-200" : "opacity-60"}`} 
                          src={imgSvg19} 
                        />
                      </button>
                    </div>

                    {/* Card Content details */}
                    <div className="p-[24px] flex-grow flex flex-col justify-between gap-[16px]">
                      <div>
                        {/* Title & Price row */}
                        <div className="flex justify-between items-start gap-[8px] mb-[7.5px]">
                          <h3 
                            className="text-[18px] font-bold text-[#111827] leading-[28px] hover:text-[#345b79] cursor-pointer transition-colors"
                            onClick={() => navigate(`/land/detail/${land.id}`)}
                          >
                            {land.title}
                          </h3>
                          <div className="text-right shrink-0">
                            <span className="block text-[18px] font-bold text-[#be5d3f]">LKR {land.price}M</span>
                            <span className="block text-[10px] text-[#9ca3af] leading-tight mt-[1px]">{land.pricePerPerch}</span>
                          </div>
                        </div>

                        {/* Location & Size details */}
                        <div className="flex items-center gap-[16px] text-gray-500 text-[12px] mt-[4px]">
                          <div className="flex items-center gap-[4px]">
                            <img alt="" className="size-[14px] opacity-75" src={imgSvg20} />
                            <span>{land.location}</span>
                          </div>
                          <div className="flex items-center gap-[4px]">
                            <img alt="" className="size-[14px] opacity-75" src={imgSvg23} />
                            <span>{land.size} Perches</span>
                          </div>
                        </div>
                      </div>

                      {/* Tag badges row */}
                      <div className="flex gap-[8px] flex-wrap items-center">
                        {land.tags.map((tag, idx) => {
                          const isRoadTag = tag.toLowerCase().includes("road");
                          return (
                            <div 
                              key={idx}
                              className={`px-[10px] py-[4px] rounded-[6px] text-[10px] font-semibold border transition-all flex items-center gap-[4px] ${
                                tag === "Residential" 
                                  ? "bg-[#345b79]/10 text-[#345b79] border-transparent"
                                  : "bg-gray-100 text-gray-600 border-transparent"
                              }`}
                            >
                              {isRoadTag && <img alt="" className="size-[12px] opacity-75 animate-pulse" src={imgSvg22} />}
                              <span>{tag}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Details View Button */}
                      <button 
                        onClick={() => navigate(`/land/detail/${land.id}`)}
                        className="bg-[#be5d3f] hover:bg-[#be5d3f]/90 text-white text-[16px] font-bold py-[12px] rounded-[12px] transition-colors text-center w-full block shadow-sm cursor-pointer"
                      >
                        View Details
                      </button>
                    </div>
                  </article>
                );
              })}
            </section>
          ) : (
            // List Layout
            <section className="flex flex-col gap-[24px] w-full pb-[40px]">
              {filteredLands.map(land => {
                const dotColor = land.match >= 90 ? "bg-[#4ade80]" : land.match >= 80 ? "bg-[#facc15]" : "bg-[#f87171]";
                const potentialColor = land.potential === "HIGH POTENTIAL" ? "bg-[#16a34a]/90" : "bg-yellow-600/90";

                return (
                  <article 
                    key={land.id}
                    className="bg-white border border-[#f3f4f6] rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row w-full group relative"
                  >
                    {/* Media content */}
                    <div className="w-full md:w-[280px] h-[220px] md:h-auto relative overflow-hidden bg-[#e5e7eb] shrink-0">
                      <img 
                        alt={land.title} 
                        className="size-full object-cover group-hover:scale-102 transition-transform duration-300" 
                        src={land.image} 
                      />
                      
                      {/* Match Badge */}
                      <div className="absolute top-[16px] left-[16px] backdrop-blur-[2px] bg-black/50 rounded-full px-[12px] py-[6px] flex items-center gap-[4px] text-white text-[10px] font-bold shadow-sm">
                        <span className={`rounded-full size-[8px] ${dotColor}`} />
                        <span>{land.match}% Match</span>
                      </div>

                      {/* Potential tag */}
                      <div className="absolute bottom-[16px] left-[16px] backdrop-blur-[2px] px-[12px] py-[4.5px] rounded-full shadow-sm text-white text-[10px] font-bold tracking-[0.5px] uppercase flex items-center justify-center shrink-0 z-10 select-none">
                        <span className={`absolute inset-0 rounded-full ${potentialColor} pointer-events-none`} />
                        <span className="relative z-10">{land.potential}</span>
                      </div>
                    </div>

                    {/* Details content */}
                    <div className="p-[24px] flex-1 flex flex-col justify-between gap-[16px]">
                      <div>
                        {/* Title, location, stats and bookmark row */}
                        <div className="flex justify-between items-start gap-[16px]">
                          <div className="space-y-[8px]">
                            <h3 
                              className="text-[20px] font-bold text-[#111827] leading-[26px] hover:text-[#345b79] cursor-pointer transition-colors"
                              onClick={() => navigate(`/land/detail/${land.id}`)}
                            >
                              {land.title}
                            </h3>
                            
                            <div className="flex flex-wrap items-center gap-[16px] text-gray-500 text-[12px]">
                              <div className="flex items-center gap-[4px]">
                                <img alt="" className="size-[14px] opacity-75" src={imgSvg20} />
                                <span>{land.location}</span>
                              </div>
                              <div className="flex items-center gap-[4px]">
                                <img alt="" className="size-[14px] opacity-75" src={imgSvg23} />
                                <span>{land.size} Perches</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-[12px]">
                            <div className="text-right shrink-0">
                              <span className="block text-[20px] font-bold text-[#be5d3f]">LKR {land.price}M</span>
                              <span className="block text-[10px] text-[#9ca3af] mt-[2px]">{land.pricePerPerch}</span>
                            </div>
                            
                            <button 
                              onClick={() => toggleBookmark(land.id)}
                              className={`rounded-full shadow-sm size-[32px] flex items-center justify-center transition-all cursor-pointer ${
                                land.isSaved 
                                  ? "bg-[#be5d3f]/10 border border-[#be5d3f]/40 text-[#be5d3f]" 
                                  : "bg-white/90 hover:bg-white text-gray-500 hover:text-red-500"
                              }`}
                              aria-label="Remove bookmark"
                            >
                              <img 
                                alt="Bookmark" 
                                className={`size-[16px] ${land.isSaved ? "filter sepia hue-rotate-[320deg] saturate-200" : "opacity-60"}`} 
                                src={imgSvg19} 
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Tag badges row */}
                      <div className="flex gap-[8px] flex-wrap items-center">
                        {land.tags.map((tag, idx) => {
                          const isRoadTag = tag.toLowerCase().includes("road");
                          return (
                            <div 
                              key={idx}
                              className={`px-[10px] py-[4px] rounded-[6px] text-[10px] font-semibold border transition-all flex items-center gap-[4px] ${
                                tag === "Residential" 
                                  ? "bg-[#345b79]/10 text-[#345b79] border-transparent"
                                  : "bg-gray-100 text-gray-600 border-transparent"
                              }`}
                            >
                              {isRoadTag && <img alt="" className="size-[12px] opacity-75 animate-pulse" src={imgSvg22} />}
                              <span>{tag}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Details View Button */}
                      <div className="flex justify-end pt-[4px]">
                        <button 
                          onClick={() => navigate(`/land/detail/${land.id}`)}
                          className="bg-[#be5d3f] hover:bg-[#be5d3f]/90 text-white text-[14px] font-bold py-[10px] px-[24px] rounded-[10px] transition-colors text-center shadow-sm cursor-pointer"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          )}

        </div>
      </main>
    </div>
  );
}
