import { Routes, Route } from 'react-router'
import Home from '../pages/Home'
import PropertyListing from '../pages/PropertyListing'
import PropertyListingAI from '../pages/PropertyListingAI'
import PropertyAIrecommended from '../pages/PropertyAIrecommended'
import PropertyDetail from '../pages/PropertyDetail'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/property-listing" element={<PropertyListing />} />
      <Route path="/property-listing-ai" element={<PropertyListingAI />} />
      <Route path="/property-ai-recommended" element={<PropertyAIrecommended />} />
      <Route path="/property-detail/:id" element={<PropertyDetail />} />
    </Routes>
  )
}

export default AppRoutes