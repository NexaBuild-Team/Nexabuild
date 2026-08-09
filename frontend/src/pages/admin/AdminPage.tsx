import { useState } from 'react';
import { Outlet } from 'react-router';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';

export default function AdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#e6e0d4] font-sans antialiased text-[#1d1d1d]">
      {/* Sidebar navigation */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main layout right panel */}
      <div className="flex flex-1 flex-col h-full overflow-hidden">
        {/* Common top header bar */}
        <AdminHeader onToggleSidebar={() => setSidebarOpen(true)} />

        {/* Subview display area */}
        <main className="flex-1 overflow-y-auto focus:outline-none flex flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
