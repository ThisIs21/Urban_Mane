// src/components/layouts/SidebarAdmin.jsx
import { NavLink } from 'react-router-dom';

const MENU = [
  {
    label: 'Overview',
    items: [
      { path: '/admin/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    ]
  },
  {
    label: 'Manajemen',
    items: [
      { path: '/admin/users',    label: 'Pengguna',  icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
      { path: '/admin/products', label: 'Produk',    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
      { path: '/admin/services', label: 'Layanan',   icon: 'M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z' },
      { path: '/admin/bundles',  label: 'Paket',     icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    ]
  },
  {
    label: 'Laporan',
    items: [
      { path: '/admin/reports', label: 'Laporan', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    ]
  }
];

const Ico = ({ d }) => (
  <svg width="18" height="18" className="al-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={d} />
  </svg>
);

const SidebarAdmin = ({ collapsed, setCollapsed }) => {
  return (
    <aside className={`al-sidebar ${collapsed ? 'co' : 'ex'}`}>

      <div className="al-logo">
        <svg className="al-logo-icon" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="38" stroke="currentColor" strokeWidth="2"/>
          <path d="M25 55L40 25L55 55" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M30 48H50" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="40" cy="40" r="4" fill="currentColor"/>
        </svg>
        <span className="al-logo-text">Urban Mane</span>
      </div>

      <nav className="al-nav">
        {MENU.map((section, si) => (
          <div key={si}>
            {section.label && <p className="al-section-label">{section.label}</p>}
            {section.items.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end
                data-label={item.label}
                className={({ isActive }) => `al-nav-item ${isActive ? 'active' : ''}`}
              >
                <Ico d={item.icon} />
                <span className="al-nav-label">{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer hanya tombol collapse */}
      <div className="al-sidebar-footer">
        <button 
          className="al-footer-btn" 
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Buka sidebar" : "Tutup sidebar"}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2.5}
              d={collapsed ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'} 
            />
          </svg>
          <span className="al-btn-label">
            {collapsed ? 'Buka' : 'Tutup sidebar'}
          </span>
        </button>
      </div>
    </aside>
  );
};

export default SidebarAdmin;