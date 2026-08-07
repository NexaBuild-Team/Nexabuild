import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

// ─── 1. Comprehensive Backend Interfaces ───────────────────────────────────

export interface ConstructionProjectItem {
  id: string | number;
  name: string;
  category: 'Residential' | 'Commercial' | 'Renovation' | 'Industrial';
  status: 'Active' | 'Completed' | 'Planning' | 'On Hold';
  views: string | number;
  date: string;
  icon?: string;
}

export interface ConstructionActivityItem {
  id: string | number;
  title: string;
  description: string;
  timeAgo: string;
  icon: string;
}

export interface ConstructionGalleryItem {
  id: string | number;
  title: string;
  category: string;
  views: string;
  imageUrl: string;
}

export interface ConstructionServiceMetric {
  name: string;
  projectsCount: number;
  percentage: number;
  icon: string;
  color: string;
}

export interface ConstructionSummaryMetrics {
  totalProjectsCount?: number;
  projectsGrowthPercent?: string;
  totalViewsCount?: string | number;
  viewsGrowthPercent?: string;
  completedProjectsCount?: number;
  completedGrowthPercent?: string;
  clientReviewsRating?: number;
  ratingGrowth?: string;
  onSchedulePercent?: number;
  activeNowCount?: number;
}

export interface ConstructionCompanyDashboardPageData {
  metrics?: ConstructionSummaryMetrics;
  latestProjects?: ConstructionProjectItem[];
  recentActivities?: ConstructionActivityItem[];
  galleryItems?: ConstructionGalleryItem[];
  services?: ConstructionServiceMetric[];
}

export interface ConstructionCompanyDashboardProps {
  data?: ConstructionCompanyDashboardPageData | null;
  isLoading?: boolean;
  error?: string | null;
  onAddProject?: () => void;
  onUploadGallery?: () => void;
  onEditProject?: (id: string | number) => void;
  onDeleteProject?: (id: string | number) => void;
}

// ─── Mock Fallback Data ─────────────────────────────────────────────────────

const defaultProjects: ConstructionProjectItem[] = [
  { id: 1, name: 'Skyline Residences', category: 'Residential', status: 'Active', views: '2,340', date: 'Jan 12, 2025' },
  { id: 2, name: 'Metro Commerce Hub', category: 'Commercial', status: 'Completed', views: '5,812', date: 'Dec 3, 2024' },
  { id: 3, name: 'Green Valley Villas', category: 'Residential', status: 'Planning', views: '1,095', date: 'Jan 20, 2025' },
  { id: 4, name: 'Riverfront Office Park', category: 'Commercial', status: 'On Hold', views: '3,422', date: 'Nov 18, 2024' },
  { id: 5, name: 'Coastal Retreat Resort', category: 'Renovation', status: 'Active', views: '4,210', date: 'Jan 5, 2025' }
];

const defaultActivities: ConstructionActivityItem[] = [
  { id: 1, title: 'Gallery Updated', description: 'Skyline Tower — 6 new photos uploaded', timeAgo: '2h ago', icon: '/svg/sparks-icon.svg' },
  { id: 2, title: 'Project Completed', description: 'Metro Commerce Hub marked as complete', timeAgo: '5h ago', icon: '/svg/checkMark.svg' },
  { id: 3, title: 'New Review Received', description: '5.0 review from Ahmad Al-Farsi on Villa Serena', timeAgo: '1d ago', icon: '/svg/star.svg' },
  { id: 4, title: 'New Project Added', description: 'Coastal Retreat Resort added to pipeline', timeAgo: '2d ago', icon: '/svg/construction.svg' }
];

const defaultGallery: ConstructionGalleryItem[] = [
  { id: 1, title: 'Skyline Tower', category: 'Commercial', views: '4.2k', imageUrl: '/property_card_1.png' },
  { id: 2, title: 'Villa Serena', category: 'Residential', views: '3.8k', imageUrl: '/property_card_2.png' },
  { id: 3, title: 'Metro Hub', category: 'Commercial', views: '2.9k', imageUrl: '/hero_property.png' }
];

const defaultServices: ConstructionServiceMetric[] = [
  { name: 'Residential', projectsCount: 38, percentage: 72, icon: '/svg/home.svg', color: 'bg-[#345b79]' },
  { name: 'Commercial', projectsCount: 29, percentage: 58, icon: '/svg/construction.svg', color: 'bg-[#9c4327]' },
  { name: 'Renovation', projectsCount: 21, percentage: 42, icon: '/svg/architect.svg', color: 'bg-[#645f3a]' },
  { name: 'Interior Design', projectsCount: 17, percentage: 34, icon: '/svg/agent.svg', color: 'bg-[#194360]' }
];

