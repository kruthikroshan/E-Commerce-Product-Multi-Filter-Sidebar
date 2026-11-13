'use strict';

const express = require('express');
const inventory = require('../data/products');
const { queryProducts, getMeta, SORT_OPTIONS } = require('../services/filterService');

const router = express.Router();
const VALID_SORTS = new Set(SORT_OPTIONS.map((o) => o.value));

/** Parse a numeric query param. Empty/missing -> null. Invalid -> throws. */
function parseNumber(raw, name) {
  if (raw === undefined || raw === '') return null;
  const n = Number(raw);
  if (!Number.isFinite(n)) throw new Error(`"${name}" must be a number`);
  return n;
}

/** Validate + normalise query string into criteria. */
function parseCriteria(q) {
  const categories = (q.categories || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const minPrice = parseNumber(q.minPrice, 'minPrice');
  const maxPrice = parseNumber(q.maxPrice, 'maxPrice');
  const minRating = parseNumber(q.minRating, 'minRating');

  if (minPrice !== null && minPrice < 0) throw new Error('"minPrice" cannot be negative');
  if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
    throw new Error('"minPrice" cannot be greater than "maxPrice"');
  }
  if (minRating !== null && (minRating < 0 || minRating > 5)) {
    throw new Error('"minRating" must be between 0 and 5');
  }

  const sort = q.sort || 'relevance';
  if (!VALID_SORTS.has(sort)) throw new Error(`"sort" must be one of: ${[...VALID_SORTS].join(', ')}`);

  return { criteria: { categories, minPrice, maxPrice, minRating }, sort };
}

// GET /api/meta  -> data needed to build the sidebar controls
router.get('/meta', (_req, res) => res.json(getMeta(inventory)));

// GET /api/products?categories=Electronics,Apparel&minPrice=500&maxPrice=5000&minRating=4&sort=price-asc
router.get('/products', (req, res) => {
  let parsed;
  try {
    parsed = parseCriteria(req.query);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
  const items = queryProducts(inventory, parsed.criteria, parsed.sort).map((p) => ({
    ...p,
    image: p.image || `/api/images/${p.id}.svg`,
  }));
  res.json({ count: items.length, total: inventory.length, items });
});

// POST /api/products -> add new item to inventory with server-side validation
router.post('/products', (req, res) => {
  const { name, category, price, rating, emoji, reviews, image, productUrl } = req.body || {};

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: '"name" is required and must be a non-empty string' });
  }
  if (!category || typeof category !== 'string' || !category.trim()) {
    return res.status(400).json({ error: '"category" is required and must be a non-empty string' });
  }
  const numPrice = Number(price);
  if (!Number.isFinite(numPrice) || numPrice <= 0) {
    return res.status(400).json({ error: '"price" must be a positive number' });
  }
  const numRating = Number(rating);
  if (!Number.isFinite(numRating) || numRating < 1 || numRating > 5) {
    return res.status(400).json({ error: '"rating" must be between 1 and 5' });
  }

  const cleanName = name.trim();
  const cleanCategory = category.trim();
  const numReviews = Number.isInteger(Number(reviews)) && Number(reviews) >= 0 ? Number(reviews) : Math.floor(Math.random() * 80) + 10;
  const cleanEmoji = emoji && typeof emoji === 'string' && emoji.trim()
    ? emoji.trim()
    : (cleanCategory.toLowerCase() === 'electronics' ? '📱' : cleanCategory.toLowerCase() === 'footwear' ? '👟' : '👕');

  const cleanImage = typeof image === 'string' && image.trim() ? image.trim() : null;
  const cleanProductUrl = typeof productUrl === 'string' && productUrl.trim() ? productUrl.trim() : null;

  const maxId = inventory.reduce((max, p) => Math.max(max, p.id), 0);
  const hue = Math.floor(Math.random() * 360);

  const newProduct = {
    id: maxId + 1,
    name: cleanName,
    category: cleanCategory,
    price: Math.round(numPrice),
    rating: Number(numRating.toFixed(1)),
    reviews: numReviews,
    emoji: cleanEmoji,
    hue,
    image: cleanImage,
    productUrl: cleanProductUrl,
  };

  inventory.push(newProduct);

  res.status(201).json({
    message: 'Product created successfully',
    product: {
      ...newProduct,
      image: newProduct.image || `/api/images/${newProduct.id}.svg`,
    },
  });
});

// GET /api/images/:id.svg  -> generated thumbnail (no external image hosting needed)
router.get('/images/:id.svg', (req, res) => {
  const p = inventory.find((x) => x.id === Number(req.params.id));
  if (!p) return res.status(404).end();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="hsl(${p.hue},70%,92%)"/><stop offset="1" stop-color="hsl(${p.hue},60%,80%)"/></linearGradient></defs>
<rect width="300" height="300" fill="url(#g)"/>
<text x="150" y="150" font-size="110" text-anchor="middle" dominant-baseline="central">${p.emoji}</text></svg>`;
  res.type('image/svg+xml').set('Cache-Control', 'public, max-age=86400').send(svg);
});

module.exports = router;
