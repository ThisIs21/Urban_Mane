import { useState, useEffect } from 'react';
import orderService from '../../services/orderService';
import { ownerTableCss } from './OwnerStyles';

const Reports = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filter State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    // Set default: bulan ini
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
    
    setStartDate(firstDay);
    setEndDate(lastDay);
  }, []);

  useEffect(() => {
    if (startDate && endDate) fetchReport();
  }, [startDate, endDate]);

  const fetchReport = async () => {
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

  const formatRp = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  
  // Calculate Totals
  const totalRevenue = orders.reduce((sum, o) => sum + o.grand_total, 0);

  return (
    <>
      <style>{ownerTableCss}</style>
      <div className="owner-page">
        <div className="own-pg-header own-a1">
          <div>
            <p className="own-pg-eyebrow">Dashboard</p>
            <h1 className="own-pg-title">Laporan Keuangan</h1>
            <p className="own-pg-sub">Riwayat transaksi dan analisis pendapatan</p>
          </div>
        </div>

        {/* Filter & Summary */}
        <div className="own-table-panel own-a2" style={{ marginBottom: '20px' }}>
          <div className="own-table-head">
            <span className="own-table-head-title">Filter Periode</span>
          </div>
          <div style={{ padding: '20px', display: 'flex', gap: '20px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <label className="own-label">Dari Tanggal</label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="own-input"
              />
            </div>
            <div style={{ flex: 1, minWidth: '150px' }}>
              <label className="own-label">Sampai Tanggal</label>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="own-input"
              />
            </div>
            
            {/* Summary */}
            <div style={{ background: 'var(--s3)', padding: '14px 18px', borderRadius: '8px', border: '1px solid var(--border)', minWidth: '200px' }}>
              <p style={{ fontSize: '10px', color: 'var(--t3)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>Total Pendapatan</p>
              <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--gold)' }}>{formatRp(totalRevenue)}</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="own-table-panel own-a3">
          <div className="own-table-head">
            <span className="own-table-head-title">Riwayat Transaksi</span>
            {!loading && <span className="own-count">{orders.length} transaksi</span>}
          </div>
          <table className="own-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Invoice</th>
                <th>Customer</th>
                <th>Barber</th>
                <th className="right">Total</th>
                <th className="center">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="own-loading">Loading...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan="6" className="own-empty">Tidak ada transaksi pada periode ini</td></tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ color: 'var(--gold)', fontWeight: 500, fontSize: '12px', fontFamily: 'monospace' }}>{order.invoice_number}</td>
                    <td style={{ color: 'var(--t1)', fontWeight: 500 }}>{order.customer_name || "Walk-in"}</td>
                    <td>{order.barber_name || "-"}</td>
                    <td className="right" style={{ color: 'var(--t1)', fontWeight: 600 }}>{formatRp(order.grand_total)}</td>
                    <td className="center">
                      <span className="own-badge own-badge.active">Completed</span>
                    </td>
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

export default Reports;