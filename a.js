const products = [
  { id: 1, name: 'Simsiz quloqchin, tiniq va kuchli ovoz', category: 'Elektronika', price: 289000, oldPrice: 399000, rating: '4.9', reviews: 128, badge: '-28%', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80' },
  { id: 2, name: 'Minimalistik stol chirog‘i — iliq nur', category: 'Uy uchun', price: 179000, oldPrice: 229000, rating: '4.8', reviews: 86, badge: 'TOP', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80' },
  { id: 3, name: 'Yumshoq parvarishlovchi yuz kremi', category: 'Go‘zallik', price: 119000, oldPrice: 159000, rating: '4.9', reviews: 204, badge: '-25%', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80' },
  { id: 4, name: 'Kundalik qulay krossovka', category: 'Kiyim', price: 349000, oldPrice: 429000, rating: '4.7', reviews: 63, badge: '-19%', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80' },
  { id: 5, name: 'Aqlli soat — kuningizni nazorat qiling', category: 'Elektronika', price: 459000, oldPrice: 579000, rating: '4.8', reviews: 152, badge: '-21%', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80' },
  { id: 6, name: 'Tabiiy aromali uy diffuzori', category: 'Uy uchun', price: 99000, oldPrice: 129000, rating: '4.6', reviews: 47, badge: 'TOP', image: 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=600&q=80' },
  { id: 7, name: 'Yengil namlovchi serum', category: 'Go‘zallik', price: 89000, oldPrice: 119000, rating: '4.9', reviews: 97, badge: '-25%', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80' },
  { id: 8, name: 'Sport uchun ixcham ryukzak', category: 'Sport', price: 199000, oldPrice: 259000, rating: '4.7', reviews: 58, badge: '-23%', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80' },
  { id: 9, name: 'Portativ bluetooth karnay', category: 'Elektronika', price: 239000, oldPrice: 299000, rating: '4.8', reviews: 74, badge: '-20%', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80' },
  { id: 10, name: 'Qo‘l mehnatida tayyorlangan keramika vaza', category: 'Uy uchun', price: 149000, oldPrice: 189000, rating: '4.9', reviews: 31, badge: 'YANGI', image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=600&q=80' },
  { id: 11, name: 'Quyoshdan himoyalovchi ko‘zoynak', category: 'Kiyim', price: 159000, oldPrice: 219000, rating: '4.6', reviews: 42, badge: '-27%', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80' },
  { id: 12, name: 'Mashg‘ulotlar uchun yoga mat', category: 'Sport', price: 189000, oldPrice: 249000, rating: '4.8', reviews: 55, badge: '-24%', image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=600&q=80' }
];

const state = {
  category: 'Hammasi',
  query: '',
  favoritesOnly: false,
  favorites: new Set(),
  cart: new Map(),
  visibleCount: 8,
  sort: 'popular'
};

const productGrid = document.querySelector('#productGrid');
const searchInput = document.querySelector('#searchInput');
const productsTitle = document.querySelector('#productsTitle');
const activeFilter = document.querySelector('#activeFilter');
const emptyState = document.querySelector('#emptyState');
const loadMoreButton = document.querySelector('#loadMore');
const numberFormat = new Intl.NumberFormat('uz-UZ');
let toastTimeout;

function formatPrice(price) {
  return `${numberFormat.format(price)} so‘m`;
}

function getVisibleProducts() {
  const query = state.query.trim().toLocaleLowerCase('uz');
  let result = products.filter((product) => {
    const matchesCategory = state.category === 'Hammasi' || product.category === state.category;
    const matchesQuery = !query || `${product.name} ${product.category}`.toLocaleLowerCase('uz').includes(query);
    const matchesFavorite = !state.favoritesOnly || state.favorites.has(product.id);
    return matchesCategory && matchesQuery && matchesFavorite;
  });

  if (state.sort === 'price-low') result = result.slice().sort((a, b) => a.price - b.price);
  if (state.sort === 'price-high') result = result.slice().sort((a, b) => b.price - a.price);
  return result;
}

function renderProducts() {
  const filtered = getVisibleProducts();
  const visible = filtered.slice(0, state.visibleCount);

  productGrid.innerHTML = visible.map((product) => `
    <article class="product-card">
      <div class="product-image-wrap">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <span class="product-badge ${product.badge === 'TOP' ? 'green' : ''}">${product.badge}</span>
        <button class="favorite-button ${state.favorites.has(product.id) ? 'selected' : ''}" type="button" data-favorite="${product.id}" aria-label="${state.favorites.has(product.id) ? 'Sevimlilardan olib tashlash' : 'Sevimlilarga qo‘shish'}" aria-pressed="${state.favorites.has(product.id)}">♡</button>
      </div>
      <div class="product-details">
        <span class="product-category">${product.category}</span>
        <p class="product-name">${product.name}</p>
        <div class="product-rating"><span class="star">★</span><strong>${product.rating}</strong><span>(${product.reviews} sharh)</span></div>
        <div class="product-prices"><span class="current-price">${numberFormat.format(product.price)}<small>so‘m</small></span><span class="old-price">${numberFormat.format(product.oldPrice)}</span></div>
        <button class="product-buy" type="button" data-add="${product.id}">Savatchaga <span>+</span></button>
      </div>
    </article>
  `).join('');

  const title = state.favoritesOnly
    ? 'Sevimli mahsulotlar'
    : state.category === 'Hammasi' ? 'Ommabop mahsulotlar' : state.category;
  productsTitle.innerHTML = `${title}${state.query ? `: “${state.query.replace(/[<>]/g, '')}”` : ''} <span class="title-spark">✦</span>`;
  const hasFilter = state.category !== 'Hammasi' || state.favoritesOnly || Boolean(state.query);
  activeFilter.hidden = !hasFilter;
  activeFilter.innerHTML = hasFilter
    ? `<span>${filtered.length} ta mahsulot</span><button type="button" id="resetFilters">Filtrlarni tozalash ×</button>`
    : '';
  emptyState.hidden = filtered.length !== 0;
  loadMoreButton.hidden = filtered.length <= state.visibleCount;
}

function updateCart() {
  const cartCount = [...state.cart.values()].reduce((sum, item) => sum + item.quantity, 0);
  document.querySelector('#cartCount').textContent = cartCount;
  document.querySelector('#drawerCount').textContent = `(${cartCount})`;

  const cartItems = document.querySelector('#cartItems');
  const isEmpty = state.cart.size === 0;
  document.querySelector('#cartEmpty').classList.toggle('visible', isEmpty);
  document.querySelector('#cartSummary').classList.toggle('visible', !isEmpty);
  cartItems.innerHTML = [...state.cart.values()].map(({ product, quantity }) => `
    <article class="cart-item">
      <img src="${product.image}" alt="${product.name}">
      <div>
        <p class="cart-item-name">${product.name}</p>
        <span class="cart-item-price">${formatPrice(product.price)}</span>
        <div class="quantity-control">
          <button type="button" data-quantity="${product.id}" data-change="-1" aria-label="Kamaytirish">−</button>
          <span>${quantity}</span>
          <button type="button" data-quantity="${product.id}" data-change="1" aria-label="Ko‘paytirish">+</button>
        </div>
      </div>
      <button class="remove-item" type="button" data-remove="${product.id}" aria-label="Mahsulotni o‘chirish">×</button>
    </article>
  `).join('');

  const total = [...state.cart.values()].reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  document.querySelector('#cartTotal').textContent = formatPrice(total);
}

function showToast(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove('show'), 2400);
}

function setCategory(category) {
  state.category = category;
  state.favoritesOnly = false;
  state.visibleCount = 8;
  document.querySelectorAll('.nav-category').forEach((button) => {
    button.classList.toggle('active', button.dataset.category === category);
  });
  document.querySelector('#favoritesShortcut').classList.remove('is-active');
  renderProducts();
  document.querySelector('#products').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function openCart() {
  document.querySelector('#cartDrawer').classList.add('open');
  document.querySelector('#cartDrawer').setAttribute('aria-hidden', 'false');
  document.querySelector('#overlay').classList.add('open');
  document.body.classList.add('drawer-open');
  document.querySelector('#closeCart').focus();
}

function closeCart() {
  document.querySelector('#cartDrawer').classList.remove('open');
  document.querySelector('#cartDrawer').setAttribute('aria-hidden', 'true');
  document.querySelector('#overlay').classList.remove('open');
  document.body.classList.remove('drawer-open');
}

document.querySelector('#searchForm').addEventListener('submit', (event) => {
  event.preventDefault();
  state.query = searchInput.value;
  state.visibleCount = 8;
  renderProducts();
  document.querySelector('#products').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

searchInput.addEventListener('input', () => {
  state.query = searchInput.value;
  state.visibleCount = 8;
  renderProducts();
});

document.querySelector('#categoryNav').addEventListener('click', (event) => {
  const button = event.target.closest('[data-category]');
  if (button) setCategory(button.dataset.category);
});

document.querySelectorAll('[data-pick-category]').forEach((button) => {
  button.addEventListener('click', () => setCategory(button.dataset.pickCategory));
});

productGrid.addEventListener('click', (event) => {
  const favoriteButton = event.target.closest('[data-favorite]');
  if (favoriteButton) {
    const id = Number(favoriteButton.dataset.favorite);
    if (state.favorites.has(id)) state.favorites.delete(id);
    else state.favorites.add(id);
    renderProducts();
    return;
  }

  const addButton = event.target.closest('[data-add]');
  if (addButton) {
    const product = products.find((item) => item.id === Number(addButton.dataset.add));
    if (!product) return;
    const existing = state.cart.get(product.id);
    state.cart.set(product.id, { product, quantity: existing ? existing.quantity + 1 : 1 });
    updateCart();
    showToast('Mahsulot savatchaga qo‘shildi');
  }
});

activeFilter.addEventListener('click', (event) => {
  if (!event.target.closest('#resetFilters')) return;
  state.category = 'Hammasi';
  state.query = '';
  state.favoritesOnly = false;
  state.visibleCount = 8;
  searchInput.value = '';
  document.querySelectorAll('.nav-category').forEach((button) => {
    button.classList.toggle('active', button.dataset.category === 'Hammasi');
  });
  document.querySelector('#favoritesShortcut').classList.remove('is-active');
  renderProducts();
});

document.querySelector('#sortSelect').addEventListener('change', (event) => {
  state.sort = event.target.value;
  renderProducts();
});

loadMoreButton.addEventListener('click', () => {
  state.visibleCount += 4;
  renderProducts();
});

document.querySelector('#clearSearch').addEventListener('click', () => {
  state.query = '';
  state.category = 'Hammasi';
  state.favoritesOnly = false;
  state.visibleCount = 8;
  searchInput.value = '';
  document.querySelectorAll('.nav-category').forEach((button) => {
    button.classList.toggle('active', button.dataset.category === 'Hammasi');
  });
  document.querySelector('#favoritesShortcut').classList.remove('is-active');
  renderProducts();
});

document.querySelector('#favoritesShortcut').addEventListener('click', (event) => {
  state.favoritesOnly = !state.favoritesOnly;
  state.category = 'Hammasi';
  state.query = '';
  searchInput.value = '';
  state.visibleCount = 8;
  event.currentTarget.classList.toggle('is-active', state.favoritesOnly);
  document.querySelectorAll('.nav-category').forEach((button) => {
    button.classList.toggle('active', button.dataset.category === 'Hammasi');
  });
  renderProducts();
  document.querySelector('#products').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.querySelector('#catalogButton').addEventListener('click', () => {
  document.querySelector('#categories').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.querySelector('#cartButton').addEventListener('click', openCart);
document.querySelector('#closeCart').addEventListener('click', closeCart);
document.querySelector('#overlay').addEventListener('click', closeCart);
document.querySelector('#continueShopping').addEventListener('click', closeCart);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeCart();
});

document.querySelector('#cartItems').addEventListener('click', (event) => {
  const quantityButton = event.target.closest('[data-quantity]');
  const removeButton = event.target.closest('[data-remove]');

  if (removeButton) {
    state.cart.delete(Number(removeButton.dataset.remove));
    updateCart();
    return;
  }

  if (quantityButton) {
    const id = Number(quantityButton.dataset.quantity);
    const item = state.cart.get(id);
    if (!item) return;
    const quantity = item.quantity + Number(quantityButton.dataset.change);
    if (quantity <= 0) state.cart.delete(id);
    else state.cart.set(id, { ...item, quantity });
    updateCart();
  }
});

document.querySelector('#checkoutButton').addEventListener('click', () => {
  showToast('Buyurtma rasmiylashtirish tez orada ishga tushadi');
});

renderProducts();
updateCart();