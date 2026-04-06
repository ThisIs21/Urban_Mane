import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const OwnerSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/owner/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { path: '/owner/products', label: 'Data Produk', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { path: '/owner/reports', label: 'Laporan', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { path: '/owner/activity', label: 'Activity Log', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  ];

  return (
    <aside 
      className={`flex flex-col bg-secondary border-r border-border transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}
      style={{ backgroundColor: 'var(--color-secondary)', borderColor: 'var(--color-border)' }}
    >
      {/* Header Logo */}
      <div className={`flex items-center h-16 border-b border-border px-4 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <div className="flex items-center gap-3">
          <svg className="w-8 h-8 text-gold flex-shrink-0" viewBox="0 0 80 80" fill="none" style={{ color: 'var(--color-gold)' }}>
            <circle cx="40" cy="40" r="38" stroke="currentColor" strokeWidth="2"/>
            <path d="M25 55L40 25L55 55" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M30 48H50" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="40" cy="40" r="4" fill="currentColor"/>
          </svg>
          {!isCollapsed && <span className="font-serif font-bold text-lg text-white whitespace-nowrap">Owner</span>}
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
  );
};

export default OwnerSidebar;