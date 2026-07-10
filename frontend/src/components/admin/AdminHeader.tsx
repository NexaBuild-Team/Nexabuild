import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
}

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [currentDateString, setCurrentDateString] = useState('Wednesday, Dec 12, 2024');

  // Format date nicely
  useEffect(() => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      };
      const formatted = new Date().toLocaleDateString('en-US', options);
      setCurrentDateString(formatted);
    } catch (e) {
      // fallback
    }
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine Title based on current subroute
  const getHeaderTitle = () => {
    const path = location.pathname;
    if (path.includes('/users')) return 'User Management';
    if (path.includes('/properties')) return 'Property Moderation';
    if (path.includes('/analytics')) return 'Analytics Dashboard';
    return 'Admin Dashboard';
  };

  return (
    <header className="sticky top-0 z-30 flex h-[78px] shrink-0 items-center justify-between border-b border-[#ccb7a3]/30 bg-[#e6e0d4]/85 px-[16px] md:px-[32px] backdrop-blur-[12px] select-none">
      
      {/* Left Area: Sidebar Burger Trigger & Header Title */}
      {!searchExpanded && (
        <div className="flex items-center gap-[12px] min-w-0">
          <button
            onClick={onToggleSidebar}
            className="flex size-[36px] shrink-0 items-center justify-center rounded-[8px] border border-[#ccb7a3]/40 bg-[#ccb7a3]/30 text-[#345b79] lg:hidden hover:bg-[#ccb7a3]/50 transition-colors"
            aria-label="Toggle Sidebar"
          >
            <svg className="size-[20px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex flex-col items-start leading-tight min-w-0">
            <h2 className="text-[18px] md:text-[24px] font-extrabold text-[#345b79] truncate">
              {getHeaderTitle()}
            </h2>
            <span className="hidden sm:inline text-[11px] md:text-[12px] text-[#1d1d1d]/60 mt-[2px] font-medium">
              Welcome back, Super Admin — {currentDateString}
            </span>
          </div>
        </div>
      )}

      {/* Center Search Input Area */}
      <div className={`relative ${searchExpanded ? 'flex flex-1' : 'hidden md:block'} mx-[12px] max-w-[480px]`}>
        <input
          type="text"
          placeholder="Search users, listings..."
          className="w-full rounded-[8px] bg-[#ccb7a3]/30 border border-[#ccb7a3]/20 py-[10px] pl-[40px] pr-[36px] text-[13px] font-semibold text-[#1d1d1d] placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#345b79]/30"
          autoFocus={searchExpanded}
        />
        <div className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#1d1d1d]/60">
          <svg className="size-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Close expanded search trigger for Mobile */}
        {searchExpanded && (
          <button
            onClick={() => setSearchExpanded(false)}
            className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[#1d1d1d]/60 md:hidden hover:text-[#1d1d1d]"
          >
            <svg className="size-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Right Area: Expand search, Profile menu, Notifications */}
      <div className="flex items-center gap-[10px] md:gap-[16px] shrink-0">
        
        {/* Search expand toggle (visible only on mobile when not expanded) */}
        {!searchExpanded && (
          <button
            onClick={() => setSearchExpanded(true)}
            className="flex size-[38px] items-center justify-center rounded-[8px] bg-[#ccb7a3]/30 text-[#1d1d1d]/80 md:hidden hover:bg-[#ccb7a3]/50 transition-colors order-1"
          >
            <svg className="size-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        )}

        {/* Profile Avatar Dropdown (order-2 on mobile, md:order-2 on desktop) */}
        <div className="relative order-2 md:order-2" ref={dropdownRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-[5px] rounded-full lg:rounded-[8px] bg-[#ccb7a3]/30 p-[4px] lg:p-[5px] lg:pr-[12px] border border-[#ccb7a3]/10 hover:bg-[#ccb7a3]/50 transition-all text-left"
          >
            <div className="flex size-[32px] lg:size-[36px] shrink-0 items-center justify-center rounded-full lg:rounded-[8px] bg-[#345b79] text-white font-bold text-[13px] lg:text-[14px]">
              SA
            </div>
            <div className="hidden lg:flex flex-col pl-[8px] leading-tight">
              <span className="text-[13px] font-bold text-[#1d1d1d]">Super Admin</span>
              <span className="text-[9px] text-[#1d1d1d]/60">admin@nexabuild.com</span>
            </div>
            <svg className="hidden lg:block size-[14px] text-[#1d1d1d]/40 ml-[4px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-[8px] w-[200px] rounded-[8px] bg-white p-[8px] shadow-lg border border-[#ccb7a3]/30 ring-1 ring-black/5 z-50">
              <div className="lg:hidden px-[12px] py-[8px] border-b border-gray-100 mb-[4px]">
                <p className="text-[13px] font-bold text-[#1d1d1d]">Super Admin</p>
                <p className="text-[9px] text-[#1d1d1d]/50 truncate">admin@nexabuild.com</p>
              </div>
              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  navigate('/admin/profile');
                }}
                className="flex w-full items-center gap-[8px] rounded-[6px] px-[12px] py-[8px] text-[12px] font-semibold text-[#1d1d1d] hover:bg-gray-50 transition-colors"
              >
                My Profile
              </button>
              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  navigate('/admin/settings');
                }}
                className="flex w-full items-center gap-[8px] rounded-[6px] px-[12px] py-[8px] text-[12px] font-semibold text-[#1d1d1d] hover:bg-gray-50 transition-colors"
              >
                System Settings
              </button>
              <hr className="my-[4px] border-gray-100" />
              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  navigate('/login');
                }}
                className="flex w-full items-center gap-[8px] rounded-[6px] px-[12px] py-[8px] text-[12px] font-semibold text-red-600 hover:bg-red-50 transition-colors"
              >
                Log Out
              </button>
            </div>
          )}
        </div>

        {/* Notifications Trigger (order-3 on mobile to be at the end, md:order-1 on desktop to be on left of avatar) */}
        <div className="relative order-3 md:order-1">
          <button className="flex size-[38px] items-center justify-center rounded-[8px] bg-[#ccb7a3]/30 text-[#1d1d1d]/80 hover:bg-[#ccb7a3]/50 transition-colors">
            <svg className="size-[20px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <div className="absolute right-[6px] top-[6px] flex h-[16px] w-[16px] items-center justify-center rounded-full bg-[#be5d3f] border-2 border-[#e6e0d4] text-[8px] font-bold text-white leading-none">
              5
            </div>
          </button>
        </div>

      </div>

    </header>
  );
}
