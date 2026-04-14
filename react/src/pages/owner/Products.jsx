import { useState, useEffect, useCallback, useMemo } from 'react';
import productService from '../../services/productService';
import orderService from '../../services/orderService';

/* ─── Styles ──────────────────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@300;400;500;600&display=swap');

  .inv {
    --gold:      #C9A84C;
    --gold-l:    #E8C97A;
    --gold-dim:  rgba(201,168,76,0.12);
    --gold-line: rgba(201,168,76,0.22);
    --s1: #141312;
    --s2: #1B1A18;
    --s3: #232220;
    --s4: #2D2B28;
    --border:    rgba(255,255,255,0.07);
    --t1: #F0EDE6;
    --t2: #9A9690;
    --t3: #56534E;
    --success: #4CAF7D;
    --danger:  #E05252;
    --warning: #E0C060;
    --info:    #5B9BDC;
    font-family: 'DM Sans', sans-serif;
    color: var(--t1);
  }
  .inv * { box-sizing: border-box; margin: 0; padding: 0; }
  .inv ::-webkit-scrollbar { width: 4px; height: 4px; }
  .inv ::-webkit-scrollbar-thumb { background: var(--s4); border-radius: 2px; }

  @keyframes inv-up {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .ia1 { animation: inv-up 0.38s ease 0.04s both; }
  .ia2 { animation: inv-up 0.38s ease 0.09s both; }
  .ia3 { animation: inv-up 0.38s ease 0.14s both; }
  .ia4 { animation: inv-up 0.38s ease 0.19s both; }

  .inv-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; }
  .inv-eyebrow { font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold); margin-bottom: 5px; }
  .inv-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 600; color: var(--t1); letter-spacing: 0.01em; }
  .inv-sub { font-size: 13px; color: var(--t3); margin-top: 4px; display: flex; align-items: center; gap: 6px; }
  .inv-sync-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--success); animation: pulse-s 2s ease-in-out infinite; }
  @keyframes pulse-s { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.7)} }

  .inv-refresh-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 8px 14px;
    background: var(--s2); border: 1px solid var(--border); border-radius: 8px;
    color: var(--t2); font-size: 12px; font-weight: 500;
    cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.18s;
  }
  .inv-refresh-btn:hover { background: var(--s3); color: var(--t1); border-color: var(--gold-line); }
  .inv-refresh-btn svg { transition: transform 0.5s; }
  .inv-refresh-btn.spinning svg { transform: rotate(360deg); }

  .inv-summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
  @media (max-width: 900px) { .inv-summary-grid { grid-template-columns: repeat(2, 1fr); } }

  .inv-sum-card {
    background: var(--s2); border: 1px solid var(--border); border-radius: 12px;
    padding: 16px 18px; position: relative; overflow: hidden;
    transition: border-color 0.22s, transform 0.2s;
  }
  .inv-sum-card:hover { border-color: var(--gold-line); transform: translateY(-1px); }
  .inv-sum-card::before { content:''; position:absolute; top:0; left:16px; right:16px; height:1px; }
  .inv-sum-card.c-gold::before   { background: var(--gold); }
  .inv-sum-card.c-red::before    { background: var(--danger); }
  .inv-sum-card.c-amber::before  { background: var(--warning); }
  .inv-sum-card.c-green::before  { background: var(--success); }

  .inv-sum-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .inv-sum-label { font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--t3); }
  .inv-sum-icon { width: 26px; height: 26px; border-radius: 6px; display: flex; align-items: center; justify-content: center; }
  .inv-sum-icon.c-gold   { background: var(--gold-dim); color: var(--gold); }
  .inv-sum-icon.c-red    { background: rgba(224,82,82,0.12); color: var(--danger); }
  .inv-sum-icon.c-amber  { background: rgba(224,192,96,0.12); color: var(--warning); }
  .inv-sum-icon.c-green  { background: rgba(76,175,125,0.12); color: var(--success); }

  .inv-sum-val { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 600; color: var(--t1); line-height: 1; margin-bottom: 3px; }
  .inv-sum-val.gold { color: var(--gold); }
  .inv-sum-sub { font-size: 11px; color: var(--t3); }

  .inv-alert {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 12px 16px;
    background: rgba(224,82,82,0.06);
    border: 1px solid rgba(224,82,82,0.2);
    border-radius: 10px;
    margin-bottom: 16px;
  }
  .inv-alert-icon { flex-shrink: 0; color: var(--danger); margin-top: 1px; }
  .inv-alert-title { font-size: 12px; font-weight: 600; color: var(--danger); margin-bottom: 5px; }
  .inv-alert-chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .inv-alert-chip {
    display: flex; align-items: center; gap: 5px;
    padding: 3px 10px; border-radius: 20px;
    background: rgba(224,82,82,0.1); color: var(--danger);
    border: 1px solid rgba(224,82,82,0.2);
    font-size: 11px; font-weight: 500;
  }
  .inv-alert-chip.amber { background: rgba(224,192,96,0.1); color: var(--warning); border-color: rgba(224,192,96,0.2); }

  .inv-controls { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; }
  .inv-tabs { display: flex; background: var(--s2); border: 1px solid var(--border); border-radius: 9px; padding: 4px; gap: 2px; }
  .inv-tab {
    padding: 7px 16px; border-radius: 6px; border: none; cursor: pointer;
    font-size: 12px; font-weight: 600; letter-spacing: 0.03em;
    font-family: 'DM Sans', sans-serif; transition: all 0.18s;
  }
  .inv-tab.active { background: var(--gold); color: #111; }
  .inv-tab:not(.active) { background: transparent; color: var(--t3); }
  .inv-tab:not(.active):hover { background: var(--s3); color: var(--t2); }

  .inv-periods { display: flex; background: var(--s2); border: 1px solid var(--border); border-radius: 9px; padding: 3px; gap: 2px; }
  .inv-period {
    padding: 6px 12px; border-radius: 6px; border: none; cursor: pointer;
    font-size: 11px; font-weight: 600; letter-spacing: 0.02em;
    font-family: 'DM Sans', sans-serif; transition: all 0.18s;
    white-space: nowrap;
  }
  .inv-period.active { background: var(--s4); color: var(--t1); border: 1px solid var(--gold-line); }
  .inv-period:not(.active) { background: transparent; color: var(--t3); border: 1px solid transparent; }
  .inv-period:not(.active):hover { background: var(--s3); color: var(--t2); }

  .inv-search-wrap { position: relative; }
  .inv-search-wrap svg { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: var(--t3); pointer-events: none; }
  .inv-search {
    padding: 8px 12px 8px 34px;
    background: var(--s2); border: 1px solid var(--border); border-radius: 8px;
    color: var(--t1); font-size: 13px; font-family: 'DM Sans', sans-serif;
    outline: none; transition: border-color 0.18s; width: 200px;
  }
  .inv-search:focus { border-color: var(--gold-line); }
  .inv-search::placeholder { color: var(--t3); }

  .inv-panel { background: var(--s2); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
  .inv-panel-head { display: flex; justify-content: space-between; align-items: center; padding: 14px 20px; border-bottom: 1px solid var(--border); }
  .inv-panel-title { font-size: 13px; font-weight: 600; color: var(--t1); }
  .inv-count { font-size: 11px; color: var(--t3); background: var(--s3); padding: 3px 9px; border-radius: 20px; border: 1px solid var(--border); }

  .inv-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .inv-table thead tr { border-bottom: 1px solid var(--border); }
  .inv-table th {
    padding: 10px 16px; text-align: left;
    font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--t3); background: var(--s1); white-space: nowrap;
  }
  .inv-table th.center { text-align: center; }
  .inv-table th.right  { text-align: right; }
  .inv-table tbody tr { border-bottom: 1px solid rgba(255,255,255,0.04); transition: background 0.15s; }
  .inv-table tbody tr:last-child { border-bottom: none; }
  .inv-table tbody tr:hover { background: var(--s3); }
  .inv-table td { padding: 13px 16px; color: var(--t2); vertical-align: middle; }

  .td-item { }
  .td-item strong { display: block; font-size: 13px; font-weight: 500; color: var(--t1); margin-bottom: 2px; }
  .td-item span { font-size: 11px; color: var(--t3); }

  .td-center { text-align: center; }
  .td-right  { text-align: right; }
  .td-gold   { color: var(--gold); font-weight: 600; text-align: right; font-size: 14px; }
  .td-date   { font-size: 12px; color: var(--t3); text-align: right; }

  .inv-stock {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 20px;
    font-size: 10px; font-weight: 700; letter-spacing: 0.05em;
    text-transform: uppercase; border: 1px solid transparent;
  }
  .inv-stock.ok    { background: rgba(76,175,125,0.1); color: #4CAF7D; border-color: rgba(76,175,125,0.2); }
  .inv-stock.amber { background: rgba(224,192,96,0.1); color: #E0C060; border-color: rgba(224,192,96,0.2); }
  .inv-stock.red   { background: rgba(224,82,82,0.1); color: #E05252; border-color: rgba(224,82,82,0.2); }
  .inv-stock-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
  .inv-stock.ok .inv-stock-dot    { background: #4CAF7D; }
  .inv-stock.amber .inv-stock-dot { background: #E0C060; }
  .inv-stock.red .inv-stock-dot   { background: #E05252; }

  .inv-sold-badge {
    display: inline-block; padding: 3px 10px; border-radius: 20px;
    font-size: 11px; font-weight: 600; background: var(--gold-dim);
    color: var(--gold); border: 1px solid var(--gold-line);
  }
  .inv-sold-badge.zero { background: transparent; color: var(--t3); border-color: var(--border); }

  .inv-progress-wrap { margin-top: 5px; }
  .inv-progress-bg { height: 3px; background: var(--s4); border-radius: 2px; overflow: hidden; width: 80px; }
  .inv-progress-fill { height: 100%; border-radius: 2px; transition: width 0.4s ease; }
  .inv-progress-fill.ok    { background: #4CAF7D; }
  .inv-progress-fill.amber { background: #E0C060; }
  .inv-progress-fill.red   { background: #E05252; }

  .inv-type-tag {
    display: inline-block; padding: 2px 8px; border-radius: 4px;
    font-size: 10px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;
  }
  .inv-type-tag.service { background: rgba(91,155,220,0.1); color: var(--info); }
  .inv-type-tag.bundle  { background: rgba(160,123,200,0.1); color: #A07BC8; }

  .inv-empty { padding: 60px 20px; text-align: center; color: var(--t3); font-size: 13px; }
  .inv-empty svg { display: block; margin: 0 auto 12px; opacity: 0.3; }

  .skel { background: linear-gradient(90deg, var(--s3) 25%, var(--s4) 50%, var(--s3) 75%); background-size: 200% 100%; animation: sh 1.4s infinite; border-radius: 4px; display: block; }
  @keyframes sh { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

  .inv-rank { width: 22px; height: 22px; border-radius: 6px; background: var(--s3); border: 1px solid var(--border); font-size: 11px; font-weight: 600; color: var(--t3); display: flex; align-items: center; justify-content: center; }
  .inv-rank.top { background: var(--gold-dim); border-color: var(--gold-line); color: var(--gold); }
`;

const Ico = ({ d, size = 14 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={d} />
  </svg>
);

const PERIODS = [
  { key: 'all',   label: 'Semua Waktu' },
  { key: 'today', label: 'Hari Ini' },
  { key: 'month', label: 'Bulan Ini' },
  { key: 'year',  label: 'Tahun Ini' },
];

/* ── Normalize MongoDB ObjectID to plain hex string ── */
const normId = (id) => {
  if (!id) return '';
  if (typeof id === 'string') return id;
  if (id.$oid) return id.$oid;
  if (id.oid) return id.oid;
  if (id.toHexString) return id.toHexString();
  return String(id);
};

