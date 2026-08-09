import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { BuyerHeaderBar } from '../../components/buyer/BuyerHeaderBar';
import { architectureApi } from '../../services/architectureApi';

export interface ArchitectureProjectDetails {
  areaSqFt?: number | string;
  bedrooms?: number | string;
  bathrooms?: number | string;
  constructionCost?: string;
  completionYear?: string | number;
  location?: string;
}

export interface HousePlanDoc {
  name: string;
  size: string;
  url?: string;
}

export interface ArchitectureProjectData {
  id?: string | number;
  projectName?: string;
  projectDescription?: string;
  category?: 'Modern' | 'Luxury' | 'Minimalist' | 'Traditional' | 'Industrial' | 'Contemporary';
  coverImage?: string;
  galleryImages?: string[];
  housePlanFile?: HousePlanDoc | null;
  renderImages?: string[];
  details?: ArchitectureProjectDetails;
  tags?: string[];
  visibility?: 'Public' | 'Private' | 'Portfolio Only';
  isDraft?: boolean;
}

export interface AddArchitectureProjectProps {
  data?: ArchitectureProjectData | null;
  isLoading?: boolean;
  error?: string | null;
  onSaveDraft?: (projectData: ArchitectureProjectData) => void;
  onPublish?: (projectData: ArchitectureProjectData) => void;
  onDelete?: (id?: string | number) => void;
  onAction?: (actionType: string, payload: any) => void;
}

