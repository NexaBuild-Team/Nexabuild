import { Routes, Route, useLocation } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Home from "../pages/Home";
import AdminPage from "../pages/admin/AdminPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUserManagement from "../pages/admin/AdminUserManagement";
import AdminPropertyManagement from "../pages/admin/AdminPropertyManagement";
import AdminAnalytics from "../pages/admin/AdminAnalytics";
import LoginPage from "../pages/auth/Login";
import RegisterPage from "../pages/auth/Register";
import ForgotPasswordPage from "../pages/auth/ForgotPassword";

function AppRoutes() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");
  const isAuthPath = location.pathname.startsWith("/auth");

  return (
    <>
      {(!isAdminPath && !isAuthPath) && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/auth">
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
        </Route>
        {/* Admin Section */}
        <Route path="/admin" element={<AdminPage />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUserManagement />} />
          <Route path="properties" element={<AdminPropertyManagement />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>
      </Routes>
      {(!isAdminPath && !isAuthPath) && <Footer />}
    </>
  );
}

export default AppRoutes;
