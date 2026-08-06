import React, { useState, useEffect } from 'react';

// ─── 1. Comprehensive Backend Interfaces ───────────────────────────────────

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

// ─── Main Component ─────────────────────────────────────────────────────────

export default function AddArchitectureProject({
  data = null,
  isLoading = false,
  error = null,
  onSaveDraft,
  onPublish,
  onDelete,
  onAction
}: AddArchitectureProjectProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Form Field States (initialized with injectable data)
  const [projectName, setProjectName] = useState(data?.projectName || "");
  const [projectDescription, setProjectDescription] = useState(data?.projectDescription || "");
  const [category, setCategory] = useState<string>(data?.category || "Modern");

  // Uploaded Media States
  const [coverImage, setCoverImage] = useState<string | null>(data?.coverImage || null);
  const [galleryImages, setGalleryImages] = useState<string[]>(
    data?.galleryImages || ["/property_card_1.png", "/property_card_2.png", "/property_card_3.png"]
  );

  // House Plan Document
  const [housePlanFile, setHousePlanFile] = useState<HousePlanDoc | null>(
    data?.housePlanFile !== undefined ? data.housePlanFile : { name: "Villa_Floorplan_V2.pdf", size: "4.2 MB" }
  );

  // 3D Render Image States
  const [renderImages, setRenderImages] = useState<string[]>(
    data?.renderImages || ["/hero_property.png", "/property_card_4.png"]
  );

  // Specs & Details
  const [area, setArea] = useState<string>(data?.details?.areaSqFt?.toString() || "4,850");
  const [bedrooms, setBedrooms] = useState<string>(data?.details?.bedrooms?.toString() || "5");
  const [bathrooms, setBathrooms] = useState<string>(data?.details?.bathrooms?.toString() || "6");
  const [constructionCost, setConstructionCost] = useState<string>(data?.details?.constructionCost || "$1,200,000");
  const [completionYear, setCompletionYear] = useState<string>(data?.details?.completionYear?.toString() || "2025");

  // Tags widget
  const [tags, setTags] = useState<string[]>(
    data?.tags || ["Residential", "Luxury", "Smart Home", "Sustainable", "Modern"]
  );
  const [newTagInput, setNewTagInput] = useState("");

  // Visibility
  const [visibility, setVisibility] = useState<'Public' | 'Private' | 'Portfolio Only'>(
    data?.visibility || 'Public'
  );

  // Sync state if backend data updates
  useEffect(() => {
    if (data) {
      if (data.projectName !== undefined) setProjectName(data.projectName);
      if (data.projectDescription !== undefined) setProjectDescription(data.projectDescription);
      if (data.category !== undefined) setCategory(data.category);
      if (data.coverImage !== undefined) setCoverImage(data.coverImage);
      if (data.galleryImages !== undefined) setGalleryImages(data.galleryImages);
      if (data.housePlanFile !== undefined) setHousePlanFile(data.housePlanFile);
      if (data.renderImages !== undefined) setRenderImages(data.renderImages);
      if (data.details) {
        if (data.details.areaSqFt !== undefined) setArea(data.details.areaSqFt.toString());
        if (data.details.bedrooms !== undefined) setBedrooms(data.details.bedrooms.toString());
        if (data.details.bathrooms !== undefined) setBathrooms(data.details.bathrooms.toString());
        if (data.details.constructionCost !== undefined) setConstructionCost(data.details.constructionCost);
        if (data.details.completionYear !== undefined) setCompletionYear(data.details.completionYear.toString());
      }
      if (data.tags !== undefined) setTags(data.tags);
      if (data.visibility !== undefined) setVisibility(data.visibility);
    }
  }, [data]);

  // Dynamic progress tracker calculation
  const [progress, setProgress] = useState(0);
  const [steps, setSteps] = useState({
    info: false,
    images: false,
    housePlan: false,
    renders: false,
    details: false
  });

  useEffect(() => {
    const isInfoDone = !!(projectName && projectDescription && category);
    const isImagesDone = !!(coverImage || galleryImages.length > 0);
    const isHousePlanDone = !!housePlanFile;
    const isRendersDone = renderImages.length > 0;
    const isDetailsDone = !!(area && bedrooms && bathrooms && constructionCost && completionYear);

    setSteps({
      info: isInfoDone,
      images: isImagesDone,
      housePlan: isHousePlanDone,
      renders: isRendersDone,
      details: isDetailsDone
    });

    const completedCount = [isInfoDone, isImagesDone, isHousePlanDone, isRendersDone, isDetailsDone].filter(Boolean).length;
    setProgress(Math.round((completedCount / 5) * 100));
  }, [projectName, projectDescription, category, coverImage, galleryImages, housePlanFile, renderImages, area, bedrooms, bathrooms, constructionCost, completionYear]);

  // Action Handlers
  const handleSaveDraftAction = () => {
    const payload: ArchitectureProjectData = {
      id: data?.id,
      projectName,
      projectDescription,
      category: category as any,
      coverImage: coverImage || undefined,
      galleryImages,
      housePlanFile,
      renderImages,
      details: {
        areaSqFt: area,
        bedrooms,
        bathrooms,
        constructionCost,
        completionYear
      },
      tags,
      visibility,
      isDraft: true
    };
    if (onSaveDraft) onSaveDraft(payload);
    if (onAction) onAction('SAVE_DRAFT', payload);
  };

  const handlePublishAction = () => {
    const payload: ArchitectureProjectData = {
      id: data?.id,
      projectName,
      projectDescription,
      category: category as any,
      coverImage: coverImage || undefined,
      galleryImages,
      housePlanFile,
      renderImages,
      details: {
        areaSqFt: area,
        bedrooms,
        bathrooms,
        constructionCost,
        completionYear
      },
      tags,
      visibility,
      isDraft: false
    };
    if (onPublish) onPublish(payload);
    if (onAction) onAction('PUBLISH', payload);
  };

  const handleDeleteAction = () => {
    if (confirm("Are you sure you want to delete this project draft?")) {
      if (onDelete) onDelete(data?.id);
      if (onAction) onAction('DELETE', { id: data?.id });
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

  // ─── 2. Skeleton Loading State ─────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#f8fafc] flex flex-row animate-pulse">
        {/* Sidebar Skeleton */}
        <div className="hidden lg:flex w-[260px] bg-[#345b79]/40 flex-col p-6 gap-6">
          <div className="h-10 bg-white/20 rounded-lg w-3/4" />
          <div className="flex flex-col gap-4 mt-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-8 bg-white/10 rounded-md w-full" />
            ))}
          </div>
        </div>
        {/* Main Content Skeleton */}
        <div className="flex-1 p-8 max-w-[1400px] mx-auto space-y-8">
          <div className="h-12 bg-gray-200 rounded-lg w-1/3" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <div className="h-64 bg-gray-200 rounded-2xl" />
              <div className="h-48 bg-gray-200 rounded-2xl" />
              <div className="h-48 bg-gray-200 rounded-2xl" />
            </div>
            <div className="lg:col-span-4 space-y-6">
              <div className="h-40 bg-gray-200 rounded-2xl" />
              <div className="h-64 bg-gray-200 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen w-full relative flex flex-row items-start font-normal text-[#1d1d1d] overflow-x-hidden"
      style={{ backgroundImage: "linear-gradient(90deg, rgb(230, 224, 212) 0%, rgb(230, 224, 212) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }}
    >
      
      {/* ─── Sidebar Navigation ────────────────────────────────────────────── */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-[260px] bg-[#345b79] flex flex-col justify-between pt-[76px] pb-[24px] px-[16px] transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="absolute top-[11px] left-0 right-0 px-[24px] flex items-center gap-[12px] h-[52px]">
          <div className="bg-white/10 flex items-center justify-center rounded-[8px] size-[40px] shrink-0">
            <img alt="NexaBuild" className="size-[20px] object-contain" src="/src/assets/logo.png" />
          </div>
          <div>
            <h1 className="text-[20px] font-extrabold text-white leading-[25px]">NexaBuild</h1>
            <p className="text-[10px] text-white/50 tracking-[1px] uppercase leading-[15px]">Architecture Studio</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-grow flex flex-col justify-between overflow-y-auto mt-[20px]">
          <nav className="flex flex-col gap-[4px] w-full">
            <a 
              href="/architecture-dashboard" 
              className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] text-white/70 hover:bg-white/5 hover:text-white transition-all text-[15px]"
            >
              <img alt="Dashboard" className="size-[18px]" src="/svg/home.svg" />
              <span>Dashboard</span>
            </a>
            <a 
              href="#" 
              className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] text-white/70 hover:bg-white/5 hover:text-white transition-all text-[15px]"
            >
              <img alt="Portfolio" className="size-[20px] filter brightness-200" src="/svg/architect.svg" />
              <span>Portfolio</span>
            </a>
            <a 
              href="#" 
              className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] bg-[#3d4d5e] text-white font-semibold text-[15px]"
            >
              <img alt="Projects" className="size-[18px] filter brightness-200" src="/svg/construction.svg" />
              <span>Projects</span>
            </a>
            <a 
              href="#" 
              className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] text-white/70 hover:bg-white/5 hover:text-white transition-all text-[15px]"
            >
              <img alt="House Plans" className="size-[18px] filter brightness-200" src="/svg/architect.svg" />
              <span>House Plans</span>
            </a>
            <a 
              href="#" 
              className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] text-white/70 hover:bg-white/5 hover:text-white transition-all text-[15px]"
            >
              <img alt="3D Designs" className="size-[18px] filter brightness-200" src="/svg/sparks-icon.svg" />
              <span>3D Designs</span>
            </a>
            <a 
              href="#" 
              className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] text-white/70 hover:bg-white/5 hover:text-white transition-all text-[15px]"
            >
              <img alt="Testimonials" className="size-[18px] filter brightness-200" src="/svg/agent.svg" />
              <span>Testimonials</span>
            </a>
          </nav>

          <div className="flex flex-col gap-[8px]">
            <a 
              href="#" 
              className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] text-white/70 hover:bg-white/5 hover:text-white transition-all text-[15px]"
            >
              <img alt="Profile" className="size-[18px] filter brightness-200" src="/svg/agent.svg" />
              <span>Profile</span>
            </a>
            <a 
              href="#" 
              className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] text-white/70 hover:bg-white/5 hover:text-white transition-all text-[15px]"
            >
              <img alt="Settings" className="size-[18px] filter brightness-200" src="/svg/sparks-settings-icon.svg" />
              <span>Settings</span>
            </a>
            <a 
              href="/auth/login" 
              className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] text-white/70 hover:bg-white/5 hover:text-white transition-all text-[15px]"
            >
              <img alt="Logout" className="size-[18px] filter brightness-200" src="/svg/sign-in.svg" />
              <span>Logout</span>
            </a>

            <div className="bg-white/5 rounded-[16px] p-[12px] flex items-center gap-[12px] mt-[12px]">
              <div className="bg-[#345b79] rounded-full size-[40px] flex items-center justify-center font-bold text-white shrink-0">
                AR
              </div>
              <div className="min-w-0">
                <p className="text-[14px] font-bold text-white truncate leading-[20px]">Arch. Firm Pro</p>
                <p className="text-[10px] text-white/40 leading-[15px]">Verified Studio</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/45 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── Main Content Area ────────────────────────────────────────────── */}
      <main className="flex-1 lg:pl-[260px] min-w-0 flex flex-col pt-[32px] pb-[60px] px-[16px] sm:px-[24px] lg:px-[32px] gap-[32px] max-w-[1400px] w-full mx-auto">
        
        {/* Error Banner State */}
        {error && (
          <div className="w-full bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <img src="/svg/info.svg" alt="Error" className="size-5 filter drop-shadow" />
              <span className="text-sm font-medium">{error}</span>
            </div>
            <button onClick={() => window.location.reload()} className="text-xs bg-red-100 px-3 py-1.5 rounded-lg hover:bg-red-200 font-semibold">
              Retry
            </button>
          </div>
        )}

        {/* Top Action Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
          <div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none"
                aria-label="Open menu drawer"
              >
                <svg className="size-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h2 className="text-[28px] font-bold text-[#1a1c1e] tracking-tight">
                Add Architecture Project
              </h2>
            </div>
            <p className="text-[14px] text-[#42474d] mt-1">
              Publish house plans, 3D renders, and architectural specifications
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={handleDeleteAction}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-gray-700 text-sm font-bold transition-all flex items-center gap-2"
              title="Delete Project Draft"
            >
              <img src="/svg/clock.svg" alt="" className="size-4" />
              <span>Discard</span>
            </button>
            <button 
              onClick={handleSaveDraftAction}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 text-sm font-bold transition-all flex items-center gap-2"
            >
              <img src="/svg/bookmark.svg" alt="" className="size-4" />
              <span>Save Draft</span>
            </button>
            <button 
              onClick={handlePublishAction}
              className="px-5 py-2.5 rounded-xl bg-[#194360] hover:bg-[#194360]/90 text-white text-sm font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <img src="/svg/checkMark.svg" alt="" className="size-4" />
              <span>Publish Project</span>
            </button>
          </div>
        </header>

        {/* Content Section Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
          
          {/* Left Main Form Segment */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* 1. Project Basic Information */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="bg-[#194360]/10 p-2.5 rounded-xl">
                  <img src="/svg/info.svg" alt="" className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1a1c1e]">Project Overview</h3>
                  <p className="text-xs text-gray-500">Essential title, category and architectural description</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Project Title <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g. Modern Villa Zenith - Jumeirah"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#194360] focus:ring-2 focus:ring-[#194360]/10 outline-none text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Architectural Style Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {['Modern', 'Luxury', 'Minimalist', 'Traditional', 'Industrial', 'Contemporary'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border text-center ${
                          category === cat 
                            ? 'bg-[#194360] text-white border-[#194360] shadow-sm' 
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Description & Architectural Concept
                  </label>
                  <textarea 
                    rows={4}
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Describe the architectural concept, materials used, design philosophy, spatial planning..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#194360] focus:ring-2 focus:ring-[#194360]/10 outline-none text-sm transition-all"
                  />
                </div>
              </div>
            </div>

            {/* 2. Photo Gallery & Covers */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="bg-[#be5d3f]/10 p-2.5 rounded-xl">
                  <img src="/svg/eye.svg" alt="" className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1a1c1e]">Photo Gallery & High-Res Shots</h3>
                  <p className="text-xs text-gray-500">Add exterior and interior photography</p>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-gray-200 hover:border-[#194360] bg-gray-50 hover:bg-white rounded-2xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 group">
                <div className="bg-[#194360]/10 p-4 rounded-full group-hover:scale-105 transition-transform">
                  <img src="/svg/arrow-send.svg" alt="" className="size-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Click to upload or drag & drop</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 10MB each</p>
                </div>
              </div>

              {/* Existing Gallery Preview */}
              {galleryImages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {galleryImages.map((imgUrl, idx) => (
                    <div key={idx} className="group relative rounded-xl overflow-hidden h-32 bg-gray-100 border border-gray-200">
                      <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="size-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <button 
                        onClick={() => setGalleryImages(prev => prev.filter((_, i) => i !== idx))}
                        className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove Image"
                      >
                        <img src="/svg/check.svg" alt="Delete" className="size-3 filter invert" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-gray-400 text-center py-4 italic">No gallery photos added yet</div>
              )}
            </div>

            {/* 3. House Plans & Blueprints */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="bg-[#928d64]/10 p-2.5 rounded-xl">
                  <img src="/svg/architect.svg" alt="" className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1a1c1e]">House Plans & Floorplan Documents</h3>
                  <p className="text-xs text-gray-500">Upload PDF blueprints or CAD design files</p>
                </div>
              </div>

              {housePlanFile ? (
                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#194360] text-white font-bold text-xs p-2.5 rounded-lg">
                      PDF
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{housePlanFile.name}</p>
                      <p className="text-xs text-gray-400">{housePlanFile.size}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setHousePlanFile(null)}
                    className="text-xs text-red-600 hover:text-red-800 font-bold px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Remove File
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => setHousePlanFile({ name: "Villa_Floorplan_V1.pdf", size: "3.8 MB" })}
                  className="border-2 border-dashed border-gray-200 hover:border-[#194360] rounded-xl p-6 text-center cursor-pointer bg-gray-50 hover:bg-white transition-all"
                >
                  <p className="text-sm font-bold text-gray-700">+ Upload Floorplan PDF Document</p>
                </div>
              )}
            </div>

            {/* 4. 3D Renders & Virtual Walkthroughs */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="bg-[#194360]/10 p-2.5 rounded-xl">
                  <img src="/svg/sparks-icon.svg" alt="" className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1a1c1e]">3D Renders & Visualizations</h3>
                  <p className="text-xs text-gray-500">Architectural CGI and 3D renderings</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {renderImages.map((renderUrl, idx) => (
                  <div key={idx} className="relative rounded-xl overflow-hidden h-40 bg-gray-100 border border-gray-200 group">
                    <img src={renderUrl} alt={`Render ${idx + 1}`} className="size-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <button 
                      onClick={() => setRenderImages(prev => prev.filter((_, i) => i !== idx))}
                      className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <img src="/svg/check.svg" alt="Delete" className="size-3 filter invert" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Sidebar Metadata Panel */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            
            {/* Completion Progress Widget */}
            <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-[#1a1c1e]">Listing Completion</h4>
                <span className="text-sm font-extrabold text-[#194360]">{progress}%</span>
              </div>
              <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#194360] h-full rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>

              <div className="space-y-2 mt-2 text-xs">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Basic Info</span>
                  <span className={steps.info ? "text-green-600 font-bold" : "text-gray-400"}>{steps.info ? "✓" : "Pending"}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>Photo Gallery</span>
                  <span className={steps.images ? "text-green-600 font-bold" : "text-gray-400"}>{steps.images ? "✓" : "Pending"}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>House Plans</span>
                  <span className={steps.housePlan ? "text-green-600 font-bold" : "text-gray-400"}>{steps.housePlan ? "✓" : "Pending"}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>3D Renders</span>
                  <span className={steps.renders ? "text-green-600 font-bold" : "text-gray-400"}>{steps.renders ? "✓" : "Pending"}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>Technical Specs</span>
                  <span className={steps.details ? "text-green-600 font-bold" : "text-gray-400"}>{steps.details ? "✓" : "Pending"}</span>
                </div>
              </div>
            </div>

            {/* Specifications & Details Input Panel */}
            <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <h4 className="text-base font-bold text-[#1a1c1e] border-b border-gray-100 pb-3">Project Specifications</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Built-up Area (Sq.Ft)</label>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus-within:bg-white focus-within:border-[#194360]">
                    <img src="/svg/l-ruler-icon.svg" alt="" className="size-4" />
                    <input 
                      type="text" 
                      value={area} 
                      onChange={(e) => setArea(e.target.value)} 
                      className="bg-transparent text-sm w-full outline-none font-semibold text-gray-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Bedrooms</label>
                    <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus-within:bg-white">
                      <img src="/svg/bedroom-icon.svg" alt="" className="size-4" />
                      <input 
                        type="text" 
                        value={bedrooms} 
                        onChange={(e) => setBedrooms(e.target.value)} 
                        className="bg-transparent text-sm w-full outline-none font-semibold text-gray-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Bathrooms</label>
                    <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus-within:bg-white">
                      <img src="/svg/bathroom-icon.svg" alt="" className="size-4" />
                      <input 
                        type="text" 
                        value={bathrooms} 
                        onChange={(e) => setBathrooms(e.target.value)} 
                        className="bg-transparent text-sm w-full outline-none font-semibold text-gray-800"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Est. Construction Cost</label>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus-within:bg-white">
                    <img src="/svg/price-tag.svg" alt="" className="size-4" />
                    <input 
                      type="text" 
                      value={constructionCost} 
                      onChange={(e) => setConstructionCost(e.target.value)} 
                      className="bg-transparent text-sm w-full outline-none font-semibold text-gray-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Completion Year</label>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus-within:bg-white">
                    <img src="/svg/clock.svg" alt="" className="size-4" />
                    <input 
                      type="text" 
                      value={completionYear} 
                      onChange={(e) => setCompletionYear(e.target.value)} 
                      className="bg-transparent text-sm w-full outline-none font-semibold text-gray-800"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Tags Widget */}
            <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <h4 className="text-base font-bold text-[#1a1c1e]">Architectural Tags</h4>
              
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="bg-[#194360]/10 text-[#194360] text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    {tag}
                    <button onClick={() => handleRemoveTag(tag)} className="hover:text-red-600 text-gray-400">×</button>
                  </span>
                ))}
              </div>

              <input 
                type="text"
                placeholder="Type tag & press Enter..."
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#194360]"
              />
            </div>

            {/* Visibility Settings Panel */}
            <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <h4 className="text-base font-bold text-[#1a1c1e]">Publish Visibility</h4>
              
              <div className="space-y-2">
                {(['Public', 'Private', 'Portfolio Only'] as const).map((mode) => (
                  <label key={mode} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer">
                    <input 
                      type="radio" 
                      name="visibility" 
                      checked={visibility === mode} 
                      onChange={() => setVisibility(mode)}
                      className="text-[#194360] focus:ring-[#194360]"
                    />
                    <span className="text-xs font-bold text-gray-800">{mode}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>

        </section>
      </main>

    </div>
  );
}
