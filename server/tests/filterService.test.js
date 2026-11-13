'use strict';
const test = require('node:test');
const assert = require('node:assert');
const inventory = require('../data/products');
const { filterProducts, sortProducts, queryProducts } = require('../services/filterService');

test('no criteria returns the full inventory (null handling)', () => {
  assert.strictEqual(filterProducts(inventory, {}).length, inventory.length);
  assert.strictEqual(
    filterProducts(inventory, { categories: [], minPrice: null, maxPrice: null, minRating: null }).length,
    inventory.length
  );
  assert.strictEqual(filterProducts(inventory, undefined).length, inventory.length);
});

test('combines category, price and rating with AND', () => {
  const out = filterProducts(inventory, {
    categories: ['Electronics', 'Footwear'], minPrice: 1000, maxPrice: 5000, minRating: 4,
  });
  assert.ok(out.length > 0);
  for (const p of out) {
    assert.ok(['Electronics', 'Footwear'].includes(p.category));
    assert.ok(p.price >= 1000 && p.price <= 5000);
    assert.ok(p.rating >= 4);
  }
});

test('impossible combination yields empty array', () => {
  assert.deepStrictEqual(filterProducts(inventory, { categories: ['Apparel'], minPrice: 90000 }), []);
});

test('sorting does not mutate input and orders correctly', () => {
  const before = inventory.map((p) => p.id);
  const asc = sortProducts(inventory, 'price-asc');
  assert.deepStrictEqual(inventory.map((p) => p.id), before);
  for (let i = 1; i < asc.length; i++) assert.ok(asc[i - 1].price <= asc[i].price);
  const top = sortProducts(inventory, 'rating-desc');
  for (let i = 1; i < top.length; i++) assert.ok(top[i - 1].rating >= top[i].rating);
});

test('pipeline filters first, then sorts the remainder', () => {
  const out = queryProducts(inventory, { categories: ['Apparel'], minRating: 4 }, 'price-desc');
  assert.ok(out.every((p) => p.category === 'Apparel' && p.rating >= 4));
  for (let i = 1; i < out.length; i++) assert.ok(out[i - 1].price >= out[i].price);
});
