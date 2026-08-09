import React from 'react';
import { RoleSidebarLayout } from '../../components/RoleSidebarLayout';

export const ArchitectLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: '📊' },
    { label: 'Browse Designs', href: '/designs', icon: '📐' },
    { label: 'Architect Directory', href: '/architects', icon: '🏢' },
  ];

  return (
    <RoleSidebarLayout portalTitle="Architecture Studio" roleLabel="Architect" navItems={navItems}>
      {children}
    </RoleSidebarLayout>
  );
};
