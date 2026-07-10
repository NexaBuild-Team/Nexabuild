import { Routes, Route } from 'react-router'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Home from '../pages/Home'

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
    </>
  )
}

export default AppRoutes