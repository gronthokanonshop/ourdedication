/* ========================================
   নূরুল ইলম শপ - Main JavaScript
   ======================================== */

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

function addToCart(id, name, price, emoji) {
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, emoji, qty: 1 });
  }
  saveCart();
  showToast('✅ কার্টে যোগ হয়েছে: ' + name);
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
}

function updateQty(id, qty) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty = Math.max(1, qty);
    saveCart();
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
  if (q) window.location.href = 'pages/products.html?q=' + encodeURIComponent(q);
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
});