import React, { useEffect, useMemo } from 'react';
import { centsToMoney, formatMoney } from '../lib/format';
import { useStore } from '../state/store';

function useCartLines(products, items) {
  return useMemo(() => {
    return items.map(i => {
      const p = products.find(x => x.id === i.productId);
      return {
        ...i,
        product: p || { id: i.productId, name: 'Unknown product', priceCents: 0 }
      };
    });
  }, [products, items]);
}

// PUBLIC_INTERFACE
export function CartDrawer() {
  /** This is a public function. */
  const { state, actions } = useStore();
  const { open, items, couponCode, quote, quoteStatus, checkoutStatus, lastOrder, error } = state.cart;
  const lines = useCartLines(state.catalog.products, items);

  useEffect(() => {
    if (!open) return;
    // Re-quote when opened
    if (items.length > 0) actions.refreshQuote();
  }, [open, items.length, actions]);

  if (!open) return null;

  const subtotalCents = quote?.subtotalCents ?? lines.reduce((sum, l) => sum + (l.product.priceCents * l.qty), 0);
  const shippingCents = quote?.shippingCents ?? 0;
  const discountCents = quote?.discountCents ?? 0;
  const totalCents = quote?.totalCents ?? subtotalCents + shippingCents - discountCents;

  function closeOnBackdrop(e) {
    if (e.target === e.currentTarget) actions.closeCart();
  }

  return (
    <div className="drawer-backdrop" onMouseDown={closeOnBackdrop} role="dialog" aria-modal="true" aria-label="Cart">
      <div className="drawer">
        <div className="drawer-header">
          <div style={{ fontWeight: 900 }}>Your Cart</div>
          <button className="kv-btn ghost" onClick={() => actions.closeCart()} aria-label="Close cart">✕</button>
        </div>

        <div className="drawer-body">
          {items.length === 0 ? (
            <div className="kv-card padded">
              <div style={{ fontWeight: 800, marginBottom: 6 }}>Cart is empty</div>
              <div className="kv-muted">Add some caps to see totals and checkout.</div>
            </div>
          ) : (
            <>
              {lines.map(l => (
                <div key={l.productId} className="line-item">
                  <div>
                    <div style={{ fontWeight: 800 }}>{l.product.name}</div>
                    <div className="kv-muted" style={{ fontSize: 12 }}>
                      {formatMoney(centsToMoney(l.product.priceCents))} each
                    </div>
                  </div>
                  <div className="qty-controls" aria-label="Quantity controls">
                    <button onClick={() => actions.setQty(l.productId, l.qty - 1)} aria-label="Decrease quantity">−</button>
                    <div style={{ width: 22, textAlign: 'center', fontWeight: 800 }}>{l.qty}</div>
                    <button onClick={() => actions.setQty(l.productId, l.qty + 1)} aria-label="Increase quantity">+</button>
                  </div>
                </div>
              ))}

              <div className="kv-card padded">
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input
                    value={couponCode}
                    onChange={(e) => actions.setCoupon(e.target.value)}
                    placeholder="Coupon code (e.g., VINTAGE10)"
                    aria-label="Coupon code"
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      borderRadius: 12,
                      border: '1px solid var(--border)'
                    }}
                  />
                  <button className="kv-btn" onClick={() => actions.refreshQuote()} disabled={quoteStatus === 'loading'}>
                    {quoteStatus === 'loading' ? 'Applying…' : 'Apply'}
                  </button>
                </div>
                {error ? <div style={{ marginTop: 10, color: 'var(--color-error)', fontWeight: 700 }}>{error}</div> : null}
              </div>

              {lastOrder ? (
                <div className="kv-card padded" style={{ borderColor: 'rgba(245, 158, 11, 0.35)' }}>
                  <div style={{ fontWeight: 900, marginBottom: 6 }}>Order created</div>
                  <div className="kv-muted">Order <strong>{lastOrder.id}</strong> ({lastOrder.status})</div>
                  <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
                    <button className="kv-btn" onClick={() => actions.clearCart()}>New cart</button>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>

        <div className="drawer-footer">
          <div className="kv-card padded">
            <div style={{ display: 'grid', gap: 8 }}>
              <Row label="Subtotal" value={formatMoney(centsToMoney(subtotalCents))} />
              <Row label="Shipping" value={formatMoney(centsToMoney(shippingCents))} />
              <Row label="Discount" value={`-${formatMoney(centsToMoney(discountCents))}`} />
              <div style={{ height: 1, background: 'var(--border)', margin: '6px 0' }} />
              <Row label={<strong>Total</strong>} value={<strong>{formatMoney(centsToMoney(totalCents))}</strong>} />
            </div>
          </div>

          <button
            className="kv-btn primary"
            onClick={() => actions.checkout()}
            disabled={items.length === 0 || checkoutStatus === 'loading' || Boolean(lastOrder)}
          >
            {checkoutStatus === 'loading' ? 'Processing…' : 'Checkout (mock)'}
          </button>

          <button className="kv-btn" onClick={() => actions.clearCart()} disabled={items.length === 0}>
            Clear cart
          </button>

          <div className="kv-muted" style={{ fontSize: 12 }}>
            This demo uses a mock payment + order creation flow. Configure <code>REACT_APP_API_BASE</code> to connect a backend.
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
      <div className="kv-muted">{label}</div>
      <div style={{ fontWeight: 900 }}>{value}</div>
    </div>
  );
}
