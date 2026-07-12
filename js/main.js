/* ========================================
   নূরুল ইলম শপ - Main JavaScript
   (সব পেজে শেয়ার্ড লজিক — cart, wishlist,
    product rendering, auth, toast, search)
   ======================================== */

// ---- Path helper (root vs /pages/ থেকে কল হলে path আলাদা হয়) ----
function basePath() {
  return location.pathname.includes('/pages/') ? '../' : '';
}

function productUrl(id) {
  return basePath() + 'pages/product-detail.html?id=' + encodeURIComponent(id);
}

function money(n) {
  return '৳ ' + Number(n || 0).toLocaleString('bn-BD');
}

// ---- Cart ----
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

function addToCart(id, name, price, emoji, qty) {
  qty = qty || 1;
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id, name, price, emoji, qty });
  }
  saveCart();
  showToast('✅ কার্টে যোগ হয়েছে: ' + name);
  if (document.getElementById('cart-items')) renderCartPage();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  if (document.getElementById('cart-items')) renderCartPage();
}

function updateQty(id, qty) {
  qty = parseInt(qty, 10);
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty = isNaN(qty) || qty < 1 ? 1 : qty;
    saveCart();
    if (document.getElementById('cart-items')) renderCartPage();
  }
}

function cartTotal() {
  return cart.reduce((s, i) => s + i.price * i.qty, 0);
}

// ---- Wishlist ----
let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

function saveWishlist() {
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function toggleWishlist(id, name) {
  const idx = wishlist.indexOf(id);
  if (idx === -1) {
    wishlist.push(id);
    showToast('❤️ উইশলিস্টে যোগ হয়েছে: ' + name);
  } else {
    wishlist.splice(idx, 1);
    showToast('💔 উইশলিস্ট থেকে সরানো হয়েছে');
  }
  saveWishlist();
  updateWishlistBtns();
  if (document.getElementById('wishlist-items')) renderWishlistPage();
}

function updateWishlistBtns() {
  document.querySelectorAll('[data-wishlist-id]').forEach(btn => {
    const id = btn.dataset.wishlistId;
    btn.textContent = wishlist.includes(id) ? '❤️' : '🤍';
  });
}

// ---- Toast ----
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ---- Search ----
function doSearch() {
  const q = document.querySelector('.header-search input')?.value?.trim();
  if (q) window.location.href = basePath() + 'pages/products.html?q=' + encodeURIComponent(q);
}

// ---- Product helpers (shared across pages) ----
function getProductById(id) {
  return (typeof PRODUCTS !== 'undefined') ? PRODUCTS.find(p => p.id === id) : null;
}

function productCardHTML(p) {
  return `
    <a href="${productUrl(p.id)}" class="prod-card">
      <div class="prod-img-box">
        <span>${p.emoji}</span>
        ${p.badge ? `<span class="prod-badge badge-${p.badgeType}">${p.badge}</span>` : ''}
        <button class="wishlist-btn" data-wishlist-id="${p.id}"
          onclick="event.preventDefault(); toggleWishlist('${p.id}','${p.name}')">${wishlist.includes(p.id) ? '❤️' : '🤍'}</button>
      </div>
      <div class="prod-info">
        <div class="prod-name">${p.name}</div>
        ${p.author ? `<div class="prod-author">${p.author}</div>` : ''}
        <div class="prod-price-row">
          <span class="prod-price">${money(p.price)}</span>
          ${p.oldPrice ? `<span class="prod-old-price">${money(p.oldPrice)}</span>` : ''}
          ${p.oldPrice ? `<span class="prod-discount">${Math.round((1 - p.price / p.oldPrice) * 100)}% ছাড়</span>` : ''}
        </div>
        <button class="add-cart-btn"
          onclick="event.preventDefault(); addToCart('${p.id}','${p.name}',${p.price},'${p.emoji}')">
          🛒 কার্টে যোগ করুন
        </button>
      </div>
    </a>
  `;
}

function renderProducts(containerId, items) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (!items.length) {
    el.innerHTML = `<div class="empty-state">😔 কোনো পণ্য পাওয়া যায়নি</div>`;
    return;
  }
  el.innerHTML = items.map(productCardHTML).join('');
  updateWishlistBtns();
}

