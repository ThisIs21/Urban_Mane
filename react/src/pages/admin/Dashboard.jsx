import { useState, useEffect } from 'react';
import userService from '../../services/userService';
import productService from '../../services/productService';
import orderService from '../../services/orderService';
import { adminDashboardCss } from './AdminDashboardStyles';

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
    { href: '/admin/services', label: 'Kelola Layanan',  desc: 'Service & durasi',         cls: 'primary', iconPath: 'M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z' },
  ];

  const dateStr = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <>
      <style>{adminDashboardCss}</style>
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