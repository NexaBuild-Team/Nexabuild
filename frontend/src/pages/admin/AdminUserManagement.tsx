import React, { useState } from 'react';

// ─── 1. Comprehensive Backend Interfaces ───────────────────────────────────

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
  data?: AdminUserManagementPageData | null;
  isLoading?: boolean;
  error?: string | null;
  onAddUser?: (user: Partial<UserManagementRecord>) => void;
  onDeleteUser?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
  onExportCSV?: () => void;
}

// ─── Mock Fallback Data ─────────────────────────────────────────────────────

const defaultUsers: UserManagementRecord[] = [
  { id: '#USR1000', name: 'Amara Diallo', avatar: 'AD', role: 'Property Buyer', email: 'amara.diallo@email.com', status: 'Active', joined: 'Jan 14, 2024', lastLogin: 'Dec 12, 2024' },
  { id: '#USR1001', name: 'James Osei', avatar: 'JO', role: 'Real Estate Agent', email: 'james.osei@email.com', status: 'Pending', joined: 'Jan 13, 2024', lastLogin: 'Dec 11, 2024' },
  { id: '#USR1002', name: 'Priya Sharma', avatar: 'PS', role: 'Construction Firm', email: 'priya.sharma@email.com', status: 'Active', joined: 'Jan 11, 2024', lastLogin: 'Dec 12, 2024' },
  { id: '#USR1003', name: 'Kwame Mensah', avatar: 'KM', role: 'Architect', email: 'kwame.mensah@email.com', status: 'Active', joined: 'Jan 10, 2024', lastLogin: 'Dec 10, 2024' },
  { id: '#USR1004', name: 'Elena Petrov', avatar: 'EP', role: 'Property Buyer', email: 'elena.petrov@email.com', status: 'Suspended', joined: 'Jan 08, 2024', lastLogin: 'Dec 05, 2024' },
  { id: '#USR1005', name: 'Tariq Al-Mansoor', avatar: 'TA', role: 'Real Estate Agent', email: 'tariq.mansoor@email.com', status: 'Active', joined: 'Jan 05, 2024', lastLogin: 'Dec 12, 2024' },
  { id: '#USR1006', name: 'Siti Aminah', avatar: 'SA', role: 'Architect', email: 'siti.aminah@email.com', status: 'Pending', joined: 'Jan 04, 2024', lastLogin: 'Dec 09, 2024' },
  { id: '#USR1007', name: 'Kasun Fernando', avatar: 'KF', role: 'Property Buyer', email: 'kasun.f@email.com', status: 'Active', joined: 'Jan 03, 2024', lastLogin: 'Dec 08, 2024' },
  { id: '#USR1008', name: 'Nimali Silva', avatar: 'NS', role: 'Real Estate Agent', email: 'nimali.s@email.com', status: 'Active', joined: 'Jan 02, 2024', lastLogin: 'Dec 07, 2024' }
];

// ─── Component Implementation ───────────────────────────────────────────────

