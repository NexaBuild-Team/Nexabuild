import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ComingSoonMetric } from '../../components/ComingSoonMetric';

// ─── 1. Comprehensive Backend Interfaces ───────────────────────────────────

export interface ArchitectureProjectItem {
  id: string | number;
  name: string;
  categoryTag?: string;
  views: string | number;
  likes: string | number;
  status: 'Active' | 'Completed' | 'In Review' | 'Pending';
  date: string;
  imageUrl?: string;
  icon?: string;
}

export interface HousePlanItem {
  id: string | number;
  title: string;
  beds: number;
  baths: number;
  sqft: string | number;
  imageUrl: string;
}

export interface GalleryDesignItem {
  name: string;
  imgUrl: string;
}

export interface DesignStyleMetric {
  name: string;
  count: number;
}

export interface ArchitectureSummaryMetrics {
  portfolioViewsCount?: string | number;
  viewsGrowthPercent?: string;
  totalProjectsCount?: number;
  projectsGrowthCount?: string;
  housePlansCount?: number;
  plansGrowthCount?: string;
  threeDDesignsCount?: number;
  designsGrowthCount?: string;
  followersCount?: string | number;
  followersGrowthPercent?: string;
}

export interface ArchitectureDashboardPageData {
  metrics?: ArchitectureSummaryMetrics;
  latestPortfolio?: ArchitectureProjectItem[];
  mostViewedDesign?: ArchitectureProjectItem;
  housePlans?: HousePlanItem[];
  tableProjects?: ArchitectureProjectItem[];
  galleryItems?: GalleryDesignItem[];
  designStyles?: DesignStyleMetric[];
}

export interface ArchitectureDashboardProps {
  data?: ArchitectureDashboardPageData | null;
  isLoading?: boolean;
  error?: string | null;
  onAddProject?: () => void;
  onUploadDesign?: () => void;
  onEditProject?: (id: string | number) => void;
  onDeleteProject?: (id: string | number) => void;
  onToggleProjectStatus?: (id: string | number) => void;
}

// ─── Mock Fallback Data ─────────────────────────────────────────────────────

const defaultTableProjects: ArchitectureProjectItem[] = [
  { id: 1, name: 'Zenith Residence', views: '8,240', likes: '342', status: 'Active', date: 'Jun 12, 2025', icon: '/svg/architect.svg' },
  { id: 2, name: 'Lakeview Office Complex', views: '5,880', likes: '214', status: 'Completed', date: 'May 28, 2025', icon: '/svg/architect.svg' },
  { id: 3, name: 'Palm Court Villas', views: '4,120', likes: '178', status: 'In Review', date: 'Jun 02, 2025', icon: '/svg/architect.svg' },
  { id: 4, name: 'Heritage Heights', views: '3,740', likes: '156', status: 'Pending', date: 'Jun 18, 2025', icon: '/svg/architect.svg' }
];

const defaultGalleryItems: GalleryDesignItem[] = [
  { name: 'Living Room', imgUrl: '/property_card_1.png' },
  { name: 'Kitchen', imgUrl: '/property_card_2.png' },
  { name: 'Master Suite', imgUrl: '/property_card_3.png' },
  { name: 'Office', imgUrl: '/property_card_4.png' },
  { name: 'Rooftop', imgUrl: '/hero_property.png' }
];

const defaultDesignStyles: DesignStyleMetric[] = [
  { name: 'Modern', count: 142 },
  { name: 'Luxury', count: 98 },
  { name: 'Minimal', count: 87 },
  { name: 'Traditional', count: 64 },
  { name: 'Industrial', count: 51 },
  { name: 'Contemporary', count: 45 }
];

// ─── Component Implementation ───────────────────────────────────────────────

