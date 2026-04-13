import { useState, useEffect, useRef } from 'react';
import orderService from '../../services/orderService';
import transactionService from '../../services/transactionService';

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

  /* HEADER */
  .hist-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; }
  .hist-eyebrow { font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold); margin-bottom: 5px; }
  .hist-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 600; color: var(--t1); letter-spacing: 0.01em; }
  .hist-subtitle { font-size: 13px; color: var(--t3); margin-top: 4px; }

  /* Summary chips */
  .summary-chips { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; justify-content: flex-end; }
  .summary-chip { display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 8px; background: var(--s2); border: 1px solid var(--border); font-size: 12px; }
  .summary-chip .chip-label { color: var(--t3); }
  .summary-chip .chip-value { color: var(--t1); font-weight: 600; }
  .summary-chip .chip-value.gold { color: var(--gold); }

  /* FILTER BAR */
  .filter-bar { display: flex; align-items: flex-end; gap: 12px; padding: 16px 20px; background: var(--s2); border: 1px solid var(--border); border-radius: 12px; margin-bottom: 20px; flex-wrap: wrap; }
  .filter-group { display: flex; flex-direction: column; gap: 5px; }
  .filter-label { font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--t3); }
  .filter-input { padding: 8px 12px; background: var(--s3); border: 1px solid var(--border); border-radius: 7px; color: var(--t1); font-size: 13px; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.2s; color-scheme: dark; }
  .filter-input:focus { border-color: var(--gold-line); }
  .filter-divider { width: 1px; height: 36px; background: var(--border); align-self: flex-end; }

  .filter-btn { padding: 9px 20px; background: var(--gold); border: none; border-radius: 7px; color: #111; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.2s; align-self: flex-end; }
  .filter-btn:hover { background: var(--gold-light); }
  .filter-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .filter-reset { padding: 9px 14px; background: transparent; border: 1px solid var(--border); border-radius: 7px; color: var(--t3); font-size: 12px; font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; align-self: flex-end; }

  /* TABLE PANEL */
  .table-panel { background: var(--s2); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
  .table-panel-head { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-bottom: 1px solid var(--border); }
  .table-panel-title { font-size: 13px; font-weight: 600; color: var(--t1); }
  .table-count { font-size: 11px; color: var(--t3); background: var(--s3); padding: 3px 9px; border-radius: 20px; border: 1px solid var(--border); }

  .hist-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .hist-table thead tr { border-bottom: 1px solid var(--border); }
  .hist-table th { padding: 10px 20px; text-align: left; font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--t3); background: var(--s1); white-space: nowrap; }
  .hist-table th.right { text-align: right; }
  .hist-table th.center { text-align: center; }
  .hist-table tbody tr { border-bottom: 1px solid rgba(255,255,255,0.04); transition: background 0.15s; }
  .hist-table tbody tr:hover { background: var(--s3); }
  .hist-table td { padding: 13px 20px; color: var(--t2); vertical-align: middle; }

  .td-time { font-size: 12px; color: var(--t3); white-space: nowrap; }
  .td-time strong { display: block; color: var(--t2); font-weight: 500; font-size: 13px; margin-bottom: 1px; }
  .td-invoice { font-size: 11px; color: var(--gold); font-weight: 500; letter-spacing: 0.03em; }
  .td-customer { color: var(--t1); font-weight: 500; }
  .td-type { color: var(--gold); font-weight: 500; font-size: 12px; }
  .td-amount { color: var(--t1); font-weight: 600; text-align: right; white-space: nowrap; font-size: 14px; }

  .pill-done { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; background: rgba(76,175,125,0.1); color: #4CAF7D; border: 1px solid rgba(76,175,125,0.2); }

  /* Print Button Style */
  .print-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: var(--s3);
    border: 1px solid var(--gold-line);
    border-radius: 6px;
    color: var(--gold);
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .print-btn:hover { background: var(--gold); color: #000; }

  /* Items popup */
  .items-toggle { display: inline-flex; align-items: center; gap: 4px; margin-top: 3px; font-size: 11px; color: var(--info); background: rgba(91,155,220,0.08); border: 1px solid rgba(91,155,220,0.15); border-radius: 4px; padding: 2px 7px; cursor: pointer; transition: background 0.15s; }
  .items-popup { position: fixed; z-index: 9999; background: var(--s3); border: 1px solid var(--gold-line); border-radius: 9px; padding: 12px 14px; min-width: 180px; box-shadow: 0 16px 40px rgba(0,0,0,0.5); animation: fadeUp 0.15s ease; }
  .items-popup-title { font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--t3); margin-bottom: 8px; border-bottom: 1px solid var(--border); padding-bottom: 7px; }
  .items-popup-row { display: flex; justify-content: space-between; font-size: 12px; color: var(--t2); padding: 4px 0; }

  .skel { background: linear-gradient(90deg, var(--s3) 25%, var(--s4) 50%, var(--s3) 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 4px; height: 13px; display: block; }
  @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

  .pagination { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; border-top: 1px solid var(--border); font-size: 12px; color: var(--t3); }
  .page-btns { display: flex; gap: 6px; }
  .page-btn { width: 30px; height: 30px; border-radius: 6px; border: 1px solid var(--border); background: var(--s3); color: var(--t2); cursor: pointer; transition: all 0.15s; display: flex; align-items: center; justify-content: center; }
  .page-btn.active { background: var(--gold); color: #111; font-weight: 700; border-color: var(--gold); }
`;

const PER_PAGE = 12;

const History = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [popup, setPopup] = useState(null);

  const formatRp = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

  const fetchHistory = async (sd, ed) => {
    try {
      setLoading(true);
      const [ordersData, transactionsData] = await Promise.all([
        orderService.getHistory(sd, ed),
        transactionService.getHistory(''),
      ]);
      
      const normalizedTransactions = (transactionsData || []).map(t => {
        let transactionType = 'Penjualan Produk';
        if (t.items?.length > 0) {
          const hasBundle = t.items.some(item => item.type === 'bundle');
          const hasProduct = t.items.some(item => item.type === 'product');
          if (hasBundle && !hasProduct) transactionType = 'Penjualan Paket';
          else if (hasBundle && hasProduct) transactionType = 'Produk & Paket';
        }
        return {
          id: t._id || t.id,
          invoiceNumber: t.invoiceNumber || t._id || t.id,
          customerName: t.customerName || 'Walk-in',
          cashierName: t.cashierName || '-',
          items: t.items || [],
          grandTotal: t.grandTotal || 0,
          payAmount: t.payAmount || 0,
          change: t.change || 0,
          createdAt: t.createdAt,
          type: 'transaction',
          typeLabel: transactionType,
        };
      });
      
      const normalizedOrders = (ordersData || []).map(o => ({
        ...o,
        type: 'order',
        typeLabel: 'Service',
        cashierName: '-',
      }));
      
      const combined = [...normalizedTransactions, ...normalizedOrders].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setOrders(combined);
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

  const handlePrint = (order) => {
    const printWindow = window.open('', '_blank', 'width=600,height=600');
    const itemsHtml = order.items.map(item => `
      <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
        <span>${item.name} x${item.quantity}</span>
        <span>${formatRp(item.subTotal || (item.price * item.quantity))}</span>
      </div>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Struk ${order.invoiceNumber}</title>
          <style>
            @page { size: 80mm auto; margin: 0; }
            body { font-family: 'Courier New', monospace; width: 70mm; padding: 5mm; color: #000; }
            .text-center { text-align: center; }
            .divider { border-top: 1px dashed #000; margin: 8px 0; }
            .bold { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="text-center bold" style="font-size: 16px;">URBAN MANE</div>
          <div class="text-center" style="font-size: 10px;">Modern Barbershop</div>
          <div class="divider"></div>
          <div style="font-size: 11px;">
            No: ${order.invoiceNumber}<br>
            Date: ${new Date(order.createdAt).toLocaleString('id-ID')}<br>
            Cashier: ${order.cashierName}
          </div>
          <div class="divider"></div>
          ${itemsHtml}
          <div class="divider"></div>
          <div style="display: flex; justify-content: space-between; font-weight: bold;">
            <span>TOTAL</span>
            <span>${formatRp(order.grandTotal)}</span>
          </div>
          <div class="divider"></div>
          <div class="text-center" style="font-size: 10px; margin-top: 10px;">Terima Kasih Atas Kunjungan Anda</div>
          <script>window.onload = () => { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
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
        <div className="hist-header anim a1">
          <div>
            <p className="hist-eyebrow">Laporan</p>
            <h1 className="hist-title">Riwayat Transaksi</h1>
            <p className="hist-subtitle">Daftar semua transaksi penjualan dan service</p>
          </div>
          {!loading && (
            <div className="summary-chips">
              <div className="summary-chip"><span className="chip-label">Transaksi</span><span className="chip-value">{orders.length}</span></div>
              <div className="summary-chip"><span className="chip-label">Pendapatan</span><span className="chip-value gold">{formatRp(totalSales)}</span></div>
            </div>
          )}
        </div>

        <div className="filter-bar anim a2">
          <div className="filter-group"><label className="filter-label">Dari</label><input type="date" className="filter-input" value={startDate} onChange={e => setStartDate(e.target.value)} /></div>
          <div className="filter-group"><label className="filter-label">Sampai</label><input type="date" className="filter-input" value={endDate} onChange={e => setEndDate(e.target.value)} /></div>
          <div className="filter-divider" />
          <button className="filter-btn" onClick={() => fetchHistory(startDate, endDate)} disabled={loading}>Terapkan</button>
          <button className="filter-reset" onClick={() => fetchHistory('', '')}>Reset</button>
        </div>

        <div className="table-panel anim a3">
          <div className="table-panel-head"><span className="table-panel-title">Daftar Transaksi</span></div>
          <div style={{ overflowX: 'auto' }}>
            <table className="hist-table">
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>Tipe</th>
                  <th>Invoice</th>
                  <th>Customer</th>
                  <th>Kasir</th>
                  <th>Item</th>
                  <th className="right">Total</th>
                  <th className="center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => <tr key={i}><td colSpan="8"><span className="skel" /></td></tr>)
                ) : paginated.map(order => {
                  const { date, time } = formatDate(order.createdAt);
                  return (
                    <tr key={order.id}>
                      <td className="td-time"><strong>{date}</strong>{time}</td>
                      <td className="td-type">{order.typeLabel}</td>
                      <td className="td-invoice">{order.invoiceNumber}</td>
                      <td className="td-customer">{order.customerName}</td>
                      <td>{order.cashierName}</td>
                      <td>
                        <button className="items-toggle" onClick={e => openPopup(e, order.items)}>Detail</button>
                      </td>
                      <td className="td-amount">{formatRp(order.grandTotal)}</td>
                      <td className="center">
                        <button className="print-btn" onClick={() => handlePrint(order)}>
                          <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" strokeWidth="2"/></svg>
                          Cetak
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <span>Halaman {page} dari {totalPages}</span>
              <div className="page-btns">
                <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
                <button className="page-btn active">{page}</button>
                <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
              </div>
            </div>
          )}
        </div>

        {popup && (
          <div className="items-popup" style={{ left: popup.x, top: popup.y }}>
            <p className="items-popup-title">Detail Item</p>
            {popup.items.map((item, i) => (
              <div key={i} className="items-popup-row">
                <span>{item.name}</span>
                <span style={{color: 'var(--t3)'}}>x{item.quantity}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default History;