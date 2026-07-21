import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

// ─── Figma Image & SVG Asset Constants ───────────────────────────────────────
const imgBeachfrontLand =
  "http://localhost:3845/assets/a47ef9bb56b3356aa04cf0b4ae8465e638649271.png";
const imgUrbanPlotKelaniya =
  "http://localhost:3845/assets/2ed2447bf74ea29f3b40889948538e6a16365b9d.png";
const imgSvg =
  "http://localhost:3845/assets/f028177494de90f1e058719668a57e0f6346787b.svg";
const imgSvg16 =
  "http://localhost:3845/assets/1c38bf90b306800b96b2c3d2f114ccc7594775dd.svg";

const imgSvg18 =
  "http://localhost:3845/assets/ce5746b0b5be56c386a881edd14538653ed14142.svg";


const getRoadTagIcon = (tag: string) => {
  const normalized = tag.toLowerCase();
  if (normalized.includes("main road")) return "/svg/main-road-icon.svg";
  if (normalized.includes("side road")) return "/svg/side-road-icon.svg";
  if (normalized.includes("beach road") || normalized.includes("beachfront")) return "/svg/beach-road-icon.svg";
  if (normalized.includes("corner") || normalized.includes("dual access")) return "/svg/corner-dual-access-icon.svg";
  return "/svg/side-road-icon.svg"; // fallback
};

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
    image: imgUrbanPlotKelaniya,
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
    image: imgBeachfrontLand,
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
    image: imgUrbanPlotKelaniya,
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
    image: imgBeachfrontLand,
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
  const searchQuery = "";
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Recently Saved");
  const [isGridView, setIsGridView] = useState(true);
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
    <div className="flex flex-col gap-[32px] p-[24px] lg:p-[32px] w-full">
          
          {/* Summary Statistics Row */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[24px] w-full">
            {/* Stat Card 1: Saved Lands */}
            <div className="bg-white border border-[#f3f4f6] rounded-[16px] p-[25px] flex items-center gap-[16px] shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-[#f9fafb] p-[16px] rounded-[12px] flex items-center justify-center shrink-0">
                <img alt="Bookmark" className="size-[24px]" src={"/svg/bookmark.svg"} />
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
                <img alt="Trend" className="size-[24px]" src={"/svg/sparks-icon.svg"} />
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
                <img alt="Total Perches" className="size-[24px]" src={"/svg/perch-icon.svg"} />
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
                    <img alt="Bookmark Tag" className="size-[16px]" src={"/svg/bookmark.svg"} />
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
                  <img alt="" className="size-[18px] opacity-75" src={"/svg/filter-icon.svg"} />
                  <span>{sortBy}</span>
                  <img alt="Chevron" className="size-[16px] opacity-60 ml-auto" src={"/svg/dropdown2.svg"} />
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
                          src={"/svg/bookmark.svg"} 
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
                            <img alt="" className="size-[14px] opacity-75" src={"/svg/location-pin-icon.svg"} />
                            <span>{land.location}</span>
                          </div>
                          <div className="flex items-center gap-[4px]">
                            <img alt="" className="size-[14px] opacity-75" src={"/svg/perch-icon.svg"} />
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
                              {isRoadTag && <img alt="" className="size-[12px] opacity-75" src={getRoadTagIcon(tag)} />}
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
                                <img alt="" className="size-[14px] opacity-75" src={"/svg/location-pin-icon.svg"} />
                                <span>{land.location}</span>
                              </div>
                              <div className="flex items-center gap-[4px]">
                                <img alt="" className="size-[14px] opacity-75" src={"/svg/perch-icon.svg"} />
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
                                src={"/svg/bookmark.svg"} 
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
                              {isRoadTag && <img alt="" className="size-[12px] opacity-75" src={getRoadTagIcon(tag)} />}
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
  );
}
