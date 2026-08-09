import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext';

export interface NavItem {
  label: string;
  href: string;
  icon: string | React.ReactNode;
  sectionHeader?: string;
}

export interface RoleSidebarLayoutProps {
  portalTitle: string;
  roleLabel: string;
  navItems: NavItem[];
  children?: React.ReactNode;
}

export const RoleSidebarLayout: React.FC<RoleSidebarLayoutProps> = ({
  portalTitle,
  roleLabel: _roleLabel,
  navItems,
  children,
}) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const renderIcon = (icon: string | React.ReactNode) => {
    if (typeof icon === 'string') {
      if (icon.startsWith('/') || icon.endsWith('.svg')) {
        return <img src={icon} alt="" className="size-4 object-contain brightness-0 invert opacity-90" />;
      }
      return <span className="text-base">{icon}</span>;
    }
    return icon;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col lg:flex-row w-full font-normal text-[#111827]">
      {/* Left Blue Sidebar (Desktop - Spans Top to Bottom) */}
      <aside className="hidden lg:flex fixed top-0 bottom-0 left-0 w-[260px] bg-[#345b79] z-40 flex-col justify-between p-5 text-white shadow-xl overflow-y-auto">
        {/* Header Brand */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <div className="bg-white/15 flex items-center justify-center rounded-xl size-10 shrink-0">
              <img alt="NexaBuild Logo" className="size-5 object-contain" src="/src/assets/logo.png" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-base font-extrabold text-white leading-tight tracking-tight">NexaBuild</span>
              <span className="text-[10px] text-white/70 font-bold uppercase tracking-wider">{portalTitle}</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1 mt-2">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <React.Fragment key={item.href}>
                  {item.sectionHeader && (
                    <div className="pt-4 pb-1.5 px-3 text-[10px] font-extrabold tracking-widest text-white/40 uppercase">
                      {item.sectionHeader}
                    </div>
                  )}
                  <Link
                    to={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                      active
                        ? 'bg-[#52748c] text-white font-bold shadow-sm'
                        : 'text-white/80 hover:bg-white/10 hover:text-white font-medium'
                    }`}
                  >
                    <span className="size-4 shrink-0 flex items-center justify-center">
                      {renderIcon(item.icon)}
                    </span>
                    <span className="whitespace-normal leading-tight text-left min-w-0 flex-1">{item.label}</span>
                  </Link>
                </React.Fragment>
              );
            })}
          </nav>
        </div>

        {/* Sign Out Footer */}
        <div className="pt-4 border-t border-white/10 mt-auto">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white/80 hover:bg-red-500/20 hover:text-red-200 transition-colors"
          >
            <svg className="size-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Navigation Bar */}
      <div className="lg:hidden flex flex-col w-full bg-[#345b79] text-white p-4 shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/15 p-2 rounded-lg">
              <img alt="NexaBuild Logo" className="size-5 object-contain" src="/src/assets/logo.png" />
            </div>
            <div>
              <span className="text-sm font-bold block">{portalTitle}</span>
              <span className="text-[10px] text-white/70">{user?.firstName ? user.firstName : user?.email}</span>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-xs bg-white/20 hover:bg-white/30 text-white font-bold px-3 py-1.5 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? 'Close Menu' : 'Menu'}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="bg-[#2a4a63] text-white p-4 rounded-xl mt-3 shadow-md space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                  isActive(item.href) ? 'bg-[#52748c] text-white' : 'text-white/80 hover:bg-white/10'
                }`}
              >
                <span className="size-4 shrink-0 flex items-center justify-center">
                  {renderIcon(item.icon)}
                </span>
                <span className="whitespace-normal leading-tight text-left min-w-0 flex-1">{item.label}</span>
              </Link>
            ))}
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-200 hover:bg-red-500/20"
            >
              <svg className="size-4 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content View (Offset for desktop sidebar) */}
      <main className="flex-1 min-w-0 lg:pl-[260px] w-full min-h-screen">
        {children ? children : <Outlet />}
      </main>
    </div>
  );
};
