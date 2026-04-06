import { useState, useEffect } from 'react';
import userService from '../../services/userService';
import productService from '../../services/productService';
import orderService from '../../services/orderService';

/* ─── Styles (Tetap sama persis seperti yang Anda kirim) ──────────────────── */
const css = `
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

  .adm-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 28px; }
  .adm-eyebrow { font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold); margin-bottom: 5px; }
  .adm-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 600; color: var(--t1); letter-spacing: 0.01em; }
  .adm-sub { font-size: 13px; color: var(--t3); margin-top: 4px; }
  .adm-date { font-size: 12px; color: var(--t2); text-align: right; }
  .adm-date strong { display: block; font-size: 13px; font-weight: 600; color: var(--t1); margin-bottom: 2px; }

  /* Stats */
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

  /* Lower grid */
  .lower-grid { display: grid; grid-template-columns: 1fr 300px; gap: 16px; align-items: start; }
  @media (max-width: 900px) { .lower-grid { grid-template-columns: 1fr; } }

  /* Panel */
  .panel { background: var(--s2); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
  .panel-head { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid var(--border); }
  .panel-title { font-size: 14px; font-weight: 600; color: var(--t1); }

  /* Activity list */
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

  /* Right column */
  .right-col { display: flex; flex-direction: column; gap: 14px; }

  /* Quick links */
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

  /* Info box */
  .info-box { background: #141312; border: 1px solid var(--gold-line); border-radius: 10px; padding: 16px; }
  .info-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); animation: pulse-g 2s ease-in-out infinite; flex-shrink: 0; }
  @keyframes pulse-g { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.3; transform:scale(0.7); } }
  .info-head { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
  .info-title { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--gold); }
  .info-text { font-size: 12px; color: var(--t3); line-height: 1.7; }

  .skel { background: linear-gradient(90deg, var(--s3) 25%, var(--s4) 50%, var(--s3) 75%); background-size: 200% 100%; animation: sh 1.4s infinite; border-radius: 4px; display: inline-block; }
  @keyframes sh { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

  .quick-links { display: flex; flex-direction: column; gap: 10px; padding: 14px; }
`;

const StatIcon = ({ path, cls }) => (
  <div className={`stat-icon ${cls}`}>
    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={path} />
    </svg>
  </div>
);

const ActIcon = ({ path, cls }) => (
  <div className={`act-icon ${cls}`}>
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={path} />
    </svg>
  </div>
);

const QLIcon = ({ path }) => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={path} />
  </svg>
);

