import { Routes, Route } from 'react-router'
import Home from '../pages/Home'
// Team Lead Global Components
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
// Architecture Module pages
import ArchitecturePage from '../pages/ArchitecturePage'
import ArchitectsPage from '../pages/ArchitectsPage'
import DesignsPage from '../pages/DesignsPage'
import DesignDetailPage from '../pages/DesignDetailPage'

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* ── Existing routes ─────────────────────────── */}
        <Route path="/" element={<Home />} />

        {/* ── Architecture Module ──────────────────────── */}
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
