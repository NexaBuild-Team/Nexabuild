import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import BuyerDashboard from '../pages/buyer/BuyerDashboard';
import AgentDashboard from '../pages/agent/AgentDashboard';
import ArchitechtureDashboard from '../pages/architecture/ArchitechtureDashboard';
import ConstructionCompanyDashboard from '../pages/construction-company/ConstructionCompanyDashboard';

import { BuyerLayout } from '../pages/buyer/BuyerLayout';
import { AgentLayout } from '../pages/agent/AgentLayout';
import { ArchitectLayout } from '../pages/architecture/ArchitectLayout';
import { ContractorLayout } from '../pages/construction-company/ContractorLayout';

export const DashboardDispatcher: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 pt-20">
        <div className="size-8 border-4 border-[#345b79] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  switch (user.role) {
    case 'ADMIN':
      return <Navigate to="/admin/dashboard" replace />;
    case 'AGENT':
      return (
        <AgentLayout>
          <AgentDashboard />
        </AgentLayout>
      );
    case 'ARCHITECT':
      return (
        <ArchitectLayout>
          <ArchitechtureDashboard />
        </ArchitectLayout>
      );
    case 'CONTRACTOR':
      return (
        <ContractorLayout>
          <ConstructionCompanyDashboard />
        </ContractorLayout>
      );
    case 'USER':
    default:
      return (
        <BuyerLayout>
          <BuyerDashboard />
        </BuyerLayout>
      );
  }
};
