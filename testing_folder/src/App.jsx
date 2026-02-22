import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import AreaPage from "./pages/AreaPage";
import AreasIndexPage from "./pages/AreasIndexPage";
import ListingsPage from "./pages/ListingsPage";
import PropertyPage from "./pages/PropertyPage";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManagePropertiesPage from "./pages/admin/ManagePropertiesPage";
import AddPropertyPage from "./pages/admin/AddPropertyPage";
import AddAreaPage from "./pages/admin/AddAreaPage";
import ManageAreasPage from "./pages/admin/ManageAreasPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function NotFound() {
  return (
    <div className="container-main py-24 text-center">
      <h1 className="text-4xl font-bold text-charcoal mb-4">404</h1>
      <p className="text-gray-text mb-6">Page not found</p>
      <a
        href="/"
        className="text-primary font-medium no-underline hover:text-primary-dark"
      >
        Go back home
      </a>
    </div>
  );
}

function PublicLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Website Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/areas" element={<AreasIndexPage />} />
              <Route path="/areas/:areaSlug" element={<AreaPage />} />
              <Route path="/listings" element={<ListingsPage />} />
              <Route path="/property/:slug" element={<PropertyPage />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Admin Dashboard Routes (Protected) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="listings" element={<ManagePropertiesPage />} />
              <Route path="areas" element={<ManageAreasPage />} />
              <Route path="add" element={<AddPropertyPage />} />
              <Route path="edit/:id" element={<AddPropertyPage />} />
              <Route path="areas/add" element={<AddAreaPage />} />
              <Route path="areas/edit/:id" element={<AddAreaPage />} />
              <Route
                path="settings"
                element={
                  <div className="text-center py-20 text-gray-text">
                    Settings coming soon
                  </div>
                }
              />
            </Route>

            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}
