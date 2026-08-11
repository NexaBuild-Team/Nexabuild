import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { BuyerHeaderBar } from '../../components/buyer/BuyerHeaderBar';
import LocationPickerMap from '../../components/LocationPickerMap';
import {
  createLandApi,
  uploadPropertyImageApi,
} from '../../services/agentApi';

export interface AddNewLandFormFields {
  name?: string;
  description?: string;
  landType?: string;
  purpose?: string;
  price?: string | number;
  perches?: string | number;
  sqft?: string | number;
  province?: string;
  district?: string;
  locationName?: string;
  fullAddress?: string;
  latitude?: number | null;
  longitude?: number | null;
  features?: Record<string, boolean>;
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

export default function AddNewLand() {
  const navigate = useNavigate();

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [landType, setLandType] = useState('Residential');
  const [purpose, setPurpose] = useState('Sale');
  const [price, setPrice] = useState('');
  const [perches, setPerches] = useState('');
  const [sqft, setSqft] = useState('');

  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [locationName, setLocationName] = useState('');
  const [fullAddress, setFullAddress] = useState('');

  const [latitude, setLatitude] = useState<number | null>(6.9271);
  const [longitude, setLongitude] = useState<number | null>(79.8612);

  // Land Utilities & Features
  const [features, setFeatures] = useState<Record<string, boolean>>({
    'Electricity Available': true,
    'Tap Water Connection': true,
    '3-Phase Power': false,
    'Clear Deed / Title': true,
    'Approved Development Plan': false,
    'Wide Access Road': true,
    'Drain Line Access': false,
    'Fully Fenced / Walled': false,
  });

  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [status, setStatus] = useState<'Draft' | 'Active' | 'Pending Review' | 'Sold'>('Active');
  const [aiTags, setAiTags] = useState<string[]>([
    'ClearDeed',
    'MainRoadAccess',
    'HighROI',
    'ResidentialPlot',
    'Waterfront',
    'InvestmentReady',
  ]);

  const [visibility, setVisibility] = useState({
    public: true,
    agentNetwork: true,
    featured: false,
  });

  // Progress Bar
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const isInfoDone = !!(name && description && landType && price);
    const isLocationDone = !!(province && district && locationName && fullAddress);
    const isSpecsDone = !!(perches);
    const isFeaturesDone = Object.values(features).some((v) => v === true);
    const isImagesDone = galleryImages.length > 0 || coverImage !== null;

    let count = 0;
    if (isInfoDone) count++;
    if (isLocationDone) count++;
    if (isSpecsDone) count++;
    if (isFeaturesDone) count++;
    if (isImagesDone) count++;

    setProgress(Math.round((count / 5) * 100));
  }, [name, description, landType, price, province, district, locationName, fullAddress, perches, features, galleryImages, coverImage]);

  const toggleFeature = (key: string) => {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleRegenerateTags = () => {
    const pool = ['CommercialPotential', 'SubdividedPlots', 'NearHighway', 'FlatTerrain', 'PaddyView', 'CornerPlot', 'GatedProperty'];
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    setAiTags(shuffled.slice(0, 5));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
      alert('Land photo uploaded successfully!');
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Failed to upload land image.');
    } finally {
      setUploadingImage(false);
      event.target.value = '';
    }
  };

  const [submitting, setSubmitting] = useState(false);

  const handlePublishClick = async () => {
    if (!name || !price || !perches) {
      alert('Please fill in the required fields: Land Title, Price, and Perches.');
      return;
    }

    setSubmitting(true);
    const payload = {
      name,
      description,
      landType,
      purpose,
      price,
      perches,
      sqft: sqft || (Number(perches) * 272.25).toString(),
      province,
      district,
      locationName,
      fullAddress,
      location: `${locationName || district || 'Colombo'}, ${province || 'Western'}`,
      latitude,
      longitude,
      features,
      coverImage,
      galleryImages,
      images: galleryImages.length > 0 ? galleryImages : (coverImage ? [coverImage] : ['/property_card_1.png']),
      status,
      aiTags,
      visibility,
    };

    try {
      await createLandApi(payload);
      alert('Land listing published successfully!');
      navigate('/dashboard/agent');
    } catch (err) {
      console.error('Failed to create land listing:', err);
      alert('Failed to publish land listing. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-8 p-4 sm:p-6 lg:p-8 text-[#111827]">
      {/* Top Header Bar */}
      <BuyerHeaderBar searchPlaceholder="Search lands, plots, areas..." />

      {/* Action Header Banner */}
      <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Link to="/dashboard/agent" className="text-xs font-extrabold text-[#345b79] hover:underline flex items-center gap-1.5 mb-1">
            <svg className="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Agent Dashboard</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">Add New Land Plot</h1>
          <p className="text-xs text-gray-500 font-semibold">Create and publish a new land plot listing to the marketplace</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => alert('Land draft saved!')}
            className="border border-gray-200 hover:bg-gray-50 text-[#111827] text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
          >
            <svg className="size-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={handlePublishClick}
            disabled={submitting}
            className="bg-[#be5d3f] hover:bg-[#a64e33] disabled:opacity-50 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <svg className="size-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{submitting ? 'Publishing...' : 'Publish Land Listing'}</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-sm space-y-2">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-[#111827]">Land Listing Completion</span>
          <span className="text-[#be5d3f] font-extrabold">{progress}%</span>
        </div>
        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
          <div className="bg-[#be5d3f] h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Body Form Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 w-full">
        {/* Left Main Form Column */}
        <div className="xl:col-span-8 space-y-8">
          {/* Section 1: Land Information */}
          <section className="bg-white rounded-[24px] p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100">
              <div className="size-10 rounded-xl bg-orange-50 text-[#be5d3f] flex items-center justify-center shrink-0">
                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#111827]">Land Information</h3>
                <p className="text-xs text-gray-500 font-medium">Basic details about your land plot listing</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold tracking-wider text-gray-500 uppercase">Land Title / Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Prime 15 Perch Commercial Plot in Rajagiriya"
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#be5d3f]/20"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold tracking-wider text-gray-500 uppercase">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe the land plot, soil quality, access roads, surround developments..."
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#be5d3f]/20 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold tracking-wider text-gray-500 uppercase">Land Type</label>
                  <select
                    value={landType}
                    onChange={(e) => setLandType(e.target.value)}
                    className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#be5d3f]/20"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Agricultural">Agricultural</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Mixed-Use">Mixed-Use</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold tracking-wider text-gray-500 uppercase">Purpose</label>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#be5d3f]/20"
                  >
                    <option value="Sale">Sale</option>
                    <option value="Lease">Lease</option>
                    <option value="Joint Venture">Joint Venture</option>
                    <option value="Investment">Investment</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold tracking-wider text-gray-500 uppercase">Listing Price (LKR) *</label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 18,500,000"
                    className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#be5d3f]/20"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Location (Location Picker Map matched from screenshot design) */}
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
                <p className="text-xs text-gray-500 font-medium">Where is the land located?</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold tracking-wider text-gray-500 uppercase">PROVINCE / EMIRATE</label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#be5d3f]/20"
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
                    className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#be5d3f]/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold tracking-wider text-gray-500 uppercase">LOCATION</label>
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="e.g. Palm Jumeirah"
                    className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#be5d3f]/20"
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
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#be5d3f]/20"
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

          {/* Section 3: Land Dimensions */}
          <section className="bg-white rounded-[24px] p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100">
              <div className="size-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#111827]">Land Specs & Extent</h3>
                <p className="text-xs text-gray-500 font-medium">Perches, square feet, and plot dimensions</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold tracking-wider text-gray-500 uppercase">Extent (Perches) *</label>
                <input
                  type="text"
                  value={perches}
                  onChange={(e) => {
                    setPerches(e.target.value);
                    if (e.target.value && !isNaN(Number(e.target.value))) {
                      setSqft((Number(e.target.value) * 272.25).toFixed(0));
                    }
                  }}
                  placeholder="e.g. 15.5"
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold tracking-wider text-gray-500 uppercase">Total Area (Sqft)</label>
                <input
                  type="text"
                  value={sqft}
                  onChange={(e) => setSqft(e.target.value)}
                  placeholder="e.g. 4,220"
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Section 4: Infrastructure & Features */}
          <section className="bg-white rounded-[24px] p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100">
              <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#111827]">Infrastructure & Utilities</h3>
                <p className="text-xs text-gray-500 font-medium">Select available land facilities</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.keys(features).map((key) => {
                const checked = features[key];
                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => toggleFeature(key)}
                    className={`p-3 rounded-xl text-xs font-extrabold flex items-center justify-between border transition-all cursor-pointer ${
                      checked
                        ? 'bg-[#be5d3f]/10 border-[#be5d3f] text-[#be5d3f]'
                        : 'bg-gray-50/80 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>{key}</span>
                    <span className={`size-4 rounded-full flex items-center justify-center text-[10px] ${checked ? 'bg-[#be5d3f] text-white' : 'bg-gray-200'}`}>
                      {checked ? '✓' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Section 5: Photos Upload */}
          <section className="bg-white rounded-[24px] p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100">
              <div className="size-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#111827]">Land Photos & Site Plan</h3>
                <p className="text-xs text-gray-500 font-medium">Upload site photos or survey plan images</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {galleryImages.map((image, index) => (
                <div key={image} className="relative size-32 rounded-2xl overflow-hidden border border-gray-200">
                  <img src={image} alt={`Land ${index + 1}`} className="w-full h-full object-cover" />
                  {index === 0 && <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-2 py-1 rounded-lg">Cover</span>}
                  <button
                    type="button"
                    onClick={() => {
                      setGalleryImages((prev) => prev.filter((_, i) => i !== index));
                      if (image === coverImage) setCoverImage(null);
                    }}
                    className="absolute top-1 right-1 size-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}

              <label className="size-32 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-3 text-center bg-gray-50/50 hover:bg-gray-100 cursor-pointer transition-colors">
                <svg className="size-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-[10px] font-bold text-gray-500">{uploadingImage ? 'Uploading...' : 'Add Photo'}</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} className="hidden" />
              </label>
            </div>
          </section>
        </div>

        {/* Right Sidebar Column */}
        <div className="xl:col-span-4 space-y-8">
          {/* Widget 1: Listing Status */}
          <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Listing Status</h3>
            <div className="space-y-2">
              {(['Draft', 'Active', 'Pending Review', 'Sold'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatus(st)}
                  className={`w-full p-3 rounded-xl text-xs font-extrabold flex items-center gap-3 border transition-all cursor-pointer ${
                    status === st ? 'bg-[#be5d3f]/10 border-[#be5d3f] text-[#be5d3f]' : 'bg-gray-50/80 border-gray-100 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className={`size-2.5 rounded-full ${st === 'Active' ? 'bg-emerald-500' : st === 'Pending Review' ? 'bg-amber-500' : st === 'Sold' ? 'bg-rose-500' : 'bg-gray-400'}`} />
                  <span>{st}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Widget 2: AI Smart Tags */}
          <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">AI Smart Tags</h3>
              <button type="button" onClick={handleRegenerateTags} className="text-[10px] font-extrabold text-[#be5d3f] hover:underline">
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
                  <p className="text-[10px] text-gray-500 font-medium">Visible to land buyers</p>
                </div>
                <input
                  type="checkbox"
                  checked={visibility.public}
                  onChange={(e) => setVisibility((prev) => ({ ...prev, public: e.target.checked }))}
                  className="size-4 accent-[#be5d3f] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-extrabold text-[#111827]">Agent Network</h4>
                  <p className="text-[10px] text-gray-500 font-medium">Share with verified agents</p>
                </div>
                <input
                  type="checkbox"
                  checked={visibility.agentNetwork}
                  onChange={(e) => setVisibility((prev) => ({ ...prev, agentNetwork: e.target.checked }))}
                  className="size-4 accent-[#be5d3f] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-extrabold text-[#111827]">Featured Listing</h4>
                  <p className="text-[10px] text-gray-500 font-medium">Highlight on land homepage</p>
                </div>
                <input
                  type="checkbox"
                  checked={visibility.featured}
                  onChange={(e) => setVisibility((prev) => ({ ...prev, featured: e.target.checked }))}
                  className="size-4 accent-[#be5d3f] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
