import React from 'react';
import { Outlet } from 'react-router';
import { RoleSidebarLayout } from '../../components/RoleSidebarLayout';

export const BuyerLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: '/svg/grid-view-icon.svg',
    },
    {
      label: 'AI Property Recommendations',
      href: '/property-listing',
      icon: '/svg/home.svg',
    },
    {
      label: 'AI Land Recommendations',
      href: '/land',
      icon: '/svg/land-plot-icon.svg',
    },
    {
      label: 'Saved Properties',
      href: '/dashboard/buyer/saved-properties',
      icon: '/svg/heart.svg',
    },
    {
      label: 'Saved Lands',
      href: '/dashboard/buyer/saved-lands',
      icon: '/svg/bookmark.svg',
    },
    {
      label: 'Recent Searches',
      href: '/dashboard/buyer/recently-viewed',
      icon: (
        <svg className="size-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      label: 'Notifications',
      href: '/dashboard/buyer/notifications',
      icon: (
        <svg className="size-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
    },
    {
      label: 'My Profile',
      href: '/dashboard/buyer/profile',
      icon: (
        <svg className="size-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      label: 'Settings',
      href: '/dashboard/buyer/settings',
      icon: '/svg/sparks-settings-icon.svg',
    },
  ];

  return (
    <RoleSidebarLayout portalTitle="Buyer Portal" roleLabel="Property Buyer" navItems={navItems}>
      {children ? children : <Outlet />}
    </RoleSidebarLayout>
  );
};