export default function AdminUserManagement({
  data = null,
  isLoading = false,
  error = null,
  onAddUser,
  onDeleteUser,
  onToggleStatus,
  onExportCSV
}: AdminUserManagementProps) {
  const [usersState, setUsersState] = useState<UserManagementRecord[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('Property Buyer');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const users = data?.users !== undefined 
    ? data.users 
    : (usersState.length > 0 ? usersState : defaultUsers);

  const metrics = data?.metrics;

  const totalUsersCount = metrics?.totalUsersCount ?? 12480;
  const activeCount = metrics?.activeCount ?? 9842;
  const pendingCount = metrics?.pendingCount ?? 184;
  const suspendedCount = metrics?.suspendedCount ?? 62;

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

  const handleToggleStatus = (id: string) => {
    if (onToggleStatus) {
      onToggleStatus(id);
    } else {
      setUsersState(prev => {
        const source = prev.length > 0 ? prev : defaultUsers;
        return source.map((u) => {
          if (u.id === id) {
            let nextStatus: 'Active' | 'Pending' | 'Suspended' = 'Active';
            if (u.status === 'Active') nextStatus = 'Suspended';
            else if (u.status === 'Suspended') nextStatus = 'Pending';
            return { ...u, status: nextStatus };
          }
          return u;
        });
      });
    }
  };

  const handleDeleteUser = (id: string) => {
    if (onDeleteUser) {
      onDeleteUser(id);
    } else {
      if (window.confirm('Are you sure you want to delete this user?')) {
        setUsersState(prev => {
          const source = prev.length > 0 ? prev : defaultUsers;
          return source.filter((u) => u.id !== id);
        });
      }
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    const initials = newUserName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();

    const newUser: UserManagementRecord = {
      id: `#USR${1000 + users.length}`,
      name: newUserName,
      avatar: initials || 'US',
      role: newUserRole,
      email: newUserEmail,
      status: 'Active',
      joined: 'Jan 15, 2026',
      lastLogin: 'Dec 12, 2026'
    };

    if (onAddUser) {
      onAddUser(newUser);
    } else {
      setUsersState(prev => [newUser, ...(prev.length > 0 ? prev : defaultUsers)]);
    }

    setNewUserName('');
    setNewUserEmail('');
    setShowAddUserModal(false);
  };

  // ─── 2. Skeleton Loading State ─────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col gap-6 p-6 lg:p-8 animate-pulse max-w-[1400px] mx-auto">
        <div className="h-16 bg-gray-200 rounded-2xl w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-gray-200 rounded-2xl" />
          ))}
        </div>
        <div className="h-96 bg-gray-200 rounded-2xl w-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start p-6 lg:p-8 space-y-8 bg-gradient-to-r from-[#e6e0d4] to-[#fcf9f8]">
      <div className="w-full max-w-[1400px] mx-auto space-y-8">
        
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

        {/* Header Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-[#1d1d1d] tracking-tight">User Management</h1>
            <p className="text-xs text-gray-500 mt-1">Manage system administrators, agents, architects, and buyers</p>
          </div>
          <button
            onClick={() => setShowAddUserModal(true)}
            className="flex items-center gap-2 rounded-xl bg-[#345b79] hover:bg-[#345b79]/90 px-5 py-2.5 text-xs font-bold text-white shadow-sm"
          >
            <span className="text-base font-bold">+</span>
            <span>Add New User</span>
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          <div className="bg-white border border-[#ccb7a3]/20 rounded-2xl p-6 shadow-sm flex items-center gap-5">
            <div className="size-14 rounded-full bg-[#345b79]/10 flex items-center justify-center text-[#345b79] shrink-0">
              <img src="/svg/agent.svg" alt="" className="size-6" />
            </div>
            <div>
              <h4 className="text-2xl font-extrabold text-[#1d1d1d]">
                {totalUsersCount.toLocaleString()}
              </h4>
              <span className="text-[11px] font-bold text-[#6b879c] tracking-wider uppercase">
                Total Users
              </span>
            </div>
          </div>

          <div className="bg-white border border-[#ccb7a3]/20 rounded-2xl p-6 shadow-sm flex items-center gap-5">
            <div className="size-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0">
              <img src="/svg/checkMark.svg" alt="" className="size-6 filter drop-shadow" />
            </div>
            <div>
              <h4 className="text-2xl font-extrabold text-[#1d1d1d]">
                {activeCount.toLocaleString()}
              </h4>
              <span className="text-[11px] font-bold text-[#6b879c] tracking-wider uppercase">
                Active Users
              </span>
            </div>
          </div>

          <div className="bg-white border border-[#ccb7a3]/20 rounded-2xl p-6 shadow-sm flex items-center gap-5">
            <div className="size-14 rounded-full bg-amber-50 flex items-center justify-center text-amber-700 shrink-0">
              <img src="/svg/clock.svg" alt="" className="size-6" />
            </div>
            <div>
              <h4 className="text-2xl font-extrabold text-[#1d1d1d]">
                {pendingCount}
              </h4>
              <span className="text-[11px] font-bold text-[#6b879c] tracking-wider uppercase">
                Pending Approval
              </span>
            </div>
          </div>

          <div className="bg-white border border-[#ccb7a3]/20 rounded-2xl p-6 shadow-sm flex items-center gap-5">
            <div className="size-14 rounded-full bg-red-50 flex items-center justify-center text-red-700 shrink-0">
              <img src="/svg/info.svg" alt="" className="size-6" />
            </div>
            <div>
              <h4 className="text-2xl font-extrabold text-[#1d1d1d]">
                {suspendedCount}
              </h4>
              <span className="text-[11px] font-bold text-[#6b879c] tracking-wider uppercase">
                Suspended
              </span>
            </div>
          </div>
        </div>

        {/* Filtering & Table Section */}
        <div className="bg-white border border-[#ccb7a3]/20 rounded-2xl shadow-sm overflow-hidden w-full">
          {/* Filter Toolbar */}
          <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              {/* Search */}
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  className="w-full rounded-xl bg-gray-50 border border-gray-200 py-2.5 pl-10 pr-4 text-xs font-medium text-[#1d1d1d] placeholder-gray-400 focus:outline-none focus:border-[#345b79]"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <img src="/svg/eye.svg" alt="" className="size-4 opacity-50" />
                </div>
              </div>

              {/* Role dropdown */}
              <select
                value={roleFilter}
                onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
                className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-2.5 text-xs font-bold text-[#1d1d1d] focus:outline-none cursor-pointer"
              >
                <option>All Roles</option>
                <option>Property Buyer</option>
                <option>Real Estate Agent</option>
                <option>Architect</option>
                <option>Construction Firm</option>
              </select>

              {/* Status dropdown */}
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-2.5 text-xs font-bold text-[#1d1d1d] focus:outline-none cursor-pointer"
              >
                <option>All Statuses</option>
                <option>Active</option>
                <option>Pending</option>
                <option>Suspended</option>
              </select>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <button 
                onClick={() => onExportCSV ? onExportCSV() : alert('Exporting Users CSV...')}
                className="flex items-center gap-2 border border-gray-200 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-[#1d1d1d] hover:bg-gray-50 cursor-pointer"
              >
                <img src="/svg/bookmark.svg" alt="" className="size-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[800px] text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Email</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Joined</th>
                  <th className="py-4 px-6">Last Login</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-[#1d1d1d]">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-[#345b79]/10 text-[#345b79] flex items-center justify-center font-bold text-xs shrink-0">
                          {user.avatar}
                        </div>
                        <div>
                          <div>{user.name}</div>
                          <div className="text-[10px] text-gray-400 font-normal">ID: {user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-[10px] font-bold">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600 font-semibold">{user.email}</td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold select-none cursor-pointer ${
                          user.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : user.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        <span className={`size-1.5 rounded-full ${
                          user.status === 'Active' ? 'bg-emerald-600' : user.status === 'Pending' ? 'bg-amber-600' : 'bg-red-600'
                        }`} />
                        {user.status}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-gray-400 font-medium">{user.joined}</td>
                    <td className="py-4 px-6 text-gray-400 font-medium">{user.lastLogin}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer">
                          <img src="/svg/eye.svg" alt="View" className="size-3.5" />
                        </button>
                        <button onClick={() => handleDeleteUser(user.id)} className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer">
                          <img src="/svg/clock.svg" alt="Delete" className="size-3.5 filter hue-rotate-320" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls Bar */}
          <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-gray-500 bg-white">
            <span className="text-gray-400">
              Showing {filteredUsers.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Previous
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`size-8 rounded-lg flex items-center justify-center font-bold text-xs cursor-pointer transition-colors ${
                      currentPage === page ? 'bg-[#345b79] text-white' : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-gray-100">
            <h4 className="text-lg font-bold text-[#1d1d1d]">Add New User</h4>
            <p className="text-xs text-gray-400 mb-5">Create a new administrator, agent, or client profile.</p>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold text-[#6b879c] uppercase tracking-wider mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priyantha Perera"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-semibold text-[#1d1d1d] outline-none focus:border-[#345b79]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-[#6b879c] uppercase tracking-wider mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. priyantha@email.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-semibold text-[#1d1d1d] outline-none focus:border-[#345b79]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-[#6b879c] uppercase tracking-wider mb-1">System Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-[#1d1d1d] outline-none cursor-pointer"
                >
                  <option>Property Buyer</option>
                  <option>Real Estate Agent</option>
                  <option>Architect</option>
                  <option>Construction Firm</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAddUserModal(false)} className="px-5 py-2.5 rounded-full text-xs font-bold text-gray-500 cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 bg-[#345b79] text-white rounded-full text-xs font-bold shadow-sm cursor-pointer">
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