// ---- Cart page rendering ----
function renderCartPage() {
  const wrap = document.getElementById('cart-items');
  const emptyEl = document.getElementById('cart-empty');
  const summaryEl = document.getElementById('cart-summary');
  if (!wrap) return;

  if (!cart.length) {
    wrap.innerHTML = '';
    if (emptyEl) emptyEl.style.display = 'flex';
    if (summaryEl) summaryEl.style.display = 'none';
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';
  if (summaryEl) summaryEl.style.display = 'block';

  wrap.innerHTML = cart.map(item => `
    <div class="cart-row" data-id="${item.id}">
      <div class="cart-row-thumb">${item.emoji}</div>
      <div class="cart-row-info">
        <div class="cart-row-name">${item.name}</div>
        <div class="cart-row-price">${money(item.price)}</div>
      </div>
      <div class="qty-box">
        <button onclick="updateQty('${item.id}', ${item.qty - 1})">−</button>
        <input type="number" min="1" value="${item.qty}"
          onchange="updateQty('${item.id}', this.value)" />
        <button onclick="updateQty('${item.id}', ${item.qty + 1})">+</button>
      </div>
      <div class="cart-row-total">${money(item.price * item.qty)}</div>
      <button class="cart-row-remove" onclick="removeFromCart('${item.id}')" title="মুছে ফেলুন">🗑️</button>
    </div>
  `).join('');

  const subtotal = cartTotal();
  const deliveryFee = subtotal === 0 || subtotal >= 500 ? 0 : 60;
  const total = subtotal + deliveryFee;

  document.getElementById('cart-subtotal').textContent = money(subtotal);
  document.getElementById('cart-delivery').textContent = deliveryFee === 0 ? 'ফ্রি' : money(deliveryFee);
  document.getElementById('cart-total').textContent = money(total);
}

// ---- Wishlist page rendering ----
function renderWishlistPage() {
  const wrap = document.getElementById('wishlist-items');
  const emptyEl = document.getElementById('wishlist-empty');
  if (!wrap || typeof PRODUCTS === 'undefined') return;

  const items = PRODUCTS.filter(p => wishlist.includes(p.id));

  if (!items.length) {
    wrap.innerHTML = '';
    if (emptyEl) emptyEl.style.display = 'flex';
    return;
  }
  if (emptyEl) emptyEl.style.display = 'none';
  wrap.innerHTML = items.map(productCardHTML).join('');
  updateWishlistBtns();
}

// ---- Simple auth (demo only — localStorage ভিত্তিক, প্রকৃত ব্যাকএন্ড নয়) ----
function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]');
}
function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}
function currentUser() {
  return JSON.parse(localStorage.getItem('currentUser') || 'null');
}
function registerUser(name, phone, password) {
  const users = getUsers();
  if (users.find(u => u.phone === phone)) {
    return { ok: false, msg: 'এই ফোন নাম্বার দিয়ে আগেই একাউন্ট আছে' };
  }
  users.push({ name, phone, password });
  saveUsers(users);
  localStorage.setItem('currentUser', JSON.stringify({ name, phone }));
  return { ok: true };
}
function loginUser(phone, password) {
  const users = getUsers();
  const u = users.find(x => x.phone === phone && x.password === password);
  if (!u) return { ok: false, msg: 'ফোন নাম্বার অথবা পাসওয়ার্ড ভুল' };
  localStorage.setItem('currentUser', JSON.stringify({ name: u.name, phone: u.phone }));
  return { ok: true };
}
function logoutUser() {
  localStorage.removeItem('currentUser');
  window.location.href = basePath() + 'index.html';
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  updateWishlistBtns();

  // Search on Enter
  document.querySelector('.header-search input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') doSearch();
  });
  document.querySelector('.header-search button')?.addEventListener('click', doSearch);

  // Login/logout state in header
  const loginBtn = document.getElementById('login-header-btn');
  if (loginBtn) {
    const user = currentUser();
    if (user) {
      loginBtn.querySelector('.icon').textContent = '👤';
      loginBtn.querySelector('span:last-child').textContent = user.name.split(' ')[0];
      loginBtn.setAttribute('href', basePath() + 'pages/orders.html');
    }
  }
});
