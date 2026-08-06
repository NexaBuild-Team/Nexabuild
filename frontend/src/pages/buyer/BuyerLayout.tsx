import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router';
import { useAuth } from '../../context/AuthContext';

export const BuyerLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: '📊' },
    { label: 'Saved Properties', href: '/dashboard/buyer/saved-properties', icon: '❤️' },
    { label: 'Saved Lands', href: '/dashboard/buyer/saved-lands', icon: '🏞️' },
    { label: 'Recently Viewed', href: '/dashboard/buyer/recently-viewed', icon: '👁️' },
    { label: 'Browse Properties', href: '/property-listing', icon: '🏠' },
    { label: 'Browse Lands', href: '/land', icon: '📍' },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') return location.pathname === '/dashboard' || location.pathname === '/dashboard/buyer';
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-[68px]">
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Left Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white rounded-2xl border border-gray-200/80 p-5 shrink-0 shadow-sm self-start sticky top-[88px]">
          {/* User Profile Header */}
          <div className="flex items-center gap-3 pb-5 mb-5 border-b border-gray-100">
            <div className="size-11 rounded-full bg-[#be5d3f] text-white flex items-center justify-center font-bold text-lg">
              {user?.firstName ? user.firstName[0] : user?.email[0]}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-gray-900 truncate">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.email}
              </span>
              <span className="text-xs text-gray-500 font-medium capitalize">Buyer Account</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5 flex-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive(item.href)
                    ? 'bg-[#345b79] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Logout Footer */}
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

        {/* Mobile Toggle Button */}
        <div className="lg:hidden flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 mb-2 w-full">
          <span className="text-xs font-bold text-[#345b79] uppercase tracking-wider">Buyer Portal</span>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="text-xs bg-[#345b79] text-white font-bold px-3 py-1.5 rounded-lg"
          >
            {mobileSidebarOpen ? 'Close Menu' : 'Dashboard Menu'}
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
                  isActive(item.href) ? 'bg-[#345b79] text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {children ? children : <Outlet />}
        </main>
      </div>
    </div>
  );
};
