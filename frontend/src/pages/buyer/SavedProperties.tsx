import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

// ─── Figma Image & SVG Asset Constants ───────────────────────────────────────
const imgAlexanderWright = "http://localhost:3845/assets/c61bbfadc3eb24093450f778395d5abd480290c1.png";
const imgModernVilla = "http://localhost:3845/assets/5485d9c66b31d054547fb8f875680d7b78290d2a.png";
const imgLuxuryPenthouse = "http://localhost:3845/assets/ea5d264b5c4b79451f1d17360eecdf30b50b4a0b.png";
const imgApartment = "http://localhost:3845/assets/2b6e7b068024a98c5e60f3a28085c5928e39db0b.png";
const imgBeachfrontVilla = "http://localhost:3845/assets/663f2f08be4777f8d78c73f1a9a5a17c5998d7a8.png";
const imgArchitectVilla = "http://localhost:3845/assets/c07e245f2a86889b1e9e6d6b26b678454ea95c63.png";
const imgGardenHome = "http://localhost:3845/assets/f23b409bde5ef3bf7b0d25f4c59e098b0b829fc0.png";

const imgContainer = "http://localhost:3845/assets/39bb36e825a054d0045d745d4dbd1ee62d0de458.svg";
const imgContainer1 = "http://localhost:3845/assets/d438072c4a528e7c4007e2a305df22ba617eb135.svg";
const imgOverlay = "http://localhost:3845/assets/ecef385217037e2f90fc59ce354be3f72cae221e.svg";
const imgBackground = "http://localhost:3845/assets/a2abd11635822cec15e2a10309290f83dcb94ef3.svg";
const imgOverlay1 = "http://localhost:3845/assets/f6aee5c0fded56f346b591b8751dd7acdd4950b0.svg";
const imgOverlay2 = "http://localhost:3845/assets/f307a86c3c238b319cb3c900b097436b693bb5b7.svg";
const imgImage = "http://localhost:3845/assets/7e3c445f81729b159a1d22a575c56332d4d66b07.svg";
const imgIcon = "http://localhost:3845/assets/b97122c8d7ecdbd63204ff3318a47235dc032ab9.svg";
const imgContainer2 = "http://localhost:3845/assets/7b6ab4444970e693ee81b7ed7c8d489462276a31.svg";
const imgContainer3 = "http://localhost:3845/assets/b7908e402dde6c8497ea0a6987bbaf16648b4711.svg";
const imgContainer4 = "http://localhost:3845/assets/88965625725f5b44d846f3416db6afefd8a00c36.svg";
const imgContainer5 = "http://localhost:3845/assets/5b524cdfdd7487b76732818fb6684967705ac29c.svg";
const imgContainer6 = "http://localhost:3845/assets/87a699758d1fd0155985d7f70b5f28c555b5f797.svg";
const imgContainer7 = "http://localhost:3845/assets/3c032f98f4a21851b4c1def9255d8676de3e1794.svg";
const imgContainer8 = "http://localhost:3845/assets/f3b46fb98a5f78c76fc4b9d0bd8d58f55a4939f7.svg";
const imgContainer9 = "http://localhost:3845/assets/0e071b5ff3b3dddc078c6e2f39a2348933b332ae.svg";
const imgIcon1 = "http://localhost:3845/assets/1e13f36433640d8f96fc92c2cccccd6423d2974b.svg";
const imgContainer10 = "http://localhost:3845/assets/30f28babc87fc1e7f7619f5bf794ef38186c89da.svg";

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
const imgSidebarLogo = "http://localhost:3845/assets/5a3b9aec44099c259238e1e9a9ad53d32265a6b8.svg";

interface SavedProperty {
  id: number;
  title: string;
  location: string;
  address: string;
  neighborhood: string;
  price: number; // in Millions LKR
  match: number;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  badge?: string;
  aiInsight: string;
  isSaved: boolean;
}

