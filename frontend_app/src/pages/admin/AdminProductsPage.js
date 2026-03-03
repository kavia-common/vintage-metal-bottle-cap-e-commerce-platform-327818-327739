import React, { useEffect, useMemo, useState } from 'react';
import { createApiClient } from '../../services/apiClient';

// PUBLIC_INTERFACE
export function AdminProductsPage() {
  /** This is a public function. */
  const api = useMemo(() => createApiClient({ useMockFallback: true }), []);
  const [status, setStatus] = useState('loading');
  const [items, setItems] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setStatus('loading');
      try {
        const res = await api.request({ method: 'GET', path: '/admin/products' });
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

  if (status === 'loading') return <div className="kv-card padded">Loading products…</div>;
  if (status === 'error') return <div className="kv-card padded">Unable to load products.</div>;

  return (
    <div className="kv-grid" style={{ gap: 12 }}>
      <div className="kv-section-header" style={{ marginBottom: 0 }}>
        <h2 style={{ margin: 0 }}>Products</h2>
        <div className="kv-muted">{items.length} items</div>
      </div>

      <div className="kv-card padded">
        <table className="kv-table" aria-label="Products">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Price (cents)</th>
            </tr>
          </thead>
          <tbody>
            {items.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 900 }}>{p.id}</td>
                <td>{p.name}</td>
                <td><span className="kv-badge">{p.categoryId}</span></td>
                <td>{p.stock}</td>
                <td style={{ fontWeight: 900 }}>{p.priceCents}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
