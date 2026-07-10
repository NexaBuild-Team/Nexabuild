import { Routes, Route } from 'react-router'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Home from '../pages/Home'
import PropertyListing from '../pages/PropertyListing'

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/property-listing" element={<PropertyListing />} />
      </Routes>
      <Footer />
    </>
  )
}

export default AppRoutes