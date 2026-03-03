import React from 'react';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export function Footer() {
  /** This is a public function. */
  return (
    <footer className="kv-footer" role="contentinfo">
      <div className="kv-container">
        <div className="kv-grid" style={{ gridTemplateColumns: '1.2fr 1fr 1fr', gap: 16 }}>
          <div className="kv-card padded">
            <div className="kv-brand" style={{ marginBottom: 8 }}>
              <span className="kv-brand-mark">VC</span>
              <span>VintageCaps</span>
            </div>
            <p className="kv-muted" style={{ margin: 0, lineHeight: 1.6 }}>
              Decorative metal bottle caps in vintage, retro, coffee quotes, bike themes, bar themes and personalized designs.
            </p>
          </div>

          <div className="kv-card padded">
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Explore</div>
            <div className="kv-grid" style={{ gap: 8 }}>
              <Link to="/shop">Shop</Link>
              <Link to="/about">About</Link>
              <Link to="/admin">Admin</Link>
            </div>
          </div>

          <div className="kv-card padded">
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Contact</div>
            <div className="kv-grid" style={{ gap: 8 }}>
              <a href="mailto:hello@vintagecaps.example">hello@vintagecaps.example</a>
              <a href="https://example.com" target="_blank" rel="noreferrer">Instagram</a>
              <a href="https://example.com" target="_blank" rel="noreferrer">Facebook</a>
            </div>
          </div>
        </div>

        <div className="kv-muted" style={{ marginTop: 14, fontSize: 12 }}>
          © {new Date().getFullYear()} VintageCaps. Mock-enabled demo frontend (no backend required).
        </div>
      </div>
    </footer>
  );
}
