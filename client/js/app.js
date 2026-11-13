import { fetchMeta, fetchProducts, createProduct } from './api.js';

const $ = (id) => document.getElementById(id);
const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
};
const money = (n) => '₹' + Number(n).toLocaleString('en-IN');
const GAP = 0; // allow min == max

let meta;
const state = { categories: new Set(), minPrice: 0, maxPrice: 0, minRating: 0, sort: 'relevance' };
let controller = null; // cancels stale requests so fast slider drags never show old results
let toastTimer = null;

function showToast(message) {
  const toast = $('toast');
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 3500);
}

function starsEl(rating) {
  const full = Math.round(rating);
  const s = el('span', 'stars');
  s.setAttribute('aria-label', `${rating} out of 5 stars`);
  s.append('★'.repeat(full));
  const off = el('span', 'off', '★'.repeat(5 - full));
  s.append(off);
  return s;
}

/* ---------------- dashboard stats update ---------------- */
function updateDashboardStats(matchCount = 0) {
  if (!meta) return;
  $('statTotal').textContent = `${meta.total} Items`;
  $('statMatches').textContent = `${matchCount} Active`;
  $('statPriceRange').textContent = `${money(meta.priceMin)} – ${money(meta.priceMax)}`;
  $('statRating').textContent = `${meta.avgRating ? meta.avgRating.toFixed(1) : '4.2'} ★`;
}

/* ---------------- active filter chips ---------------- */
function renderActiveChips() {
  const box = $('activeChips');
  box.replaceChildren();

  const isCustomPrice = (state.minPrice > meta.priceMin) || (state.maxPrice < meta.priceMax);
  const hasFilters = state.categories.size > 0 || isCustomPrice || state.minRating > 0;

  if (!hasFilters) {
    box.hidden = true;
    return;
  }
  box.hidden = false;

  box.append(el('span', 'chip-label', 'Active Filters:'));

  for (const cat of state.categories) {
    const chip = el('span', 'chip', cat);
    const del = el('button', '', '✕');
    del.title = `Remove ${cat} filter`;
    del.addEventListener('click', () => {
      state.categories.delete(cat);
      buildCategories();
      refresh();
    });
    chip.append(del);
    box.append(chip);
  }

  if (isCustomPrice) {
    const chip = el('span', 'chip', `${money(state.minPrice)} – ${money(state.maxPrice)}`);
    const del = el('button', '', '✕');
    del.title = 'Reset price range';
    del.addEventListener('click', () => {
      state.minPrice = meta.priceMin;
      state.maxPrice = meta.priceMax;
      syncPriceUI();
      refresh();
    });
    chip.append(del);
    box.append(chip);
  }

  if (state.minRating > 0) {
    const chip = el('span', 'chip', `${state.minRating}★ & up`);
    const del = el('button', '', '✕');
    del.title = 'Clear rating filter';
    del.addEventListener('click', () => {
      state.minRating = 0;
      buildRatings();
      refresh();
    });
    chip.append(del);
    box.append(chip);
  }

  const clearAll = el('button', 'link-btn', 'Clear all');
  clearAll.style.fontSize = '0.8rem';
  clearAll.addEventListener('click', resetFilters);
  box.append(clearAll);
}

/* ---------------- sidebar construction ---------------- */
function buildCategories() {
  const box = $('categoryList');
  box.replaceChildren();
  for (const c of meta.categories) {
    const label = el('label', 'opt');
    const cb = el('input');
    cb.type = 'checkbox';
    cb.value = c.name;
    cb.checked = state.categories.has(c.name);
    cb.addEventListener('change', () => {
      cb.checked ? state.categories.add(c.name) : state.categories.delete(c.name);
      refresh();
    });
    label.append(cb, el('span', '', c.name), el('span', 'n', c.count));
    box.append(label);
  }
}

function buildRatings() {
  const box = $('ratingList');
  box.replaceChildren();
  const add = (value, content) => {
    const label = el('label', 'opt');
    const r = el('input');
    r.type = 'radio';
    r.name = 'rating';
    r.value = value;
    r.checked = state.minRating === value;
    r.addEventListener('change', () => {
      state.minRating = value;
      refresh();
    });
    label.append(r, content);
    box.append(label);
  };

  add(0, el('span', '', 'Any rating'));
  for (const n of meta.ratingOptions) {
    const wrap = el('span', 'stars');
    wrap.append('★'.repeat(n));
    wrap.append(el('span', 'off', '★'.repeat(5 - n)));
    const txt = el('span', '', n === 5 ? ' only' : ' & up');
    txt.style.color = 'var(--muted)';
    const holder = el('span');
    holder.style.display = 'flex';
    holder.style.gap = '6px';
    holder.append(wrap, txt);
    add(n, holder);
  }
}

