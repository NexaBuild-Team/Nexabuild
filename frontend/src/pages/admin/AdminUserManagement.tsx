import { useState } from "react";

interface User {
  id: string;
  name: string;
  avatar: string;
  role: string;
  email: string;
  status: "Active" | "Pending" | "Suspended";
  joined: string;
  lastLogin: string;
}

const initialUsers: User[] = [
  {
    id: "#USR1000",
    name: "Amara Diallo",
    avatar: "AD",
    role: "Property Buyer",
    email: "amara.diallo@email.com",
    status: "Active",
    joined: "Jan 14, 2024",
    lastLogin: "Dec 12, 2024",
  },
  {
    id: "#USR1001",
    name: "James Osei",
    avatar: "JO",
    role: "Real Estate Agent",
    email: "james.osei@email.com",
    status: "Pending",
    joined: "Jan 13, 2024",
    lastLogin: "Dec 11, 2024",
  },
  {
    id: "#USR1002",
    name: "Priya Sharma",
    avatar: "PS",
    role: "Construction Firm",
    email: "priya.sharma@email.com",
    status: "Active",
    joined: "Jan 11, 2024",
    lastLogin: "Dec 12, 2024",
  },
  {
    id: "#USR1003",
    name: "Kwame Mensah",
    avatar: "KM",
    role: "Architect",
    email: "kwame.mensah@email.com",
    status: "Active",
    joined: "Jan 10, 2024",
    lastLogin: "Dec 10, 2024",
  },
  {
    id: "#USR1004",
    name: "Elena Petrov",
    avatar: "EP",
    role: "Property Buyer",
    email: "elena.petrov@email.com",
    status: "Suspended",
    joined: "Jan 08, 2024",
    lastLogin: "Dec 05, 2024",
  },
  {
    id: "#USR1005",
    name: "Tariq Al-Mansoor",
    avatar: "TA",
    role: "Real Estate Agent",
    email: "tariq.mansoor@email.com",
    status: "Active",
    joined: "Jan 05, 2024",
    lastLogin: "Dec 12, 2024",
  },
  {
    id: "#USR1006",
    name: "Siti Aminah",
    avatar: "SA",
    role: "Architect",
    email: "siti.aminah@email.com",
    status: "Pending",
    joined: "Jan 04, 2024",
    lastLogin: "Dec 09, 2024",
  },
];

