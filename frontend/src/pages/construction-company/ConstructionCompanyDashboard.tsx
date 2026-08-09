import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { BuyerHeaderBar } from '../../components/buyer/BuyerHeaderBar';
import { constructionApi } from '../../services/constructionApi';
import type { ConstructionDashboardData } from '../../services/constructionApi';

export interface ConstructionCompanyDashboardProps {
  data?: ConstructionDashboardData | null;
  isLoading?: boolean;
  error?: string | null;
}

export default function ConstructionCompanyDashboard({
  data: propsData = null,
  isLoading: propsLoading = false,
  error: propsError = null,
}: ConstructionCompanyDashboardProps) {
  const [dashboardData, setDashboardData] = useState<ConstructionDashboardData | null>(propsData);
  const [loading, setLoading] = useState<boolean>(!propsData && propsLoading);
  const [error, setError] = useState<string | null>(propsError);
  const [selectedProjId, setSelectedProjId] = useState<string | number | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await constructionApi.getDashboardData();
      setDashboardData(res);
    } catch (err: any) {
      console.error('Failed to fetch construction dashboard data:', err);
      setError('Failed to load construction dashboard data from backend server.');
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
  const projects = dashboardData?.latestProjects || [];
  const activities = dashboardData?.recentActivities || [];
  const galleryItems = dashboardData?.galleryItems || [];
  const services = dashboardData?.services || [];

  const handleToggleStatus = async (id: string | number, currentStatus: string) => {
    const statuses: Array<'Active' | 'Completed' | 'Planning' | 'On Hold'> = ['Active', 'Completed', 'Planning', 'On Hold'];
    const nextIndex = (statuses.indexOf(currentStatus as any) + 1) % statuses.length;
    const nextStatus = statuses[nextIndex];

    try {
      await constructionApi.updateStatus(id, nextStatus);
      fetchDashboard();
    } catch (err) {
      console.error('Failed to update project status:', err);
      alert('Failed to update project status.');
    }
  };

  const handleDelete = async (id: string | number) => {
    if (window.confirm('Are you sure you want to delete this construction project?')) {
      try {
        await constructionApi.deleteProject(id);
        fetchDashboard();
      } catch (err) {
        console.error('Failed to delete construction project:', err);
        alert('Failed to delete project.');
      }
    }
  };

  // Skeleton Loading State
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col gap-6 p-6 lg:p-8 animate-pulse max-w-[1400px] mx-auto">
        <div className="h-16 bg-gray-200 rounded-2xl w-full" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-2xl" />
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded-2xl w-full" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 p-4 sm:p-6 lg:p-8 text-[#111827] bg-[#f8fafc] min-h-screen">
      
      {/* Top Search & User Header Bar */}
      <BuyerHeaderBar searchPlaceholder="Search projects, services..." />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs font-semibold text-gray-500 mt-0.5">Welcome back, BuildCo Team</p>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
          <Link 
            to="/dashboard/construction/add-project"
            className="bg-[#194360] hover:bg-[#123249] text-white text-xs font-extrabold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <svg className="size-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Project</span>
          </Link>
          
          <Link 
            to="/dashboard/construction/add-project"
            className="bg-[#be5d3f] hover:bg-[#a64e33] text-white text-xs font-extrabold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <svg className="size-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Upload Gallery</span>
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

      {/* Top 4 KPI Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {[
          { label: 'Total Projects', val: metrics?.totalProjectsCount ?? 0, growth: metrics?.projectsGrowthPercent ?? '0%', icon: '/svg/home.svg', bg: 'bg-blue-50 text-[#194360]' },
          { label: 'Total Views', val: metrics?.totalViewsCount ?? '0', growth: metrics?.viewsGrowthPercent ?? '0%', icon: '/svg/eye.svg', bg: 'bg-orange-50 text-[#be5d3f]' },
          { label: 'Completed Projects', val: metrics?.completedProjectsCount ?? 0, growth: metrics?.completedGrowthPercent ?? '0%', icon: '/svg/checkMark.svg', bg: 'bg-emerald-50 text-emerald-600' },
          { label: 'Client Reviews', val: metrics?.clientReviewsRating ?? 0, growth: metrics?.ratingGrowth ?? '0', icon: '/svg/star.svg', bg: 'bg-amber-50 text-amber-600' }
        ].map((card, idx) => (
          <div key={idx} className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-500">{card.label}</span>
              <div className={`size-9 rounded-xl ${card.bg} flex items-center justify-center shrink-0`}>
                <img alt="" className="size-4.5 opacity-80" src={card.icon} />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <h3 className="text-2xl lg:text-3xl font-extrabold text-[#111827] leading-none">{card.val}</h3>
              <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                {card.growth}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Row 2: Latest Projects & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Latest Projects Table */}
        <div className="lg:col-span-8 bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#111827]">Latest Projects</h3>
            <span className="text-xs font-bold text-[#194360] cursor-pointer hover:underline uppercase tracking-wider">
              View All →
            </span>
          </div>

          {projects.length > 0 ? (
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                    <th className="pb-3 px-3">PROJECT</th>
                    <th className="pb-3 px-3">STATUS</th>
                    <th className="pb-3 px-3 text-center">VIEWS</th>
                    <th className="pb-3 px-3 text-right">DATE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs">
                  {projects.map((proj) => (
                    <tr 
                      key={proj.id} 
                      onClick={() => setSelectedProjId(proj.id)}
                      className={`hover:bg-gray-50/80 transition-colors cursor-pointer ${selectedProjId === proj.id ? 'bg-blue-50/40' : ''}`}
                    >
                      <td className="py-3.5 px-3 font-bold text-[#111827] flex items-center gap-3">
                        <div className="size-8 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                          <img alt="" className="size-4 opacity-70" src="/svg/home.svg" />
                        </div>
                        <div>
                          <span className="block font-extrabold text-[#111827]">{proj.name}</span>
                          <span className="text-[10px] text-gray-400 font-semibold">{proj.category}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          onClick={(e) => { e.stopPropagation(); handleToggleStatus(proj.id, proj.status); }}
                          className={`text-[10px] font-extrabold px-3 py-1 rounded-full cursor-pointer select-none ${
                            proj.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-700'
                              : proj.status === 'Completed'
                              ? 'bg-blue-100 text-[#194360]'
                              : proj.status === 'Planning'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {proj.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center font-bold text-gray-600">{proj.views}</td>
                      <td className="py-3.5 px-3 text-right font-semibold text-gray-400">{proj.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-xs font-bold text-gray-400">No construction projects found in database.</p>
              <Link to="/dashboard/construction/add-project" className="text-xs font-extrabold text-[#194360] hover:underline mt-2 inline-block">
                + Add your first construction project
              </Link>
            </div>
          )}

          {projects.length > 0 && (
            <div className="flex items-center gap-3 pt-2">
              <button 
                onClick={() => selectedProjId && alert(`Editing project ${selectedProjId}`)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 text-xs font-extrabold hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Edit Project
              </button>
              <button 
                onClick={() => selectedProjId && handleDelete(selectedProjId)}
                className="px-4 py-2 rounded-xl border border-red-200 text-red-600 text-xs font-extrabold hover:bg-red-50 transition-colors cursor-pointer"
              >
                Delete Project
              </button>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-4 bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
          <h3 className="text-base font-extrabold text-[#111827]">Recent Activity</h3>

          {activities.length > 0 ? (
            <div className="space-y-4 flex-1">
              {activities.map((act) => (
                <div key={act.id} className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-gray-50/80 transition-colors">
                  <div className={`size-9 rounded-xl flex items-center justify-center shrink-0 ${
                    act.type === 'gallery' ? 'bg-blue-50 text-[#194360]' :
                    act.type === 'complete' ? 'bg-emerald-50 text-emerald-600' :
                    act.type === 'review' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                  }`}>
                    <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {act.type === 'gallery' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />}
                      {act.type === 'complete' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />}
                      {act.type === 'review' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />}
                      {act.type === 'project' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />}
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-[#111827]">{act.title}</h4>
                      <span className="text-[10px] font-bold text-gray-400">{act.timeAgo}</span>
                    </div>
                    <p className="text-[11px] font-semibold text-gray-500 mt-0.5 leading-tight">{act.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-xs font-bold text-gray-400">No recent construction activity.</p>
            </div>
          )}
        </div>

      </div>

      {/* Row 3: Project Gallery, Project Performance, & Popular Services */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Project Gallery */}
        <div className="lg:col-span-4 bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#111827]">Project Gallery</h3>
            <span className="text-xs font-bold text-[#194360] cursor-pointer hover:underline uppercase tracking-wider">
              View All
            </span>
          </div>

          {galleryItems.length > 0 ? (
            <div className="space-y-3 flex-1">
              {galleryItems.map((item) => (
                <div key={item.id} className="relative rounded-2xl overflow-hidden h-24 group shadow-sm border border-gray-100">
                  <img alt={item.title} className="size-full object-cover group-hover:scale-105 transition-transform duration-300" src={item.imageUrl} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-between p-3">
                    <div>
                      <h4 className="text-xs font-extrabold text-white">{item.title}</h4>
                      <span className="text-[9px] font-bold text-white/70">{item.category}</span>
                    </div>
                    <span className="text-[10px] font-extrabold text-white/90 flex items-center gap-1">
                      <img src="/svg/eye.svg" alt="" className="size-3 filter invert opacity-80" /> {item.views}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-xs font-bold text-gray-400">No project gallery images.</p>
            </div>
          )}
        </div>

        {/* Project Performance (Recharts BarChart) */}
        <div className="lg:col-span-4 bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
          <h3 className="text-base font-extrabold text-[#111827]">Project Performance</h3>

          <div className="flex items-center gap-4 text-[10px] font-bold text-gray-500">
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-[#194360]" /> Views</span>
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-[#be5d3f]" /> Projects</span>
          </div>

          <div className="h-[140px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { month: 'Jul', views: 0, projects: 0 },
                { month: 'Aug', views: 0, projects: 0 },
                { month: 'Sep', views: 0, projects: 0 },
                { month: 'Oct', views: 0, projects: 0 },
                { month: 'Nov', views: 0, projects: 0 },
                { month: 'Dec', views: 0, projects: 0 },
                { month: 'Jan', views: projects.length, projects: metrics?.activeNowCount || 0 },
              ]}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#9ca3af', fontWeight: 'bold' }} />
                <Tooltip cursor={{ fill: '#e2e8f0' }} contentStyle={{ borderRadius: 8, fontSize: 10 }} />
                <Bar dataKey="views" fill="#194360" radius={[4, 4, 0, 0]} barSize={10} />
                <Bar dataKey="projects" fill="#be5d3f" radius={[4, 4, 0, 0]} barSize={10} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 text-center">
            <div>
              <span className="text-base font-extrabold text-[#111827] block leading-tight">{metrics?.onSchedulePercent ?? 0}%</span>
              <span className="text-[9px] font-bold text-gray-400">On Schedule</span>
            </div>
            <div>
              <span className="text-base font-extrabold text-[#111827] block leading-tight">{metrics?.activeNowCount ?? 0}</span>
              <span className="text-[9px] font-bold text-gray-400">Active Now</span>
            </div>
            <div>
              <span className="text-base font-extrabold text-[#111827] block leading-tight">{metrics?.projectsGrowthPercent ?? '0%'}</span>
              <span className="text-[9px] font-bold text-gray-400">Growth</span>
            </div>
          </div>
        </div>

        {/* Popular Services */}
        <div className="lg:col-span-4 bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
          <h3 className="text-base font-extrabold text-[#111827]">Popular Services</h3>

          <div className="space-y-4 flex-1">
            {services.map((srv, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <div className="size-7 rounded-lg bg-gray-100 flex items-center justify-center">
                      <img alt="" className="size-3.5 opacity-70" src="/svg/home.svg" />
                    </div>
                    <div>
                      <span className="text-[#111827] block font-extrabold">{srv.name}</span>
                      <span className="text-[9px] text-gray-400 font-semibold">{srv.projectsCount} Projects</span>
                    </div>
                  </div>
                  <span className="font-extrabold text-gray-700">{srv.percentage}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-[#194360]" 
                    style={{ width: `${srv.percentage}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
