import React from 'react';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export function NotFoundPage() {
  /** This is a public function. */
  return (
    <div className="kv-section">
      <div className="kv-container">
        <div className="kv-card padded">
          <div style={{ fontWeight: 900, marginBottom: 8 }}>Page not found</div>
          <div className="kv-muted" style={{ marginBottom: 12 }}>
            The page you are looking for doesn’t exist.
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link className="kv-btn primary" to="/">Home</Link>
            <Link className="kv-btn" to="/shop">Shop</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
