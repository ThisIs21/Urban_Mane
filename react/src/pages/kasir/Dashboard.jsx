import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../../services/orderService';

/* ─── Styles ──────────────────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');

  .db-root {
    --gold:       #C9A84C;
    --gold-light: #E8C97A;
    --gold-dim:   rgba(201,168,76,0.12);
    --gold-line:  rgba(201,168,76,0.22);
    --s0: #0E0E0D;
    --s1: #161513;
    --s2: #1E1D1B;
    --s3: #272624;
    --s4: #312F2C;
    --border:     rgba(255,255,255,0.07);
    --t1: #F0EDE6;
    --t2: #9A9690;
    --t3: #56534E;
    --success: #4CAF7D;
    --info:    #5B9BDC;
    --warning: #E0C060;
    --purple:  #A07BC8;
    --danger:  #E05252;
    font-family: 'DM Sans', sans-serif;
    color: var(--t1);
    min-height: 100vh;
  }
  .db-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .db-root ::-webkit-scrollbar { width: 4px; }
  .db-root ::-webkit-scrollbar-thumb { background: var(--s4); border-radius: 2px; }

  /* ── ENTRY ANIMATION ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .anim { animation: fadeUp 0.45s ease both; }
  .anim-1 { animation-delay: 0.05s; }
  .anim-2 { animation-delay: 0.10s; }
  .anim-3 { animation-delay: 0.15s; }
  .anim-4 { animation-delay: 0.20s; }
  .anim-5 { animation-delay: 0.25s; }
  .anim-6 { animation-delay: 0.30s; }

  /* ── HEADER ── */
  .db-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 28px;
  }
  .db-greeting {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 6px;
  }
  .db-title {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 600;
    color: var(--t1);
    letter-spacing: 0.01em;
    line-height: 1.1;
  }
  .db-date-chip {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 3px;
  }
  .db-date-label {
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--t3);
  }
  .db-date-value {
    font-size: 13px;
    font-weight: 500;
    color: var(--t2);
  }

  /* ── STAT CARDS ── */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 28px;
  }
  @media (max-width: 900px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }

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

  /* Accent line top */
  .stat-card::before {
    content: '';
    position: absolute;
    top: 0; left: 20px; right: 20px;
    height: 1px;
  }
  .stat-card.gold::before  { background: var(--gold); }
  .stat-card.blue::before  { background: #5B9BDC; }
  .stat-card.amber::before { background: #E0C060; }
  .stat-card.purple::before{ background: #A07BC8; }

  .stat-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--t3);
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .stat-icon {
    width: 28px; height: 28px;
    border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
  }
  .stat-icon.gold   { background: rgba(201,168,76,0.12); color: var(--gold); }
  .stat-icon.blue   { background: rgba(91,155,220,0.12); color: #5B9BDC; }
  .stat-icon.amber  { background: rgba(224,192,96,0.12); color: #E0C060; }
  .stat-icon.purple { background: rgba(160,123,200,0.12); color: #A07BC8; }

  .stat-value {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    font-weight: 600;
    color: var(--t1);
    line-height: 1;
    margin-bottom: 4px;
  }
  .stat-value.gold-text { color: var(--gold); }
  .stat-sub {
    font-size: 11px;
    color: var(--t3);
    font-weight: 400;
  }

  /* ── LOWER GRID ── */
  .lower-grid {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 16px;
    align-items: start;
  }
  @media (max-width: 900px) { .lower-grid { grid-template-columns: 1fr; } }

  /* ── PANEL ── */
  .panel {
    background: var(--s2);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
  }
  .panel-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
  }
  .panel-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--t1);
    letter-spacing: 0.01em;
  }
  .panel-link {
    font-size: 11px;
    color: var(--gold);
    text-decoration: none;
    letter-spacing: 0.04em;
    font-weight: 500;
    transition: color 0.15s;
  }
  .panel-link:hover { color: var(--gold-light); }

  /* ── TABLE ── */
  .hist-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  .hist-table thead tr {
    border-bottom: 1px solid var(--border);
  }
  .hist-table th {
    padding: 10px 20px;
    text-align: left;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--t3);
  }
  .hist-table th:last-child { text-align: center; }
  .hist-table th.right { text-align: right; }
  .hist-table tbody tr {
    border-bottom: 1px solid var(--border);
    transition: background 0.15s;
  }
  .hist-table tbody tr:last-child { border-bottom: none; }
  .hist-table tbody tr:hover { background: var(--s3); }
  .hist-table td { padding: 12px 20px; color: var(--t2); vertical-align: middle; }
  .hist-table td.invoice { color: var(--gold); font-size: 11px; letter-spacing: 0.04em; font-weight: 500; }
  .hist-table td.customer { color: var(--t1); font-weight: 500; }
  .hist-table td.amount { color: var(--t1); font-weight: 600; text-align: right; }
  .hist-table td.center { text-align: center; }

  .status-pill {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    border: 1px solid transparent;
  }
  .pill-completed { background: rgba(76,175,125,0.1); color: #4CAF7D; border-color: rgba(76,175,125,0.2); }
  .pill-pending   { background: rgba(160,123,200,0.1); color: #A07BC8; border-color: rgba(160,123,200,0.2); }

  .empty-row td {
    padding: 40px 20px;
    text-align: center;
    color: var(--t3);
    font-size: 13px;
  }

  /* ── RIGHT COLUMN ── */
  .right-col { display: flex; flex-direction: column; gap: 14px; }

  /* ── QUICK ACTION BUTTONS ── */
  .qa-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    border-radius: 10px;
    text-decoration: none;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.02em;
    transition: all 0.2s;
    border: 1px solid transparent;
  }
  .qa-btn-icon {
    width: 34px; height: 34px;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .qa-btn.primary {
    background: var(--gold);
    color: #111;
  }
  .qa-btn.primary:hover { background: #D4AE5A; }
  .qa-btn.primary .qa-btn-icon { background: rgba(0,0,0,0.15); color: #111; }

  .qa-btn.secondary {
    background: var(--s3);
    color: var(--t1);
    border-color: var(--border);
  }
  .qa-btn.secondary:hover { background: var(--s4); border-color: var(--gold-line); }
  .qa-btn.secondary .qa-btn-icon { background: rgba(91,155,220,0.12); color: #5B9BDC; }

  .qa-btn-text { flex: 1; }
  .qa-btn-label { display: block; }
  .qa-btn-desc { font-size: 11px; font-weight: 400; opacity: 0.65; margin-top: 1px; display: block; }

  .qa-arrow {
    font-size: 16px;
    opacity: 0.5;
    flex-shrink: 0;
  }

  /* ── INFO BOX ── */
  .info-box {
    background: var(--s1);
    border: 1px solid var(--gold-line);
    border-radius: 10px;
    padding: 16px;
  }
  .info-box-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
  }
  .info-box-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--gold);
    animation: pulse-gold 2s ease-in-out infinite;
  }
  @keyframes pulse-gold {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.7); }
  }
  .info-box-title {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--gold);
  }
  .info-box-text {
    font-size: 12px;
    color: var(--t3);
    line-height: 1.7;
  }

  /* Loading skeleton */
  .skel {
    background: linear-gradient(90deg, var(--s3) 25%, var(--s4) 50%, var(--s3) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 4px;
    height: 13px;
  }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
`;

const ICONS = {
  sales: (
    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  receipt: (
    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  clock: (
    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  wallet: (
    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
        strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  cart: (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  board: (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

const CashierDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ todaySales: 0, todayTransactions: 0, activeQueues: 0, waitingPayments: 0 });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const today = new Date().toISOString().split('T')[0];
        const [history, queue, waiting] = await Promise.all([
          orderService.getHistory(today, today),
          orderService.getQueue(),
          orderService.getWaitingPayment(),
        ]);
        const completed = history || [];
        setStats({
          todaySales: completed.reduce((s, o) => s + o.grandTotal, 0),
          todayTransactions: completed.length,
          activeQueues: (queue || []).length,
          waitingPayments: (waiting || []).length,
        });
        setRecentOrders(completed.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const formatRp = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
  const dateStr = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const statCards = [
    { key: 'sales',   accent: 'gold',   icon: 'sales',   label: 'Penjualan Hari Ini',  value: formatRp(stats.todaySales),       sub: 'Total pendapatan',     goldVal: true },
    { key: 'txn',     accent: 'blue',   icon: 'receipt', label: 'Transaksi',            value: stats.todayTransactions,          sub: 'order selesai' },
    { key: 'queue',   accent: 'amber',  icon: 'clock',   label: 'Antrian Aktif',        value: stats.activeQueues,               sub: 'sedang menunggu' },
    { key: 'payment', accent: 'purple', icon: 'wallet',  label: 'Menunggu Bayar',       value: stats.waitingPayments,            sub: 'perlu diproses' },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="db-root">

        {/* ── HEADER ── */}
        <div className="db-header anim anim-1">
          <div>
            <p className="db-greeting">Selamat Datang</p>
            <h1 className="db-title">Dashboard Kasir</h1>
          </div>
          <div className="db-date-chip">
            <span className="db-date-label">Hari ini</span>
            <span className="db-date-value">{dateStr}</span>
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="stats-grid">
          {statCards.map((s, i) => (
            <div key={s.key} className={`stat-card ${s.accent} anim anim-${i + 2}`}>
              <div className="stat-label">
                {s.label}
                <span className={`stat-icon ${s.accent}`}>{ICONS[s.icon]}</span>
              </div>
              <p className={`stat-value ${s.goldVal ? 'gold-text' : ''}`}>
                {loading ? <span className="skel" style={{ width: 80, display: 'inline-block' }} /> : s.value}
              </p>
              <p className="stat-sub">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* ── LOWER GRID ── */}
        <div className="lower-grid">

          {/* Recent Transactions */}
          <div className="panel anim anim-6">
            <div className="panel-head">
              <span className="panel-title">Transaksi Terakhir</span>
              <Link to="/cashier/history" className="panel-link">Lihat semua →</Link>
            </div>
            <table className="hist-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Customer</th>
                  <th>Barber</th>
                  <th className="right">Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [1,2,3].map(n => (
                    <tr key={n}>
                      {[80,100,70,60,50].map((w, j) => (
                        <td key={j}><span className="skel" style={{ width: w, display:'block' }} /></td>
                      ))}
                    </tr>
                  ))
                ) : recentOrders.length === 0 ? (
                  <tr className="empty-row"><td colSpan="5">Belum ada transaksi hari ini.</td></tr>
                ) : (
                  recentOrders.map(order => (
                    <tr key={order.id}>
                      <td className="invoice">{order.invoiceNumber}</td>
                      <td className="customer">{order.customerName || 'Walk-in'}</td>
                      <td>{order.barberName || '—'}</td>
                      <td className="amount">{formatRp(order.grandTotal)}</td>
                      <td className="center">
                        <span className={`status-pill ${order.status === 'completed' ? 'pill-completed' : 'pill-pending'}`}>
                          {order.status === 'completed' ? 'Selesai' : order.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Right Column */}
          <div className="right-col anim anim-5">

            {/* Quick Actions */}
            <div className="panel">
              <div className="panel-head">
                <span className="panel-title">Aksi Cepat</span>
              </div>
              <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link to="/cashier/transaction" className="qa-btn primary">
                  <span className="qa-btn-icon">{ICONS.cart}</span>
                  <span className="qa-btn-text">
                    <span className="qa-btn-label">Transaksi Baru</span>
                    <span className="qa-btn-desc">Buka kasir & tambah item</span>
                  </span>
                  <span className="qa-arrow">›</span>
                </Link>
                <Link to="/cashier/board" className="qa-btn secondary">
                  <span className="qa-btn-icon">{ICONS.board}</span>
                  <span className="qa-btn-text">
                    <span className="qa-btn-label">Kelola Antrian</span>
                    <span className="qa-btn-desc">Papan kasir real-time</span>
                  </span>
                  <span className="qa-arrow">›</span>
                </Link>
              </div>
            </div>

            {/* Info Box */}
            <div className="info-box">
              <div className="info-box-header">
                <span className="info-box-dot" />
                <span className="info-box-title">Catatan Shift</span>
              </div>
              <p className="info-box-text">
                Cek stok produk (pomade, shampo) sebelum shift. Pastikan semua barber sudah siap sebelum antrian dibuka.
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default CashierDashboard;