const initialProperties: SavedProperty[] = [
  {
    id: 1,
    title: "Modern Villa, Colombo 7",
    location: "Colombo",
    address: "Gregory's Road, Colombo 07",
    neighborhood: "Colombo 7",
    price: 28.5,
    match: 98,
    beds: 4,
    baths: 3,
    sqft: 3200,
    image: imgModernVilla,
    badge: "New Listing",
    aiInsight: "Matches your preference for high-ceiling architectural layouts and proximity to prime commercial hubs.",
    isSaved: true
  },
  {
    id: 2,
    title: "Luxury Penthouse, Rajagiriya",
    location: "Rajagiriya",
    address: "Buthgamuwa Road, Rajagiriya",
    neighborhood: "Rajagiriya",
    price: 35.0,
    match: 91,
    beds: 3,
    baths: 3,
    sqft: 2850,
    image: imgLuxuryPenthouse,
    badge: "For Sale",
    aiInsight: "Optimal sunset alignment and high-value rental potential based on local market trends.",
    isSaved: true
  },
  {
    id: 3,
    title: "Apartment, Nugegoda",
    location: "Nugegoda",
    address: "Nawala Road, Nugegoda",
    neighborhood: "Nugegoda",
    price: 18.5,
    match: 85,
    beds: 2,
    baths: 2,
    sqft: 1400,
    image: imgApartment,
    aiInsight: "Highly rated for school district proximity and recent infrastructural developments in the area.",
    isSaved: true
  },
  {
    id: 4,
    title: "Beachfront Villa, Mount Lavinia",
    location: "Mount Lavinia",
    address: "Hotel Road, Mount Lavinia",
    neighborhood: "Mount Lavinia",
    price: 42.0,
    match: 80,
    beds: 5,
    baths: 4,
    sqft: 4500,
    image: imgBeachfrontVilla,
    badge: "Premium Listing",
    aiInsight: "Significant appreciation predicted due to upcoming coastal luxury developments.",
    isSaved: true
  },
  {
    id: 5,
    title: "Architect Villa, Battaramulla",
    location: "Battaramulla",
    address: "Koswatta, Battaramulla",
    neighborhood: "Battaramulla",
    price: 29.0,
    match: 78,
    beds: 4,
    baths: 3,
    sqft: 3100,
    image: imgArchitectVilla,
    aiInsight: "Matches your preference for minimalist concrete aesthetics and eco-friendly design.",
    isSaved: true
  },
  {
    id: 6,
    title: "Garden Home, Kottawa",
    location: "Kottawa",
    address: "Pannipitiya Road, Kottawa",
    neighborhood: "Other", // Kottawa falls into filter as other or Kottawa can be shown
    price: 24.5,
    match: 74,
    beds: 4,
    baths: 2,
    sqft: 2200,
    image: imgGardenHome,
    aiInsight: "Strong focus on outdoor living space and family-oriented neighborhood scores.",
    isSaved: true
  }
];

