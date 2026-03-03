import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { getAppEnv } from '../../config/env';

// PUBLIC_INTERFACE
export function AdminLayout() {
  /** This is a public function. */
  const env = getAppEnv();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="kv-card padded" style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 900, marginBottom: 6 }}>Admin</div>
          <div className="kv-muted" style={{ fontSize: 12, lineHeight: 1.6 }}>
            API Base: <code>{env.apiBaseUrl || env.backendUrl || '(mock)'}</code>
          </div>
        </div>

        <nav className="admin-nav" aria-label="Admin navigation">
          <NavLink to="/admin" end className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'active' : ''}>Products</NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'active' : ''}>Orders</NavLink>
          <NavLink to="/admin/coupons" className={({ isActive }) => isActive ? 'active' : ''}>Coupons</NavLink>
        </nav>

        <div className="kv-card padded" style={{ marginTop: 12 }}>
          <div style={{ fontWeight: 900, marginBottom: 6 }}>Tips</div>
          <div className="kv-muted" style={{ fontSize: 12, lineHeight: 1.6 }}>
            This admin is mock-backed by default. To integrate a backend, implement the same routes and set env vars.
          </div>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
