import { Routes, Route, useLocation } from 'react-router'

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

// Admin
import AdminPage from '../pages/admin/AdminPage'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminUserManagement from '../pages/admin/AdminUserManagement'
import AdminPropertyManagement from '../pages/admin/AdminPropertyManagement'
import AdminAnalytics from '../pages/admin/AdminAnalytics'

// Auth
import LoginPage from '../pages/auth/Login'
import RegisterPage from '../pages/auth/Register'
import ForgotPasswordPage from '../pages/auth/ForgotPassword'

function AppRoutes() {
  const location = useLocation()

  const isAdminPath = location.pathname.startsWith('/admin')
  const isAuthPath = location.pathname.startsWith('/auth')

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

        {/* Auth Routes */}
        <Route path="/auth">
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminPage />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUserManagement />} />
          <Route path="properties" element={<AdminPropertyManagement />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>
      </Routes>

      {!isAdminPath && !isAuthPath && <Footer />}
    </>
  )
}

export default AppRoutes