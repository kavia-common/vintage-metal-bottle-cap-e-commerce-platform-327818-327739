import React, { useEffect, useMemo, useState } from 'react';
import { createApiClient } from '../../services/apiClient';

// PUBLIC_INTERFACE
export function AdminCouponsPage() {
  /** This is a public function. */
  const api = useMemo(() => createApiClient({ useMockFallback: true }), []);
  const [status, setStatus] = useState('loading');
  const [items, setItems] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setStatus('loading');
      try {
        const res = await api.request({ method: 'GET', path: '/admin/coupons' });
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

  if (status === 'loading') return <div className="kv-card padded">Loading coupons…</div>;
  if (status === 'error') return <div className="kv-card padded">Unable to load coupons.</div>;

  return (
    <div className="kv-grid" style={{ gap: 12 }}>
      <div className="kv-section-header" style={{ marginBottom: 0 }}>
        <h2 style={{ margin: 0 }}>Coupons</h2>
        <div className="kv-muted">{items.length} codes</div>
      </div>

      <div className="kv-card padded">
        <table className="kv-table" aria-label="Coupons">
          <thead>
            <tr>
              <th>Code</th>
              <th>Type</th>
              <th>Value</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>
            {items.map(c => (
              <tr key={c.code}>
                <td style={{ fontWeight: 900 }}>{c.code}</td>
                <td className="kv-muted">{c.percentOff ? 'Percent' : 'Amount'}</td>
                <td style={{ fontWeight: 900 }}>
                  {c.percentOff ? `${c.percentOff}%` : `${c.amountOffCents} cents`}
                </td>
                <td><span className="kv-badge">{c.active ? 'Yes' : 'No'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="kv-card padded">
        <div style={{ fontWeight: 900, marginBottom: 6 }}>Mock usage</div>
        <div className="kv-muted" style={{ lineHeight: 1.6 }}>
          Use <strong>VINTAGE10</strong> for 10% off, or <strong>CAPS5</strong> for $5 off (represented as 500 cents).
        </div>
      </div>
    </div>
  );
}
