import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Import Layouts
import AdminLayout from "./components/layout/AdminLayout/AdminLayout";
import CashierLayout from "./components/layout/CashierLayout/CashierLayout"; // <--- PENTING: Import Layout Kasir
// import MainLayout from "./components/layout/MainLayout"; // Opsional, kalau butuh layout generik

// Import Pages
import Login from "./pages/Login";
import OwnerDashboard from "./pages/owner/Dashboard";
import BarberDashboard from "./pages/barber/Dashboard";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import Users from './pages/admin/Users';
import Products from './pages/admin/Products';
import Services from './pages/admin/Services';
import Bundle from './pages/admin/Bundle';

// Cashier Pages
import CashierDashboard from "./pages/kasir/Dashboard";
import Transaction from "./pages/kasir/Transaction";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex h-screen items-center justify-center text-white">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  // Cek Role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Jika role tidak diizinkan, tendang ke dashboard sesuai role masing-masing
    const defaultPath = `/${user.role}/dashboard`;
    return <Navigate to={defaultPath} replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* === LOGIN ROUTE === */}
          <Route path="/login" element={<Login />} />

          {/* === ADMIN ROUTES === */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="products" element={<Products />} />
            <Route path="services" element={<Services />} />
            <Route path="bundles" element={<Bundle />} />
          </Route>

          {/* === CASHIER ROUTES (PERBAIKAN UTAMA) === */}
          <Route
            path="/cashier"
            element={
              <ProtectedRoute allowedRoles={["cashier"]}>
                <CashierLayout /> {/* <--- INI MEMAKAI CASHIER LAYOUT (DENGAN SIDEBAR) */}
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<CashierDashboard />} />
            <Route path="transaction" element={<Transaction />} />
            {/* Nanti tambahkan history di sini */}
          </Route>

          {/* === OWNER ROUTES === */}
          <Route
            path="/owner/dashboard"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />

          {/* === BARBER ROUTES === */}
          <Route
            path="/barber/dashboard"
            element={
              <ProtectedRoute allowedRoles={["barber"]}>
                <BarberDashboard />
              </ProtectedRoute>
            }
          />

          {/* === FALLBACK === */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;