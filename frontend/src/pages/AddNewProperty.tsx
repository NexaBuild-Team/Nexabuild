import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';

// ─── Figma Image & SVG Asset Constants ───────────────────────────────────────
const imgLocationMap = "/hero_property.png";
const imgCover = "/property_card_1.png";

// ─── Local Saved Image & SVG Asset Constants ─────────────────────────────────
const imgAb6AXuGallery1 = "/property_card_1.png";
const imgAb6AXuGallery2 = "/property_card_2.png";
const imgAb6AXuGallery3 = "/property_card_3.png";
const imgAb6AXuGallery4 = "/property_card_4.png";
const imgKhalidAlRashid = "/hero_property.png";

const imgContainer11 = "/svg/arrow-back.svg"; // Back to listings arrow
const imgContainer12 = "/svg/eye.svg"; // Preview Button icon
const imgContainer13 = "/svg/bookmark.svg"; // Save Draft Icon
const imgContainer14 = "/svg/clock.svg"; // Delete Icon
const imgContainer15 = "/svg/checkMark.svg"; // Publish Icon
const imgContainer16 = "/svg/info.svg"; // Property Info Icon
const imgImage = "/svg/dropdown.svg"; // Select Chevron Down
const imgContainer17 = "/svg/location-pin-icon.svg"; // Location pin Icon
const imgContainer18 = "/svg/location.svg"; // Click to pin map button
const imgContainer19 = "/svg/l-ruler-icon.svg"; // Details Specs Icon
const imgContainer20 = "/svg/home.svg"; // Facilities Icon
const imgContainer21 = "/svg/eye.svg"; // Images Upload Icon
const imgContainer22 = "/svg/arrow-send.svg"; // Upload cloud icon
const imgContainer23 = "/svg/check.svg"; // Thumbnail close icon
const imgContainer34 = "/svg/check.svg"; // Gallery delete cross icon
const imgContainer36 = "/svg/clock.svg"; // Bottom action delete listing
const imgContainer37 = "/svg/sparks-icon.svg"; // AI Smart Tags title icon
const imgContainer38 = "/svg/star.svg"; // Tag Luxury Icon
const imgContainer39 = "/svg/high-potential-icon.svg"; // Tag Investment Icon
const imgContainer40 = "/svg/home.svg"; // Tag Family Icon
const imgContainer41 = "/svg/beach-road-icon.svg"; // Tag Vacation Icon
const imgContainer42 = "/svg/shield-tick.svg"; // Tag School Icon
const imgContainer43 = "/svg/main-road-icon.svg"; // Tag Transport Icon
const imgContainer44 = "/svg/beach-road-icon.svg"; // Tag Sea View Icon
const imgContainer45 = "/svg/location.svg"; // Tag City Center Icon
const imgContainer46 = "/svg/sparks-settings-icon.svg"; // Regenerate AI tags button icon
const imgContainer47 = "/svg/eye.svg"; // Public listing visibility icon
const imgContainer48 = "/svg/agent.svg"; // Agent Network visibility icon
const imgContainer49 = "/svg/star.svg"; // Verified Agent badge star
const imgContainer50 = "/svg/checkMark.svg"; // Tracker Checked Icon
const imgContainer51 = "/svg/check.svg"; // Tracker Unchecked Circle Icon
const imgSidebarLogo = "/src/assets/logo.png";

const imgSvg = "/svg/home.svg";
const imgSvg1 = "/svg/home.svg";
const imgSvg2 = "/svg/land-plot-icon.svg";
const imgSvg6 = "/svg/high-potential-icon.svg";
const imgSvg8 = "/svg/agent.svg";
const imgSvg9 = "/svg/sparks-settings-icon.svg";
const imgSvg10 = "/svg/sign-in.svg";

