import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Import service jika perlu fetch data real-time

const CashierDashboard = () => {
  // Dummy data untuk tampilan
  const stats = [
    { label: 'Transaksi Hari Ini', value: '12', icon: '🧾' },
    { label: 'Pendapatan Shift', value: 'Rp 1.2 Jt', icon: '💰' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Selamat Datang!</h1>
        <p className="text-muted mt-1" style={{ color: 'var(--color-muted)' }}>
          Siap memulai shift hari ini?
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/cashier/transaction" className="block p-6 rounded-xl border border-border hover:border-gold transition-colors group" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-colors" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', color: 'var(--color-gold)' }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Transaksi Baru</h3>
              <p className="text-sm text-muted" style={{ color: 'var(--color-muted)' }}>Buat struk pembayaran</p>
            </div>
          </div>
        </Link>

        <Link to="/cashier/history" className="block p-6 rounded-xl border border-border hover:border-gold transition-colors group" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Riwayat Transaksi</h3>
              <p className="text-sm text-muted" style={{ color: 'var(--color-muted)' }}>Lihat penjualan sebelumnya</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Stats Mini */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="p-4 rounded-lg bg-card border border-border" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
            <div className="flex items-center justify-between">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-xl font-bold text-white">{stat.value}</span>
            </div>
            <p className="text-xs mt-2 text-muted" style={{ color: 'var(--color-muted)' }}>{stat.label}</p>
          </div>
        ))}
      </div>
      
      {/* Info */}
      <div className="mt-4 p-4 rounded-lg border border-border bg-secondary" style={{ backgroundColor: 'var(--color-secondary)', borderColor: 'var(--color-border)' }}>
        <p className="text-sm text-muted" style={{ color: 'var(--color-muted)' }}>
          <span className="text-gold font-semibold" style={{ color: 'var(--color-gold)' }}>Tips:</span> Pastikan stok produk sudah diperbarui sebelum memulai transaksi. Hubungi Admin jika ada kendala.
        </p>
      </div>
    </div>
  );
};

export default CashierDashboard;