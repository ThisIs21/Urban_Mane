import { useState, useEffect } from 'react';
import logService from '../../services/logService';
import { ownerTableCss } from './OwnerStyles';

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const data = await logService.getLogs();
        setLogs(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const getActionBadge = (action) => {
    switch(action) {
      case 'CREATE': return { text: 'CREATE', color: 'safe' };
      case 'DELETE': return { text: 'DELETE', color: 'danger' };
      case 'UPDATE': return { text: 'UPDATE', color: 'warning' };
      case 'LOGIN': return { text: 'LOGIN', color: 'info' };
      default: return { text: action, color: 'safe' };
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('id-ID', { 
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <>
      <style>{ownerTableCss}</style>
      <div className="owner-page">
        <div className="own-pg-header own-a1">
          <div>
            <p className="own-pg-eyebrow">Dashboard</p>
            <h1 className="own-pg-title">Activity Log</h1>
            <p className="own-pg-sub">Pantau semua aktivitas sistem dan staff</p>
          </div>
        </div>

        <div className="own-table-panel own-a2">
          <div className="own-table-head">
            <span className="own-table-head-title">Riwayat Aktivitas</span>
            {!loading && <span className="own-count">{logs.length} aktivitas</span>}
          </div>
          {loading ? (
            <div className="own-loading">Loading...</div>
          ) : logs.length === 0 ? (
            <div className="own-empty">Belum ada aktivitas</div>
          ) : (
            <table className="own-table">
              <thead>
                <tr>
                  <th>Aksi</th>
                  <th>Pengguna</th>
                  <th>Detail Aktivitas</th>
                  <th className="right">Waktu</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const badge = getActionBadge(log.action);
                  return (
                    <tr key={log.id}>
                      <td>
                        <span className={`own-badge own-badge.${badge.color}`}>
                          {badge.text}
                        </span>
                      </td>
                      <td>
                        <div style={{ color: 'var(--t1)', fontWeight: 500 }}>{log.user_name || "System"}</div>
                        <div style={{ fontSize: '11px', color: 'var(--t3)', marginTop: '2px' }}>{log.role}</div>
                      </td>
                      <td style={{ color: 'var(--t2)' }}>{log.details}</td>
                      <td className="right" style={{ fontSize: '12px', color: 'var(--t3)' }}>{formatDate(log.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default ActivityLog;