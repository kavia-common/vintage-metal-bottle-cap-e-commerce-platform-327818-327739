import { categories, products, coupons, orders, reviews } from './mockData';
import { ApiError } from '../apiClient';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function toMoney(cents) {
  return Number((cents / 100).toFixed(2));
}

function contains(haystack, needle) {
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

function filterProducts({ q, categoryId, featured }) {
  let list = [...products];
  if (q) list = list.filter(p => contains(p.name, q) || contains(p.description, q));
  if (categoryId) list = list.filter(p => p.categoryId === categoryId);
  if (featured === true) list = list.filter(p => p.featured);
  return list;
}

function calcCartTotals(items, couponCode) {
  const lines = items.map(i => {
    const product = products.find(p => p.id === i.productId);
    if (!product) throw new ApiError('Product not found', { status: 404, code: 'NOT_FOUND', details: { productId: i.productId } });
    return {
      productId: product.id,
      name: product.name,
      qty: i.qty,
      unitPriceCents: product.priceCents,
      lineTotalCents: product.priceCents * i.qty
    };
  });

  const subtotalCents = lines.reduce((sum, l) => sum + l.lineTotalCents, 0);
  const shippingCents = subtotalCents > 2500 ? 0 : 499;

  let discountCents = 0;
  if (couponCode) {
    const c = coupons.find(x => x.code.toUpperCase() === String(couponCode).toUpperCase() && x.active);
    if (!c) throw new ApiError('Invalid coupon code', { status: 400, code: 'INVALID_COUPON', details: { couponCode } });
    if (c.percentOff) discountCents = Math.round(subtotalCents * (c.percentOff / 100));
    if (c.amountOffCents) discountCents = c.amountOffCents;
    discountCents = Math.min(discountCents, subtotalCents);
  }

  const totalCents = Math.max(0, subtotalCents + shippingCents - discountCents);

  return {
    lines,
    subtotalCents,
    shippingCents,
    discountCents,
    totalCents,
    money: {
      subtotal: toMoney(subtotalCents),
      shipping: toMoney(shippingCents),
      discount: toMoney(discountCents),
      total: toMoney(totalCents)
    }
  };
}

export const mockAdapter = {
  async handle(req) {
    // simulate network latency
    await sleep(220);

    const method = (req.method || 'GET').toUpperCase();
    const path = req.path || '/';
    const query = req.query || {};
    const body = req.body || {};

    // Products
    if (method === 'GET' && path === '/catalog/categories') {
      return { items: categories };
    }
    if (method === 'GET' && path === '/catalog/products') {
      const q = query.q || '';
      const categoryId = query.categoryId || '';
      const featured = query.featured === 'true' || query.featured === true;
      return { items: filterProducts({ q, categoryId, featured }) };
    }
    if (method === 'GET' && path.startsWith('/catalog/products/')) {
      const id = path.split('/').pop();
      const product = products.find(p => p.id === id);
      if (!product) throw new ApiError('Not found', { status: 404, code: 'NOT_FOUND' });
      const productReviews = reviews.filter(r => r.productId === id);
      return { item: product, reviews: productReviews };
    }

    // Pricing / coupon validation
    if (method === 'POST' && path === '/checkout/quote') {
      const items = Array.isArray(body.items) ? body.items : [];
      const couponCode = body.couponCode || '';
      return calcCartTotals(items, couponCode);
    }

    // Create order (mock)
    if (method === 'POST' && path === '/checkout/create-order') {
      const items = Array.isArray(body.items) ? body.items : [];
      const couponCode = body.couponCode || '';
      const totals = calcCartTotals(items, couponCode);

      const order = {
        id: `ord-${1000 + orders.length + 1}`,
        createdAt: new Date().toISOString(),
        status: 'Paid',
        totalCents: totals.totalCents,
        items: totals.lines.map(l => ({ productId: l.productId, qty: l.qty, priceCents: l.unitPriceCents }))
      };

      orders.unshift(order);
      return { order };
    }

    // Admin analytics
    if (method === 'GET' && path === '/admin/summary') {
      const revenueCents = orders.reduce((sum, o) => sum + o.totalCents, 0);
      const totalOrders = orders.length;
      const totalProducts = products.length;
      const lowStock = products.filter(p => p.stock <= 10).length;

      return {
        kpis: {
          revenue: toMoney(revenueCents),
          totalOrders,
          totalProducts,
          lowStock
        },
        recentOrders: orders.slice(0, 6)
      };
    }

    if (method === 'GET' && path === '/admin/products') {
      return { items: products };
    }

    if (method === 'GET' && path === '/admin/orders') {
      return { items: orders };
    }

    if (method === 'GET' && path === '/admin/coupons') {
      return { items: coupons };
    }

    throw new ApiError('Mock route not implemented', { status: 404, code: 'MOCK_ROUTE_MISSING', details: { method, path } });
  }
};
