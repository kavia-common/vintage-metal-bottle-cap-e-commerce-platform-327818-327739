import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../state/store';
import { ProductCard } from '../components/ProductCard';

// PUBLIC_INTERFACE
export function HomePage() {
  /** This is a public function. */
  const { state, actions } = useStore();

  useEffect(() => {
    actions.loadCategories();
    actions.loadProducts({ featured: true });
  }, [actions]);

  const featured = state.catalog.products;

  return (
    <div>
      <div className="kv-hero">
        <div className="kv-container kv-hero-grid">
          <div className="kv-hero-card">
            <h1 className="kv-title">Decorative Metal Bottle Caps with Vintage Personality</h1>
            <p className="kv-subtitle">
              Vintage retro, coffee quotes, bike themes, bar themes, and personalized designs — curated to look great on walls,
              shelves, and home bars.
            </p>

            <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
              <Link className="kv-btn primary" to="/shop">Shop the collection</Link>
              <Link className="kv-btn" to="/shop?categoryId=personalized">Personalize a cap</Link>
              <button className="kv-btn secondary" onClick={() => actions.openCart()}>View cart</button>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
              <span className="kv-badge">Free shipping over $25</span>
              <span className="kv-badge">Mock-ready API client</span>
              <span className="kv-badge">Admin dashboard included</span>
            </div>
          </div>

          <div className="kv-card padded" style={{ display: 'grid', gap: 10 }}>
            <div style={{ fontWeight: 900, fontSize: 14 }}>Popular categories</div>
            <div className="kv-grid" style={{ gap: 10 }}>
              {state.catalog.categories.map(c => (
                <Link key={c.id} to={`/shop?categoryId=${encodeURIComponent(c.id)}`} className="kv-btn">
                  {c.name}
                </Link>
              ))}
            </div>
            <div className="kv-muted" style={{ fontSize: 12 }}>
              Tip: Try coupon <strong>VINTAGE10</strong> in cart.
            </div>
          </div>
        </div>
      </div>

      <div className="kv-section">
        <div className="kv-container">
          <div className="kv-section-header">
            <h2>Featured caps</h2>
            <Link to="/shop" className="kv-nav-link active">Browse all →</Link>
          </div>

          <div className="kv-grid products">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
