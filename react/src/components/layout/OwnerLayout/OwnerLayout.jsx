import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import OwnerSidebar from './OwnerSidebar';

const OwnerLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-primary" style={{ backgroundColor: 'var(--color-primary)' }}>
      
      {/* Panggil Sidebar Component */}
      <OwnerSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-16 bg-card border-b border-border flex items-center px-6 justify-between" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
          <div>
            <h1 className="text-lg font-semibold text-white">Owner Panel</h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <span className="text-xs block" style={{ color: 'var(--color-muted)' }}>Logged in as</span>
                <span className="text-sm font-medium text-white capitalize">{user?.role}</span>
             </div>
             <button onClick={handleLogout} className="px-3 py-1.5 text-xs rounded bg-red-900/50 text-red-400 hover:bg-red-900/70 transition">
                Logout
             </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OwnerLayout;