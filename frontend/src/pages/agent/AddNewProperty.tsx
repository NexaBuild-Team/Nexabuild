import React, { useState, useEffect } from 'react';

// ─── 1. Comprehensive Backend Interfaces ───────────────────────────────────

export interface AddNewPropertyFormFields {
  title?: string;
  description?: string;
  propertyType?: string;
  price?: string | number;
  province?: string;
  district?: string;
  locationName?: string;
  fullAddress?: string;
  beds?: number;
  baths?: number;
  garage?: number;
  floorArea?: string | number;
  landArea?: string | number;
  yearBuilt?: string | number;
  amenities?: Record<string, boolean>;
  coverImage?: string | null;
  galleryImages?: string[];
  status?: 'Draft' | 'Active' | 'Pending Review' | 'Sold';
  aiTags?: string[];
  visibility?: {
    public: boolean;
    agentNetwork: boolean;
    featured: boolean;
  };
}

export interface AgentProfileData {
  agentName?: string;
  agentRole?: string;
  agentAvatarUrl?: string;
  isVerified?: boolean;
}

export interface AddNewPropertyPageData {
  initialFields?: AddNewPropertyFormFields;
  agentProfile?: AgentProfileData;
}

export interface AddNewPropertyProps {
  data?: AddNewPropertyPageData | null;
  isLoading?: boolean;
  error?: string | null;
  onPublish?: (payload: AddNewPropertyFormFields) => void;
  onSaveDraft?: (payload: AddNewPropertyFormFields) => void;
  onDeleteDraft?: () => void;
}

// ─── Component Implementation ───────────────────────────────────────────────

