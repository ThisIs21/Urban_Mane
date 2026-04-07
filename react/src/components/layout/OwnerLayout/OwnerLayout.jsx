import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import userService from '../../../services/userService';
import OwnerSidebar from './OwnerSidebar';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  .ol-shell {
    display: flex;
    height: 100vh;
    background: #0C0C0B;
    font-family: 'DM Sans', sans-serif;
    overflow: hidden;
  }
  .ol-shell * { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── SIDEBAR ── */
  .ol-sidebar {
    display: flex;
    flex-direction: column;
    background: #141312;
    border-right: 1px solid rgba(255,255,255,0.07);
    transition: width 0.28s cubic-bezier(0.4,0,0.2,1);
    overflow: hidden;
    flex-shrink: 0;
    position: relative;
    z-index: 10;
  }
  .ol-sidebar.ex { width: 240px; }
  .ol-sidebar.co { width: 68px; }

  /* Logo */
  .ol-logo {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 0 16px;
    height: 64px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    flex-shrink: 0;
    overflow: hidden;
  }
  .ol-logo-icon { width: 34px; height: 34px; flex-shrink: 0; color: #C9A84C; }
  .ol-logo-text {
    font-family: 'Playfair Display', serif;
    font-size: 17px;
    font-weight: 600;
    color: #F0EDE6;
    white-space: nowrap;
    transition: opacity 0.2s, width 0.28s;
    letter-spacing: 0.01em;
  }
  .ol-sidebar.co .ol-logo-text { opacity: 0; width: 0; }

  /* Nav */
  .ol-nav {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 10px 8px;
  }
  .ol-nav::-webkit-scrollbar { width: 3px; }
  .ol-nav::-webkit-scrollbar-thumb { background: #2D2B28; border-radius: 2px; }

  .ol-section-label {
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #56534E;
    padding: 10px 10px 4px;
    white-space: nowrap;
    transition: opacity 0.2s;
  }
  .ol-sidebar.co .ol-section-label { opacity: 0; }

  .ol-nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 10px;
    border-radius: 8px;
    text-decoration: none;
    color: #9A9690;
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    transition: all 0.18s;
    margin-bottom: 2px;
    position: relative;
    border: 1px solid transparent;
  }
  .ol-nav-item:hover { background: #232220; color: #F0EDE6; }
  .ol-nav-item.active {
    background: rgba(201,168,76,0.10);
    color: #C9A84C;
    border-color: rgba(201,168,76,0.18);
  }
  .ol-nav-icon { width: 18px; height: 18px; flex-shrink: 0; }
  .ol-nav-label { transition: opacity 0.2s; overflow: hidden; }
  .ol-sidebar.co .ol-nav-label { opacity: 0; width: 0; }
  .ol-sidebar.co .ol-nav-item { justify-content: center; padding: 10px; }

  .ol-sidebar.co .ol-nav-item:hover::after {
    content: attr(data-label);
    position: absolute;
    left: calc(100% + 10px);
    top: 50%;
    transform: translateY(-50%);
    background: #232220;
    color: #F0EDE6;
    padding: 5px 10px;
    border-radius: 6px;
    font-size: 12px;
    white-space: nowrap;
    border: 1px solid rgba(255,255,255,0.1);
    pointer-events: none;
    z-index: 200;
  }

  /* Footer */
  .ol-sidebar-footer {
    border-top: 1px solid rgba(255,255,255,0.07);
    padding: 12px 8px;
    flex-shrink: 0;
  }

  .ol-footer-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 10px 10px;
    border-radius: 8px;
    border: none;
    background: transparent;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 500;
    color: #56534E;
    transition: all 0.18s;
    white-space: nowrap;
    overflow: hidden;
  }
  .ol-footer-btn:hover {
    background: #232220;
    color: #9A9690;
  }
  .ol-btn-label { transition: opacity 0.2s; }
  .ol-sidebar.co .ol-btn-label { opacity: 0; width: 0; }

  /* ── MAIN ── */
  .ol-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }

  .ol-topbar {
    height: 64px;
    background: #141312;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    flex-shrink: 0;
  }
  .ol-topbar-title {
    font-family: 'Playfair Display', serif;
    font-size: 16px;
    font-weight: 500;
    color: #F0EDE6;
    letter-spacing: 0.01em;
  }
  .ol-topbar-right { display: flex; align-items: center; gap: 14px; }
  .ol-topbar-user { display: flex; align-items: center; gap: 10px; }
  .ol-topbar-avatar {
    width: 32px; height: 32px;
    border-radius: 50%;
    overflow: hidden;
    background: rgba(201,168,76,0.12);
    border: 1.5px solid rgba(201,168,76,0.28);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: #C9A84C;
    flex-shrink: 0;
  }
  .ol-topbar-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .ol-topbar-name { font-size: 13px; font-weight: 600; color: #F0EDE6; line-height: 1.2; }
  .ol-topbar-role { font-size: 10px; color: #56534E; text-transform: capitalize; }

  .ol-logout-topbar {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 7px;
    border: 1px solid rgba(224,82,82,0.2);
    background: rgba(224,82,82,0.06);
    color: #E05252;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.18s;
    font-family: 'DM Sans', sans-serif;
  }
  .ol-logout-topbar:hover { 
    background: rgba(224,82,82,0.14); 
    border-color: rgba(224,82,82,0.4); 
  }

  .ol-content {
    flex: 1;
    overflow-y: auto;
    padding: 28px;
    background: #0C0C0B;
  }
  .ol-content::-webkit-scrollbar { width: 4px; }
  .ol-content::-webkit-scrollbar-thumb { background: #2D2B28; border-radius: 2px; }
`;

const OwnerLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const avatarUrl = user?.photoUrl ? userService.getImageUrl(user.photoUrl) : null;
  const initials = user?.name 
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() 
    : '?';

  return (
    <>
      <style>{css}</style>
      <div className="ol-shell">

        <OwnerSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* MAIN */}
        <div className="ol-main">
          <header className="ol-topbar">
            <span className="ol-topbar-title">Owner Panel</span>
            <div className="ol-topbar-right">
              <div className="ol-topbar-user">
                <div className="ol-topbar-avatar">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={user?.name} onError={e => e.target.style.display = 'none'} />
                  ) : initials}
                </div>
                <div>
                  <p className="ol-topbar-name">{user?.name || 'Owner'}</p>
                  <p className="ol-topbar-role">{user?.role}</p>
                </div>
              </div>
              <button className="ol-logout-topbar" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </header>

          <main className="ol-content">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default OwnerLayout;