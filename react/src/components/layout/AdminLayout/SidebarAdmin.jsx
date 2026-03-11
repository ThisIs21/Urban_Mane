import { NavLink } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

// Data Menu untuk Admin
const adminMenu = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { path: '/admin/users', label: 'Users & Staff', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
  { path: '/admin/products', label: 'Products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { path: '/admin/bundles', label: 'Bundles', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
];

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <aside 
      className={`flex flex-col h-screen bg-secondary border-r border-border transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}
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
          
          {/* Text hanya muncul jika tidak collapsed */}
          {!isCollapsed && (
            <span className="font-serif font-bold text-lg text-white whitespace-nowrap">Urban Mane</span>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {adminMenu.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end // agar exact match
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
                title={isCollapsed ? item.label : ''} // Tooltip saat collapsed
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

      {/* Footer / Toggle Button */}
      <div className="p-4 border-t border-border" style={{ borderColor: 'var(--color-border)' }}>
        <button 
          onClick={toggleSidebar}
          className={`w-full flex items-center gap-3 p-2 rounded-lg text-muted hover:bg-hover transition-colors ${isCollapsed ? 'justify-center' : ''}`}
          style={{ color: 'var(--color-muted)' }}
        >
          <svg className="w-6 h-6 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d={isCollapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"} />
          </svg>
          {!isCollapsed && <span className="whitespace-nowrap">Collapse</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;