import React, { useMemo, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../state/store';

function useQueryParam(key) {
  const { search } = useLocation();
  return useMemo(() => {
    const p = new URLSearchParams(search);
    return p.get(key) || '';
  }, [search, key]);
}

// PUBLIC_INTERFACE
export function Navbar() {
  /** This is a public function. */
  const { state, actions } = useStore();
  const navigate = useNavigate();
  const q0 = useQueryParam('q');
  const [q, setQ] = useState(q0);

  const cartCount = state.cart.items.reduce((sum, i) => sum + i.qty, 0);

  function submitSearch(e) {
    e.preventDefault();
    navigate(`/shop?q=${encodeURIComponent(q)}`);
  }

  return (
    <div className="kv-navbar" role="navigation" aria-label="Main">
      <div className="kv-container kv-navbar-inner">
        <NavLink to="/" className="kv-brand" aria-label="Vintage Caps Home">
          <span className="kv-brand-mark">VC</span>
          <span>VintageCaps</span>
          <span className="kv-badge" style={{ marginLeft: 8 }}>Metal Bottle Caps</span>
        </NavLink>

        <form className="kv-search" onSubmit={submitSearch} role="search" aria-label="Search products">
          <span aria-hidden="true">⌕</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search vintage, coffee quotes, bike, bar…"
            aria-label="Search"
          />
          <span className="hint">Enter</span>
        </form>

        <div className="kv-nav-links" aria-label="Links">
          <NavLink to="/shop" className={({ isActive }) => `kv-nav-link ${isActive ? 'active' : ''}`}>Shop</NavLink>
          <NavLink to="/about" className={({ isActive }) => `kv-nav-link ${isActive ? 'active' : ''}`}>About</NavLink>
          <NavLink to="/admin" className={({ isActive }) => `kv-nav-link ${isActive ? 'active' : ''}`}>Admin</NavLink>

          <button className="kv-btn primary" onClick={() => actions.openCart()} aria-label="Open cart">
            Cart <span className="kv-pill">{cartCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
