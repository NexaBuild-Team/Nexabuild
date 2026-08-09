import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { adminApi } from '../../services/adminApi';
import type { AdminDashboardData } from '../../services/adminApi';

export interface AdminDashboardProps {
  data?: AdminDashboardData | null;
  isLoading?: boolean;
  error?: string | null;
  onApproveGovernance?: (id: string) => void;
  onRejectGovernance?: (id: string) => void;
  onViewAllUsers?: () => void;
  onViewAllProperties?: () => void;
}

export default function AdminDashboard({
  data: propsData = null,
  isLoading: propsLoading = false,
  error: propsError = null,
  onApproveGovernance,
  onRejectGovernance,
  onViewAllUsers,
  onViewAllProperties
}: AdminDashboardProps) {
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(propsData);
  const [loading, setLoading] = useState<boolean>(!propsData && propsLoading);
  const [error, setError] = useState<string | null>(propsError);
  const [governanceState, setGovernanceState] = useState<any[]>([]);

  // Edit User Modal State
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState('BUYER');
  const [editDistrict, setEditDistrict] = useState('');
  const [editStatus, setEditStatus] = useState('Active');
  const [savingUser, setSavingUser] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getDashboardData();
      setDashboardData(res);
    } catch (err: any) {
      console.error('Failed to fetch admin dashboard data:', err);
      setError('Failed to load admin dashboard data from backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!propsData) {
      fetchDashboard();
    }
  }, [propsData]);

  const kpis = dashboardData?.kpiStats || [
    { name: 'TOTAL USERS', value: '0', change: '0%', isPositive: false },
    { name: 'TOTAL PROPERTIES', value: '0', change: '0%', isPositive: false },
    { name: 'TOTAL LANDS', value: '0', change: '0%', isPositive: false },
    { name: 'TOTAL COMPANIES', value: '0', change: '0%', isPositive: false },
  ];

  const userGrowthData = dashboardData?.userGrowthData || [];
  const propertyGrowthData = dashboardData?.propertyGrowthData || [];
  const landGrowthData = dashboardData?.landGrowthData || [];
  const aiBarData = dashboardData?.aiBarData || [];
  const registrations = dashboardData?.registrations || [];
  const latestProperties = dashboardData?.latestProperties || [];
  const latestLands = dashboardData?.latestLands || [];
  const governanceListings = dashboardData?.governanceListings !== undefined 
    ? dashboardData.governanceListings 
    : governanceState;
  const popularDistricts = dashboardData?.popularDistricts || [];
  const activities = dashboardData?.activities || [];
  const notifications = dashboardData?.notifications || [];
  const health = dashboardData?.systemHealth || { cpuUsage: 0, memoryUsage: 0, apiUptime: 100, storageUsedGb: 0, storageTotalGb: 2000 };

  const handleApprove = (id: string) => {
    if (onApproveGovernance) {
      onApproveGovernance(id);
    } else {
      setGovernanceState((prev) => prev.map((item) => item.id === id ? { ...item, status: 'Approved' } : item));
    }
  };

  const handleReject = (id: string) => {
    if (onRejectGovernance) {
      onRejectGovernance(id);
    } else {
      setGovernanceState((prev) => prev.map((item) => item.id === id ? { ...item, status: 'Rejected' } : item));
    }
  };

  // Open Edit User Modal
  const handleOpenEditModal = (u: any) => {
    setEditingUser(u);
    const nameParts = (u.name || '').split(' ');
    setEditFirstName(nameParts[0] || '');
    setEditLastName(nameParts.slice(1).join(' ') || '');
    setEditEmail(u.email || '');
    setEditRole(u.role || 'BUYER');
    setEditDistrict(u.district || '');
    setEditStatus(u.status || 'Active');
  };

  // Submit User Edit
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      setSavingUser(true);
      await adminApi.updateUser(editingUser.id, {
        firstName: editFirstName,
        lastName: editLastName,
        email: editEmail,
        role: editRole,
        district: editDistrict,
        status: editStatus,
      });
      alert('User details updated successfully!');
      setEditingUser(null);
      fetchDashboard();
    } catch (err: any) {
      console.error('Failed to update user:', err);
      alert(err.response?.data?.message || 'Failed to update user details.');
    } finally {
      setSavingUser(false);
    }
  };

  // Delete User
  const handleDeleteUser = async (u: any) => {
    if (window.confirm(`Are you sure you want to delete user "${u.name}" (${u.email})?`)) {
      try {
        await adminApi.deleteUser(u.id);
        alert('User deleted successfully!');
        fetchDashboard();
      } catch (err: any) {
        console.error('Failed to delete user:', err);
        alert(err.response?.data?.message || 'Failed to delete user.');
      }
    }
  };

  // Skeleton Loading State
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#e6e0d4]/40 p-6 lg:p-8 animate-pulse space-y-6">
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
    <div className="w-full min-h-screen bg-[#e6e0d4]/40 p-4 sm:p-6 lg:p-8 space-y-6 text-[#1d1d1d] relative">
      
      {/* Global Error Banner */}
      {error && (
        <div className="w-full bg-red-50 border border-red-200 text-red-700 text-xs p-4 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <svg className="size-5 text-red-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold">{error}</span>
          </div>
          <button onClick={fetchDashboard} className="text-xs bg-red-100 px-3 py-1.5 rounded-lg hover:bg-red-200 font-bold cursor-pointer">
            Retry
          </button>
        </div>
      )}

      {/* TOP 4 KPI CARDS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white rounded-[20px] p-5 border border-gray-200/60 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="size-9 rounded-xl bg-[#345b79]/10 text-[#345b79] flex items-center justify-center shrink-0">
                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {idx === 0 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />}
                  {idx === 1 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />}
                  {idx === 2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />}
                  {idx === 3 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />}
                </svg>
              </div>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${kpi.isPositive ? 'text-emerald-600 bg-emerald-50' : 'text-gray-500 bg-gray-100'}`}>
                {kpi.change}
              </span>
            </div>
            <div>
              <h3 className="text-2xl lg:text-3xl font-black text-[#1d1d1d] tracking-tight">{kpi.value}</h3>
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mt-0.5">{kpi.name}</span>
            </div>
          </div>
        ))}
      </div>

      {/* MAIN TWO-COLUMN DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN (8 COLS) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Row 1: Recharts Growth Charts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* User Growth Chart */}
            <div className="bg-white rounded-[20px] p-5 border border-gray-200/60 shadow-sm flex flex-col justify-between h-52">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">USER GROWTH</span>
                  <h4 className="text-lg font-extrabold text-[#1d1d1d] mt-0.5">{kpis[0]?.value || 0}</h4>
                </div>
                <span className="text-[9px] font-bold text-gray-400">Last 12 mo</span>
              </div>
              <div className="h-24 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userGrowthData}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#9ca3af', fontWeight: 'bold' }} />
                    <Tooltip cursor={{ fill: '#e2e8f0' }} contentStyle={{ borderRadius: 8, fontSize: 10 }} />
                    <Bar dataKey="count" fill="#345b79" radius={[4, 4, 0, 0]} barSize={8} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Property Growth Chart */}
            <div className="bg-white rounded-[20px] p-5 border border-gray-200/60 shadow-sm flex flex-col justify-between h-52">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">PROPERTY GROWTH</span>
                  <h4 className="text-lg font-extrabold text-[#1d1d1d] mt-0.5">{kpis[1]?.value || 0}</h4>
                </div>
                <span className="text-[9px] font-bold text-gray-400">Last 12 mo</span>
              </div>
              <div className="h-24 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={propertyGrowthData}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#9ca3af', fontWeight: 'bold' }} />
                    <Tooltip cursor={{ fill: '#e2e8f0' }} contentStyle={{ borderRadius: 8, fontSize: 10 }} />
                    <Bar dataKey="count" fill="#be5d3f" radius={[4, 4, 0, 0]} barSize={8} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Land Growth Chart */}
            <div className="bg-white rounded-[20px] p-5 border border-gray-200/60 shadow-sm flex flex-col justify-between h-52">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">LAND GROWTH</span>
                  <h4 className="text-lg font-extrabold text-[#1d1d1d] mt-0.5">{kpis[2]?.value || 0}</h4>
                </div>
                <span className="text-[9px] font-bold text-gray-400">Last 12 mo</span>
              </div>
              <div className="h-24 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={landGrowthData}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#9ca3af', fontWeight: 'bold' }} />
                    <Tooltip cursor={{ fill: '#e2e8f0' }} contentStyle={{ borderRadius: 8, fontSize: 10 }} />
                    <Bar dataKey="count" fill="#928d64" radius={[4, 4, 0, 0]} barSize={8} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Row 2: Recent Registrations Table with Actions */}
          <div className="bg-white rounded-[24px] p-6 border border-gray-200/60 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#1d1d1d]">Recent Registrations</h3>
              <button onClick={onViewAllUsers} className="text-xs font-extrabold text-[#345b79] hover:underline cursor-pointer">
                View All
              </button>
            </div>

            {registrations.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[550px]">
                  <thead>
                    <tr className="border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                      <th className="pb-3 px-2">USER</th>
                      <th className="pb-3 px-2">ROLE</th>
                      <th className="pb-3 px-2">DISTRICT</th>
                      <th className="pb-3 px-2">DATE</th>
                      <th className="pb-3 px-2">STATUS</th>
                      <th className="pb-3 px-2 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs">
                    {registrations.map((u) => (
                      <tr key={u.id || u.email} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 px-2 font-extrabold text-[#1d1d1d] flex items-center gap-2.5">
                          <div className="size-7 rounded-full bg-[#345b79]/10 text-[#345b79] flex items-center justify-center font-bold text-[10px]">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <span className="block font-extrabold text-[#1d1d1d]">{u.name}</span>
                            <span className="text-[10px] text-gray-400 font-normal">{u.email}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 font-semibold text-gray-600">{u.role}</td>
                        <td className="py-3 px-2 font-semibold text-gray-500">{u.district}</td>
                        <td className="py-3 px-2 font-medium text-gray-400">{u.date}</td>
                        <td className="py-3 px-2">
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                            u.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(u)}
                              className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#345b79] hover:bg-blue-100 text-[10px] font-extrabold transition-colors cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u)}
                              className="px-2.5 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-[10px] font-extrabold transition-colors cursor-pointer"
                            >
                              Delete
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
                <p className="text-xs font-bold text-gray-400">No users registered in database.</p>
              </div>
            )}
          </div>

          {/* Row 3: Latest Properties & Latest Lands */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Latest Properties */}
            <div className="bg-white rounded-[24px] p-6 border border-gray-200/60 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-[#1d1d1d]">Latest Properties</h3>
                <button onClick={onViewAllProperties} className="text-xs font-bold text-[#345b79] hover:underline cursor-pointer">View All</button>
              </div>

              {latestProperties.length > 0 ? (
                <div className="space-y-3">
                  {latestProperties.map((p) => (
                    <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 bg-gray-50/50">
                      <img src={p.imageUrl} alt="" className="size-14 rounded-lg object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-extrabold text-[#1d1d1d] truncate">{p.title}</h4>
                        <p className="text-[10px] text-gray-400 font-medium truncate">{p.location}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-black uppercase bg-gray-200 px-1.5 py-0.5 rounded">{p.type}</span>
                          <span className="text-[9px] font-extrabold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">{p.status}</span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-[#345b79] shrink-0">{p.price}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-xs font-bold text-gray-400">No properties submitted.</p>
                </div>
              )}
            </div>

            {/* Latest Lands */}
            <div className="bg-white rounded-[24px] p-6 border border-gray-200/60 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-[#1d1d1d]">Latest Lands</h3>
                <button onClick={onViewAllProperties} className="text-xs font-bold text-[#345b79] hover:underline cursor-pointer">View All</button>
              </div>

              {latestLands.length > 0 ? (
                <div className="space-y-3">
                  {latestLands.map((l) => (
                    <div key={l.id} className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 bg-gray-50/50">
                      <img src={l.imageUrl} alt="" className="size-14 rounded-lg object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-extrabold text-[#1d1d1d] truncate">{l.title}</h4>
                        <p className="text-[10px] text-gray-400 font-medium truncate">{l.location}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${l.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                            {l.status}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-[#345b79] shrink-0">{l.price}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-xs font-bold text-gray-400">No lands submitted.</p>
                </div>
              )}
            </div>

          </div>

          {/* Row 4: Most Popular Districts & Market Insights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Most Popular Districts */}
            <div className="bg-white rounded-[24px] p-6 border border-gray-200/60 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-[#1d1d1d]">Most Popular Districts</h3>
                <span className="text-[10px] font-bold text-gray-400">By active listings</span>
              </div>

              {popularDistricts.length > 0 ? (
                <div className="space-y-3">
                  {popularDistricts.map((d, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-[#1d1d1d]">{d.name}</span>
                        <span className="text-gray-500">{d.count}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-[#345b79] h-full rounded-full" style={{ width: `${(d.count / 300) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-xs font-bold text-gray-400">No district metrics available.</p>
                </div>
              )}
            </div>

            {/* Market Insights */}
            <div className="bg-white rounded-[24px] p-6 border border-gray-200/60 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-[#1d1d1d]">Market Insights</h3>
                <span className="text-[10px] font-bold text-gray-400 font-medium">Sri Lanka Region</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50/80 rounded-xl border border-gray-100">
                  <span className="text-[9px] font-bold text-gray-400 uppercase block">AVG. PROPERTY PRICE</span>
                  <h4 className="text-sm font-black text-[#1d1d1d] mt-1">LKR 0</h4>
                  <span className="text-[9px] font-bold text-gray-400">0%</span>
                </div>
                <div className="p-3 bg-gray-50/80 rounded-xl border border-gray-100">
                  <span className="text-[9px] font-bold text-gray-400 uppercase block">AVG. LAND PRICE / PERCH</span>
                  <h4 className="text-sm font-black text-[#1d1d1d] mt-1">LKR 0</h4>
                  <span className="text-[9px] font-bold text-gray-400">0%</span>
                </div>
                <div className="p-3 bg-gray-50/80 rounded-xl border border-gray-100">
                  <span className="text-[9px] font-bold text-gray-400 uppercase block">DAYS ON MARKET (AVG)</span>
                  <h4 className="text-sm font-black text-[#1d1d1d] mt-1">0 days</h4>
                  <span className="text-[9px] font-bold text-gray-400">0%</span>
                </div>
                <div className="p-3 bg-gray-50/80 rounded-xl border border-gray-100">
                  <span className="text-[9px] font-bold text-gray-400 uppercase block">AGENT ACTIVITY SCORE</span>
                  <h4 className="text-sm font-black text-[#1d1d1d] mt-1">0/100</h4>
                  <span className="text-[9px] font-bold text-gray-400">0%</span>
                </div>
              </div>
            </div>

          </div>

          {/* Row 5: AI Recommendation Analytics (Dark Blue Card with Recharts) */}
          <div className="bg-[#194360] rounded-[24px] p-6 lg:p-8 text-white space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold tracking-tight">AI Recommendation Analytics</h3>
                <p className="text-xs text-white/70 font-medium">Powered by NexAI Engine • Real-time matching and verification</p>
              </div>
              <span className="bg-white/15 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                AI Active
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <h4 className="text-2xl lg:text-3xl font-black">0</h4>
                <span className="text-[9px] font-bold text-white/60 uppercase">RECOMMENDATIONS TODAY</span>
              </div>
              <div>
                <h4 className="text-2xl lg:text-3xl font-black">0%</h4>
                <span className="text-[9px] font-bold text-white/60 uppercase">AVG. MATCH SCORE</span>
              </div>
              <div>
                <h4 className="text-2xl lg:text-3xl font-black">0</h4>
                <span className="text-[9px] font-bold text-white/60 uppercase">CONVERTED TO VIEWS</span>
              </div>
              <div>
                <h4 className="text-2xl lg:text-3xl font-black">0</h4>
                <span className="text-[9px] font-bold text-white/60 uppercase">LEADS GENERATED</span>
              </div>
            </div>

            <div className="h-20 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={aiBarData.length > 0 ? aiBarData : [
                  { month: 'Jul', count: 0 },
                  { month: 'Aug', count: 0 },
                  { month: 'Sep', count: 0 },
                  { month: 'Oct', count: 0 },
                  { month: 'Nov', count: 0 },
                  { month: 'Dec', count: 0 },
                  { month: 'Jan', count: 0 },
                ]}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.6)', fontWeight: 'bold' }} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.1)' }} contentStyle={{ backgroundColor: '#123249', border: 'none', borderRadius: 8, fontSize: 10, color: '#fff' }} />
                  <Bar dataKey="count" fill="#ff906e" radius={[4, 4, 0, 0]} barSize={10} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Row 6: Governance Pending Listings */}
          <div className="bg-white rounded-[24px] p-6 border border-gray-200/60 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#1d1d1d]">Pending Listings</h3>
              <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-[10px] font-extrabold">
                {governanceListings.filter(i => i.status === 'Pending').length} Awaiting Review
              </span>
            </div>

            {governanceListings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                      <th className="pb-3 px-2">LISTING</th>
                      <th className="pb-3 px-2">TYPE</th>
                      <th className="pb-3 px-2">OWNER</th>
                      <th className="pb-3 px-2">DISTRICT</th>
                      <th className="pb-3 px-2">PRICE</th>
                      <th className="pb-3 px-2 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs">
                    {governanceListings.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/50">
                        <td className="py-3 px-2 font-extrabold text-[#1d1d1d]">{item.title}</td>
                        <td className="py-3 px-2"><span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] font-bold">{item.type}</span></td>
                        <td className="py-3 px-2 text-gray-600 font-medium">{item.owner}</td>
                        <td className="py-3 px-2 text-gray-500">{item.district}</td>
                        <td className="py-3 px-2 font-extrabold">{item.price}</td>
                        <td className="py-3 px-2 text-right">
                          {item.status === 'Pending' ? (
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => handleApprove(item.id)} className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-3 py-1 rounded-lg text-[10px] font-extrabold cursor-pointer">
                                Approve
                              </button>
                              <button onClick={() => handleReject(item.id)} className="bg-rose-100 text-rose-700 hover:bg-rose-200 px-3 py-1 rounded-lg text-[10px] font-extrabold cursor-pointer">
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className={`text-[10px] font-extrabold uppercase ${item.status === 'Approved' ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {item.status}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-xs font-bold text-gray-400">No pending listings awaiting review.</p>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Recent Activities */}
          <div className="bg-white rounded-[24px] p-6 border border-gray-200/60 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#1d1d1d]">Recent Activities</h3>
              <span className="text-xs font-bold text-[#345b79] cursor-pointer hover:underline">All</span>
            </div>

            {activities.length > 0 ? (
              <div className="space-y-3">
                {activities.map((act, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-gray-50/80 transition-colors">
                    <div className="size-2.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-extrabold text-[#1d1d1d]">{act.title}</h4>
                      <p className="text-[10px] font-medium text-gray-400 mt-0.5">{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-xs font-bold text-gray-400">No recent system activity.</p>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-[24px] p-6 border border-gray-200/60 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-[#1d1d1d]">Notifications</h3>

            {notifications.length > 0 ? (
              <div className="space-y-2.5">
                {notifications.map((n, idx) => (
                  <div key={idx} className={`p-3 rounded-2xl text-xs font-extrabold ${n.badgeBg} ${n.textColor} flex items-center justify-between`}>
                    <span>{n.title}</span>
                    <svg className="size-4 opacity-60 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-xs font-bold text-gray-400">No system notifications.</p>
              </div>
            )}
          </div>

          {/* System Health */}
          <div className="bg-white rounded-[24px] p-6 border border-gray-200/60 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-[#1d1d1d]">System Health</h3>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between font-extrabold text-gray-600">
                  <span>CPU USAGE</span>
                  <span>{health.cpuUsage}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${health.cpuUsage}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-extrabold text-gray-600">
                  <span>MEMORY</span>
                  <span>{health.memoryUsage}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-amber-600 h-full rounded-full" style={{ width: `${health.memoryUsage}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-extrabold text-gray-600">
                  <span>API UPTIME</span>
                  <span>{health.apiUptime}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#345b79] h-full rounded-full" style={{ width: `${health.apiUptime}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Storage Usage */}
          <div className="bg-white rounded-[24px] p-6 border border-gray-200/60 shadow-sm space-y-3">
            <h3 className="text-base font-extrabold text-[#1d1d1d]">Storage Usage</h3>
            <div className="flex items-baseline justify-between">
              <h4 className="text-xl font-black text-[#1d1d1d]">
                {health.storageUsedGb} GB <span className="text-xs font-medium text-gray-400">of {health.storageTotalGb} GB used</span>
              </h4>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-[#345b79] h-full rounded-full" 
                style={{ width: `${health.storageTotalGb > 0 ? (health.storageUsedGb / health.storageTotalGb) * 100 : 0}%` }} 
              />
            </div>
            <span className="text-[10px] font-extrabold text-gray-400 block">
              Used {health.storageUsedGb} GB ({health.storageTotalGb > 0 ? Math.round((health.storageUsedGb / health.storageTotalGb) * 100) : 0}%) | Free {health.storageTotalGb - health.storageUsedGb} GB
            </span>
          </div>

        </div>

      </div>

      {/* EDIT USER MODAL OVERLAY */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] p-6 sm:p-8 max-w-md w-full shadow-xl border border-gray-100 space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-[#345b79]/10 text-[#345b79] flex items-center justify-center shrink-0">
                  <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#1d1d1d]">Edit User & Role</h3>
                  <p className="text-xs text-gray-500 font-medium">Update account information and system privileges</p>
                </div>
              </div>
              <button 
                onClick={() => setEditingUser(null)} 
                className="size-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider">First Name</label>
                  <input 
                    type="text" 
                    value={editFirstName} 
                    onChange={(e) => setEditFirstName(e.target.value)} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#345b79]"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Last Name</label>
                  <input 
                    type="text" 
                    value={editLastName} 
                    onChange={(e) => setEditLastName(e.target.value)} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#345b79]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  value={editEmail} 
                  onChange={(e) => setEditEmail(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#345b79]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider">System Role</label>
                  <select 
                    value={editRole} 
                    onChange={(e) => setEditRole(e.target.value)} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-extrabold text-gray-800 focus:outline-none focus:border-[#345b79] cursor-pointer"
                  >
                    <option value="BUYER">BUYER (Property Buyer)</option>
                    <option value="AGENT">AGENT (Real Estate Agent)</option>
                    <option value="ARCHITECT">ARCHITECT (Architectural Designer)</option>
                    <option value="CONTRACTOR">CONTRACTOR (Construction Company)</option>
                    <option value="ADMIN">ADMIN (System Administrator)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider">Account Status</label>
                  <select 
                    value={editStatus} 
                    onChange={(e) => setEditStatus(e.target.value)} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-extrabold text-gray-800 focus:outline-none focus:border-[#345b79] cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-wider">District / Location</label>
                <input 
                  type="text" 
                  value={editDistrict} 
                  onChange={(e) => setEditDistrict(e.target.value)} 
                  placeholder="e.g. Colombo Central"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#345b79]"
                />
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setEditingUser(null)} 
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-extrabold hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={savingUser}
                  className="flex-1 py-2.5 rounded-xl bg-[#345b79] hover:bg-[#28475f] text-white text-xs font-extrabold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {savingUser ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
