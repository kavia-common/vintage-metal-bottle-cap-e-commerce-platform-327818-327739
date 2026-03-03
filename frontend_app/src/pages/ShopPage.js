import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../state/store';
import { ProductCard } from '../components/ProductCard';

function useSearchParams() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

// PUBLIC_INTERFACE
export function ShopPage() {
  /** This is a public function. */
  const { state, actions } = useStore();
  const params = useSearchParams();
  const navigate = useNavigate();

  const q0 = params.get('q') || '';
  const categoryId0 = params.get('categoryId') || '';
  const featured0 = params.get('featured') === 'true';

  const [q, setQ] = useState(q0);

  useEffect(() => {
    actions.loadCategories();
  }, [actions]);

  useEffect(() => {
    actions.loadProducts({ q: q0, categoryId: categoryId0, featured: featured0 });
  }, [actions, q0, categoryId0, featured0]);

  const categories = state.catalog.categories;

  function setCategory(categoryId) {
    const p = new URLSearchParams();
    if (q0) p.set('q', q0);
    if (categoryId) p.set('categoryId', categoryId);
    navigate(`/shop?${p.toString()}`);
  }

  function submitSearch(e) {
    e.preventDefault();
    const p = new URLSearchParams();
    if (q) p.set('q', q);
    if (categoryId0) p.set('categoryId', categoryId0);
    navigate(`/shop?${p.toString()}`);
  }

  return (
    <div className="kv-section">
      <div className="kv-container">
        <div className="kv-section-header">
          <h2>Shop</h2>
          <div className="kv-muted">Modern UI + mock API fallback</div>
        </div>

        <div className="kv-card padded" style={{ marginBottom: 12 }}>
          <form onSubmit={submitSearch} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products…"
              aria-label="Search products"
              style={{ flex: 1, minWidth: 240, padding: '10px 12px', borderRadius: 12, border: '1px solid var(--border)' }}
            />
            <button className="kv-btn primary" type="submit">Search</button>
            <button className="kv-btn" type="button" onClick={() => navigate('/shop')}>Reset</button>
          </form>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
            <button className={`kv-btn ${categoryId0 === '' ? 'secondary' : ''}`} onClick={() => setCategory('')}>
              All
            </button>
            {categories.map(c => (
              <button
                key={c.id}
                className={`kv-btn ${categoryId0 === c.id ? 'secondary' : ''}`}
                onClick={() => setCategory(c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="kv-grid products">
          {state.catalog.products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}
