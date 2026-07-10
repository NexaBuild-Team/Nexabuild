import { Routes, Route } from 'react-router'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Home from '../pages/Home'
import ConstructionListing from '../pages/ConstructionListing'
import ConstructionProfile from '../pages/ConstructionProfile'

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/construction-companies" element={<ConstructionListing />} />
        <Route path="/construction-companies/:id" element={<ConstructionProfile />} />
      </Routes>
      <Footer />
    </>
  )
}

export default AppRoutes