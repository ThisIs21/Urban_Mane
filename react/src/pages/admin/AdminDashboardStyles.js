/* AdminDashboardStyles.js - CSS untuk Admin Dashboard */

export const adminDashboardCss = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@300;400;500;600&display=swap');

  .adm-db {
    --gold: #C9A84C;
    --s2: #1B1A18;
    --s3: #232220;
    --s4: #2D2B28;
    --border: rgba(255,255,255,0.07);
    --gold-line: rgba(201,168,76,0.22);
    --t1: #F0EDE6;
    --t2: #9A9690;
    --t3: #56534E;
    --success: #4CAF7D;
    --info: #5B9BDC;
    --warning: #E0C060;
    --purple: #A07BC8;
    --danger: #E05252;
    font-family: 'DM Sans', sans-serif;
    color: var(--t1);
  }
  .adm-db * { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .a1 { animation: fadeUp 0.4s ease 0.04s both; }
  .a2 { animation: fadeUp 0.4s ease 0.09s both; }
  .a3 { animation: fadeUp 0.4s ease 0.14s both; }
  .a4 { animation: fadeUp 0.4s ease 0.19s both; }
  .a5 { animation: fadeUp 0.4s ease 0.24s both; }
  .a6 { animation: fadeUp 0.4s ease 0.29s both; }

  /* ── HEADER ── */
  .adm-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 28px; }
  .adm-eyebrow { font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold); margin-bottom: 5px; }
  .adm-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 600; color: var(--t1); letter-spacing: 0.01em; }
  .adm-sub { font-size: 13px; color: var(--t3); margin-top: 4px; }
  .adm-date { font-size: 12px; color: var(--t2); text-align: right; }
  .adm-date strong { display: block; font-size: 13px; font-weight: 600; color: var(--t1); margin-bottom: 2px; }

  /* ── STATS GRID ── */
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 28px; }
  @media (max-width: 1000px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }

  .stat-card {
    background: var(--s2);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 18px 20px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.25s, transform 0.2s;
  }
  .stat-card:hover { border-color: var(--gold-line); transform: translateY(-1px); }
  .stat-card::before {
    content: '';
    position: absolute;
    top: 0; left: 20px; right: 20px;
    height: 1px;
  }
  .stat-card.c-gold::before  { background: var(--gold); }
  .stat-card.c-blue::before  { background: var(--info); }
  .stat-card.c-green::before { background: var(--success); }
  .stat-card.c-purple::before{ background: var(--purple); }

  .stat-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .stat-label { font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--t3); }
  .stat-icon { width: 28px; height: 28px; border-radius: 7px; display: flex; align-items: center; justify-content: center; }
  .stat-icon.c-gold   { background: rgba(201,168,76,0.12); color: var(--gold); }
  .stat-icon.c-blue   { background: rgba(91,155,220,0.12); color: var(--info); }
  .stat-icon.c-green  { background: rgba(76,175,125,0.12); color: var(--success); }
  .stat-icon.c-purple { background: rgba(160,123,200,0.12); color: var(--purple); }

  .stat-value { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 600; color: var(--t1); line-height: 1; margin-bottom: 4px; }
  .stat-value.gold { color: var(--gold); }
  .stat-sub { font-size: 11px; color: var(--t3); }

  /* ── LOWER GRID LAYOUT ── */
  .lower-grid { display: grid; grid-template-columns: 1fr 300px; gap: 16px; align-items: start; }
  @media (max-width: 900px) { .lower-grid { grid-template-columns: 1fr; } }

  /* ── PANEL (Reusable Container) ── */
  .panel { background: var(--s2); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
  .panel-head { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid var(--border); }
  .panel-title { font-size: 14px; font-weight: 600; color: var(--t1); }

  /* ── ACTIVITY LIST ── */
  .activity-list { display: flex; flex-direction: column; }
  .activity-item { display: flex; align-items: center; gap: 14px; padding: 14px 20px; border-bottom: 1px solid rgba(255,255,255,0.04); transition: background 0.15s; }
  .activity-item:last-child { border-bottom: none; }
  .activity-item:hover { background: var(--s3); }
  
  .act-icon { width: 36px; height: 36px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .act-icon.gold { background: rgba(201,168,76,0.1); color: var(--gold); }
  .act-icon.blue { background: rgba(91,155,220,0.1); color: var(--info); }
  .act-icon.green { background: rgba(76,175,125,0.1); color: var(--success); }
  
  .act-info { flex: 1; }
  .act-label { font-size: 13px; font-weight: 500; color: var(--t1); margin-bottom: 2px; }
  .act-time { font-size: 11px; color: var(--t3); }

  /* ── RIGHT COLUMN (Sidebar) ── */
  .right-col { display: flex; flex-direction: column; gap: 14px; }

  /* ── QUICK LINKS ── */
  .quick-links { display: flex; flex-direction: column; gap: 10px; padding: 14px; }

  .ql-item {
    display: flex; align-items: center; gap: 12px;
    padding: 13px 16px; border-radius: 9px; text-decoration: none;
    font-size: 13px; font-weight: 600; border: 1px solid transparent;
    transition: all 0.18s;
  }
  .ql-icon { width: 32px; height: 32px; border-radius: 7px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .ql-text { flex: 1; }
  .ql-label { display: block; }
  .ql-desc { font-size: 11px; font-weight: 400; opacity: 0.6; margin-top: 1px; display: block; }
  .ql-arrow { font-size: 16px; opacity: 0.5; }

  .ql-item.primary { background: var(--gold); color: #111; }
  .ql-item.primary:hover { background: #D4AE5A; }
  .ql-item.primary .ql-icon { background: rgba(0,0,0,0.15); }

  .ql-item.ghost { background: var(--s3); color: var(--t1); border-color: var(--border); }
  .ql-item.ghost:hover { background: var(--s4); border-color: var(--gold-line); }
  .ql-item.ghost .ql-icon { background: rgba(91,155,220,0.1); color: var(--info); }

  /* ── INFO BOX ── */
  .info-box { background: #141312; border: 1px solid var(--gold-line); border-radius: 10px; padding: 16px; }
  .info-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); animation: pulse-g 2s ease-in-out infinite; flex-shrink: 0; }
  @keyframes pulse-g { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.3; transform:scale(0.7); } }
  .info-head { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
  .info-title { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--gold); }
  .info-text { font-size: 12px; color: var(--t3); line-height: 1.7; }

  /* ── SKELETON LOADER ── */
  .skel { background: linear-gradient(90deg, var(--s3) 25%, var(--s4) 50%, var(--s3) 75%); background-size: 200% 100%; animation: sh 1.4s infinite; border-radius: 4px; display: inline-block; }
  @keyframes sh { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
`;
