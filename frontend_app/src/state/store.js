import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { createApiClient } from '../services/apiClient';
import { createLogger } from '../lib/logger';

const log = createLogger('Store');

const StoreContext = createContext(null);

const initialState = {
  catalog: {
    categories: [],
    products: [],
    lastQuery: { q: '', categoryId: '', featured: false }
  },
  cart: {
    open: false,
    items: [], // { productId, qty }
    couponCode: '',
    quote: null,
    quoteStatus: 'idle', // idle | loading | error
    checkoutStatus: 'idle', // idle | loading | success | error
    lastOrder: null,
    error: null
  },
  ui: {
    toast: null
  }
};

function reducer(state, action) {
  switch (action.type) {
    case 'CATALOG_SET_CATEGORIES':
      return { ...state, catalog: { ...state.catalog, categories: action.payload } };
    case 'CATALOG_SET_PRODUCTS':
      return { ...state, catalog: { ...state.catalog, products: action.payload, lastQuery: action.query } };

    case 'CART_OPEN':
      return { ...state, cart: { ...state.cart, open: true } };
    case 'CART_CLOSE':
      return { ...state, cart: { ...state.cart, open: false } };
    case 'CART_SET_COUPON':
      return { ...state, cart: { ...state.cart, couponCode: action.payload } };

    case 'CART_ADD_ITEM': {
      const { productId, qty } = action.payload;
      const existing = state.cart.items.find(i => i.productId === productId);
      const items = existing
        ? state.cart.items.map(i => i.productId === productId ? { ...i, qty: i.qty + qty } : i)
        : [...state.cart.items, { productId, qty }];
      return { ...state, cart: { ...state.cart, items, error: null } };
    }

    case 'CART_SET_QTY': {
      const { productId, qty } = action.payload;
      const items = state.cart.items
        .map(i => i.productId === productId ? { ...i, qty } : i)
        .filter(i => i.qty > 0);
      return { ...state, cart: { ...state.cart, items, error: null } };
    }

    case 'CART_CLEAR':
      return { ...state, cart: { ...state.cart, items: [], couponCode: '', quote: null, quoteStatus: 'idle', checkoutStatus: 'idle', lastOrder: null, error: null } };

    case 'CART_QUOTE_LOADING':
      return { ...state, cart: { ...state.cart, quoteStatus: 'loading', error: null } };
    case 'CART_QUOTE_SUCCESS':
      return { ...state, cart: { ...state.cart, quoteStatus: 'idle', quote: action.payload, error: null } };
    case 'CART_QUOTE_ERROR':
      return { ...state, cart: { ...state.cart, quoteStatus: 'error', error: action.payload } };

    case 'CHECKOUT_LOADING':
      return { ...state, cart: { ...state.cart, checkoutStatus: 'loading', error: null } };
    case 'CHECKOUT_SUCCESS':
      return { ...state, cart: { ...state.cart, checkoutStatus: 'success', lastOrder: action.payload, error: null } };
    case 'CHECKOUT_ERROR':
      return { ...state, cart: { ...state.cart, checkoutStatus: 'error', error: action.payload } };

    case 'TOAST_SHOW':
      return { ...state, ui: { ...state.ui, toast: action.payload } };
    case 'TOAST_CLEAR':
      return { ...state, ui: { ...state.ui, toast: null } };

    default:
      return state;
  }
}

// PUBLIC_INTERFACE
export function StoreProvider({ children }) {
  /** This is a public function. */
  const [state, dispatch] = useReducer(reducer, initialState);
  const api = useMemo(() => createApiClient({ useMockFallback: true }), []);

  const actions = useMemo(() => {
    return {
      // PUBLIC_INTERFACE
      async loadCategories() {
        /** This is a public function. */
        log.info('loadCategories:start');
        const res = await api.request({ method: 'GET', path: '/catalog/categories' });
        dispatch({ type: 'CATALOG_SET_CATEGORIES', payload: res.items || [] });
        log.info('loadCategories:ok', { count: (res.items || []).length });
      },

      // PUBLIC_INTERFACE
      async loadProducts(query) {
        /** This is a public function. */
        const q = query?.q || '';
        const categoryId = query?.categoryId || '';
        const featured = Boolean(query?.featured);
        log.info('loadProducts:start', { q, categoryId, featured });

        const res = await api.request({ method: 'GET', path: '/catalog/products', query: { q, categoryId, featured } });
        dispatch({ type: 'CATALOG_SET_PRODUCTS', payload: res.items || [], query: { q, categoryId, featured } });
        log.info('loadProducts:ok', { count: (res.items || []).length });
      },

      // PUBLIC_INTERFACE
      openCart() {
        /** This is a public function. */
        dispatch({ type: 'CART_OPEN' });
      },

      // PUBLIC_INTERFACE
      closeCart() {
        /** This is a public function. */
        dispatch({ type: 'CART_CLOSE' });
      },

      // PUBLIC_INTERFACE
      addToCart(productId, qty = 1) {
        /** This is a public function. */
        dispatch({ type: 'CART_ADD_ITEM', payload: { productId, qty } });
        dispatch({ type: 'TOAST_SHOW', payload: { kind: 'success', message: 'Added to cart' } });
      },

      // PUBLIC_INTERFACE
      setQty(productId, qty) {
        /** This is a public function. */
        dispatch({ type: 'CART_SET_QTY', payload: { productId, qty } });
      },

      // PUBLIC_INTERFACE
      setCoupon(code) {
        /** This is a public function. */
        dispatch({ type: 'CART_SET_COUPON', payload: code });
      },

      // PUBLIC_INTERFACE
      async refreshQuote() {
        /** This is a public function. */
        dispatch({ type: 'CART_QUOTE_LOADING' });
        try {
          const res = await api.request({
            method: 'POST',
            path: '/checkout/quote',
            body: { items: state.cart.items, couponCode: state.cart.couponCode }
          });
          dispatch({ type: 'CART_QUOTE_SUCCESS', payload: res });
          return res;
        } catch (e) {
          dispatch({ type: 'CART_QUOTE_ERROR', payload: e?.message || 'Unable to quote totals' });
          return null;
        }
      },

      // PUBLIC_INTERFACE
      async checkout() {
        /** This is a public function. */
        dispatch({ type: 'CHECKOUT_LOADING' });
        try {
          const res = await api.request({
            method: 'POST',
            path: '/checkout/create-order',
            body: { items: state.cart.items, couponCode: state.cart.couponCode }
          });
          dispatch({ type: 'CHECKOUT_SUCCESS', payload: res.order });
          dispatch({ type: 'TOAST_SHOW', payload: { kind: 'success', message: `Order ${res.order.id} created (mock)` } });
          return res.order;
        } catch (e) {
          dispatch({ type: 'CHECKOUT_ERROR', payload: e?.message || 'Checkout failed' });
          return null;
        }
      },

      // PUBLIC_INTERFACE
      clearCart() {
        /** This is a public function. */
        dispatch({ type: 'CART_CLEAR' });
      },

      // PUBLIC_INTERFACE
      clearToast() {
        /** This is a public function. */
        dispatch({ type: 'TOAST_CLEAR' });
      }
    };
  // state.cart.items and coupon affect quote/checkout bodies
  }, [api, state.cart.items, state.cart.couponCode]);

  const value = useMemo(() => ({ state, actions }), [state, actions]);

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useStore() {
  /** This is a public function. */
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
