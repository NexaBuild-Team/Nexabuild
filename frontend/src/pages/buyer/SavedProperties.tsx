import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

// ─── Figma Image & SVG Asset Constants ───────────────────────────────────────
const imgModernVilla = "http://localhost:3845/assets/5485d9c66b31d054547fb8f875680d7b78290d2a.png";
const imgLuxuryPenthouse = "http://localhost:3845/assets/ea5d264b5c4b79451f1d17360eecdf30b50b4a0b.png";
const imgApartment = "http://localhost:3845/assets/2b6e7b068024a98c5e60f3a28085c5928e39db0b.png";
const imgBeachfrontVilla = "http://localhost:3845/assets/663f2f08be4777f8d78c73f1a9a5a17c5998d7a8.png";
const imgArchitectVilla = "http://localhost:3845/assets/c07e245f2a86889b1e9e6d6b26b678454ea95c63.png";
const imgGardenHome = "http://localhost:3845/assets/f23b409bde5ef3bf7b0d25f4c59e098b0b829fc0.png";

const imgOverlay =
  "/svg/heart.svg";
const imgOverlay1 =
  "/svg/down-trend.svg";
const imgOverlay2 =
  "/svg/price-tag.svg";
const imgContainer2 =
  "/svg/grid-view-icon.svg";
const imgContainer3 =
  "/svg/list-view-icon.svg";


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
  const searchQuery = "";
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Recently Saved");
  const [isGridView, setIsGridView] = useState(true);
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
    <div className="flex flex-col gap-[32px] p-[24px] lg:p-[32px] w-full">
          
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
              <img alt="Trend Icon" className="size-[36px]" src={"/svg/sparks-icon.svg"} />
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
              <img alt="" className="size-[8px] opacity-60" src={"/svg/arrowRight.svg"} />
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
                <img alt="Saved Properties ribbon" className="h-[10px] w-[15px]" src={"/svg/bookmark.svg"} />
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
                  <img alt="" className="size-[21px] opacity-75" src={"/svg/filter-icon.svg"} />
                  <span>{sortBy}</span>
                  <img alt="Chevron" className="h-[7.4px] w-[12px] opacity-60 ml-auto" src={"/svg/dropdown2.svg"} />
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
                        <img alt="Bookmark tag icon" className="h-[18px] w-[20px]" src={"/svg/bookmark.svg"} />
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
                          <img alt="Location pin" className="h-[13px] w-[10px] shrink-0 mt-[3px] opacity-75" src={"/svg/location-pin-icon.svg"} />
                          <div className="leading-[20px] text-[#42474d]">
                            {property.address}
                          </div>
                        </div>
                      </div>

                      {/* Beds/Baths/Sqft details row */}
                      <div className="border-[#c2c7ce]/30 border-t border-b py-[17px] flex gap-[16px] items-center text-[13px] text-[#42474d] font-semibold w-full select-none">
                        <div className="flex gap-[6px] items-center">
                          <img alt="Beds" className="h-[10.5px] w-[15px]" src={"/svg/bedroom-icon.svg"} />
                          <span>{property.beds} Beds</span>
                        </div>
                        <div className="flex gap-[6px] items-center">
                          <img alt="Baths" className="size-[15px]" src={"/svg/bathroom-icon.svg"} />
                          <span>{property.baths} Baths</span>
                        </div>
                        <div className="flex gap-[6px] items-center">
                          <img alt="Sqft" className="size-[13px]" src={"/svg/l-ruler-icon.svg"} />
                          <span>{property.sqft} sqft</span>
                        </div>
                      </div>

                      {/* AI INSIGHT Box */}
                      <div className="bg-[#194360]/5 border border-[#194360]/10 rounded-[8px] p-[13px] flex flex-col gap-[4px] w-full text-[13px] text-[#42474d] leading-[21px]">
                        <div className="flex gap-[8px] items-center text-[#194360] font-bold text-[11px] tracking-[0.55px] uppercase">
                          <img alt="AI Insight" className="size-[15px]" src={"/svg/sparks-icon.svg"} />
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
                              <img alt="Location pin" className="h-[13px] w-[10px] shrink-0 mt-[3px] opacity-75" src={"/svg/location-pin-icon.svg"} />
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
                              <img alt="Bookmark tag icon" className="h-[18px] w-[20px]" src={"/svg/bookmark.svg"} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Beds/Baths/Sqft details */}
                      <div className="border-[#c2c7ce]/30 border-t border-b py-[12px] flex gap-[24px] items-center text-[13px] text-[#42474d] font-semibold select-none">
                        <div className="flex gap-[6px] items-center">
                          <img alt="Beds" className="h-[10.5px] w-[15px]" src={"/svg/bedroom-icon.svg"} />
                          <span>{property.beds} Beds</span>
                        </div>
                        <div className="flex gap-[6px] items-center">
                          <img alt="Baths" className="size-[15px]" src={"/svg/bathroom-icon.svg"} />
                          <span>{property.baths} Baths</span>
                        </div>
                        <div className="flex gap-[6px] items-center">
                          <img alt="Sqft" className="size-[12.7px]" src={"/svg/l-ruler-icon.svg"} />
                          <span>{property.sqft} sqft</span>
                        </div>
                      </div>

                      {/* AI INSIGHT */}
                      <div className="bg-[#194360]/5 border border-[#194360]/10 rounded-[8px] p-[13px] flex flex-col gap-[4px] w-full text-[13px] text-[#42474d] leading-[21px]">
                        <div className="flex gap-[8px] items-center text-[#194360] font-bold text-[11px] tracking-[0.55px] uppercase">
                          <img alt="AI Insight" className="size-[15px]" src={"/svg/sparks-icon.svg"} />
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
  );
}
