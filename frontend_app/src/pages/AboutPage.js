import React from 'react';

// PUBLIC_INTERFACE
export function AboutPage() {
  /** This is a public function. */
  return (
    <div className="kv-section">
      <div className="kv-container">
        <div className="kv-card padded">
          <h2 style={{ marginTop: 0 }}>About VintageCaps</h2>
          <p className="kv-muted" style={{ lineHeight: 1.7 }}>
            This frontend is a production-style demo UI for an e-commerce experience selling decorative metal bottle caps
            across vintage retro, coffee quotes, bike themes, bar themes, and personalized designs.
          </p>
          <p className="kv-muted" style={{ lineHeight: 1.7 }}>
            It includes a reusable API client and a mock fallback adapter so the UI works without a backend. When you connect a backend,
            set <code>REACT_APP_API_BASE</code> or <code>REACT_APP_BACKEND_URL</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