export default function ArchitectureDashboard({
  data = null,
  isLoading = false,
  error = null,
  onAddProject,
  onUploadDesign,
  onEditProject,
  onDeleteProject,
  onToggleProjectStatus
}: ArchitectureDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projectsState, setProjectsState] = useState<ArchitectureProjectItem[]>([]);
  const [galleryState, setGalleryState] = useState<GalleryDesignItem[]>([]);

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newProjName, setNewProjName] = useState('');
  const [newProjStatus, setNewProjStatus] = useState<'Active' | 'Completed' | 'In Review' | 'Pending'>('Active');

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProj, setEditingProj] = useState<ArchitectureProjectItem | null>(null);

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [newDesignName, setNewDesignName] = useState('');

  const projects = data?.tableProjects !== undefined 
    ? data.tableProjects 
    : (projectsState.length > 0 ? projectsState : defaultTableProjects);

  const galleryItems = data?.galleryItems || (galleryState.length > 0 ? galleryState : defaultGalleryItems);
  const designStyles = data?.designStyles || defaultDesignStyles;
  const metrics = data?.metrics;

  const handleToggleStatus = (id: string | number) => {
    if (onToggleProjectStatus) {
      onToggleProjectStatus(id);
    } else {
      const statuses: Array<'Active' | 'Completed' | 'In Review' | 'Pending'> = ['Active', 'Completed', 'In Review', 'Pending'];
      setProjectsState(prev => {
        const source = prev.length > 0 ? prev : defaultTableProjects;
        return source.map(p => {
          if (p.id === id) {
            const nextIndex = (statuses.indexOf(p.status) + 1) % statuses.length;
            return { ...p, status: statuses[nextIndex] };
          }
          return p;
        });
      });
    }
  };

  const handleDelete = (id: string | number) => {
    if (onDeleteProject) {
      onDeleteProject(id);
    } else {
      if (window.confirm('Are you sure you want to delete this project?')) {
        setProjectsState(prev => {
          const source = prev.length > 0 ? prev : defaultTableProjects;
          return source.filter(p => p.id !== id);
        });
      }
    }
  };

  const handleAddProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName) return;

    if (onAddProject) {
      onAddProject();
    } else {
      const newProj: ArchitectureProjectItem = {
        id: Date.now(),
        name: newProjName,
        views: '1,200',
        likes: '45',
        status: newProjStatus,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        icon: '/svg/architect.svg'
      };
      setProjectsState(prev => [newProj, ...(prev.length > 0 ? prev : defaultTableProjects)]);
    }
    setNewProjName('');
    setAddModalOpen(false);
  };

  const handleEditProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProj) return;

    if (onEditProject) {
      onEditProject(editingProj.id);
    } else {
      setProjectsState(prev => {
        const source = prev.length > 0 ? prev : defaultTableProjects;
        return source.map(p => p.id === editingProj.id ? editingProj : p);
      });
    }
    setEditingProj(null);
    setEditModalOpen(false);
  };

  const handleUploadDesignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesignName) return;

    if (onUploadDesign) {
      onUploadDesign();
    } else {
      const newItem: GalleryDesignItem = {
        name: newDesignName,
        imgUrl: '/property_card_1.png'
      };
      setGalleryState(prev => [newItem, ...(prev.length > 0 ? prev : defaultGalleryItems).slice(0, 4)]);
    }
    setNewDesignName('');
    setUploadModalOpen(false);
  };

  // ─── 2. Skeleton Loading State ─────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col gap-6 p-6 lg:p-8 animate-pulse max-w-[1400px] mx-auto">
        <div className="h-16 bg-gray-200 rounded-2xl w-full" />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-28 bg-gray-200 rounded-2xl" />
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded-2xl w-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative flex flex-row items-start font-normal text-[#1d1d1d] bg-gradient-to-r from-[#e6e0d4] to-[#fcf9f8]">
      
      {/* Sidebar Drawer */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-[260px] bg-[#345b79] flex flex-col justify-between pt-[76px] pb-[24px] px-[16px] transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="absolute top-[11px] left-0 right-0 px-[24px] flex items-center gap-[12px] h-[52px]">
          <div className="bg-white/10 flex items-center justify-center rounded-[8px] size-[40px] shrink-0">
            <img alt="" className="size-[20px] object-contain" src="/src/assets/logo.png" />
          </div>
          <div>
            <h1 className="text-[20px] font-extrabold text-white leading-[25px]">NexaBuild</h1>
            <p className="text-[10px] text-white/50 tracking-[1px] uppercase leading-[15px]">Architecture Studio</p>
          </div>
        </div>

        <div className="flex-grow flex flex-col justify-between overflow-y-auto mt-[20px]">
          <nav className="flex flex-col gap-[4px] w-full">
            <a href="/architecture-dashboard" className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] bg-[#3d4d5e] text-white font-semibold text-[16px]">
              <img alt="Dashboard" className="size-[18px]" src="/svg/home.svg" />
              <span>Dashboard</span>
            </a>
            <a href="/view-all-properties" className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] text-white/70 hover:bg-white/5 hover:text-white transition-all text-[16px]">
              <img alt="Portfolio" className="size-[20px] filter brightness-200" src="/svg/architect.svg" />
              <span>Portfolio</span>
            </a>
            <a href="/view-all-land" className="flex items-center gap-[12px] px-[16px] py-[12px] rounded-[12px] text-white/70 hover:bg-white/5 hover:text-white transition-all text-[16px]">
              <img alt="Projects" className="size-[18px] filter brightness-200" src="/svg/construction.svg" />
              <span>Projects</span>
            </a>
          </nav>
        </div>
      </aside>

      {/* Backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-45 bg-black/45 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content Area */}
      <main className="flex-1 lg:pl-[260px] min-w-0 flex flex-col pt-8 pb-16 px-4 sm:px-6 lg:px-8 gap-8 max-w-[1400px] w-full mx-auto">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
          <div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-1 border border-gray-200 rounded hover:bg-gray-50"
              >
                <svg className="size-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <p className="text-xs font-medium text-[#6b7280]">Good morning,</p>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1d1d1d] tracking-tight mt-1">
              Architecture Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
            <button 
              onClick={() => setAddModalOpen(true)}
              className="bg-[#345b79] hover:bg-[#345b79]/90 text-white text-xs font-bold px-5 py-2.5 rounded-full flex items-center gap-2 shadow-sm"
            >
              <img alt="" className="size-3 filter invert" src="/svg/sparks-icon.svg" />
              <span>Add Project</span>
            </button>
            
            <button 
              onClick={() => setUploadModalOpen(true)}
              className="bg-[#be5d3f] hover:bg-[#be5d3f]/90 text-white text-xs font-bold px-5 py-2.5 rounded-full flex items-center gap-2 shadow-sm"
            >
              <img alt="" className="size-3 filter invert" src="/svg/arrow-send.svg" />
              <span>Upload Design</span>
            </button>
          </div>
        </header>

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

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5 w-full">
          {[
            { label: 'Portfolio Views', val: metrics?.portfolioViewsCount ?? '24,580', growth: metrics?.viewsGrowthPercent ?? '+12.4%', icon: '/svg/eye.svg', bg: 'bg-[#eff6ff]' },
            { label: 'Projects', val: metrics?.totalProjectsCount ?? (projects.length + 34), growth: metrics?.projectsGrowthCount ?? '+3', icon: '/svg/home.svg', bg: 'bg-[#fff7ed]' },
            { label: 'House Plans', val: metrics?.housePlansCount ?? 64, growth: metrics?.plansGrowthCount ?? '+8', icon: '/svg/architect.svg', bg: 'bg-[#f0fdf4]' },
            { label: '3D Designs', val: metrics?.threeDDesignsCount ?? 21, growth: metrics?.designsGrowthCount ?? '+2', icon: '/svg/construction.svg', bg: 'bg-[#f9fafb]' },
            { label: 'Followers', val: metrics?.followersCount ?? '4,820', growth: metrics?.followersGrowthPercent ?? '+5.1%', icon: '/svg/agent.svg', bg: 'bg-[#eef2ff]' }
          ].map((card, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-5 flex flex-col justify-between shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between pb-3">
                <div className={`flex items-center justify-center rounded-xl size-10 ${card.bg}`}>
                  <img alt="" className="size-4.5" src={card.icon} />
                </div>
                <span className="text-[10px] font-bold text-emerald-600">{card.growth}</span>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-[#1d1d1d] leading-tight">{card.val}</p>
                <p className="text-xs font-medium text-[#6b7280] mt-1">{card.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Latest Portfolio Section */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 w-full">
          <div className="xl:col-span-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1d1d1d]">Latest Portfolio</h3>
              <a href="/view-all-properties" className="text-[#345b79] text-xs font-bold uppercase tracking-wider hover:underline">
                VIEW ALL
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { title: 'Zenith Residence', tag: 'MODERN VILLA', views: '4,210', likes: '189', img: '/property_card_1.png' },
                { title: 'Skyline Tower', tag: 'COMMERCIAL', views: '3,840', likes: '152', img: '/property_card_2.png' },
                { title: 'Palm Court', tag: 'RESORT', views: '2,990', likes: '134', img: '/property_card_3.png' }
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col group border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="h-40 overflow-hidden relative bg-gray-100">
                    <img alt={item.title} className="size-full object-cover group-hover:scale-105 transition-transform duration-300" src={item.img} />
                  </div>
                  <div className="p-5 flex flex-col gap-1">
                    <span className="text-[9px] font-extrabold tracking-wider text-gray-400 uppercase">{item.tag}</span>
                    <h4 className="text-sm font-bold text-[#1d1d1d]">{item.title}</h4>
                    <div className="flex gap-4 items-center pt-2 text-xs font-semibold text-gray-500">
                      <span className="flex items-center gap-1"><img src="/svg/eye.svg" alt="" className="size-3 opacity-60" />{item.views}</span>
                      <span className="flex items-center gap-1"><img src="/svg/heart.svg" alt="" className="size-3 opacity-60" />{item.likes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Most Viewed Design */}
          <div className="xl:col-span-4 flex flex-col gap-6">
            <h3 className="text-base font-bold text-[#1d1d1d]">Most Viewed Design</h3>
            <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 relative flex flex-col group">
              <div className="h-56 overflow-hidden relative bg-gray-100">
                <img alt="Apex Penthouse Series" className="size-full object-cover group-hover:scale-105 transition-transform duration-300" src="/hero_property.png" />
              </div>
              <div className="p-6 flex flex-col gap-1">
                <span className="text-[9px] font-extrabold tracking-wider text-gray-400 uppercase">LUXURY RESIDENTIAL</span>
                <h4 className="text-lg font-bold text-[#1d1d1d]">Apex Penthouse Series</h4>
                <div className="flex gap-4 items-center pt-3 text-xs font-semibold text-gray-500">
                  <span className="flex items-center gap-1"><img src="/svg/eye.svg" alt="" className="size-3.5" />12,480</span>
                  <span className="flex items-center gap-1"><img src="/svg/heart.svg" alt="" className="size-3.5" />580</span>
                  <span className="flex items-center gap-1"><img src="/svg/bookmark.svg" alt="" className="size-3.5" />214</span>
                </div>
              </div>
              <div className="absolute top-4 right-4 bg-[#345b79] rounded-full px-3 py-1 flex items-center gap-1 text-white text-[10px] font-extrabold shadow-sm">
                <img alt="" className="size-2.5 filter invert" src="/svg/checkMark.svg" />
                <span>#1 Trending</span>
              </div>
            </div>
          </div>
        </div>

        {/* Project Gallery */}
        <div className="flex flex-col gap-5 w-full">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#1d1d1d]">Project Gallery</h3>
            <button onClick={() => setUploadModalOpen(true)} className="border border-gray-200 hover:bg-gray-50 text-xs font-bold px-4 py-2 rounded-full">
              Upload Design
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 w-full">
            {galleryItems.map((item, idx) => (
              <div key={idx} className="relative rounded-2xl overflow-hidden aspect-[4/3] group shadow-sm border border-gray-100">
                <img alt={item.name} className="size-full object-cover group-hover:scale-105 transition-transform duration-300" src={item.imgUrl} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
                  <span className="text-white text-xs font-bold">{item.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Statistics Table */}
        <div className="flex flex-col gap-5 w-full">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#1d1d1d]">Project Statistics</h3>
            <button onClick={() => alert('Exporting PDF...')} className="text-[#345b79] hover:underline text-xs font-bold uppercase">
              EXPORT REPORT
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[700px] text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="py-4 px-6 w-[30%]">PROJECT NAME</th>
                  <th className="py-4 px-6 text-center w-[15%]">VIEWS</th>
                  <th className="py-4 px-6 text-center w-[15%]">LIKES</th>
                  <th className="py-4 px-6 w-[15%]">STATUS</th>
                  <th className="py-4 px-6 w-[15%]">DATE</th>
                  <th className="py-4 px-6 text-right w-[10%]">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {projects.map(proj => (
                  <tr key={proj.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-[#1d1d1d] flex items-center gap-3">
                      <div className="bg-gray-100 flex items-center justify-center rounded size-8">
                        <img alt="" className="size-3" src={proj.icon || '/svg/architect.svg'} />
                      </div>
                      <span>{proj.name}</span>
                    </td>
                    <td className="py-4 px-6 text-center text-gray-500 font-semibold">{proj.views}</td>
                    <td className="py-4 px-6 text-center text-gray-500 font-semibold">{proj.likes}</td>
                    <td className="py-4 px-6">
                      <span 
                        onClick={() => handleToggleStatus(proj.id)}
                        className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase cursor-pointer select-none ${
                          proj.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {proj.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-400 font-medium">{proj.date}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setEditingProj(proj); setEditModalOpen(true); }} className="p-1.5 hover:bg-gray-100 rounded-full">
                          <img alt="Edit" className="size-3.5" src="/svg/sparks-settings-icon.svg" />
                        </button>
                        <button onClick={() => handleDelete(proj.id)} className="p-1.5 hover:bg-red-50 rounded-full">
                          <img alt="Delete" className="size-3.5 filter hue-rotate-320" src="/svg/clock.svg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Add Project Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-xl border border-gray-100">
            <h3 className="text-lg font-bold text-[#1d1d1d]">Add New Project</h3>
            <p className="text-xs text-gray-400 mt-1">Introduce a new design project into the studio portfolio</p>
            
            <form onSubmit={handleAddProjectSubmit} className="mt-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">Project Name</label>
                <input 
                  type="text" 
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  placeholder="e.g. Marina Horizon Towers"
                  className="w-full bg-[#f9fafb] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#345b79]"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setAddModalOpen(false)} className="px-5 py-2.5 rounded-full text-gray-500 text-xs font-bold">
                  Cancel
                </button>
                <button type="submit" className="bg-[#345b79] hover:bg-[#345b79]/90 text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-sm">
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {editModalOpen && editingProj && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-xl border border-gray-100">
            <h3 className="text-lg font-bold text-[#1d1d1d]">Edit Project Specifications</h3>
            
            <form onSubmit={handleEditProjectSubmit} className="mt-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">Project Name</label>
                <input 
                  type="text" 
                  value={editingProj.name}
                  onChange={(e) => setEditingProj({ ...editingProj, name: e.target.value })}
                  className="w-full bg-[#f9fafb] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setEditModalOpen(false)} className="px-5 py-2.5 rounded-full text-gray-500 text-xs font-bold">
                  Cancel
                </button>
                <button type="submit" className="bg-[#345b79] hover:bg-[#345b79]/90 text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-sm">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Design Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-xl border border-gray-100">
            <h3 className="text-lg font-bold text-[#1d1d1d]">Upload Design Photo</h3>
            
            <form onSubmit={handleUploadDesignSubmit} className="mt-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">Design Name / Room Type</label>
                <input 
                  type="text" 
                  value={newDesignName}
                  onChange={(e) => setNewDesignName(e.target.value)}
                  placeholder="e.g. Master Bedroom"
                  className="w-full bg-[#f9fafb] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setUploadModalOpen(false)} className="px-5 py-2.5 rounded-full text-gray-500 text-xs font-bold">
                  Cancel
                </button>
                <button type="submit" className="bg-[#be5d3f] hover:bg-[#be5d3f]/90 text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-sm">
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
