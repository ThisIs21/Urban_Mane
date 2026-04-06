// src/layouts/CashierLayout.jsx
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import userService from '../../../services/userService';
import SidebarCashier from './SidebarCashier';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  .cl-shell {
    display: flex;
    height: 100vh;
    background: #0C0C0B;
    font-family: 'DM Sans', sans-serif;
    overflow: hidden;
  }
  .cl-shell * { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── SIDEBAR ── */
  .cl-sidebar {
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
  .cl-sidebar.ex { width: 240px; }
  .cl-sidebar.co { width: 68px; }

  /* Logo */
  .cl-logo {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 0 16px;
    height: 64px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    flex-shrink: 0;
    overflow: hidden;
  }
  .cl-logo-icon { width: 34px; height: 34px; flex-shrink: 0; color: #C9A84C; }
  .cl-logo-text {
    font-family: 'Playfair Display', serif;
    font-size: 17px;
    font-weight: 600;
    color: #F0EDE6;
    white-space: nowrap;
    transition: opacity 0.2s, width 0.28s;
    letter-spacing: 0.01em;
  }
  .cl-sidebar.co .cl-logo-text { opacity: 0; width: 0; }

  /* Nav */
  .cl-nav {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 10px 8px;
  }
  .cl-nav::-webkit-scrollbar { width: 3px; }
  .cl-nav::-webkit-scrollbar-thumb { background: #2D2B28; border-radius: 2px; }

  .cl-section-label {
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #56534E;
    padding: 10px 10px 4px;
    white-space: nowrap;
    transition: opacity 0.2s;
  }
  .cl-sidebar.co .cl-section-label { opacity: 0; }

  .cl-nav-item {
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
  .cl-nav-item:hover { background: #232220; color: #F0EDE6; }
  .cl-nav-item.active {
    background: rgba(201,168,76,0.10);
    color: #C9A84C;
    border-color: rgba(201,168,76,0.18);
  }
  .cl-nav-icon { width: 18px; height: 18px; flex-shrink: 0; }
  .cl-nav-label { transition: opacity 0.2s; overflow: hidden; }
  .cl-sidebar.co .cl-nav-label { opacity: 0; width: 0; }
  .cl-sidebar.co .cl-nav-item { justify-content: center; padding: 10px; }

  /* Tooltip on collapse */
  .cl-sidebar.co .cl-nav-item:hover::after {
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

  /* Sidebar Footer */
  .cl-sidebar-footer {
    border-top: 1px solid rgba(255,255,255,0.07);
    padding: 10px 8px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  /* User card */
  .cl-user-card {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 8px;
    border-radius: 8px;
    overflow: hidden;
  }
  .cl-avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    flex-shrink: 0;
    overflow: hidden;
    background: rgba(201,168,76,0.12);
    border: 1.5px solid rgba(201,168,76,0.28);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    color: #C9A84C;
    letter-spacing: 0.01em;
  }
  .cl-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .cl-user-info { flex: 1; min-width: 0; overflow: hidden; transition: opacity 0.2s; }
  .cl-sidebar.co .cl-user-info { opacity: 0; width: 0; }
  .cl-user-name { font-size: 13px; font-weight: 600; color: #F0EDE6; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .cl-user-role { font-size: 10px; color: #56534E; text-transform: capitalize; letter-spacing: 0.04em; }

  .cl-footer-btn {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border-radius: 7px;
    border: none;
    background: transparent;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.18s;
    white-space: nowrap;
    overflow: hidden;
  }
  .cl-footer-btn.logout { color: #56534E; }
  .cl-footer-btn.logout:hover { background: rgba(224,82,82,0.08); color: #E05252; }
  .cl-footer-btn.collapse { color: #56534E; }
  .cl-footer-btn.collapse:hover { background: #232220; color: #9A9690; }
  .cl-btn-label { transition: opacity 0.2s; }
  .cl-sidebar.co .cl-btn-label { opacity: 0; width: 0; }
  .cl-sidebar.co .cl-footer-btn { justify-content: center; }

  /* ── MAIN ── */
  .cl-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }

  .cl-topbar {
    height: 64px;
    background: #141312;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    flex-shrink: 0;
  }
  .cl-topbar-title {
    font-family: 'Playfair Display', serif;
    font-size: 16px;
    font-weight: 500;
    color: #F0EDE6;
    letter-spacing: 0.01em;
  }
  .cl-topbar-right { display: flex; align-items: center; gap: 14px; }
  .cl-topbar-user { display: flex; align-items: center; gap: 10px; }
  .cl-topbar-avatar {
    width: 32px; height: 32px;
    border-radius: 50%;
    overflow: hidden;
    background: rgba(201,168,76,0.12);
    border: 1.5px solid rgba(201,168,76,0.28);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: #C9A84C;
    flex-shrink: 0;
  }
  .cl-topbar-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .cl-topbar-name { font-size: 13px; font-weight: 600; color: #F0EDE6; line-height: 1.2; }
  .cl-topbar-role { font-size: 10px; color: #56534E; text-transform: capitalize; }

  .cl-logout-topbar {
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
  .cl-logout-topbar:hover { background: rgba(224,82,82,0.14); border-color: rgba(224,82,82,0.4); }

  .cl-content {
    flex: 1;
    overflow-y: auto;
    padding: 28px;
    background: #0C0C0B;
  }
  .cl-content::-webkit-scrollbar { width: 4px; }
  .cl-content::-webkit-scrollbar-thumb { background: #2D2B28; border-radius: 2px; }
`;

const CashierLayout = () => {
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
      <div className="cl-shell">

        <SidebarCashier collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* MAIN */}
        <div className="cl-main">
          <header className="cl-topbar">
            <span className="cl-topbar-title">Kasir Panel</span>
            <div className="cl-topbar-right">
              <div className="cl-topbar-user">
                <div className="cl-topbar-avatar">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={user?.name} onError={e => e.target.style.display = 'none'} />
                  ) : initials}
                </div>
                <div>
                  <p className="cl-topbar-name">{user?.name || 'Kasir'}</p>
                  <p className="cl-topbar-role">{user?.role}</p>
                </div>
              </div>
              <button className="cl-logout-topbar" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </header>

          <main className="cl-content">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default CashierLayout;