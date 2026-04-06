import { useState, useEffect, useRef } from 'react';
import orderService from '../../services/orderService';

/* ─── Styles ──────────────────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@300;400;500;600&display=swap');

  .hist-root {
    --gold:       #C9A84C;
    --gold-light: #E8C97A;
    --gold-dim:   rgba(201,168,76,0.12);
    --gold-line:  rgba(201,168,76,0.22);
    --s0: #0E0E0D;
    --s1: #161513;
    --s2: #1E1D1B;
    --s3: #272624;
    --s4: #312F2C;
    --border: rgba(255,255,255,0.07);
    --t1: #F0EDE6;
    --t2: #9A9690;
    --t3: #56534E;
    --success: #4CAF7D;
    --danger:  #E05252;
    --info:    #5B9BDC;
    font-family: 'DM Sans', sans-serif;
    color: var(--t1);
  }
  .hist-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .hist-root ::-webkit-scrollbar { width: 4px; }
  .hist-root ::-webkit-scrollbar-thumb { background: var(--s4); border-radius: 2px; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .anim { animation: fadeUp 0.4s ease both; }
  .a1 { animation-delay: 0.04s; }
  .a2 { animation-delay: 0.10s; }
  .a3 { animation-delay: 0.16s; }

  /* ── HEADER ── */
  .hist-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 24px;
  }
  .hist-eyebrow {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 5px;
  }
  .hist-title {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    font-weight: 600;
    color: var(--t1);
    letter-spacing: 0.01em;
  }
  .hist-subtitle { font-size: 13px; color: var(--t3); margin-top: 4px; }

  /* Summary chips */
  .summary-chips {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
  .summary-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 8px;
    background: var(--s2);
    border: 1px solid var(--border);
    font-size: 12px;
  }
  .summary-chip .chip-label { color: var(--t3); }
  .summary-chip .chip-value { color: var(--t1); font-weight: 600; }
  .summary-chip .chip-value.gold { color: var(--gold); }

  /* ── FILTER BAR ── */
  .filter-bar {
    display: flex;
    align-items: flex-end;
    gap: 12px;
    padding: 16px 20px;
    background: var(--s2);
    border: 1px solid var(--border);
    border-radius: 12px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
  .filter-group { display: flex; flex-direction: column; gap: 5px; }
  .filter-label {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--t3);
  }
  .filter-input {
    padding: 8px 12px;
    background: var(--s3);
    border: 1px solid var(--border);
    border-radius: 7px;
    color: var(--t1);
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.2s;
    color-scheme: dark;
  }
  .filter-input:focus { border-color: var(--gold-line); }

  .filter-divider { width: 1px; height: 36px; background: var(--border); align-self: flex-end; }

  .filter-btn {
    padding: 9px 20px;
    background: var(--gold);
    border: none;
    border-radius: 7px;
    color: #111;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.2s;
    align-self: flex-end;
  }
  .filter-btn:hover { background: var(--gold-light); }
  .filter-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .filter-reset {
    padding: 9px 14px;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 7px;
    color: var(--t3);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s;
    align-self: flex-end;
  }
  .filter-reset:hover { border-color: var(--border); color: var(--t2); background: var(--s3); }

  /* ── TABLE PANEL ── */
  .table-panel {
    background: var(--s2);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
  }

  .table-panel-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px;
    border-bottom: 1px solid var(--border);
  }
  .table-panel-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--t1);
  }
  .table-count {
    font-size: 11px;
    color: var(--t3);
    background: var(--s3);
    padding: 3px 9px;
    border-radius: 20px;
    border: 1px solid var(--border);
  }

  .hist-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }
  .hist-table thead tr { border-bottom: 1px solid var(--border); }
  .hist-table th {
    padding: 10px 20px;
    text-align: left;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--t3);
    background: var(--s1);
    white-space: nowrap;
  }
  .hist-table th.right { text-align: right; }
  .hist-table th.center { text-align: center; }
  .hist-table tbody tr {
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background 0.15s;
    cursor: default;
  }
  .hist-table tbody tr:last-child { border-bottom: none; }
  .hist-table tbody tr:hover { background: var(--s3); }
  .hist-table td { padding: 13px 20px; color: var(--t2); vertical-align: middle; }

  .td-time { font-size: 12px; color: var(--t3); white-space: nowrap; }
  .td-time strong { display: block; color: var(--t2); font-weight: 500; font-size: 13px; margin-bottom: 1px; }

  .td-invoice {
    font-size: 11px;
    color: var(--gold);
    font-weight: 500;
    letter-spacing: 0.03em;
    white-space: nowrap;
  }

  .td-customer { color: var(--t1); font-weight: 500; }
  .td-barber   { color: var(--t2); }

  .td-items { color: var(--t3); font-size: 12px; }
  .items-toggle {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: 3px;
    font-size: 11px;
    color: var(--info);
    background: rgba(91,155,220,0.08);
    border: 1px solid rgba(91,155,220,0.15);
    border-radius: 4px;
    padding: 2px 7px;
    cursor: pointer;
    transition: background 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .items-toggle:hover { background: rgba(91,155,220,0.15); }

  .td-amount {
    color: var(--t1);
    font-weight: 600;
    text-align: right;
    white-space: nowrap;
    font-size: 14px;
  }
  .td-center { text-align: center; }

  .pill-done {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    background: rgba(76,175,125,0.1);
    color: #4CAF7D;
    border: 1px solid rgba(76,175,125,0.2);
  }

  /* Items popup */
  .items-popup {
    position: fixed;
    z-index: 9999;
    background: var(--s3);
    border: 1px solid var(--gold-line);
    border-radius: 9px;
    padding: 12px 14px;
    min-width: 180px;
    max-width: 240px;
    box-shadow: 0 16px 40px rgba(0,0,0,0.5);
    animation: fadeUp 0.15s ease;
  }
  .items-popup-title {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--t3);
    margin-bottom: 8px;
    padding-bottom: 7px;
    border-bottom: 1px solid var(--border);
  }
  .items-popup-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: var(--t2);
    padding: 4px 0;
    gap: 12px;
  }
  .items-popup-row:not(:last-child) { border-bottom: 1px solid rgba(255,255,255,0.04); }
  .items-popup-name { color: var(--t1); }
  .items-popup-qty { color: var(--t3); font-size: 11px; flex-shrink: 0; }

  /* Empty & Loading */
  .empty-msg {
    padding: 60px 20px;
    text-align: center;
    color: var(--t3);
    font-size: 13px;
  }
  .skel {
    background: linear-gradient(90deg, var(--s3) 25%, var(--s4) 50%, var(--s3) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 4px;
    height: 13px;
    display: block;
  }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

  /* Pagination */
  .pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    border-top: 1px solid var(--border);
    font-size: 12px;
    color: var(--t3);
  }
  .page-btns { display: flex; gap: 6px; }
  .page-btn {
    width: 30px; height: 30px;
    border-radius: 6px;
    border: 1px solid var(--border);
    background: var(--s3);
    color: var(--t2);
    cursor: pointer;
    font-size: 12px;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.15s;
    display: flex; align-items: center; justify-content: center;
  }
  .page-btn:hover:not(:disabled) { border-color: var(--gold-line); color: var(--t1); }
  .page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .page-btn.active { background: var(--gold); color: #111; border-color: var(--gold); font-weight: 700; }
`;

const PER_PAGE = 12;

const History = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [popup, setPopup] = useState(null); // { items, x, y }
  const popupRef = useRef(null);

  const formatRp = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

  const fetchHistory = async (sd, ed) => {
    try {
      setLoading(true);
      const data = await orderService.getHistory(sd, ed);
      setOrders(data || []);
      setPage(1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setEndDate(today);
    setStartDate(lastWeek);
    fetchHistory(lastWeek, today);

    const handleClick = () => setPopup(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleFilter = () => fetchHistory(startDate, endDate);

  const handleReset = () => {
    const today = new Date().toISOString().split('T')[0];
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setStartDate(lastWeek);
    setEndDate(today);
    fetchHistory(lastWeek, today);
  };

  const openPopup = (e, items) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setPopup({ items, x: rect.left, y: rect.bottom + 6 });
  };

  const totalSales = orders.reduce((s, o) => s + o.grandTotal, 0);
  const totalPages = Math.ceil(orders.length / PER_PAGE);
  const paginated = orders.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const formatDate = (iso) => {
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  return (
    <>
      <style>{css}</style>
      <div className="hist-root">

        {/* ── HEADER ── */}
        <div className="hist-header anim a1">
          <div>
            <p className="hist-eyebrow">Laporan</p>
            <h1 className="hist-title">Riwayat Transaksi</h1>
            <p className="hist-subtitle">Daftar semua order yang telah selesai</p>
          </div>
          {!loading && orders.length > 0 && (
            <div className="summary-chips">
              <div className="summary-chip">
                <span className="chip-label">Total transaksi</span>
                <span className="chip-value">{orders.length}</span>
              </div>
              <div className="summary-chip">
                <span className="chip-label">Total pendapatan</span>
                <span className="chip-value gold">{formatRp(totalSales)}</span>
              </div>
            </div>
          )}
        </div>

        {/* ── FILTER BAR ── */}
        <div className="filter-bar anim a2">
          <div className="filter-group">
            <label className="filter-label">Dari Tanggal</label>
            <input type="date" className="filter-input" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div className="filter-group">
            <label className="filter-label">Sampai Tanggal</label>
            <input type="date" className="filter-input" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
          <div className="filter-divider" />
          <button className="filter-btn" onClick={handleFilter} disabled={loading}>
            {loading ? 'Memuat...' : 'Terapkan'}
          </button>
          <button className="filter-reset" onClick={handleReset}>Reset</button>
        </div>

        {/* ── TABLE ── */}
        <div className="table-panel anim a3">
          <div className="table-panel-head">
            <span className="table-panel-title">Daftar Transaksi</span>
            {!loading && <span className="table-count">{orders.length} data</span>}
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="hist-table">
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>Invoice</th>
                  <th>Customer</th>
                  <th>Barber</th>
                  <th>Item</th>
                  <th className="right">Total</th>
                  <th className="center">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      {[60, 90, 80, 70, 50, 70, 55].map((w, j) => (
                        <td key={j}><span className="skel" style={{ width: w }} /></td>
                      ))}
                    </tr>
                  ))
                ) : paginated.length === 0 ? (
                  <tr><td colSpan="7"><div className="empty-msg">Tidak ada transaksi pada periode ini.</div></td></tr>
                ) : (
                  paginated.map(order => {
                    const { date, time } = formatDate(order.createdAt);
                    return (
                      <tr key={order.id}>
                        <td className="td-time">
                          <strong>{date}</strong>
                          {time}
                        </td>
                        <td className="td-invoice">{order.invoiceNumber}</td>
                        <td className="td-customer">{order.customerName || 'Walk-in'}</td>
                        <td className="td-barber">{order.barberName || '—'}</td>
                        <td className="td-items">
                          {order.items.length} item
                          <br />
                          <button className="items-toggle" onClick={e => openPopup(e, order.items)}>
                            <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeWidth="2"/>
                              <circle cx="12" cy="12" r="3" strokeWidth="2"/>
                            </svg>
                            Lihat detail
                          </button>
                        </td>
                        <td className="td-amount">{formatRp(order.grandTotal)}</td>
                        <td className="td-center"><span className="pill-done">Selesai</span></td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <span>Halaman {page} dari {totalPages}</span>
              <div className="page-btns">
                <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                  ‹
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const p = totalPages <= 5 ? i + 1 : page <= 3 ? i + 1 : page >= totalPages - 2 ? totalPages - 4 + i : page - 2 + i;
                  return (
                    <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>
                      {p}
                    </button>
                  );
                })}
                <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                  ›
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Items Popup */}
        {popup && (
          <div
            ref={popupRef}
            className="items-popup"
            style={{ left: popup.x, top: popup.y }}
            onClick={e => e.stopPropagation()}
          >
            <p className="items-popup-title">Detail Item</p>
            {popup.items.map((item, i) => (
              <div key={i} className="items-popup-row">
                <span className="items-popup-name">{item.name}</span>
                <span className="items-popup-qty">×{item.quantity}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default History;