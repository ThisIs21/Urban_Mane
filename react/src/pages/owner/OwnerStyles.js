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

export const ownerInventoryCss = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=Montserrat:wght@300;400;500;600&display=swap');

  .inv-container {
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    animation: fadeIn 0.4s ease-out;
  }

  /* ── HEADER ── */
  .inv-header {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  .inv-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: white;
    margin-bottom: 4px;
  }

  .inv-timestamp {
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    color: #a1a1a1;
  }

  /* ── STAT CARDS GRID ── */
  .inv-stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    animation: slideInUp 0.5s ease-out 0.1s both;
  }

  .inv-stat-card {
    position: relative;
    background: #18181b;
    border: 1px solid #27272a;
    border-radius: 12px;
    padding: 24px;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .inv-stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #991b1b, #dc2626);
  }

  .inv-stat-card.inv-stat-gold::before {
    background: linear-gradient(90deg, #d4af37, #f4c430);
  }

  .inv-stat-card.inv-stat-green::before {
    background: linear-gradient(90deg, #22c55e, #4ade80);
  }

  .inv-stat-card.inv-stat-red::before {
    background: linear-gradient(90deg, #ef4444, #f87171);
  }

  .inv-stat-card.inv-stat-blue::before {
    background: linear-gradient(90deg, #3b82f6, #60a5fa);
  }

  .inv-stat-card:hover {
    transform: translateY(-4px);
    border-color: #3f3f46;
  }

  .inv-stat-icon {
    width: 44px;
    height: 44px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin-bottom: 16px;
  }

  .inv-stat-icon-gold { background: rgba(212, 175, 55, 0.2); }
  .inv-stat-icon-green { background: rgba(34, 197, 94, 0.2); }
  .inv-stat-icon-red { background: rgba(239, 68, 68, 0.2); }
  .inv-stat-icon-blue { background: rgba(59, 130, 246, 0.2); }

  .inv-stat-number {
    font-family: 'Montserrat', sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: white;
    margin-bottom: 8px;
    line-height: 1.2;
  }

  .inv-stat-label {
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    color: #a1a1a1;
    font-weight: 500;
    margin-bottom: 8px;
  }

  .inv-stat-badge {
    display: inline-block;
    padding: 6px 10px;
    background: rgba(34, 197, 94, 0.2);
    border-radius: 6px;
    font-size: 11px;
    color: #22c55e;
    font-weight: 500;
  }

  .inv-stat-badge-danger {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
  }

  /* ── FILTERS ── */
  .inv-filter-section {
    display: flex;
    gap: 12px;
    animation: slideInUp 0.5s ease-out 0.15s both;
  }

  .inv-search-input,
  .inv-filter-select {
    padding: 10px 14px;
    background: #18181b;
    border: 1px solid #27272a;
    border-radius: 8px;
    color: white;
    font-family: 'Montserrat', sans-serif;
    font-size: 12px;
    outline: none;
    transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .inv-search-input {
    flex: 1;
    min-width: 240px;
  }

  .inv-search-input::placeholder {
    color: #a1a1a1;
  }

  .inv-search-input:focus,
  .inv-filter-select:focus {
    border-color: #fbbf24;
    box-shadow: 0 0 0 2px rgba(251, 191, 36, 0.1);
  }

  .inv-filter-select {
    width: 160px;
    cursor: pointer;
    color-scheme: dark;
  }

  /* ── TABLE CONTAINER ── */
  .inv-table-container {
    background: #18181b;
    border: 1px solid #27272a;
    border-radius: 12px;
    overflow: hidden;
    animation: slideInUp 0.5s ease-out 0.2s both;
  }

  .inv-table-header {
    padding: 16px 20px;
    border-bottom: 1px solid #27272a;
    background: #0a0a0a;
  }

  .inv-table-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: white;
  }

  /* ── TABLE STYLING ── */
  .inv-table-wrapper {
    overflow-x: auto;
  }

  .inv-table {
    width: 100%;
    border-collapse: collapse;
    font-family: 'Montserrat', sans-serif;
  }

  .inv-table thead tr {
    border-bottom: 1px solid #27272a;
  }

  .inv-table th {
    padding: 12px 16px;
    text-align: left;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #71717a;
    background: #0a0a0a;
    white-space: nowrap;
  }

  .inv-table td {
    padding: 14px 16px;
    border-bottom: 1px solid #27272a;
    color: #e4e4e7;
    font-size: 12px;
  }

  .inv-table tbody tr {
    transition: all 0.25s ease;
  }

  .inv-table tbody tr:hover {
    background: #27272a;
  }

  .inv-table tbody tr:last-child td {
    border-bottom: none;
  }

  /* ── TABLE COLUMNS ── */
  .inv-col-product { width: 40%; }
  .inv-col-stock { width: 25%; }
  .inv-col-sold { width: 12%; }
  .inv-col-revenue { width: 12%; }
  .inv-col-restock { width: 11%; }

  /* ── PRODUCT CELL ── */
  .inv-product-cell {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .inv-product-thumb {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: #3f3f46;
    overflow: hidden;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .inv-product-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .inv-product-icon {
    font-size: 20px;
  }

  .inv-product-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .inv-product-name {
    color: white;
    font-weight: 500;
    font-size: 13px;
  }

  .inv-product-sku {
    color: #a1a1a1;
    font-size: 11px;
    font-family: 'Courier New', monospace;
  }

  /* ── STOCK CELL ── */
  .inv-stock-cell {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .inv-stock-bar-wrapper {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1;
  }

  .inv-stock-bar {
    height: 6px;
    background: #3f3f46;
    border-radius: 3px;
    overflow: hidden;
  }

  .inv-stock-progress {
    height: 100%;
    border-radius: 3px;
    transition: width 0.3s ease;
  }

  .inv-stock-green { background: #22c55e; }
  .inv-stock-amber { background: #f59e0b; }
  .inv-stock-red { background: #ef4444; }

  .inv-stock-units {
    font-size: 11px;
    color: #a1a1a1;
    text-align: right;
  }

  .inv-stock-badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
  }

  .inv-stock-green { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
  .inv-stock-amber { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
  .inv-stock-red { background: rgba(239, 68, 68, 0.2); color: #ef4444; }

  /* ── CELL TEXT ── */
  .inv-cell-text {
    color: #e4e4e7;
    font-size: 12px;
  }

  .inv-cell-revenue {
    color: #fbbf24;
    font-weight: 600;
    font-size: 12px;
  }

  /* ── LOADING & EMPTY STATES ── */
  .inv-loading,
  .inv-empty {
    padding: 60px 20px;
    text-align: center;
    color: #a1a1a1;
    font-size: 14px;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 1400px) {
    .inv-stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .inv-container {
      padding: 16px;
      gap: 16px;
    }

    .inv-stats-grid {
      grid-template-columns: 1fr;
    }

    .inv-filter-section {
      flex-direction: column;
    }

    .inv-search-input,
    .inv-filter-select {
      width: 100%;
    }

    .inv-table-wrapper {
      overflow-x: auto;
    }

    .inv-table {
      min-width: 100%;
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const reportCss = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');

  .report-header {
    background: linear-gradient(135deg, rgba(10,10,10,0.95), rgba(22,22,22,0.95)) border-box,
                linear-gradient(135deg, #C9A84C, rgba(201,168,76,0.1));
    border: 1px solid rgba(201,168,76,0.2);
    border-bottom: none;
    padding: 16px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    backdrop-filter: blur(5px);
  }

  .report-header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .report-header-text {
    flex: 1;
  }

  .report-eyebrow {
    font-size: 14px;
    font-weight: 600;
    color: white;
    margin: 0;
    margin-bottom: 2px;
  }

  .report-description {
    font-size: 12px;
    color: #888;
    margin: 0;
  }

  .report-header-icon {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, #d4af37, #f4c430);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: #1a1a1a;
    font-size: 14px;
  }

  .report-container {
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  /* ── TITLE SECTION ── */
  .report-title-section {
    margin-bottom: 8px;
  }

  .report-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: white;
    margin: 0;
    margin-bottom: 6px;
  }

  .report-period {
    font-size: 12px;
    color: #888;
    margin: 0;
  }

  /* ── STAT CARDS GRID ── */
  .stat-cards-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    animation: slideInUp 0.5s ease-out both;
  }

  .stat-card {
    position: relative;
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: 12px;
    padding: 24px;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #d4af37, #f4c430);
  }

  .stat-card.gold::before {
    background: linear-gradient(90deg, #d4af37, #f4c430);
  }

  .stat-card.green::before {
    background: linear-gradient(90deg, #22c55e, #4ade80);
  }

  .stat-card.blue::before {
    background: linear-gradient(90deg, #3b82f6, #60a5fa);
  }

  .stat-card.red::before {
    background: linear-gradient(90deg, #ef4444, #f87171);
  }

  .stat-card:hover {
    transform: translateY(-4px);
    border-color: #3a3a3a;
  }

  .stat-card-icon {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    margin-bottom: 16px;
  }

  .stat-card-icon.gold { background: rgba(212, 175, 55, 0.2); }
  .stat-card-icon.green { background: rgba(34, 197, 94, 0.2); }
  .stat-card-icon.blue { background: rgba(59, 130, 246, 0.2); }
  .stat-card-icon.red { background: rgba(239, 68, 68, 0.2); }

  .stat-card-value {
    font-family: 'Montserrat', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: white;
    margin-bottom: 8px;
    line-height: 1.2;
  }

  .stat-card-label {
    font-family: 'Montserrat', sans-serif;
    font-size: 11px;
    color: #888;
    font-weight: 500;
  }

  /* ── FILTER PANEL ── */
  .filter-panel {
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: 12px;
    padding: 20px;
  }

  .filter-inputs {
    display: flex;
    gap: 16px;
    align-items: flex-end;
    flex-wrap: wrap;
  }

  .filter-input-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
    min-width: 150px;
  }

  .filter-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #888;
  }

  .filter-input {
    padding: 10px 12px;
    background: #0a0a0a;
    border: 1px solid #2a2a2a;
    border-radius: 8px;
    color: white;
    font-family: 'Montserrat', sans-serif;
    font-size: 13px;
    outline: none;
    transition: all 0.2s ease;
  }

  .filter-input:focus {
    border-color: #d4af37;
    box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.1);
  }

  .filter-input::placeholder { color: #666; }

  .filter-buttons {
    display: flex;
    gap: 10px;
  }

  .btn-generate {
    padding: 10px 20px;
    background: linear-gradient(135deg, #d4af37, #f4c430);
    border: none;
    border-radius: 8px;
    color: #1a1a1a;
    font-weight: 600;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: 'Montserrat', sans-serif;
  }

  .btn-generate:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
  }

  .btn-export {
    padding: 10px 20px;
    background: transparent;
    border: 1px solid #2a2a2a;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: 'Montserrat', sans-serif;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .btn-export:hover {
    border-color: #d4af37;
    color: #d4af37;
  }

  /* ── TREND CHART ── */
  .trend-panel {
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: 12px;
    padding: 24px;
  }

  .trend-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: white;
    margin: 0 0 20px 0;
  }

  .trend-chart {
    display: flex;
    gap: 12px;
    align-items: flex-end;
    height: 120px;
    margin-bottom: 12px;
  }

  .trend-bar-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    flex: 1;
  }

  .trend-bar-container {
    width: 100%;
    height: 80px;
    background: #0a0a0a;
    border-radius: 6px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 4px;
  }

  .trend-bar {
    width: 80%;
    background: linear-gradient(180deg, #d4af37, #8b7621);
    border-radius: 4px 4px 0 0;
    min-height: 4px;
    transition: all 0.3s ease;
  }

  .trend-bar:hover {
    background: linear-gradient(180deg, #f4c430, #c4a030);
  }

  .trend-label {
    text-align: center;
    font-size: 10px;
    color: #888;
  }

  .trend-value {
    font-weight: 600;
    color: #d4af37;
    font-size: 11px;
  }

  /* ── TRANSACTION TABLE ── */
  .transaction-table-panel {
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: 12px;
    overflow: hidden;
  }

  .transaction-header {
    padding: 16px 20px;
    border-bottom: 1px solid #2a2a2a;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .transaction-title {
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: white;
    margin: 0;
  }

  .transaction-count {
    font-size: 11px;
    color: #888;
    margin: 0;
  }

  .transaction-table-wrapper {
    overflow-x: auto;
    max-height: 500px;
    overflow-y: auto;
  }

  .transaction-table {
    width: 100%;
    border-collapse: collapse;
    font-family: 'Montserrat', sans-serif;
  }

  .transaction-table thead {
    position: sticky;
    top: 0;
    background: #0a0a0a;
    border-bottom: 1px solid #2a2a2a;
  }

  .transaction-table th {
    padding: 12px 16px;
    text-align: left;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #888;
    white-space: nowrap;
  }

  .transaction-table tbody tr {
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background 0.15s;
  }

  .transaction-table tbody tr:hover {
    background: rgba(212, 175, 55, 0.05);
  }

  .transaction-table td {
    padding: 14px 16px;
    font-size: 12px;
  }

  .col-date { width: 140px; }
  .col-id { width: 140px; }
  .col-customer { width: 120px; }
  .col-items { width: 200px; }
  .col-payment { width: 120px; }
  .col-total { width: 130px; }
  .col-status { width: 110px; }

  .date-time {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .date-time > div:first-child {
    color: white;
    font-weight: 500;
  }

  .time {
    color: #888;
    font-size: 11px;
  }

  .payment-badge {
    display: inline-block;
    padding: 4px 8px;
    background: #2a2a2a;
    border-radius: 4px;
    font-size: 10px;
    color: #888;
    font-weight: 500;
  }

  .status-badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 10px;
    font-weight: 600;
  }

  .status-success {
    background: rgba(34, 197, 94, 0.2);
    color: #22c55e;
  }

  .status-pending {
    background: rgba(251, 146, 36, 0.2);
    color: #fb9224;
  }

  .status-cancelled {
    background: rgba(239, 68, 68, 0.2);
    color: #ef4444;
  }

  .loading-state, .empty-state {
    padding: 60px 20px;
    text-align: center;
    color: #888;
    font-size: 14px;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 1400px) {
    .stat-cards-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .report-container {
      padding: 16px;
      gap: 16px;
    }

    .stat-cards-grid {
      grid-template-columns: 1fr;
    }

    .filter-inputs {
      flex-direction: column;
    }

    .filter-input-group {
      width: 100%;
    }

    .filter-buttons {
      width: 100%;
      justify-content: space-between;
    }

    .btn-generate, .btn-export {
      flex: 1;
    }

    .trend-chart {
      height: 100px;
    }

    .transaction-table-wrapper {
      overflow-x: auto;
    }
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
