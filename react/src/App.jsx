import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import MainLayout from "./components/layout/MainLayout";
import Users from './pages/admin/Users'

// Import Pages
import OwnerDashboard from "./pages/owner/Dashboard";
import CashierDashboard from "./pages/kasir/Dashboard";
import BarberDashboard from "./pages/barber/Dashboard";
import Login from "./pages/Login";
import AdminLayout from "./components/layout/AdminLayout/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import Products from './pages/admin/Products';
import Services from './pages/admin/Services';
import Bundle from './pages/admin/Bundle';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />; // Atau redirect ke dashboard sesuai role
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="products" element={<Products />} />
            <Route path="services" element={<Services />} />
            <Route path="bundles" element={<Bundle />} />
          </Route>

          {/* Owner Routes */}
          <Route
            path="/owner/dashboard"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Cashier Routes - backend uses 'kasir' role */}
          <Route
            path="/cashier/dashboard"
            element={
              <ProtectedRoute allowedRoles={["kasir"]}>
                <CashierDashboard />
              </ProtectedRoute>
            }
          />

          {/* Barber Routes */}
          <Route
            path="/barber/dashboard"
            element={
              <ProtectedRoute allowedRoles={["barber"]}>
                <BarberDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}


export default App;