export default function AddNewProperty() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [price, setPrice] = useState("");

  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [locationName, setLocationName] = useState("");
  const [fullAddress, setFullAddress] = useState("");

  const [beds, setBeds] = useState(4);
  const [baths, setBaths] = useState(3);
  const [garage, setGarage] = useState(2);
  const [floorArea, setFloorArea] = useState("");
  const [landArea, setLandArea] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");

  // Amenities
  const [amenities, setAmenities] = useState<Record<string, boolean>>({
    "Swimming Pool": true,
    "Garden": true,
    "Parking": true,
    "Solar Panels": true,
    "Security": false,
    "Gym": false,
    "Smart Home": true,
    "Air Conditioning": false
  });

  // Images List
  const [coverImage, setCoverImage] = useState<string | null>(imgCover);
  const [galleryImages, setGalleryImages] = useState<string[]>([
    imgAb6AXuGallery1,
    imgAb6AXuGallery2,
    imgAb6AXuGallery3,
    imgAb6AXuGallery4
  ]);

  // Sidebar widget states
  const [status, setStatus] = useState<'Draft' | 'Active' | 'Pending Review' | 'Sold'>('Draft');
  const [aiTags, setAiTags] = useState<string[]>([
    "Luxury", "Investment", "Family", "Vacation", "School Nearby", "Transport", "Sea View", "City Center"
  ]);
  const [visibility, setVisibility] = useState({
    public: true,
    agentNetwork: true,
    featured: false
  });

  // Dynamic progress tracker calculations
  const [progress, setProgress] = useState(0);
  const [steps, setSteps] = useState({
    info: false,
    location: false,
    details: false,
    facilities: false,
    images: false,
    tags: false
  });

  useEffect(() => {
    const isInfoDone = !!(title && description && propertyType && price);
    const isLocationDone = !!(province && district && locationName && fullAddress);
    const isDetailsDone = !!(beds > 0 && baths > 0 && floorArea && landArea && yearBuilt);
    const isFacilitiesDone = Object.values(amenities).some(val => val === true);
    const isImagesDone = !!(coverImage || galleryImages.length > 0);
    const isTagsDone = aiTags.length > 0;

    setSteps({
      info: isInfoDone,
      location: isLocationDone,
      details: isDetailsDone,
      facilities: isFacilitiesDone,
      images: isImagesDone,
      tags: isTagsDone
    });

    let completedCount = 0;
    if (isInfoDone) completedCount++;
    if (isLocationDone) completedCount++;
    if (isDetailsDone) completedCount++;
    if (isFacilitiesDone) completedCount++;
    if (isImagesDone) completedCount++;
    if (isTagsDone) completedCount++;

    setProgress(Math.round((completedCount / 6) * 100));
  }, [title, description, propertyType, price, province, district, locationName, fullAddress, beds, baths, floorArea, landArea, yearBuilt, amenities, coverImage, galleryImages, aiTags]);

  const toggleAmenity = (name: string) => {
    setAmenities(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  const regenerateTags = () => {
    const pool = ["Luxury", "Prime Location", "Eco-friendly", "Modern Design", "High Yield", "Metro Access", "Brand New", "Sea View", "Gated Community"];
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    setAiTags(shuffled.slice(0, 5));
  };

  const handlePublish = () => {
    alert("Listing published successfully!");
    navigate("/agent-dashboard");
  };

  const handleSaveDraft = () => {
    alert("Listing draft saved!");
    navigate("/agent-dashboard");
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this listing draft?")) {
      navigate("/agent-dashboard");
    }
  };

  return (
    <div 
      className="min-h-screen w-full relative flex flex-row items-start font-normal text-[#1f2937]"
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
              className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[8px] text-white/70 hover:bg-white/5 hover:text-white transition-all font-normal text-[14px]"
            >
              <img alt="Dashboard" className="size-[20px] filter brightness-200" src={imgSvg} />
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
              className="flex items-center gap-[12px] px-[16px] py-[10px] rounded-[8px] bg-[#52748c] text-white font-normal text-[13px]"
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
      <main className="flex-grow lg:pl-[256px] min-w-0 flex flex-col">
        
        {/* Sticky Top Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-[#e5e7eb] px-[24px] lg:px-[32px] py-[16px] flex flex-col md:flex-row md:items-center justify-between sticky top-0 z-30 shadow-sm gap-[16px]">
          <div className="flex flex-col gap-[4px]">
            <div className="flex items-center gap-[8px] text-[12px] text-gray-400">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-[4px] border border-gray-200 rounded hover:bg-gray-50 focus:outline-none"
                aria-label="Open sidebar"
              >
                <svg className="size-[16px] text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <Link to="/agent-dashboard" className="hover:underline flex items-center gap-[4px]">
                <img alt="" className="size-[10px]" src={imgContainer11} />
                <span>Back to Listings</span>
              </Link>
            </div>
            <h2 className="text-[24px] font-bold text-[#1e1e1e] tracking-tight leading-[32px]">
              Add New Property
            </h2>
            <p className="text-[12px] text-[#9ca3af] hidden sm:block">
              Fill in the details below to publish your listing
            </p>
          </div>

          {/* Top Actions Buttons */}
          <div className="flex items-center gap-[12px] self-end md:self-center shrink-0">
            <button 
              onClick={() => alert("Preview mode is not implemented.")}
              className="border border-[#d1d5db] hover:bg-gray-50 text-[#1f2937] text-[14px] font-medium px-[21px] py-[9px] rounded-[8px] flex items-center gap-[8px] cursor-pointer"
            >
              <img alt="" className="size-[14px]" src={imgContainer12} />
              <span>Preview</span>
            </button>
            <button 
              onClick={handleSaveDraft}
              className="border border-[#d1d5db] hover:bg-gray-50 text-[#1f2937] text-[14px] font-medium px-[21px] py-[9px] rounded-[8px] flex items-center gap-[8px] cursor-pointer"
            >
              <img alt="" className="size-[14px]" src={imgContainer13} />
              <span>Save Draft</span>
            </button>
            <button 
              onClick={handleDelete}
              className="bg-[#be5d3f] hover:bg-[#be5d3f]/95 text-white text-[14px] font-medium px-[20px] py-[9px] rounded-[8px] flex items-center gap-[8px] cursor-pointer"
            >
              <img alt="" className="size-[14px]" src={imgContainer14} />
              <span>Delete</span>
            </button>
            <button 
              onClick={handlePublish}
              className="bg-[#345b79] hover:bg-[#345b79]/95 text-white text-[14px] font-medium px-[20px] py-[9px] rounded-[8px] flex items-center gap-[8px] cursor-pointer"
            >
              <img alt="" className="size-[14px]" src={imgContainer15} />
              <span>Publish Listing</span>
            </button>
          </div>
        </header>

        {/* Content Body Grid */}
        <div className="p-[24px] lg:p-[32px] grid grid-cols-1 xl:grid-cols-12 gap-[32px] w-full max-w-[1400px] mx-auto">
          
          {/* ─── 3. Left Columns: Form Fields ──────────────────────────────── */}
          <div className="xl:col-span-8 flex flex-col gap-[32px]">
            
            {/* Section 1: Property Information */}
            <section className="bg-white border border-[#f3f4f6] rounded-[8px] p-[32px] flex flex-col gap-[24px] shadow-sm">
              <div className="flex gap-[16px] items-center">
                <div className="bg-[#345b79]/10 flex items-center justify-center rounded-[8px] size-[40px] shrink-0">
                  <img alt="" className="size-[18px]" src={imgContainer16} />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-[#1f2937]">Property Information</h3>
                  <p className="text-[12px] text-[#6b7280]">Basic details about your property listing</p>
                </div>
              </div>

              <div className="flex flex-col gap-[20px]">
                {/* Title */}
                <div className="flex flex-col gap-[8px]">
                  <label className="text-[11px] font-bold tracking-[0.55px] text-[#6b7280] uppercase">
                    Property Title
                  </label>
                  <input 
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Elegant 5-Bedroom Villa in Jumeirah"
                    className="w-full bg-[#f9fafb] border border-[#f3f4f6] rounded-[8px] px-[17px] py-[14px] text-[16px] text-gray-800 placeholder-[#9ca3af] focus:outline-none focus:border-[#345b79]/40 focus:bg-white transition-colors"
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-[8px]">
                  <label className="text-[11px] font-bold tracking-[0.55px] text-[#6b7280] uppercase">
                    Description
                  </label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Describe the property in detail — architecture style, unique features, nearby amenities..."
                    className="w-full bg-[#f9fafb] border border-[#f3f4f6] rounded-[8px] px-[17px] py-[14px] text-[16px] text-gray-800 placeholder-[#9ca3af] focus:outline-none focus:border-[#345b79]/40 focus:bg-white transition-colors resize-none"
                  />
                </div>

                {/* Type and Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
                  <div className="flex flex-col gap-[8px]">
                    <label className="text-[11px] font-bold tracking-[0.55px] text-[#6b7280] uppercase">
                      Property Type
                    </label>
                    <div className="relative">
                      <select 
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="w-full bg-[#f9fafb] border border-[#f3f4f6] rounded-[8px] px-[17px] py-[13px] text-[16px] text-gray-800 appearance-none focus:outline-none focus:border-[#345b79]/40 focus:bg-white transition-colors cursor-pointer"
                      >
                        <option value="">Select type</option>
                        <option value="Villa">Villa</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Penthouse">Penthouse</option>
                        <option value="Townhouse">Townhouse</option>
                        <option value="Commercial">Commercial</option>
                      </select>
                      <div className="absolute right-[17px] top-1/2 -translate-y-1/2 pointer-events-none">
                        <img alt="" className="size-[24px] opacity-60" src={imgImage} />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-[8px]">
                    <label className="text-[11px] font-bold tracking-[0.55px] text-[#6b7280] uppercase">
                      Listing Price
                    </label>
                    <input 
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="LKR 0"
                      className="w-full bg-[#f9fafb] border border-[#f3f4f6] rounded-[8px] px-[17px] py-[14px] text-[16px] text-gray-800 placeholder-[#9ca3af] focus:outline-none focus:border-[#345b79]/40 focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Location */}
            <section className="bg-white border border-[#f3f4f6] rounded-[8px] p-[32px] flex flex-col gap-[24px] shadow-sm">
              <div className="flex gap-[16px] items-center">
                <div className="bg-[#345b79]/10 flex items-center justify-center rounded-[8px] size-[40px] shrink-0">
                  <img alt="" className="size-[16px]" src={imgContainer17} />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-[#1f2937]">Location</h3>
                  <p className="text-[12px] text-[#6b7280]">Where is the property located?</p>
                </div>
              </div>

              <div className="flex flex-col gap-[20px]">
                {/* 3 Grid Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
                  <div className="flex flex-col gap-[8px]">
                    <label className="text-[11px] font-bold tracking-[0.55px] text-[#6b7280] uppercase">
                      Province / Emirate
                    </label>
                    <div className="relative">
                      <select 
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className="w-full bg-[#f9fafb] border border-[#f3f4f6] rounded-[8px] px-[17px] py-[13px] text-[16px] text-gray-800 appearance-none focus:outline-none focus:border-[#345b79]/40 focus:bg-white transition-colors cursor-pointer"
                      >
                        <option value="">Select Province</option>
                        <option value="Western">Western</option>
                        <option value="Southern">Southern</option>
                        <option value="Central">Central</option>
                        <option value="Eastern">Eastern</option>
                        <option value="Dubai">Dubai (UAE)</option>
                      </select>
                      <div className="absolute right-[17px] top-1/2 -translate-y-1/2 pointer-events-none">
                        <img alt="" className="size-[24px] opacity-60" src={imgImage} />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-[8px]">
                    <label className="text-[11px] font-bold tracking-[0.55px] text-[#6b7280] uppercase">
                      District / Area
                    </label>
                    <input 
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="e.g. Colombo 7, Jumeirah"
                      className="w-full bg-[#f9fafb] border border-[#f3f4f6] rounded-[8px] px-[17px] py-[14px] text-[16px] text-gray-800 placeholder-[#9ca3af] focus:outline-none focus:border-[#345b79]/40 focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-[8px]">
                    <label className="text-[11px] font-bold tracking-[0.55px] text-[#6b7280] uppercase">
                      Location
                    </label>
                    <input 
                      type="text"
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      placeholder="e.g. Gregory's Road, Palm"
                      className="w-full bg-[#f9fafb] border border-[#f3f4f6] rounded-[8px] px-[17px] py-[14px] text-[16px] text-gray-800 placeholder-[#9ca3af] focus:outline-none focus:border-[#345b79]/40 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* Full Address */}
                <div className="flex flex-col gap-[8px]">
                  <label className="text-[11px] font-bold tracking-[0.55px] text-[#6b7280] uppercase">
                    Full Address
                  </label>
                  <input 
                    type="text"
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                    placeholder="Street address, building name, floor..."
                    className="w-full bg-[#f9fafb] border border-[#f3f4f6] rounded-[8px] px-[17px] py-[14px] text-[16px] text-gray-800 placeholder-[#9ca3af] focus:outline-none focus:border-[#345b79]/40 focus:bg-white transition-colors"
                  />
                </div>

                {/* Map Placeholder image overlay */}
                <div className="w-full h-[264px] rounded-[8px] overflow-hidden relative border border-gray-100 bg-[#f9fafb] shadow-inner">
                  <img alt="Location Map" className="size-full object-cover" src={imgLocationMap} />
                  <div className="absolute inset-0 bg-black/15 flex items-center justify-center">
                    <button 
                      onClick={() => alert("Map pinning is not implemented.")}
                      className="bg-white/95 backdrop-blur-[2px] border border-gray-100 shadow-md hover:bg-white hover:scale-102 transition-all font-bold text-gray-800 text-[14px] px-[24px] py-[8px] rounded-full flex items-center gap-[8px] cursor-pointer"
                    >
                      <img alt="" className="size-[14px]" src={imgContainer18} />
                      <span>Click to pin exact location on map</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Property Details */}
            <section className="bg-white border border-[#f3f4f6] rounded-[8px] p-[32px] flex flex-col gap-[24px] shadow-sm">
              <div className="flex gap-[16px] items-center">
                <div className="bg-[#345b79]/10 flex items-center justify-center rounded-[8px] size-[40px] shrink-0">
                  <img alt="" className="h-[12px] w-[18px]" src={imgContainer19} />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-[#1f2937]">Property Details</h3>
                  <p className="text-[12px] text-[#6b7280]">Specifications and measurements</p>
                </div>
              </div>

              <div className="flex flex-col gap-[24px]">
                {/* 3 Counter Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] select-none">
                  {/* Bedrooms counter */}
                  <div className="flex flex-col gap-[8px]">
                    <span className="text-[11px] font-bold tracking-[0.55px] text-[#6b7280] uppercase">Bedrooms</span>
                    <div className="flex items-center justify-between border border-gray-200 rounded-[8px] p-[6px] bg-[#f9fafb]">
                      <button 
                        onClick={() => setBeds(prev => Math.max(0, prev - 1))}
                        className="size-[32px] bg-white border border-gray-200 rounded-[6px] hover:bg-gray-50 flex items-center justify-center font-bold text-gray-600 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-[16px] font-bold text-[#1f2937]">{beds}</span>
                      <button 
                        onClick={() => setBeds(prev => prev + 1)}
                        className="size-[32px] bg-white border border-gray-200 rounded-[6px] hover:bg-gray-50 flex items-center justify-center font-bold text-gray-600 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Bathrooms counter */}
                  <div className="flex flex-col gap-[8px]">
                    <span className="text-[11px] font-bold tracking-[0.55px] text-[#6b7280] uppercase">Bathrooms</span>
                    <div className="flex items-center justify-between border border-gray-200 rounded-[8px] p-[6px] bg-[#f9fafb]">
                      <button 
                        onClick={() => setBaths(prev => Math.max(0, prev - 1))}
                        className="size-[32px] bg-white border border-gray-200 rounded-[6px] hover:bg-gray-50 flex items-center justify-center font-bold text-gray-600 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-[16px] font-bold text-[#1f2937]">{baths}</span>
                      <button 
                        onClick={() => setBaths(prev => prev + 1)}
                        className="size-[32px] bg-white border border-gray-200 rounded-[6px] hover:bg-gray-50 flex items-center justify-center font-bold text-gray-600 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Garage counter */}
                  <div className="flex flex-col gap-[8px]">
                    <span className="text-[11px] font-bold tracking-[0.55px] text-[#6b7280] uppercase">Garage</span>
                    <div className="flex items-center justify-between border border-gray-200 rounded-[8px] p-[6px] bg-[#f9fafb]">
                      <button 
                        onClick={() => setGarage(prev => Math.max(0, prev - 1))}
                        className="size-[32px] bg-white border border-gray-200 rounded-[6px] hover:bg-gray-50 flex items-center justify-center font-bold text-gray-600 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-[16px] font-bold text-[#1f2937]">{garage}</span>
                      <button 
                        onClick={() => setGarage(prev => prev + 1)}
                        className="size-[32px] bg-white border border-gray-200 rounded-[6px] hover:bg-gray-50 flex items-center justify-center font-bold text-gray-600 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Grid inputs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
                  <div className="flex flex-col gap-[8px]">
                    <label className="text-[11px] font-bold tracking-[0.55px] text-[#6b7280] uppercase">
                      Floor Area (SQFT)
                    </label>
                    <input 
                      type="text"
                      value={floorArea}
                      onChange={(e) => setFloorArea(e.target.value)}
                      placeholder="e.g. 5,200"
                      className="w-full bg-[#f9fafb] border border-[#f3f4f6] rounded-[8px] px-[17px] py-[14px] text-[16px] text-gray-800 placeholder-[#9ca3af] focus:outline-none focus:border-[#345b79]/40 focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-[8px]">
                    <label className="text-[11px] font-bold tracking-[0.55px] text-[#6b7280] uppercase">
                      Land Area (SQFT)
                    </label>
                    <input 
                      type="text"
                      value={landArea}
                      onChange={(e) => setLandArea(e.target.value)}
                      placeholder="e.g. 8,400"
                      className="w-full bg-[#f9fafb] border border-[#f3f4f6] rounded-[8px] px-[17px] py-[14px] text-[16px] text-gray-800 placeholder-[#9ca3af] focus:outline-none focus:border-[#345b79]/40 focus:bg-white transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-[8px]">
                    <label className="text-[11px] font-bold tracking-[0.55px] text-[#6b7280] uppercase">
                      Year Built
                    </label>
                    <input 
                      type="text"
                      value={yearBuilt}
                      onChange={(e) => setYearBuilt(e.target.value)}
                      placeholder="e.g. 2021"
                      className="w-full bg-[#f9fafb] border border-[#f3f4f6] rounded-[8px] px-[17px] py-[14px] text-[16px] text-gray-800 placeholder-[#9ca3af] focus:outline-none focus:border-[#345b79]/40 focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Facilities & Amenities */}
            <section className="bg-white border border-[#f3f4f6] rounded-[8px] p-[32px] flex flex-col gap-[24px] shadow-sm">
              <div className="flex gap-[16px] items-center">
                <div className="bg-[#345b79]/10 flex items-center justify-center rounded-[8px] size-[40px] shrink-0">
                  <img alt="" className="size-[20px]" src={imgContainer20} />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-[#1f2937]">Facilities & Amenities</h3>
                  <p className="text-[12px] text-[#6b7280]">Select all that apply to this property</p>
                </div>
              </div>

              {/* Grid of Pills */}
              <div className="flex flex-wrap gap-[12px] w-full">
                {Object.keys(amenities).map(key => (
                  <button
                    key={key}
                    onClick={() => toggleAmenity(key)}
                    className={`px-[24px] py-[12px] rounded-full text-[14px] font-semibold border transition-all duration-150 cursor-pointer ${
                      amenities[key]
                        ? "bg-[#194360] border-[#194360] text-white shadow-sm"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </section>

            {/* Section 5: Property Images */}
            <section className="bg-white border border-[#f3f4f6] rounded-[8px] p-[32px] flex flex-col gap-[24px] shadow-sm">
              <div className="flex gap-[16px] items-center">
                <div className="bg-[#345b79]/10 flex items-center justify-center rounded-[8px] size-[40px] shrink-0">
                  <img alt="" className="size-[20px]" src={imgContainer21} />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-[#1f2937]">Property Images</h3>
                  <p className="text-[12px] text-[#6b7280]">Upload high-quality photos to attract buyers</p>
                </div>
              </div>

              {/* Drag drop zone mock */}
              <div 
                onClick={() => alert("Upload dialog opened (Mock).")}
                className="border-2 border-dashed border-gray-200 hover:border-[#345b79]/50 rounded-[12px] p-[32px] text-center flex flex-col items-center justify-center gap-[12px] bg-[#f9fafb] cursor-pointer hover:bg-white transition-colors"
              >
                <div className="bg-[#345b79]/10 p-[12px] rounded-full text-[#345b79]">
                  <img alt="Upload cloud" className="size-[24px]" src={imgContainer22} />
                </div>
                <div>
                  <p className="text-[16px] font-bold text-gray-800">Drag & Drop your images here</p>
                  <p className="text-[12px] text-gray-400 mt-[4px]">Supports JPG, PNG, WEBP — max 20MB per file</p>
                </div>
                <button className="bg-[#194360] hover:bg-[#194360]/95 text-white text-[14px] font-bold px-[20px] py-[8px] rounded-[6px] transition-colors mt-[4px] cursor-pointer">
                  Browse Files
                </button>
              </div>

              {/* Thumbnail row */}
              <div className="space-y-[16px]">
                {/* Cover Image row */}
                <div>
                  <h4 className="text-[11px] font-bold tracking-[0.55px] text-[#6b7280] uppercase mb-[8px]">
                    Thumbnail (Cover Image)
                  </h4>
                  <div className="flex gap-[16px] items-start">
                    {coverImage ? (
                      <div className="relative w-[192px] h-[128px] rounded-[8px] overflow-hidden border border-gray-200 shrink-0">
                        <img alt="Cover Preview" className="size-full object-cover" src={coverImage} />
                        <div className="absolute top-[8px] left-[8px] bg-black/60 rounded px-[6px] py-[2px] text-[8px] font-bold text-white tracking-[0.5px] uppercase">
                          COVER
                        </div>
                        <button 
                          onClick={() => setCoverImage(null)}
                          className="absolute top-[8px] right-[8px] bg-white/80 hover:bg-white rounded-full size-[24px] flex items-center justify-center shadow transition-colors cursor-pointer"
                        >
                          <img alt="Delete cover" className="size-[10px]" src={imgContainer23} />
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => setCoverImage(imgCover)}
                        className="border-2 border-dashed border-gray-200 hover:border-gray-300 w-[192px] h-[128px] rounded-[8px] bg-[#f9fafb] flex flex-col items-center justify-center gap-[4px] cursor-pointer transition-colors"
                      >
                        <span className="text-[20px] font-light text-gray-400">+</span>
                        <span className="text-[10px] font-bold text-gray-400">Add Cover</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Gallery Images row */}
                <div>
                  <h4 className="text-[11px] font-bold tracking-[0.55px] text-[#6b7280] uppercase mb-[8px]">
                    Gallery Images
                  </h4>
                  <div className="flex flex-wrap gap-[16px] items-start">
                    {galleryImages.map((src, index) => (
                      <div key={index} className="relative w-[112px] h-[72px] rounded-[8px] overflow-hidden border border-gray-200 shrink-0">
                        <img alt="Gallery Preview" className="size-full object-cover" src={src} />
                        <button 
                          onClick={() => removeGalleryImage(index)}
                          className="absolute top-[8px] right-[8px] bg-white/80 hover:bg-white rounded-full size-[20px] flex items-center justify-center shadow transition-colors cursor-pointer"
                        >
                          <img alt="Remove" className="size-[7.5px]" src={imgContainer34} />
                        </button>
                      </div>
                    ))}

                    <div 
                      onClick={() => setGalleryImages(prev => [...prev, imgAb6AXuGallery1])}
                      className="border-2 border-dashed border-gray-200 hover:border-gray-300 w-[112px] h-[72px] rounded-[8px] bg-[#f9fafb] flex flex-col items-center justify-center gap-[2px] cursor-pointer transition-colors"
                    >
                      <span className="text-[16px] font-light text-gray-400">+</span>
                      <span className="text-[10px] font-bold text-gray-400">Add</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Mobile View Bottom buttons */}
            <div className="bg-white border border-[#f3f4f6] rounded-[8px] p-[24px] flex flex-col sm:flex-row justify-between items-center gap-[16px] xl:hidden shadow-sm">
              <button 
                onClick={handleDelete}
                className="w-full sm:w-auto border border-[#e5e7eb] hover:bg-red-50 text-[#be5d3f] text-[14px] font-bold px-[21px] py-[9px] rounded-[8px] flex items-center justify-center gap-[8px] cursor-pointer"
              >
                <img alt="" className="size-[14px]" src={imgContainer36} />
                <span>Delete Listing</span>
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-[12px] w-full sm:w-auto">
                <button 
                  onClick={handleSaveDraft}
                  className="w-full sm:w-auto border border-[#e5e7eb] hover:bg-gray-50 text-[#1f2937] text-[14px] font-bold px-[21px] py-[9px] rounded-[8px] cursor-pointer"
                >
                  Save Draft
                </button>
                <button 
                  onClick={() => alert("Preview mode is not implemented.")}
                  className="w-full sm:w-auto border border-[#e5e7eb] hover:bg-gray-50 text-[#1f2937] text-[14px] font-bold px-[21px] py-[9px] rounded-[8px] cursor-pointer"
                >
                  Preview
                </button>
                <button 
                  onClick={handlePublish}
                  className="w-full sm:w-auto bg-[#345b79] hover:bg-[#345b79]/95 text-white text-[14px] font-bold pb-[9.5px] pt-[8.5px] px-[24px] rounded-[8px] cursor-pointer"
                >
                  Publish Listing
                </button>
              </div>
            </div>

          </div>

          {/* ─── 4. Right Sidebar Columns: Metadata Widgets ────────────────── */}
          <div className="xl:col-span-4 flex flex-col gap-[24px]">
            
            {/* Widget 1: Listing Status */}
            <div className="bg-white border border-[#f3f4f6] rounded-[8px] p-[24px] flex flex-col gap-[16px] shadow-sm">
              <span className="text-[11px] font-bold tracking-[0.55px] text-[#6b7280] uppercase">
                Listing Status
              </span>
              <div className="flex flex-col gap-[8px] select-none">
                {/* Draft Option */}
                <div 
                  onClick={() => setStatus('Draft')}
                  className={`flex gap-[12px] items-center p-[14px] rounded-[8px] border-2 cursor-pointer transition-all ${
                    status === 'Draft'
                      ? "bg-[#f9fafb] border-[#345b79]/20"
                      : "bg-white border-[#f3f4f6]"
                  }`}
                >
                  <div className="bg-[#9ca3af] rounded-full size-[12px]" />
                  <span className="text-[14px] font-bold text-[#1f2937]">Draft</span>
                </div>

                {/* Active Option */}
                <div 
                  onClick={() => setStatus('Active')}
                  className={`flex gap-[12px] items-center p-[14px] rounded-[8px] border-2 cursor-pointer transition-all ${
                    status === 'Active'
                      ? "bg-[#f9fafb] border-[#345b79]/20"
                      : "bg-white border-[#f3f4f6]"
                  }`}
                >
                  <div className="bg-[#3b82f6] rounded-full size-[12px]" />
                  <span className="text-[14px] font-bold text-[#1f2937]">Active</span>
                </div>

                {/* Pending Review Option */}
                <div 
                  onClick={() => setStatus('Pending Review')}
                  className={`flex gap-[12px] items-center p-[14px] rounded-[8px] border-2 cursor-pointer transition-all ${
                    status === 'Pending Review'
                      ? "bg-[#f9fafb] border-[#345b79]/20"
                      : "bg-white border-[#f3f4f6]"
                  }`}
                >
                  <div className="bg-[#eab308] rounded-full size-[12px]" />
                  <span className="text-[14px] font-bold text-[#1f2937]">Pending Review</span>
                </div>

                {/* Sold Option */}
                <div 
                  onClick={() => setStatus('Sold')}
                  className={`flex gap-[12px] items-center p-[14px] rounded-[8px] border-2 cursor-pointer transition-all ${
                    status === 'Sold'
                      ? "bg-[#f9fafb] border-[#345b79]/20"
                      : "bg-white border-[#f3f4f6]"
                  }`}
                >
                  <div className="bg-[#22c55e] rounded-full size-[12px]" />
                  <span className="text-[14px] font-bold text-[#1f2937]">Sold</span>
                </div>
              </div>
            </div>

            {/* Widget 2: AI Smart Tags */}
            <div className="bg-white border border-[#f3f4f6] rounded-[8px] p-[24px] flex flex-col gap-[16px] shadow-sm">
              <div className="flex gap-[8px] items-center text-[#6b7280]">
                <img alt="" className="size-[17px] opacity-75" src={imgContainer37} />
                <span className="text-[11px] font-bold tracking-[0.55px] uppercase">
                  AI Smart Tags
                </span>
              </div>
              <p className="text-[10px] text-[#9ca3af] leading-[15px] -mt-[4px]">
                Auto-generated tags help match buyers to your listing
              </p>
              
              {/* Tags Container */}
              <div className="flex flex-wrap gap-[6px] w-full">
                {aiTags.map(tag => {
                  let tagIcon = imgContainer38; // Default Luxury
                  if (tag === "Investment") tagIcon = imgContainer39;
                  if (tag === "Family") tagIcon = imgContainer40;
                  if (tag === "Vacation") tagIcon = imgContainer41;
                  if (tag === "School Nearby") tagIcon = imgContainer42;
                  if (tag === "Transport") tagIcon = imgContainer43;
                  if (tag === "Sea View") tagIcon = imgContainer44;
                  if (tag === "City Center") tagIcon = imgContainer45;

                  return (
                    <div 
                      key={tag}
                      className="bg-[#be5d3f]/10 rounded-full px-[12px] py-[4px] text-[#be5d3f] text-[10px] font-bold flex items-center gap-[4px] select-none"
                    >
                      <img alt="" className="size-[10px]" src={tagIcon} />
                      <span>{tag}</span>
                    </div>
                  );
                })}
              </div>

              {/* Regenerate AI Tags CTA */}
              <button 
                onClick={regenerateTags}
                className="border border-[#be5d3f] hover:bg-[#be5d3f]/5 text-[#be5d3f] text-[12px] font-bold py-[9px] rounded-[8px] w-full flex items-center justify-center gap-[8px] transition-colors cursor-pointer"
              >
                <img alt="" className="h-[10.5px] w-[11.2px]" src={imgContainer46} />
                <span>Regenerate AI Tags</span>
              </button>
            </div>

            {/* Widget 3: Listing Visibility */}
            <div className="bg-white border border-[#f3f4f6] rounded-[8px] p-[24px] flex flex-col gap-[20px] shadow-sm">
              <span className="text-[11px] font-bold tracking-[0.55px] text-[#6b7280] uppercase">
                Listing Visibility
              </span>
              
              <div className="flex flex-col gap-[20px] w-full">
                {/* Public listing toggle */}
                <div className="flex items-center justify-between w-full">
                  <div className="flex gap-[12px] items-center">
                    <div className="bg-[#f3f4f6] flex items-center justify-center rounded-[4px] size-[32px] shrink-0">
                      <img alt="" className="size-[16px]" src={imgContainer47} />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-[#1f2937]">Public Listing</p>
                      <p className="text-[9px] text-[#9ca3af]">Visible to all users</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setVisibility(prev => ({ ...prev, public: !prev.public }))}
                    className={`relative w-[40px] h-[20px] rounded-full transition-colors focus:outline-none ${
                      visibility.public ? "bg-[#345b79]" : "bg-gray-200"
                    }`}
                    aria-label="Toggle Public Listing"
                  >
                    <div className={`absolute bg-white rounded-full size-[16px] top-[2px] transition-transform duration-200 ${
                      visibility.public ? "translate-x-[22px]" : "translate-x-[2px]"
                    }`} />
                  </button>
                </div>

                {/* Agent Network toggle */}
                <div className="flex items-center justify-between w-full">
                  <div className="flex gap-[12px] items-center">
                    <div className="bg-[#f3f4f6] flex items-center justify-center rounded-[4px] size-[32px] shrink-0">
                      <img alt="" className="h-[16px] w-[20px]" src={imgContainer48} />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-[#1f2937]">Agent Network</p>
                      <p className="text-[9px] text-[#9ca3af]">Share with agents</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setVisibility(prev => ({ ...prev, agentNetwork: !prev.agentNetwork }))}
                    className={`relative w-[40px] h-[20px] rounded-full transition-colors focus:outline-none ${
                      visibility.agentNetwork ? "bg-[#345b79]" : "bg-gray-200"
                    }`}
                    aria-label="Toggle Agent Network"
                  >
                    <div className={`absolute bg-white rounded-full size-[16px] top-[2px] transition-transform duration-200 ${
                      visibility.agentNetwork ? "translate-x-[22px]" : "translate-x-[2px]"
                    }`} />
                  </button>
                </div>

                {/* Featured Listing toggle */}
                <div className="flex items-center justify-between w-full">
                  <div className="flex gap-[12px] items-center">
                    <div className="bg-[#f3f4f6] flex items-center justify-center rounded-[4px] size-[32px] shrink-0">
                      <img alt="" className="h-[16px] w-[16.5px]" src={imgContainer22} />
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-[#1f2937]">Featured Listing</p>
                      <p className="text-[9px] text-[#9ca3af]">Promoted placement</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setVisibility(prev => ({ ...prev, featured: !prev.featured }))}
                    className={`relative w-[40px] h-[20px] rounded-full transition-colors focus:outline-none ${
                      visibility.featured ? "bg-[#345b79]" : "bg-gray-200"
                    }`}
                    aria-label="Toggle Featured Listing"
                  >
                    <div className={`absolute bg-white rounded-full size-[16px] top-[2px] transition-transform duration-200 ${
                      visibility.featured ? "translate-x-[22px]" : "translate-x-[2px]"
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Widget 4: Publishing Profile */}
            <div className="bg-[#345b79] text-white rounded-[8px] p-[24px] flex flex-col gap-[16px] shadow-sm">
              <span className="text-[10px] font-bold tracking-[0.5px] text-white/60 uppercase">
                Publishing As
              </span>
              <div className="flex gap-[12px] items-center w-full">
                <div className="rounded-full overflow-hidden border border-white/20 size-[40px]">
                  <img alt="Khalid Al-Rashid" className="size-full object-cover" src={imgKhalidAlRashid} />
                </div>
                <div>
                  <p className="text-[14px] font-bold leading-[20px]">Khalid Al-Rashid</p>
                  <p className="text-[10px] text-white/60 leading-[15px]">Senior Agent</p>
                </div>
              </div>
              <div className="bg-white/10 rounded-full px-[12px] py-[6px] text-[9px] font-medium flex items-center gap-[8px] self-start select-none">
                <img alt="" className="size-[9px] filter brightness-200" src={imgContainer49} />
                <span>Verified NexaBuild Agent</span>
              </div>
            </div>

            {/* Widget 5: Form Completion tracker */}
            <div className="bg-white border border-[#f3f4f6] rounded-[8px] p-[24px] flex flex-col gap-[16px] shadow-sm">
              <div className="flex justify-between items-center w-full select-none">
                <span className="text-[12px] font-bold text-[#1f2937]">Form Completion</span>
                <span className="text-[12px] font-bold text-[#345b79]">{progress}%</span>
              </div>
              <div className="bg-gray-100 h-[8px] rounded-full overflow-hidden w-full">
                <div className="bg-[#345b79] h-full rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>

              {/* Steps List */}
              <div className="flex flex-col gap-[12px] pt-[8px]">
                {/* Step 1 */}
                <div className="flex gap-[8px] items-center text-[12px] text-[#1f2937]">
                  <img alt="" className="size-[12px]" src={steps.info ? imgContainer50 : imgContainer51} />
                  <span className={steps.info ? "font-bold text-gray-500" : "font-medium"}>Property Info</span>
                </div>

                {/* Step 2 */}
                <div className="flex gap-[8px] items-center text-[12px] text-[#1f2937]">
                  <img alt="" className="size-[12px]" src={steps.location ? imgContainer50 : imgContainer51} />
                  <span className={steps.location ? "font-bold text-gray-500" : "font-medium"}>Location</span>
                </div>

                {/* Step 3 */}
                <div className="flex gap-[8px] items-center text-[12px] text-[#1f2937]">
                  <img alt="" className="size-[12px]" src={steps.details ? imgContainer50 : imgContainer51} />
                  <span className={steps.details ? "font-bold text-gray-500" : "font-medium"}>Property Details</span>
                </div>

                {/* Step 4 */}
                <div className="flex gap-[8px] items-center text-[12px] text-[#1f2937]">
                  <img alt="" className="size-[12px]" src={steps.facilities ? imgContainer50 : imgContainer51} />
                  <span className={steps.facilities ? "font-bold text-gray-500" : "font-medium"}>Facilities</span>
                </div>

                {/* Step 5 */}
                <div className="flex gap-[8px] items-center text-[12px] text-[#1f2937]">
                  <img alt="" className="size-[12px]" src={steps.images ? imgContainer50 : imgContainer51} />
                  <span className={steps.images ? "font-bold text-gray-500" : "font-medium"}>Images</span>
                </div>

                {/* Step 6 */}
                <div className="flex gap-[8px] items-center text-[12px] text-[#1f2937]">
                  <img alt="" className="size-[12px]" src={steps.tags ? imgContainer50 : imgContainer51} />
                  <span className={steps.tags ? "font-bold text-gray-500" : "font-medium"}>AI Tags</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
