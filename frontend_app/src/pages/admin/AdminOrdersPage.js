import React, { useEffect, useMemo, useState } from 'react';
import { createApiClient } from '../../services/apiClient';

// PUBLIC_INTERFACE
export function AdminOrdersPage() {
  /** This is a public function. */
  const api = useMemo(() => createApiClient({ useMockFallback: true }), []);
  const [status, setStatus] = useState('loading');
  const [items, setItems] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setStatus('loading');
      try {
        const res = await api.request({ method: 'GET', path: '/admin/orders' });
        if (cancelled) return;
        setItems(res.items || []);
        setStatus('ok');
      } catch (e) {
        if (cancelled) return;
        setStatus('error');
      }
    }
    run();
    return () => { cancelled = true; };
  }, [api]);

  if (status === 'loading') return <div className="kv-card padded">Loading orders…</div>;
  if (status === 'error') return <div className="kv-card padded">Unable to load orders.</div>;

  return (
    <div className="kv-grid" style={{ gap: 12 }}>
      <div className="kv-section-header" style={{ marginBottom: 0 }}>
        <h2 style={{ margin: 0 }}>Orders</h2>
        <div className="kv-muted">{items.length} orders</div>
      </div>

      <div className="kv-card padded">
        <table className="kv-table" aria-label="Orders">
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Created</th>
              <th>Total (cents)</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            {items.map(o => (
              <tr key={o.id}>
                <td style={{ fontWeight: 900 }}>{o.id}</td>
                <td><span className="kv-badge">{o.status}</span></td>
                <td className="kv-muted">{new Date(o.createdAt).toLocaleString()}</td>
                <td style={{ fontWeight: 900 }}>{o.totalCents}</td>
                <td className="kv-muted">{o.items.map(i => `${i.productId}×${i.qty}`).join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