export default function AdminUserManagement() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("Property Buyer");

  // Counts
  const totalUsersCount = 12480;
  const activeCount = 9842;
  const pendingCount = 184;
  const suspendedCount = 62;

  // Filter Logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "All Roles" || u.role === roleFilter;
    const matchesStatus =
      statusFilter === "All Statuses" || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleToggleStatus = (id: string) => {
    setUsers(
      users.map((u) => {
        if (u.id === id) {
          let nextStatus: "Active" | "Pending" | "Suspended" = "Active";
          if (u.status === "Active") nextStatus = "Suspended";
          else if (u.status === "Suspended") nextStatus = "Pending";
          return { ...u, status: nextStatus };
        }
        return u;
      }),
    );
  };

  const handleDeleteUser = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    const initials = newUserName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    const newUser: User = {
      id: `#USR${1000 + users.length}`,
      name: newUserName,
      avatar: initials || "US",
      role: newUserRole,
      email: newUserEmail,
      status: "Active",
      joined: "Jan 15, 2026",
      lastLogin: "Dec 12, 2026",
    };

    setUsers([newUser, ...users]);
    setNewUserName("");
    setNewUserEmail("");
    setShowAddUserModal(false);
  };

  return (
    <div className="h-full overflow-y-auto p-[20px] md:p-[32px] space-y-[32px] bg-[#e6e0d4]">
      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px]">
        <div className="bg-white border border-[#ccb7a3]/20 rounded-[12px] p-[24px] shadow-sm flex items-center gap-[20px]">
          <div className="size-[56px] rounded-full bg-[#345b79]/10 flex items-center justify-center text-[#345b79] shrink-0">
            <svg
              className="size-[28px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-[30px] font-extrabold text-[#1d1d1d]">
              {totalUsersCount.toLocaleString()}
            </h4>
            <span className="text-[11px] font-bold text-[#6b879c] tracking-[0.6px] uppercase">
              Total Users
            </span>
          </div>
        </div>
        <div className="bg-white border border-[#ccb7a3]/20 rounded-[12px] p-[24px] shadow-sm flex items-center gap-[20px]">
          <div className="size-[56px] rounded-full bg-[#495d38]/10 flex items-center justify-center text-[#495d38] shrink-0">
            <svg
              className="size-[28px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-[30px] font-extrabold text-[#1d1d1d]">
              {activeCount.toLocaleString()}
            </h4>
            <span className="text-[11px] font-bold text-[#6b879c] tracking-[0.6px] uppercase">
              Active Users
            </span>
          </div>
        </div>
        <div className="bg-white border border-[#ccb7a3]/20 rounded-[12px] p-[24px] shadow-sm flex items-center gap-[20px]">
          <div className="size-[56px] rounded-full bg-[#be5d3f]/10 flex items-center justify-center text-[#be5d3f] shrink-0">
            <svg
              className="size-[28px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-[30px] font-extrabold text-[#1d1d1d]">
              {pendingCount}
            </h4>
            <span className="text-[11px] font-bold text-[#6b879c] tracking-[0.6px] uppercase">
              Pending Approval
            </span>
          </div>
        </div>
        <div className="bg-white border border-[#ccb7a3]/20 rounded-[12px] p-[24px] shadow-sm flex items-center gap-[20px]">
          <div className="size-[56px] rounded-full bg-[#be5d3f]/15 flex items-center justify-center text-[#be5d3f] shrink-0">
            <svg
              className="size-[28px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-[30px] font-extrabold text-[#1d1d1d]">
              {suspendedCount}
            </h4>
            <span className="text-[11px] font-bold text-[#6b879c] tracking-[0.6px] uppercase">
              Suspended
            </span>
          </div>
        </div>
      </div>

      {/* Filtering & Table Section */}
      <div className="bg-white border border-[#ccb7a3]/20 rounded-[12px] shadow-sm overflow-hidden">
        {/* Filter Toolbar */}
        <div className="p-[16px] md:p-[20px] border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-[16px]">
          <div className="flex flex-wrap items-center gap-[12px] flex-1">
            {/* Search */}
            <div className="relative w-full sm:w-[280px]">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-[8px] bg-[#ccb7a3]/30 border border-[#ccb7a3]/20 py-[10px] pl-[40px] pr-[16px] text-[13px] font-semibold text-[#1d1d1d] placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#345b79]/30"
              />
              <div className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#1d1d1d]/60">
                <svg
                  className="size-[16px]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Role dropdown */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-[8px] bg-[#ccb7a3]/30 border border-[#ccb7a3]/20 px-[16px] py-[10px] text-[13px] font-bold text-[#1d1d1d] focus:outline-none focus:ring-1 focus:ring-[#345b79]/30"
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
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-[8px] bg-[#ccb7a3]/30 border border-[#ccb7a3]/20 px-[16px] py-[10px] text-[13px] font-bold text-[#1d1d1d] focus:outline-none focus:ring-1 focus:ring-[#345b79]/30"
            >
              <option>All Statuses</option>
              <option>Active</option>
              <option>Pending Approval</option>
              <option>Suspended</option>
            </select>
          </div>

          <div className="flex items-center gap-[12px] self-end sm:self-auto">
            <button className="flex items-center gap-[8px] border border-[#ccb7a3]/40 rounded-[8px] bg-white px-[20px] py-[10px] text-[13px] font-bold text-[#1d1d1d] hover:bg-gray-50">
              <svg
                className="size-[16px] text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Export CSV
            </button>
            <button
              onClick={() => setShowAddUserModal(true)}
              className="flex items-center gap-[8px] rounded-[8px] bg-[#345b79] px-[20px] py-[10px] text-[13px] font-bold text-white hover:bg-[#345b79]/90 shadow-sm"
            >
              <svg
                className="size-[16px]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add User
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#ccb7a3]/10 border-b border-[#ccb7a3]/20 text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                <th className="py-[16px] px-[24px]">User</th>
                <th className="py-[16px] px-[24px]">Role</th>
                <th className="py-[16px] px-[24px]">Email</th>
                <th className="py-[16px] px-[24px]">Status</th>
                <th className="py-[16px] px-[24px]">Joined</th>
                <th className="py-[16px] px-[24px]">Last Login</th>
                <th className="py-[16px] px-[24px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-[13px]">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50/40 transition-colors"
                >
                  {/* User Profile */}
                  <td className="py-[16px] px-[24px]">
                    <div className="flex items-center gap-[12px]">
                      <div className="size-[40px] rounded-full bg-[#345b79]/10 text-[#345b79] flex items-center justify-center font-bold text-[13px]">
                        {user.avatar}
                      </div>
                      <div className="leading-tight">
                        <div className="font-bold text-[#1d1d1d]">
                          {user.name}
                        </div>
                        <div className="text-[10px] text-gray-400 font-semibold">
                          ID: {user.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-[16px] px-[24px]">
                    <span className="inline-block rounded-full bg-[#6b879c]/10 text-[#345b79] px-[12px] py-[4px] text-[11px] font-bold">
                      {user.role}
                    </span>
                  </td>

                  {/* Email */}
                  <td className="py-[16px] px-[24px] text-gray-600 font-bold">
                    {user.email}
                  </td>

                  {/* Status */}
                  <td className="py-[16px] px-[24px]">
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      title="Click to cycle status"
                      className={`inline-flex items-center gap-[6px] rounded-full px-[10px] py-[3px] text-[11px] font-bold cursor-pointer transition-all border ${
                        user.status === "Active"
                          ? "bg-[#495d38]/10 text-[#495d38] border-[#495d38]/20"
                          : user.status === "Pending"
                            ? "bg-[#be5d3f]/10 text-[#be5d3f] border-[#be5d3f]/20"
                            : "bg-[#be5d3f]/15 text-[#be5d3f] border-[#be5d3f]/30"
                      }`}
                    >
                      <span
                        className={`size-[6px] rounded-full ${
                          user.status === "Active"
                            ? "bg-[#495d38]"
                            : "bg-[#be5d3f]"
                        }`}
                      />
                      {user.status}
                    </button>
                  </td>

                  {/* Joined */}
                  <td className="py-[16px] px-[24px] text-gray-500 font-semibold">
                    {user.joined}
                  </td>

                  {/* Last Login */}
                  <td className="py-[16px] px-[24px] text-gray-500 font-semibold">
                    {user.lastLogin}
                  </td>

                  {/* Actions */}
                  <td className="py-[16px] px-[24px] text-right">
                    <div className="flex items-center justify-end gap-[10px]">
                      <button className="flex items-center gap-[4px] border border-[#345b79]/20 hover:border-[#345b79]/50 hover:bg-[#345b79]/5 text-[#345b79] px-[10px] py-[6px] rounded-[6px] text-[11px] font-bold transition-all">
                        <svg
                          className="size-[12px]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="flex size-[28px] items-center justify-center rounded-[6px] border border-[#be5d3f]/40 text-[#be5d3f] hover:bg-[#be5d3f]/10 transition-colors"
                        title="Delete User"
                      >
                        <svg
                          className="size-[14px]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="p-[20px] border-t border-gray-100 flex items-center justify-between text-[13px] font-bold text-gray-500 bg-white">
          <button
            className="px-[12px] py-[6px] border border-[#ccb7a3]/40 rounded-[6px] hover:bg-gray-50 font-bold transition-all disabled:opacity-50"
            disabled
          >
            Previous
          </button>
          <div className="flex gap-[4px]">
            <button className="size-[32px] flex items-center justify-center rounded-[6px] bg-[#345b79] text-white font-bold">
              1
            </button>
            <button className="size-[32px] flex items-center justify-center rounded-[6px] hover:bg-gray-100">
              2
            </button>
            <button className="size-[32px] flex items-center justify-center rounded-[6px] hover:bg-gray-100">
              3
            </button>
          </div>
          <button className="px-[12px] py-[6px] border border-[#ccb7a3]/40 rounded-[6px] hover:bg-gray-50 font-bold transition-all">
            Next
          </button>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-[16px] backdrop-blur-[2px]">
          <div className="w-full max-w-[420px] rounded-[12px] bg-white p-[24px] shadow-lg border border-[#ccb7a3]/30">
            <h4 className="text-[18px] font-extrabold text-[#1d1d1d] mb-[4px]">
              Add New User
            </h4>
            <p className="text-[12px] text-gray-400 mb-[20px] font-semibold">
              Create a new administrator, agent, or client profile.
            </p>

            <form onSubmit={handleAddUser} className="space-y-[16px]">
              <div>
                <label className="block text-[11px] font-bold text-[#6b879c] uppercase tracking-wider mb-[6px]">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priyantha Perera"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full rounded-[8px] border border-[#ccb7a3]/40 px-[16px] py-[10px] text-[13px] font-semibold text-[#1d1d1d] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#345b79]/30"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6b879c] uppercase tracking-wider mb-[6px]">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. priyantha@email.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full rounded-[8px] border border-[#ccb7a3]/40 px-[16px] py-[10px] text-[13px] font-semibold text-[#1d1d1d] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#345b79]/30"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#6b879c] uppercase tracking-wider mb-[6px]">
                  System Role
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full rounded-[8px] border border-[#ccb7a3]/40 px-[16px] py-[10px] text-[13px] font-bold text-[#1d1d1d] focus:outline-none focus:ring-1 focus:ring-[#345b79]/30"
                >
                  <option>Property Buyer</option>
                  <option>Real Estate Agent</option>
                  <option>Architect</option>
                  <option>Construction Firm</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-[12px] pt-[8px]">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-[16px] py-[10px] border border-[#ccb7a3]/40 rounded-[8px] text-[13px] font-bold hover:bg-gray-50 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-[20px] py-[10px] bg-[#345b79] text-white rounded-[8px] text-[13px] font-bold hover:bg-[#345b79]/90 shadow-sm"
                >
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
