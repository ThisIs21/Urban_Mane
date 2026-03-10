import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import MainLayout from './components/layout/MainLayout';

// Import Pages
import AdminDashboard from './pages/admin/Dashboard';
import OwnerDashboard from './pages/owner/Dashboard';
import CashierDashboard from './pages/kasir/Dashboard';
import BarberDashboard from './pages/barber/Dashboard';
import Login from './pages/Login'; 

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
          <Route element={<MainLayout />}>
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>
            } />
            {/* Route admin lainnya */}
            
            {/* Owner Routes */}
            <Route path="/owner/dashboard" element={
              <ProtectedRoute allowedRoles={['owner']}><OwnerDashboard /></ProtectedRoute>
            } />
            
            {/* Cashier Routes - backend uses 'kasir' role */}
            <Route path="/cashier/dashboard" element={
              <ProtectedRoute allowedRoles={['kasir']}><CashierDashboard /></ProtectedRoute>
            } />

            {/* Barber Routes */}
            <Route path="/barber/dashboard" element={
              <ProtectedRoute allowedRoles={['barber']}><BarberDashboard /></ProtectedRoute>
            } />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;