// ─── Component Implementation ───────────────────────────────────────────────

export default function ConstructionCompanyDashboard({
  data = null,
  isLoading = false,
  error = null,
  onAddProject,
  onUploadGallery,
  onEditProject,
  onDeleteProject
}: ConstructionCompanyDashboardProps) {
  const { user } = useAuth();
  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Contractor Team';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projectsState, setProjectsState] = useState<ConstructionProjectItem[]>([]);

  const projects = data?.latestProjects !== undefined 
    ? data.latestProjects 
    : (projectsState.length > 0 ? projectsState : defaultProjects);

  const activities = data?.recentActivities || defaultActivities;
  const galleryItems = data?.galleryItems || defaultGallery;
  const services = data?.services || defaultServices;
  const metrics = data?.metrics;

  const handleDelete = (id: string | number) => {
    if (onDeleteProject) {
      onDeleteProject(id);
    } else {
      if (window.confirm('Are you sure you want to delete this project?')) {
        setProjectsState(prev => {
          const source = prev.length > 0 ? prev : defaultProjects;
          return source.filter(p => p.id !== id);
        });
      }
    }
  };

  // ─── 2. Skeleton Loading State ─────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col gap-6 p-6 lg:p-8 animate-pulse max-w-[1400px] mx-auto">
        <div className="h-16 bg-gray-200 rounded-2xl w-full" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded-2xl" />
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded-2xl w-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative flex flex-row items-start font-normal text-[#1b1b1b] bg-gradient-to-r from-[#e6e0d4] to-[#fcf9f8]">
      
      {/* Sidebar Navigation */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-[280px] bg-[#345b79] flex flex-col justify-between pt-[76px] pb-[24px] px-[16px] transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="absolute top-[11px] left-0 right-0 px-[24px] flex items-center gap-[12px] h-[52px]">
          <div className="bg-[#9c4327] flex items-center justify-center rounded-[8px] size-[40px] shrink-0">
            <img alt="NexaBuild Logo" className="size-[20px] object-contain" src="/src/assets/logo.png" />
          </div>
          <div>
            <h1 className="text-[20px] font-extrabold text-white leading-[25px]">NexaBuild</h1>
            <p className="text-[10px] text-white/60 tracking-[1px] uppercase leading-[15px]">Construction Co.</p>
          </div>
        </div>

        <div className="flex-grow flex flex-col justify-between overflow-y-auto mt-[20px]">
          <nav className="flex flex-col gap-[4px] w-full">
            <a href="/construction-dashboard" className="flex items-center gap-[16px] px-[24px] py-[16px] rounded-r-[8px] bg-[#194360] border-l-4 border-[#ff906e] text-white font-semibold text-[14px]">
              <img alt="Dashboard" className="size-[18px]" src="/svg/home.svg" />
              <span>Dashboard</span>
            </a>
            <a href="/view-all-land" className="flex items-center gap-[16px] px-[24px] py-[16px] rounded-[8px] text-white/70 hover:bg-white/5 hover:text-white transition-all text-[14px]">
              <img alt="Projects" className="size-[18px] filter brightness-200" src="/svg/construction.svg" />
              <span>Projects</span>
            </a>
            <a href="/view-all-properties" className="flex items-center gap-[16px] px-[24px] py-[16px] rounded-[8px] text-white/70 hover:bg-white/5 hover:text-white transition-all text-[14px]">
              <img alt="Services" className="size-[18px] filter brightness-200" src="/svg/architect.svg" />
              <span>Services</span>
            </a>
            <a href="#" className="flex items-center gap-[16px] px-[24px] py-[16px] rounded-[8px] text-white/70 hover:bg-white/5 hover:text-white transition-all text-[14px]">
              <img alt="Gallery" className="size-[18px] filter brightness-200" src="/svg/sparks-icon.svg" />
              <span>Gallery</span>
            </a>
            <a href="#" className="flex items-center gap-[16px] px-[24px] py-[16px] rounded-[8px] text-white/70 hover:bg-white/5 hover:text-white transition-all text-[14px]">
              <img alt="Testimonials" className="size-[18px] filter brightness-200" src="/svg/agent.svg" />
              <span>Testimonials</span>
            </a>
          </nav>

          <div className="flex flex-col gap-[4px] border-t border-white/10 pt-4">
            <a href="#" className="flex items-center gap-[16px] px-[24px] py-[16px] rounded-[8px] text-white/70 hover:bg-white/5 hover:text-white transition-all text-[14px]">
              <img alt="Settings" className="size-[18px] filter brightness-200" src="/svg/sparks-settings-icon.svg" />
              <span>Settings</span>
            </a>
            <a href="/auth/login" className="flex items-center gap-[16px] px-[24px] py-[16px] rounded-[8px] text-white/70 hover:bg-white/5 hover:text-white transition-all text-[14px]">
              <img alt="Logout" className="size-[18px] filter brightness-200" src="/svg/sign-in.svg" />
              <span>Logout</span>
            </a>
          </div>
        </div>
      </aside>

      {/* Backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/45 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content Area */}
      <main className="flex-grow lg:pl-[280px] min-w-0 flex flex-col pt-6 pb-12 px-6 lg:px-8 gap-6 max-w-[1400px] w-full mx-auto">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4 border-b border-gray-200/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <svg className="size-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-[#194360] tracking-tight">Dashboard Overview</h1>
            </div>
            <p className="text-xs text-[#42474d] mt-1 font-semibold">Welcome back, {userName}</p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
            <button 
              onClick={() => onAddProject ? onAddProject() : alert('Add Project Dialog')}
              className="bg-[#194360] hover:bg-[#194360]/90 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm"
            >
              <img alt="" className="size-3 filter invert" src="/svg/sparks-icon.svg" />
              <span>Add Project</span>
            </button>
            <button 
              onClick={() => onUploadGallery ? onUploadGallery() : alert('Upload Gallery Dialog')}
              className="bg-[#9c4327] hover:bg-[#9c4327]/90 text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm"
            >
              <img alt="" className="size-3 filter invert" src="/svg/arrow-send.svg" />
              <span>Upload Gallery</span>
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

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {[
            { label: 'Total Projects', val: metrics?.totalProjectsCount ?? 124, growth: metrics?.projectsGrowthPercent ?? '+12%', icon: '/svg/construction.svg', bg: 'bg-[#345b79]/10', color: 'text-[#194360]' },
            { label: 'Total Views', val: metrics?.totalViewsCount ?? '48.3k', growth: metrics?.viewsGrowthPercent ?? '+8.5%', icon: '/svg/clock.svg', bg: 'bg-[#9c4327]/10', color: 'text-[#9c4327]' },
            { label: 'Completed Projects', val: metrics?.completedProjectsCount ?? 89, growth: metrics?.completedGrowthPercent ?? '+6%', icon: '/svg/checkMark.svg', bg: 'bg-[#645f3a]/10', color: 'text-[#645f3a]' },
            { label: 'Client Reviews', val: metrics?.clientReviewsRating ?? 4.8, growth: metrics?.ratingGrowth ?? '+0.2', icon: '/svg/eye.svg', bg: 'bg-[#bea37e]/10', color: 'text-[#bea37e]' }
          ].map((card, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm flex flex-col justify-between h-40 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <span className="text-xs font-semibold text-[#42474d]">{card.label}</span>
                <div className={`flex items-center justify-center rounded-lg size-10 ${card.bg}`}>
                  <img alt="" className="size-4.5" src={card.icon} />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-extrabold text-[#1b1b1b]">{card.val}</p>
                <span className={`bg-gray-100 rounded px-2 py-1 text-xs font-bold ${card.color}`}>{card.growth}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Middle Row: Latest Projects Table & Recent Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full">
          
          {/* Latest Projects Table */}
          <div className="xl:col-span-8 bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 flex flex-col gap-6">
            <div className="flex justify-between items-center w-full">
              <h3 className="text-lg font-bold text-[#1b1b1b]">Latest Projects</h3>
              <a href="/view-all-land" className="text-xs font-bold text-[#194360] hover:underline uppercase">View All</a>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="pb-3 pl-2">PROJECT</th>
                    <th className="pb-3 pl-2">STATUS</th>
                    <th className="pb-3 pl-2">VIEWS</th>
                    <th className="pb-3 pl-2">DATE</th>
                    <th className="pb-3 pl-2 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {projects.map(proj => {
                    let badgeStyle = 'bg-emerald-100 text-emerald-700';
                    if (proj.status === 'Completed') badgeStyle = 'bg-blue-100 text-blue-700';
                    if (proj.status === 'Planning') badgeStyle = 'bg-amber-100 text-amber-700';
                    if (proj.status === 'On Hold') badgeStyle = 'bg-red-100 text-red-700';

                    return (
                      <tr key={proj.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 pl-2 font-bold text-gray-800 flex items-center gap-3">
                          <div className="bg-[#345b79]/10 p-2 rounded-lg shrink-0">
                            <img src={proj.icon || '/svg/eye.svg'} alt="" className="size-4" />
                          </div>
                          <div>
                            <p>{proj.name}</p>
                            <span className="text-[10px] text-gray-400 font-medium">{proj.category}</span>
                          </div>
                        </td>
                        <td className="py-4 pl-2">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${badgeStyle}`}>
                            {proj.status}
                          </span>
                        </td>
                        <td className="py-4 pl-2 font-semibold text-gray-600">{proj.views}</td>
                        <td className="py-4 pl-2 text-gray-400">{proj.date}</td>
                        <td className="py-4 pl-2 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => onEditProject && onEditProject(proj.id)} className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100">
                              <img src="/svg/sparks-settings-icon.svg" alt="Edit" className="size-3.5" />
                            </button>
                            <button onClick={() => handleDelete(proj.id)} className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600">
                              <img src="/svg/clock.svg" alt="Delete" className="size-3.5 filter hue-rotate-320" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity Side Panel */}
          <div className="xl:col-span-4 bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 flex flex-col gap-6">
            <h3 className="text-lg font-bold text-[#1b1b1b]">Recent Activity</h3>
            <div className="flex flex-col gap-5">
              {activities.map(act => (
                <div key={act.id} className="flex items-start gap-4 text-xs">
                  <div className="bg-gray-100 p-2.5 rounded-full shrink-0">
                    <img src={act.icon} alt="" className="size-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-gray-800">{act.title}</p>
                      <span className="text-[10px] text-gray-400">{act.timeAgo}</span>
                    </div>
                    <p className="text-[#42474d] mt-1 leading-snug">{act.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Row: Gallery, Performance & Popular Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-6 w-full">
          
          {/* Project Gallery Card */}
          <div className="xl:col-span-4 bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 flex flex-col gap-5">
            <div className="flex justify-between items-center w-full">
              <h3 className="text-base font-bold text-[#1b1b1b]">Project Gallery</h3>
              <a href="#" className="text-xs font-bold text-[#194360] uppercase hover:underline">View All</a>
            </div>
            <div className="flex flex-col gap-3">
              {galleryItems.map(item => (
                <div key={item.id} className="relative rounded-xl overflow-hidden h-28 bg-gray-100 group border border-gray-100">
                  <img src={item.imageUrl} alt={item.title} className="size-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-between p-3 text-white">
                    <div>
                      <p className="text-xs font-bold">{item.title}</p>
                      <p className="text-[9px] text-white/70">{item.category}</p>
                    </div>
                    <span className="text-[10px] text-white/80 font-semibold">{item.views}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Performance Metrics Card */}
          <div className="xl:col-span-4 bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 flex flex-col justify-between gap-5">
            <div>
              <h3 className="text-base font-bold text-[#1b1b1b]">Project Performance</h3>
              <div className="flex gap-4 items-center mt-3 text-xs font-medium">
                <span className="flex items-center gap-1.5"><div className="size-2.5 rounded-full bg-[#345b79]" /> Views</span>
                <span className="flex items-center gap-1.5"><div className="size-2.5 rounded-full bg-[#9c4327]" /> Projects</span>
              </div>
            </div>

            {/* Custom Bar Graph */}
            <div className="flex items-end justify-between h-36 px-2 border-b border-gray-100">
              {[40, 65, 55, 80, 70, 95, 85].map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-2 w-5">
                  <div className="bg-[#345b79] opacity-80 w-full rounded-t hover:opacity-100 transition-opacity" style={{ height: `${h}%` }} />
                  <span className="text-[9px] text-gray-400 font-bold uppercase">{['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'][i]}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-gray-50">
              <div>
                <p className="text-lg font-bold text-[#1b1b1b]">{metrics?.onSchedulePercent ?? 91}%</p>
                <p className="text-[9px] text-gray-400">On Schedule</p>
              </div>
              <div className="border-x border-gray-100">
                <p className="text-lg font-bold text-[#1b1b1b]">{metrics?.activeNowCount ?? 14}</p>
                <p className="text-[9px] text-gray-400">Active Now</p>
              </div>
              <div>
                <p className="text-lg font-bold text-[#1b1b1b]">+23%</p>
                <p className="text-[9px] text-gray-400">Growth</p>
              </div>
            </div>
          </div>

          {/* Popular Services Progress Card */}
          <div className="xl:col-span-4 bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 flex flex-col gap-5">
            <h3 className="text-base font-bold text-[#1b1b1b]">Popular Services</h3>
            <div className="flex flex-col gap-4">
              {services.map((srv, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-gray-100 shrink-0">
                        <img src={srv.icon} alt="" className="size-3.5" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{srv.name}</p>
                        <span className="text-[9px] text-gray-400">{srv.projectsCount} Projects</span>
                      </div>
                    </div>
                    <span className="font-bold text-gray-800">{srv.percentage}%</span>
                  </div>
                  <div className="bg-gray-100 h-2 rounded-full overflow-hidden w-full">
                    <div className={`${srv.color} h-full rounded-full`} style={{ width: `${srv.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