// Helper untuk format Rupiah
const formatRp = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  
  // State untuk Stats
  const [statsData, setStatsData] = useState({
    users: { count: 0, sub: 'akun terdaftar' },
    products: { count: 0, sub: 'produk aktif', lowStock: 0 },
    revenue: { total: 0, sub: 'total pendapatan' },
    transactions: { count: 0, sub: 'transaksi selesai' }
  });

  // State untuk Activity (diambil dari Order History)
  const [activities, setActivities] = useState([]);

  // Fetch Data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        // 1. Fetch Users, Products, Orders History (Paralel)
        const [usersRes, productsRes, historyRes] = await Promise.all([
          userService.getAllUsers(''),
          productService.getAllProducts(''),
          orderService.getHistory('') // Ambil semua history
        ]);

        const users = usersRes || [];
        const products = productsRes || [];
        const history = historyRes || [];

        // 2. Calc Stats
        const totalRevenue = history.reduce((sum, o) => sum + o.grandTotal, 0);
        const lowStockCount = products.filter(p => p.stock < 5).length;

        setStatsData({
          users: { count: users.length, sub: `${users.filter(u => u.role === 'admin').length} admin` },
          products: { count: products.length, sub: `${lowStockCount} stok hampir habis`, lowStock: lowStockCount },
          revenue: { total: totalRevenue, sub: 'dari semua transaksi' },
          transactions: { count: history.length, sub: 'total selesai' }
        });

        // 3. Set Activities (3 transaksi terakhir)
        const recent = history.slice(0, 3).map(order => ({
          label: `Order ${order.invoiceNumber} selesai (${formatRp(order.grandTotal)})`,
          time: new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
          cls: 'gold',
          icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
        }));
        setActivities(recent);

      } catch (err) {
        console.error("Failed to fetch admin dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Mapping Stats untuk UI
  const stats = [
    { label: 'Total Pengguna', value: statsData.users.count, sub: statsData.users.sub, color: 'c-blue', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
    { label: 'Total Produk', value: statsData.products.count, sub: statsData.products.sub, color: 'c-green', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { label: 'Pendapatan', value: formatRp(statsData.revenue.total), sub: statsData.revenue.sub, color: 'c-gold', goldVal: true, icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Transaksi', value: statsData.transactions.count, sub: statsData.transactions.sub, color: 'c-purple', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  ];

  const quickLinks = [
    { href: '/admin/users',    label: 'Kelola Pengguna', desc: 'Tambah & edit akun',      cls: 'ghost', iconPath: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
    { href: '/admin/products', label: 'Kelola Produk',   desc: 'Stok & harga',            cls: 'ghost', iconPath: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { href: '/admin/services', label: 'Kelola Layanan',  desc: 'Service & durasi',         cls: 'ghost', iconPath: 'M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z' },
    { href: '/admin/reports',  label: 'Lihat Laporan',   desc: 'Data & statistik',         cls: 'primary', iconPath: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  ];

  const dateStr = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <>
      <style>{css}</style>
      <div className="adm-db">

        <div className="adm-header a1">
          <div>
            <p className="adm-eyebrow">Admin</p>
            <h1 className="adm-title">Dashboard</h1>
            <p className="adm-sub">Ringkasan aktivitas sistem Urban Mane</p>
          </div>
          <div className="adm-date">
            <strong>Hari ini</strong>
            {dateStr}
          </div>
        </div>

        <div className="stats-grid">
          {stats.map((s, i) => (
            <div key={i} className={`stat-card ${s.color} a${i + 2}`}>
              <div className="stat-top">
                <span className="stat-label">{s.label}</span>
                <StatIcon path={s.icon} cls={s.color} />
              </div>
              <p className={`stat-value ${s.goldVal ? 'gold' : ''}`}>
                {loading ? <span className="skel" style={{ width: 80, height: 26 }} /> : s.value}
              </p>
              <p className="stat-sub">{loading ? <span className="skel" style={{ width: 60, height: 11 }} /> : s.sub}</p>
            </div>
          ))}
        </div>

        <div className="lower-grid">
          {/* Activity */}
          <div className="panel a5">
            <div className="panel-head">
              <span className="panel-title">Aktivitas Terbaru</span>
            </div>
            <div className="activity-list">
              {loading ? (
                <>
                  <div className="activity-item"><div className="act-icon gold"><span className="skel" style={{width:16, height:16}} /></div><div className="act-info"><p className="act-label"><span className="skel" style={{width:120, height:13}} /></p><p className="act-time"><span className="skel" style={{width:60, height:11}} /></p></div></div>
                  <div className="activity-item"><div className="act-icon blue"><span className="skel" style={{width:16, height:16}} /></div><div className="act-info"><p className="act-label"><span className="skel" style={{width:100, height:13}} /></p><p className="act-time"><span className="skel" style={{width:50, height:11}} /></p></div></div>
                </>
              ) : (
                activities.map((act, i) => (
                  <div key={i} className="activity-item">
                    <ActIcon path={act.icon} cls={act.cls} />
                    <div className="act-info">
                      <p className="act-label">{act.label}</p>
                      <p className="act-time">{act.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right */}
          <div className="right-col a6">
            <div className="panel">
              <div className="panel-head">
                <span className="panel-title">Aksi Cepat</span>
              </div>
              <div className="quick-links">
                {quickLinks.map((ql, i) => (
                  <a key={i} href={ql.href} className={`ql-item ${ql.cls}`}>
                    <span className="ql-icon"><QLIcon path={ql.iconPath} /></span>
                    <span className="ql-text">
                      <span className="ql-label">{ql.label}</span>
                      <span className="ql-desc">{ql.desc}</span>
                    </span>
                    <span className="ql-arrow">›</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="info-box">
              <div className="info-head">
                <span className="info-dot" />
                <span className="info-title">Info Sistem</span>
              </div>
              <p className="info-text">
                Semua sistem berjalan normal. Cek stok produk secara berkala dan pastikan data barber selalu diperbarui.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;