export default function AddArchitectureProject({
  data = null,
  isLoading = false,
  error: propsError = null,
  onSaveDraft: _onSaveDraft,
  onPublish: _onPublish,
  onDelete,
  onAction
}: AddArchitectureProjectProps) {
  const navigate = useNavigate();

  // Form Field States (Clean initial states without dummy data)
  const [projectName, setProjectName] = useState(data?.projectName || "");
  const [projectDescription, setProjectDescription] = useState(data?.projectDescription || "");
  const [category, setCategory] = useState<string>(data?.category || "Modern");

  // Media States
  const [_coverImage] = useState<string | null>(data?.coverImage || null);
  const [_galleryImages] = useState<string[]>(data?.galleryImages || []);

  // House Plan Document
  const [housePlanFile, setHousePlanFile] = useState<HousePlanDoc | null>(
    data?.housePlanFile !== undefined ? data.housePlanFile : null
  );

  // 3D Render Image States
  const [_renderImages] = useState<string[]>(data?.renderImages || []);

  // Specs & Details (Clean initial states)
  const [area, setArea] = useState<string>(data?.details?.areaSqFt?.toString() || "");
  const [bedrooms, setBedrooms] = useState<string>(data?.details?.bedrooms?.toString() || "");
  const [bathrooms, setBathrooms] = useState<string>(data?.details?.bathrooms?.toString() || "");
  const [constructionCost, setConstructionCost] = useState<string>(data?.details?.constructionCost || "");
  const [completionYear, setCompletionYear] = useState<string>(data?.details?.completionYear?.toString() || "");
  const [locationLabel, setLocationLabel] = useState<string>(data?.details?.location || "");

  // Tags widget (Clean initial state)
  const [tags, setTags] = useState<string[]>(data?.tags || []);
  const [newTagInput, setNewTagInput] = useState("");

  // Visibility
  const [visibility, setVisibility] = useState<'Public' | 'Private' | 'Portfolio Only'>(
    data?.visibility || 'Public'
  );

  // UI State
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(propsError);

  // File Upload Handler (Simulated local file drop)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHousePlanFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      });
    }
  };

  // Dynamic progress calculation based on real filled user inputs
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const isInfoDone = !!(projectName.trim() && projectDescription.trim() && category);
    const isHousePlanDone = !!housePlanFile;
    const isDetailsDone = !!(area.trim() || bedrooms.trim() || bathrooms.trim());
    const isTagsDone = tags.length > 0 || !!visibility;

    const completedCount = [isInfoDone, isHousePlanDone, isDetailsDone, isTagsDone].filter(Boolean).length;
    setProgress(Math.round((completedCount / 4) * 100));
  }, [projectName, projectDescription, category, housePlanFile, area, bedrooms, bathrooms, tags, visibility]);

  // Action Handlers
  const handleSaveDraftAction = async () => {
    if (!projectName.trim()) {
      setFormError('Please enter a Project Title to save a draft.');
      return;
    }

    try {
      setSubmitting(true);
      setFormError(null);
      await architectureApi.createProject({
        title: projectName.trim(),
        style: category || 'Modern',
        bedrooms: bedrooms ? Number(bedrooms) : undefined,
        bathrooms: bathrooms ? Number(bathrooms) : undefined,
        sqftArea: area ? Number(area.replace(/,/g, '')) : undefined,
        locationLabel: locationLabel.trim() || undefined,
        status: 'Pending',
      });
      alert('Project draft saved to database!');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Failed to save project draft:', err);
      setFormError(err.response?.data?.message || 'Failed to save project draft to backend.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePublishAction = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!projectName.trim()) {
      setFormError('Project Title is required before publishing.');
      return;
    }

    try {
      setSubmitting(true);
      setFormError(null);
      await architectureApi.createProject({
        title: projectName.trim(),
        style: category || 'Modern',
        bedrooms: bedrooms ? Number(bedrooms) : 3,
        bathrooms: bathrooms ? Number(bathrooms) : 2,
        sqftArea: area ? Number(area.replace(/,/g, '')) : 2500,
        locationLabel: locationLabel.trim() || 'Colombo',
        status: 'Active',
      });
      alert('Architecture project published successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Failed to publish architecture project:', err);
      setFormError(err.response?.data?.message || 'Failed to publish project to backend.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAction = () => {
    if (confirm("Are you sure you want to discard this project draft?")) {
      if (onDelete) onDelete(data?.id);
      if (onAction) onAction('DELETE', { id: data?.id });
      navigate('/dashboard');
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(newTagInput.trim())) {
        setTags(prev => [...prev, newTagInput.trim()]);
      }
      setNewTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(t => t !== tagToRemove));
  };

  // Skeleton Loading State
  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-[#f8fafc] p-6 lg:p-8 animate-pulse max-w-[1400px] mx-auto space-y-8">
        <div className="h-12 bg-gray-200 rounded-lg w-1/3" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="h-64 bg-gray-200 rounded-2xl" />
            <div className="h-48 bg-gray-200 rounded-2xl" />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <div className="h-40 bg-gray-200 rounded-2xl" />
            <div className="h-64 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 p-4 sm:p-6 lg:p-8 text-[#111827] bg-[#f8fafc] min-h-screen">
      
      {/* Top Search & User Header Bar */}
      <BuyerHeaderBar searchPlaceholder="Search projects, blueprints..." />

      {/* Global Error Banner */}
      {formError && (
        <div className="w-full bg-red-50 border border-red-200 text-red-700 text-xs p-4 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <img src="/svg/info.svg" alt="Error" className="size-5 shrink-0" />
            <span className="font-semibold">{formError}</span>
          </div>
          <button onClick={() => setFormError(null)} className="text-xs bg-red-100 px-3 py-1 rounded-lg hover:bg-red-200 font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Action Header Banner */}
      <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Link to="/dashboard" className="text-xs font-extrabold text-[#345b79] hover:underline flex items-center gap-1.5 mb-1">
            <svg className="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">Add Architecture Project</h1>
          <p className="text-xs sm:text-sm text-gray-500 font-semibold">Publish house plans, 3D renders, and architectural specifications</p>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <button 
            type="button"
            onClick={handleDeleteAction}
            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-red-50 hover:text-red-600 text-gray-700 text-xs font-extrabold transition-all cursor-pointer"
          >
            Discard
          </button>
          <button 
            type="button"
            onClick={handleSaveDraftAction}
            disabled={submitting}
            className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 text-xs font-extrabold transition-all cursor-pointer disabled:opacity-50"
          >
            Save Draft
          </button>
          <button 
            type="button"
            onClick={() => handlePublishAction()}
            disabled={submitting}
            className="bg-[#345b79] hover:bg-[#2a4a63] text-white text-xs font-extrabold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
          >
            <svg className="size-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{submitting ? 'Publishing...' : 'Publish Project'}</span>
          </button>
        </div>
      </div>

      {/* Main Form Body */}
      <form onSubmit={handlePublishAction} className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        
        {/* Left Form Segment */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* 1. Project Overview */}
          <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100">
              <div className="size-10 rounded-xl bg-blue-50 text-[#345b79] flex items-center justify-center shrink-0">
                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#111827]">Project Overview</h3>
                <p className="text-xs text-gray-500 font-medium">Essential title, category, and description</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-1.5">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Villa Lumina Modern Residence"
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#345b79]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-1.5">
                  Architectural Style Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['Modern', 'Luxury', 'Minimalist', 'Traditional', 'Industrial', 'Contemporary'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all border text-center cursor-pointer ${
                        category === cat 
                          ? 'bg-[#345b79] text-white border-[#345b79] shadow-sm' 
                          : 'bg-gray-50/80 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-1.5">
                  Description & Architectural Concept
                </label>
                <textarea 
                  rows={4}
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Describe the design concept, materials, spatial arrangement, and architectural highlights..."
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#345b79]"
                />
              </div>
            </div>
          </div>

          {/* 2. Photo Gallery & Covers (Coming Soon Overlay) */}
          <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-6 text-center space-y-3">
              <div className="size-12 rounded-2xl bg-[#345b79]/10 text-[#345b79] flex items-center justify-center shadow-inner">
                <svg className="size-6 text-[#345b79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xs font-black tracking-widest uppercase bg-[#345b79] text-white px-3 py-1 rounded-full shadow-sm">
                Coming Soon
              </span>
              <p className="text-xs font-extrabold text-gray-700 max-w-sm">
                Cloud image & 3D render hosting is coming soon. Projects will automatically be published with clean design visuals!
              </p>
            </div>

            <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100 opacity-40">
              <div className="size-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#111827]">Project Photos & 3D Renders</h3>
                <p className="text-xs text-gray-500 font-medium">High-resolution architectural visuals</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 opacity-40">
              <div className="size-32 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-3 text-center bg-gray-50/50">
                <svg className="size-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-[10px] font-bold text-gray-500">Add Photo</span>
              </div>
            </div>
          </div>

          {/* 3. House Plan Blueprint Upload */}
          <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100">
              <div className="size-10 rounded-xl bg-orange-50 text-[#be5d3f] flex items-center justify-center shrink-0">
                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#111827]">House Plan / Blueprint Document</h3>
                <p className="text-xs text-gray-500 font-medium">Attach PDF drawings or floorplan documents</p>
              </div>
            </div>

            {housePlanFile ? (
              <div className="flex items-center justify-between p-4 bg-gray-50/80 rounded-2xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-orange-100 text-[#be5d3f] flex items-center justify-center font-bold text-xs">
                    PDF
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-[#111827]">{housePlanFile.name}</h4>
                    <span className="text-[10px] font-bold text-gray-400">{housePlanFile.size}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setHousePlanFile(null)}
                  className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="p-6 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center bg-gray-50/50 hover:bg-gray-100/50 cursor-pointer transition-colors">
                <input type="file" accept=".pdf,.dwg,.png,.jpg" onChange={handleFileUpload} className="hidden" />
                <svg className="size-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-xs font-bold text-gray-600 mb-1">Click to Upload Floorplan Document</span>
                <span className="text-[10px] font-semibold text-gray-400">PDF, DWG (Max 25MB)</span>
              </label>
            )}
          </div>

          {/* 4. Specifications & Technical Details */}
          <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100">
              <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0-4h.01M12 11h.01M12 7h.01" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#111827]">Technical Specifications</h3>
                <p className="text-xs text-gray-500 font-medium">Area, bedrooms, bathrooms, location, and cost</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold tracking-wider text-gray-500 uppercase">Floor Area (Sqft)</label>
                <input 
                  type="text" 
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. 3500"
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold tracking-wider text-gray-500 uppercase">Bedrooms</label>
                <input 
                  type="text" 
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  placeholder="e.g. 4"
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold tracking-wider text-gray-500 uppercase">Bathrooms</label>
                <input 
                  type="text" 
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  placeholder="e.g. 3"
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold tracking-wider text-gray-500 uppercase">Est. Construction Cost (LKR)</label>
                <input 
                  type="text" 
                  value={constructionCost}
                  onChange={(e) => setConstructionCost(e.target.value)}
                  placeholder="e.g. 25,000,000"
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold tracking-wider text-gray-500 uppercase">Location / City</label>
                <input 
                  type="text" 
                  value={locationLabel}
                  onChange={(e) => setLocationLabel(e.target.value)}
                  placeholder="e.g. Colombo 05"
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold tracking-wider text-gray-500 uppercase">Completion Year</label>
                <input 
                  type="text" 
                  value={completionYear}
                  onChange={(e) => setCompletionYear(e.target.value)}
                  placeholder="e.g. 2025"
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Segment: Widgets & Progress */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Progress Card */}
          <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Completion Progress</h3>
              <span className="text-xs font-extrabold text-[#345b79] bg-blue-50 px-2.5 py-1 rounded-full">{progress}%</span>
            </div>

            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div className="bg-[#345b79] h-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>

            <p className="text-xs text-gray-500 font-medium">
              Fill in project overview, floorplan document, and specs to complete your listing.
            </p>
          </div>

          {/* Visibility Widget */}
          <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Visibility Setting</h3>
            
            <div className="space-y-2">
              {(['Public', 'Private', 'Portfolio Only'] as const).map((vis) => (
                <button
                  key={vis}
                  type="button"
                  onClick={() => setVisibility(vis)}
                  className={`w-full p-3 rounded-xl text-xs font-extrabold text-left border transition-all cursor-pointer flex items-center justify-between ${
                    visibility === vis
                      ? 'bg-[#345b79]/10 border-[#345b79] text-[#345b79]'
                      : 'bg-gray-50/80 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>{vis}</span>
                  {visibility === vis && <span className="size-2 rounded-full bg-[#345b79]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Tags Widget */}
          <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Project Tags</h3>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="bg-blue-50 text-[#345b79] text-[10px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
                    {tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-red-500">×</button>
                  </span>
                ))}
              </div>
            )}

            <input 
              type="text" 
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Type tag and press Enter..."
              className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#345b79]"
            />
          </div>

        </div>

      </form>

    </div>
  );
}
