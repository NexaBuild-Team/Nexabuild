import React from 'react';
import { RoleSidebarLayout } from '../../components/RoleSidebarLayout';

export const AgentLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: '📊' },
    { label: 'Add New Property', href: '/dashboard/agent/add-property', icon: '➕' },
    { label: 'Browse Properties', href: '/property-listing', icon: '🏠' },
    { label: 'Browse Lands', href: '/land', icon: '📍' },
  ];

  return (
    <RoleSidebarLayout portalTitle="Agent Portal" roleLabel="Real Estate Agent" navItems={navItems}>
      {children}
    </RoleSidebarLayout>
  );
};
