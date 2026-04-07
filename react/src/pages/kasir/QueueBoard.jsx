import { useState, useEffect } from 'react';
import orderService from '../../services/orderService';
import userService from '../../services/userService';
import Modal from '../../components/shared/Modal';
import useReceipt from '../../hooks/useReceipt';

/* ─── Design Tokens ─────────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@300;400;500;600&display=swap');

  .qb-root {
    --gold: #C9A84C;
    --gold-dim: #A07830;
    --gold-glow: rgba(201,168,76,0.10);
    --surface-0: #111110;
    --surface-1: #1A1917;
    --surface-2: #222120;
    --surface-3: #2C2B29;
    --border: rgba(255,255,255,0.07);
    --border-gold: rgba(201,168,76,0.25);
    --text-1: #F0EDE6;
    --text-2: #9A9690;
    --text-3: #5C5A56;
    --danger: #E05252;
    --success: #4CAF7D;
    --info: #5B9BDC;
    --warning: #E0C060;
    --purple: #A07BC8;
    font-family: 'DM Sans', sans-serif;
    color: var(--text-1);
  }
  .qb-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .qb-root ::-webkit-scrollbar { width: 4px; }
  .qb-root ::-webkit-scrollbar-track { background: transparent; }
  .qb-root ::-webkit-scrollbar-thumb { background: var(--surface-3); border-radius: 2px; }

  /* ── PAGE HEADER ── */
  .qb-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
  }
  .qb-page-title {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    font-weight: 600;
    color: var(--text-1);
    letter-spacing: 0.01em;
    margin-bottom: 4px;
  }
  .qb-page-sub { font-size: 13px; color: var(--text-3); }

  .refresh-btn {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 8px 16px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text-2);
    font-size: 12px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.02em;
  }
  .refresh-btn:hover { background: var(--surface-3); color: var(--text-1); border-color: var(--border-gold); }

  /* ── BARBER STATUS BAR ── */
  .barber-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: var(--surface-1);
    border: 1px solid var(--border);
    border-radius: 10px;
    margin-bottom: 20px;
    overflow-x: auto;
    flex-wrap: wrap;
  }
  .barber-bar-label { font-size: 11px; color: var(--text-3); letter-spacing: 0.06em; text-transform: uppercase; white-space: nowrap; margin-right: 4px; }
  .barber-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    border: 1px solid transparent;
    white-space: nowrap;
  }
  .barber-chip.available { background: rgba(76,175,125,0.08); color: #4CAF7D; border-color: rgba(76,175,125,0.2); }
  .barber-chip.busy { background: rgba(224,82,82,0.08); color: #E05252; border-color: rgba(224,82,82,0.2); }
  .barber-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .barber-dot.available { background: #4CAF7D; }
  .barber-dot.busy { background: #E05252; }

  /* ── TABS ── */
  .tab-row {
    display: flex;
    gap: 0;
    border-bottom: 1px solid var(--border);
    margin-bottom: 24px;
  }
  .tab-item {
    padding: 10px 20px;
    font-size: 13px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    border: none;
    background: transparent;
    color: var(--text-3);
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
    letter-spacing: 0.02em;
    margin-bottom: -1px;
  }
  .tab-item:hover { color: var(--text-1); }
  .tab-item.active { color: var(--gold); border-bottom-color: var(--gold); }

  /* ── CARDS GRID ── */
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 14px;
  }

  /* ── ORDER CARD ── */
  .order-card {
    background: var(--surface-1);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    transition: border-color 0.25s, transform 0.2s;
    display: flex;
    flex-direction: column;
  }
  .order-card:hover { border-color: var(--border-gold); transform: translateY(-1px); }

  .order-card-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 16px 16px 12px;
    border-bottom: 1px solid var(--border);
  }
  .order-customer { font-size: 16px; font-weight: 600; color: var(--text-1); margin-bottom: 3px; }
  .order-invoice { font-size: 11px; color: var(--text-3); font-family: 'DM Mono', monospace; letter-spacing: 0.04em; }

  .status-badge {
    font-size: 10px;
    font-weight: 700;
    padding: 4px 9px;
    border-radius: 5px;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    border: 1px solid transparent;
    flex-shrink: 0;
  }
  .status-waiting { background: rgba(224,192,96,0.12); color: #E0C060; border-color: rgba(224,192,96,0.25); }
  .status-in_progress { background: rgba(91,155,220,0.12); color: #5B9BDC; border-color: rgba(91,155,220,0.25); }
  .status-waiting_payment { background: rgba(160,123,200,0.12); color: #A07BC8; border-color: rgba(160,123,200,0.25); }

  .order-card-body {
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
  }
  .order-meta-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
  }
  .meta-label { color: var(--text-3); }
  .meta-value { color: var(--text-1); font-weight: 500; display: flex; align-items: center; gap: 5px; }

  .live-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #5B9BDC;
    animation: pulse-blue 1.5s ease-in-out infinite;
    flex-shrink: 0;
  }
  @keyframes pulse-blue {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  .order-total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 10px;
    border-top: 1px solid var(--border);
    margin-top: 4px;
  }
  .order-total-label { font-size: 12px; color: var(--text-3); }
  .order-total-value { font-size: 18px; font-weight: 700; color: var(--gold); font-family: 'Playfair Display', serif; }

  .order-card-actions {
    display: flex;
    gap: 8px;
    padding: 12px 16px;
    border-top: 1px solid var(--border);
  }

  .action-btn {
    flex: 1;
    padding: 9px 10px;
    border-radius: 7px;
    border: 1px solid transparent;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .btn-start { background: rgba(91,155,220,0.12); color: #5B9BDC; border-color: rgba(91,155,220,0.25); }
  .btn-start:hover { background: #1D4E8A; color: #9DC5F0; }
  .btn-finish { background: rgba(76,175,125,0.12); color: #4CAF7D; border-color: rgba(76,175,125,0.25); }
  .btn-finish:hover { background: rgba(76,175,125,0.25); }
  .btn-cancel { background: rgba(224,82,82,0.06); color: var(--text-3); border-color: rgba(255,255,255,0.07); }
  .btn-cancel:hover { background: rgba(224,82,82,0.12); color: #E05252; border-color: rgba(224,82,82,0.25); }
  .btn-pay { flex: 1; background: var(--gold); color: #111; }
  .btn-pay:hover { background: #D4AE5A; }

  /* ── PAYMENT MODAL ── */
  .pay-modal-header {
    text-align: center;
    padding: 8px 0 20px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 16px;
  }
  .pay-customer-name { font-size: 13px; color: var(--text-3); margin-bottom: 6px; }
  .pay-grand-total {
    font-family: 'Playfair Display', serif;
    font-size: 30px;
    font-weight: 600;
    color: var(--text-1);
  }

  .pay-field-label { font-size: 11px; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px; }

  .pay-discount-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  .pay-discount-input-wrap { position: relative; width: 72px; }
  .pay-discount-input-wrap input {
    width: 100%;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 7px 20px 7px 8px;
    color: var(--text-1);
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    text-align: right;
    transition: border-color 0.2s;
  }
  .pay-discount-input-wrap input:focus { border-color: var(--border-gold); }
  .pay-discount-input-wrap span {
    position: absolute;
    right: 7px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-3);
    font-size: 11px;
    pointer-events: none;
  }

  .pay-total-display {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 12px 14px;
    margin-bottom: 14px;
  }
  .pay-total-display .label { font-size: 13px; color: var(--text-2); }
  .pay-total-display .value { font-size: 20px; font-weight: 700; color: var(--gold); font-family: 'Playfair Display', serif; }

  .pay-input-wrap { position: relative; margin-bottom: 12px; }
  .pay-input-wrap .prefix {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-3);
    font-size: 13px;
    pointer-events: none;
  }
  .pay-input-wrap input {
    width: 100%;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 12px 14px 12px 36px;
    color: var(--text-1);
    font-size: 18px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    text-align: right;
    transition: border-color 0.2s;
  }
  .pay-input-wrap input:focus { border-color: var(--gold); }
  .pay-input-wrap input::placeholder { color: var(--text-3); font-weight: 400; font-size: 14px; }

  .change-display {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 16px;
  }
  .change-display.ok { background: rgba(76,175,125,0.08); color: #4CAF7D; border: 1px solid rgba(76,175,125,0.2); }
  .change-display.short { background: rgba(224,82,82,0.08); color: #E05252; border: 1px solid rgba(224,82,82,0.2); }

  .pay-submit-btn {
    width: 100%;
    padding: 14px;
    border-radius: 9px;
    border: none;
    background: var(--gold);
    color: #111;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .pay-submit-btn:hover { background: #D4AE5A; }

  .empty-state {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    gap: 12px;
    color: var(--text-3);
  }
  .empty-state svg { opacity: 0.4; }
  .empty-state p { font-size: 13px; }
`;

const QueueBoard = () => {
  const [orders, setOrders] = useState([]);
  const [paymentList, setPaymentList] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('queue');
  const [payModal, setPayModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [payAmount, setPayAmount] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  // Receipt utilities
  const { receiptRef, exportToPDF } = useReceipt();

  const parseRupiah = (str) => parseInt(String(str).replace(/\D/g, ''), 10) || 0;
  const formatRupiahInput = (num) => (num || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const formatRp = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  const fetchData = async () => {
    try {
      const [queueData, paymentData, usersData] = await Promise.all([
        orderService.getQueue(),
        orderService.getWaitingPayment(),
        userService.getAllUsers(''),
      ]);
      setOrders(queueData || []);
      setPaymentList(paymentData || []);
      setBarbers((usersData || []).filter(u => u.role === 'barber'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsSpinning(true);
    fetchData().finally(() => setTimeout(() => setIsSpinning(false), 600));
  };

  const handleStart = async (id) => {
    if (confirm("Mulai kerjakan order ini?")) { await orderService.startOrder(id); fetchData(); }
  };
  const handleFinish = async (id) => {
    if (confirm("Selesaikan pekerjaan?")) { await orderService.finishOrder(id); alert("Order selesai."); fetchData(); }
  };
  const handleCancel = async (id) => {
    if (confirm("Batalkan order ini? Stok akan dikembalikan.")) { await orderService.cancelOrder(id); fetchData(); }
  };

  const openPayModal = (order) => {
    setSelectedOrder(order);
    setPayAmount(0);
    setDiscountPercent(0);
    setPayModal(true);
  };



  const handlePayment = async () => {
    if (!selectedOrder) return;
    const discAmt = Math.round(selectedOrder.grandTotal * (discountPercent / 100));
    const gt = selectedOrder.grandTotal - discAmt;
    if (payAmount < gt) return alert("Uang kurang!");
    try {
      await orderService.processPayment(selectedOrder.id, {
        payAmount: Number(payAmount), paymentMethod: "cash", discount: discAmt,
      });
      
      // Siapkan HTML receipt untuk PDF
      const barberName = selectedOrder.barberName || barbers.find(b => b._id === selectedOrder.barberId)?.name || 'Barber';
      const cashierName = localStorage.getItem('userName') || 'Kasir';
      const receiptHTML = `<div style="width: 80mm; margin: 0 auto; padding: 15px; font-family: 'Courier New', monospace; font-size: 12px; line-height: 1.5;">
        <div style="text-align: center; margin-bottom: 12px;">
          <div style="font-size: 32px; margin-bottom: 4px;">✂️</div>
          <h1 style="font-family: 'Playfair Display', serif; font-size: 18px; font-weight: bold; margin: 4px 0; letter-spacing: 1px;">URBAN MANE</h1>
          <p style="font-size: 10px; color: #666; margin: 2px 0 0 0;">Barbershop Professional</p>
          <div style="border-top: 2px dashed #999; margin: 10px 0;"></div>
        </div>
        <div style="margin: 8px 0; font-size: 12px;">
          <div style="display: flex; justify-content: space-between; margin: 4px 0;"><span style="font-weight: bold;">Invoice:</span><span>${selectedOrder.id}</span></div>
          <div style="display: flex; justify-content: space-between; margin: 4px 0;"><span style="font-weight: bold;">Tanggal:</span><span>${new Date().toLocaleString('id-ID')}</span></div>
        </div>
        <div style="border-top: 2px dashed #999; margin: 10px 0;"></div>
        <div style="margin: 8px 0; font-size: 12px;">
          <div style="display: flex; justify-content: space-between; margin: 4px 0;"><span style="font-weight: bold;">Customer:</span><span>${selectedOrder.customerName || 'Walk-in'}</span></div>
          <div style="display: flex; justify-content: space-between; margin: 4px 0;"><span style="font-weight: bold;">Barber:</span><span>${barberName}</span></div>
          <div style="display: flex; justify-content: space-between; margin: 4px 0;"><span style="font-weight: bold;">Kasir:</span><span>${cashierName}</span></div>
        </div>
        <div style="border-top: 2px dashed #999; margin: 10px 0;"></div>
        <div style="margin: 8px 0;">
          <div style="display: grid; grid-template-columns: 1fr 40px 50px; gap: 4px; margin-bottom: 4px; font-weight: bold; font-size: 11px; border-bottom: 1px solid #ccc; padding-bottom: 4px;">
            <span style="text-align: left;">Jenis</span><span style="text-align: center;">Qty</span><span style="text-align: right;">Harga</span>
          </div>
          ${selectedOrder.items.map(item => `<div style="display: grid; grid-template-columns: 1fr 40px 50px; gap: 4px; margin: 3px 0; font-size: 12px;"><span>${item.name || item.itemName || 'Item'} (${item.type || 'Layanan'})</span><span style="text-align: center;">x${item.quantity}</span><span style="text-align: right; font-weight: bold;">Rp ${(item.quantity * (item.price || item.unitPrice || 0)).toLocaleString('id-ID')}</span></div>`).join('')}
        </div>
        <div style="border-top: 2px dashed #999; margin: 10px 0;"></div>
        <div style="text-align: right; margin: 8px 0;">
          <div style="display: flex; justify-content: space-between; margin: 4px 0; font-size: 12px;"><span>Subtotal:</span><span>Rp ${(selectedOrder.grandTotal + discAmt).toLocaleString('id-ID')}</span></div>
          ${discAmt > 0 ? `<div style="display: flex; justify-content: space-between; margin: 4px 0; font-size: 12px; color: #E05252;"><span>Diskon:</span><span>-Rp ${discAmt.toLocaleString('id-ID')}</span></div>` : ''}
          <div style="border-top: 1px solid #ccc; margin: 6px 0;"></div>
          <div style="display: flex; justify-content: space-between; margin: 4px 0; font-size: 14px; font-weight: bold;"><span>TOTAL:</span><span>Rp ${gt.toLocaleString('id-ID')}</span></div>
        </div>
        <div style="border-top: 2px dashed #999; margin: 10px 0;"></div>
        <div style="margin: 8px 0; text-align: left; font-size: 12px;">
          <div style="display: flex; justify-content: space-between; margin: 4px 0;"><span style="font-weight: bold;">Metode:</span><span>Cash</span></div>
          <div style="display: flex; justify-content: space-between; margin: 4px 0;"><span style="font-weight: bold;">Dibayar:</span><span>Rp ${Number(payAmount).toLocaleString('id-ID')}</span></div>
          ${(Number(payAmount) - gt) > 0 ? `<div style="display: flex; justify-content: space-between; margin: 4px 0; color: #4CAF7D; font-weight: bold;"><span>Kembalian:</span><span>Rp ${(Number(payAmount) - gt).toLocaleString('id-ID')}</span></div>` : ''}
        </div>
        <div style="border-top: 2px dashed #999; margin: 10px 0;"></div>
        <div style="text-align: center; margin-top: 12px; font-size: 11px; color: #666;">
          <p style="margin: 3px 0;">Terima kasih atas kunjungan Anda!</p>
          <p style="margin: 3px 0;">Semoga puas dengan layanan kami</p>
        </div>
      </div>`;
      
      receiptRef.current.innerHTML = receiptHTML;
      
      // Auto-download PDF
      setTimeout(() => {
        exportToPDF(`struk-service-${Date.now()}.pdf`);
      }, 200);
      
      setPayModal(false);
      setSelectedOrder(null);
      setPayAmount(0);
      setDiscountPercent(0);
      
      alert("Pembayaran berhasil! PDF sedang di-download...");
      
      // Auto-reload halaman setelah 3 detik
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (err) {
      alert(err.response?.data?.error || "Gagal bayar");
    }
  };

  const statusConfig = {
    waiting: { cls: 'status-waiting', label: 'Menunggu' },
    in_progress: { cls: 'status-in_progress', label: 'Dikerjakan' },
    waiting_payment: { cls: 'status-waiting_payment', label: 'Tagihan' },
  };

  const renderCard = (order) => {
    const cfg = statusConfig[order.status] || { cls: '', label: order.status };
    const totalDuration = order.items.reduce((s, i) => s + (i.duration || 0), 0);
    const barber = barbers.find(b => b.name === order.barberName);

    return (
      <div key={order.id} className="order-card">
        <div className="order-card-head">
          <div>
            <p className="order-customer">{order.customerName || "Walk-in"}</p>
            <p className="order-invoice">#{order.invoiceNumber}</p>
          </div>
          <span className={`status-badge ${cfg.cls}`}>{cfg.label}</span>
        </div>

        <div className="order-card-body">
          <div className="order-meta-row">
            <span className="meta-label">Barber</span>
            <span className="meta-value">
              {order.barberName || "—"}
              {barber?.status === 'busy' && <span className="live-dot" title="Sedang mengerjakan" />}
            </span>
          </div>

          {order.status === 'in_progress' && totalDuration > 0 && (
            <div className="order-meta-row">
              <span className="meta-label">Estimasi</span>
              <span className="meta-value" style={{ color:"var(--info)" }}>{totalDuration} menit</span>
            </div>
          )}

          <div className="order-meta-row">
            <span className="meta-label">Item</span>
            <span className="meta-value">{order.items.length} item</span>
          </div>

          <div className="order-total-row">
            <span className="order-total-label">Total</span>
            <span className="order-total-value">{formatRp(order.grandTotal)}</span>
          </div>
        </div>

        <div className="order-card-actions">
          {order.status === 'waiting' && (
            <>
              <button className="action-btn btn-start" onClick={() => handleStart(order.id)}>Start</button>
              <button className="action-btn btn-cancel" onClick={() => handleCancel(order.id)}>Batal</button>
            </>
          )}
          {order.status === 'in_progress' && (
            <>
              <button className="action-btn btn-finish" onClick={() => handleFinish(order.id)}>Selesai</button>
              <button className="action-btn btn-cancel" onClick={() => handleCancel(order.id)}>Batal</button>
            </>
          )}
          {order.status === 'waiting_payment' && (
            <button className="action-btn btn-pay" onClick={() => openPayModal(order)}>Proses Bayar</button>
          )}
        </div>
      </div>
    );
  };

  /* Payment modal computed values */
  const discAmt = selectedOrder ? Math.round(selectedOrder.grandTotal * (discountPercent / 100)) : 0;
  const modalGT = selectedOrder ? selectedOrder.grandTotal - discAmt : 0;
  const modalChange = payAmount - modalGT;

  const displayList = activeView === 'queue' ? orders : paymentList;

  return (
    <>
      <style>{css}</style>
      <div className="qb-root">

        {/* ── HEADER ── */}
        <div className="qb-header">
          <div>
            <h1 className="qb-page-title">Kasir Board</h1>
            <p className="qb-page-sub">Kelola antrian & pembayaran secara real-time</p>
          </div>
          <button className="refresh-btn" onClick={handleRefresh}>
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              style={{ transform: isSpinning ? "rotate(360deg)" : "none", transition: isSpinning ? "transform 0.6s ease" : "none" }}>
              <path d="M23 4v6h-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M1 20v-6h6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Refresh
          </button>
        </div>

        {/* ── BARBER STATUS BAR ── */}
        {barbers.length > 0 && (
          <div className="barber-bar">
            <span className="barber-bar-label">Barber</span>
            {barbers.map(b => (
              <span key={b.id} className={`barber-chip ${b.status === 'busy' ? 'busy' : 'available'}`}>
                <span className={`barber-dot ${b.status === 'busy' ? 'busy' : 'available'}`} />
                {b.name}
              </span>
            ))}
          </div>
        )}

        {/* ── TABS ── */}
        <div className="tab-row">
          <button className={`tab-item ${activeView === 'queue' ? 'active' : ''}`} onClick={() => setActiveView('queue')}>
            Antrian Aktif ({orders.length})
          </button>
          <button className={`tab-item ${activeView === 'payment' ? 'active' : ''}`} onClick={() => setActiveView('payment')}>
            Menunggu Bayar ({paymentList.length})
          </button>
        </div>

        {/* ── CARDS ── */}
        {loading ? (
          <div style={{ textAlign:"center", color:"var(--text-3)", fontSize:13, paddingTop:60 }}>Memuat data...</div>
        ) : (
          <div className="cards-grid">
            {displayList.length === 0 ? (
              <div className="empty-state">
                <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" strokeWidth="1.5"/>
                  <rect x="9" y="3" width="6" height="4" rx="1" strokeWidth="1.5"/>
                </svg>
                <p>{activeView === 'queue' ? "Tidak ada antrian aktif" : "Tidak ada tagihan"}</p>
              </div>
            ) : displayList.map(renderCard)}
          </div>
        )}

        {/* ── PAYMENT MODAL ── */}
        <Modal isOpen={payModal} onClose={() => setPayModal(false)} title="Proses Pembayaran">
          {selectedOrder && (
            <div>
              <div className="pay-modal-header">
                <p className="pay-customer-name">{selectedOrder.customerName || "Walk-in"}</p>
                <p className="pay-grand-total">{formatRp(selectedOrder.grandTotal)}</p>
              </div>

              <div className="pay-discount-row">
                <div>
                  <p className="pay-field-label">Diskon</p>
                </div>
                <div className="pay-discount-input-wrap">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={discountPercent}
                    maxLength={3}
                    onChange={e => { let v=parseInt(e.target.value.replace(/\D/g,''))||0; if(v>100)v=100; setDiscountPercent(v); }}
                  />
                  <span>%</span>
                </div>
              </div>

              {discountPercent > 0 && (
                <p style={{ fontSize:12, color:"var(--danger)", marginBottom:10, textAlign:"right" }}>
                  Potongan −{formatRp(discAmt)}
                </p>
              )}

              <div className="pay-total-display">
                <span className="label">Total Bayar</span>
                <span className="value">{formatRp(modalGT)}</span>
              </div>

              <p className="pay-field-label">Uang Diterima</p>
              <div className="pay-input-wrap">
                <span className="prefix">Rp</span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Masukkan nominal..."
                  value={formatRupiahInput(payAmount)}
                  onChange={e => setPayAmount(parseRupiah(e.target.value))}
                />
              </div>

              {payAmount > 0 && (
                <div className={`change-display ${modalChange >= 0 ? "ok" : "short"}`}>
                  <span>Kembalian</span>
                  <span>{formatRp(modalChange)}</span>
                </div>
              )}

              <button className="pay-submit-btn" onClick={handlePayment}>
                Proses Bayar →
              </button>
            </div>
          )}
        </Modal>

        {/* ── Hidden receipt ref for PDF generation ── */}
        <div ref={receiptRef} style={{ display: 'none' }}></div>
      </div>
    </>
  );
};

export default QueueBoard;