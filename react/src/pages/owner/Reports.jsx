import { useState, useEffect } from 'react';
import orderService from '../../services/orderService';
import { ownerTableCss, reportCss } from './OwnerStyles';

const Reports = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [transactionType, setTransactionType] = useState('all');

  // Initialize dates to current month
  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
    setStartDate(firstDay);
    setEndDate(lastDay);
  }, []);

  // Fetch report when dates change
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await orderService.getHistory(startDate, endDate);
        setOrders(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate]);

  // Format currency
  const formatRp = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  // Format date properly
  const formatDate = (dateString) => {
    if (!dateString) return 'Invalid Date';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return 'Invalid Date';
    }
  };

  // Format items for display
  const formatItems = (items) => {
    if (!items) return '-';
    
    // If items is a string, return as is
    if (typeof items === 'string') return items;
    
    // If items is an object with name property
    if (typeof items === 'object' && items.name) {
      return items.name;
    }
    
    // If items is an array, get names
    if (Array.isArray(items)) {
      return items.map(item => item.name || item).join(', ');
    }
    
    return '-';
  };

  // Calculate KPIs
  const stats = {
    totalRevenue: orders.reduce((sum, o) => sum + (o.grandTotal || o.totalPrice || 0), 0),
    totalTransactions: orders.length,
    totalDiscount: orders.reduce((sum, o) => sum + (o.discount || 0), 0),
  };

  // Generate daily revenue data for trend chart
  const generateTrendData = () => {
    const days = 8;
    const data = [];
    const today = new Date();
    
    // Calculate max revenue from data first
    const allRevenues = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayOrders = orders.filter(o => {
        try {
          const oDate = new Date(o.createdAt).toISOString().split('T')[0];
          return oDate === dateStr;
        } catch {
          return false;
        }
      });
      const dayRevenue = dayOrders.reduce((sum, o) => sum + (o.grandTotal || o.totalPrice || 0), 0);
      allRevenues.push(dayRevenue);
    }
    const maxRevenue = Math.max(...allRevenues, 1);
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayOrders = orders.filter(o => {
        try {
          const oDate = new Date(o.createdAt).toISOString().split('T')[0];
          return oDate === dateStr;
        } catch {
          return false;
        }
      });
      const dayRevenue = dayOrders.reduce((sum, o) => sum + (o.grandTotal || o.totalPrice || 0), 0);
      
      data.push({
        date: date,
        formattedDate: `${date.getDate()} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()]}`,
        revenue: dayRevenue,
        height: (dayRevenue / maxRevenue) * 100,
      });
    }
    return data;
  };

  const trendData = generateTrendData();

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const data = await orderService.getHistory(startDate, endDate);
      setOrders(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const headers = ['Tanggal', 'Invoice', 'Customer', 'Items', 'Payment', 'Total', 'Status'];
    const rows = orders.map(o => [
      new Date(o.createdAt).toLocaleDateString('id-ID'),
      o.invoiceNumber || '-',
      o.customerName || 'Walk-in',
      formatItems(o.items),
      o.paymentMethod || '-',
      o.grandTotal,
      'Success',
    ]);
    
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan_keuangan_${startDate}_${endDate}.csv`;
    a.click();
  };

  return (
    <>
      <style>{ownerTableCss}</style>
      <style>{reportCss}</style>
      <div className="owner-page">
        {/* Header */}
        

        <div className="report-container">
          {/* Page Title */}
          <div className="report-title-section">
            <h1 className="report-title">Laporan Keuangan</h1>
            <p className="report-period">Periode: {startDate} - {endDate}</p>
          </div>

          {/* KPI Cards */}
          <div className="stat-cards-grid">
            <div className="stat-card gold">
              <div className="stat-card-icon gold">💰</div>
              <div className="stat-card-value">{formatRp(stats.totalRevenue)}</div>
              <div className="stat-card-label">Total Pendapatan (Gross)</div>
            </div>
            <div className="stat-card blue">
              <div className="stat-card-icon blue">📊</div>
              <div className="stat-card-value">{stats.totalTransactions}</div>
              <div className="stat-card-label">Total Transaksi</div>
            </div>
            <div className="stat-card red">
              <div className="stat-card-icon red">🏷️</div>
              <div className="stat-card-value">{formatRp(stats.totalDiscount)}</div>
              <div className="stat-card-label">Total Diskon Diberikan</div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="filter-panel">
            <div className="filter-inputs">
              <div className="filter-input-group">
                <label className="filter-label">Tanggal Mulai</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="filter-input"
                />
              </div>
              <div className="filter-input-group">
                <label className="filter-label">Tanggal Akhir</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="filter-input"
                />
              </div>
              <div className="filter-input-group">
                <label className="filter-label">Tipe</label>
                <select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="filter-input"
                >
                  <option value="all">Semua Tipe</option>
                  <option value="success">Success</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="filter-buttons">
                <button className="btn-generate" onClick={handleGenerate}>Generate</button>
                <button className="btn-export" onClick={handleExport}>Export</button>
              </div>
            </div>
          </div>

          {/* Trend Chart */}
          <div className="trend-panel">
            <h3 className="trend-title">Tren Pendapatan Harian</h3>
            <div className="trend-chart">
              {trendData.map((day, idx) => (
                <div key={idx} className="trend-bar-group">
                  <div className="trend-bar-container">
                    <div
                      className="trend-bar"
                      style={{ height: `${Math.max(day.height, 10)}%` }}
                      title={`${day.formattedDate}: ${formatRp(day.revenue)}`}
                    ></div>
                  </div>
                  <div className="trend-label">
                    <div>{day.formattedDate}</div>
                    <div className="trend-value">{(day.revenue / 1000).toFixed(0)}K</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction Table */}
          <div className="transaction-table-panel">
            <div className="transaction-header">
              <h3 className="transaction-title">Detail Transaksi</h3>
              <p className="transaction-count">Menampilkan {orders.length} transaksi</p>
            </div>
            <div className="transaction-table-wrapper">
              {loading ? (
                <div className="loading-state">Loading...</div>
              ) : orders.length === 0 ? (
                <div className="empty-state">Tidak ada transaksi pada periode ini</div>
              ) : (
                <table className="transaction-table">
                  <thead>
                    <tr>
                      <th className="col-date">Tanggal</th>
                      <th className="col-id">ID Transaksi</th>
                      <th className="col-customer">Pelanggan</th>
                      <th className="col-items">Items</th>
                      <th className="col-payment">Pembayaran</th>
                      <th className="col-total">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="col-date">
                          <div className="date-time">
                            <div>{formatDate(order.createdAt)}</div>
                            <div className="time">{new Date(order.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</div>
                          </div>
                        </td>
                        <td className="col-id">{order.invoiceNumber || `TRX-${order.id}`}</td>
                        <td className="col-customer">{order.customerName || 'Walk-in'}</td>
                        <td className="col-items">{formatItems(order.items)}</td>
                        <td className="col-payment">
                          <span className="payment-badge">{order.paymentMethod || 'CASH'}</span>
                        </td>
                        <td className="col-total">{formatRp(order.grandTotal || order.totalPrice || 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reports;