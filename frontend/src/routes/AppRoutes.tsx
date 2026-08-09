import { Routes, Route, useLocation } from 'react-router-dom'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

import Home from '../pages/Home'

// Property AI
import PropertyListing from '../pages/PropertyListing'
import PropertyListingAI from '../pages/PropertyListingAI'

import PropertyDetail from '../pages/PropertyDetail'

// Land AI
import LandListing from '../pages/LandListing'
import AIRecommendations from '../pages/AIRecommendations'
import LandDetail from '../pages/LandDetail'

// Architecture Module
import ArchitecturePage from '../pages/ArchitecturePage'
import ArchitectsPage from '../pages/ArchitectsPage'
import DesignsPage from '../pages/DesignsPage'
import DesignDetailPage from '../pages/DesignDetailPage'

// Construction Module
import ConstructionListing from '../pages/ConstructionListing'
import ConstructionProfile from '../pages/ConstructionProfile'
import ConstructionProjectDetail from '../pages/ConstructionProjectDetail'

// Admin
import AdminPage from '../pages/admin/AdminPage'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminUserManagement from '../pages/admin/AdminUserManagement'
import AdminPropertyManagement from '../pages/admin/AdminPropertyManagement'
import AdminAnalytics from '../pages/admin/AdminAnalytics'

// Auth & Protection
import LoginPage from '../pages/auth/Login'
import RegisterPage from '../pages/auth/Register'
import ForgotPasswordPage from '../pages/auth/ForgotPassword'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { DashboardDispatcher } from '../components/DashboardDispatcher'

// Role Layouts & Sub-pages
import { BuyerLayout } from '../pages/buyer/BuyerLayout'
import BuyerDashboard from '../pages/buyer/BuyerDashboard'
import SavedProperties from '../pages/buyer/SavedProperties'
import SavedLand from '../pages/buyer/SavedLand'
import RecentlyViewed from '../pages/buyer/RecentlyViewed'

import { AgentLayout } from '../pages/agent/AgentLayout'
import AgentDashboard from '../pages/agent/AgentDashboard'
import AddNewProperty from '../pages/agent/AddNewProperty'

import { ArchitectLayout } from '../pages/architecture/ArchitectLayout'
import ArchitechtureDashboard from '../pages/architecture/ArchitechtureDashboard'

import { ContractorLayout } from '../pages/construction-company/ContractorLayout'
import ConstructionCompanyDashboard from '../pages/construction-company/ConstructionCompanyDashboard'

function AppRoutes() {
  const location = useLocation()

  const isAdminPath = location.pathname.startsWith('/admin')
  const isAuthPath = location.pathname.startsWith('/auth')
  const isDashboardPath = location.pathname.startsWith('/dashboard')

  return (
    <>
      {!isAdminPath && !isAuthPath && <Navbar />}

      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Property Routes */}
        <Route path="/property-listing" element={<PropertyListing />} />
        <Route path="/property-listing-ai" element={<PropertyListingAI />} />

        <Route path="/property-detail/:id" element={<PropertyDetail />} />

        {/* Land Routes */}
        <Route path="/land" element={<LandListing />} />
        <Route path="/land/ai-recommendations" element={<AIRecommendations />} />
        <Route path="/land/detail/:id" element={<LandDetail />} />

        {/* Architecture Routes */}
        <Route path="/architecture" element={<ArchitecturePage />} />
        <Route path="/architects" element={<ArchitectsPage />} />
        <Route path="/designs" element={<DesignsPage />} />
        <Route path="/designs/:id" element={<DesignDetailPage />} />

        {/* Construction Routes */}
        <Route path="/construction-companies" element={<ConstructionListing />} />
        <Route path="/construction-companies/:id" element={<ConstructionProfile />} />
        <Route path="/construction-projects/:id" element={<ConstructionProjectDetail />} />

        {/* Auth Routes */}
        <Route path="/auth">
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* Main Dashboard Route (Protected) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardDispatcher />} />

          {/* Buyer Sub-routes */}
          <Route path="/dashboard/buyer" element={<BuyerLayout />}>
            <Route index element={<BuyerDashboard />} />
            <Route path="saved-properties" element={<SavedProperties />} />
            <Route path="saved-lands" element={<SavedLand />} />
            <Route path="recently-viewed" element={<RecentlyViewed />} />
          </Route>

          {/* Agent Sub-routes */}
          <Route path="/dashboard/agent" element={<AgentLayout />}>
            <Route index element={<AgentDashboard />} />
            <Route path="add-property" element={<AddNewProperty />} />
          </Route>

          {/* Architect Sub-routes */}
          <Route path="/dashboard/architecture" element={<ArchitectLayout />}>
            <Route index element={<ArchitechtureDashboard />} />
          </Route>

          {/* Contractor Sub-routes */}
          <Route path="/dashboard/construction" element={<ContractorLayout />}>
            <Route index element={<ConstructionCompanyDashboard />} />
          </Route>
        </Route>

        {/* Admin Routes (Protected - ADMIN role only) */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route path="/admin" element={<AdminPage />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUserManagement />} />
            <Route path="properties" element={<AdminPropertyManagement />} />
            <Route path="analytics" element={<AdminAnalytics />} />
          </Route>
        </Route>
      </Routes>

      {!isAdminPath && !isAuthPath && !isDashboardPath && <Footer />}
    </>
  )
}

export default AppRoutes