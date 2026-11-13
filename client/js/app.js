import { fetchMeta, fetchProducts } from './api.js';

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

function starsEl(rating) {
  const full = Math.round(rating);
  const s = el('span', 'stars');
  s.setAttribute('aria-label', `${rating} out of 5 stars`);
  s.append('★'.repeat(full));
  const off = el('span', 'off', '★'.repeat(5 - full));
  s.append(off);
  return s;
}

/* ---------------- sidebar construction ---------------- */
function buildCategories() {
  const box = $('categoryList');
  box.replaceChildren();
  for (const c of meta.categories) {
    const label = el('label', 'opt');
    const cb = el('input');
    cb.type = 'checkbox'; cb.value = c.name;
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
    r.type = 'radio'; r.name = 'rating'; r.value = value;
    r.checked = state.minRating === value;
    r.addEventListener('change', () => { state.minRating = value; refresh(); });
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
    const holder = el('span'); holder.style.display = 'flex'; holder.style.gap = '6px';
    holder.append(wrap, txt);
    add(n, holder);
  }
}

function syncPriceUI() {
  const min = $('minPrice'), max = $('maxPrice');
  min.value = state.minPrice; max.value = state.maxPrice;
  $('minOut').textContent = money(state.minPrice);
  $('maxOut').textContent = money(state.maxPrice);
  const span = meta.priceMax - meta.priceMin || 1;
  $('rangeFill').style.left = ((state.minPrice - meta.priceMin) / span) * 100 + '%';
  $('rangeFill').style.right = (100 - ((state.maxPrice - meta.priceMin) / span) * 100) + '%';
}

function setupPriceSlider() {
  const min = $('minPrice'), max = $('maxPrice');
  for (const i of [min, max]) {
    i.min = meta.priceMin; i.max = meta.priceMax; i.step = 50;
  }
  min.addEventListener('input', () => {
    state.minPrice = Math.min(Number(min.value), state.maxPrice - GAP);
    syncPriceUI(); refresh();
  });
  max.addEventListener('input', () => {
    state.maxPrice = Math.max(Number(max.value), state.minPrice + GAP);
    syncPriceUI(); refresh();
  });
}

function setupSort() {
  const sel = $('sortSelect');
  for (const o of meta.sortOptions) sel.append(new Option(o.label, o.value));
  sel.addEventListener('change', () => { state.sort = sel.value; refresh(); });
}

/* ---------------- grid rendering ---------------- */
function card(p) {
  const c = el('article', 'card');
  const img = el('img'); img.src = p.image; img.alt = p.name; img.loading = 'lazy';
  const body = el('div', 'card-body');
  const rating = el('div', 'card-rating');
  rating.append(starsEl(p.rating), `${p.rating.toFixed(1)} (${p.reviews})`);
  body.append(el('h3', 'card-name', p.name), el('span', 'card-cat', p.category), rating, el('div', 'card-price', money(p.price)));
  c.append(img, body);
  return c;
}

function render(data) {
  const grid = $('grid'), empty = $('empty');
  $('resultCount').textContent = `Showing ${data.count} of ${data.total} products`;
  if (data.count === 0) {           // zero matches: grid disappears, empty state shows
    grid.replaceChildren(); grid.hidden = true; empty.hidden = false;
    return;
  }
  empty.hidden = true; grid.hidden = false;
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
  state.minPrice = meta.priceMin; state.maxPrice = meta.priceMax; state.minRating = 0;
  buildCategories(); buildRatings(); syncPriceUI();
  refresh(); // sort choice is intentionally kept
}

/* ---------------- boot ---------------- */
(async function init() {
  try {
    meta = await fetchMeta();
  } catch (e) {
    $('resultCount').textContent = e.message; return;
  }
  state.minPrice = meta.priceMin; state.maxPrice = meta.priceMax;
  buildCategories(); buildRatings(); setupPriceSlider(); setupSort(); syncPriceUI();
  $('resetBtn').addEventListener('click', resetFilters);
  $('emptyReset').addEventListener('click', resetFilters);
  refresh();
})();
