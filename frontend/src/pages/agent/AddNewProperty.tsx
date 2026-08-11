import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { BuyerHeaderBar } from '../../components/buyer/BuyerHeaderBar';
import LocationPickerMap from '../../components/LocationPickerMap';
import {
  createPropertyApi,
  uploadPropertyImageApi,
} from '../../services/agentApi';
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
  latitude?: number | null;
  longitude?: number | null;
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
  // Form State initialized with backend data or fallbacks
  const [title, setTitle] = useState(data?.initialFields?.title || '');
  const [description, setDescription] = useState(data?.initialFields?.description || '');
  const [propertyType, setPropertyType] = useState(data?.initialFields?.propertyType || '');
  const [price, setPrice] = useState(data?.initialFields?.price ? String(data.initialFields.price) : '');

  const [province, setProvince] = useState(data?.initialFields?.province || '');
  const [district, setDistrict] = useState(data?.initialFields?.district || '');
  const [locationName, setLocationName] = useState(data?.initialFields?.locationName || '');
  const [fullAddress, setFullAddress] = useState(data?.initialFields?.fullAddress || '');

  const [latitude, setLatitude] = useState<number | null>(data?.initialFields?.latitude ?? 6.9271);
  const [longitude, setLongitude] = useState<number | null>(data?.initialFields?.longitude ?? 79.8612);

  const [beds, setBeds] = useState(data?.initialFields?.beds ?? 0);
  const [baths, setBaths] = useState(data?.initialFields?.baths ?? 0);
  const [garage, setGarage] = useState(data?.initialFields?.garage ?? 0);
  const [floorArea, setFloorArea] = useState(data?.initialFields?.floorArea ? String(data.initialFields.floorArea) : '');
  const [landArea, setLandArea] = useState(data?.initialFields?.landArea ? String(data.initialFields.landArea) : '');
  const [yearBuilt, setYearBuilt] = useState(data?.initialFields?.yearBuilt ? String(data.initialFields.yearBuilt) : '');

  // Amenities
  const [amenities, setAmenities] = useState<Record<string, boolean>>(
    data?.initialFields?.amenities || {
      'Swimming Pool': false,
      'Garden': false,
      'Parking': false,
      'Solar Panels': false,
      'Security': false,
      'Gym': false,
      'Smart Home': false,
      'Air Conditioning': false
    }
  );
const [coverImage, setCoverImage] = useState<string | null>(
  data?.initialFields?.coverImage ?? null
);

const [galleryImages, setGalleryImages] = useState<string[]>(
  data?.initialFields?.galleryImages || []
);

