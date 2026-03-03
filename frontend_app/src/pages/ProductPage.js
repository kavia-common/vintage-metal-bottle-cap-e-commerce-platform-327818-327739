import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { createApiClient } from '../services/apiClient';
import { centsToMoney, formatMoney } from '../lib/format';
import { useStore } from '../state/store';

// PUBLIC_INTERFACE
export function ProductPage() {
  /** This is a public function. */
  const { id } = useParams();
  const { actions } = useStore();
  const api = useMemo(() => createApiClient({ useMockFallback: true }), []);
  const [status, setStatus] = useState('loading'); // loading | ok | error
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setStatus('loading');
      try {
        const res = await api.request({ method: 'GET', path: `/catalog/products/${id}` });
        if (cancelled) return;
        setProduct(res.item);
        setReviews(res.reviews || []);
        setStatus('ok');
      } catch (e) {
        if (cancelled) return;
        setStatus('error');
      }
    }

    run();
    return () => { cancelled = true; };
  }, [api, id]);

  if (status === 'loading') {
    return (
      <div className="kv-section">
        <div className="kv-container">
          <div className="kv-card padded">Loading…</div>
        </div>
      </div>
    );
  }

  if (status === 'error' || !product) {
    return (
      <div className="kv-section">
        <div className="kv-container">
          <div className="kv-card padded">
            <div style={{ fontWeight: 900, marginBottom: 6 }}>Product not found</div>
            <Link className="kv-btn" to="/shop">Back to shop</Link>
          </div>
        </div>
      </div>
    );
  }

  const price = formatMoney(centsToMoney(product.priceCents));

  return (
    <div className="kv-section">
      <div className="kv-container">
        <div className="kv-split">
          <div className="kv-card">
            <div className="product-media" style={{ height: 240 }}>
              <span className="kv-badge tag">{product.categoryId}</span>
              <div style={{ textAlign: 'center', padding: 16 }}>
                <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: '-0.03em' }}>CAP</div>
                <div className="kv-muted" style={{ fontSize: 12 }}>High-detail print + metal shine</div>
              </div>
            </div>
            <div className="product-body">
              <h2 style={{ margin: 0, letterSpacing: '-0.02em' }}>{product.name}</h2>
              <div className="kv-muted">{product.description}</div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <span className="kv-pill">★ {product.rating}</span>
                <span className="kv-badge">Stock: {product.stock}</span>
              </div>

              <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 22, fontWeight: 900 }}>{price}</div>
                <button className="kv-btn primary" onClick={() => actions.addToCart(product.id, 1)}>Add to cart</button>
              </div>
            </div>
          </div>

          <div className="kv-card padded">
            <div style={{ fontWeight: 900, marginBottom: 8 }}>Reviews</div>
            {reviews.length === 0 ? (
              <div className="kv-muted">No reviews yet.</div>
            ) : (
              <div className="kv-grid" style={{ gap: 10 }}>
                {reviews.map(r => (
                  <div key={r.id} className="kv-card padded" style={{ background: 'rgba(249, 250, 251, 0.7)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                      <div style={{ fontWeight: 900 }}>{r.author}</div>
                      <div className="kv-badge">★ {r.rating}</div>
                    </div>
                    <div className="kv-muted" style={{ marginTop: 6 }}>{r.text}</div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
              <Link to="/shop" className="kv-btn">Back to shop</Link>
              <button className="kv-btn secondary" onClick={() => actions.openCart()}>View cart</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
