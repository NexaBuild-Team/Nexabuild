import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router';
import { useAuth } from '../../context/AuthContext';

export const ArchitectLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: '📊' },
    { label: 'Browse Designs', href: '/designs', icon: '📐' },
    { label: 'Architect Directory', href: '/architects', icon: '🏢' },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') return location.pathname === '/dashboard' || location.pathname === '/dashboard/architecture';
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-[68px]">
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Left Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white rounded-2xl border border-gray-200/80 p-5 shrink-0 shadow-sm self-start sticky top-[88px]">
          <div className="flex items-center gap-3 pb-5 mb-5 border-b border-gray-100">
            <div className="size-11 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-lg">
              {user?.firstName ? user.firstName[0] : user?.email[0]}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-gray-900 truncate">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.email}
              </span>
              <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider">Architect Account</span>
            </div>
          </div>

          <nav className="space-y-1.5 flex-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive(item.href)
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="pt-4 mt-6 border-t border-gray-100">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
            >
              <span className="text-base">🚪</span>
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile Toggle */}
        <div className="lg:hidden flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 mb-2 w-full">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Architect Studio</span>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="text-xs bg-slate-800 text-white font-bold px-3 py-1.5 rounded-lg"
          >
            {mobileSidebarOpen ? 'Close Menu' : 'Studio Menu'}
          </button>
        </div>

        {mobileSidebarOpen && (
          <div className="lg:hidden bg-white p-4 rounded-xl border border-gray-200 mb-4 w-full space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                  isActive(item.href) ? 'bg-slate-800 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        )}

        <main className="flex-1 min-w-0">
          {children ? children : <Outlet />}
        </main>
      </div>
    </div>
  );
};
