import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { BuyerHeaderBar } from '../../components/buyer/BuyerHeaderBar';
import { architectureApi } from '../../services/architectureApi';
import type { ArchitectureDashboardData, ArchitectureProjectItem } from '../../services/architectureApi';

export interface ArchitectureDashboardProps {
  data?: ArchitectureDashboardData | null;
  isLoading?: boolean;
  error?: string | null;
}

export default function ArchitectureDashboard({
  data: propsData = null,
  isLoading: propsLoading = false,
  error: propsError = null,
}: ArchitectureDashboardProps) {
  const [dashboardData, setDashboardData] = useState<ArchitectureDashboardData | null>(propsData);
  const [loading, setLoading] = useState<boolean>(!propsData && propsLoading);
  const [error, setError] = useState<string | null>(propsError);

  // Modals
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProj, setEditingProj] = useState<ArchitectureProjectItem | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await architectureApi.getDashboardData();
      setDashboardData(res);
    } catch (err: any) {
      console.error('Failed to fetch architecture dashboard data:', err);
      setError('Failed to load architecture dashboard data from backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!propsData) {
      fetchDashboard();
    }
  }, [propsData]);

  const metrics = dashboardData?.metrics;
  const projects = dashboardData?.tableProjects || [];
  const latestPortfolio = dashboardData?.latestPortfolio || [];
  const mostViewedDesign = dashboardData?.mostViewedDesign;
  const housePlans = dashboardData?.housePlans || [];
  const galleryItems = dashboardData?.galleryItems || [];
  const designStyles = dashboardData?.designStyles || [];

  const handleToggleStatus = async (id: string | number, currentStatus: string) => {
    const statuses: Array<'Active' | 'Completed' | 'In Review' | 'Pending'> = ['Active', 'Completed', 'In Review', 'Pending'];
    const nextIndex = (statuses.indexOf(currentStatus as any) + 1) % statuses.length;
    const nextStatus = statuses[nextIndex];

    try {
      await architectureApi.updateStatus(id, nextStatus);
      fetchDashboard();
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update project status.');
    }
  };

  const handleDelete = async (id: string | number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await architectureApi.deleteProject(id);
        fetchDashboard();
      } catch (err) {
        console.error('Failed to delete project:', err);
        alert('Failed to delete project.');
      }
    }
  };

  const handleEditProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProj) return;

    try {
      await architectureApi.updateStatus(editingProj.id, editingProj.status);
      setEditingProj(null);
      setEditModalOpen(false);
      fetchDashboard();
    } catch (err) {
      console.error('Failed to update project:', err);
      alert('Failed to save project edits.');
    }
  };

  // ── Skeleton Loading State ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col gap-6 p-6 lg:p-8 animate-pulse max-w-[1400px] mx-auto">
        <div className="h-16 bg-gray-200 rounded-2xl w-full" />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-2xl" />
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded-2xl w-full" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 p-4 sm:p-6 lg:p-8 text-[#111827] bg-[#f8fafc] min-h-screen">
      
      {/* Top Search & User Header Bar */}
      <BuyerHeaderBar searchPlaceholder="Search architectural designs, projects..." />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
        <div>
          <p className="text-xs font-semibold text-gray-500">Good morning,</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight mt-0.5">
            Architecture Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
          <Link 
            to="/dashboard/architecture/add-project"
            className="bg-[#345b79] hover:bg-[#2a4a63] text-white text-xs font-extrabold px-5 py-2.5 rounded-full flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <svg className="size-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Project</span>
          </Link>
          
          <Link 
            to="/dashboard/architecture/add-project"
            className="bg-[#be5d3f] hover:bg-[#a64e33] text-white text-xs font-extrabold px-5 py-2.5 rounded-full flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <svg className="size-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Upload Design</span>
          </Link>
        </div>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="w-full bg-red-50 border border-red-200 text-red-700 text-xs p-4 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <img src="/svg/info.svg" alt="Error" className="size-5 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
          <button onClick={fetchDashboard} className="text-xs bg-red-100 px-3 py-1.5 rounded-lg hover:bg-red-200 font-bold">
            Retry
          </button>
        </div>
      )}

      {/* Top 5 Metric Cards Grid (Pulling directly from Backend) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full">
        {[
          { label: 'Portfolio Views', val: metrics?.portfolioViewsCount ?? 0, growth: metrics?.viewsGrowthPercent ?? '0%', icon: '/svg/eye.svg', bg: 'bg-blue-50 text-[#345b79]' },
          { label: 'Projects', val: metrics?.totalProjectsCount ?? 0, growth: metrics?.projectsGrowthCount ?? '0', icon: '/svg/home.svg', bg: 'bg-orange-50 text-[#be5d3f]' },
          { label: 'House Plans', val: metrics?.housePlansCount ?? 0, growth: metrics?.plansGrowthCount ?? '0', icon: '/svg/land-plot-icon.svg', bg: 'bg-emerald-50 text-emerald-600' },
          { label: '3D Designs', val: metrics?.threeDDesignsCount ?? 0, growth: metrics?.designsGrowthCount ?? '0', icon: '/svg/l-ruler-icon.svg', bg: 'bg-indigo-50 text-indigo-600' },
          { label: 'Followers', val: metrics?.followersCount ?? 0, growth: metrics?.followersGrowthPercent ?? '0%', icon: '/svg/agent.svg', bg: 'bg-purple-50 text-purple-600' }
        ].map((card, idx) => (
          <div key={idx} className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className={`size-10 rounded-xl ${card.bg} flex items-center justify-center shrink-0`}>
                <img alt="" className="size-5 opacity-80" src={card.icon} />
              </div>
              <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                {card.growth}
              </span>
            </div>
            <div>
              <h3 className="text-2xl lg:text-3xl font-extrabold text-[#111827] leading-none mb-1">
                {typeof card.val === 'number' ? card.val.toLocaleString() : card.val}
              </h3>
              <span className="text-[11px] font-bold text-gray-400">{card.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Row 2: Latest Portfolio & Most Viewed Design */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Latest Portfolio (Dynamic DB data) */}
        <div className="lg:col-span-8 bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#111827]">Latest Portfolio</h3>
            <span className="text-xs font-bold text-[#345b79] cursor-pointer hover:underline uppercase tracking-wider">
              VIEW ALL
            </span>
          </div>

          {latestPortfolio.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {latestPortfolio.map((item, idx) => (
                <div key={idx} className="bg-gray-50/60 rounded-2xl overflow-hidden border border-gray-100 flex flex-col group hover:shadow-sm transition-all">
                  <div className="h-36 overflow-hidden relative">
                    <img alt={item.title} className="size-full object-cover group-hover:scale-105 transition-transform duration-300" src={item.img || '/hero_property.png'} />
                  </div>
                  <div className="p-4 flex flex-col gap-1">
                    <span className="text-[9px] font-extrabold tracking-wider text-gray-400 uppercase">{item.tag || 'MODERN'}</span>
                    <h4 className="text-xs font-extrabold text-[#111827] truncate">{item.title}</h4>
                    <div className="flex gap-4 items-center pt-2 text-[11px] font-bold text-gray-500">
                      <span className="flex items-center gap-1"><img src="/svg/eye.svg" alt="" className="size-3 opacity-60" />{item.views}</span>
                      <span className="flex items-center gap-1"><img src="/svg/heart.svg" alt="" className="size-3 opacity-60" />{item.likes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-xs font-bold text-gray-400">No portfolio designs found in database.</p>
              <Link to="/dashboard/architecture/add-project" className="text-xs font-extrabold text-[#345b79] hover:underline mt-2 inline-block">
                + Add your first project
              </Link>
            </div>
          )}
        </div>

        {/* Most Viewed Design */}
        <div className="lg:col-span-4 bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm flex flex-col justify-between">
          {mostViewedDesign ? (
            <>
              <div className="h-44 w-full overflow-hidden relative">
                <img alt={mostViewedDesign.title} className="size-full object-cover" src={mostViewedDesign.img || '/hero_property.png'} />
                <span className="absolute top-4 right-4 bg-[#345b79] text-white text-[9px] font-extrabold tracking-widest px-2.5 py-1 rounded-full shadow-sm uppercase">
                  #1 Trending
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[9px] font-extrabold tracking-wider text-gray-400 uppercase block mb-0.5">{mostViewedDesign.tag}</span>
                  <h3 className="text-lg font-extrabold text-[#111827]">{mostViewedDesign.title}</h3>
                  <div className="flex items-center gap-4 text-xs font-bold text-gray-500 mt-3">
                    <span className="flex items-center gap-1.5"><img src="/svg/eye.svg" alt="" className="size-3.5 opacity-70" /> {mostViewedDesign.views} views</span>
                    <span className="flex items-center gap-1.5"><img src="/svg/heart.svg" alt="" className="size-3.5 opacity-70" /> {mostViewedDesign.likes} likes</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center bg-gray-50/50 flex flex-col items-center justify-center h-full space-y-2">
              <svg className="size-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs font-bold text-gray-400">No featured design available.</p>
            </div>
          )}
        </div>

      </div>

      {/* Row 3: House Plans & Popular Design Styles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Latest House Plans */}
        <div className="lg:col-span-7 bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#111827]">Latest House Plans</h3>
            <span className="text-xs font-bold text-[#345b79] cursor-pointer hover:underline uppercase tracking-wider">
              VIEW ALL
            </span>
          </div>

          <div className="space-y-4 flex-1">
            {housePlans.length > 0 ? (
              housePlans.slice(0, 3).map((plan, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50/60 rounded-2xl border border-gray-100 hover:bg-gray-100/60 transition-colors">
                  <img src={plan.img || '/hero_property.png'} alt={plan.title} className="size-16 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-extrabold text-[#111827] truncate">{plan.title}</h4>
                    <p className="text-xs font-bold text-gray-500 mt-1">
                      {plan.beds} Beds • {plan.baths} Baths • {plan.sqft} sqft
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-xs font-bold text-gray-400">No house plans uploaded yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Popular Design Styles */}
        <div className="lg:col-span-5 bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
          <h3 className="text-base font-extrabold text-[#111827]">Design Styles Breakdown</h3>
          
          {designStyles.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {designStyles.map((st, idx) => (
                <span key={idx} className="bg-gray-100 text-gray-700 text-xs font-extrabold px-3 py-2 rounded-xl border border-gray-200">
                  {st.name} <span className="text-gray-400 font-bold ml-1">({st.count})</span>
                </span>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-xs font-bold text-gray-400">No design styles recorded.</p>
            </div>
          )}
        </div>

      </div>

      {/* Row 4: Project Gallery */}
      <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h3 className="text-base font-extrabold text-[#111827]">Project Gallery</h3>
          <div className="flex items-center gap-3">
            <Link 
              to="/dashboard/architecture/add-project"
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-extrabold px-4 py-2 rounded-xl border border-gray-200 transition-colors cursor-pointer"
            >
              + Upload House Plan
            </Link>
            <Link 
              to="/dashboard/architecture/add-project"
              className="bg-[#be5d3f] hover:bg-[#a64e33] text-white text-xs font-extrabold px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              + Upload 3D Design
            </Link>
          </div>
        </div>

        {galleryItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {galleryItems.map((item, idx) => (
              <div key={idx} className="relative rounded-2xl overflow-hidden h-36 group shadow-sm border border-gray-100">
                <img alt={item.name} className="size-full object-cover group-hover:scale-105 transition-transform duration-300" src={item.imgUrl} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3">
                  <span className="text-white text-xs font-extrabold truncate">{item.name}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-xs font-bold text-gray-400">No gallery design images found in database.</p>
          </div>
        )}
      </div>

      {/* Row 5: Project Statistics Table */}
      <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-[#111827]">Project Statistics</h3>
          <button onClick={() => alert('Exporting PDF report...')} className="text-xs font-extrabold text-[#345b79] hover:underline uppercase tracking-wider cursor-pointer">
            EXPORT REPORT
          </button>
        </div>

        {projects.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                  <th className="pb-3 px-3">PROJECT NAME</th>
                  <th className="pb-3 px-3 text-center">VIEWS</th>
                  <th className="pb-3 px-3 text-center">LIKES</th>
                  <th className="pb-3 px-3">STATUS</th>
                  <th className="pb-3 px-3">DATE</th>
                  <th className="pb-3 px-3 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {projects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-3 font-bold text-[#111827] flex items-center gap-3">
                      <div className="size-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                        <img alt="" className="size-4 opacity-70" src={proj.icon || '/svg/home.svg'} />
                      </div>
                      <span>{proj.name}</span>
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-[#111827]">{proj.views}</td>
                    <td className="py-3.5 px-3 text-center font-bold text-[#111827]">{proj.likes}</td>
                    <td className="py-3.5 px-3">
                      <button
                        onClick={() => handleToggleStatus(proj.id, proj.status)}
                        className={`text-[10px] font-extrabold px-3 py-1 rounded-full cursor-pointer transition-transform hover:scale-105 ${
                          proj.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-700'
                            : proj.status === 'Completed'
                            ? 'bg-blue-100 text-[#345b79]'
                            : proj.status === 'In Review'
                            ? 'bg-orange-100 text-[#be5d3f]'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {proj.status}
                      </button>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-gray-500">{proj.date}</td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => { setEditingProj(proj); setEditModalOpen(true); }}
                          className="size-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
                          title="Edit Project"
                        >
                          <svg className="size-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(proj.id)}
                          className="size-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors cursor-pointer"
                          title="Delete Project"
                        >
                          <svg className="size-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-xs font-bold text-gray-400">No architecture projects found in database.</p>
          </div>
        )}
      </div>

      {/* Edit Project Modal */}
      {editModalOpen && editingProj && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-xl border border-gray-100">
            <h3 className="text-lg font-extrabold text-[#111827]">Edit Project Specifications</h3>
            
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
                <button type="button" onClick={() => setEditModalOpen(false)} className="px-5 py-2.5 rounded-full text-gray-500 text-xs font-extrabold">
                  Cancel
                </button>
                <button type="submit" className="bg-[#345b79] hover:bg-[#2a4a63] text-white px-6 py-2.5 rounded-full text-xs font-extrabold shadow-sm">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
