import React, { useState, useEffect } from 'react';

// ─── 1. Comprehensive Backend Interfaces ───────────────────────────────────

export interface ConstructionMilestone {
  title: string;
  targetDate?: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

export interface ConstructionProjectDetails {
  clientName?: string;
  siteLocation?: string;
  totalBudget?: string;
  estimatedCompletion?: string;
  contractorTeamSize?: number | string;
  contractType?: string;
}

export interface ConstructionProjectData {
  id?: string | number;
  projectName?: string;
  projectCategory?: 'Residential' | 'Commercial' | 'Industrial' | 'Infrastructure' | 'Renovation';
  projectDescription?: string;
  coverImage?: string;
  siteImages?: string[];
  blueprintsPdf?: { name: string; size: string; url?: string } | null;
  milestones?: ConstructionMilestone[];
  details?: ConstructionProjectDetails;
  safetyCertifications?: string[];
  visibility?: 'Public' | 'Private' | 'Clients Only';
  isDraft?: boolean;
}

export interface UploadConstructionProps {
  data?: ConstructionProjectData | null;
  isLoading?: boolean;
  error?: string | null;
  onSaveDraft?: (projectData: ConstructionProjectData) => void;
  onPublish?: (projectData: ConstructionProjectData) => void;
  onDelete?: (id?: string | number) => void;
  onAction?: (actionType: string, payload: any) => void;
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function UploadConstruction({
  data = null,
  isLoading = false,
  error = null,
  onSaveDraft,
  onPublish,
  onDelete,
  onAction
}: UploadConstructionProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Form States initialized with props data
  const [projectName, setProjectName] = useState(data?.projectName || "");
  const [projectCategory, setProjectCategory] = useState<string>(data?.projectCategory || "Commercial");
  const [projectDescription, setProjectDescription] = useState(data?.projectDescription || "");

  // Uploaded Media States
  const [coverImage, setCoverImage] = useState<string | null>(data?.coverImage || null);
  const [siteImages, setSiteImages] = useState<string[]>(
    data?.siteImages || ["/hero_property.png", "/property_card_1.png", "/property_card_2.png"]
  );

  // Blueprints & Document State
  const [blueprintsPdf, setBlueprintsPdf] = useState(
    data?.blueprintsPdf !== undefined ? data.blueprintsPdf : { name: "Construction_Site_Spec_V3.pdf", size: "6.4 MB" }
  );

  // Milestones State
  const [milestones, setMilestones] = useState<ConstructionMilestone[]>(
    data?.milestones || [
      { title: "Site Excavation & Foundation", targetDate: "2025-03-15", status: "Completed" },
      { title: "Structural Steel Framing", targetDate: "2025-06-30", status: "In Progress" },
      { title: "Electrical & Plumbing Rough-In", targetDate: "2025-09-15", status: "Pending" }
    ]
  );
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");

  // Details & Specifications
  const [clientName, setClientName] = useState(data?.details?.clientName || "BuildCo Infrastructure Corp");
  const [siteLocation, setSiteLocation] = useState(data?.details?.siteLocation || "Business Bay, Dubai South");
  const [totalBudget, setTotalBudget] = useState(data?.details?.totalBudget || "$4,500,000");
  const [estimatedCompletion, setEstimatedCompletion] = useState(data?.details?.estimatedCompletion || "Q4 2026");
  const [contractorTeamSize, setContractorTeamSize] = useState(data?.details?.contractorTeamSize?.toString() || "45 Workers");

  // Safety Certifications
  const [certifications, setCertifications] = useState<string[]>(
    data?.safetyCertifications || ["ISO 45001 Certified", "OSHA Compliant", "Green Building Standard"]
  );

  // Visibility
  const [visibility, setVisibility] = useState<'Public' | 'Private' | 'Clients Only'>(
    data?.visibility || 'Public'
  );

  // Sync state if props change dynamically
  useEffect(() => {
    if (data) {
      if (data.projectName !== undefined) setProjectName(data.projectName);
      if (data.projectCategory !== undefined) setProjectCategory(data.projectCategory);
      if (data.projectDescription !== undefined) setProjectDescription(data.projectDescription);
      if (data.coverImage !== undefined) setCoverImage(data.coverImage);
      if (data.siteImages !== undefined) setSiteImages(data.siteImages);
      if (data.blueprintsPdf !== undefined) setBlueprintsPdf(data.blueprintsPdf);
      if (data.milestones !== undefined) setMilestones(data.milestones);
      if (data.details) {
        if (data.details.clientName !== undefined) setClientName(data.details.clientName);
        if (data.details.siteLocation !== undefined) setSiteLocation(data.details.siteLocation);
        if (data.details.totalBudget !== undefined) setTotalBudget(data.details.totalBudget);
        if (data.details.estimatedCompletion !== undefined) setEstimatedCompletion(data.details.estimatedCompletion);
        if (data.details.contractorTeamSize !== undefined) setContractorTeamSize(data.details.contractorTeamSize.toString());
      }
      if (data.safetyCertifications !== undefined) setCertifications(data.safetyCertifications);
      if (data.visibility !== undefined) setVisibility(data.visibility);
    }
  }, [data]);

  // Completion Progress calculation
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const isBasicDone = !!(projectName && projectDescription && projectCategory);
    const isMediaDone = !!(siteImages.length > 0 || coverImage);
    const isDocDone = !!blueprintsPdf;
    const isDetailsDone = !!(clientName && siteLocation && totalBudget && estimatedCompletion);
    const isMilestonesDone = milestones.length > 0;

    const count = [isBasicDone, isMediaDone, isDocDone, isDetailsDone, isMilestonesDone].filter(Boolean).length;
    setProgress(Math.round((count / 5) * 100));
  }, [projectName, projectDescription, projectCategory, siteImages, coverImage, blueprintsPdf, clientName, siteLocation, totalBudget, estimatedCompletion, milestones]);