export default function SavedProperties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<SavedProperty[]>(initialProperties);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Recently Saved");
  const [isGridView, setIsGridView] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Toggle bookmark
  const toggleBookmark = (id: number) => {
    setProperties(prev =>
      prev.map(p =>
        p.id === id ? { ...p, isSaved: !p.isSaved } : p
      )
    );
  };

  // Filter & Sort
  const filteredProperties = properties
    .filter(p => {
      // Search query filter
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.aiInsight.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Filter pills
      if (activeFilter === "All") return true;
      if (activeFilter === "Colombo") return p.location === "Colombo" || p.neighborhood === "Colombo 7";
      if (activeFilter === "Nugegoda") return p.neighborhood === "Nugegoda";
      if (activeFilter === "Rajagiriya") return p.neighborhood === "Rajagiriya";
      if (activeFilter === "Battaramulla") return p.neighborhood === "Battaramulla";
      if (activeFilter === "Mount Lavinia") return p.neighborhood === "Mount Lavinia";

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "Price: Low to High") return a.price - b.price;
      if (sortBy === "Price: High to Low") return b.price - a.price;
      if (sortBy === "Match Percentage") return b.match - a.match;
      return 0; // Default: Recently Saved
    });

  // Stats Calculations
  const savedCount = properties.filter(p => p.isSaved).length;
  const newAdditions = properties.filter(p => p.isSaved && p.badge === "New Listing").length + 1; // mock trend matching figma (+2)
  const priceDrops = 3; // Mock valuation drops
  const avgValuation = savedCount > 0
    ? (properties.filter(p => p.isSaved).reduce((acc, curr) => acc + curr.price, 0) / savedCount).toFixed(1)
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
        {/* Brand header */}
        <div className="absolute top-[11px] left-0 right-0 px-[32px] flex items-center gap-[12px]">
          <div className="bg-white/20 flex items-center justify-center rounded-[12px] size-[40px]">
            <img alt="NexaBuild" className="size-[20px] object-contain" src={imgSidebarLogo} />
          </div>
          <span className="text-[24px] font-extrabold text-white tracking-[-0.6px] leading-[32px]">
            NexaBuild
          </span>
        </div>

        {/* Sidebar Nav */}
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
            to="/saved-properties" 
            className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[8px] bg-[#52748c] text-white transition-all font-normal text-[14px]"
          >
            <img alt="Saved Properties" className="size-[20px]" src={imgSvg3} />
            <span className="leading-[20px]">Saved Properties</span>
          </Link>
          <Link 
            to="/saved-lands" 
            className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[8px] text-white/70 hover:bg-white/5 hover:text-white transition-all font-normal text-[14px]"
          >
            <img alt="Saved Lands" className="size-[20px] filter brightness-200" src={imgSvg4} />
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

        {/* Sidebar Footer */}
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

      {/* Mobile Drawer Backdrop */}
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
                placeholder="Search saved properties, locations, or notes..."
                className="w-full bg-[#f9fafb] border border-[#e5e7eb] rounded-[8px] py-[10px] pl-[44px] pr-[16px] text-[14px] text-gray-800 placeholder-gray-500 focus:outline-none focus:border-[#345b79]/60 focus:bg-white transition-all shadow-inner"
              />
              <div className="absolute left-[14px] top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                <img alt="Search" className="size-[18px] opacity-60" src={imgIcon1} />
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-[24px] shrink-0">
            {/* Alert Notification bell */}
            <div className="relative cursor-pointer p-[4px] hover:bg-gray-100 rounded-full transition-colors">
              <img alt="Alerts" className="size-[24px]" src={imgContainer10} />
              <div className="absolute bg-[#be5d3f] rounded-full size-[8px] top-[4px] right-[4px] shadow" />
            </div>

            {/* Profile badge (Alexander Wright) */}
            <div className="flex items-center gap-[12px] border-l border-gray-200 pl-[16px]">
              <div className="text-right hidden sm:block">
                <p className="text-[14px] font-semibold text-[#1b1b1b] leading-[17.5px]">Alexander Wright</p>
                <p className="text-[10px] text-[#42474d] leading-[15px]">Senior Investor</p>
              </div>
              <div className="relative rounded-[9999px] overflow-hidden border border-[#e5e7eb] size-[40px]">
                <img alt="Alexander Wright" className="size-full object-cover" src={imgAlexanderWright} />
              </div>
              <img alt="Dropdown arrow" className="size-[16px] opacity-60 cursor-pointer" src={imgIcon} />
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-[24px] lg:p-[32px] flex flex-col gap-[24px] w-full max-w-[1400px] mx-auto">
          
          {/* Summary Stats cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[24px] w-full">
            {/* Stat 1: Total Saved */}
            <div className="bg-white border border-[#f3f4f6] rounded-[12px] p-[25px] flex items-start justify-between shadow-sm hover:shadow-md transition-shadow">
              <div className="space-y-[4px]">
                <p className="text-[14px] text-[#42474d] leading-[20px]">Total Saved</p>
                <h3 className="text-[24px] font-bold text-[#1b1b1b] leading-[32px] whitespace-nowrap">
                  {savedCount} Properties
                </h3>
              </div>
              <img alt="Valuation icon" className="size-[36px]" src={imgOverlay} />
            </div>

            {/* Stat 2: New Additions */}
            <div className="bg-white border border-[#f3f4f6] rounded-[12px] p-[25px] flex items-start justify-between shadow-sm hover:shadow-md transition-shadow">
              <div className="space-y-[4px]">
                <p className="text-[14px] text-[#42474d] leading-[20px]">New Additions</p>
                <h3 className="text-[24px] font-bold text-[#1b1b1b] leading-[32px]">
                  +{newAdditions} This Week
                </h3>
              </div>
              <img alt="Trend Icon" className="size-[36px]" src={imgBackground} />
            </div>

            {/* Stat 3: Alerts Price Drops */}
            <div className="bg-white border border-[#f3f4f6] rounded-[12px] p-[25px] flex items-start justify-between shadow-sm hover:shadow-md transition-shadow">
              <div className="space-y-[4px]">
                <p className="text-[14px] text-[#42474d] leading-[20px]">Alerts</p>
                <h3 className="text-[24px] font-bold text-[#1b1b1b] leading-[32px]">
                  {priceDrops} Price Drops
                </h3>
              </div>
              <img alt="Alert Icon" className="size-[36px]" src={imgOverlay1} />
            </div>

            {/* Stat 4: Avg Valuation */}
            <div className="bg-white border border-[#f3f4f6] rounded-[12px] p-[25px] flex items-start justify-between shadow-sm hover:shadow-md transition-shadow">
              <div className="space-y-[4px]">
                <p className="text-[14px] text-[#42474d] leading-[20px]">Avg. Valuation</p>
                <h3 className="text-[24px] font-bold text-[#1b1b1b] leading-[32px]">
                  LKR {avgValuation}M
                </h3>
              </div>
              <img alt="Coin Icon" className="size-[36px]" src={imgOverlay2} />
            </div>
          </section>

          {/* Breadcrumb & Heading Info section */}
          <section className="flex flex-col gap-[16px] pt-[8px] w-full">
            <div className="flex items-center gap-[8px] text-[14px] text-gray-500">
              <Link to="/buyer-dashboard" className="hover:underline">Dashboard</Link>
              <img alt="" className="size-[8px] opacity-60" src={imgContainer} />
              <span className="font-semibold text-[#194360]">Saved Properties</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[16px]">
              <div>
                <h2 className="text-[32px] font-extrabold text-[#194360] tracking-[-0.8px] leading-[40px]">
                  Saved Properties
                </h2>
                <p className="text-[16px] text-[#42474d] leading-[24px] mt-[4px]">
                  Properties you saved — track prices, compare, and schedule viewings
                </p>
              </div>

              <div className="bg-white border border-[#c2c7ce] rounded-[8px] px-[21px] py-[11px] shadow-sm flex items-center gap-[8px] self-start sm:self-auto shrink-0 select-none">
                <img alt="Saved Properties ribbon" className="h-[10px] w-[15px]" src={imgContainer1} />
                <span className="text-[16px] font-bold text-[#194360]">{savedCount} Saved</span>
              </div>
            </div>
          </section>

          {/* Filter Pills and Search Sort controllers row */}
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-[16px] w-full">
            
            {/* Filter pills */}
            <div className="flex gap-[12px] overflow-x-auto pb-[4px] scrollbar-none shrink-0">
              {["All", "Colombo", "Nugegoda", "Rajagiriya", "Battaramulla", "Mount Lavinia"].map(pill => (
                <button
                  key={pill}
                  onClick={() => setActiveFilter(pill)}
                  className={`px-[24px] py-[8px] text-[14px] font-bold rounded-full shadow-sm border transition-all duration-150 whitespace-nowrap cursor-pointer ${
                    activeFilter === pill
                      ? "bg-[#194360] text-white border-[#194360]"
                      : "bg-white text-[#42474d] border-[#c2c7ce] hover:bg-gray-50"
                  }`}
                >
                  {pill}
                </button>
              ))}
            </div>

            {/* Sort Dropdown and layout options */}
            <div className="flex items-center gap-[16px] self-end md:self-center shrink-0">
              {/* Dropdown menu */}
              <div className="relative">
                <button 
                  onClick={() => setSortDropdownOpen(prev => !prev)}
                  className="bg-white border border-[#c2c7ce] rounded-[8px] px-[17px] py-[9px] flex items-center gap-[12px] shadow-sm hover:bg-gray-50 text-[14px] font-medium text-[#1b1b1b] transition-all cursor-pointer min-w-[170px]"
                >
                  <img alt="" className="size-[21px] opacity-75" src={imgImage} />
                  <span>{sortBy}</span>
                  <img alt="Chevron" className="h-[7.4px] w-[12px] opacity-60 ml-auto" src={imgIcon} />
                </button>

                {sortDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setSortDropdownOpen(false)} />
                    <div className="absolute right-0 mt-[4px] w-full bg-white border border-gray-200 rounded-[8px] shadow-lg py-[4px] z-20 text-[14px] font-medium text-[#1b1b1b]">
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

              {/* Grid/List layout toggle */}
              <div className="bg-white border border-[#c2c7ce] rounded-[8px] p-[5px] shadow-sm flex items-center shrink-0 gap-[4px]">
                <button 
                  onClick={() => setIsGridView(true)}
                  className={`p-[8px] rounded-[6px] transition-colors cursor-pointer ${
                    isGridView ? "bg-[#345b79]/20 text-[#345b79]" : "text-gray-400 hover:bg-gray-50"
                  }`}
                  aria-label="Grid view"
                >
                  <img alt="Grid" className="size-[18px]" src={imgContainer2} />
                </button>
                <button 
                  onClick={() => setIsGridView(false)}
                  className={`p-[8px] rounded-[6px] transition-colors cursor-pointer ${
                    !isGridView ? "bg-[#345b79]/20 text-[#345b79]" : "text-gray-400 hover:bg-gray-50"
                  }`}
                  aria-label="List view"
                >
                  <img alt="List" className="h-[16px] w-[18px]" src={imgContainer3} />
                </button>
              </div>
            </div>

          </section>

          {/* Grid / List Content */}
          {filteredProperties.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-[12px] p-[64px] text-center w-full shadow-sm">
              <svg className="size-[48px] text-gray-300 mx-auto mb-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-[18px] font-bold text-gray-800">No Saved Properties Found</h3>
              <p className="text-[14px] text-gray-500 mt-[8px]">
                Try adjusting your search queries or active filters
              </p>
            </div>
          ) : isGridView ? (
            // Grid Layout
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[32px] w-full pb-[40px]">
              {filteredProperties.map(property => {
                return (
                  <article 
                    key={property.id}
                    className="bg-white border border-[#f3f4f6] rounded-[12px] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group relative"
                  >
                    {/* Card Media Header */}
                    <div className="h-[256px] relative w-full overflow-hidden bg-[#e5e7eb] shrink-0">
                      <img 
                        alt={property.title} 
                        className="size-full object-cover group-hover:scale-102 transition-transform duration-300" 
                        src={property.image} 
                      />
                      
                      {/* Left Badge: Saved & Match percentage overlay */}
                      <div className="absolute top-[16px] left-[16px] flex gap-[8px] items-center">
                        <div className="bg-[#16a34a] rounded-[4px] px-[8px] py-[4px] shadow-sm">
                          <span className="text-white text-[10px] font-bold tracking-[0.5px] uppercase">
                            SAVED
                          </span>
                        </div>
                        <div className="backdrop-blur-[6px] bg-[#194360]/90 rounded-[4px] px-[8px] py-[4px] shadow-sm">
                          <span className="text-white text-[10px] font-bold tracking-[0.5px] uppercase">
                            {property.match}% MATCH
                          </span>
                        </div>
                      </div>

                      {/* Right bookmark active tag */}
                      <button 
                        onClick={() => toggleBookmark(property.id)}
                        className={`absolute top-[16px] right-[16px] backdrop-blur-[6px] rounded-full size-[40px] flex items-center justify-center transition-all cursor-pointer ${
                          property.isSaved 
                            ? "bg-[#be5d3f]/10 border border-[#be5d3f]/40 text-[#be5d3f]" 
                            : "bg-white/30 hover:bg-white text-gray-500"
                        }`}
                        aria-label="Toggle bookmark"
                      >
                        <img alt="Bookmark tag icon" className="h-[18px] w-[20px]" src={imgContainer4} />
                      </button>

                      {/* Bottom-left Overlays (e.g. New Listing, For Sale, Premium Listing) */}
                      {property.badge && (
                        <div className="absolute bottom-[16px] left-[16px]">
                          <div className={`backdrop-blur-[2px] rounded-full px-[12px] py-[2px] shadow-sm text-white text-[12px] font-bold ${
                            property.badge === "New Listing" 
                              ? "bg-white/95 text-[#194360]" 
                              : "bg-[#be5d3f]/95 text-white"
                          }`}>
                            <span>{property.badge}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Content body */}
                    <div className="p-[24px] flex-grow flex flex-col justify-between gap-[16px]">
                      <div>
                        {/* Title and Price */}
                        <div className="flex justify-between items-start gap-[8px] mb-[8px]">
                          <h3 
                            className="text-[18px] font-bold text-[#1b1b1b] leading-[27px] hover:text-[#194360] cursor-pointer transition-colors"
                            onClick={() => navigate(`/property-detail/${property.id}`)}
                          >
                            {property.title}
                          </h3>
                          <div className="text-right shrink-0">
                            <span className="block text-[18px] font-extrabold text-[#194360]">LKR</span>
                            <span className="block text-[18px] font-extrabold text-[#194360]">{property.price}M</span>
                          </div>
                        </div>

                        {/* Location address row */}
                        <div className="flex gap-[6px] items-start text-gray-500 text-[14px]">
                          <img alt="Location pin" className="h-[13px] w-[10px] shrink-0 mt-[3px] opacity-75" src={imgContainer5} />
                          <div className="leading-[20px] text-[#42474d]">
                            {property.address}
                          </div>
                        </div>
                      </div>

                      {/* Beds/Baths/Sqft details row */}
                      <div className="border-[#c2c7ce]/30 border-t border-b py-[17px] flex gap-[16px] items-center text-[13px] text-[#42474d] font-semibold w-full select-none">
                        <div className="flex gap-[6px] items-center">
                          <img alt="Beds" className="h-[10.5px] w-[15px]" src={imgContainer6} />
                          <span>{property.beds} Beds</span>
                        </div>
                        <div className="flex gap-[6px] items-center">
                          <img alt="Baths" className="size-[15px]" src={imgContainer7} />
                          <span>{property.baths} Baths</span>
                        </div>
                        <div className="flex gap-[6px] items-center">
                          <img alt="Sqft" className="size-[13px]" src={imgContainer8} />
                          <span>{property.sqft} sqft</span>
                        </div>
                      </div>

                      {/* AI INSIGHT Box */}
                      <div className="bg-[#194360]/5 border border-[#194360]/10 rounded-[8px] p-[13px] flex flex-col gap-[4px] w-full text-[13px] text-[#42474d] leading-[21px]">
                        <div className="flex gap-[8px] items-center text-[#194360] font-bold text-[11px] tracking-[0.55px] uppercase">
                          <img alt="AI Insight" className="size-[15px]" src={imgContainer9} />
                          <span>AI INSIGHT</span>
                        </div>
                        <p className="italic">
                          "{property.aiInsight}"
                        </p>
                      </div>

                      {/* View Details CTA Button */}
                      <button 
                        onClick={() => navigate(`/property-detail/${property.id}`)}
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
              {filteredProperties.map(property => {
                return (
                  <article 
                    key={property.id}
                    className="bg-white border border-[#f3f4f6] rounded-[12px] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row w-full group relative"
                  >
                    {/* Media segment */}
                    <div className="w-full md:w-[280px] h-[220px] md:h-auto relative overflow-hidden bg-[#e5e7eb] shrink-0">
                      <img 
                        alt={property.title} 
                        className="size-full object-cover group-hover:scale-102 transition-transform duration-300" 
                        src={property.image} 
                      />
                      
                      {/* Left Badge */}
                      <div className="absolute top-[16px] left-[16px] flex gap-[8px] items-center">
                        <div className="bg-[#16a34a] rounded-[4px] px-[8px] py-[4px] shadow-sm">
                          <span className="text-white text-[10px] font-bold tracking-[0.5px] uppercase">
                            SAVED
                          </span>
                        </div>
                        <div className="backdrop-blur-[6px] bg-[#194360]/90 rounded-[4px] px-[8px] py-[4px] shadow-sm">
                          <span className="text-white text-[10px] font-bold tracking-[0.5px] uppercase">
                            {property.match}% MATCH
                          </span>
                        </div>
                      </div>

                      {/* Bottom Overlay Badge */}
                      {property.badge && (
                        <div className="absolute bottom-[16px] left-[16px]">
                          <div className={`backdrop-blur-[2px] rounded-full px-[12px] py-[2px] shadow-sm text-white text-[12px] font-bold ${
                            property.badge === "New Listing" 
                              ? "bg-white/95 text-[#194360]" 
                              : "bg-[#be5d3f]/95 text-white"
                          }`}>
                            <span>{property.badge}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Details segment */}
                    <div className="p-[24px] flex-1 flex flex-col justify-between gap-[16px]">
                      <div>
                        {/* Title, location, address and price row */}
                        <div className="flex justify-between items-start gap-[16px]">
                          <div className="space-y-[8px]">
                            <h3 
                              className="text-[20px] font-bold text-[#1b1b1b] leading-[26px] hover:text-[#194360] cursor-pointer transition-colors"
                              onClick={() => navigate(`/property-detail/${property.id}`)}
                            >
                              {property.title}
                            </h3>
                            
                            <div className="flex gap-[6px] items-start text-gray-500 text-[14px]">
                              <img alt="Location pin" className="h-[13px] w-[10px] shrink-0 mt-[3px] opacity-75" src={imgContainer5} />
                              <span className="leading-[20px] text-[#42474d]">{property.address}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-[12px]">
                            <div className="text-right shrink-0">
                              <span className="block text-[20px] font-extrabold text-[#194360]">LKR {property.price}M</span>
                            </div>
                            
                            <button 
                              onClick={() => toggleBookmark(property.id)}
                              className={`rounded-full shadow-sm size-[32px] flex items-center justify-center transition-all cursor-pointer ${
                                property.isSaved 
                                  ? "bg-[#be5d3f]/10 border border-[#be5d3f]/40 text-[#be5d3f]" 
                                  : "bg-white/90 hover:bg-white text-gray-500 hover:text-red-500"
                              }`}
                              aria-label="Remove bookmark"
                            >
                              <img alt="Bookmark tag icon" className="h-[18px] w-[20px]" src={imgContainer4} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Beds/Baths/Sqft details */}
                      <div className="border-[#c2c7ce]/30 border-t border-b py-[12px] flex gap-[24px] items-center text-[13px] text-[#42474d] font-semibold select-none">
                        <div className="flex gap-[6px] items-center">
                          <img alt="Beds" className="h-[10.5px] w-[15px]" src={imgContainer6} />
                          <span>{property.beds} Beds</span>
                        </div>
                        <div className="flex gap-[6px] items-center">
                          <img alt="Baths" className="size-[15px]" src={imgContainer7} />
                          <span>{property.baths} Baths</span>
                        </div>
                        <div className="flex gap-[6px] items-center">
                          <img alt="Sqft" className="size-[12.7px]" src={imgContainer8} />
                          <span>{property.sqft} sqft</span>
                        </div>
                      </div>

                      {/* AI INSIGHT */}
                      <div className="bg-[#194360]/5 border border-[#194360]/10 rounded-[8px] p-[13px] flex flex-col gap-[4px] w-full text-[13px] text-[#42474d] leading-[21px]">
                        <div className="flex gap-[8px] items-center text-[#194360] font-bold text-[11px] tracking-[0.55px] uppercase">
                          <img alt="AI Insight" className="size-[15px]" src={imgContainer9} />
                          <span>AI INSIGHT</span>
                        </div>
                        <p className="italic">
                          "{property.aiInsight}"
                        </p>
                      </div>

                      {/* Details View Button */}
                      <div className="flex justify-end pt-[4px]">
                        <button 
                          onClick={() => navigate(`/property-detail/${property.id}`)}
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
