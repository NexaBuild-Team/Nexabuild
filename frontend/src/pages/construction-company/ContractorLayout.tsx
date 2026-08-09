import React from 'react';
import { RoleSidebarLayout } from '../../components/RoleSidebarLayout';

export const ContractorLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: '📊' },
    { label: 'Construction Companies', href: '/construction-companies', icon: '🏗️' },
  ];

  return (
    <RoleSidebarLayout portalTitle="Contractor Portal" roleLabel="Contractor" navItems={navItems}>
      {children}
    </RoleSidebarLayout>
  );
};
