/* adminTableStyles.js - shared CSS string for admin CRUD pages */

export const adminTableCss = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@300;400;500;600&display=swap');

  .adm-page {
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
  .adm-page * { box-sizing: border-box; margin: 0; padding: 0; }
  .adm-page ::-webkit-scrollbar { width: 4px; }
  .adm-page ::-webkit-scrollbar-thumb { background: var(--s4); border-radius: 2px; }

  @keyframes adm-fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .adm-a1 { animation: adm-fadeUp 0.38s ease 0.04s both; }
  .adm-a2 { animation: adm-fadeUp 0.38s ease 0.10s both; }
  .adm-a3 { animation: adm-fadeUp 0.38s ease 0.16s both; }

  /* ── HEADER ── */
  .adm-pg-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 24px;
  }
  .adm-pg-eyebrow { font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold); margin-bottom: 5px; }
  .adm-pg-title { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 600; color: var(--t1); letter-spacing: 0.01em; }
  .adm-pg-sub { font-size: 13px; color: var(--t3); margin-top: 4px; }

  .adm-add-btn {
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
  .adm-add-btn:hover { background: var(--gold-light); }

  /* ── FILTER BAR ── */
  .adm-filter-bar {
    display: flex;
    gap: 10px;
    margin-bottom: 18px;
    flex-wrap: wrap;
  }
  .adm-search {
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
  .adm-search:focus { border-color: var(--gold-line); }
  .adm-search::placeholder { color: var(--t3); }

  .adm-select {
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
  .adm-select:focus { border-color: var(--gold-line); }
  .adm-select option { background: #232220; }

  /* ── TABLE PANEL ── */
  .adm-table-panel {
    background: var(--s2);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
  }
  .adm-table-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px;
    border-bottom: 1px solid var(--border);
  }
  .adm-table-head-title { font-size: 13px; font-weight: 600; color: var(--t1); }
  .adm-count {
    font-size: 11px;
    color: var(--t3);
    background: var(--s3);
    padding: 3px 9px;
    border-radius: 20px;
    border: 1px solid var(--border);
  }

  .adm-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .adm-table thead tr { border-bottom: 1px solid var(--border); }
  .adm-table th {
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
  .adm-table th.center { text-align: center; }
  .adm-table tbody tr {
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background 0.15s;
  }
  .adm-table tbody tr:last-child { border-bottom: none; }
  .adm-table tbody tr:hover { background: var(--s3); }
  .adm-table td { padding: 13px 16px; color: var(--t2); vertical-align: middle; }

  /* Thumb */
  .adm-thumb {
    width: 40px; height: 40px;
    border-radius: 8px;
    overflow: hidden;
    background: var(--s3);
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; color: var(--gold);
    flex-shrink: 0;
  }
  .adm-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .adm-thumb.round { border-radius: 50%; }

  /* Cells */
  .adm-td-name { color: var(--t1); font-weight: 500; }
  .adm-td-gold { color: var(--gold); font-weight: 600; }
  .adm-td-mono { font-family: monospace; font-size: 12px; color: var(--t2); }
  .adm-td-center { text-align: center; }

  /* Badges */
  .adm-badge {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    border: 1px solid transparent;
  }
  .adm-badge.active   { background: rgba(76,175,125,0.1); color: #4CAF7D; border-color: rgba(76,175,125,0.2); }
  .adm-badge.inactive { background: rgba(255,255,255,0.05); color: var(--t3); border-color: var(--border); }
  .adm-badge.stock-ok  { background: rgba(76,175,125,0.1); color: #4CAF7D; border-color: rgba(76,175,125,0.18); }
  .adm-badge.stock-low { background: rgba(224,82,82,0.1); color: #E05252; border-color: rgba(224,82,82,0.18); }
  .adm-badge.role-admin   { background: rgba(224,192,96,0.1); color: #E0C060; border-color: rgba(224,192,96,0.2); }
  .adm-badge.role-owner   { background: rgba(160,123,200,0.1); color: #A07BC8; border-color: rgba(160,123,200,0.2); }
  .adm-badge.role-cashier { background: rgba(91,155,220,0.1); color: #5B9BDC; border-color: rgba(91,155,220,0.2); }
  .adm-badge.role-barber  { background: rgba(76,175,125,0.1); color: #4CAF7D; border-color: rgba(76,175,125,0.2); }

  /* Action buttons */
  .adm-action-cell { display: flex; align-items: center; justify-content: center; gap: 8px; }
  .adm-btn-edit {
    padding: 5px 12px;
    border-radius: 6px;
    border: 1px solid var(--gold-line);
    background: var(--gold-dim);
    color: var(--gold);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.15s;
  }
  .adm-btn-edit:hover { background: rgba(201,168,76,0.2); }
  .adm-btn-delete {
    padding: 5px 12px;
    border-radius: 6px;
    border: 1px solid rgba(224,82,82,0.2);
    background: rgba(224,82,82,0.06);
    color: #E05252;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.15s;
  }
  .adm-btn-delete:hover { background: rgba(224,82,82,0.15); }

  /* Empty & loading */
  .adm-empty { padding: 60px 20px; text-align: center; color: var(--t3); font-size: 13px; }
  .skel { background: linear-gradient(90deg, var(--s3) 25%, var(--s4) 50%, var(--s3) 75%); background-size: 200% 100%; animation: sh 1.4s infinite; border-radius: 4px; display: block; }
  @keyframes sh { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

  /* ── MODAL OVERRIDES ── */
  .adm-modal-body { display: flex; flex-direction: column; gap: 14px; max-height: 70vh; overflow-y: auto; padding-right: 2px; }
  .adm-modal-body::-webkit-scrollbar { width: 3px; }
  .adm-modal-body::-webkit-scrollbar-thumb { background: var(--s4); border-radius: 2px; }

  .adm-field { display: flex; flex-direction: column; gap: 5px; }
  .adm-field-label { font-size: 11px; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase; color: var(--t3); }
  .adm-field-input {
    width: 100%;
    padding: 9px 12px;
    background: var(--s3);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--t1);
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.18s;
    color-scheme: dark;
  }
  .adm-field-input:focus { border-color: var(--gold-line); }
  .adm-field-input::placeholder { color: var(--t3); }
  .adm-field-input option { background: #232220; }

  .adm-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  .adm-hr { height: 1px; background: var(--border); }

  .adm-section-title { font-size: 12px; font-weight: 700; color: var(--gold); letter-spacing: 0.06em; text-transform: uppercase; }

  .adm-toggle-row {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px;
    background: var(--s3);
    border: 1px solid var(--border);
    border-radius: 8px;
    cursor: pointer;
  }
  .adm-toggle-row input { accent-color: var(--gold); width: 15px; height: 15px; cursor: pointer; }
  .adm-toggle-label { font-size: 13px; color: var(--t2); cursor: pointer; }

  /* Preview img */
  .adm-preview { width: 72px; height: 72px; border-radius: 8px; object-fit: cover; border: 1px solid var(--border); background: var(--s3); display: block; margin-bottom: 6px; }
  .adm-preview.round { border-radius: 50%; }

  /* Bundle/Service item rows */
  .adm-item-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 9px 12px;
    background: var(--s3);
    border: 1px solid var(--border);
    border-radius: 7px;
    font-size: 13px;
    color: var(--t2);
  }
  .adm-item-remove {
    font-size: 11px;
    color: var(--danger);
    background: rgba(224,82,82,0.08);
    border: 1px solid rgba(224,82,82,0.18);
    border-radius: 5px;
    padding: 3px 9px;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.15s;
  }
  .adm-item-remove:hover { background: rgba(224,82,82,0.15); }

  .adm-add-row { display: flex; gap: 8px; align-items: center; }
  .adm-inline-add-btn {
    padding: 8px 14px;
    background: var(--gold-dim);
    border: 1px solid var(--gold-line);
    border-radius: 7px;
    color: var(--gold);
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.15s;
    white-space: nowrap;
  }
  .adm-inline-add-btn:hover { background: rgba(201,168,76,0.2); }

  /* Modal footer */
  .adm-modal-footer { display: flex; gap: 10px; margin-top: 18px; padding-top: 16px; border-top: 1px solid var(--border); }
  .adm-modal-cancel {
    flex: 1; padding: 10px; border-radius: 8px;
    background: var(--s3); border: 1px solid var(--border);
    color: var(--t2); font-size: 13px; font-weight: 500;
    cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s;
  }
  .adm-modal-cancel:hover { background: var(--s4); color: var(--t1); }
  .adm-modal-save {
    flex: 1; padding: 10px; border-radius: 8px;
    background: var(--gold); border: none;
    color: #111; font-size: 13px; font-weight: 700;
    cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.15s;
  }
  .adm-modal-save:hover { background: var(--gold-light); }
  .adm-modal-delete-confirm {
    flex: 1; padding: 10px; border-radius: 8px;
    background: rgba(224,82,82,0.1); border: 1px solid rgba(224,82,82,0.25);
    color: #E05252; font-size: 13px; font-weight: 700;
    cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s;
  }
  .adm-modal-delete-confirm:hover { background: rgba(224,82,82,0.2); }

  /* Delete modal */
  .adm-delete-msg { font-size: 14px; color: var(--t2); line-height: 1.6; margin-bottom: 4px; }
  .adm-delete-name { color: var(--t1); font-weight: 600; }
`;