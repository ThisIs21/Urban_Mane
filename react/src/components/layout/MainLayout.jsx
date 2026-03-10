import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Definisi menu per role
  const menuItems = {
    admin: [
      { path: '/admin/dashboard', label: 'Dashboard', icon: '🏠' },
      { path: '/admin/users', label: 'Users & Staff', icon: '👥' },
      { path: '/admin/products', label: 'Products', icon: '📦' },
    ],
    owner: [
      { path: '/owner/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/owner/reports', label: 'Reports', icon: '📈' },
      { path: '/owner/activity', label: 'Activity Log', icon: '📜' },
    ],
    kasir: [
      { path: '/cashier/dashboard', label: 'Dashboard', icon: '🏠' },
      { path: '/cashier/transaction', label: 'New Transaction', icon: '💰' },
      { path: '/cashier/history', label: 'History', icon: '🕓' },
    ],
    barber: [
      { path: '/barber/dashboard', label: 'Dashboard', icon: '🏠' },
      { path: '/barber/schedule', label: 'My Schedule', icon: '📅' },
    ]
  };

  const currentMenu = menuItems[user?.role] || [];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-slate-700 font-bold text-xl">
          Urban Mane
        </div>
        <nav className="flex-1 p-4">
          <ul>
            {currentMenu.map((item) => (
              <li key={item.path} className="mb-2">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'
                    }`
                  }
                >
                  <span>{item.icon}</span> {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm capitalize bg-slate-700 px-2 py-1 rounded">{user?.role}</span>
            <button onClick={handleLogout} className="text-red-400 text-sm hover:underline">Logout</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50">
        <header className="h-16 bg-white shadow-sm flex items-center px-6 justify-between">
          <h1 className="font-semibold text-lg text-gray-800">Dashboard</h1>
          <div className="text-gray-600 text-sm">Welcome back!</div>
        </header>
        <div className="p-6">
          <Outlet /> {/* Halaman akan render di sini */}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;