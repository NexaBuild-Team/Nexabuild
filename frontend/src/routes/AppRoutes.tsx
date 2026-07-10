import { Routes, Route } from 'react-router'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

import Home from '../pages/Home'

// Property AI
import PropertyListing from '../pages/PropertyListing'
import PropertyListingAI from '../pages/PropertyListingAI'
import PropertyAIrecommended from '../pages/PropertyAIrecommended'
import PropertyDetail from '../pages/PropertyDetail'

// Land AI
import LandListing from '../pages/LandListing'
import AIRecommendations from '../pages/AIRecommendations'
import AIRecommendationsList from '../pages/AIRecommendationsList'
import LandDetail from '../pages/LandDetail'

// Architecture Module
import ArchitecturePage from '../pages/ArchitecturePage'
import ArchitectsPage from '../pages/ArchitectsPage'
import DesignsPage from '../pages/DesignsPage'
import DesignDetailPage from '../pages/DesignDetailPage'


function AppRoutes() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />


        {/* Property Routes */}
        <Route path="/property-listing" element={<PropertyListing />} />
        <Route path="/property-listing-ai" element={<PropertyListingAI />} />
        <Route path="/property-ai-recommended" element={<PropertyAIrecommended />} />
        <Route path="/property-detail/:id" element={<PropertyDetail />} />


        {/* Land Routes */}
        <Route path="/land" element={<LandListing />} />
        <Route path="/land/ai-recommendations" element={<AIRecommendations />} />
        <Route path="/land/ai-recommendations/list" element={<AIRecommendationsList />} />
        <Route path="/land/detail/:id" element={<LandDetail />} />


        {/* Architecture Routes */}
        <Route path="/architecture" element={<ArchitecturePage />} />
        <Route path="/architects" element={<ArchitectsPage />} />
        <Route path="/designs" element={<DesignsPage />} />
        <Route path="/designs/:id" element={<DesignDetailPage />} />

      </Routes>

      <Footer />
    </>
  )
}

export default AppRoutes