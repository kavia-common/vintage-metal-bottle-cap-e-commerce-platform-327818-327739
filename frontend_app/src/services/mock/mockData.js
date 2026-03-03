/**
 * In-memory dataset for mock mode.
 * Note: This is a UI-enabling fallback; it is not a replacement for real backend persistence.
 */

export const categories = [
  { id: 'vintage', name: 'Vintage Retro' },
  { id: 'coffee', name: 'Coffee Quotes' },
  { id: 'bike', name: 'Bike Themes' },
  { id: 'bar', name: 'Bar & Pub' },
  { id: 'personalized', name: 'Personalized' }
];

export const products = [
  {
    id: 'cap-001',
    name: 'Retro Cola Crown Cap',
    description: 'Classic vintage soda vibe with subtle patina.',
    priceCents: 599,
    categoryId: 'vintage',
    stock: 42,
    rating: 4.6,
    tags: ['Best Seller', 'Vintage'],
    featured: true
  },
  {
    id: 'cap-002',
    name: 'Coffee First, Then Adulting',
    description: 'A daily reminder for the brew-obsessed.',
    priceCents: 699,
    categoryId: 'coffee',
    stock: 18,
    rating: 4.8,
    tags: ['New', 'Quote'],
    featured: true
  },
  {
    id: 'cap-003',
    name: 'Two Wheels, One Love',
    description: 'Minimal bike theme with crisp typography.',
    priceCents: 649,
    categoryId: 'bike',
    stock: 25,
    rating: 4.5,
    tags: ['Bike'],
    featured: false
  },
  {
    id: 'cap-004',
    name: 'Cheers & Beers',
    description: 'Bar-ready cap for your man cave wall.',
    priceCents: 749,
    categoryId: 'bar',
    stock: 9,
    rating: 4.7,
    tags: ['Bar'],
    featured: false
  },
  {
    id: 'cap-005',
    name: 'Custom Name Crown Cap',
    description: 'Personalize with a name or short phrase.',
    priceCents: 899,
    categoryId: 'personalized',
    stock: 100,
    rating: 4.9,
    tags: ['Custom'],
    featured: true
  },
  {
    id: 'cap-006',
    name: 'Vintage Motorcycle Emblem',
    description: 'Retro moto badge aesthetic for collectors.',
    priceCents: 799,
    categoryId: 'vintage',
    stock: 12,
    rating: 4.4,
    tags: ['Vintage'],
    featured: false
  },
  {
    id: 'cap-007',
    name: 'Espresso Yourself',
    description: 'Coffee quote with playful letterforms.',
    priceCents: 599,
    categoryId: 'coffee',
    stock: 30,
    rating: 4.3,
    tags: ['Quote'],
    featured: false
  },
  {
    id: 'cap-008',
    name: 'Ride More, Worry Less',
    description: 'A calming bike mantra for the road.',
    priceCents: 679,
    categoryId: 'bike',
    stock: 21,
    rating: 4.6,
    tags: ['Bike'],
    featured: true
  }
];

export const coupons = [
  { code: 'VINTAGE10', percentOff: 10, active: true },
  { code: 'CAPS5', amountOffCents: 500, active: true }
];

export const orders = [
  {
    id: 'ord-1001',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'Paid',
    totalCents: 2097,
    items: [
      { productId: 'cap-002', qty: 1, priceCents: 699 },
      { productId: 'cap-001', qty: 1, priceCents: 599 },
      { productId: 'cap-008', qty: 1, priceCents: 799 }
    ]
  },
  {
    id: 'ord-1002',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    status: 'Pending',
    totalCents: 899,
    items: [{ productId: 'cap-005', qty: 1, priceCents: 899 }]
  }
];

export const reviews = [
  { id: 'rev-1', productId: 'cap-002', author: 'Ava', rating: 5, text: 'Perfect for my coffee bar wall!', createdAt: new Date(Date.now() - 86400000 * 6).toISOString() },
  { id: 'rev-2', productId: 'cap-001', author: 'Noah', rating: 4, text: 'Looks authentically vintage.', createdAt: new Date(Date.now() - 86400000 * 3).toISOString() }
];
