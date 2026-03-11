import { useEffect, useState } from 'react';

const Dashboard = () => {
  // Dummy Stats
  const stats = [
    { label: 'Total Users', value: '24', change: '+2 this month', icon: '👥' },
    { label: 'Products', value: '48', change: '5 low stock', icon: '📦' },
    { label: 'Revenue', value: 'Rp 12.5 Jt', change: '+15%', icon: '💰' },
    { label: 'Transactions', value: '156', change: 'Today: 12', icon: '🧾' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-muted mt-1" style={{ color: 'var(--color-muted)' }}>Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-card p-6 rounded-xl border border-border" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
            <div className="flex justify-between items-start mb-4">
              <div className="text-3xl">{stat.icon}</div>
              <span className="text-xs px-2 py-1 rounded bg-green-900/50 text-green-400">{stat.change}</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-muted text-sm" style={{ color: 'var(--color-muted)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity Placeholder */}
      <div className="bg-card rounded-xl border border-border p-6" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
        <h2 className="text-lg font-semibold text-white mb-4">Recent Activities</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-hover transition-colors" style={{ backgroundColor: 'transparent' }}>
              <div className="w-10 h-10 rounded-full bg-gold/20 text-gold flex items-center justify-center" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', color: 'var(--color-gold)' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">New Transaction Recorded</p>
                <p className="text-muted text-xs" style={{ color: 'var(--color-muted)' }}>2 minutes ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;