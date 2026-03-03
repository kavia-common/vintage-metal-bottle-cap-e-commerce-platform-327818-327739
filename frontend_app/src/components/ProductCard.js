import React from 'react';
import { Link } from 'react-router-dom';
import { centsToMoney, formatMoney } from '../lib/format';
import { useStore } from '../state/store';

// PUBLIC_INTERFACE
export function ProductCard({ product }) {
  /** This is a public function. */
  const { actions } = useStore();
  const price = formatMoney(centsToMoney(product.priceCents));
  const tag = (product.tags && product.tags[0]) || 'Vintage';

  return (
    <div className="kv-card product-card">
      <div className="product-media" aria-label={`${product.name} preview`}>
        <span className="kv-badge tag">{tag}</span>
        <div style={{ textAlign: 'center', padding: 16 }}>
          <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.03em' }}>CAP</div>
          <div className="kv-muted" style={{ fontSize: 12 }}>Decorative metal</div>
        </div>
      </div>

      <div className="product-body">
        <h3 className="product-name">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="product-desc">{product.description}</p>

        <div className="product-meta">
          <span className="price">{price}</span>
          <span className="kv-badge">★ {product.rating}</span>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 2 }}>
          <button className="kv-btn primary" onClick={() => actions.addToCart(product.id, 1)}>
            Add to cart
          </button>
          <Link className="kv-btn" to={`/product/${product.id}`}>View</Link>
        </div>
      </div>
    </div>
  );
}
