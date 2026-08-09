import { useState, useEffect } from 'react';
import { adminApi } from '../../services/adminApi';

export interface PropertyManagementRecord {
  id: string;
  title: string;
  category: string;
  owner: string;
  district: string;
  price: string;
  status: 'Active' | 'Pending' | 'Rejected';
  type: 'Property' | 'Land';
  date: string;
  imageUrl?: string;
}

export interface PropertyManagementMetrics {
  totalPropertiesCount?: number;
  activeCount?: number;
  pendingCount?: number;
  rejectedCount?: number;
}

export interface AdminPropertyManagementPageData {
  metrics?: PropertyManagementMetrics;
  properties?: PropertyManagementRecord[];
}

export interface AdminPropertyManagementProps {
  data?: AdminPropertyManagementPageData | null;
  isLoading?: boolean;
  error?: string | null;
  onApproveProperty?: (id: string) => void;
  onRejectProperty?: (id: string) => void;
  onDeleteProperty?: (id: string) => void;
  onExportCSV?: () => void;
}

export default function AdminPropertyManagement({
  data: propsData = null,
  isLoading: propsLoading = false,
  error: propsError = null,
  onApproveProperty: _onApproveProperty,
  onRejectProperty: _onRejectProperty,
  onDeleteProperty: _onDeleteProperty,
  onExportCSV: _onExportCSV
}: AdminPropertyManagementProps) {
  const [propsState, setPropsState] = useState<{ metrics: PropertyManagementMetrics; properties: PropertyManagementRecord[] } | null>(
    propsData ? { metrics: propsData.metrics || {}, properties: propsData.properties || [] } : null
  );
  const [loading, setLoading] = useState<boolean>(!propsData && propsLoading);
  const [error, setError] = useState<string | null>(propsError);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getProperties();
      setPropsState(res as any);
    } catch (err: any) {
      console.error('Failed to fetch property management data:', err);
      setError('Failed to load property moderation data from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!propsData) {
      fetchProperties();
    }
  }, [propsData]);

  const properties = propsState?.properties || [];
  const metrics = propsState?.metrics;

  const totalPropertiesCount = metrics?.totalPropertiesCount ?? 0;
  const activeCount = metrics?.activeCount ?? 0;
  const pendingCount = metrics?.pendingCount ?? 0;
  const rejectedCount = metrics?.rejectedCount ?? 0;

  // Filter Logic
  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.district.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === 'All Categories' || p.category === categoryFilter;
    const matchesStatus =
      statusFilter === 'All Statuses' || p.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination Calculations
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProperties = filteredProperties.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Skeleton Loading State
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#f8fafc] p-6 lg:p-8 animate-pulse space-y-6 max-w-[1400px] mx-auto">
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
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">Property Moderation</h1>
          <p className="text-xs sm:text-sm text-gray-500 font-semibold mt-0.5">
            Review, approve, or reject submitted properties and land listings
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            const csvContent = "data:text/csv;charset=utf-8," + properties.map(p => `${p.id},${p.title},${p.price},${p.type},${p.status}`).join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "properties_export.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          className="bg-[#194360] hover:bg-[#123249] text-white text-xs font-extrabold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
        >
          <svg className="size-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Export CSV</span>
        </button>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="w-full bg-red-50 border border-red-200 text-red-700 text-xs p-4 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <img src="/svg/info.svg" alt="Error" className="size-5 shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
          <button onClick={fetchProperties} className="text-xs bg-red-100 px-3 py-1.5 rounded-lg hover:bg-red-200 font-bold cursor-pointer">
            Retry
          </button>
        </div>
      )}

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {[
          { label: 'Total Submitted Listings', val: totalPropertiesCount, icon: '/svg/home.svg', bg: 'bg-blue-50 text-[#194360]' },
          { label: 'Active Listings', val: activeCount, icon: '/svg/checkMark.svg', bg: 'bg-emerald-50 text-emerald-600' },
          { label: 'Pending Moderation', val: pendingCount, icon: '/svg/info.svg', bg: 'bg-amber-50 text-amber-600' },
          { label: 'Rejected Listings', val: rejectedCount, icon: '/svg/construction.svg', bg: 'bg-red-50 text-red-600' }
        ].map((card, idx) => (
          <div key={idx} className="bg-white rounded-[20px] p-5 border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-500">{card.label}</span>
              <div className={`size-9 rounded-xl ${card.bg} flex items-center justify-center shrink-0`}>
                <img alt="" className="size-4.5 opacity-80" src={card.icon} />
              </div>
            </div>
            <h3 className="text-2xl lg:text-3xl font-extrabold text-[#111827]">{card.val}</h3>
          </div>
        ))}
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm space-y-6">
        
        {/* Search & Filter Control Toolbar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input 
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search by title, location..."
              className="w-full bg-gray-50/80 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#194360]"
            />
            <svg className="size-4 text-gray-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
              className="bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-extrabold text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="All Categories">All Categories</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Land">Land</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-extrabold text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Property Data Table */}
        {paginatedProperties.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                  <th className="pb-3 px-3">PROPERTY LISTING</th>
                  <th className="pb-3 px-3">TYPE</th>
                  <th className="pb-3 px-3">DISTRICT</th>
                  <th className="pb-3 px-3">PRICE</th>
                  <th className="pb-3 px-3">STATUS</th>
                  <th className="pb-3 px-3 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {paginatedProperties.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-3 font-extrabold text-[#111827] flex items-center gap-3">
                      <img src={p.imageUrl} alt="" className="size-10 rounded-xl object-cover shrink-0 border border-gray-100" />
                      <div>
                        <span className="block font-extrabold text-[#111827]">{p.title}</span>
                        <span className="text-[10px] text-gray-400 font-semibold">{p.category}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3"><span className="bg-gray-100 px-2.5 py-0.5 rounded font-extrabold text-[10px]">{p.type}</span></td>
                    <td className="py-3.5 px-3 font-semibold text-gray-500">{p.district}</td>
                    <td className="py-3.5 px-3 font-extrabold text-[#194360]">{p.price}</td>
                    <td className="py-3.5 px-3">
                      <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full ${
                        p.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                        p.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button type="button" className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[10px] font-extrabold cursor-pointer">Approve</button>
                        <button type="button" className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-[10px] font-extrabold cursor-pointer">Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-xs font-bold text-gray-400">No property or land listings found in database.</p>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <span className="text-xs font-bold text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-extrabold text-gray-600 disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-extrabold text-gray-600 disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
