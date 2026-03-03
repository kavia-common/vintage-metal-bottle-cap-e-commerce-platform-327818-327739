import React, { useEffect, useMemo, useState } from 'react';
import { createApiClient } from '../../services/apiClient';

// PUBLIC_INTERFACE
export function AdminDashboardPage() {
  /** This is a public function. */
  const api = useMemo(() => createApiClient({ useMockFallback: true }), []);
  const [status, setStatus] = useState('loading');
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setStatus('loading');
      try {
        const res = await api.request({ method: 'GET', path: '/admin/summary' });
        if (cancelled) return;
        setData(res);
        setStatus('ok');
      } catch (e) {
        if (cancelled) return;
        setStatus('error');
      }
    }
    run();
    return () => { cancelled = true; };
  }, [api]);

  if (status === 'loading') return <div className="kv-card padded">Loading admin summary…</div>;
  if (status === 'error' || !data) return <div className="kv-card padded">Unable to load admin summary.</div>;

  return (
    <div className="kv-grid" style={{ gap: 12 }}>
      <div className="kv-section-header" style={{ marginBottom: 0 }}>
        <h2 style={{ margin: 0 }}>Dashboard</h2>
        <div className="kv-muted">Mock analytics & orders</div>
      </div>

      <div className="kpi-row">
        <Kpi label="Revenue" value={`$${data.kpis.revenue}`} />
        <Kpi label="Orders" value={String(data.kpis.totalOrders)} />
        <Kpi label="Products" value={String(data.kpis.totalProducts)} />
        <Kpi label="Low stock" value={String(data.kpis.lowStock)} />
      </div>

      <div className="kv-card padded">
        <div style={{ fontWeight: 900, marginBottom: 10 }}>Recent orders</div>
        <table className="kv-table" aria-label="Recent orders">
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Created</th>
              <th>Total (cents)</th>
            </tr>
          </thead>
          <tbody>
            {data.recentOrders.map(o => (
              <tr key={o.id}>
                <td style={{ fontWeight: 900 }}>{o.id}</td>
                <td><span className="kv-badge">{o.status}</span></td>
                <td className="kv-muted">{new Date(o.createdAt).toLocaleString()}</td>
                <td style={{ fontWeight: 900 }}>{o.totalCents}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Kpi({ label, value }) {
  return (
    <div className="kv-card kpi">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
    </div>
  );
}
