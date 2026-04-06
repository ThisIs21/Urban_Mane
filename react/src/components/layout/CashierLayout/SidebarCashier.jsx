// src/components/layouts/SidebarCashier.jsx
import { NavLink } from 'react-router-dom';

const MENU = [
  {
    label: 'Kasir',
    items: [
      { path: '/cashier/dashboard',   label: 'Dashboard',      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
      { path: '/cashier/transaction', label: 'Transaksi Baru', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' },
      { path: '/cashier/board',       label: 'Papan Antrian', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
      { path: '/cashier/history',     label: 'Riwayat',       icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    ]
  }
];

const Ico = ({ d }) => (
  <svg width="18" height="18" className="cl-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={d} />
  </svg>
);

const SidebarCashier = ({ collapsed, setCollapsed }) => {
  return (
    <aside className={`cl-sidebar ${collapsed ? 'co' : 'ex'}`}>

      <div className="cl-logo">
        <svg className="cl-logo-icon" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="38" stroke="currentColor" strokeWidth="2"/>
          <path d="M25 55L40 25L55 55" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M30 48H50" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="40" cy="40" r="4" fill="currentColor"/>
        </svg>
        <span className="cl-logo-text">Urban Mane</span>
      </div>

      <nav className="cl-nav">
        {MENU.map((section, si) => (
          <div key={si}>
            {section.label && <p className="cl-section-label">{section.label}</p>}
            {section.items.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end
                data-label={item.label}
                className={({ isActive }) => `cl-nav-item ${isActive ? 'active' : ''}`}
              >
                <Ico d={item.icon} />
                <span className="cl-nav-label">{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer hanya tombol collapse */}
      <div className="cl-sidebar-footer">
        <button 
          className="cl-footer-btn" 
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
          <span className="cl-btn-label">
            {collapsed ? 'Buka' : 'Tutup sidebar'}
          </span>
        </button>
      </div>
    </aside>
  );
};

export default SidebarCashier;