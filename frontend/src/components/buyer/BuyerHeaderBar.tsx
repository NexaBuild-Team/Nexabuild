import React from 'react';
import { useAuth } from '../../context/AuthContext';

export const BuyerHeaderBar: React.FC = () => {
  const { user } = useAuth();
  const userName = user?.firstName ? `${user.firstName} ${user.lastName || ''}` : (user?.email || 'Kasun Perera');

  return (
    <header className="flex items-center justify-between gap-4 w-full mb-6">
      {/* Left Search Bar */}
      <div className="relative flex-1 max-w-md">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="size-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search properties, lands, areas..."
          className="w-full bg-white rounded-full pl-11 pr-5 py-3 text-xs sm:text-sm text-gray-800 placeholder-gray-400 border border-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#345b79]/20 transition-all"
        />
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-4 shrink-0">
        {/* Notification Bell */}
        <div className="relative size-11 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
          <svg className="size-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="size-2 rounded-full bg-[#be5d3f] absolute top-3 right-3 ring-2 ring-white" />
        </div>

        {/* User Info & Avatar */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right leading-tight hidden sm:flex">
            <span className="text-sm font-extrabold text-[#111827]">{userName}</span>
            <span className="text-[11px] text-gray-500 font-semibold">Property Buyer</span>
          </div>
          <div className="size-11 rounded-full bg-[#be5d3f] text-white font-extrabold flex items-center justify-center text-sm shadow-sm shrink-0 border-2 border-white">
            {user?.firstName ? user.firstName[0] : user?.email ? user.email[0].toUpperCase() : 'K'}
          </div>
        </div>
      </div>
    </header>
  );
};
