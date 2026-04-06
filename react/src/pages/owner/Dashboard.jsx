import { useState, useEffect } from 'react';
import orderService from '../../services/orderService';

const OwnerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    total_revenue: 0,
    low_stock: [],
    top_barbers: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await orderService.getOwnerDashboard();
        setData({
          total_revenue: res.total_revenue || 0,
          low_stock: res.low_stock || [],
          top_barbers: res.top_barbers || []
        });
      } catch (err) {
        console.error("Failed to fetch dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatRp = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard Owner</h1>
        <p style={{ color: 'var(--color-muted)' }}>Ringkasan bisnis & performa.</p>
      </div>

      {/* Stats Utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-border bg-card" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
          <p className="text-sm text-muted uppercase tracking-wider mb-2">Total Pendapatan</p>
          {loading ? <div className="h-8 w-40 bg-hover animate-pulse rounded"></div> : (
            <h2 className="text-3xl font-bold text-gold">{formatRp(data.total_revenue)}</h2>
          )}
          <p className="text-xs text-muted mt-2">Dari semua transaksi selesai</p>
        </div>
        
        <div className="p-6 rounded-xl border border-border bg-card" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
          <p className="text-sm text-muted uppercase tracking-wider mb-2">Peringatan Stok</p>
          {loading ? <div className="h-8 w-40 bg-hover animate-pulse rounded"></div> : (
            <h2 className="text-3xl font-bold text-red-400">{data.low_stock.length}</h2>
          )}
          <p className="text-xs text-muted mt-2">Produk dengan stok &lt; 5 item</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Barbers */}
        <div className="bg-card rounded-xl border border-border p-5" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
          <h3 className="font-bold text-white mb-4">Top Barber Performer</h3>
          {loading ? <p className="text-muted text-sm">Loading...</p> : (
            <div className="space-y-3">
              {data.top_barbers.length === 0 && <p className="text-muted text-sm">Belum ada data.</p>}
              {data.top_barbers.map((b, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">{i + 1}.</span>
                    <span className="text-white">{b.barber_name}</span>
                  </div>
                  <span className="text-gold font-semibold">{formatRp(safeNum(b.total_revenue))}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Table */}
        <div className="bg-card rounded-xl border border-border p-5" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
          <h3 className="font-bold text-white mb-4">Produk Stok Menipis</h3>
          {loading ? <p className="text-muted text-sm">Loading...</p> : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left pb-2 text-muted">Produk</th>
                  <th className="text-right pb-2 text-muted">Stok</th>
                </tr>
              </thead>
              <tbody>
                {data.low_stock.length === 0 && (
                  <tr><td colSpan="2" className="text-center py-4 text-muted">Semua stok aman.</td></tr>
                )}
                {data.low_stock.map((p, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="py-2 text-white">{p.name}</td>
                    <td className="py-2 text-right">
                      <span className="px-2 py-0.5 rounded bg-red-900/30 text-red-400 font-bold">{p.stock} pcs</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper karena aggregation return interface
const safeNum = (val) => {
    if (!val) return 0;
    if (typeof val === 'number') return val;
    // Handle Int32 atau Int64 dari BSON
    if (typeof val === 'object' && val.Low != null && val.High != null) {
        // Int64
        return val.Low + (val.High * 0x100000000);
    }
    return Number(val);
};

export default OwnerDashboard;