  // Handlers
  const handleSaveDraftAction = () => {
    const payload: ConstructionProjectData = {
      id: data?.id,
      projectName,
      projectCategory: projectCategory as any,
      projectDescription,
      coverImage: coverImage || undefined,
      siteImages,
      blueprintsPdf,
      milestones,
      details: {
        clientName,
        siteLocation,
        totalBudget,
        estimatedCompletion,
        contractorTeamSize
      },
      safetyCertifications: certifications,
      visibility,
      isDraft: true
    };
    if (onSaveDraft) onSaveDraft(payload);
    if (onAction) onAction('SAVE_DRAFT', payload);
  };

  const handlePublishAction = () => {
    const payload: ConstructionProjectData = {
      id: data?.id,
      projectName,
      projectCategory: projectCategory as any,
      projectDescription,
      coverImage: coverImage || undefined,
      siteImages,
      blueprintsPdf,
      milestones,
      details: {
        clientName,
        siteLocation,
        totalBudget,
        estimatedCompletion,
        contractorTeamSize
      },
      safetyCertifications: certifications,
      visibility,
      isDraft: false
    };
    if (onPublish) onPublish(payload);
    if (onAction) onAction('PUBLISH', payload);
  };

  const handleDeleteAction = () => {
    if (confirm("Are you sure you want to discard this project upload?")) {
      if (onDelete) onDelete(data?.id);
      if (onAction) onAction('DELETE', { id: data?.id });
    }
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;
    setMilestones(prev => [
      ...prev,
      { title: newMilestoneTitle.trim(), status: 'Pending', targetDate: 'TBD' }
    ]);
    setNewMilestoneTitle("");
  };