const OwnerProducts = () => {
  const [products, setProducts]     = useState([]);
  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [activeTab, setActiveTab]   = useState('products');
  const [spinning, setSpinning]     = useState(false);
  const [period, setPeriod]         = useState('all');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [prodData, orderData] = await Promise.all([
        productService.getAllProducts(''),
        orderService.getHistory('2020-01-01', '2099-12-31'),
      ]);
      setProducts(prodData || []);
      setOrders(orderData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleRefresh = () => {
    setSpinning(true);
    fetchData().finally(() => setTimeout(() => setSpinning(false), 500));
  };

  /* Safe date parser */
  const getOrderDate = (o) => new Date(o.createdAt || o.created_at || o.CreatedAt);

  /* Client-side period filter */
  const filteredOrders = useMemo(() => {
    if (period === 'all') return orders;
    const now = new Date();
    let start, end;
    switch (period) {
      case 'today':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        end   = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        break;
      case 'month':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end   = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        break;
      case 'year':
        start = new Date(now.getFullYear(), 0, 1);
        end   = new Date(now.getFullYear() + 1, 0, 1);
        break;
      default:
        return orders;
    }
    return orders.filter(o => {
      const d = getOrderDate(o);
      return d >= start && d < end;
    });
  }, [orders, period]);

  /* ── Build lookup maps for O(1) matching ── */
  const productMetricsMap = useMemo(() => {
    const map = {};

    filteredOrders.forEach(o => {
      const oDate = getOrderDate(o);
      (o.items || []).forEach(item => {
        if (item.type !== 'product') return;

        const rawId = normId(item.item_id || item.ItemID || item.product_id || '');
        if (!rawId) return;

        if (!map[rawId]) {
          map[rawId] = { sold: 0, revenue: 0, lastDate: null };
        }
        const m = map[rawId];
        m.sold    += (item.quantity || 0);
        m.revenue += (item.price || 0) * (item.quantity || 0);
        if (!m.lastDate || oDate > m.lastDate) {
          m.lastDate = oDate;
        }
      });
    });

    /* format lastDate strings */
    Object.keys(map).forEach(k => {
      const m = map[k];
      if (m.lastDate) {
        m.lastDate = m.lastDate.toLocaleDateString('id-ID', {
          day: '2-digit', month: 'short', year: 'numeric',
        });
      } else {
        m.lastDate = '—';
      }
    });

    return map;
  }, [filteredOrders]);

  /* Fallback: name-based lookup (used if ID match fails) */
  const productNameMetricsMap = useMemo(() => {
    const map = {};
    filteredOrders.forEach(o => {
      const oDate = getOrderDate(o);
      (o.items || []).forEach(item => {
        if (item.type !== 'product' || !item.name) return;
        if (!map[item.name]) {
          map[item.name] = { sold: 0, revenue: 0, lastDate: null };
        }
        const m = map[item.name];
        m.sold    += (item.quantity || 0);
        m.revenue += (item.price || 0) * (item.quantity || 0);
        if (!m.lastDate || oDate > m.lastDate) {
          m.lastDate = oDate;
        }
      });
    });
    Object.keys(map).forEach(k => {
      const m = map[k];
      if (m.lastDate) {
        m.lastDate = m.lastDate.toLocaleDateString('id-ID', {
          day: '2-digit', month: 'short', year: 'numeric',
        });
      } else {
        m.lastDate = '—';
      }
    });
    return map;
  }, [filteredOrders]);

  /* ── getMetrics for services/bundles (name-based) ── */
  const getMetricsByName = useCallback((name) => {
    /* build on-the-fly from filteredOrders (small list, fine) */
    let sold = 0, revenue = 0, lastDate = null;
    filteredOrders.forEach(o => {
      const oDate = getOrderDate(o);
      (o.items || []).forEach(item => {
        if (item.name !== name) return;
        sold    += (item.quantity || 0);
        revenue += (item.price || 0) * (item.quantity || 0);
        if (!lastDate || oDate > lastDate) lastDate = oDate;
      });
    });
    return {
      sold,
      revenue,
      lastDate: lastDate
        ? lastDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
        : '—',
    };
  }, [filteredOrders]);

  /* ── Unique services / bundles (from ALL orders) ── */
  const services = useMemo(() => {
    const out = [];
    orders.flatMap(o => o.items || []).forEach(item => {
      if (item.type === 'service' && !out.find(s => s.name === item.name)) {
        out.push({ name: item.name, price: item.price });
      }
    });
    return out;
  }, [orders]);

  const bundles = useMemo(() => {
    const out = [];
    orders.flatMap(o => o.items || []).forEach(item => {
      if (item.type === 'bundle' && !out.find(b => b.name === item.name)) {
        out.push({ name: item.name, price: item.price });
      }
    });
    return out;
  }, [orders]);

  const formatRp = (n) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

  const getStockInfo = (stock) => {
    if (stock <= 0) return { text: 'Habis', cls: 'red', pct: 0 };
    if (stock < 5)  return { text: 'Kritis', cls: 'amber', pct: Math.min((stock / 5) * 60, 60) };
    return { text: 'Aman', cls: 'ok', pct: Math.min((stock / 30) * 100, 100) };
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  const filteredServices = services.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
  const filteredBundles  = bundles.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

  const totalProducts  = products.length;
  const lowStockItems  = products.filter(p => p.stock > 0 && p.stock < 5);
  const outOfStock     = products.filter(p => p.stock <= 0);
  const totalRevenue   = useMemo(() => filteredOrders.reduce((s, o) => s + (o.grand_total || o.grandTotal || o.totalPrice || 0), 0), [filteredOrders]);
  const filteredOrderCount = filteredOrders.length;

  const syncTime   = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  const monthLabel = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  const periodLabel = period === 'all' ? 'Semua Waktu' : period === 'today' ? 'Hari Ini' : period === 'month' ? monthLabel : String(new Date().getFullYear());
  const revenueCardLabel = period === 'all' ? 'Revenue Total' : period === 'today' ? 'Revenue Hari Ini' : period === 'month' ? 'Revenue Bulan Ini' : 'Revenue Tahun Ini';

  const TABS = [
    { key: 'products', label: 'Produk' },
    { key: 'services', label: 'Layanan' },
    { key: 'bundles',  label: 'Paket' },
  ];

  const currentItems = activeTab === 'products' ? filteredProducts : activeTab === 'services' ? filteredServices : filteredBundles;

  /* Helper: resolve product metrics with ID-first, name-fallback */
  const resolveProductMetrics = (p) => {
    const pid = normId(p._id || p.id);
    /* Try ID match first */
    if (pid && productMetricsMap[pid]) return productMetricsMap[pid];
    /* Fallback: match by product name */
    if (p.name && productNameMetricsMap[p.name]) return productNameMetricsMap[p.name];
    /* Nothing found */
    return { sold: 0, revenue: 0, lastDate: '—' };
  };

  return (
    <>
      <style>{css}</style>
      <div className="inv">

        <div className="inv-header ia1">
          <div>
            <p className="inv-eyebrow">Inventaris &amp; Performa</p>
            <h1 className="inv-title">Overview Sistem</h1>
            <div className="inv-sub">
              <span className="inv-sync-dot" />
              Sinkronisasi {syncTime} · Periode {periodLabel}
            </div>
          </div>
          <button className={`inv-refresh-btn${spinning ? ' spinning' : ''}`} onClick={handleRefresh}>
            <Ico d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            Refresh
          </button>
        </div>

        <div className="inv-summary-grid ia2">
          {[
            { label: 'Total Produk', val: totalProducts, sub: 'SKU terdaftar', cls: 'c-gold', goldVal: true, icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
            { label: 'Stok Kritis', val: lowStockItems.length, sub: 'di bawah 5 unit', cls: 'c-amber', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
            { label: 'Habis Stok', val: outOfStock.length, sub: 'perlu restock segera', cls: 'c-red', icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636' },
            { label: revenueCardLabel, val: formatRp(totalRevenue), sub: `dari ${filteredOrderCount} transaksi`, cls: 'c-green', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
          ].map((s, i) => (
            <div key={i} className={`inv-sum-card ${s.cls}`}>
              <div className="inv-sum-top">
                <span className="inv-sum-label">{s.label}</span>
                <span className={`inv-sum-icon ${s.cls}`}><Ico d={s.icon} size={14} /></span>
              </div>
              <p className={`inv-sum-val${s.goldVal ? ' gold' : ''}`}>
                {loading ? <span className="skel" style={{ width: 70, height: 22, display: 'inline-block' }} /> : s.val}
              </p>
              <p className="inv-sum-sub">{s.sub}</p>
            </div>
          ))}
        </div>

        {!loading && (lowStockItems.length > 0 || outOfStock.length > 0) && (
          <div className="inv-alert ia3">
            <span className="inv-alert-icon">
              <Ico d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" size={16} />
            </span>
            <div>
              <p className="inv-alert-title">Perhatian — Stok perlu ditangani</p>
              <div className="inv-alert-chips">
                {outOfStock.map(p => (
                  <span key={p._id || p.id} className="inv-alert-chip">
                    <Ico d="M6 18L18 6M6 6l12 12" size={10} /> {p.name} — HABIS
                  </span>
                ))}
                {lowStockItems.map(p => (
                  <span key={p._id || p.id} className="inv-alert-chip amber">
                    {p.name} — {p.stock} unit
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="inv-controls ia3">
          <div className="inv-tabs">
            {TABS.map(t => (
              <button key={t.key} className={`inv-tab${activeTab === t.key ? ' active' : ''}`} onClick={() => setActiveTab(t.key)}>
                {t.label}
              </button>
            ))}
          </div>
          <div className="inv-periods">
            {PERIODS.map(p => (
              <button key={p.key} className={`inv-period${period === p.key ? ' active' : ''}`} onClick={() => setPeriod(p.key)}>
                {p.label}
              </button>
            ))}
          </div>
          <div className="inv-search-wrap">
            <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input className="inv-search" type="text" placeholder={`Cari ${activeTab}...`} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="inv-panel ia4">
          <div className="inv-panel-head">
            <span className="inv-panel-title">
              Performa {activeTab === 'products' ? 'Produk' : activeTab === 'services' ? 'Layanan' : 'Paket'} — {periodLabel}
            </span>
            {!loading && <span className="inv-count">{currentItems.length} item</span>}
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="inv-table">
              <thead>
                <tr>
                  <th style={{ width: 36 }}>#</th>
                  <th>Nama Item</th>
                  {activeTab === 'products' && <th>Status Stok</th>}
                  {activeTab !== 'products' && <th>Tipe</th>}
                  <th className="center">Terjual</th>
                  <th className="right">Revenue</th>
                  <th className="right">Transaksi Terakhir</th>
                </tr>
              </thead>
              <tbody>
                {loading ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>{[22, 160, 90, 60, 80, 80].map((w, j) => (
                    <td key={j}><span className="skel" style={{ width: w, height: 13 }} /></td>
                  ))}</tr>
                )) : currentItems.length === 0 ? (
                  <tr><td colSpan="6">
                    <div className="inv-empty">
                      <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      Tidak ada data untuk ditampilkan.
                    </div>
                  </td></tr>
                ) : activeTab === 'products' ? (
                  filteredProducts.map((p, i) => {
                    const { sold, revenue, lastDate } = resolveProductMetrics(p);
                    const stockInfo = getStockInfo(p.stock);
                    return (
                      <tr key={p._id || p.id}>
                        <td><div className={`inv-rank${i < 3 ? ' top' : ''}`}>{i + 1}</div></td>
                        <td className="td-item">
                          <strong>{p.name}</strong>
                          <span>{p.category || '—'}</span>
                        </td>
                        <td>
                          <span className={`inv-stock ${stockInfo.cls}`}>
                            <span className="inv-stock-dot" />
                            {p.stock} unit · {stockInfo.text}
                          </span>
                          <div className="inv-progress-wrap">
                            <div className="inv-progress-bg">
                              <div className={`inv-progress-fill ${stockInfo.cls}`} style={{ width: `${stockInfo.pct}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="td-center">
                          <span className={`inv-sold-badge${sold === 0 ? ' zero' : ''}`}>{sold}</span>
                        </td>
                        <td className="td-gold">{formatRp(revenue)}</td>
                        <td className="td-date">{lastDate}</td>
                      </tr>
                    );
                  })
                ) : activeTab === 'services' ? (
                  filteredServices.map((s, i) => {
                    const { sold, revenue, lastDate } = getMetricsByName(s.name);
                    return (
                      <tr key={i}>
                        <td><div className={`inv-rank${i < 3 ? ' top' : ''}`}>{i + 1}</div></td>
                        <td className="td-item"><strong>{s.name}</strong><span>{formatRp(s.price)}</span></td>
                        <td><span className="inv-type-tag service">Layanan</span></td>
                        <td className="td-center"><span className={`inv-sold-badge${sold === 0 ? ' zero' : ''}`}>{sold}</span></td>
                        <td className="td-gold">{formatRp(revenue)}</td>
                        <td className="td-date">{lastDate}</td>
                      </tr>
                    );
                  })
                ) : (
                  filteredBundles.map((b, i) => {
                    const { sold, revenue, lastDate } = getMetricsByName(b.name);
                    return (
                      <tr key={i}>
                        <td><div className={`inv-rank${i < 3 ? ' top' : ''}`}>{i + 1}</div></td>
                        <td className="td-item"><strong>{b.name}</strong><span>{formatRp(b.price)}</span></td>
                        <td><span className="inv-type-tag bundle">Paket</span></td>
                        <td className="td-center"><span className={`inv-sold-badge${sold === 0 ? ' zero' : ''}`}>{sold}</span></td>
                        <td className="td-gold">{formatRp(revenue)}</td>
                        <td className="td-date">{lastDate}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default OwnerProducts;