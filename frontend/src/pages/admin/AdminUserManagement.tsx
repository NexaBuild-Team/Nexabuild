import { useState, useEffect } from 'react';
import { adminApi } from '../../services/adminApi';

export interface UserManagementRecord {
  id: string;
  name: string;
  avatar: string;
  role: string;
  email: string;
  status: 'Active' | 'Pending' | 'Suspended';
  joined: string;
  lastLogin: string;
}

export interface UserManagementMetrics {
  totalUsersCount?: number;
  activeCount?: number;
  pendingCount?: number;
  suspendedCount?: number;
}

export interface AdminUserManagementPageData {
  metrics?: UserManagementMetrics;
  users?: UserManagementRecord[];
}

export interface AdminUserManagementProps {
  defaultRole?: string;
  data?: AdminUserManagementPageData | null;
  isLoading?: boolean;
  error?: string | null;
  onAddUser?: (user: Partial<UserManagementRecord>) => void;
  onDeleteUser?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
  onExportCSV?: () => void;
}

const getRoleLabel = (role: string) => {
  switch (role) {
    case 'USER':
    case 'BUYER':
      return 'Property Buyer';
    case 'AGENT':
      return 'Real Estate Agent';
    case 'ARCHITECT':
      return 'Architect';
    case 'CONTRACTOR':
      return 'Construction Firm';
    case 'ADMIN':
      return 'Administrator';
    default:
      return role;
  }
};

