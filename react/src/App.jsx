import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Import Layouts
import AdminLayout from "./components/layout/AdminLayout/AdminLayout";
import CashierLayout from "./components/layout/CashierLayout/CashierLayout"; 
import OwnerLayout from "./components/layout/OwnerLayout/OwnerLayout";

// Import Pages
import Login from "./pages/Login";


// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Products from "./pages/admin/Products";
import Services from "./pages/admin/Services";
import Bundle from "./pages/admin/Bundle";

// Cashier Pages
import CashierDashboard from "./pages/kasir/Dashboard";
import Transaction from "./pages/kasir/Transaction";
import QueueBoard from "./pages/kasir/QueueBoard";
import History from "./pages/kasir/History";

//Owner Pages
import OwnerDashboard from "./pages/owner/Dashboard";
import OwnerProducts from "./pages/owner/Products";
import Reports from "./pages/owner/Reports";
import ActivityLog from "./pages/owner/ActivityLog";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-white">
        Loading...
      </div>
    );
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
                <CashierLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<CashierDashboard />} />
            <Route path="transaction" element={<Transaction />} />
            <Route path="board" element={<QueueBoard />} />
            <Route path="history" element={<History />} />
          </Route>

          {/* === OWNER ROUTES === */}
          <Route
            path="/owner"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <OwnerLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<OwnerDashboard />} />
            <Route path="products" element={<OwnerProducts />} />
            <Route path="reports" element={<Reports />} />
            <Route path="activity-log" element={<ActivityLog />} />
            {/* Route lainnya */}
          </Route>

          {/* === FALLBACK === */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