const [uploadingImage, setUploadingImage] = useState(false);

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

  useEffect(() => {
    const isInfoDone = !!(title && description && propertyType && price);
    const isLocationDone = !!(province && district && locationName && fullAddress);
    const isDetailsDone = !!(beds > 0 && baths > 0 && floorArea && landArea && yearBuilt);
    const isFacilitiesDone = Object.values(amenities).some(val => val === true);
    const isImagesDone = true;
    const isTagsDone = aiTags.length > 0;

    let completedCount = 0;
    if (isInfoDone) completedCount++;
    if (isLocationDone) completedCount++;
    if (isDetailsDone) completedCount++;
    if (isFacilitiesDone) completedCount++;
    if (isImagesDone) completedCount++;
    if (isTagsDone) completedCount++;

    setProgress(Math.round((completedCount / 6) * 100));
  }, [title, description, propertyType, price, province, district, locationName, fullAddress, beds, baths, floorArea, landArea, yearBuilt, amenities, aiTags]);

  const toggleAmenity = (key: string) => {
    setAmenities(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleRegenerateTags = () => {
    const pool = ['Waterfront', 'Gated Community', 'Eco-Friendly', 'High ROI', 'Penthouse', 'Modern Architecture', 'Balcony', 'Private Gym'];
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    setAiTags(shuffled.slice(0, 5));
  };

  const handleImageUpload = async (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const file = event.target.files?.[0];

  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert('Please select an image file.');
    return;
  }

  setUploadingImage(true);

  try {
    const result = await uploadPropertyImageApi(file);

    setGalleryImages((prev) => [...prev, result.url]);

    if (!coverImage) {
      setCoverImage(result.url);
    }

    alert('Image uploaded successfully!');
  } catch (error) {
    console.error('Image upload failed:', error);
    alert('Failed to upload image.');
  } finally {
    setUploadingImage(false);
    event.target.value = '';
  }
};

  const constructPayload = (): AddNewPropertyFormFields & { images?: string[] } => ({
    title,
    description,
    propertyType,
    price,
    province,
    district,
    locationName,
    fullAddress,
    latitude,
    longitude,
    beds,
    baths,
    garage,
    floorArea,
    landArea,
    yearBuilt,
    amenities,
    coverImage,
    galleryImages,
    images: galleryImages.length > 0 ? galleryImages : (coverImage ? [coverImage] : ['/hero_property.png']),
    status,
    aiTags,
    visibility
  });

  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handlePublishClick = async () => {
    if (onPublish) {
      onPublish(constructPayload());
    } else {
      setSubmitting(true);
      try {
        await createPropertyApi(constructPayload());
        alert('Listing published successfully!');
        navigate('/dashboard');
      } catch (err) {
        console.error('Failed to create property listing:', err);
        alert('Failed to publish listing. Please try again.');
      } finally {
        setSubmitting(false);
      }
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

  // ─── Skeleton Loading State ─────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="w-full space-y-6 p-4 sm:p-6 lg:p-8 animate-pulse max-w-[1400px] mx-auto">
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
    <div className="w-full space-y-8 p-4 sm:p-6 lg:p-8 text-[#111827]">
      
      {/* Top Search & User Header Bar */}
      <BuyerHeaderBar searchPlaceholder="Search properties, areas..." />

      {/* Action Header Banner */}
      <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Link to="/dashboard" className="text-xs font-extrabold text-[#345b79] hover:underline flex items-center gap-1.5 mb-1">
            <svg className="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">Add New Property</h1>
          <p className="text-xs text-gray-500 font-semibold">Create and publish a new property listing to the marketplace</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={handleSaveDraftClick}
            className="border border-gray-200 hover:bg-gray-50 text-[#111827] text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
          >
            <svg className="size-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span>Save Draft</span>
          </button>

          <button 
            onClick={handleDeleteClick}
            className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
          >
            <svg className="size-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Delete</span>
          </button>

          <button 
            onClick={handlePublishClick}
            disabled={submitting}
            className="bg-[#345b79] hover:bg-[#2a4a63] disabled:opacity-50 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <svg className="size-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{submitting ? 'Publishing...' : 'Publish Listing'}</span>
          </button>
        </div>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="w-full bg-red-50 border border-red-200 text-red-700 text-xs p-4 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <img src="/svg/info.svg" alt="Error" className="size-5 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
          <button onClick={() => window.location.reload()} className="text-xs bg-red-100 px-3 py-1.5 rounded-lg hover:bg-red-200 font-bold">
            Retry
          </button>
        </div>
      )}

      {/* Progress Bar */}
      <div className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-sm space-y-2">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-[#111827]">Listing Completion Progress</span>
          <span className="text-[#345b79] font-extrabold">{progress}%</span>
        </div>
        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
          <div className="bg-[#345b79] h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Body Form Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 w-full">
        
        {/* Left Main Form Column */}
        <div className="xl:col-span-8 space-y-8">
          
          {/* Section 1: Property Information */}
          <section className="bg-white rounded-[24px] p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100">
              <div className="size-10 rounded-xl bg-blue-50 text-[#345b79] flex items-center justify-center shrink-0">
                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#111827]">Property Information</h3>
                <p className="text-xs text-gray-500 font-medium">Basic details about your property listing</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold tracking-wider text-gray-500 uppercase">Property Title</label>
                <input 
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Elegant 5-Bedroom Villa in Jumeirah"
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#345b79]/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold tracking-wider text-gray-500 uppercase">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe the property in detail..."
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#345b79]/20 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold tracking-wider text-gray-500 uppercase">Property Type</label>
                  <select 
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#345b79]/20"
                  >
                    <option value="">Select type</option>
                    <option value="Villa">Villa</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold tracking-wider text-gray-500 uppercase">Listing Price (LKR)</label>
                  <input 
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 35,000,000"
                    className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#345b79]/20"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Location */}
          <section className="bg-white rounded-[24px] p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100">
              <div className="size-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#111827]">Location</h3>
                <p className="text-xs text-gray-500 font-medium">Where is the property located?</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold tracking-wider text-gray-500 uppercase">PROVINCE / EMIRATE</label>
                  <select 
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#345b79]/20"
                  >
                    <option value="">Select Province</option>
                    <option value="Western Province">Western Province</option>
                    <option value="Central Province">Central Province</option>
                    <option value="Southern Province">Southern Province</option>
                    <option value="North Western Province">North Western Province</option>
                    <option value="Sabaragamuwa Province">Sabaragamuwa Province</option>
                    <option value="North Central Province">North Central Province</option>
                    <option value="Uva Province">Uva Province</option>
                    <option value="Northern Province">Northern Province</option>
                    <option value="Eastern Province">Eastern Province</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold tracking-wider text-gray-500 uppercase">DISTRICT / AREA</label>
                  <input 
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. Jumeirah, JVC"
                    className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#345b79]/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold tracking-wider text-gray-500 uppercase">LOCATION</label>
                  <input 
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="e.g. Palm Jumeirah"
                    className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#345b79]/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold tracking-wider text-gray-500 uppercase">FULL ADDRESS</label>
                <input 
                  type="text"
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder="Street address, building name, floor..."
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#345b79]/20"
                />
              </div>

              {/* Interactive Location Map Picker */}
              <div className="pt-2">
                <LocationPickerMap 
                  latitude={latitude}
                  longitude={longitude}
                  onLocationSelect={(lat, lng) => {
                    setLatitude(lat);
                    setLongitude(lng);
                  }}
                />
              </div>
            </div>
          </section>

          {/* Section 3: Details & Dimensions */}
          <section className="bg-white rounded-[24px] p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100">
              <div className="size-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#111827]">Property Specs</h3>
                <p className="text-xs text-gray-500 font-medium">Beds, baths, dimensions, and age</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold tracking-wider text-gray-500 uppercase">Bedrooms</label>
                <input 
                  type="number"
                  value={beds}
                  onChange={(e) => setBeds(Number(e.target.value))}
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold tracking-wider text-gray-500 uppercase">Bathrooms</label>
                <input 
                  type="number"
                  value={baths}
                  onChange={(e) => setBaths(Number(e.target.value))}
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold tracking-wider text-gray-500 uppercase">Garage Spaces</label>
                <input 
                  type="number"
                  value={garage}
                  onChange={(e) => setGarage(Number(e.target.value))}
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold tracking-wider text-gray-500 uppercase">Floor Area (Sqft)</label>
                <input 
                  type="text"
                  value={floorArea}
                  onChange={(e) => setFloorArea(e.target.value)}
                  placeholder="e.g. 3,200"
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold tracking-wider text-gray-500 uppercase">Land Area (Perches)</label>
                <input 
                  type="text"
                  value={landArea}
                  onChange={(e) => setLandArea(e.target.value)}
                  placeholder="e.g. 15"
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold tracking-wider text-gray-500 uppercase">Year Built</label>
                <input 
                  type="text"
                  value={yearBuilt}
                  onChange={(e) => setYearBuilt(e.target.value)}
                  placeholder="e.g. 2023"
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Section 4: Features & Amenities */}
          <section className="bg-white rounded-[24px] p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100">
              <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#111827]">Amenities & Features</h3>
                <p className="text-xs text-gray-500 font-medium">Select available facilities</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.keys(amenities).map((key) => {
                const checked = amenities[key];
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => toggleAmenity(key)}
                    className={`p-3 rounded-xl text-xs font-extrabold flex items-center justify-between border transition-all cursor-pointer ${
                      checked
                        ? 'bg-[#345b79]/10 border-[#345b79] text-[#345b79]'
                        : 'bg-gray-50/80 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>{key}</span>
                    <span className={`size-4 rounded-full flex items-center justify-center text-[10px] ${checked ? 'bg-[#345b79] text-white' : 'bg-gray-200'}`}>
                      {checked ? '✓' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Section 5: Gallery Upload */}
<section className="bg-white rounded-[24px] p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
  <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100">
    <div className="size-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
      <svg
        className="size-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>

    <div>
      <h3 className="text-base font-extrabold text-[#111827]">
        Property Photos
      </h3>
      <p className="text-xs text-gray-500 font-medium">
        Upload high-resolution images
      </p>
    </div>
  </div>

  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
    {galleryImages.map((image, index) => (
      <div
        key={image}
        className="relative size-32 rounded-2xl overflow-hidden border border-gray-200"
      >
        <img
          src={image}
          alt={`Property ${index + 1}`}
          className="w-full h-full object-cover"
        />

        {index === 0 && (
          <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-2 py-1 rounded-lg">
            Cover
          </span>
        )}

        <button
          type="button"
          onClick={() => {
            setGalleryImages((prev) =>
              prev.filter((_, i) => i !== index)
            );

            if (image === coverImage) {
              setCoverImage(null);
            }
          }}
          className="absolute top-1 right-1 size-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
        >
          ×
        </button>
      </div>
    ))}

    <label className="size-32 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-3 text-center bg-gray-50/50 hover:bg-gray-100 cursor-pointer transition-colors">
      <svg
        className="size-6 text-gray-400 mb-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 4v16m8-8H4"
        />
      </svg>

      <span className="text-[10px] font-bold text-gray-500">
        {uploadingImage ? 'Uploading...' : 'Add Photo'}
      </span>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={uploadingImage}
        className="hidden"
      />
    </label>
  </div>
</section>

        </div>

        {/* Right Column: Settings & AI Widgets */}
        <div className="xl:col-span-4 space-y-8">
          
          {/* Widget 1: Listing Status */}
          <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Listing Status</h3>
            <div className="space-y-2">
              {(['Draft', 'Active', 'Pending Review', 'Sold'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatus(st)}
                  className={`w-full p-3 rounded-xl text-xs font-extrabold flex items-center gap-3 border transition-all cursor-pointer ${
                    status === st
                      ? 'bg-[#345b79]/10 border-[#345b79] text-[#345b79]'
                      : 'bg-gray-50/80 border-gray-100 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className={`size-2.5 rounded-full ${
                    st === 'Active' ? 'bg-emerald-500' : st === 'Pending Review' ? 'bg-amber-500' : st === 'Sold' ? 'bg-rose-500' : 'bg-gray-400'
                  }`} />
                  <span>{st}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Widget 2: AI Smart Tags */}
          <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">AI Smart Tags</h3>
              <button onClick={handleRegenerateTags} className="text-[10px] font-extrabold text-[#345b79] hover:underline">
                Regenerate
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {aiTags.map((tag, i) => (
                <span key={i} className="text-[11px] font-extrabold bg-[#be5d3f]/10 text-[#be5d3f] px-3 py-1 rounded-lg">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Widget 3: Listing Visibility */}
          <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Listing Visibility</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-extrabold text-[#111827]">Public Marketplace</h4>
                  <p className="text-[10px] text-gray-500 font-medium">Visible to all buyers</p>
                </div>
                <input
                  type="checkbox"
                  checked={visibility.public}
                  onChange={(e) => setVisibility(prev => ({ ...prev, public: e.target.checked }))}
                  className="size-4 accent-[#345b79] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-extrabold text-[#111827]">Agent Network</h4>
                  <p className="text-[10px] text-gray-500 font-medium">Share with verified partner agents</p>
                </div>
                <input
                  type="checkbox"
                  checked={visibility.agentNetwork}
                  onChange={(e) => setVisibility(prev => ({ ...prev, agentNetwork: e.target.checked }))}
                  className="size-4 accent-[#345b79] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-extrabold text-[#111827]">Featured Listing</h4>
                  <p className="text-[10px] text-gray-500 font-medium">Promote on homepage AI highlights</p>
                </div>
                <input
                  type="checkbox"
                  checked={visibility.featured}
                  onChange={(e) => setVisibility(prev => ({ ...prev, featured: e.target.checked }))}
                  className="size-4 accent-[#345b79] cursor-pointer"
                />
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
