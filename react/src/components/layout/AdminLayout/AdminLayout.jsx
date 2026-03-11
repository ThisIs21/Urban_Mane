import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SidebarAdmin from './SidebarAdmin';

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="flex h-screen bg-primary" style={{ backgroundColor: 'var(--color-primary)' }}>
      <SidebarAdmin isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar (Optional, bisa ditambah nanti) */}
        <header className="h-16 bg-card border-b border-border flex items-center px-6 justify-between" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
             <h1 className="text-lg font-semibold text-white">Admin Panel</h1>
             <div className="flex items-center gap-2">
                 <span className="text-sm text-muted" style={{color: 'var(--color-muted)'}}>Welcome, Admin</span>
                 <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-black font-bold text-sm" style={{backgroundColor: 'var(--color-gold)'}}>A</div>
             </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-primary" style={{ backgroundColor: 'var(--color-primary)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;