export default function AddNewProperty({
  data = null,
  isLoading = false,
  error = null,
  onPublish,
  onSaveDraft,
  onDeleteDraft
}: AddNewPropertyProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Form State initialized with backend data or fallbacks
  const [title, setTitle] = useState(data?.initialFields?.title || '');
  const [description, setDescription] = useState(data?.initialFields?.description || '');
  const [propertyType, setPropertyType] = useState(data?.initialFields?.propertyType || '');
  const [price, setPrice] = useState(data?.initialFields?.price ? String(data.initialFields.price) : '');

  const [province, setProvince] = useState(data?.initialFields?.province || '');
  const [district, setDistrict] = useState(data?.initialFields?.district || '');
  const [locationName, setLocationName] = useState(data?.initialFields?.locationName || '');
  const [fullAddress, setFullAddress] = useState(data?.initialFields?.fullAddress || '');

  const [beds, setBeds] = useState(data?.initialFields?.beds ?? 4);
  const [baths, setBaths] = useState(data?.initialFields?.baths ?? 3);
  const [garage, setGarage] = useState(data?.initialFields?.garage ?? 2);
  const [floorArea, setFloorArea] = useState(data?.initialFields?.floorArea ? String(data.initialFields.floorArea) : '');
  const [landArea, setLandArea] = useState(data?.initialFields?.landArea ? String(data.initialFields.landArea) : '');
  const [yearBuilt, setYearBuilt] = useState(data?.initialFields?.yearBuilt ? String(data.initialFields.yearBuilt) : '');

  // Amenities
  const [amenities, setAmenities] = useState<Record<string, boolean>>(
    data?.initialFields?.amenities || {
      'Swimming Pool': true,
      'Garden': true,
      'Parking': true,
      'Solar Panels': true,
      'Security': false,
      'Gym': false,
      'Smart Home': true,
      'Air Conditioning': false
    }
  );

  // Images List
  const [coverImage, setCoverImage] = useState<string | null>(data?.initialFields?.coverImage ?? '/property_card_1.png');
  const [galleryImages, setGalleryImages] = useState<string[]>(
    data?.initialFields?.galleryImages || [
      '/property_card_1.png',
      '/property_card_2.png',
      '/property_card_3.png',
      '/property_card_4.png'
    ]
  );

  // Sidebar widget states
  const [status, setStatus] = useState<'Draft' | 'Active' | 'Pending Review' | 'Sold'>(data?.initialFields?.status || 'Draft');
  const [aiTags, setAiTags] = useState<string[]>(
    data?.initialFields?.aiTags || ['Luxury', 'Investment', 'Family', 'Vacation', 'School Nearby', 'Transport', 'Sea View', 'City Center']
  );
  const [visibility, setVisibility] = useState(
    data?.initialFields?.visibility || {
      public: true,
      agentNetwork: true,
      featured: false
    }
  );

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
    const pool = ['Luxury', 'Prime Location', 'Eco-friendly', 'Modern Design', 'High Yield', 'Metro Access', 'Brand New', 'Sea View', 'Gated Community'];
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    setAiTags(shuffled.slice(0, 5));
  };

  const constructPayload = (): AddNewPropertyFormFields => ({
    title,
    description,
    propertyType,
    price,
    province,
    district,
    locationName,
    fullAddress,
    beds,
    baths,
    garage,
    floorArea,
    landArea,
    yearBuilt,
    amenities,
    coverImage,
    galleryImages,
    status,
    aiTags,
    visibility
  });

  const handlePublishClick = () => {
    if (onPublish) {
      onPublish(constructPayload());
    } else {
      alert('Listing published successfully!');
    }
  };

  const handleSaveDraftClick = () => {
    if (onSaveDraft) {
      onSaveDraft(constructPayload());
    } else {
      alert('Listing draft saved!');
    }
  };

  const handleDeleteClick = () => {
    if (onDeleteDraft) {
      onDeleteDraft();
    } else {
      if (window.confirm('Are you sure you want to delete this listing draft?')) {
        alert('Listing draft deleted.');
      }
    }
  };

  // ─── 2. Skeleton Loading State ─────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col gap-6 p-6 lg:p-8 animate-pulse max-w-[1400px] mx-auto">
        <div className="h-16 bg-gray-200 rounded-2xl w-full" />
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-8 space-y-6">
            <div className="h-64 bg-gray-200 rounded-2xl" />
            <div className="h-64 bg-gray-200 rounded-2xl" />
          </div>
          <div className="xl:col-span-4 space-y-6">
            <div className="h-40 bg-gray-200 rounded-2xl" />
            <div className="h-40 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative flex flex-row items-start font-normal text-[#1f2937] bg-gradient-to-r from-[#e6e0d4] to-[#fcf9f8]">
      
      {/* Sidebar Drawer */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-[256px] bg-[#345b79] flex flex-col justify-between pt-[76px] pb-[24px] px-[16px] transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="absolute top-[11px] left-0 right-0 px-[32px] flex items-center gap-[12px]">
          <div className="bg-white/20 flex items-center justify-center rounded-[12px] size-[40px]">
            <img alt="NexaBuild Logo" className="size-[20px] object-contain" src="/src/assets/logo.png" />
          </div>
          <span className="text-[24px] font-extrabold text-white tracking-[-0.6px] leading-[32px]">
            NexaBuild
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-between overflow-y-auto mt-[20px]">
          <nav className="flex flex-col gap-[4px]">
            <a href="/agent-dashboard" className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[8px] text-white/70 hover:bg-white/5 hover:text-white transition-all font-normal text-[14px]">
              <img alt="Dashboard" className="size-[20px] filter brightness-200" src="/svg/home.svg" />
              <span className="leading-[20px]">Dashboard</span>
            </a>
            <a href="/view-all-properties" className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[8px] text-white/70 hover:bg-white/5 hover:text-white transition-all font-normal text-[14px]">
              <img alt="Properties" className="size-[20px] filter brightness-200" src="/svg/home.svg" />
              <span className="leading-[20px]">Properties</span>
            </a>
            <a href="/view-all-land" className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[8px] text-white/70 hover:bg-white/5 hover:text-white transition-all font-normal text-[14px]">
              <img alt="Lands" className="size-[20px] filter brightness-200" src="/svg/land-plot-icon.svg" />
              <span className="leading-[20px]">Lands</span>
            </a>
          </nav>
        </div>
      </aside>

      {/* Backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/45 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-grow lg:pl-[256px] min-w-0 flex flex-col">
        
        {/* Sticky Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-[#e5e7eb] px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between sticky top-0 z-30 shadow-sm gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-1 border border-gray-200 rounded hover:bg-gray-50"
              >
                <svg className="size-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <a href="/agent-dashboard" className="hover:underline flex items-center gap-1">
                <img alt="" className="size-2.5" src="/svg/arrow-back.svg" />
                <span>Back to Listings</span>
              </a>
            </div>
            <h1 className="text-xl font-bold text-[#1e1e1e] tracking-tight">Add New Property</h1>
          </div>

          <div className="flex items-center gap-3 self-end md:self-center shrink-0">
            <button 
              onClick={handleSaveDraftClick}
              className="border border-[#d1d5db] hover:bg-gray-50 text-[#1f2937] text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2"
            >
              <img alt="" className="size-3.5" src="/svg/bookmark.svg" />
              <span>Save Draft</span>
            </button>
            <button 
              onClick={handleDeleteClick}
              className="bg-[#be5d3f] hover:bg-[#be5d3f]/90 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2"
            >
              <img alt="" className="size-3.5" src="/svg/clock.svg" />
              <span>Delete</span>
            </button>
            <button 
              onClick={handlePublishClick}
              className="bg-[#345b79] hover:bg-[#345b79]/90 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm"
            >
              <img alt="" className="size-3.5" src="/svg/checkMark.svg" />
              <span>Publish Listing</span>
            </button>
          </div>
        </header>

        {/* Global Error Banner */}
        {error && (
          <div className="mx-6 lg:mx-8 mt-6 bg-red-50 border border-red-200 text-red-700 text-xs p-4 rounded-xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <img src="/svg/info.svg" alt="Error" className="size-5 shrink-0" />
              <span className="font-semibold">{error}</span>
            </div>
            <button onClick={() => window.location.reload()} className="text-xs bg-red-100 px-3 py-1.5 rounded-lg hover:bg-red-200 font-bold">
              Retry
            </button>
          </div>
        )}

        {/* Body Form Layout */}
        <div className="p-6 lg:p-8 grid grid-cols-1 xl:grid-cols-12 gap-8 w-full max-w-[1400px] mx-auto">
          
          {/* Left Column: Main Form */}
          <div className="xl:col-span-8 flex flex-col gap-8">
            
            {/* Property Information */}
            <section className="bg-white border border-[#f3f4f6] rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
              <div className="flex gap-4 items-center">
                <div className="bg-[#345b79]/10 flex items-center justify-center rounded-xl size-10 shrink-0">
                  <img alt="" className="size-4.5" src="/svg/info.svg" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1f2937]">Property Information</h3>
                  <p className="text-xs text-[#6b7280]">Basic details about your property listing</p>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-extrabold tracking-wider text-[#6b7280] uppercase">Property Title</label>
                  <input 
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Elegant 5-Bedroom Villa in Jumeirah"
                    className="w-full bg-[#f9fafb] border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#345b79]"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-extrabold tracking-wider text-[#6b7280] uppercase">Description</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Describe the property in detail..."
                    className="w-full bg-[#f9fafb] border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#345b79] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-extrabold tracking-wider text-[#6b7280] uppercase">Property Type</label>
                    <select 
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full bg-[#f9fafb] border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#345b79]"
                    >
                      <option value="">Select type</option>
                      <option value="Villa">Villa</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Penthouse">Penthouse</option>
                      <option value="Townhouse">Townhouse</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-extrabold tracking-wider text-[#6b7280] uppercase">Listing Price</label>
                    <input 
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="LKR 0"
                      className="w-full bg-[#f9fafb] border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#345b79]"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Location */}
            <section className="bg-white border border-[#f3f4f6] rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
              <div className="flex gap-4 items-center">
                <div className="bg-[#345b79]/10 flex items-center justify-center rounded-xl size-10 shrink-0">
                  <img alt="" className="size-4.5" src="/svg/location-pin-icon.svg" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1f2937]">Location</h3>
                  <p className="text-xs text-[#6b7280]">Where is the property located?</p>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-extrabold tracking-wider text-[#6b7280] uppercase">Province</label>
                    <input 
                      type="text"
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      placeholder="e.g. Western"
                      className="w-full bg-[#f9fafb] border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-extrabold tracking-wider text-[#6b7280] uppercase">District</label>
                    <input 
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="e.g. Colombo"
                      className="w-full bg-[#f9fafb] border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-extrabold tracking-wider text-[#6b7280] uppercase">Location</label>
                    <input 
                      type="text"
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      placeholder="e.g. Colombo 7"
                      className="w-full bg-[#f9fafb] border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-extrabold tracking-wider text-[#6b7280] uppercase">Full Address</label>
                  <input 
                    type="text"
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                    placeholder="Street address..."
                    className="w-full bg-[#f9fafb] border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none"
                  />
                </div>
              </div>
            </section>

            {/* Property Details */}
            <section className="bg-white border border-[#f3f4f6] rounded-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
              <div className="flex gap-4 items-center">
                <div className="bg-[#345b79]/10 flex items-center justify-center rounded-xl size-10 shrink-0">
                  <img alt="" className="size-4.5" src="/svg/l-ruler-icon.svg" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1f2937]">Property Details</h3>
                  <p className="text-xs text-[#6b7280]">Specifications and measurements</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-extrabold tracking-wider text-[#6b7280] uppercase">Floor Area (SQFT)</label>
                  <input 
                    type="text"
                    value={floorArea}
                    onChange={(e) => setFloorArea(e.target.value)}
                    placeholder="e.g. 3,200"
                    className="w-full bg-[#f9fafb] border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-extrabold tracking-wider text-[#6b7280] uppercase">Land Area (SQFT)</label>
                  <input 
                    type="text"
                    value={landArea}
                    onChange={(e) => setLandArea(e.target.value)}
                    placeholder="e.g. 5,000"
                    className="w-full bg-[#f9fafb] border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-extrabold tracking-wider text-[#6b7280] uppercase">Year Built</label>
                  <input 
                    type="text"
                    value={yearBuilt}
                    onChange={(e) => setYearBuilt(e.target.value)}
                    placeholder="e.g. 2022"
                    className="w-full bg-[#f9fafb] border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800"
                  />
                </div>
              </div>
            </section>

          </div>

          {/* Right Column: Widgets */}
          <div className="xl:col-span-4 flex flex-col gap-6">
            
            {/* Widget 1: Listing Status */}
            <div className="bg-white border border-[#f3f4f6] rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <span className="text-[10px] font-extrabold tracking-wider text-[#6b7280] uppercase">Listing Status</span>
              <div className="flex flex-col gap-2">
                {[
                  { key: 'Draft', color: 'bg-gray-400' },
                  { key: 'Active', color: 'bg-blue-500' },
                  { key: 'Pending Review', color: 'bg-amber-500' },
                  { key: 'Sold', color: 'bg-emerald-500' }
                ].map(({ key, color }) => (
                  <button
                    key={key}
                    onClick={() => setStatus(key as any)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-xs font-bold text-left transition-all ${
                      status === key ? 'bg-gray-50 border-[#345b79] text-[#1f2937]' : 'border-gray-100 text-gray-600 hover:bg-gray-50/50'
                    }`}
                  >
                    <span className={`size-3 rounded-full ${color}`} />
                    <span>{key}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Widget 2: AI Smart Tags */}
            <div className="bg-white border border-[#f3f4f6] rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center gap-2 text-[#6b7280]">
                <img alt="" className="size-4 opacity-75" src="/svg/sparks-icon.svg" />
                <span className="text-[10px] font-extrabold tracking-wider uppercase">AI Smart Tags</span>
              </div>
              <p className="text-[10px] text-[#9ca3af]">Auto-generated tags help match buyers to your listing</p>
              
              <div className="flex flex-wrap gap-2">
                {aiTags.map(tag => (
                  <span key={tag} className="bg-[#be5d3f]/10 rounded-full px-3 py-1 text-[#be5d3f] text-[10px] font-bold flex items-center gap-1">
                    <img alt="" className="size-2.5" src="/svg/sparks-icon.svg" />
                    {tag}
                  </span>
                ))}
              </div>

              <button 
                onClick={regenerateTags}
                className="border border-[#be5d3f] hover:bg-[#be5d3f]/5 text-[#be5d3f] text-xs font-bold py-2.5 rounded-xl w-full flex items-center justify-center gap-2 transition-colors mt-1"
              >
                <img alt="" className="size-3" src="/svg/sparks-settings-icon.svg" />
                <span>Regenerate AI Tags</span>
              </button>
            </div>

            {/* Widget 3: Listing Visibility */}
            <div className="bg-white border border-[#f3f4f6] rounded-2xl p-6 shadow-sm flex flex-col gap-5">
              <span className="text-[10px] font-extrabold tracking-wider text-[#6b7280] uppercase">Listing Visibility</span>
              
              <div className="flex flex-col gap-4">
                {[
                  { key: 'public', label: 'Public Listing', sub: 'Visible to all users', icon: '/svg/eye.svg' },
                  { key: 'agentNetwork', label: 'Agent Network', sub: 'Share with agents', icon: '/svg/agent.svg' },
                  { key: 'featured', label: 'Featured Listing', sub: 'Promoted placement', icon: '/svg/star.svg' }
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div className="flex gap-3 items-center">
                      <div className="bg-gray-100 p-2 rounded-lg shrink-0">
                        <img alt="" className="size-4" src={item.icon} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#1f2937]">{item.label}</p>
                        <p className="text-[9px] text-[#9ca3af]">{item.sub}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setVisibility(prev => ({ ...prev, [item.key]: !(prev as any)[item.key] }))}
                      className={`relative w-10 h-5 rounded-full transition-colors ${
                        (visibility as any)[item.key] ? 'bg-[#345b79]' : 'bg-gray-200'
                      }`}
                    >
                      <div className={`absolute bg-white rounded-full size-4 top-0.5 transition-transform ${
                        (visibility as any)[item.key] ? 'translate-x-5.5' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 4: Publishing Profile */}
            <div className="bg-[#345b79] text-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <span className="text-[10px] font-bold tracking-wider text-white/60 uppercase">Publishing As</span>
              <div className="flex gap-3 items-center">
                <div className="rounded-full overflow-hidden border border-white/20 size-10">
                  <img alt="Agent Avatar" className="size-full object-cover" src={data?.agentProfile?.agentAvatarUrl || '/hero_property.png'} />
                </div>
                <div>
                  <p className="text-sm font-bold">{data?.agentProfile?.agentName || 'Khalid Al-Rashid'}</p>
                  <p className="text-[10px] text-white/60">{data?.agentProfile?.agentRole || 'Senior Agent'}</p>
                </div>
              </div>
              <div className="bg-white/10 rounded-full px-3 py-1 text-[9px] font-semibold flex items-center gap-2 self-start">
                <img alt="" className="size-2.5 filter brightness-200" src="/svg/star.svg" />
                <span>Verified NexaBuild Agent</span>
              </div>
            </div>

            {/* Widget 5: Form Completion Tracker */}
            <div className="bg-white border border-[#f3f4f6] rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <div className="flex justify-between items-center w-full">
                <span className="text-xs font-bold text-[#1f2937]">Form Completion</span>
                <span className="text-xs font-extrabold text-[#345b79]">{progress}%</span>
              </div>
              <div className="bg-gray-100 h-2 rounded-full overflow-hidden w-full">
                <div className="bg-[#345b79] h-full rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>

              <div className="flex flex-col gap-3 pt-2">
                {[
                  { key: 'info', label: 'Property Info' },
                  { key: 'location', label: 'Location' },
                  { key: 'details', label: 'Property Details' },
                  { key: 'facilities', label: 'Facilities' },
                  { key: 'images', label: 'Images' },
                  { key: 'tags', label: 'AI Tags' }
                ].map(step => (
                  <div key={step.key} className="flex gap-2.5 items-center text-xs text-[#1f2937]">
                    <img alt="" className="size-3.5" src={(steps as any)[step.key] ? '/svg/checkMark.svg' : '/svg/clock.svg'} />
                    <span className={(steps as any)[step.key] ? 'font-bold text-gray-500' : 'font-medium'}>{step.label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
