export const testIds = {
  nav: {
    home: 'nav-home',
    catalog: 'nav-catalog',
    cart: 'nav-cart',
    orders: 'nav-orders',
    login: 'nav-login',
    logout: 'nav-logout',
    register: 'nav-register',
  },
  auth: {
    email: 'auth-email',
    password: 'auth-password',
    name: 'auth-name',
    submit: 'auth-submit',
    error: 'auth-error',
  },
  catalog: {
    search: 'catalog-search',
    genre: 'catalog-genre',
    sort: 'catalog-sort',
    results: 'catalog-results',
  },
  product: {
    addToCart: (id) => `product-${id}-add`,
  },
  cart: {
    count: 'cart-count',
    checkout: 'cart-checkout',
    clear: 'cart-clear',
    itemQty: (id) => `cart-${id}-qty`,
    itemRemove: (id) => `cart-${id}-remove`,
  },
  checkout: {
    address1: 'checkout-address1',
    city: 'checkout-city',
    state: 'checkout-state',
    zip: 'checkout-zip',
    continue: 'checkout-continue',
  },
  payment: {
    method: 'payment-method',
    cardNumber: 'payment-card-number',
    upiId: 'payment-upi-id',
    pay: 'payment-pay',
    error: 'payment-error',
  },
  orders: {
    list: 'orders-list',
    detail: (id) => `order-${id}-detail`,
    advanceStatus: (id) => `order-${id}-advance`,
  },
}

