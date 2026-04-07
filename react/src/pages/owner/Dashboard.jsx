import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import orderService from '../../services/orderService';
import { ownerTableCss } from './OwnerStyles';

// Registrasi Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title);

const OwnerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await orderService.getOwnerDashboard();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatRp = (num) => {
    if (!num) return "Rp 0";
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };

  // --- CHART DATA PREPARATION ---

  // 1. Weekly Line Chart Data
  const weeklyChartData = {
    labels: data.weekly_data?.map(d => d._id) || [], // Dates
    datasets: [
      {
        label: 'Pendapatan Harian',
        data: data.weekly_data?.map(d => d.total) || [],
        borderColor: '#C9A84C', // Gold
        backgroundColor: 'rgba(201, 168, 76, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // 2. Pie Chart Data (Sales Distribution)
  const pieChartData = {
    labels: data.sales_distribution?.map(d => d._id?.toUpperCase()) || ['No Data'],
    datasets: [
      {
        data: data.sales_distribution?.map(d => d.total) || [1],
        backgroundColor: [
          'rgba(201, 168, 76, 0.8)', // Gold for Products
          'rgba(91, 155, 220, 0.8)', // Blue for Services
          'rgba(160, 123, 200, 0.8)', // Purple
        ],
        borderColor: [
          'rgba(201, 168, 76, 1)',
          'rgba(91, 155, 220, 1)',
          'rgba(160, 123, 200, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#F0EDE6', font: { size: 11 } } }
    },
    scales: {
      y: { ticks: { color: '#9A9690' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      x: { ticks: { color: '#9A9690' }, grid: { display: false } }
    }
  };

  return (
    <>
      <style>{ownerTableCss}</style>
      <div className="owner-page">
        {/* Header */}
        <div className="own-pg-header own-a1" style={{ marginBottom: '28px' }}>
          <div>
            <p className="own-pg-eyebrow">Selamat Datang</p>
            <h1 className="own-pg-title">Dashboard Owner</h1>
            <p className="own-pg-sub">Ringkasan bisnis & analitik kinerja toko</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '10px', color: 'var(--t3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Hari Ini</p>
            <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--t2)', marginTop: '4px' }}>
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px', marginBottom: '28px' }} className="own-a2">
          <div className="stat-card gold">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <span className="stat-label">Pendapatan Bulan Ini</span>
              <span style={{ fontSize: '20px' }}>💰</span>
            </div>
            <p className="stat-value" style={{ color: 'var(--gold)' }}>{loading ? "..." : formatRp(data.monthly_revenue)}</p>
          </div>

          <div className="stat-card blue">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <span className="stat-label">Total Transaksi</span>
              <span style={{ fontSize: '20px' }}>🧾</span>
            </div>
            <p className="stat-value">{loading ? "..." : data.total_transactions}</p>
          </div>

          <div className="stat-card amber">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <span className="stat-label">Produk Aktif</span>
              <span style={{ fontSize: '20px' }}>📦</span>
            </div>
            <p className="stat-value">{loading ? "..." : data.active_products}</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '28px', alignItems: 'start' }} className="own-a3">
          {/* Weekly Revenue Chart */}
          <div className="own-chart-container">
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--t1)', marginBottom: '16px' }}>Pendapatan Mingguan</h4>
            {loading ? <div style={{ height: '100%', background: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}></div> : (
              <Line data={weeklyChartData} options={chartOptions} />
            )}
          </div>

          {/* Sales Distribution Chart */}
          <div className="own-chart-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--t1)', marginBottom: '16px' }}>Distribusi Penjualan</h4>
            {loading ? <div style={{ height: '100%', background: 'rgba(255,255,255,0.04)', borderRadius: '8px' }}></div> : (
              <Pie data={pieChartData} options={{ ...chartOptions, maintainAspectRatio: true }} />
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="own-table-panel own-a4">
          <div className="own-table-head">
            <span className="own-table-head-title">Transaksi Terakhir</span>
            <Link to="/owner/reports" style={{ fontSize: '11px', color: 'var(--gold)', textDecoration: 'none', letterSpacing: '0.04em', fontWeight: 500, transition: 'color 0.15s' }} onMouseEnter={(e) => e.target.style.color = 'var(--gold-light)'} onMouseLeave={(e) => e.target.style.color = 'var(--gold)'}>
              Lihat Semua →
            </Link>
          </div>
          <table className="own-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Customer</th>
                <th>Items</th>
                <th className="right">Total</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="own-loading">Loading...</td></tr>
              ) : data.recent_orders?.length === 0 ? (
                <tr><td colSpan="4" className="own-empty">Belum ada transaksi</td></tr>
              ) : (
                data.recent_orders?.map((order) => (
                  <tr key={order.id}>
                    <td style={{ color: 'var(--gold)', fontWeight: 500, fontSize: '12px', fontFamily: 'monospace' }}>{order.invoice_number}</td>
                    <td style={{ color: 'var(--t1)', fontWeight: 500 }}>{order.customer_name || "Walk-in"}</td>
                    <td>{order.items?.length || 0} item</td>
                    <td className="right" style={{ color: 'var(--t1)', fontWeight: 600 }}>{formatRp(order.grand_total)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default OwnerDashboard;