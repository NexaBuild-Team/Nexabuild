import { Routes, Route } from 'react-router'
import Home from '../pages/Home'
import PropertyListing from '../pages/PropertyListing'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/property-listing" element={<PropertyListing />} />
    </Routes>
  )
}

export default AppRoutes