  // ─── 2. Skeleton Loading State ─────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#f8fafc] flex flex-row animate-pulse">
        <div className="hidden lg:flex w-[260px] bg-[#345b79]/40 flex-col p-6 gap-6">
          <div className="h-10 bg-white/20 rounded-lg w-3/4" />
          <div className="flex flex-col gap-4 mt-8">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-8 bg-white/10 rounded-md w-full" />
            ))}
          </div>
        </div>
        <div className="flex-1 p-8 max-w-[1400px] mx-auto space-y-8">
          <div className="h-12 bg-gray-200 rounded-lg w-1/3" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <div className="h-56 bg-gray-200 rounded-2xl" />
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
            <p className="text-[10px] text-white/50 tracking-[1px] uppercase leading-[15px]">Construction Firm</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-grow flex flex-col justify-between overflow-y-auto mt-[20px]">
          <nav className="flex flex-col gap-[4px] w-full">
            <a 
              href="/auth/test" 
              className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] text-white/70 hover:bg-white/5 hover:text-white transition-all text-[15px]"
            >
              <img alt="Dashboard" className="size-[18px]" src="/svg/home.svg" />
              <span>Dashboard</span>
            </a>
            <a 
              href="#" 
              className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] bg-[#3d4d5e] text-white font-semibold text-[15px]"
            >
              <img alt="Projects" className="size-[18px] filter brightness-200" src="/svg/construction.svg" />
              <span>Projects Upload</span>
            </a>
            <a 
              href="#" 
              className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] text-white/70 hover:bg-white/5 hover:text-white transition-all text-[15px]"
            >
              <img alt="Services" className="size-[18px] filter brightness-200" src="/svg/architect.svg" />
              <span>Services</span>
            </a>
            <a 
              href="#" 
              className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] text-white/70 hover:bg-white/5 hover:text-white transition-all text-[15px]"
            >
              <img alt="Gallery" className="size-[18px] filter brightness-200" src="/svg/sparks-icon.svg" />
              <span>Gallery</span>
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
              <img alt="Company Profile" className="size-[18px] filter brightness-200" src="/svg/agent.svg" />
              <span>Company Profile</span>
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
              <div className="bg-[#9c4327] rounded-full size-[40px] flex items-center justify-center font-bold text-white shrink-0">
                BC
              </div>
              <div className="min-w-0">
                <p className="text-[14px] font-bold text-white truncate leading-[20px]">BuildCo Team</p>
                <p className="text-[10px] text-white/40 leading-[15px]">General Contractor</p>
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

        {/* Top Header */}
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
              <h2 className="text-[28px] font-bold text-[#194360] tracking-tight">
                Upload Construction Project
              </h2>
            </div>
            <p className="text-[14px] text-[#42474d] mt-1">
              Add new commercial, residential or infrastructure construction project details
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={handleDeleteAction}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-gray-700 text-sm font-bold transition-all flex items-center gap-2"
              title="Discard Form"
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

        {/* Form Grid Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
          
          {/* Left Column Form */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* 1. Project Basic Overview */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="bg-[#194360]/10 p-2.5 rounded-xl">
                  <img src="/svg/construction.svg" alt="" className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1a1c1e]">Project Overview & Scope</h3>
                  <p className="text-xs text-gray-500">Project title, category, and construction summary</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Project Name / Title <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g. Metro Commerce Tower Structural Build"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#194360] focus:ring-2 focus:ring-[#194360]/10 outline-none text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Construction Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {['Residential', 'Commercial', 'Industrial', 'Infrastructure', 'Renovation'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setProjectCategory(cat)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border text-center ${
                          projectCategory === cat 
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
                    Detailed Scope & Description
                  </label>
                  <textarea 
                    rows={4}
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Provide details regarding the construction phase, materials, contractor team, and safety standards..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#194360] focus:ring-2 focus:ring-[#194360]/10 outline-none text-sm transition-all"
                  />
                </div>
              </div>
            </div>

            {/* 2. Construction Site Gallery */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="bg-[#9c4327]/10 p-2.5 rounded-xl">
                  <img src="/svg/eye.svg" alt="" className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1a1c1e]">Site Photos & Progress Photography</h3>
                  <p className="text-xs text-gray-500">Upload site progress images and renderings</p>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-gray-200 hover:border-[#194360] bg-gray-50 hover:bg-white rounded-2xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 group">
                <div className="bg-[#194360]/10 p-4 rounded-full group-hover:scale-105 transition-transform">
                  <img src="/svg/arrow-send.svg" alt="" className="size-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Upload Site Progress Images</p>
                  <p className="text-xs text-gray-400 mt-1">High resolution JPG or PNG files up to 15MB</p>
                </div>
              </div>

              {/* Images Preview */}
              {siteImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {siteImages.map((imgUrl, idx) => (
                    <div key={idx} className="group relative rounded-xl overflow-hidden h-32 bg-gray-100 border border-gray-200">
                      <img src={imgUrl} alt={`Site Shot ${idx + 1}`} className="size-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <button 
                        onClick={() => setSiteImages(prev => prev.filter((_, i) => i !== idx))}
                        className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove Image"
                      >
                        <img src="/svg/check.svg" alt="Delete" className="size-3 filter invert" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Blueprints & Structural Docs */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="bg-[#194360]/10 p-2.5 rounded-xl">
                  <img src="/svg/architect.svg" alt="" className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1a1c1e]">Blueprints & Structural Documentation</h3>
                  <p className="text-xs text-gray-500">Attach approved structural engineering PDFs</p>
                </div>
              </div>

              {blueprintsPdf ? (
                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#194360] text-white font-bold text-xs p-2.5 rounded-lg">
                      PDF
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{blueprintsPdf.name}</p>
                      <p className="text-xs text-gray-400">{blueprintsPdf.size}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setBlueprintsPdf(null)}
                    className="text-xs text-red-600 hover:text-red-800 font-bold px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Remove PDF
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => setBlueprintsPdf({ name: "Approved_Structural_Blueprint_V1.pdf", size: "8.2 MB" })}
                  className="border-2 border-dashed border-gray-200 hover:border-[#194360] rounded-xl p-6 text-center cursor-pointer bg-gray-50 hover:bg-white transition-all"
                >
                  <p className="text-sm font-bold text-gray-700">+ Upload Engineering PDF Blueprint</p>
                </div>
              )}
            </div>

            {/* 4. Milestones Timeline Widget */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-[#9c4327]/10 p-2.5 rounded-xl">
                    <img src="/svg/clock.svg" alt="" className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1a1c1e]">Construction Milestones</h3>
                    <p className="text-xs text-gray-500">Track key phases of project execution</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {milestones.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                      <span className={`size-3 rounded-full ${
                        m.status === 'Completed' ? 'bg-green-500' : m.status === 'In Progress' ? 'bg-blue-500' : 'bg-gray-300'
                      }`} />
                      <div>
                        <p className="text-sm font-bold text-gray-800">{m.title}</p>
                        <p className="text-xs text-gray-400">Target Date: {m.targetDate || 'N/A'}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      m.status === 'Completed' ? 'bg-green-100 text-green-700' : m.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {m.status}
                    </span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddMilestone} className="flex gap-2 mt-2">
                <input 
                  type="text" 
                  placeholder="Add new milestone (e.g. Interior Finishing)..." 
                  value={newMilestoneTitle}
                  onChange={(e) => setNewMilestoneTitle(e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:border-[#194360]"
                />
                <button type="submit" className="px-4 py-2.5 bg-[#194360] text-white text-xs font-bold rounded-xl hover:bg-[#194360]/90">
                  Add
                </button>
              </form>
            </div>

          </div>

          {/* Right Column Metadata Panel */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            
            {/* Completion Widget */}
            <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-[#1a1c1e]">Upload Progress</h4>
                <span className="text-sm font-extrabold text-[#194360]">{progress}%</span>
              </div>
              <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#194360] h-full rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Contract Specifications Panel */}
            <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <h4 className="text-base font-bold text-[#1a1c1e] border-b border-gray-100 pb-3">Contract Specifications</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Client Name</label>
                  <input 
                    type="text" 
                    value={clientName} 
                    onChange={(e) => setClientName(e.target.value)} 
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:border-[#194360]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Site Location</label>
                  <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus-within:bg-white">
                    <img src="/svg/location-pin-icon.svg" alt="" className="size-4" />
                    <input 
                      type="text" 
                      value={siteLocation} 
                      onChange={(e) => setSiteLocation(e.target.value)} 
                      className="bg-transparent text-xs w-full outline-none font-bold text-gray-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Total Project Budget</label>
                  <input 
                    type="text" 
                    value={totalBudget} 
                    onChange={(e) => setTotalBudget(e.target.value)} 
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:border-[#194360]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Estimated Completion</label>
                  <input 
                    type="text" 
                    value={estimatedCompletion} 
                    onChange={(e) => setEstimatedCompletion(e.target.value)} 
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:border-[#194360]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">On-Site Team Size</label>
                  <input 
                    type="text" 
                    value={contractorTeamSize} 
                    onChange={(e) => setContractorTeamSize(e.target.value)} 
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:border-[#194360]"
                  />
                </div>
              </div>
            </div>

            {/* Safety & Quality Certifications */}
            <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <h4 className="text-base font-bold text-[#1a1c1e]">Safety Certifications</h4>
              
              <div className="flex flex-wrap gap-2">
                {certifications.map((c) => (
                  <span key={c} className="bg-green-50 text-green-700 border border-green-200 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    ✓ {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Access Visibility Panel */}
            <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <h4 className="text-base font-bold text-[#1a1c1e]">Listing Visibility</h4>
              
              <div className="space-y-2">
                {(['Public', 'Private', 'Clients Only'] as const).map((mode) => (
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
