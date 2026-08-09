import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { BuyerHeaderBar } from '../../components/buyer/BuyerHeaderBar';
import { constructionApi } from '../../services/constructionApi';

// ─── 1. Interfaces ─────────────────────────────────────────────────────────

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
  error: propsError = null,
  onSaveDraft: _onSaveDraft,
  onPublish: _onPublish,
  onDelete,
  onAction
}: UploadConstructionProps) {
  const navigate = useNavigate();

  // Form Field States (Clean initial states without dummy data)
  const [projectName, setProjectName] = useState(data?.projectName || "");
  const [projectCategory, setProjectCategory] = useState<string>(data?.projectCategory || "Commercial");
  const [projectDescription, setProjectDescription] = useState(data?.projectDescription || "");

  // Media States
  const [_coverImage] = useState<string | null>(data?.coverImage || null);
  const [_siteImages] = useState<string[]>(data?.siteImages || []);

  // Blueprints & Document State
  const [blueprintsPdf, setBlueprintsPdf] = useState<{ name: string; size: string } | null>(
    data?.blueprintsPdf !== undefined ? data.blueprintsPdf : null
  );

  // Milestones State (Clean initial state)
  const [milestones, setMilestones] = useState<ConstructionMilestone[]>(data?.milestones || []);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");

  // Details & Specifications (Clean initial states)
  const [clientName, setClientName] = useState(data?.details?.clientName || "");
  const [siteLocation, setSiteLocation] = useState(data?.details?.siteLocation || "");
  const [totalBudget, setTotalBudget] = useState(data?.details?.totalBudget || "");
  const [estimatedCompletion, setEstimatedCompletion] = useState(data?.details?.estimatedCompletion || "");
  const [contractorTeamSize, setContractorTeamSize] = useState(data?.details?.contractorTeamSize?.toString() || "");

  // Safety Certifications (Clean initial state)
  const [certifications, setCertifications] = useState<string[]>(data?.safetyCertifications || []);
  const [newCertInput, setNewCertInput] = useState("");

  // Visibility
  const [visibility, setVisibility] = useState<'Public' | 'Private' | 'Clients Only'>(
    data?.visibility || 'Public'
  );

  // UI State
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(propsError);

  // File Upload Handler (Simulated local file drop)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBlueprintsPdf({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      });
    }
  };

  // Dynamic progress calculation based on real filled user inputs
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const isOverviewDone = !!(projectName.trim() && projectDescription.trim() && projectCategory);
    const isBlueprintDone = !!blueprintsPdf;
    const isMilestonesDone = milestones.length > 0;
    const isDetailsDone = !!(clientName.trim() || siteLocation.trim() || totalBudget.trim());

    const completedCount = [isOverviewDone, isBlueprintDone, isMilestonesDone, isDetailsDone].filter(Boolean).length;
    setProgress(Math.round((completedCount / 4) * 100));
  }, [projectName, projectDescription, projectCategory, blueprintsPdf, milestones, clientName, siteLocation, totalBudget]);

  // Action Handlers
  const handleSaveDraftAction = async () => {
    if (!projectName.trim()) {
      setFormError('Please enter a Project Name to save a draft.');
      return;
    }

    try {
      setSubmitting(true);
      setFormError(null);
      await constructionApi.createProject({
        name: projectName.trim(),
        category: projectCategory || 'Commercial',
        description: projectDescription.trim() || undefined,
        clientName: clientName.trim() || undefined,
        siteLocation: siteLocation.trim() || undefined,
        totalBudget: totalBudget.trim() || undefined,
        estimatedCompletion: estimatedCompletion.trim() || undefined,
        teamSize: contractorTeamSize.trim() || undefined,
        blueprintFileName: blueprintsPdf?.name || undefined,
        visibility,
        status: 'Planning',
      });
      alert('Construction project draft saved to database!');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Failed to save project draft:', err);
      setFormError(err.response?.data?.message || 'Failed to save project draft.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePublishAction = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!projectName.trim()) {
      setFormError('Project Name is required before publishing.');
      return;
    }

    try {
      setSubmitting(true);
      setFormError(null);
      await constructionApi.createProject({
        name: projectName.trim(),
        category: projectCategory || 'Commercial',
        description: projectDescription.trim() || undefined,
        clientName: clientName.trim() || undefined,
        siteLocation: siteLocation.trim() || undefined,
        totalBudget: totalBudget.trim() || undefined,
        estimatedCompletion: estimatedCompletion.trim() || undefined,
        teamSize: contractorTeamSize.trim() || undefined,
        blueprintFileName: blueprintsPdf?.name || undefined,
        visibility,
        status: 'Active',
      });
      alert('Construction project published successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Failed to publish construction project:', err);
      setFormError(err.response?.data?.message || 'Failed to publish construction project.');
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

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMilestoneTitle.trim()) {
      setMilestones(prev => [
        ...prev,
        { title: newMilestoneTitle.trim(), status: 'Pending', targetDate: new Date().toISOString().split('T')[0] }
      ]);
      setNewMilestoneTitle("");
    }
  };

  const handleToggleMilestoneStatus = (index: number) => {
    const statuses: Array<'Pending' | 'In Progress' | 'Completed'> = ['Pending', 'In Progress', 'Completed'];
    setMilestones(prev => prev.map((m, i) => {
      if (i === index) {
        const nextIdx = (statuses.indexOf(m.status) + 1) % statuses.length;
        return { ...m, status: statuses[nextIdx] };
      }
      return m;
    }));
  };

  const handleAddCert = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newCertInput.trim()) {
      e.preventDefault();
      if (!certifications.includes(newCertInput.trim())) {
        setCertifications(prev => [...prev, newCertInput.trim()]);
      }
      setNewCertInput("");
    }
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
      <BuyerHeaderBar searchPlaceholder="Search construction projects, blueprints..." />

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
          <Link to="/dashboard" className="text-xs font-extrabold text-[#194360] hover:underline flex items-center gap-1.5 mb-1">
            <svg className="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">Upload Construction Project</h1>
          <p className="text-xs sm:text-sm text-gray-500 font-semibold">Add new commercial, residential or infrastructure construction project details</p>
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
            className="bg-[#194360] hover:bg-[#123249] text-white text-xs font-extrabold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
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
              <div className="size-10 rounded-xl bg-blue-50 text-[#194360] flex items-center justify-center shrink-0">
                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0-4h.01M12 11h.01M12 7h.01" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#111827]">Project Information</h3>
                <p className="text-xs text-gray-500 font-medium">Title, category and scope description</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-1.5">
                  Project Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Skyline Commercial Center"
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#194360]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-500 mb-1.5">
                  Project Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['Residential', 'Commercial', 'Industrial', 'Infrastructure', 'Renovation'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setProjectCategory(cat)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all border text-center cursor-pointer ${
                        projectCategory === cat 
                          ? 'bg-[#194360] text-white border-[#194360] shadow-sm' 
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
                  Project Description & Scope
                </label>
                <textarea 
                  rows={4}
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Detailed breakdown of construction scope, engineering specs, machinery used..."
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#194360]"
                />
              </div>
            </div>
          </div>

          {/* 2. Site Photos (Coming Soon Overlay) */}
          <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/75 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-6 text-center space-y-3">
              <div className="size-12 rounded-2xl bg-[#194360]/10 text-[#194360] flex items-center justify-center shadow-inner">
                <svg className="size-6 text-[#194360]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xs font-black tracking-widest uppercase bg-[#194360] text-white px-3 py-1 rounded-full shadow-sm">
                Coming Soon
              </span>
              <p className="text-xs font-extrabold text-gray-700 max-w-sm">
                Cloud site photo & drone footage upload is coming soon. Projects will automatically be published with clean site visuals!
              </p>
            </div>

            <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100 opacity-40">
              <div className="size-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#111827]">Site Progress Photos</h3>
                <p className="text-xs text-gray-500 font-medium">On-site construction photos</p>
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

          {/* 3. Blueprints & Specifications */}
          <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100">
              <div className="size-10 rounded-xl bg-orange-50 text-[#be5d3f] flex items-center justify-center shrink-0">
                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#111827]">Site Blueprint & Contract Document</h3>
                <p className="text-xs text-gray-500 font-medium">Attach PDF drawings or site specification file</p>
              </div>
            </div>

            {blueprintsPdf ? (
              <div className="flex items-center justify-between p-4 bg-gray-50/80 rounded-2xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-orange-100 text-[#be5d3f] flex items-center justify-center font-bold text-xs">
                    PDF
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-[#111827]">{blueprintsPdf.name}</h4>
                    <span className="text-[10px] font-bold text-gray-400">{blueprintsPdf.size}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setBlueprintsPdf(null)}
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
                <span className="text-xs font-bold text-gray-600 mb-1">Click to Upload Blueprint Document</span>
                <span className="text-[10px] font-semibold text-gray-400">PDF, DWG (Max 50MB)</span>
              </label>
            )}
          </div>

          {/* 4. Milestones Tracker */}
          <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3.5">
                <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#111827]">Construction Milestones</h3>
                  <p className="text-xs text-gray-500 font-medium">Key project phases and delivery status</p>
                </div>
              </div>
            </div>

            {milestones.length > 0 && (
              <div className="space-y-3">
                {milestones.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 bg-gray-50/80 rounded-2xl border border-gray-200">
                    <div>
                      <h4 className="text-xs font-extrabold text-[#111827]">{m.title}</h4>
                      <span className="text-[10px] font-semibold text-gray-400">Target: {m.targetDate || 'TBD'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleMilestoneStatus(idx)}
                      className={`text-[10px] font-extrabold px-3 py-1 rounded-full cursor-pointer ${
                        m.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                        m.status === 'In Progress' ? 'bg-blue-100 text-[#194360]' : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {m.status}
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input 
                type="text" 
                value={newMilestoneTitle}
                onChange={(e) => setNewMilestoneTitle(e.target.value)}
                placeholder="Add milestone (e.g. Foundation Pouring)..."
                className="flex-1 bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#194360]"
              />
              <button 
                type="button" 
                onClick={handleAddMilestone} 
                className="bg-[#194360] text-white text-xs font-extrabold px-4 py-2.5 rounded-xl cursor-pointer"
              >
                Add Phase
              </button>
            </div>
          </div>

          {/* 5. Project Details & Specs */}
          <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100">
              <div className="size-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0-4h.01M12 11h.01M12 7h.01" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#111827]">Site Details & Budget</h3>
                <p className="text-xs text-gray-500 font-medium">Client name, location, and contractor team size</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold tracking-wider text-gray-500 uppercase">Client Name</label>
                <input 
                  type="text" 
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. BuildCo Infrastructure"
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold tracking-wider text-gray-500 uppercase">Site Location</label>
                <input 
                  type="text" 
                  value={siteLocation}
                  onChange={(e) => setSiteLocation(e.target.value)}
                  placeholder="e.g. Colombo 03, Sri Lanka"
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold tracking-wider text-gray-500 uppercase">Total Budget (LKR)</label>
                <input 
                  type="text" 
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(e.target.value)}
                  placeholder="e.g. 45,000,000"
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold tracking-wider text-gray-500 uppercase">Est. Completion Date</label>
                <input 
                  type="date" 
                  value={estimatedCompletion}
                  onChange={(e) => setEstimatedCompletion(e.target.value)}
                  className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-3 text-xs sm:text-sm text-gray-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[10px] font-extrabold tracking-wider text-gray-500 uppercase">Contractor Team Size</label>
                <input 
                  type="text" 
                  value={contractorTeamSize}
                  onChange={(e) => setContractorTeamSize(e.target.value)}
                  placeholder="e.g. 45 Workers"
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
              <span className="text-xs font-extrabold text-[#194360] bg-blue-50 px-2.5 py-1 rounded-full">{progress}%</span>
            </div>

            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div className="bg-[#194360] h-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>

            <p className="text-xs text-gray-500 font-medium">
              Complete project information, site blueprints, and phase milestones to publish your project.
            </p>
          </div>

          {/* Visibility Widget */}
          <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Visibility Setting</h3>
            
            <div className="space-y-2">
              {(['Public', 'Private', 'Clients Only'] as const).map((vis) => (
                <button
                  key={vis}
                  type="button"
                  onClick={() => setVisibility(vis)}
                  className={`w-full p-3 rounded-xl text-xs font-extrabold text-left border transition-all cursor-pointer flex items-center justify-between ${
                    visibility === vis
                      ? 'bg-[#194360]/10 border-[#194360] text-[#194360]'
                      : 'bg-gray-50/80 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>{vis}</span>
                  {visibility === vis && <span className="size-2 rounded-full bg-[#194360]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Safety Standards Widget */}
          <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Safety Certifications</h3>
            
            {certifications.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {certifications.map((cert) => (
                  <span key={cert} className="bg-blue-50 text-[#194360] text-[10px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5">
                    {cert}
                    <button type="button" onClick={() => setCertifications(prev => prev.filter(c => c !== cert))} className="hover:text-red-500">×</button>
                  </span>
                ))}
              </div>
            )}

            <input 
              type="text" 
              value={newCertInput}
              onChange={(e) => setNewCertInput(e.target.value)}
              onKeyDown={handleAddCert}
              placeholder="Type certification and press Enter..."
              className="w-full bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#194360]"
            />
          </div>

        </div>

      </form>

    </div>
  );
}
