'use strict';

/**
 * Core business logic. Pure functions only – no Express, no I/O – so they are
 * easy to unit test and reason about.
 *
 * Pipeline:  FILTER (original dataset)  ->  SORT (copy of filtered result)
 */

const SORTERS = {
  relevance: null, // keep original catalogue order
  'price-asc': (a, b) => a.price - b.price || a.id - b.id,
  'price-desc': (a, b) => b.price - a.price || a.id - b.id,
  'rating-desc': (a, b) => b.rating - a.rating || b.reviews - a.reviews || a.id - b.id,
  'name-asc': (a, b) => a.name.localeCompare(b.name),
};

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Top Rated First' },
  { value: 'name-asc', label: 'Name: A to Z' },
];

const isNil = (v) => v === undefined || v === null;

/**
 * Combinatorial intersect filter (AND across all three criteria).
 * Graceful null handling: any criterion that is missing/empty is bypassed,
 * so with no active filters the full inventory is returned.
 *
 * @param {Array}  inventory
 * @param {{categories?: string[]|null, minPrice?: number|null,
 *          maxPrice?: number|null, minRating?: number|null}} criteria
 */
function filterProducts(inventory, criteria = {}) {
  const { categories, minPrice, maxPrice, minRating } = criteria || {};

  const hasCategories = Array.isArray(categories) && categories.length > 0;
  const hasMin = !isNil(minPrice);
  const hasMax = !isNil(maxPrice);
  const hasRating = !isNil(minRating) && minRating > 0;

  // Nothing active -> bypass data reduction entirely.
  if (!hasCategories && !hasMin && !hasMax && !hasRating) return inventory.slice();

  const catSet = hasCategories ? new Set(categories.map((c) => c.toLowerCase())) : null;
  const result = [];

  for (const p of inventory) {
    if (catSet && !catSet.has(p.category.toLowerCase())) continue;
    if (hasMin && p.price < minPrice) continue;
    if (hasMax && p.price > maxPrice) continue;
    if (hasRating && p.rating < minRating) continue;
    result.push(p);
  }
  return result;
}

/** Returns a NEW sorted array; never mutates its input. Unknown key -> original order. */
function sortProducts(list, sortKey) {
  const cmp = SORTERS[sortKey];
  return cmp ? list.slice().sort(cmp) : list.slice();
}

/** Full pipeline: filter the original dataset first, then sort what remains. */
function queryProducts(inventory, criteria, sortKey) {
  return sortProducts(filterProducts(inventory, criteria), sortKey);
}

/** Static facts the UI needs to render its controls. */
function getMeta(inventory) {
  const prices = inventory.map((p) => p.price);
  const counts = {};
  for (const p of inventory) counts[p.category] = (counts[p.category] || 0) + 1;
  return {
    categories: Object.keys(counts).sort().map((name) => ({ name, count: counts[name] })),
    priceMin: Math.min(...prices),
    priceMax: Math.max(...prices),
    ratingOptions: [1, 2, 3, 4, 5],
    sortOptions: SORT_OPTIONS,
    total: inventory.length,
  };
}

module.exports = { filterProducts, sortProducts, queryProducts, getMeta, SORT_OPTIONS };