export default function AdminUserManagement({
  defaultRole,
  data: propsData = null,
  isLoading: propsLoading = false,
  error: propsError = null,
  onAddUser: _onAddUser,
  onDeleteUser: _onDeleteUser,
  onToggleStatus: _onToggleStatus,
  onExportCSV: _onExportCSV
}: AdminUserManagementProps) {
  const [usersData, setUsersData] = useState<{ metrics: UserManagementMetrics; users: UserManagementRecord[] } | null>(
    propsData ? { metrics: propsData.metrics || {}, users: propsData.users || [] } : null
  );
  const [loading, setLoading] = useState<boolean>(!propsData && propsLoading);
  const [error, setError] = useState<string | null>(propsError);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState(defaultRole || 'All Roles');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  // Edit Modal State
  const [editingUser, setEditingUser] = useState<UserManagementRecord | null>(null);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState('BUYER');
  const [editStatus, setEditStatus] = useState<'Active' | 'Pending' | 'Suspended'>('Active');
  const [savingUser, setSavingUser] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await adminApi.getUsers();
      setUsersData(res as any);
    } catch (err: any) {
      console.error('Failed to fetch user management data:', err);
      setError('Failed to load user management data from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!propsData) {
      fetchUsers();
    }
  }, [propsData]);

  const users = usersData?.users || [];
  const metrics = usersData?.metrics;

  const totalUsersCount = metrics?.totalUsersCount ?? 0;
  const activeCount = metrics?.activeCount ?? 0;
  const pendingCount = metrics?.pendingCount ?? 0;
  const suspendedCount = metrics?.suspendedCount ?? 0;

  // Filter Logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All Roles' || u.role === roleFilter;
    const matchesStatus =
      statusFilter === 'All Statuses' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination Calculations
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleOpenEditModal = (u: UserManagementRecord) => {
    setEditingUser(u);
    const nameParts = u.name.split(' ');
    setEditFirstName(nameParts[0] || '');
    setEditLastName(nameParts.slice(1).join(' ') || '');
    setEditEmail(u.email);
    setEditRole(u.role);
    setEditStatus(u.status);
  };

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
        status: editStatus,
      });
      alert('User updated successfully!');
      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      console.error('Failed to update user:', err);
      alert(err.response?.data?.message || 'Failed to update user.');
    } finally {
      setSavingUser(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminApi.deleteUser(id);
        alert('User deleted successfully!');
        fetchUsers();
      } catch (err: any) {
        console.error('Failed to delete user:', err);
        alert('Failed to delete user.');
      }
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827]">User Management</h1>
          <p className="text-xs sm:text-sm text-gray-500 font-semibold mt-0.5">
            Overview of registered system users, roles and access permissions
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            const csvContent = "data:text/csv;charset=utf-8," + users.map(u => `${u.id},${u.name},${u.email},${u.role},${u.status}`).join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "users_export.csv");
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
          <button onClick={fetchUsers} className="text-xs bg-red-100 px-3 py-1.5 rounded-lg hover:bg-red-200 font-bold cursor-pointer">
            Retry
          </button>
        </div>
      )}

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {[
          { label: 'Total Registered Users', val: totalUsersCount, icon: '/svg/agent.svg', bg: 'bg-blue-50 text-[#194360]' },
          { label: 'Active Users', val: activeCount, icon: '/svg/checkMark.svg', bg: 'bg-emerald-50 text-emerald-600' },
          { label: 'Pending Approvals', val: pendingCount, icon: '/svg/info.svg', bg: 'bg-amber-50 text-amber-600' },
          { label: 'Suspended Users', val: suspendedCount, icon: '/svg/construction.svg', bg: 'bg-red-50 text-red-600' }
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
              placeholder="Search by name, email..."
              className="w-full bg-gray-50/80 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-800 focus:outline-none focus:border-[#194360]"
            />
            <svg className="size-4 text-gray-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
              className="bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-extrabold text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="All Roles">All Roles</option>
              <option value="USER">Property Buyer</option>
              <option value="AGENT">Real Estate Agent</option>
              <option value="ARCHITECT">Architect</option>
              <option value="CONTRACTOR">Construction Firm</option>
              <option value="ADMIN">Administrator</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="bg-gray-50/80 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-extrabold text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* User Data Table */}
        {paginatedUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                  <th className="pb-3 px-3">USER NAME</th>
                  <th className="pb-3 px-3">ROLE</th>
                  <th className="pb-3 px-3">STATUS</th>
                  <th className="pb-3 px-3">JOINED</th>
                  <th className="pb-3 px-3">LAST LOGIN</th>
                  <th className="pb-3 px-3 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {paginatedUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-3 font-extrabold text-[#111827] flex items-center gap-3">
                      <div className="size-9 rounded-full bg-[#194360]/10 text-[#194360] font-extrabold flex items-center justify-center text-xs shrink-0">
                        {u.avatar || u.name.charAt(0)}
                      </div>
                      <div>
                        <span className="block font-extrabold text-[#111827]">{u.name}</span>
                        <span className="text-[10px] text-gray-400 font-semibold">{u.email}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-gray-600">{getRoleLabel(u.role)}</td>
                    <td className="py-3.5 px-3">
                      <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full ${
                        u.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                        u.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-gray-500 font-semibold">{u.joined}</td>
                    <td className="py-3.5 px-3 text-gray-400 font-medium">{u.lastLogin}</td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(u)}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 text-[#194360] hover:bg-blue-100 text-[10px] font-extrabold cursor-pointer transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(u.id)}
                          className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-[10px] font-extrabold cursor-pointer transition-colors"
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
            <p className="text-xs font-bold text-gray-400">No registered users found in database.</p>
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

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] p-6 sm:p-8 max-w-md w-full shadow-xl border border-gray-100 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-base font-extrabold text-[#111827]">Edit User Account</h3>
              <button onClick={() => setEditingUser(null)} className="text-xs font-bold text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-gray-500">First Name</label>
                  <input 
                    type="text"
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-gray-500">Last Name</label>
                  <input 
                    type="text"
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-gray-500">Email Address</label>
                <input 
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-gray-500">Role</label>
                  <select 
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800"
                  >
                    <option value="BUYER">Property Buyer</option>
                    <option value="AGENT">Real Estate Agent</option>
                    <option value="ARCHITECT">Architect</option>
                    <option value="CONTRACTOR">Construction Firm</option>
                    <option value="ADMIN">Administrator</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-gray-500">Status</label>
                  <select 
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-extrabold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingUser}
                  className="flex-1 py-2.5 rounded-xl bg-[#194360] text-white text-xs font-extrabold disabled:opacity-50"
                >
                  {savingUser ? 'Saving...' : 'Save User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
