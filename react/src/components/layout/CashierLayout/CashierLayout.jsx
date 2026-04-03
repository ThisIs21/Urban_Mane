import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const CashierLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Menu Spesifik Kasir
  const menuItems = [
    { path: '/cashier/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { path: '/cashier/transaction', label: 'Transaksi Baru', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' },
    { path: '/cashier/history', label: 'Riwayat', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  return (
    <div className="flex h-screen bg-primary" style={{ backgroundColor: 'var(--color-primary)' }}>
      
      {/* Sidebar */}
      <aside className={`flex flex-col bg-secondary border-r border-border transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}
            style={{ backgroundColor: 'var(--color-secondary)', borderColor: 'var(--color-border)' }}>
        
        {/* Header Logo */}
        <div className={`flex items-center h-16 border-b border-border px-4 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-gold flex-shrink-0" viewBox="0 0 80 80" fill="none" style={{ color: 'var(--color-gold)' }}>
              <circle cx="40" cy="40" r="38" stroke="currentColor" strokeWidth="2"/>
              <path d="M25 55L40 25L55 55" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M30 48H50" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="40" cy="40" r="4" fill="currentColor"/>
            </svg>
            {!isCollapsed && <span className="font-serif font-bold text-lg text-white whitespace-nowrap">Urban Mane</span>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group
                    ${isCollapsed ? 'justify-center' : ''}
                    ${isActive 
                      ? 'bg-gold text-black font-semibold' 
                      : 'text-muted hover:bg-hover hover:text-white'}
                  `}
                  style={({ isActive }) => isActive 
                    ? { backgroundColor: 'var(--color-gold)', color: 'black' } 
                    : { color: 'var(--color-muted)' }}
                  title={isCollapsed ? item.label : ''}
                >
                  <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                  {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer Toggle */}
        <div className="p-4 border-t border-border" style={{ borderColor: 'var(--color-border)' }}>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`w-full flex items-center gap-3 p-2 rounded-lg text-muted hover:bg-hover transition-colors ${isCollapsed ? 'justify-center' : ''}`}
          >
            <svg className="w-6 h-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={isCollapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"} />
            </svg>
            {!isCollapsed && <span className="whitespace-nowrap text-sm">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-16 bg-card border-b border-border flex items-center px-6 justify-between" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
          <div>
            <h1 className="text-lg font-semibold text-white">Kasir Panel</h1>
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

export default CashierLayout;