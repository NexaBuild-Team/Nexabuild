import { Routes, Route } from 'react-router'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Home from '../pages/Home'
import LandListing from '../pages/LandListing'
import AIRecommendations from '../pages/AIRecommendations'
import AIRecommendationsList from '../pages/AIRecommendationsList'
import LandDetail from '../pages/LandDetail'

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/land" element={<LandListing />} />
        <Route path="/land/ai-recommendations" element={<AIRecommendations />} />
        <Route path="/land/ai-recommendations/list" element={<AIRecommendationsList />} />
        <Route path="/land/detail/:id" element={<LandDetail />} />
      </Routes>
      <Footer />
    </>
  )
}

export default AppRoutes
