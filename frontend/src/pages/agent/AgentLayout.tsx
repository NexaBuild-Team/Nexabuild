import React from 'react';
import { Outlet } from 'react-router';
import { RoleSidebarLayout } from '../../components/RoleSidebarLayout';

export const AgentLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: '/svg/grid-view-icon.svg',
    },
    {
      label: 'Properties',
      href: '/property-listing',
      icon: '/svg/home.svg',
    },
    {
      label: 'Lands',
      href: '/land',
      icon: '/svg/land-plot-icon.svg',
    },
    {
      sectionHeader: 'QUICK ACTIONS',
      label: 'Add Property',
      href: '/dashboard/agent/add-property',
      icon: (
        <svg className="size-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Add Land',
      href: '/dashboard/agent/add-land',
      icon: (
        <svg className="size-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      sectionHeader: 'ANALYSIS',
      label: 'Analytics',
      href: '/dashboard/agent/analytics',
      icon: (
        <svg className="size-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      label: 'Profile',
      href: '/dashboard/agent/profile',
      icon: (
        <svg className="size-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  return (
    <RoleSidebarLayout portalTitle="Agent Portal" roleLabel="Real Estate Agent" navItems={navItems}>
      {children ? children : <Outlet />}
    </RoleSidebarLayout>
  );
};
