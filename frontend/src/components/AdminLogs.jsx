import React, { useEffect, useState } from 'react';
import { fetchLogs } from '../api/logAPI';
import { useNavigate } from 'react-router-dom';

function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchLogs();
        setLogs(data.logs || []);
      } catch (err) {
        console.error('Fetch logs error', err);
        setError('Không thể tải logs. Kiểm tra backend.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>📋 Activity Logs (Admin)</h2>
        <div>
          <button onClick={() => navigate('/admin')} className="profile-button" style={{ marginRight: 8 }}>⬅️ Quay lại</button>
        </div>
      </div>
      {loading && <p>Đang tải...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>#</th>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>UserId</th>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>Action</th>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>IP</th>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>Agent</th>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: 12 }}>Không có logs</td>
                </tr>
              )}
              {logs.map((l, idx) => (
                <tr key={l._id || idx}>
                  <td style={{ border: '1px solid #eee', padding: 8 }}>{idx + 1}</td>
                  <td style={{ border: '1px solid #eee', padding: 8 }}>{l.userId || '-'}</td>
                  <td style={{ border: '1px solid #eee', padding: 8 }}>{l.action}</td>
                  <td style={{ border: '1px solid #eee', padding: 8 }}>{l.ip || '-'}</td>
                  <td style={{ border: '1px solid #eee', padding: 8 }}>{l.agent || '-'}</td>
                  <td style={{ border: '1px solid #eee', padding: 8 }}>{new Date(l.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminLogs;
