import { NavLink } from 'react-router-dom';

const MENU = [
  {
    label: 'Overview',
    items: [
      { path: '/owner/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    ]
  },
  {
    label: 'Monitoring',
    items: [
      { path: '/owner/products', label: 'Data Produk', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
      { path: '/owner/activity-log', label: 'Activity Log', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    ]
  },
  {
    label: 'Laporan',
    items: [
      { path: '/owner/reports', label: 'Laporan Keuangan', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    ]
  }
];

const Ico = ({ d }) => (
  <svg width="18" height="18" className="ol-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={d} />
  </svg>
);

const OwnerSidebar = ({ collapsed, setCollapsed }) => {
  return (
    <aside className={`ol-sidebar ${collapsed ? 'co' : 'ex'}`}>

      <div className="ol-logo">
        <svg className="ol-logo-icon" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="38" stroke="currentColor" strokeWidth="2"/>
          <path d="M25 55L40 25L55 55" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M30 48H50" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="40" cy="40" r="4" fill="currentColor"/>
        </svg>
        <span className="ol-logo-text">Urban Mane</span>
      </div>

      <nav className="ol-nav">
        {MENU.map((section, si) => (
          <div key={si}>
            {section.label && <p className="ol-section-label">{section.label}</p>}
            {section.items.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end
                data-label={item.label}
                className={({ isActive }) => `ol-nav-item ${isActive ? 'active' : ''}`}
              >
                <Ico d={item.icon} />
                <span className="ol-nav-label">{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer hanya tombol collapse */}
      <div className="ol-sidebar-footer">
        <button 
          className="ol-footer-btn" 
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
          <span className="ol-btn-label">
            {collapsed ? 'Buka' : 'Tutup sidebar'}
          </span>
        </button>
      </div>
    </aside>
  );
};

export default OwnerSidebar;