/* OwnerStyles.js - Styling untuk owner pages (sama dengan admin/kasir) */

export const ownerTableCss = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@300;400;500;600&display=swap');

  .owner-page {
    --gold: #C9A84C;
    --gold-light: #E8C97A;
    --gold-dim: rgba(201,168,76,0.12);
    --gold-line: rgba(201,168,76,0.22);
    --s1: #141312;
    --s2: #1B1A18;
    --s3: #232220;
    --s4: #2D2B28;
    --s5: #383532;
    --border: rgba(255,255,255,0.07);
    --t1: #F0EDE6;
    --t2: #9A9690;
    --t3: #56534E;
    --success: #4CAF7D;
    --danger: #E05252;
    --info: #5B9BDC;
    --warning: #E0C060;
    --purple: #A07BC8;
    font-family: 'DM Sans', sans-serif;
    color: var(--t1);
  }
  .owner-page * { box-sizing: border-box; margin: 0; padding: 0; }
  .owner-page ::-webkit-scrollbar { width: 4px; }
  .owner-page ::-webkit-scrollbar-thumb { background: var(--s4); border-radius: 2px; }

  @keyframes own-fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .own-a1 { animation: own-fadeUp 0.38s ease 0.04s both; }
  .own-a2 { animation: own-fadeUp 0.38s ease 0.10s both; }
  .own-a3 { animation: own-fadeUp 0.38s ease 0.16s both; }

  /* ── HEADER ── */
  .own-pg-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 24px;
  }
  .own-pg-eyebrow { 
    font-size: 10px; 
    font-weight: 600; 
    letter-spacing: 0.12em; 
    text-transform: uppercase; 
    color: var(--gold); 
    margin-bottom: 5px; 
  }
  .own-pg-title { 
    font-family: 'Playfair Display', serif; 
    font-size: 24px; 
    font-weight: 600; 
    color: var(--t1); 
    letter-spacing: 0.01em; 
  }
  .own-pg-sub { 
    font-size: 13px; 
    color: var(--t3); 
    margin-top: 4px; 
  }

  .own-add-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 18px;
    background: var(--gold);
    border: none;
    border-radius: 8px;
    color: #111;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.03em;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.18s;
    flex-shrink: 0;
  }
  .own-add-btn:hover { background: var(--gold-light); }

  /* ── FILTER BAR ── */
  .own-filter-bar {
    display: flex;
    gap: 10px;
    margin-bottom: 18px;
    flex-wrap: wrap;
  }
  .own-search {
    flex: 1;
    min-width: 180px;
    padding: 9px 14px;
    background: var(--s2);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--t1);
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.18s;
  }
  .own-search:focus { border-color: var(--gold-line); }
  .own-search::placeholder { color: var(--t3); }

  .own-select {
    padding: 9px 14px;
    background: var(--s2);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--t1);
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    cursor: pointer;
    transition: border-color 0.18s;
    color-scheme: dark;
  }
  .own-select:focus { border-color: var(--gold-line); }
  .own-select option { background: #232220; }

  /* ── TABLE PANEL ── */
  .own-table-panel {
    background: var(--s2);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
  }
  .own-table-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px;
    border-bottom: 1px solid var(--border);
  }
  .own-table-head-title { 
    font-size: 13px; 
    font-weight: 600; 
    color: var(--t1); 
  }
  .own-count {
    font-size: 11px;
    color: var(--t3);
    background: var(--s3);
    padding: 3px 9px;
    border-radius: 20px;
    border: 1px solid var(--border);
  }

  .own-table { 
    width: 100%; 
    border-collapse: collapse; 
    font-size: 13px; 
  }
  .own-table thead tr { border-bottom: 1px solid var(--border); }
  .own-table th {
    padding: 10px 16px;
    text-align: left;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--t3);
    background: var(--s1);
    white-space: nowrap;
  }
  .own-table th.center { text-align: center; }
  .own-table th.right { text-align: right; }
  .own-table tbody tr {
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background 0.15s;
  }
  .own-table tbody tr:hover { background: var(--s3); }
  .own-table td {
    padding: 12px 16px;
    color: var(--t2);
  }
  .own-table td.center { text-align: center; }
  .own-table td.right { text-align: right; }
  .own-table tbody tr:last-child { border-bottom: none; }

  /* ── STATUS BADGES ── */
  .own-badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.03em;
  }
  .own-badge.active { background: rgba(76,175,125,0.15); color: #4CAF7D; }
  .own-badge.inactive { background: rgba(224,82,82,0.15); color: #E05252; }
  .own-badge.safe { background: rgba(76,175,125,0.15); color: #4CAF7D; }
  .own-badge.warning { background: rgba(224,192,96,0.15); color: #E0C060; }
  .own-badge.danger { background: rgba(224,82,82,0.15); color: #E05252; }

  /* ── LOADING & EMPTY STATE ── */
  .own-loading, .own-empty {
    padding: 40px 20px;
    text-align: center;
    color: var(--t3);
    font-size: 13px;
  }

  /* ── STAT CARDS (for dashboard) ── */
  .stat-card {
    background: var(--s2);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 18px 20px;
    position: relative;
    overflow: hidden;
  }
  .stat-card::before {
    content: '';
    position: absolute;
    top: 0; left: 20px; right: 20px;
    height: 2px;
  }
  .stat-card.gold::before { background: var(--gold); }
  .stat-card.blue::before { background: #5B9BDC; }
  .stat-card.amber::before { background: #E0C060; }
  .stat-card.purple::before { background: #A07BC8; }

  .stat-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--t3);
    margin-bottom: 10px;
  }
  .stat-value {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    font-weight: 600;
    color: var(--t1);
    line-height: 1.2;
    margin-bottom: 4px;
  }
  .stat-sub {
    font-size: 11px;
    color: var(--t3);
  }

  /* ── IMAGE THUMBNAIL ── */
  .own-img-thumb {
    width: 40px;
    height: 40px;
    border-radius: 6px;
    background: var(--s3);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--t3);
    font-size: 18px;
  }
  .own-img-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* ── MODAL ── */
  .own-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .own-modal {
    background: var(--s2);
    border: 1px solid var(--border);
    border-radius: 12px;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
  }
  .own-modal-head {
    padding: 20px;
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .own-modal-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--t1);
  }
  .own-modal-close {
    background: none;
    border: none;
    color: var(--t3);
    cursor: pointer;
    font-size: 18px;
  }
  .own-modal-close:hover { color: var(--t1); }

  .own-modal-body {
    padding: 20px;
  }
  .own-modal-footer {
    padding: 16px 20px;
    border-top: 1px solid var(--border);
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }

  /* ── BUTTONS ── */
  .own-btn {
    padding: 9px 16px;
    border-radius: 8px;
    border: none;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.03em;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.18s;
  }
  .own-btn.primary {
    background: var(--gold);
    color: #111;
  }
  .own-btn.primary:hover { background: var(--gold-light); }
  .own-btn.secondary {
    background: var(--s3);
    color: var(--t1);
    border: 1px solid var(--border);
  }
  .own-btn.secondary:hover { background: var(--s4); border-color: var(--gold-line); }
  .own-btn.danger {
    background: rgba(224,82,82,0.1);
    color: #E05252;
    border: 1px solid rgba(224,82,82,0.2);
  }
  .own-btn.danger:hover { background: rgba(224,82,82,0.2); }

  /* ── FORM ── */
  .own-form-group {
    margin-bottom: 16px;
  }
  .own-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: var(--t1);
    margin-bottom: 6px;
    letter-spacing: 0.02em;
  }
  .own-input, .own-textarea {
    width: 100%;
    padding: 10px 12px;
    background: var(--s3);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--t1);
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.18s;
  }
  .own-input:focus, .own-textarea:focus {
    border-color: var(--gold-line);
  }
  .own-input::placeholder { color: var(--t3); }

  /* ── CHART CONTAINER ── */
  .own-chart-container {
    background: var(--s2);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
    position: relative;
    height: 300px;
  }
`;