function syncPriceUI() {
  const min = $('minPrice'), max = $('maxPrice');
  min.value = state.minPrice;
  max.value = state.maxPrice;
  $('minOut').textContent = money(state.minPrice);
  $('maxOut').textContent = money(state.maxPrice);
  const span = meta.priceMax - meta.priceMin || 1;
  $('rangeFill').style.left = ((state.minPrice - meta.priceMin) / span) * 100 + '%';
  $('rangeFill').style.right = (100 - ((state.maxPrice - meta.priceMin) / span) * 100) + '%';
}

function setupPriceSlider() {
  const min = $('minPrice'), max = $('maxPrice');
  for (const i of [min, max]) {
    i.min = meta.priceMin;
    i.max = meta.priceMax;
    i.step = 50;
  }
  min.addEventListener('input', () => {
    state.minPrice = Math.min(Number(min.value), state.maxPrice - GAP);
    syncPriceUI();
    refresh();
  });
  max.addEventListener('input', () => {
    state.maxPrice = Math.max(Number(max.value), state.minPrice + GAP);
    syncPriceUI();
    refresh();
  });
}

function setupSort() {
  const sel = $('sortSelect');
  sel.replaceChildren();
  for (const o of meta.sortOptions) sel.append(new Option(o.label, o.value));
  sel.value = state.sort;
  sel.addEventListener('change', () => {
    state.sort = sel.value;
    refresh();
  });
}

/* ---------------- grid rendering ---------------- */
function card(p) {
  const c = el('article', 'card');

  const thumbWrap = el('div', 'card-thumb-wrap');
  const img = el('img');
  img.src = p.image;
  img.alt = p.name;
  img.loading = 'lazy';
  img.onerror = () => { img.src = `/api/images/${p.id}.svg`; };
  thumbWrap.append(img);

  const catBadge = el('span', 'card-badge', p.category);
  thumbWrap.append(catBadge);

  if (p.rating >= 4.5) {
    const topTag = el('span', 'top-rated-tag', '★ Top Rated');
    thumbWrap.append(topTag);
  }

  const body = el('div', 'card-body');
  const rating = el('div', 'card-rating');
  const ratingScore = el('strong', '', p.rating.toFixed(1));
  rating.append(starsEl(p.rating), ratingScore, `(${p.reviews})`);

  const priceRow = el('div', 'card-price');
  priceRow.append(money(p.price), el('span', 'in-stock-pill', 'In Stock'));

  const nameEl = p.productUrl
    ? el('a', 'card-name', p.name)
    : el('h3', 'card-name', p.name);

  if (p.productUrl) {
    nameEl.href = p.productUrl;
    nameEl.target = '_blank';
    nameEl.rel = 'noopener noreferrer';
  }

  body.append(
    nameEl,
    el('span', 'card-cat', p.category),
    rating,
    priceRow
  );

  if (p.productUrl) {
    const visitLink = el('a', 'card-link-btn', 'Visit Store ↗');
    visitLink.href = p.productUrl;
    visitLink.target = '_blank';
    visitLink.rel = 'noopener noreferrer';
    body.append(visitLink);
  }

  c.append(thumbWrap, body);
  return c;
}

function render(data) {
  const grid = $('grid'), empty = $('empty');
  $('resultCount').textContent = `Showing ${data.count} of ${data.total} products`;
  updateDashboardStats(data.count);
  renderActiveChips();

  if (data.count === 0) {
    grid.replaceChildren();
    grid.hidden = true;
    empty.hidden = false;
    return;
  }
  empty.hidden = true;
  grid.hidden = false;
  grid.replaceChildren(...data.items.map(card));
}

async function refresh() {
  controller?.abort();
  controller = new AbortController();
  try {
    render(await fetchProducts(state, controller.signal));
  } catch (err) {
    if (err.name !== 'AbortError') $('resultCount').textContent = err.message;
  }
}

function resetFilters() {
  state.categories.clear();
  state.minPrice = meta.priceMin;
  state.maxPrice = meta.priceMax;
  state.minRating = 0;
  buildCategories();
  buildRatings();
  syncPriceUI();
  refresh();
}

/* ---------------- modal & add product ---------------- */
function setupAddProductModal() {
  const modal = $('addModal');
  const openBtn = $('openAddModalBtn');
  const closeBtn = $('closeModalBtn');
  const cancelBtn = $('cancelModalBtn');
  const form = $('addProductForm');
  const errorBox = $('formError');
  const emojiPicker = $('emojiPicker');
  const emojiInput = $('prodEmoji');
  const fileInput = $('prodFileInput');
  const urlInput = $('prodImageUrl');
  const linkInput = $('prodLink');
  const previewAvatar = $('previewAvatar');
  const mediaTabs = $('mediaTabs');
  const panelUpload = $('panelUpload');
  const panelUrl = $('panelUrl');
  const panelEmoji = $('panelEmoji');

  let activeMediaMode = 'emoji'; // 'upload' | 'url' | 'emoji'
  let uploadedDataUrl = null;

  function updatePreview() {
    previewAvatar.replaceChildren();
    if (activeMediaMode === 'upload' && uploadedDataUrl) {
      const img = el('img');
      img.src = uploadedDataUrl;
      previewAvatar.append(img);
    } else if (activeMediaMode === 'url' && urlInput.value.trim()) {
      const img = el('img');
      img.src = urlInput.value.trim();
      img.onerror = () => { previewAvatar.textContent = emojiInput.value || '📷'; };
      previewAvatar.append(img);
    } else {
      previewAvatar.textContent = emojiInput.value || '🎧';
    }
  }

  function setMediaTab(mode) {
    activeMediaMode = mode;
    mediaTabs.querySelectorAll('.media-tab').forEach((t) => {
      t.classList.toggle('active', t.dataset.tab === mode);
    });
    panelUpload.hidden = mode !== 'upload';
    panelUrl.hidden = mode !== 'url';
    panelEmoji.hidden = mode !== 'emoji';
    updatePreview();
  }

  mediaTabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.media-tab');
    if (btn) setMediaTab(btn.dataset.tab);
  });

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        uploadedDataUrl = ev.target.result;
        updatePreview();
      };
      reader.readAsDataURL(file);
    }
  });

  urlInput.addEventListener('input', () => {
    if (activeMediaMode === 'url') updatePreview();
  });

  emojiPicker.addEventListener('click', (e) => {
    const btn = e.target.closest('.emoji-opt');
    if (!btn) return;
    emojiPicker.querySelectorAll('.emoji-opt').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    emojiInput.value = btn.dataset.emoji;
    updatePreview();
  });

  const openModal = () => {
    form.reset();
    errorBox.hidden = true;
    errorBox.textContent = '';
    uploadedDataUrl = null;
    $('prodRating').value = '4.5';
    $('prodReviews').value = '120';
    emojiInput.value = '🎧';
    emojiPicker.querySelectorAll('.emoji-opt').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.emoji === '🎧');
    });
    setMediaTab('emoji');
    modal.hidden = false;
    $('prodName').focus();
  };

  const closeModal = () => { modal.hidden = true; };

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBox.hidden = true;

    let finalImage = null;
    if (activeMediaMode === 'upload' && uploadedDataUrl) {
      finalImage = uploadedDataUrl;
    } else if (activeMediaMode === 'url' && urlInput.value.trim()) {
      finalImage = urlInput.value.trim();
    }

    const payload = {
      name: $('prodName').value.trim(),
      category: $('prodCategory').value.trim(),
      price: Number($('prodPrice').value),
      rating: Number($('prodRating').value),
      reviews: Number($('prodReviews').value) || 0,
      emoji: emojiInput.value,
      image: finalImage,
      productUrl: linkInput ? linkInput.value.trim() : null,
    };

    if (!payload.name) {
      errorBox.textContent = 'Please enter a product name.';
      errorBox.hidden = false;
      return;
    }
    if (!payload.price || payload.price <= 0) {
      errorBox.textContent = 'Please enter a valid positive price.';
      errorBox.hidden = false;
      return;
    }

    const submitBtn = $('submitProdBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Publishing...';

    try {
      await createProduct(payload);
      closeModal();
      showToast(`✓ Published "${payload.name}" to inventory!`);

      // Refresh metadata and recalculate bounds/categories
      meta = await fetchMeta();
      state.maxPrice = Math.max(state.maxPrice, meta.priceMax);
      buildCategories();
      setupPriceSlider();
      syncPriceUI();
      refresh();
    } catch (err) {
      errorBox.textContent = err.message || 'Failed to add product.';
      errorBox.hidden = false;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Publish Product';
    }
  });
}

/* ---------------- boot ---------------- */
(async function init() {
  try {
    meta = await fetchMeta();
  } catch (e) {
    $('resultCount').textContent = e.message;
    return;
  }
  state.minPrice = meta.priceMin;
  state.maxPrice = meta.priceMax;
  buildCategories();
  buildRatings();
  setupPriceSlider();
  setupSort();
  syncPriceUI();
  setupAddProductModal();

  $('resetBtn').addEventListener('click', resetFilters);
  $('emptyReset').addEventListener('click', resetFilters);

  refresh();
})();